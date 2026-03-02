// E2E Test Helpers - HTTP client, auth, assertions
import { BASE_URL, TRPC_URL, AUTH_URL } from "./config";

// ============================================================
// Types
// ============================================================

interface TRPCResponse<T = unknown> {
  result?: { data: { json: T } };
  error?: {
    json?: {
      message: string;
      code: number;
      data?: { code: string; httpStatus: number; path: string };
    };
    message?: string;
    code?: number;
    data?: { code: string; httpStatus: number; path: string };
  };
}

interface TestResult {
  phase: string;
  test: string;
  status: "PASS" | "FAIL" | "SKIP";
  message?: string;
  duration?: number;
}

// ============================================================
// State - cookies per user session
// ============================================================

const sessionCookies: Record<string, string> = {};
const userIds: Record<string, string> = {};

export function setUserId(userKey: string, id: string) {
  userIds[userKey] = id;
}

export function getUserId(userKey: string): string {
  return userIds[userKey] || "";
}

export function getAllUserIds() {
  return { ...userIds };
}

// ============================================================
// Results tracking
// ============================================================

const results: TestResult[] = [];

export function addResult(result: TestResult) {
  results.push(result);
  const icon = result.status === "PASS" ? "✅" : result.status === "FAIL" ? "❌" : "⏭️";
  const dur = result.duration ? ` (${result.duration}ms)` : "";
  console.log(`  ${icon} [${result.phase}] ${result.test}${dur}${result.message ? " - " + result.message : ""}`);
}

export function printSummary() {
  const pass = results.filter((r) => r.status === "PASS").length;
  const fail = results.filter((r) => r.status === "FAIL").length;
  const skip = results.filter((r) => r.status === "SKIP").length;
  const total = results.length;

  console.log("\n" + "=".repeat(60));
  console.log("RESULTADO FINAL DO TESTE E2E");
  console.log("=".repeat(60));
  console.log(`Total:   ${total}`);
  console.log(`Passou:  ${pass} ✅`);
  console.log(`Falhou:  ${fail} ❌`);
  console.log(`Pulou:   ${skip} ⏭️`);
  console.log(`Taxa:    ${total > 0 ? ((pass / total) * 100).toFixed(1) : 0}%`);
  console.log("=".repeat(60));

  if (fail > 0) {
    console.log("\nFALHAS:");
    results
      .filter((r) => r.status === "FAIL")
      .forEach((r) => {
        console.log(`  ❌ [${r.phase}] ${r.test}: ${r.message}`);
      });
  }

  return { total, pass, fail, skip };
}

export function getResults() {
  return [...results];
}

// ============================================================
// HTTP helpers
// ============================================================

async function fetchWithCookies(
  url: string,
  options: RequestInit = {},
  userKey?: string
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (userKey && sessionCookies[userKey]) {
    headers["Cookie"] = sessionCookies[userKey];
  }

  return fetch(url, { ...options, headers, redirect: "manual" });
}

function saveCookies(response: Response, userKey: string) {
  const setCookieHeaders = response.headers.getSetCookie?.() || [];
  if (setCookieHeaders.length > 0) {
    const existing = sessionCookies[userKey] || "";
    const existingPairs = existing
      ? existing.split("; ").reduce(
          (acc, pair) => {
            const [key] = pair.split("=");
            if (key) acc[key] = pair;
            return acc;
          },
          {} as Record<string, string>
        )
      : {};

    for (const cookie of setCookieHeaders) {
      const mainPart = cookie.split(";")[0];
      if (mainPart) {
        const [key] = mainPart.split("=");
        if (key) existingPairs[key] = mainPart;
      }
    }

    sessionCookies[userKey] = Object.values(existingPairs).join("; ");
  }
}

// ============================================================
// NextAuth login - get session cookie
// ============================================================

export async function loginUser(
  email: string,
  password: string,
  userKey: string
): Promise<boolean> {
  try {
    // Step 1: Get CSRF token
    const csrfRes = await fetch(`${AUTH_URL}/csrf`);
    const csrfData = (await csrfRes.json()) as { csrfToken: string };
    const csrfToken = csrfData.csrfToken;

    // Save any cookies from CSRF request
    saveCookies(csrfRes, userKey);

    // Step 2: POST credentials to sign in
    const params = new URLSearchParams({
      email,
      password,
      csrfToken,
      callbackUrl: BASE_URL,
      json: "true",
    });

    const loginRes = await fetchWithCookies(
      `${AUTH_URL}/callback/credentials`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      },
      userKey
    );

    saveCookies(loginRes, userKey);

    // Follow redirect if needed
    if (loginRes.status === 302 || loginRes.status === 301) {
      const location = loginRes.headers.get("location");
      if (location) {
        const redirectUrl = location.startsWith("http") ? location : `${BASE_URL}${location}`;
        const redirectRes = await fetchWithCookies(redirectUrl, {}, userKey);
        saveCookies(redirectRes, userKey);
      }
    }

    // Step 3: Verify session
    const sessionRes = await fetchWithCookies(`${AUTH_URL}/session`, {}, userKey);
    saveCookies(sessionRes, userKey);
    const session = (await sessionRes.json()) as { user?: { id: string; email: string } };

    if (session?.user?.id) {
      userIds[userKey] = session.user.id;
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

// ============================================================
// tRPC call helpers
// ============================================================

export async function trpcQuery<T = unknown>(
  procedure: string,
  input?: unknown,
  userKey?: string
): Promise<{ data?: T; error?: string }> {
  try {
    // tRPC v11 with superjson: wrap input in {json: ...}
    const url = input !== undefined
      ? `${TRPC_URL}/${procedure}?input=${encodeURIComponent(JSON.stringify({ json: input }))}`
      : `${TRPC_URL}/${procedure}`;

    const res = await fetchWithCookies(url, { method: "GET" }, userKey);
    if (userKey) saveCookies(res, userKey);

    const raw = await res.text();
    try {
      const json = JSON.parse(raw) as TRPCResponse<T>;
      const err = json.error?.json || json.error;
      if (err) {
        return { error: (err as any).message || JSON.stringify(err) };
      }
      // superjson wraps in {json: ...}
      const data = json.result?.data;
      return { data: (data as any)?.json !== undefined ? (data as any).json : data as T };
    } catch {
      return { error: `Parse error: ${raw.substring(0, 200)}` };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

export async function trpcMutation<T = unknown>(
  procedure: string,
  input: unknown,
  userKey?: string
): Promise<{ data?: T; error?: string }> {
  try {
    // tRPC v11 with superjson: wrap input in {json: ...}
    const res = await fetchWithCookies(
      `${TRPC_URL}/${procedure}`,
      {
        method: "POST",
        body: JSON.stringify({ json: input }),
      },
      userKey
    );
    if (userKey) saveCookies(res, userKey);

    const raw = await res.text();
    try {
      const json = JSON.parse(raw) as TRPCResponse<T>;
      const err = json.error?.json || json.error;
      if (err) {
        return { error: (err as any).message || JSON.stringify(err) };
      }
      const data = json.result?.data;
      return { data: (data as any)?.json !== undefined ? (data as any).json : data as T };
    } catch {
      return { error: `Parse error: ${raw.substring(0, 200)}` };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

// ============================================================
// HTTP page check - verify page loads
// ============================================================

export async function checkPage(
  path: string,
  userKey?: string
): Promise<{ ok: boolean; status: number; error?: string }> {
  try {
    const res = await fetchWithCookies(`${BASE_URL}${path}`, {}, userKey);
    saveCookies(res, userKey ?? "default");
    return { ok: res.ok || res.status === 302 || res.status === 307, status: res.status };
  } catch (error) {
    return { ok: false, status: 0, error: error instanceof Error ? error.message : String(error) };
  }
}

// ============================================================
// Test runner helper
// ============================================================

export async function runTest(
  phase: string,
  testName: string,
  fn: () => Promise<{ pass: boolean; message?: string }>
): Promise<boolean> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    addResult({
      phase,
      test: testName,
      status: result.pass ? "PASS" : "FAIL",
      message: result.message,
      duration,
    });
    return result.pass;
  } catch (error) {
    const duration = Date.now() - start;
    const msg = error instanceof Error ? error.message : String(error);
    addResult({ phase, test: testName, status: "FAIL", message: msg, duration });
    return false;
  }
}

export function skipTest(phase: string, testName: string, reason: string) {
  addResult({ phase, test: testName, status: "SKIP", message: reason });
}

// ============================================================
// Wait helper
// ============================================================

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

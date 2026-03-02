// E2E Test Helpers - HTTP client, auth, assertions
import { execSync } from "child_process";
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

interface CurlResponse {
  status: number;
  headers: Record<string, string>;
  setCookies: string[];
  body: string;
}

// ============================================================
// State - cookies per user session
// ============================================================

const sessionCookies: Record<string, string> = {};
const cookieJarFiles: Record<string, string> = {};
const userIds: Record<string, string> = {};
let useCurl = false; // Will be set to true if native fetch fails

function getCookieJar(userKey: string): string {
  if (!cookieJarFiles[userKey]) {
    cookieJarFiles[userKey] = `/tmp/_e2e_jar_${userKey}_${Date.now()}`;
  }
  return cookieJarFiles[userKey];
}

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
// Network detection - check if native fetch works
// ============================================================

export async function detectNetwork(): Promise<void> {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(5000) });
    if (res.ok || res.status < 500) {
      useCurl = false;
      console.log("  Usando: Node.js fetch nativo");
      return;
    }
  } catch {
    // fetch failed, try curl
  }

  try {
    execSync(`curl -sf -o /dev/null -w "%{http_code}" "${BASE_URL}"`, { timeout: 10000 });
    useCurl = true;
    console.log("  Usando: curl (fallback - DNS bloqueado para Node.js)");
  } catch {
    useCurl = false;
    console.log("  AVISO: Nem fetch nem curl funcionam. Testes podem falhar.");
  }
}

// ============================================================
// curl-based HTTP client
// ============================================================

function curlRequest(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string,
): CurlResponse {
  const args: string[] = [
    "curl", "-sS",
    "-X", method,
    "--max-time", "30",
    "-D", "-",        // dump headers to stdout
    "-o", "/dev/stderr", // body to stderr
  ];

  for (const [k, v] of Object.entries(headers)) {
    args.push("-H", `${k}: ${v}`);
  }

  if (body) {
    args.push("-d", body);
  }

  // Don't follow redirects (we handle them manually)
  args.push("-L"); // Actually, DO follow for page checks
  args.push("--max-redirs", "0");
  args.push(url);

  try {
    // Execute curl, capture both stdout (headers) and stderr (body)
    const headerOutput = execSync(args.join(" "), {
      timeout: 35000,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Parse status and headers from header output
    return parseCurlHeaders(headerOutput);
  } catch (error: any) {
    // execSync throws on non-zero exit, but curl may return body in stderr
    if (error.stdout || error.stderr) {
      const headerStr = typeof error.stdout === "string" ? error.stdout : "";
      const bodyStr = typeof error.stderr === "string" ? error.stderr : "";
      const parsed = parseCurlHeaders(headerStr);
      if (bodyStr) parsed.body = bodyStr;
      return parsed;
    }
    return { status: 0, headers: {}, setCookies: [], body: "" };
  }
}

function parseCurlHeaders(raw: string): CurlResponse {
  const lines = raw.split("\r\n");
  let status = 0;
  const headers: Record<string, string> = {};
  const setCookies: string[] = [];

  for (const line of lines) {
    if (line.startsWith("HTTP/")) {
      const parts = line.split(" ");
      status = parseInt(parts[1] || "0", 10);
    } else if (line.includes(":")) {
      const idx = line.indexOf(":");
      const key = line.substring(0, idx).trim().toLowerCase();
      const val = line.substring(idx + 1).trim();
      if (key === "set-cookie") {
        setCookies.push(val);
      }
      headers[key] = val;
    }
  }

  return { status, headers, setCookies, body: "" };
}

// Simpler curl that returns body
function curlFetch(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string,
  userKey?: string,
): { status: number; body: string; setCookies: string[] } {
  const args: string[] = [
    "curl", "-sS",
    "-X", method,
    "--max-time", "30",
    "-w", "\\n__CURL_STATUS__%{http_code}__END__",
    "-D", "/dev/stderr",  // Headers to stderr
  ];

  // Use cookie jar if userKey provided
  if (userKey) {
    const jar = getCookieJar(userKey);
    args.push("-b", jar, "-c", jar);
    // Remove Cookie header since jar handles it
    delete headers["Cookie"];
  }

  for (const [k, v] of Object.entries(headers)) {
    args.push("-H", `${k}: ${v}`);
  }

  if (body) {
    args.push("-d", body);
  }

  args.push(url);

  // Build safe command string
  const cmd = args.map(a => {
    // Quote args that contain spaces or special chars
    if (a.includes(" ") || a.includes('"') || a.includes("'") || a.includes("&") || a.includes("?") || a.includes("{")) {
      return `'${a.replace(/'/g, "'\\''")}'`;
    }
    return a;
  }).join(" ");

  try {
    // stdout = body + status marker, stderr = headers
    const output = execSync(`${cmd} 2>/tmp/_curl_headers_$$`, {
      timeout: 35000,
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });

    // Read headers from temp file
    let headerPart = "";
    try {
      headerPart = execSync(`cat /tmp/_curl_headers_$$ 2>/dev/null; rm -f /tmp/_curl_headers_$$`, {
        encoding: "utf-8",
        timeout: 5000,
      });
    } catch {}

    // Extract status from end marker
    const statusMatch = output.match(/__CURL_STATUS__(\d+)__END__/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : 0;

    // Remove the status marker from body
    const bodyPart = output.replace(/\n?__CURL_STATUS__\d+__END__\s*$/, "").trim();

    // Extract Set-Cookie headers from stderr headers
    const setCookies: string[] = [];
    for (const line of headerPart.split(/\r?\n/)) {
      if (line.toLowerCase().startsWith("set-cookie:")) {
        setCookies.push(line.substring(11).trim());
      }
    }

    return { status, body: bodyPart, setCookies };
  } catch (error: any) {
    // execSync throws if curl exits non-zero - extract what we can
    const stdout = typeof error.stdout === "string" ? error.stdout : "";
    const stderr = typeof error.stderr === "string" ? error.stderr : "";

    const statusMatch = stdout.match(/__CURL_STATUS__(\d+)__END__/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : 0;
    const bodyPart = stdout.replace(/\n?__CURL_STATUS__\d+__END__\s*$/, "").trim();

    const setCookies: string[] = [];
    for (const line of stderr.split(/\r?\n/)) {
      if (line.toLowerCase().startsWith("set-cookie:")) {
        setCookies.push(line.substring(11).trim());
      }
    }

    return { status, body: bodyPart || stderr.substring(0, 500), setCookies };
  }
}

// ============================================================
// Unified HTTP helpers (fetch or curl)
// ============================================================

function saveCookiesFromArray(cookieHeaders: string[], userKey: string) {
  if (cookieHeaders.length === 0) return;

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

  for (const cookie of cookieHeaders) {
    const mainPart = cookie.split(";")[0];
    if (mainPart) {
      const [key] = mainPart.split("=");
      if (key) existingPairs[key] = mainPart;
    }
  }

  sessionCookies[userKey] = Object.values(existingPairs).join("; ");
}

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
  saveCookiesFromArray(setCookieHeaders, userKey);
}

// ============================================================
// NextAuth login - get session cookie
// ============================================================

export async function loginUser(
  email: string,
  password: string,
  userKey: string
): Promise<boolean> {
  if (useCurl) return loginUserCurl(email, password, userKey);

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

function loginUserCurl(email: string, password: string, userKey: string): boolean {
  try {
    const cookieJar = getCookieJar(userKey);

    // Step 1: Get CSRF token (with cookie jar)
    const csrfBody = execSync(
      `curl -sS --max-time 15 -c '${cookieJar}' '${AUTH_URL}/csrf'`,
      { encoding: "utf-8", timeout: 20000 }
    ).trim();

    let csrfToken = "";
    try {
      const csrfData = JSON.parse(csrfBody) as { csrfToken: string };
      csrfToken = csrfData.csrfToken;
    } catch {
      return false;
    }

    // Step 2: POST credentials (use cookie jar, capture set-cookie headers)
    const params = new URLSearchParams({
      email, password, csrfToken,
      callbackUrl: BASE_URL,
      json: "true",
    });

    // Use -b/-c for cookie jar and -D to capture response headers
    execSync(
      `curl -sS --max-time 15 -b '${cookieJar}' -c '${cookieJar}' ` +
      `-X POST -H 'Content-Type: application/x-www-form-urlencoded' ` +
      `-d '${params.toString()}' ` +
      `-o /dev/null ` +
      `'${AUTH_URL}/callback/credentials'`,
      { encoding: "utf-8", timeout: 20000 }
    );

    // Step 3: Verify session using cookie jar
    const sessionBody = execSync(
      `curl -sS --max-time 15 -b '${cookieJar}' '${AUTH_URL}/session'`,
      { encoding: "utf-8", timeout: 20000 }
    ).trim();

    // Read cookie jar and extract cookies for our session state
    try {
      const jarContent = execSync(`cat '${cookieJar}' 2>/dev/null`, { encoding: "utf-8" });
      const cookieParts: string[] = [];
      for (const line of jarContent.split("\n")) {
        if (line.startsWith("#") || !line.trim()) continue;
        const parts = line.split("\t");
        if (parts.length >= 7) {
          cookieParts.push(`${parts[5]}=${parts[6]}`);
        }
      }
      if (cookieParts.length > 0) {
        sessionCookies[userKey] = cookieParts.join("; ");
      }
    } catch {}

    try {
      const session = JSON.parse(sessionBody) as { user?: { id: string; email: string } };
      if (session?.user?.id) {
        userIds[userKey] = session.user.id;
        return true;
      }
    } catch {}

    return false;
  } catch {
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
  const url = input !== undefined
    ? `${TRPC_URL}/${procedure}?input=${encodeURIComponent(JSON.stringify({ json: input }))}`
    : `${TRPC_URL}/${procedure}`;

  if (useCurl) {
    return trpcCallCurl<T>(url, "GET", undefined, userKey);
  }

  try {
    const res = await fetchWithCookies(url, { method: "GET" }, userKey);
    if (userKey) saveCookies(res, userKey);

    const raw = await res.text();
    return parseTrpcResponse<T>(raw);
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

export async function trpcMutation<T = unknown>(
  procedure: string,
  input: unknown,
  userKey?: string
): Promise<{ data?: T; error?: string }> {
  const url = `${TRPC_URL}/${procedure}`;
  const body = JSON.stringify({ json: input });

  if (useCurl) {
    return trpcCallCurl<T>(url, "POST", body, userKey);
  }

  try {
    const res = await fetchWithCookies(
      url,
      { method: "POST", body },
      userKey
    );
    if (userKey) saveCookies(res, userKey);

    const raw = await res.text();
    return parseTrpcResponse<T>(raw);
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

function trpcCallCurl<T>(
  url: string,
  method: string,
  body?: string,
  userKey?: string
): { data?: T; error?: string } {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const res = curlFetch(url, method, headers, body, userKey);

    return parseTrpcResponse<T>(res.body);
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

function parseTrpcResponse<T>(raw: string): { data?: T; error?: string } {
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
}

// ============================================================
// HTTP page check - verify page loads
// ============================================================

export async function checkPage(
  path: string,
  userKey?: string
): Promise<{ ok: boolean; status: number; error?: string }> {
  if (useCurl) {
    try {
      const res = curlFetch(`${BASE_URL}${path}`, "GET", {}, undefined, userKey ?? "default");
      const ok = (res.status >= 200 && res.status < 400) || res.status === 302 || res.status === 307;
      return { ok, status: res.status };
    } catch (error) {
      return { ok: false, status: 0, error: error instanceof Error ? error.message : String(error) };
    }
  }

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

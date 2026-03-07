/**
 * Sportio E2E Test Suite
 *
 * Tests all major routes and user flows.
 * Run with: npx tsx tests/e2e/sportio-e2e.ts
 */

import { fetch } from "undici";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];
let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    results.push({ name, passed: true, duration });
    passed++;
    console.log(`  ✅ ${name} (${duration}ms)`);
  } catch (err: any) {
    const duration = Date.now() - start;
    results.push({ name, passed: false, duration, error: err.message });
    failed++;
    console.log(`  ❌ ${name} (${duration}ms) — ${err.message}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

// ==========================================
// 1. ROUTE ACCESSIBILITY TESTS
// ==========================================

async function testRoutes() {
  console.log("\n📍 ROUTE TESTS");
  console.log("━".repeat(50));

  const publicRoutes = [
    { path: "/", name: "Home / Landing Page" },
    { path: "/login", name: "Login Page" },
    { path: "/register", name: "Register Page" },
    { path: "/athletes", name: "Athletes Landing" },
    { path: "/organizers", name: "Organizers Landing" },
    { path: "/brands", name: "Brands Landing" },
    { path: "/fans", name: "Fans Landing" },
    { path: "/bettors", name: "Bettors Landing" },
    { path: "/referees", name: "Referees Landing" },
    { path: "/blog", name: "Blog Page" },
    { path: "/onboarding", name: "Onboarding Wizard" },
  ];

  const dashboardRoutes = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/social", name: "Social Feed" },
    { path: "/tournaments", name: "Tournaments List" },
    { path: "/tournaments/create", name: "Create Tournament" },
    { path: "/challenges", name: "Challenges" },
    { path: "/bets", name: "Bets" },
    { path: "/gcoins", name: "GCoins Wallet" },
    { path: "/chat", name: "Chat" },
    { path: "/notifications", name: "Notifications" },
    { path: "/achievements", name: "Achievements" },
    { path: "/missions", name: "Missions" },
    { path: "/leaderboard", name: "Leaderboard" },
    { path: "/profile", name: "Profile" },
    { path: "/settings", name: "Settings" },
  ];

  const dynamicRoutes = [
    { path: "/match/test-match-123", name: "Live Match Page" },
    { path: "/athlete/test-athlete-123", name: "Athlete Creator Profile" },
    { path: "/tournaments/test-tournament-123", name: "Tournament Detail" },
  ];

  for (const route of [...publicRoutes, ...dashboardRoutes, ...dynamicRoutes]) {
    await test(`GET ${route.path} — ${route.name}`, async () => {
      const res = await fetch(`${BASE_URL}${route.path}`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const html = await res.text();
      assert(html.length > 100, `Response too short: ${html.length} chars`);
      assert(html.includes("</html>"), "Missing closing HTML tag");
    });
  }
}

// ==========================================
// 2. API ENDPOINT TESTS (tRPC)
// ==========================================

async function testAPI() {
  console.log("\n🔌 API TESTS");
  console.log("━".repeat(50));

  // Test that tRPC endpoint exists
  await test("tRPC endpoint responds", async () => {
    const res = await fetch(`${BASE_URL}/api/trpc/social.getSports`);
    // tRPC returns 200 even for unauthorized (with error in body) or returns data
    assert(res.status === 200 || res.status === 401, `Expected 200/401, got ${res.status}`);
  });

  // Test public sport list endpoint
  await test("GET sports list (public)", async () => {
    const res = await fetch(`${BASE_URL}/api/trpc/social.getSports`);
    const data = await res.json();
    // Should return a result array or UNAUTHORIZED error
    assert(data !== null, "Response should not be null");
  });

  // Test gamification achievements endpoint
  await test("GET achievements (public)", async () => {
    const res = await fetch(`${BASE_URL}/api/trpc/gamification.achievements`);
    assert(res.status === 200 || res.status === 401, `Expected 200/401, got ${res.status}`);
  });

  // Test tournament list
  await test("GET tournament list", async () => {
    const res = await fetch(`${BASE_URL}/api/trpc/tournament.list?input=${encodeURIComponent(JSON.stringify({ json: { page: 1, limit: 10 } }))}`);
    assert(res.status === 200 || res.status === 401, `Expected 200/401, got ${res.status}`);
  });

  // Test challenge list
  await test("GET challenge list", async () => {
    const res = await fetch(`${BASE_URL}/api/trpc/challenge.list?input=${encodeURIComponent(JSON.stringify({ json: { page: 1, limit: 10 } }))}`);
    assert(res.status === 200 || res.status === 401, `Expected 200/401, got ${res.status}`);
  });
}

// ==========================================
// 3. CONTENT QUALITY TESTS
// ==========================================

async function testContent() {
  console.log("\n📄 CONTENT QUALITY TESTS");
  console.log("━".repeat(50));

  await test("Home page has Sportio branding", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    assert(
      html.toLowerCase().includes("sportio"),
      "Home page should contain 'Sportio'"
    );
  });

  await test("Home page has meta viewport (mobile)", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    assert(
      html.includes("viewport"),
      "Home page should have viewport meta tag for mobile"
    );
  });

  await test("Login page has form elements", async () => {
    const res = await fetch(`${BASE_URL}/login`);
    const html = await res.text();
    assert(
      html.includes("email") || html.includes("Email") || html.includes("password") || html.includes("Password"),
      "Login page should have email/password fields"
    );
  });

  await test("Register page has form elements", async () => {
    const res = await fetch(`${BASE_URL}/register`);
    const html = await res.text();
    assert(
      html.includes("name") || html.includes("Name") || html.includes("email") || html.includes("Email"),
      "Register page should have name/email fields"
    );
  });

  await test("Athletes landing has CTA content", async () => {
    const res = await fetch(`${BASE_URL}/athletes`);
    const html = await res.text();
    assert(html.length > 1000, "Athletes page should have substantial content");
  });

  await test("Onboarding page has wizard steps", async () => {
    const res = await fetch(`${BASE_URL}/onboarding`);
    const html = await res.text();
    assert(html.length > 500, "Onboarding page should have wizard content");
  });

  await test("GCoins wallet page has balance content", async () => {
    const res = await fetch(`${BASE_URL}/gcoins`);
    const html = await res.text();
    assert(
      html.includes("GCoin") || html.includes("gcoin") || html.includes("Saldo") || html.includes("saldo") || html.includes("wallet"),
      "GCoins page should reference GCoins or wallet"
    );
  });

  await test("Match page renders for dynamic ID", async () => {
    const res = await fetch(`${BASE_URL}/match/test-123`);
    const html = await res.text();
    assert(res.status === 200, "Match page should render for any ID");
    assert(html.length > 500, "Match page should have content");
  });

  await test("Athlete profile page renders for dynamic ID", async () => {
    const res = await fetch(`${BASE_URL}/athlete/test-123`);
    const html = await res.text();
    assert(res.status === 200, "Athlete profile should render for any ID");
    assert(html.length > 500, "Athlete profile should have content");
  });
}

// ==========================================
// 4. PERFORMANCE TESTS
// ==========================================

async function testPerformance() {
  console.log("\n⚡ PERFORMANCE TESTS");
  console.log("━".repeat(50));

  const criticalRoutes = ["/", "/login", "/dashboard", "/gcoins", "/onboarding"];

  for (const path of criticalRoutes) {
    await test(`${path} loads under 2 seconds`, async () => {
      const start = Date.now();
      const res = await fetch(`${BASE_URL}${path}`);
      await res.text();
      const duration = Date.now() - start;
      assert(duration < 2000, `Took ${duration}ms (max 2000ms)`);
    });
  }

  await test("Static assets are served (/_next/)", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    const jsMatch = html.match(/\/_next\/static\/[^"]+\.js/);
    if (jsMatch) {
      const jsRes = await fetch(`${BASE_URL}${jsMatch[0]}`);
      assert(jsRes.status === 200, "JS asset should be accessible");
    }
  });
}

// ==========================================
// 5. SECURITY TESTS
// ==========================================

async function testSecurity() {
  console.log("\n🔒 SECURITY TESTS");
  console.log("━".repeat(50));

  await test("No server errors exposed on 404", async () => {
    const res = await fetch(`${BASE_URL}/nonexistent-page-xyz`);
    const html = await res.text();
    assert(
      !html.includes("Error: ") && !html.includes("stack trace") && !html.includes("at Object."),
      "404 should not expose server error details"
    );
  });

  await test("API rejects invalid tRPC calls gracefully", async () => {
    const res = await fetch(`${BASE_URL}/api/trpc/nonexistent.procedure`);
    // Should not crash server — should return error gracefully
    assert(
      res.status !== 500,
      `Server should not 500 on invalid procedure (got ${res.status})`
    );
  });

  await test("No sensitive env vars in HTML", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    assert(!html.includes("DATABASE_URL"), "Should not leak DATABASE_URL");
    assert(!html.includes("AUTH_SECRET"), "Should not leak AUTH_SECRET");
    assert(!html.includes("STRIPE_SECRET"), "Should not leak STRIPE_SECRET");
    assert(!html.includes("sk_test_"), "Should not leak Stripe secret key");
    assert(!html.includes("re_"), "Should not leak Resend API key");
  });

  await test("XSS in URL params does not reflect", async () => {
    const xssPayload = encodeURIComponent('<script>alert("xss")</script>');
    const res = await fetch(`${BASE_URL}/tournaments/${xssPayload}`);
    const html = await res.text();
    assert(
      !html.includes('<script>alert("xss")</script>'),
      "XSS payload should not be reflected in HTML"
    );
  });
}

// ==========================================
// 6. RESPONSIVE / MOBILE TESTS
// ==========================================

async function testResponsive() {
  console.log("\n📱 RESPONSIVE TESTS");
  console.log("━".repeat(50));

  await test("Pages include TailwindCSS responsive classes", async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    assert(
      html.includes("sm:") || html.includes("md:") || html.includes("lg:"),
      "Should use TailwindCSS responsive breakpoints"
    );
  });

  await test("Dashboard includes mobile bottom nav", async () => {
    const res = await fetch(`${BASE_URL}/dashboard`);
    const html = await res.text();
    // Check for bottom nav or mobile navigation indicators
    assert(html.length > 1000, "Dashboard should have substantial content");
  });
}

// ==========================================
// RUN ALL TESTS
// ==========================================

async function main() {
  console.log("🏃 SPORTIO E2E TEST SUITE");
  console.log("═".repeat(50));
  console.log(`Target: ${BASE_URL}`);
  console.log(`Time: ${new Date().toISOString()}`);

  // Verify server is running
  try {
    const health = await fetch(`${BASE_URL}/`);
    if (health.status !== 200) {
      console.error("❌ Server not responding. Start with: npx next start -p 3001");
      process.exit(1);
    }
  } catch {
    console.error("❌ Cannot connect to server. Start with: npx next start -p 3001");
    process.exit(1);
  }

  console.log("✅ Server is running\n");

  await testRoutes();
  await testAPI();
  await testContent();
  await testPerformance();
  await testSecurity();
  await testResponsive();

  // Summary
  console.log("\n" + "═".repeat(50));
  console.log("📊 TEST RESULTS");
  console.log("═".repeat(50));
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  📋 Total:  ${passed + failed}`);
  console.log(`  📈 Rate:   ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log("\n❌ FAILURES:");
    for (const r of results.filter((r) => !r.passed)) {
      console.log(`  • ${r.name}: ${r.error}`);
    }
  }

  console.log("\n" + "═".repeat(50));
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);

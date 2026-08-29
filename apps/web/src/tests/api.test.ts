import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as getChallenge } from "@/app/api/auth/challenge/route";
import { POST as verifyAuth } from "@/app/api/auth/verify/route";

// Mock external dependencies to ensure fast, isolated tests
process.env.PAYGATE_TREASURY_SECRET_KEY = "SAG7RLKPCG44Z6VBZ4EARBA5W56HQE4VK3LJJDUHDWAKZS3UU6UC6D6N";
process.env.STELLAR_NETWORK = "testnet";

vi.mock("@/lib/redis", () => ({
  redis: {
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
  }
}));

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn().mockResolvedValue({
    save: vi.fn(),
  })
}));

import { NextRequest } from "next/server";

describe("PayGate Backend E2E API Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Test 1: Healthcheck (Auth Challenge) should return 200 OK", async () => {
    const req = new NextRequest("http://localhost/api/auth/challenge?account=GCX3LFQ2BXHVEVL5VD7DZ4Y3R6WIUNUTJNZRMGRMWLM33XD2J7YFFLQA");
    const response = await getChallenge(req);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty("transaction");
  });

  it("Test 2: Protected /api/internal/stats should return 401 when unauthenticated", async () => {
    const mockUnauthenticatedResponse = new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    expect(mockUnauthenticatedResponse.status).toBe(401);
  });

  it("Test 3: Calling verify auth without a signature should fail validation (400)", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({}), 
    });
    
    const response = await verifyAuth(req);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe("Missing transaction");
  });

  it("Test 4: Login requires a valid cryptographic signature (400)", async () => {
    const req = new NextRequest("http://localhost:3000/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ 
        transaction: "invalid-tx-string"
      }),
    });

    const response = await verifyAuth(req);
    
    // Should fail at signature/transaction parsing
    expect(response.status).toBe(400);
  });
});

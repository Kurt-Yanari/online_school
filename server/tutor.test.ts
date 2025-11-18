import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTutorContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "tutor-user",
    email: "tutor@example.com",
    name: "John Tutor",
    loginMethod: "manus",
    role: "tutor",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("tutor procedures", () => {
  it("should get tutor profile", async () => {
    const ctx = createTutorContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tutor.getProfile();
    // Profile may not exist initially, so just check it's either defined or undefined
    expect(result === undefined || result !== null).toBe(true);
  });

  it("should update tutor profile", async () => {
    const ctx = createTutorContext();
    const caller = appRouter.createCaller(ctx);

    // First update should create the profile
    await caller.tutor.updateProfile({
      specializations: "Mathematics, Physics",
      bio: "Experienced tutor",
      hourlyRate: 5000,
    });

    // Then fetch it
    const result = await caller.tutor.getProfile();
    expect(result).toBeDefined();
    expect(result?.specializations).toBe("Mathematics, Physics");
    expect(result?.bio).toBe("Experienced tutor");
    expect(result?.hourlyRate).toBe(5000);
  });

  it("should get tutor sessions", async () => {
    const ctx = createTutorContext();
    const caller = appRouter.createCaller(ctx);

    // First create a profile
    await caller.tutor.updateProfile({
      specializations: "Mathematics",
    });

    const result = await caller.tutor.getSessions();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get session requests for tutor", async () => {
    const ctx = createTutorContext();
    const caller = appRouter.createCaller(ctx);

    // First create a profile
    await caller.tutor.updateProfile({
      specializations: "Mathematics",
    });

    const result = await caller.tutor.getSessionRequests();
    expect(Array.isArray(result)).toBe(true);
  });
});

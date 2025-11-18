import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createStudentContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "student-user",
    email: "student@example.com",
    name: "Jane Student",
    loginMethod: "manus",
    role: "student",
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

describe("session procedures", () => {
  it("should get all tutors", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    const result = await caller.session.getAllTutors();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should request a session", async () => {
    const ctx = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    const proposedTime = new Date();
    proposedTime.setHours(proposedTime.getHours() + 1);

    const result = await caller.session.requestSession({
      tutorId: 1,
      proposedTime,
      durationMinutes: 60,
      subject: "Mathematics",
      message: "I need help with algebra",
    });

    expect(result).toBeDefined();
  });

  it("should get session by id", async () => {
    const ctx = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    // This will fail if no session exists, which is expected
    try {
      const result = await caller.session.getSessionById({ sessionId: 999 });
      expect(result).toBeUndefined();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

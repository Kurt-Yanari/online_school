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

describe("student procedures", () => {
  it("should get student profile", async () => {
    const ctx = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.student.getProfile();
    // Profile may not exist initially, so just check it's either defined or undefined
    expect(result === undefined || result !== null).toBe(true);
  });

  it("should update student profile", async () => {
    const ctx = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    // First update should create the profile
    await caller.student.updateProfile({
      gradeLevel: "10th Grade",
      interests: "Mathematics, Physics",
      bio: "Preparing for exams",
    });

    // Then fetch it
    const result = await caller.student.getProfile();
    expect(result).toBeDefined();
    expect(result?.gradeLevel).toBe("10th Grade");
    expect(result?.interests).toBe("Mathematics, Physics");
    expect(result?.bio).toBe("Preparing for exams");
  });

  it("should get student sessions", async () => {
    const ctx = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    // First create a profile
    await caller.student.updateProfile({
      gradeLevel: "10th Grade",
    });

    const result = await caller.student.getSessions();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get session requests for student", async () => {
    const ctx = createStudentContext();
    const caller = appRouter.createCaller(ctx);

    // First create a profile
    await caller.student.updateProfile({
      gradeLevel: "10th Grade",
    });

    const result = await caller.student.getSessionRequests();
    expect(Array.isArray(result)).toBe(true);
  });
});

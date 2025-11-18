import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * Tutor profile procedures
   */
  tutor: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await db.getTutorProfile(ctx.user.id);
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        specializations: z.string().optional(),
        bio: z.string().optional(),
        hourlyRate: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertTutorProfile(ctx.user.id, input);
        return await db.getTutorProfile(ctx.user.id);
      }),
    getSessions: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getTutorProfile(ctx.user.id);
      if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Tutor profile not found" });
      return await db.getSessionsByTutor(profile.userId);
    }),
    getSessionRequests: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getTutorProfile(ctx.user.id);
      if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Tutor profile not found" });
      return await db.getSessionRequestsForTutor(profile.userId);
    }),
    acceptSessionRequest: protectedProcedure
      .input(z.object({ requestId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const request = await db.getSessionRequestById(input.requestId);
        if (!request) throw new TRPCError({ code: "NOT_FOUND" });
        
        const profile = await db.getTutorProfile(ctx.user.id);
        if (!profile || profile.userId !== request.tutorId) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        // Create session from request
        await db.createSession({
          tutorId: request.tutorId,
          studentId: request.studentId,
          scheduledTime: request.proposedTime,
          durationMinutes: request.durationMinutes,
          subject: request.subject,
          status: "scheduled",
        });

        // Update request status
        await db.updateSessionRequest(input.requestId, { status: "accepted" });
        return { success: true };
      }),
    declineSessionRequest: protectedProcedure
      .input(z.object({ requestId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const request = await db.getSessionRequestById(input.requestId);
        if (!request) throw new TRPCError({ code: "NOT_FOUND" });
        
        const profile = await db.getTutorProfile(ctx.user.id);
        if (!profile || profile.userId !== request.tutorId) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.updateSessionRequest(input.requestId, { status: "declined" });
        return { success: true };
      }),
  }),

  /**
   * Student profile procedures
   */
  student: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await db.getStudentProfile(ctx.user.id);
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        gradeLevel: z.string().optional(),
        interests: z.string().optional(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertStudentProfile(ctx.user.id, input);
        return await db.getStudentProfile(ctx.user.id);
      }),
    getSessions: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getStudentProfile(ctx.user.id);
      if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Student profile not found" });
      return await db.getSessionsByStudent(profile.userId);
    }),
    getSessionRequests: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getStudentProfile(ctx.user.id);
      if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Student profile not found" });
      return await db.getSessionRequestsForStudent(profile.userId);
    }),
  }),

  /**
   * Session procedures
   */
  session: router({
    requestSession: protectedProcedure
      .input(z.object({
        tutorId: z.number(),
        proposedTime: z.date(),
        durationMinutes: z.number().default(60),
        subject: z.string(),
        message: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const studentProfile = await db.getStudentProfile(ctx.user.id);
        if (!studentProfile) throw new TRPCError({ code: "NOT_FOUND", message: "Student profile not found" });

        return await db.createSessionRequest({
          studentId: ctx.user.id,
          tutorId: input.tutorId,
          proposedTime: input.proposedTime,
          durationMinutes: input.durationMinutes,
          subject: input.subject,
          message: input.message,
          status: "pending",
        });
      }),
    getAllTutors: publicProcedure.query(async () => {
      return await db.getAllTutors();
    }),
    getSessionById: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ ctx, input }) => {
        const session = await db.getSessionById(input.sessionId);
        if (!session) throw new TRPCError({ code: "NOT_FOUND" });
        
        // Check if user is tutor or student in this session
        if (session.tutorId !== ctx.user.id && session.studentId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        
        return session;
      }),
    cancelSession: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const session = await db.getSessionById(input.sessionId);
        if (!session) throw new TRPCError({ code: "NOT_FOUND" });
        
        if (session.tutorId !== ctx.user.id && session.studentId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        await db.updateSession(input.sessionId, { status: "cancelled" });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

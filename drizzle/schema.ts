import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "tutor", "student"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tutor profile extending the user table.
 * Stores tutor-specific information like specializations and hourly rate.
 */
export const tutorProfiles = mysqlTable("tutor_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  specializations: text("specializations"), // JSON array of subjects
  bio: text("bio"),
  hourlyRate: int("hourly_rate").default(0), // in cents to avoid decimals
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalSessions: int("total_sessions").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TutorProfile = typeof tutorProfiles.$inferSelect;
export type InsertTutorProfile = typeof tutorProfiles.$inferInsert;

/**
 * Student profile extending the user table.
 * Stores student-specific information like grade level and interests.
 */
export const studentProfiles = mysqlTable("student_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  gradeLevel: varchar("grade_level", { length: 50 }),
  interests: text("interests"), // JSON array of subjects
  bio: text("bio"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertStudentProfile = typeof studentProfiles.$inferInsert;

/**
 * Sessions/Lessons table.
 * Represents scheduled sessions between tutors and students.
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  tutorId: int("tutor_id").notNull(),
  studentId: int("student_id").notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(), // UTC timestamp
  durationMinutes: int("duration_minutes").default(60),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "no_show"]).default("scheduled"),
  subject: varchar("subject", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Session requests table.
 * Represents student requests to book sessions with tutors.
 */
export const sessionRequests = mysqlTable("session_requests", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("student_id").notNull(),
  tutorId: int("tutor_id").notNull(),
  proposedTime: timestamp("proposed_time").notNull(),
  durationMinutes: int("duration_minutes").default(60),
  subject: varchar("subject", { length: 255 }),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "accepted", "declined", "cancelled"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SessionRequest = typeof sessionRequests.$inferSelect;
export type InsertSessionRequest = typeof sessionRequests.$inferInsert;
import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, tutorProfiles, studentProfiles, sessions, sessionRequests, InsertTutorProfile, InsertStudentProfile, InsertSession, InsertSessionRequest } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Tutor profile queries
 */
export async function getTutorProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tutorProfiles).where(eq(tutorProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertTutorProfile(userId: number, data: Partial<InsertTutorProfile>) {
  const db = await getDb();
  if (!db) return;
  const existing = await getTutorProfile(userId);
  if (existing) {
    await db.update(tutorProfiles).set(data).where(eq(tutorProfiles.userId, userId));
  } else {
    await db.insert(tutorProfiles).values({ userId, ...data });
  }
}

export async function getAllTutors() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tutorProfiles);
}

/**
 * Student profile queries
 */
export async function getStudentProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertStudentProfile(userId: number, data: Partial<InsertStudentProfile>) {
  const db = await getDb();
  if (!db) return;
  const existing = await getStudentProfile(userId);
  if (existing) {
    await db.update(studentProfiles).set(data).where(eq(studentProfiles.userId, userId));
  } else {
    await db.insert(studentProfiles).values({ userId, ...data });
  }
}

/**
 * Session queries
 */
export async function createSession(data: InsertSession) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(sessions).values(data);
  return result;
}

export async function getSessionsByTutor(tutorId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(sessions).where(eq(sessions.tutorId, tutorId));
}

export async function getSessionsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(sessions).where(eq(sessions.studentId, studentId));
}

export async function getSessionById(sessionId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSession(sessionId: number, data: Partial<InsertSession>) {
  const db = await getDb();
  if (!db) return;
  await db.update(sessions).set(data).where(eq(sessions.id, sessionId));
}

/**
 * Session request queries
 */
export async function createSessionRequest(data: InsertSessionRequest) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(sessionRequests).values(data);
}

export async function getSessionRequestsForTutor(tutorId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(sessionRequests).where(eq(sessionRequests.tutorId, tutorId));
}

export async function getSessionRequestsForStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(sessionRequests).where(eq(sessionRequests.studentId, studentId));
}

export async function getSessionRequestById(requestId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sessionRequests).where(eq(sessionRequests.id, requestId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSessionRequest(requestId: number, data: Partial<InsertSessionRequest>) {
  const db = await getDb();
  if (!db) return;
  await db.update(sessionRequests).set(data).where(eq(sessionRequests.id, requestId));
}

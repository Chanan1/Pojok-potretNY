import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.JWT_SECRET || "pojok_potret_super_secret_key_2024_for_dev_only";
const key = new TextEncoder().encode(SECRET_KEY);

export interface SessionPayload {
  userId: string;
  username: string;
  name: string;
  avatar: string | null;
}

// ─── BCRYPT ─────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── SESSION (JWT COOKIE) ───────────────────────────────
export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt(payload);

  const cookieStore = await cookies();
  cookieStore.set("pojok-session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("pojok-session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set("pojok-session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    sameSite: "lax",
    path: "/",
  });
}

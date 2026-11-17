import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const EDITOR_COOKIE = "editor_unlocked";
export const EDITOR_SESSION_SECONDS = 60 * 60 * 12;

export function getExpectedEditorPassword(): string | undefined {
  return process.env.EDITOR_PASSWORD;
}

export function matchesEditorPassword(value: unknown): boolean {
  const expected = getExpectedEditorPassword();
  if (!expected || typeof value !== "string") return false;
  const digest = (text: string) => createHash("sha256").update(text).digest();
  return timingSafeEqual(digest(value), digest(expected));
}

export function createEditorSession(): string {
  const sessionSecret = getExpectedEditorPassword();
  if (!sessionSecret) throw new Error("EDITOR_PASSWORD is not configured");
  const payload = `${Date.now() + EDITOR_SESSION_SECONDS * 1000}.${randomBytes(16).toString("hex")}`;
  return `${payload}.${createHmac("sha256", sessionSecret).update(payload).digest("hex")}`;
}

export async function isEditorUnlocked(): Promise<boolean> {
  const sessionSecret = getExpectedEditorPassword();
  if (!sessionSecret) return false;
  const token = (await cookies()).get(EDITOR_COOKIE)?.value;
  if (!token) return false;
  const [expires, nonce, signature, extra] = token.split(".");
  if (extra !== undefined || !/^\d+$/.test(expires) || !/^[a-f0-9]{32}$/.test(nonce ?? "") || !/^[a-f0-9]{64}$/.test(signature ?? "")) return false;
  if (Number(expires) <= Date.now()) return false;
  const expected = createHmac("sha256", sessionSecret).update(`${expires}.${nonce}`).digest();
  return timingSafeEqual(Buffer.from(signature, "hex"), expected);
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

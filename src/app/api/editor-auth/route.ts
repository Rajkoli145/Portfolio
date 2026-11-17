import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { EDITOR_COOKIE, EDITOR_SESSION_SECONDS, createEditorSession, getExpectedEditorPassword, isEditorUnlocked, isSameOrigin, matchesEditorPassword } from "@/lib/editor-auth";

export async function GET() {
  return NextResponse.json({ unlocked: process.env.NODE_ENV === "development" && await isEditorUnlocked() });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development" || !isSameOrigin(request)) {
    return NextResponse.json({ error: "Editor authentication is only available locally." }, { status: 403 });
  }
  if (!getExpectedEditorPassword()) {
    return NextResponse.json({ error: "Set EDITOR_PASSWORD in .env.local and restart the development server." }, { status: 503 });
  }
  try {
    const { password } = await request.json();
    if (!matchesEditorPassword(password)) {
      return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 });
    }
    (await cookies()).set(EDITOR_COOKIE, createEditorSession(), {
      maxAge: EDITOR_SESSION_SECONDS,
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid authentication request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  (await cookies()).delete(EDITOR_COOKIE);
  return NextResponse.json({ success: true });
}

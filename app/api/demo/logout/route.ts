import { NextResponse } from "next/server";

const COOKIE_NAME = "wasteaway_user_id";

export async function POST() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return response;
}

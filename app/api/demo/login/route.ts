import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "wasteaway_user_id";

export async function POST() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: "demo@wasteaway.local",
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Demo user does not exist. Run the Prisma seed command first.",
        },
        {
          status: 404,
        },
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set(COOKIE_NAME, user.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Demo login error:", error);

    return NextResponse.json(
      {
        error: "Unable to log in.",
      },
      {
        status: 500,
      },
    );
  }
}

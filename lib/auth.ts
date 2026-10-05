import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "wasteaway_user_id";

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();

  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUser() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

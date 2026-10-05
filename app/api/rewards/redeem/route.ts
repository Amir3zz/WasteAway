import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const rewardId = typeof body.rewardId === "string" ? body.rewardId : "";

    if (!rewardId) {
      return NextResponse.json(
        {
          error: "Reward ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const reward = await prisma.reward.findFirst({
      where: {
        id: rewardId,
        active: true,
      },
    });

    if (!reward) {
      return NextResponse.json(
        {
          error: "Reward not found.",
        },
        {
          status: 404,
        },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      /*
       * Only deduct points when the user has enough.
       * updateMany makes the condition atomic.
       */
      const updated = await tx.user.updateMany({
        where: {
          id: userId,
          points: {
            gte: reward.costPoints,
          },
        },

        data: {
          points: {
            decrement: reward.costPoints,
          },
        },
      });

      if (updated.count === 0) {
        return null;
      }

      const redemption = await tx.redemption.create({
        data: {
          userId,
          rewardId: reward.id,
          pointsSpent: reward.costPoints,
        },
      });

      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          points: true,
        },
      });

      return {
        redemptionId: redemption.id,
        remainingPoints: user?.points ?? 0,
      };
    });

    if (!result) {
      return NextResponse.json(
        {
          error: "You do not have enough points for this reward.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json({
      success: true,
      redemptionId: result.redemptionId,
      remainingPoints: result.remainingPoints,
      reward: {
        id: reward.id,
        title: reward.title,
        partnerName: reward.partnerName,
        costPoints: reward.costPoints,
      },
    });
  } catch (error) {
    console.error("Reward redemption error:", error);

    return NextResponse.json(
      {
        error: "Unable to redeem reward.",
      },
      {
        status: 500,
      },
    );
  }
}

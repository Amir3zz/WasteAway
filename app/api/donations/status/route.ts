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

    const donationId =
      typeof body.donationId === "string" ? body.donationId : "";

    if (!donationId) {
      return NextResponse.json(
        {
          error: "Donation ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const donation = await prisma.donation.findFirst({
      where: {
        id: donationId,
        userId,
      },
    });

    if (!donation) {
      return NextResponse.json(
        {
          error: "Donation not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * STEP 1:
     * Pending Drop-off -> Verified
     */
    if (donation.status === "PENDING_DROPOFF") {
      const updated = await prisma.donation.updateMany({
        where: {
          id: donationId,
          userId,
          status: "PENDING_DROPOFF",
        },
        data: {
          status: "VERIFIED",
        },
      });

      if (updated.count === 0) {
        return NextResponse.json(
          {
            error: "Donation status changed already.",
          },
          {
            status: 409,
          },
        );
      }

      return NextResponse.json({
        success: true,
        status: "VERIFIED",
      });
    }

    /*
     * STEP 2:
     * Verified -> Points Awarded
     *
     * The donation and user balance are updated
     * inside one transaction.
     */
    if (donation.status === "VERIFIED") {
      const result = await prisma.$transaction(async (tx) => {
        const claimed = await tx.donation.updateMany({
          where: {
            id: donationId,
            userId,
            status: "VERIFIED",
          },
          data: {
            status: "POINTS_AWARDED",
          },
        });

        if (claimed.count === 0) {
          return null;
        }

        const updatedUser = await tx.user.update({
          where: {
            id: userId,
          },
          data: {
            points: {
              increment: donation.pointsAwarded,
            },

            impactKg: {
              increment: donation.weightKg,
            },
          },
        });

        return {
          status: "POINTS_AWARDED" as const,
          points: updatedUser.points,
        };
      });

      if (!result) {
        return NextResponse.json(
          {
            error: "Donation status changed already.",
          },
          {
            status: 409,
          },
        );
      }

      return NextResponse.json({
        success: true,
        status: result.status,
        points: result.points,
      });
    }

    /*
     * Already completed.
     */
    return NextResponse.json({
      success: true,
      status: "POINTS_AWARDED",
    });
  } catch (error) {
    console.error("Donation status error:", error);

    return NextResponse.json(
      {
        error: "Unable to update donation status.",
      },
      {
        status: 500,
      },
    );
  }
}

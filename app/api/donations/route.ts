import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { calculatePoints } from "@/lib/points";
import { getCurrentUserId } from "@/lib/auth";

type Category = "EDIBLE_SURPLUS" | "ORGANIC_COMPOST";

type LogisticsType = "DROP_OFF" | "PICKUP";

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

    const category = body.category as Category;
    const weightKg = Number(body.weightKg);
    const logisticsType = body.logisticsType as LogisticsType;

    const location =
      typeof body.location === "string" ? body.location.trim() : "";

    const pickupDateRaw =
      typeof body.pickupDate === "string" ? body.pickupDate : "";

    if (category !== "EDIBLE_SURPLUS" && category !== "ORGANIC_COMPOST") {
      return NextResponse.json(
        {
          error: "Please choose a valid donation type.",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isFinite(weightKg) || weightKg <= 0) {
      return NextResponse.json(
        {
          error: "Please enter a valid weight.",
        },
        {
          status: 400,
        },
      );
    }

    if (logisticsType !== "DROP_OFF" && logisticsType !== "PICKUP") {
      return NextResponse.json(
        {
          error: "Please choose a logistics method.",
        },
        {
          status: 400,
        },
      );
    }

    if (logisticsType === "DROP_OFF" && !location) {
      return NextResponse.json(
        {
          error: "Please choose a drop-off point.",
        },
        {
          status: 400,
        },
      );
    }

    let pickupDate: Date | null = null;

    if (logisticsType === "PICKUP") {
      if (!pickupDateRaw) {
        return NextResponse.json(
          {
            error: "Please select a pickup date.",
          },
          {
            status: 400,
          },
        );
      }

      pickupDate = new Date(`${pickupDateRaw}T12:00:00.000Z`);

      if (Number.isNaN(pickupDate.getTime())) {
        return NextResponse.json(
          {
            error: "Please select a valid pickup date.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const pointsAwarded = calculatePoints(category, weightKg);

    const donation = await prisma.donation.create({
      data: {
        userId,
        category,
        weightKg,
        logisticsType,
        location: logisticsType === "DROP_OFF" ? location : "Home Pickup",
        pickupDate,
        status: "PENDING_DROPOFF",
        pointsAwarded,
      },
    });

    return NextResponse.json(
      {
        success: true,
        donation: {
          id: donation.id,
          pointsAwarded: donation.pointsAwarded,
          status: donation.status,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Donation creation error:", error);

    return NextResponse.json(
      {
        error: "Unable to create donation.",
      },
      {
        status: 500,
      },
    );
  }
}

import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  /*
   * Clean demo data first.
   *
   * This makes it easy to reset the checkpoint demo
   * back to a known state.
   */
  await prisma.redemption.deleteMany();

  await prisma.donation.deleteMany();

  await prisma.reward.deleteMany();

  /*
   * Demo user
   */
  const user = await prisma.user.upsert({
    where: {
      email: "demo@wasteaway.local",
    },

    update: {
      name: "Demo User",
      points: 850,
      impactKg: 16.5,
    },

    create: {
      name: "Demo User",
      email: "demo@wasteaway.local",
      points: 850,
      impactKg: 16.5,
    },
  });

  /*
   * Existing donations
   */
  await prisma.donation.createMany({
    data: [
      {
        userId: user.id,

        category: "EDIBLE_SURPLUS",

        weightKg: 2.5,

        logisticsType: "DROP_OFF",

        location: "Community Center",

        pickupDate: null,

        status: "POINTS_AWARDED",

        pointsAwarded: 30,
      },

      {
        userId: user.id,

        category: "ORGANIC_COMPOST",

        weightKg: 4,

        logisticsType: "PICKUP",

        location: "Home Pickup",

        pickupDate: new Date("2026-09-24T12:00:00.000Z"),

        status: "VERIFIED",

        pointsAwarded: 32,
      },

      {
        userId: user.id,

        category: "EDIBLE_SURPLUS",

        weightKg: 1.5,

        logisticsType: "DROP_OFF",

        location: "Super Indo Community Point",

        pickupDate: null,

        status: "PENDING_DROPOFF",

        pointsAwarded: 18,
      },
    ],
  });

  /*
   * Rewards marketplace
   */
  await prisma.reward.createMany({
    data: [
      {
        partnerName: "Super Indo",

        title: "15% Off Grocery Purchase",

        description: "Save 15% on your next eligible grocery purchase.",

        discountPercent: 15,

        costPoints: 500,

        active: true,
      },

      {
        partnerName: "Super Indo",

        title: "10% Off Fresh Produce",

        description: "Get 10% off selected fresh produce.",

        discountPercent: 10,

        costPoints: 350,

        active: true,
      },

      {
        partnerName: "LocalMart",

        title: "20% Off Organic Products",

        description: "Save on selected organic products.",

        discountPercent: 20,

        costPoints: 750,

        active: true,
      },

      {
        partnerName: "Green Market",

        title: "15% Off Household Items",

        description: "Discount on participating household products.",

        discountPercent: 15,

        costPoints: 400,

        active: true,
      },
    ],
  });

  console.log("WasteAway demo data seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

import RewardMarketplace from "@/components/RewardMarketplace";

export default async function RewardsPage() {
    const user = await requireUser();

    const [rewards, redemptions] =
        await Promise.all([
            prisma.reward.findMany({
                where: {
                    active: true,
                },
                orderBy: {
                    costPoints: "asc",
                },
            }),

            prisma.redemption.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    reward: true,
                },
                orderBy: {
                    redeemedAt: "desc",
                },
                take: 5,
            }),
        ]);

    const redemptionHistory =
        redemptions.map((redemption) => ({
            id: redemption.id,
            title: redemption.reward.title,
            partnerName:
                redemption.reward.partnerName,
            pointsSpent: redemption.pointsSpent,
            redeemedAt:
                redemption.redeemedAt.toISOString(),
        }));

    return (
        <div className="page-shell">
            <section className="page-header">
                <div className="container">
                    <div className="eyebrow">
                        REWARDS MARKETPLACE
                    </div>

                    <div className="page-header-row">
                        <div>
                            <h1>Put your points to work.</h1>

                            <p>
                                Redeem your WasteAway points for discounts and
                                offers from local partners.
                            </p>
                        </div>

                        <div className="balance-pill">
                            <span>YOUR BALANCE</span>
                            <strong>
                                {user.points.toLocaleString()} pts
                            </strong>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container rewards-content">
                <RewardMarketplace
                    initialPoints={user.points}
                    rewards={rewards}
                    initialRedemptions={
                        redemptionHistory
                    }
                />
            </div>
        </div>
    );
}
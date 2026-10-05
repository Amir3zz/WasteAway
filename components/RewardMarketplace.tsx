"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Reward = {
    id: string;
    partnerName: string;
    title: string;
    description: string;
    discountPercent: number;
    costPoints: number;
};

type Redemption = {
    id: string;
    title: string;
    partnerName: string;
    pointsSpent: number;
    redeemedAt: string;
};

type Props = {
    initialPoints: number;
    rewards: Reward[];
    initialRedemptions: Redemption[];
};

export default function RewardMarketplace({
    initialPoints,
    rewards,
    initialRedemptions,
}: Props) {
    const router = useRouter();

    const [points, setPoints] =
        useState(initialPoints);

    const [redemptions, setRedemptions] =
        useState(initialRedemptions);

    const [redeemingId, setRedeemingId] =
        useState<string | null>(null);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    async function redeemReward(
        reward: Reward
    ) {
        setRedeemingId(reward.id);
        setError("");
        setMessage("");

        try {
            const response = await fetch(
                "/api/rewards/redeem",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        rewardId: reward.id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to redeem reward."
                );
            }

            setPoints(data.remainingPoints);

            setRedemptions((current) => [
                {
                    id: data.redemptionId,
                    title: reward.title,
                    partnerName: reward.partnerName,
                    pointsSpent:
                        reward.costPoints,
                    redeemedAt:
                        new Date().toISOString(),
                },
                ...current,
            ]);

            setMessage(
                `You redeemed "${reward.title}" for ${reward.costPoints} points.`
            );

            router.refresh();
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setRedeemingId(null);
        }
    }

    return (
        <div>
            <div className="marketplace-toolbar">
                <div>
                    <div className="eyebrow">
                        AVAILABLE OFFERS
                    </div>

                    <h2>Choose your reward</h2>
                </div>

                <div className="points-balance-card">
                    <span>Points balance</span>
                    <strong>
                        {points.toLocaleString()} pts
                    </strong>
                </div>
            </div>

            {message && (
                <div className="success-box">
                    ✓ {message}
                </div>
            )}

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            <div className="rewards-grid">
                {rewards.map((reward) => {
                    const canRedeem =
                        points >= reward.costPoints;

                    const isRedeeming =
                        redeemingId === reward.id;

                    return (
                        <div
                            className="reward-card"
                            key={reward.id}
                        >
                            <div className="reward-card-top">
                                <div className="partner-logo">
                                    {reward.partnerName
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>

                                <span className="discount-badge">
                                    {reward.discountPercent}% OFF
                                </span>
                            </div>

                            <div className="eyebrow reward-partner">
                                {reward.partnerName}
                            </div>

                            <h3>{reward.title}</h3>

                            <p>{reward.description}</p>

                            <div className="reward-bottom">
                                <div>
                                    <span>REDEMPTION COST</span>

                                    <strong>
                                        {reward.costPoints.toLocaleString()} pts
                                    </strong>
                                </div>

                                <button
                                    type="button"
                                    className={`button ${canRedeem
                                            ? "button-primary"
                                            : "button-disabled"
                                        }`}
                                    onClick={() =>
                                        redeemReward(reward)
                                    }
                                    disabled={
                                        !canRedeem || isRedeeming
                                    }
                                >
                                    {isRedeeming
                                        ? "Redeeming..."
                                        : canRedeem
                                            ? "Redeem"
                                            : "Not enough points"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <section className="redemption-history">
                <div className="eyebrow">
                    YOUR ACTIVITY
                </div>

                <h2>Recent redemptions</h2>

                {redemptions.length === 0 ? (
                    <div className="empty-state compact">
                        <div className="empty-icon">🎁</div>

                        <p>
                            Your redeemed rewards will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="redemption-list">
                        {redemptions.map(
                            (redemption) => (
                                <div
                                    className="redemption-row"
                                    key={redemption.id}
                                >
                                    <div className="redemption-icon">
                                        🎟️
                                    </div>

                                    <div>
                                        <strong>
                                            {redemption.title}
                                        </strong>

                                        <span>
                                            {redemption.partnerName}
                                        </span>
                                    </div>

                                    <div className="redemption-points">
                                        -{redemption.pointsSpent} pts
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
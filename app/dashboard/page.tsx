import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

import StatusTracker from "@/components/StatusTracker";

export default async function DashboardPage() {
    const user = await requireUser();

    const [donations, donationCount] = await Promise.all([
        prisma.donation.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 6,
        }),

        prisma.donation.count({
            where: {
                userId: user.id,
            },
        }),
    ]);

    return (
        <div className="page-shell">
            <section className="dashboard-header">
                <div className="container">
                    <div className="eyebrow">
                        YOUR WASTEAWAY DASHBOARD
                    </div>

                    <h1>
                        Welcome back, {user.name.split(" ")[0]}.
                    </h1>

                    <p>
                        Here&apos;s what your WasteAway activity looks like.
                    </p>
                </div>
            </section>

            <div className="container dashboard-content">
                <div className="stats-cards">
                    <div className="dashboard-stat points-stat">
                        <div className="stat-top">
                            <span className="stat-label">
                                CURRENT POINTS
                            </span>
                            <span className="stat-icon">⭐</span>
                        </div>

                        <strong>
                            {user.points.toLocaleString()}
                        </strong>

                        <span className="stat-caption">
                            Available for rewards
                        </span>
                    </div>

                    <div className="dashboard-stat impact-stat">
                        <div className="stat-top">
                            <span className="stat-label">
                                ENVIRONMENTAL IMPACT
                            </span>
                            <span className="stat-icon">🌱</span>
                        </div>

                        <strong>
                            {user.impactKg.toFixed(1)} kg
                        </strong>

                        <span className="stat-caption">
                            Waste successfully diverted
                        </span>
                    </div>

                    <div className="dashboard-stat">
                        <div className="stat-top">
                            <span className="stat-label">
                                DONATIONS
                            </span>
                            <span className="stat-icon">📦</span>
                        </div>

                        <strong>{donationCount}</strong>

                        <span className="stat-caption">
                            Total donations logged
                        </span>
                    </div>
                </div>

                <div className="dashboard-main-grid">
                    <section className="content-card recent-card">
                        <div className="card-heading">
                            <div>
                                <div className="eyebrow">
                                    ACTIVITY
                                </div>
                                <h2>Recent donations</h2>
                            </div>

                            <Link
                                href="/donate"
                                className="button button-primary"
                            >
                                + New Donation
                            </Link>
                        </div>

                        {donations.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🥕</div>
                                <h3>No donations yet</h3>
                                <p>
                                    Your first donation is just a few clicks away.
                                </p>

                                <Link
                                    href="/donate"
                                    className="button button-primary"
                                >
                                    Make a Donation
                                </Link>
                            </div>
                        ) : (
                            <div className="donation-list">
                                {donations.map((donation) => (
                                    <div
                                        className="donation-row"
                                        key={donation.id}
                                    >
                                        <div className="donation-type-icon">
                                            {donation.category ===
                                                "EDIBLE_SURPLUS"
                                                ? "🍎"
                                                : "🌱"}
                                        </div>

                                        <div className="donation-details">
                                            <div className="donation-title">
                                                {donation.category ===
                                                    "EDIBLE_SURPLUS"
                                                    ? "Edible surplus"
                                                    : "Organic compost"}
                                            </div>

                                            <div className="donation-meta">
                                                {donation.weightKg.toFixed(1)} kg
                                                {" · "}
                                                {donation.logisticsType ===
                                                    "DROP_OFF"
                                                    ? donation.location
                                                    : "Home pickup"}
                                            </div>

                                            <div className="donation-date">
                                                {new Intl.DateTimeFormat("en-US", {
                                                    dateStyle: "medium",
                                                }).format(donation.createdAt)}
                                            </div>
                                        </div>

                                        <div className="donation-right">
                                            <div className="points-earned">
                                                +{donation.pointsAwarded} pts
                                            </div>

                                            <StatusTracker
                                                donationId={donation.id}
                                                initialStatus={donation.status}
                                                pointsAwarded={
                                                    donation.pointsAwarded
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className="dashboard-side">
                        <div className="content-card quick-card">
                            <div className="eyebrow">
                                TAKE ACTION
                            </div>

                            <h2>Have food to donate?</h2>

                            <p>
                                Log a new donation and let WasteAway handle
                                the next step.
                            </p>

                            <Link
                                href="/donate"
                                className="button button-primary button-full"
                            >
                                Donate Food
                            </Link>
                        </div>

                        <div className="content-card impact-card">
                            <div className="impact-card-icon">🌎</div>

                            <div className="eyebrow">
                                YOUR IMPACT
                            </div>

                            <h3>
                                Every kilogram counts.
                            </h3>

                            <p>
                                Your verified donations contribute to a
                                healthier community and less food waste.
                            </p>

                            <Link
                                href="/rewards"
                                className="text-link"
                            >
                                View Rewards →
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
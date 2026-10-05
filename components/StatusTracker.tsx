"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DonationStatus =
    | "PENDING_DROPOFF"
    | "VERIFIED"
    | "POINTS_AWARDED";

type Props = {
    donationId: string;
    initialStatus: DonationStatus;
    pointsAwarded: number;
};

const steps = [
    {
        key: "PENDING_DROPOFF",
        label: "Pending Drop-off",
    },
    {
        key: "VERIFIED",
        label: "Verified",
    },
    {
        key: "POINTS_AWARDED",
        label: "Points Awarded",
    },
] as const;

export default function StatusTracker({
    donationId,
    initialStatus,
    pointsAwarded,
}: Props) {
    const router = useRouter();

    const [status, setStatus] =
        useState<DonationStatus>(initialStatus);

    const [loading, setLoading] = useState(false);

    const currentIndex = steps.findIndex(
        (step) => step.key === status
    );

    async function advanceStatus() {
        setLoading(true);

        try {
            const response = await fetch(
                "/api/donations/status",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        donationId,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to update status."
                );
            }

            setStatus(data.status);

            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="status-wrapper">
            <div className="status-track">
                {steps.map((step, index) => {
                    const completed =
                        index <= currentIndex;

                    return (
                        <div
                            className="status-step"
                            key={step.key}
                        >
                            <span
                                className={`status-dot ${completed ? "status-dot-active" : ""
                                    }`}
                            >
                                {completed && index < currentIndex
                                    ? "✓"
                                    : index === currentIndex
                                        ? "●"
                                        : ""}
                            </span>

                            <span
                                className={`status-label ${completed ? "status-label-active" : ""
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {status === "PENDING_DROPOFF" && (
                <button
                    type="button"
                    className="status-action"
                    onClick={advanceStatus}
                    disabled={loading}
                >
                    {loading
                        ? "Updating..."
                        : "Simulate Verification →"}
                </button>
            )}

            {status === "VERIFIED" && (
                <button
                    type="button"
                    className="status-action"
                    onClick={advanceStatus}
                    disabled={loading}
                >
                    {loading
                        ? "Awarding..."
                        : `Award ${pointsAwarded} Points →`}
                </button>
            )}

            {status === "POINTS_AWARDED" && (
                <div className="status-complete">
                    ✓ Donation complete — {pointsAwarded} points awarded
                </div>
            )}
        </div>
    );
}
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { calculatePoints } from "@/lib/points";

type Category =
    | "EDIBLE_SURPLUS"
    | "ORGANIC_COMPOST"
    | "";

type LogisticsType =
    | "DROP_OFF"
    | "PICKUP"
    | "";

const DROP_OFF_POINTS = [
    "Community Center",
    "Super Indo Community Point",
    "Green Market Community Point",
];

export default function DonationFlow() {
    const router = useRouter();

    const [step, setStep] = useState(1);

    const [category, setCategory] =
        useState<Category>("");

    const [weight, setWeight] =
        useState("");

    const [logisticsType, setLogisticsType] =
        useState<LogisticsType>("");

    const [location, setLocation] =
        useState("");

    const [pickupDate, setPickupDate] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [completed, setCompleted] =
        useState(false);

    const parsedWeight = Number(weight);

    const estimatedPoints = useMemo(() => {
        if (!category || !Number.isFinite(parsedWeight)) {
            return 0;
        }

        return calculatePoints(
            category,
            parsedWeight
        );
    }, [category, parsedWeight]);

    function nextStep() {
        setError("");

        if (step === 1 && !category) {
            setError(
                "Please select the type of donation."
            );
            return;
        }

        if (
            step === 2 &&
            (!Number.isFinite(parsedWeight) ||
                parsedWeight <= 0)
        ) {
            setError(
                "Please enter a valid weight greater than 0."
            );
            return;
        }

        if (step < 3) {
            setStep(step + 1);
        }
    }

    function previousStep() {
        setError("");

        if (step > 1) {
            setStep(step - 1);
        }
    }

    async function submitDonation() {
        setError("");

        if (!logisticsType) {
            setError(
                "Please choose a logistics method."
            );
            return;
        }

        if (
            logisticsType === "DROP_OFF" &&
            !location
        ) {
            setError(
                "Please choose a drop-off point."
            );
            return;
        }

        if (
            logisticsType === "PICKUP" &&
            !pickupDate
        ) {
            setError(
                "Please choose a pickup date."
            );
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch(
                "/api/donations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        category,
                        weightKg: parsedWeight,
                        logisticsType,
                        location,
                        pickupDate,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Unable to create donation."
                );
            }

            setCompleted(true);
            router.refresh();
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (completed) {
        return (
            <div className="success-card">
                <div className="success-icon">✓</div>

                <div className="eyebrow">
                    DONATION SUBMITTED
                </div>

                <h2>Your donation is on its way.</h2>

                <p>
                    Your donation has been logged and is currently
                    waiting for verification.
                </p>

                <div className="success-summary">
                    <div>
                        <span>Donation type</span>
                        <strong>
                            {category === "EDIBLE_SURPLUS"
                                ? "Edible surplus"
                                : "Organic compost"}
                        </strong>
                    </div>

                    <div>
                        <span>Weight</span>
                        <strong>
                            {parsedWeight.toFixed(1)} kg
                        </strong>
                    </div>

                    <div>
                        <span>Estimated reward</span>
                        <strong>
                            +{estimatedPoints} points
                        </strong>
                    </div>

                    <div>
                        <span>Status</span>
                        <strong>Pending Drop-off</strong>
                    </div>
                </div>

                <div className="success-actions">
                    <Link
                        href="/dashboard"
                        className="button button-primary"
                    >
                        View My Dashboard
                    </Link>

                    <Link
                        href="/rewards"
                        className="button button-secondary"
                    >
                        View Rewards
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="donation-flow-card">
            <div className="stepper-header">
                {[1, 2, 3].map((number) => (
                    <div
                        className={`stepper-item ${number <= step
                                ? "stepper-item-active"
                                : ""
                            }`}
                        key={number}
                    >
                        <span className="stepper-circle">
                            {number < step ? "✓" : number}
                        </span>

                        <span>
                            {number === 1
                                ? "Category"
                                : number === 2
                                    ? "Volume"
                                    : "Logistics"}
                        </span>
                    </div>
                ))}
            </div>

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            {step === 1 && (
                <div className="flow-step">
                    <div className="flow-heading">
                        <div className="eyebrow">
                            STEP 1 OF 3
                        </div>

                        <h2>What are you donating?</h2>

                        <p>
                            We&apos;ll use this to determine where your
                            donation should be routed.
                        </p>
                    </div>

                    <div className="choice-grid">
                        <button
                            type="button"
                            className={`choice-card ${category === "EDIBLE_SURPLUS"
                                    ? "choice-card-selected"
                                    : ""
                                }`}
                            onClick={() =>
                                setCategory("EDIBLE_SURPLUS")
                            }
                        >
                            <div className="choice-icon">
                                🍎
                            </div>

                            <div className="choice-check">
                                {category ===
                                    "EDIBLE_SURPLUS"
                                    ? "✓"
                                    : ""}
                            </div>

                            <h3>Edible Surplus</h3>

                            <p>
                                Food that is still suitable for
                                people to eat.
                            </p>

                            <span className="choice-example">
                                Example: extra cooked meals,
                                unopened food
                            </span>
                        </button>

                        <button
                            type="button"
                            className={`choice-card ${category === "ORGANIC_COMPOST"
                                    ? "choice-card-selected"
                                    : ""
                                }`}
                            onClick={() =>
                                setCategory("ORGANIC_COMPOST")
                            }
                        >
                            <div className="choice-icon">
                                🌱
                            </div>

                            <div className="choice-check">
                                {category ===
                                    "ORGANIC_COMPOST"
                                    ? "✓"
                                    : ""}
                            </div>

                            <h3>Organic Compost</h3>

                            <p>
                                Food scraps or organic material
                                unsuitable for eating.
                            </p>

                            <span className="choice-example">
                                Example: vegetable scraps,
                                fruit peels
                            </span>
                        </button>
                    </div>

                    <div className="flow-actions">
                        <button
                            type="button"
                            className="button button-primary"
                            onClick={nextStep}
                        >
                            Continue →
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="flow-step">
                    <div className="flow-heading">
                        <div className="eyebrow">
                            STEP 2 OF 3
                        </div>

                        <h2>How much are you donating?</h2>

                        <p>
                            Enter your best estimate. The system uses the
                            weight to calculate your reward.
                        </p>
                    </div>

                    <div className="weight-panel">
                        <label
                            htmlFor="weight"
                            className="input-label"
                        >
                            Estimated weight
                        </label>

                        <div className="weight-input-wrapper">
                            <input
                                id="weight"
                                className="large-input"
                                type="number"
                                min="0.1"
                                step="0.1"
                                placeholder="2.5"
                                value={weight}
                                onChange={(event) =>
                                    setWeight(event.target.value)
                                }
                            />

                            <span>kg</span>
                        </div>

                        <div className="points-preview">
                            <div>
                                <span>Estimated reward</span>

                                <strong>
                                    {estimatedPoints} pts
                                </strong>
                            </div>

                            <p>
                                {category ===
                                    "EDIBLE_SURPLUS"
                                    ? "Edible surplus earns 12 points per kilogram."
                                    : "Organic compost earns 8 points per kilogram."}
                            </p>
                        </div>
                    </div>

                    <div className="flow-actions flow-actions-between">
                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={previousStep}
                        >
                            ← Back
                        </button>

                        <button
                            type="button"
                            className="button button-primary"
                            onClick={nextStep}
                        >
                            Continue →
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flow-step">
                    <div className="flow-heading">
                        <div className="eyebrow">
                            STEP 3 OF 3
                        </div>

                        <h2>How should we receive it?</h2>

                        <p>
                            Choose a nearby drop-off point or schedule a
                            pickup.
                        </p>
                    </div>

                    <div className="logistics-grid">
                        <button
                            type="button"
                            className={`logistics-card ${logisticsType === "DROP_OFF"
                                    ? "logistics-card-selected"
                                    : ""
                                }`}
                            onClick={() => {
                                setLogisticsType("DROP_OFF");
                                setPickupDate("");
                            }}
                        >
                            <div className="choice-icon">
                                📍
                            </div>

                            <div>
                                <h3>Drop-off</h3>
                                <p>
                                    Bring your donation to a community
                                    point.
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            className={`logistics-card ${logisticsType === "PICKUP"
                                    ? "logistics-card-selected"
                                    : ""
                                }`}
                            onClick={() => {
                                setLogisticsType("PICKUP");
                                setLocation("");
                            }}
                        >
                            <div className="choice-icon">
                                🚚
                            </div>

                            <div>
                                <h3>Pickup</h3>
                                <p>
                                    Schedule WasteAway to collect it.
                                </p>
                            </div>
                        </button>
                    </div>

                    {logisticsType === "DROP_OFF" && (
                        <div className="field-group">
                            <label
                                htmlFor="location"
                                className="input-label"
                            >
                                Drop-off point
                            </label>

                            <select
                                id="location"
                                className="select-input"
                                value={location}
                                onChange={(event) =>
                                    setLocation(event.target.value)
                                }
                            >
                                <option value="">
                                    Select a location
                                </option>

                                {DROP_OFF_POINTS.map(
                                    (point) => (
                                        <option
                                            value={point}
                                            key={point}
                                        >
                                            {point}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    )}

                    {logisticsType === "PICKUP" && (
                        <div className="field-group">
                            <label
                                htmlFor="pickupDate"
                                className="input-label"
                            >
                                Pickup date
                            </label>

                            <input
                                id="pickupDate"
                                className="text-input"
                                type="date"
                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                value={pickupDate}
                                onChange={(event) =>
                                    setPickupDate(
                                        event.target.value
                                    )
                                }
                            />
                        </div>
                    )}

                    <div className="final-summary">
                        <div>
                            <span>Donation</span>
                            <strong>
                                {category ===
                                    "EDIBLE_SURPLUS"
                                    ? "Edible surplus"
                                    : "Organic compost"}
                            </strong>
                        </div>

                        <div>
                            <span>Weight</span>
                            <strong>
                                {parsedWeight.toFixed(1)} kg
                            </strong>
                        </div>

                        <div>
                            <span>Estimated reward</span>
                            <strong>
                                +{estimatedPoints} pts
                            </strong>
                        </div>
                    </div>

                    <div className="flow-actions flow-actions-between">
                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={previousStep}
                        >
                            ← Back
                        </button>

                        <button
                            type="button"
                            className="button button-primary"
                            onClick={submitDonation}
                            disabled={submitting}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Donation"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/demo/login", {
                method: "POST",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to log in."
                );
            }

            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );

            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-icon">♻</div>

                <div className="eyebrow">DEMO LOGIN</div>

                <h1>Welcome to WasteAway</h1>

                <p>
                    This checkpoint uses a pre-populated demo account
                    instead of a full authentication system.
                </p>

                <div className="demo-account">
                    <div className="demo-avatar">DU</div>

                    <div>
                        <strong>Demo User</strong>
                        <span>demo@wasteaway.local</span>
                    </div>
                </div>

                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    className="button button-primary button-full"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading
                        ? "Opening your account..."
                        : "Continue as Demo User"}
                </button>

                <p className="auth-note">
                    No password is required for the checkpoint demo.
                </p>
            </div>
        </div>
    );
}
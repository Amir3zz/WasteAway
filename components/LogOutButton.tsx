"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);

        try {
            await fetch("/api/demo/logout", {
                method: "POST",
            });

            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout error:", error);
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            className="nav-button nav-button-secondary"
            onClick={handleLogout}
            disabled={loading}
        >
            {loading ? "Logging out..." : "Logout"}
        </button>
    );
}
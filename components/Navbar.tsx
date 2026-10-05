import Link from "next/link";
import { cookies } from "next/headers";

import LogoutButton from "./LogOutButton";

const COOKIE_NAME = "wasteaway_user_id";

export default async function Navbar() {
    const cookieStore = await cookies();
    const loggedIn = Boolean(
        cookieStore.get(COOKIE_NAME)?.value
    );

    return (
        <header className="navbar">
            <div className="container navbar-inner">
                <Link href="/" className="brand">
                    <span className="brand-icon">♻</span>
                    <span>WasteAway</span>
                </Link>

                <nav className="nav-links">
                    <Link href="/">Home</Link>

                    {loggedIn ? (
                        <>
                            <Link href="/dashboard">Dashboard</Link>
                            <Link href="/donate">Donate</Link>
                            <Link href="/rewards">Rewards</Link>
                            <LogoutButton />
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="nav-button nav-button-primary"
                        >
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
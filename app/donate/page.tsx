import { requireUser } from "@/lib/auth";
import DonationFlow from "@/components/DonationFlow";

export default async function DonatePage() {
    await requireUser();

    return (
        <div className="page-shell">
            <section className="page-header">
                <div className="container">
                    <div className="eyebrow">
                        WASTEAWAY DONATION
                    </div>

                    <h1>Turn your food waste into impact.</h1>

                    <p>
                        Tell us what you have, how much you have, and how
                        you want to send it to us.
                    </p>
                </div>
            </section>

            <div className="container donation-page-content">
                <DonationFlow />
            </div>
        </div>
    );
}
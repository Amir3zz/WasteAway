import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              COMMUNITY FOOD RECOVERY
            </div>

            <h1>
              Turn food waste into
              <span className="highlight"> community value.</span>
            </h1>

            <p className="hero-description">
              WasteAway connects unwanted food with people,
              farms, and organizations that can put it to good
              use — while rewarding the people who donate.
            </p>

            <div className="hero-actions">
              <Link
                href="/login"
                className="button button-primary button-large"
              >
                Start Donating
              </Link>

              <a
                href="#how-it-works"
                className="button button-secondary button-large"
              >
                How It Works
              </a>
            </div>

            <div className="hero-trust">
              <span>✓ Community-focused</span>
              <span>✓ Reward-based</span>
              <span>✓ Less waste</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card-main">
              <div className="hero-card-icon">🥕</div>

              <div>
                <p className="hero-card-label">
                  THIS WEEK
                </p>
                <h3>Food saved from waste</h3>
                <div className="impact-number">
                  1,284 kg
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <span>+30 pts</span>
              <small>Donation verified</small>
            </div>

            <div className="floating-card floating-card-bottom">
              <span>🌱</span>
              <small>Making every donation count</small>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="section section-light"
      >
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">HOW IT WORKS</div>
            <h2>Three steps. One better outcome.</h2>
            <p>
              WasteAway keeps the process simple for the
              community.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">🥬</div>
              <h3>Donate</h3>
              <p>
                Tell us what food you have and roughly how much
                you want to donate.
              </p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">🚚</div>
              <h3>Route</h3>
              <p>
                WasteAway directs it to the appropriate
                community, farm, or composting partner.
              </p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">🎁</div>
              <h3>Reward</h3>
              <p>
                Once your donation is verified, you receive
                points that can be redeemed for partner offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">WHY WASTEAWAY</div>
            <h2>Waste can still have value.</h2>
            <p>
              The same donation can help people, support farms,
              and reduce unnecessary waste.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🍎</div>
              <h3>Edible surplus</h3>
              <p>
                Food that is still suitable for consumption can
                be routed toward people who need it.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Organic compost</h3>
              <p>
                Non-edible organic material can be redirected
                toward farms and composting partners.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Real rewards</h3>
              <p>
                Your contributions build points that can unlock
                discounts and offers from local partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container stats-grid">
          <div>
            <strong>12,450 kg</strong>
            <span>Waste diverted</span>
          </div>

          <div>
            <strong>3,200+</strong>
            <span>Community donations</span>
          </div>

          <div>
            <strong>850+</strong>
            <span>Rewards redeemed</span>
          </div>

          <div>
            <strong>20+</strong>
            <span>Local partners</span>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <div className="eyebrow eyebrow-light">
              READY TO MAKE A DIFFERENCE?
            </div>

            <h2>
              Your leftovers can still do something good.
            </h2>

            <p>
              Join WasteAway and turn each donation into
              community impact.
            </p>
          </div>

          <Link
            href="/login"
            className="button button-white button-large"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
import { NavLink } from "react-router-dom";

const featuredLines = [
  {
    title: "Urban Motion",
    description: "Compact electric scooters tuned for city commutes, smart charging, and agile daily travel."
  },
  {
    title: "Street Performance",
    description: "Bolder frames, stronger motors, and premium lighting for riders who want a higher-energy profile."
  },
  {
    title: "Student Smart",
    description: "Budget-friendly e-bikes selected for efficiency, practical range, and easy ownership."
  }
];

const HomePage = () => (
  <div className="home-page">
    <section className="hero-panel">
      <div className="hero-panel__content">
        <span className="hero-panel__badge">Electric Mobility for a New Generation</span>
        <h1 className="hero-panel__title">Move through the city with a sharper, cleaner electric ride.</h1>
        <p className="hero-panel__copy">
          A storefront concept inspired by Yadea: bold visuals, product-led storytelling, and a built-in smart
          advisor to help customers choose the right e-bike fast.
        </p>

        <div className="hero-panel__actions">
          <NavLink className="button button--primary" to="/products">
            View Collection
          </NavLink>
          <NavLink className="button button--ghost" to="/chatbot">
            Start Smart Advisor
          </NavLink>
        </div>

        <div className="hero-panel__metrics">
          <div>
            <strong>70 km</strong>
            <span>Practical range</span>
          </div>
          <div>
            <strong>4 hrs</strong>
            <span>Fast charge target</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Digital support flow</span>
          </div>
        </div>
      </div>

      <div className="hero-panel__visual" aria-hidden="true">
        <div className="hero-bike">
          <div className="hero-bike__glow" />
          <div className="hero-bike__frame">
            <div className="hero-bike__wheel hero-bike__wheel--front" />
            <div className="hero-bike__wheel hero-bike__wheel--rear" />
            <div className="hero-bike__body" />
            <div className="hero-bike__accent" />
          </div>
        </div>
      </div>
    </section>

    <section className="experience-grid" id="experience">
      {featuredLines.map((line) => (
        <article className="feature-card" key={line.title}>
          <span className="feature-card__tag">Collection</span>
          <h2>{line.title}</h2>
          <p>{line.description}</p>
        </article>
      ))}
    </section>

    <section className="story-panel">
      <div className="story-panel__copy">
        <span className="section-label">Smart Buying Experience</span>
        <h2>Chatbot-first guidance for a storefront that feels modern, not overwhelming.</h2>
        <p>
          Instead of making users compare dozens of specifications manually, the advisor can answer FAQ, explain
          range or speed, and guide each rider to a suitable model based on budget and usage.
        </p>
      </div>

      <div className="story-panel__highlight">
        <div className="chat-preview">
          <span className="chat-preview__pill">Smart Advisor</span>
          <p>"I need an affordable e-bike for campus and daily errands."</p>
          <strong>Suggested direction:</strong>
          <span>Budget-friendly, medium-range, lightweight urban models.</span>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;

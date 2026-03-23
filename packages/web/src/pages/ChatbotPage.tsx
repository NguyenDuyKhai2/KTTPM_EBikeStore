const prompts = [
  "I need an affordable model for students.",
  "Show me e-bikes with longer range.",
  "Which scooter is better for city commuting?",
  "Tell me about battery and charging time."
];

const ChatbotPage = () => (
  <div className="advisor-page">
    <section className="section-heading">
      <span className="section-label">Smart Advisor</span>
      <h1>A chatbot-first shopping flow built for electric mobility discovery.</h1>
      <p>
        This page is designed to become the main demo point of the project: FAQ support, product recommendation, and
        guidance based on rider intent.
      </p>
    </section>

    <section className="advisor-layout">
      <div className="advisor-panel">
        <div className="advisor-panel__header">
          <strong>Advisor Session</strong>
          <span>Online now</span>
        </div>

        <div className="advisor-thread">
          <div className="advisor-message advisor-message--bot">
            Hello. Tell me your budget, riding distance, or preferred vehicle style and I will suggest suitable models.
          </div>
          <div className="advisor-message advisor-message--user">
            I want something stylish for the city and I care about charging convenience.
          </div>
          <div className="advisor-message advisor-message--bot">
            Great fit for an urban scooter profile. I would prioritize compact design, mid-range battery, and fast
            daily charging convenience.
          </div>
        </div>

        <div className="advisor-input">
          <input disabled value="Backend integration will attach here next." />
          <button className="button button--primary" type="button">
            Send
          </button>
        </div>
      </div>

      <aside className="advisor-sidebar">
        <div className="sidebar-card">
          <span className="section-label">Suggested prompts</span>
          <div className="prompt-list">
            {prompts.map((prompt) => (
              <button className="prompt-chip" key={prompt} type="button">
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-card sidebar-card--accent">
          <span className="section-label">Demo value</span>
          <h2>Best place to show architecture + UX together</h2>
          <p>
            The chatbot can become the clearest proof point for your project: it connects product data, service logic,
            DTO contracts, and a user-friendly interface in one flow.
          </p>
        </div>
      </aside>
    </section>
  </div>
);

export default ChatbotPage;

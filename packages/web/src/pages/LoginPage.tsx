import SectionShell from "../components/common/SectionShell";

const LoginPage = () => (
  <SectionShell
    eyebrow="Authentication"
    title="Sign in to continue your electric shopping journey."
    description="This route is ready for the future login and register flow. Keeping it separate early helps the team organize guest and authenticated areas cleanly."
  >
    <div className="state-panel">
      Authentication form UI will be connected here once the auth API and validation flow are finalized.
    </div>
  </SectionShell>
);

export default LoginPage;

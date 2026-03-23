import SectionShell from "../../components/common/SectionShell";

const CustomerProfilePage = () => (
  <SectionShell
    eyebrow="Profile"
    title="Manage account information and shopping preferences."
    description="This route is reserved for profile, address, and notification settings once customer APIs are wired in."
  >
    <div className="state-panel">Profile form and account settings UI will go here.</div>
  </SectionShell>
);

export default CustomerProfilePage;

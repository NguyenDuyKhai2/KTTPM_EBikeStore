import SectionShell from "../../components/common/SectionShell";

const AdminUsersPage = () => (
  <SectionShell
    eyebrow="Admin Users"
    title="Review user accounts, permissions, and support-related account actions."
    description="Separating this route early makes it easier to evolve toward PBAC-aware admin tooling later."
  >
    <div className="state-panel">User management table and permission controls will be added here.</div>
  </SectionShell>
);

export default AdminUsersPage;

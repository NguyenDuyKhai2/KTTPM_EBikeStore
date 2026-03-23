import SectionShell from "../../components/common/SectionShell";

const CustomerOrdersPage = () => (
  <SectionShell
    eyebrow="My Orders"
    title="Track current and past e-bike purchases."
    description="This route group gives one teammate a clean place to develop order history and order detail flows without touching guest pages."
  >
    <div className="state-panel">Order history list and status cards will be attached here.</div>
  </SectionShell>
);

export default CustomerOrdersPage;

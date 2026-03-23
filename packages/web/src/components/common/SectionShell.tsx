import type { PropsWithChildren } from "react";

interface SectionShellProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description: string;
}

const SectionShell = ({ eyebrow, title, description, children }: SectionShellProps) => (
  <section className="catalog-page">
    <div className="section-heading">
      <span className="section-label">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
    {children}
  </section>
);

export default SectionShell;

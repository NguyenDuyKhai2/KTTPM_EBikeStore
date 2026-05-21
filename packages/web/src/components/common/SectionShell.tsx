import type { PropsWithChildren } from "react";

interface SectionShellProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description: string;
}

const SectionShell = ({ eyebrow, title, description, children }: SectionShellProps) => (
  <section className="min-h-screen">
    <div className="content-shell page-offset-header pb-8 pt-4 sm:pb-12 sm:pt-6">
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</span>
      <h1 className="heading-section mb-4 max-w-3xl">{title}</h1>
      <p className="max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">{description}</p>
    </div>
    <div className="content-shell pb-12">{children}</div>
  </section>
);

export default SectionShell;

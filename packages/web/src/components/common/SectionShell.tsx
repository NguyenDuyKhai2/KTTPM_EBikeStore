import type { PropsWithChildren } from "react";

interface SectionShellProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description: string;
}

const SectionShell = ({ eyebrow, title, description, children }: SectionShellProps) => (
  <section className="min-h-screen">
    <div className="py-12 px-6">
      <span className="text-xs tracking-widest uppercase font-semibold text-primary mb-3 inline-block">{eyebrow}</span>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-gray-600 max-w-2xl">{description}</p>
    </div>
    {children}
  </section>
);

export default SectionShell;

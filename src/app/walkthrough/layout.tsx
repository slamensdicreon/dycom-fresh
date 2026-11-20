import type { Metadata } from 'next';
import 'src/walkthrough/walkthrough.css';

export const metadata: Metadata = {
  title: { default: 'Design walkthrough · dycomind.com', template: '%s · dycomind.com walkthrough' },
  description: 'The dycomind.com design system walked through: strategy, templates, components and decisions.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function WalkthroughLayout({ children }: { children: React.ReactNode }) {
  return <div className="wt">{children}</div>;
}

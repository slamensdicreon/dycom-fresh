'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { lib } from '../ui/sections';

const ITEMS = [
  { href: lib.home, label: 'Overview', exact: true },
  { href: lib.strategy, label: 'Purpose' },
  { href: lib.templates, label: 'Templates' },
  { href: lib.components, label: 'Components' },
  { href: lib.decisions, label: 'Decisions' },
];

export function LibraryNav() {
  const path = usePathname() ?? '';
  return (
    <nav className="wt-lib-nav" aria-label="Library">
      {ITEMS.map((item) => {
        const current = item.exact ? path === item.href || path === item.href.slice(0, -1) : path.startsWith(item.href.slice(0, -1));
        return (
          <Link key={item.href} href={item.href} aria-current={current ? 'page' : undefined}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

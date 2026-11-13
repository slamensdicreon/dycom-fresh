// Brand media (photography, logos, hero film) ships inside this package so
// every Dycom site shows the same files. Vite rewrites each URL at build time.
const media = import.meta.glob('./media/*', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

/** URL of a packaged media file, e.g. asset('hero-poster.webp'). Throws on a typo so it fails loudly in development. */
export function asset(file: string): string {
  const url = media[`./media/${file}`];
  if (!url) throw new Error(`Unknown Dycom brand asset: ${file}`);
  return url;
}

/** Every packaged media file, for the design system's imagery page. */
export const mediaFiles = Object.keys(media).map((key) => key.replace('./media/', '')).sort();

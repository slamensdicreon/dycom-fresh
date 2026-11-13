import Link from 'next/link';

/** Last-resort 404 when the content source has no error page item. */
export default function FallbackNotFound() {
  return (
    <main className="dy-fallback">
      <h1>Page not found</h1>
      <p>This page does not exist.</p>
      <Link href="/">Go to the home page</Link>
    </main>
  );
}

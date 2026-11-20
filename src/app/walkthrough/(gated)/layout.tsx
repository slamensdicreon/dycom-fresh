import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { WALKTHROUGH_COOKIE, isWalkthroughAuthorized } from 'src/walkthrough/auth';

/** Second check behind the proxy: every walkthrough page needs the access cookie. */
export default async function GatedLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  if (!isWalkthroughAuthorized(jar.get(WALKTHROUGH_COOKIE)?.value)) redirect('/walkthrough/login/');
  return children;
}

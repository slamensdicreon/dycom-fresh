import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PIN_COOKIE, isPinAuthorized } from 'lib/site-pin';

/** Second check behind the proxy's PIN gate: walkthrough pages need the PIN cookie. */
export default async function GatedLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  if (!isPinAuthorized(jar.get(PIN_COOKIE)?.value)) redirect('/gate/');
  return children;
}

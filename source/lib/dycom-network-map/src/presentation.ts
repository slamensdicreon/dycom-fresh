import { companies, type Company } from './companies';

/**
 * Companies held back from the directions Dycom's leadership is comparing
 * (the Final Design Direction and Variation #2).
 *
 * Client feedback, 5 Nov 2026: Texstar Enterprises should not be shown "for
 * now" while a legal conversation is open. The company stays in the shared
 * directory (`companies`) so the earlier concepts and the data itself do not
 * change; remove its id from this set to show it again.
 */
export const HELD_BACK_COMPANY_IDS: ReadonlySet<string> = new Set([
  '4139', // Texstar Enterprises, Selma TX
]);

/** The directory without the held-back companies: what the presentation directions show. */
export const presentedCompanies: Company[] = companies.filter((c) => !HELD_BACK_COMPANY_IDS.has(c.id));

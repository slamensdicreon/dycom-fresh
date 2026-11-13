import { companies, type Company } from "./companies";

export const JOBS_PORTAL = "https://dycomind.jobs.hr.cloud.sap";
// Keep the same reviewed careers exception as Concept 4.
export function careersFor(company: Company) {
  return company.id === "3865" ? JOBS_PORTAL : company.careers || JOBS_PORTAL;
}
export const states = Array.from(new Set(companies.map(company => company.state))).sort();

// Existing concept journeys use abbreviated names and slugs, not directory IDs.
const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
export function findCompany(name?: string | null): Company | undefined {
  if (!name) return undefined;
  const key = normalize(name);
  return companies.find(company => company.id === name || normalize(company.name) === key)
    || companies.find(company => normalize(company.name).startsWith(key));
}

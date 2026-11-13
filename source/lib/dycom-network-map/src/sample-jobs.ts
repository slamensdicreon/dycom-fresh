/** Illustrative recruiting data for vision prototypes. Deterministic per company ID; not a live job feed. */
export type SampleJob = { id: string; role: string; location: string; schedule: string; workType: string; summary: string };
export const SAMPLE_LABEL = "Illustrative sample openings";
const ROLES: [string, string][] = [
  ["Fiber Splicer", "Splice and test fiber in aerial and underground plant, documenting results for each run."],
  ["Underground Utility Locator", "Locate and mark buried lines ahead of excavation using locating equipment and maps."],
  ["Aerial Lineman", "Build and maintain aerial plant from bucket trucks, working to strict safety standards."],
  ["Directional Drill Operator", "Operate HDD rigs to place conduit under roads and yards with minimal surface impact."],
  ["OSP Engineer / Designer", "Design outside plant routes, permits and construction drawings for network builds."],
  ["Construction Foreman", "Lead a field crew day to day: job briefings, quality, safety and production."],
  ["Wireless Technician", "Install and commission tower equipment, antennas and small-cell sites."],
  ["CDL Class A Driver", "Move crews' equipment between job sites safely and on schedule."],
  ["Project Coordinator", "Keep schedules, permits and crew paperwork moving between field and office."],
  ["Laborer / Trainee", "Support a field crew while developing practical skills. Training and entry requirements vary by company and role."],
];
const SCHEDULES = ["Full-time · Mon–Fri", "Full-time · 4×10s", "Full-time · Overtime available", "Full-time · Travel 50%"];
const TYPES = ["Field", "Field", "On-site office", "Hybrid"];
function hash(s: string) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function sampleOpenRoleCount(id: string) { return 6 + (hash(id) % 43); }
export function sampleJobsFor(company: { id: string; city: string; state: string }): SampleJob[] {
  const h = hash(company.id);
  return [0, 1, 2, 3].map(i => {
    const r = ROLES[(h + i * 3) % ROLES.length];
    const type = r[0].includes("Engineer") || r[0].includes("Coordinator") ? TYPES[(h + i) % 2 + 2] : "Field";
    return { id: `${company.id}-${i}`, role: r[0], summary: r[1], location: i === 3 ? `Region near ${company.state}` : `${company.city}, ${company.state}`,
      schedule: SCHEDULES[(h >> (i + 2)) % SCHEDULES.length], workType: type };
  });
}
export function sampleNetworkTotal(list: { id: string }[]) { return list.reduce((n, c) => n + sampleOpenRoleCount(c.id), 0); }

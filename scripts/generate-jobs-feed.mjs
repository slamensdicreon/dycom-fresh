#!/usr/bin/env node
/**
 * One-off generator for content/data/jobs-feed.json — a stand-in for Dycom's SAP SuccessFactors
 * Recruiting Marketing (RMK) XML job feed, used until the real feed is connected.
 *
 * Records use the feed's own field names (reference/sources/Assessment_of_Dycom_SuccessFactors_
 * Recruiting_XML_Feed_vs_API.md §3): `facility` carries the operating company's legal name and
 * `department` the internal SAP category — exactly the two fields the site has to translate
 * (lib/jobs/local-jobs-provider.ts). Fields the sample feed leaves empty (compensation, posteddate,
 * shift, experience…) are left empty here too.
 *
 * The role mix is deterministic per company (same hash as the prototype's jobs.ts), so counts are
 * stable between runs. Regenerate with: node scripts/generate-jobs-feed.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const facilities = JSON.parse(readFileSync(join(root, 'content/data/job-facilities.json'), 'utf8'));

const hash = (s) => {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

// Internal SAP department names, deliberately not visitor language (the strategy: "plain-language
// categories rather than internal SAP department names"). The provider maps them to trades.
const FIELD_ROLES = [
  { title: 'Fiber Splicer', department: 'Splicing - Fiber', summary: 'Splice and test fiber in aerial and underground plant, documenting results for each run.' },
  { title: 'Fiber Splicer Trainee', department: 'Splicing - Fiber', summary: 'Learn splicing and testing alongside a lead splicer.' },
  { title: 'Underground Utility Locator', department: 'Damage Prevention', summary: 'Locate and mark buried lines ahead of excavation using locating equipment and maps.' },
  { title: 'Aerial Lineman', department: 'Aerial Construction', summary: 'Build and maintain aerial plant from bucket trucks to strict safety standards.' },
  { title: 'Directional Drill Operator', department: 'HDD Operations', summary: 'Operate HDD rigs to place conduit under roads and yards with minimal surface impact.' },
  { title: 'CDL Class A Driver', department: 'Fleet / Transport', summary: 'Move crew equipment between job sites safely and on schedule.' },
  { title: 'OSP Engineer / Designer', department: 'OSP Engineering', summary: 'Design outside plant routes, permits and construction drawings for network builds.' },
  { title: 'Underground Laborer', department: 'Underground Labor', summary: 'Entry-level crew role placing conduit and restoring sites. Training on the job.' },
  { title: 'Construction Foreman', department: 'Underground Supervision', summary: 'Lead a field crew day to day: job briefings, quality, safety and production.' },
];
const CORPORATE_ROLES = [
  { title: 'Staff Accountant', department: 'Corporate Finance', summary: 'Month-end close, reconciliations and reporting across the operating companies.' },
  { title: 'HR Generalist', department: 'Human Resources', summary: 'Support hiring, onboarding and employee relations for a group of operating companies.' },
  { title: 'Safety Program Manager', department: 'Corporate Safety', summary: 'Develop safety programs and training that every crew in the family works to.' },
  { title: 'Fleet Coordinator', department: 'Fleet Administration', summary: 'Keep trucks, trailers and equipment assigned, maintained and compliant.' },
  { title: 'IT Support Analyst', department: 'Information Technology', summary: 'Keep field and office systems running, from devices to the job-management tools.' },
  { title: 'Payroll Specialist', department: 'Payroll', summary: 'Weekly payroll for field crews on varied schedules, with accuracy at scale.' },
  { title: 'Finance Intern', department: 'Corporate Finance', summary: 'Learn how a national contractor plans, reports and invests, alongside the finance team.' },
];
const TRAVEL = ['0%-24%', '0%-24%', '25%-49%', '50%-74%'];

const records = [];
let seq = 12000;
for (const f of facilities) {
  const h = hash(f.companyId);
  const corporate = f.companyId === 'dycom';
  const count = corporate ? 12 : 6 + (h % 43);
  const roles = corporate ? CORPORATE_ROLES : FIELD_ROLES;
  for (let i = 0; i < count; i++) {
    const role = roles[(h + i * 5) % roles.length];
    const created = new Date(Date.UTC(2026, 9, 1 + ((h + i * 3) % 40)));
    seq += 1;
    records.push({
      ID: `${seq}-en_US`,
      title: role.title,
      created: created.toUTCString().slice(5, 16),
      url: f.careers,
      city: f.city,
      state: f.state,
      postalcode: f.zip,
      country: 'US',
      location: `${f.city}, ${f.state}, US, ${f.zip}`,
      multilocation: '',
      businessunit: corporate ? 'Corporate' : 'Operations',
      department: role.department,
      facility: f.facility,
      brand: f.brand,
      shifttype: corporate || role.department.includes('Engineering') ? 'Salaried' : 'Hourly',
      travel: corporate ? '0%-24%' : TRAVEL[(h + i * 7) % TRAVEL.length],
      majormarket: '',
      description: `<p>${role.summary}</p>`,
      compensation: '',
      posteddate: '',
      shift: '',
      experience: '',
    });
  }
}
writeFileSync(join(root, 'content/data/jobs-feed.json'), JSON.stringify({ source: 'SuccessFactors RMK XML feed (local stand-in)', records }, null, 1) + '\n');
console.log(`${records.length} job records → content/data/jobs-feed.json`);

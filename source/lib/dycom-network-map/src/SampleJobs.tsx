import { SAMPLE_LABEL, sampleJobsFor, sampleOpenRoleCount } from "./sample-jobs";

type Props = { company: { id: string; name: string; city: string; state: string }; careersHref: string; accent?: string; className?: string; limit?: number };
const line = { borderTop: "1px solid color-mix(in srgb, currentColor 22%, transparent)" } as const;

/** Minimal, host-neutral disclosure list of illustrative openings. Inherits host color/typography. */
export function SampleJobs({ company, careersHref, accent = "currentColor", className, limit = 3 }: Props) {
  const jobs = sampleJobsFor(company).slice(0, limit);
  const count = sampleOpenRoleCount(company.id);
  return <div className={`dnm-sample-jobs ${className ?? ""}`} style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.3 }}><strong style={{ fontSize: 20, color: accent, marginRight: 6 }}>{count}</strong>sample roles</p>
      <span style={{ fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", opacity: .7 }}>{SAMPLE_LABEL}</span>
    </div>
    <ul aria-label={`Sample openings at ${company.name}`} style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {jobs.map(job => <li key={job.id} style={line}>
        <details>
          <summary style={{ cursor: "pointer", padding: "8px 0", fontSize: 13, lineHeight: 1.4 }}>
            <strong>{job.role}</strong><span style={{ display: "block", fontSize: 11, opacity: .75 }}>{job.location} · {job.schedule}</span>
          </summary>
          <div style={{ padding: "0 0 10px", fontSize: 12, lineHeight: 1.55 }}>
            <p style={{ margin: "0 0 6px" }}>{job.summary}</p>
            <p style={{ margin: "0 0 6px", opacity: .75 }}>Work type: {job.workType}</p>
            <a href={careersHref} target="_blank" rel="noopener noreferrer" style={{ color: accent, fontWeight: 700 }}>Explore careers at {company.name}<span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}> (opens in a new tab)</span></a>
          </div>
        </details>
      </li>)}
    </ul>
  </div>;
}

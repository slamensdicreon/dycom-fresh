import { Fragment } from 'react';

/**
 * Renders a canvas note's plain text: blank-line blocks become paragraphs, "•" lines a list,
 * "1." lines a numbered list, and "01 …" narrative beats a beat list.
 */
export function NoteBody({ text, limit }: { text: string; limit?: number }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.split('\n').filter((l) => l.trim()));
  const out: React.ReactNode[] = [];
  blocks.slice(0, limit ?? blocks.length).forEach((lines, bi) => {
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (/^[•·-]\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^[•·-]\s/.test(lines[i])) items.push(lines[i++].replace(/^[•·-]\s+/, ''));
        out.push(<ul key={`${bi}-${i}`} className="wt-list">{items.map((t, k) => <li key={k}>{t}</li>)}</ul>);
      } else if (/^\d+\.\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) items.push(lines[i++].replace(/^\d+\.\s+/, ''));
        out.push(<ol key={`${bi}-${i}`} className="wt-olist">{items.map((t, k) => <li key={k}>{t}</li>)}</ol>);
      } else if (/^(\d\d|Hero|Closing|Intro|Alongside)[\s:]/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^(\d\d|Hero|Closing|Intro|Alongside)[\s:]/.test(lines[i])) items.push(lines[i++]);
        out.push(
          <ol key={`${bi}-${i}`} className="wt-beats">
            {items.map((t, k) => {
              const m = t.match(/^(\d\d|Hero|Closing|Intro|Alongside):?\s+(.*)$/);
              return (
                <li key={k}>
                  <span className="wt-beat-mark">{m ? m[1] : ''}</span>
                  <span>{m ? m[2].charAt(0).toUpperCase() + m[2].slice(1) : t}</span>
                </li>
              );
            })}
          </ol>,
        );
      } else {
        const para: string[] = [];
        while (i < lines.length && !/^([•·-]\s|\d+\.\s|(\d\d|Hero|Closing|Intro|Alongside)[\s:])/.test(lines[i])) para.push(lines[i++]);
        out.push(
          <p key={`${bi}-${i}`}>
            {para.map((t, k) => (
              <Fragment key={k}>
                {k > 0 && <br />}
                {t}
              </Fragment>
            ))}
          </p>,
        );
      }
    }
  });
  return <div className="wt-note-body">{out}</div>;
}

export const NOTE_LABEL: Record<string, string> = {
  job: 'What the page does',
  narrative: 'The story',
  mapping: 'Sitecore mapping',
  aside: 'Note',
};

/** The heading after the label, e.g. "NARRATIVE — WHO WE ARE" → "Who we are". */
export function noteSubject(heading: string): string {
  const parts = heading.split(' — ');
  if (parts.length < 2) return '';
  const s = parts.slice(1).join(' — ');
  return s.charAt(0) + s.slice(1).toLowerCase();
}

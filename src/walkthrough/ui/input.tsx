import { contentDraftedForApproval, contentFromDycom, informationNeeded, type Choice } from '../input';

/** "Where we need your input" blocks, shared by story mode and the library. No hooks. */

export function ChoiceList({ items, numbered = true }: { items: Choice[]; numbered?: boolean }) {
  return (
    <ol className={`wt-choices${numbered ? '' : ' wt-choices--plain'}`}>
      <li className="wt-choices-head" aria-hidden="true">
        <span />
        <span>The question</span>
        <span>Where it stands today</span>
        <span>What it shapes</span>
      </li>
      {items.map((c, i) => (
        <li key={c.question}>
          <span className="wt-choices-n">{numbered ? i + 1 : ''}</span>
          <strong>{c.question}</strong>
          <span>
            <span className="wt-choices-label">Today: </span>
            {c.today}
          </span>
          <span>
            <span className="wt-choices-label">Shapes: </span>
            {c.shapes}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function NeedsGrid() {
  return (
    <div className="wt-needs">
      {informationNeeded.map((n) => (
        <div key={n.title}>
          <h4>{n.title}</h4>
          <p>{n.why}</p>
        </div>
      ))}
    </div>
  );
}

export function ContentSplit() {
  return (
    <div className="wt-twolists wt-content-split">
      <div>
        <h3>From Dycom</h3>
        <ul>
          {contentFromDycom.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Icreon drafts, Dycom approves</h3>
        <ul>
          {contentDraftedForApproval.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

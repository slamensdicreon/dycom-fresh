import { Text, type TextField } from '@sitecore-content-sdk/nextjs';

/**
 * Section head used by interior pages: H2, an optional sub-line beneath it (the Investors results
 * head carries the quarter, "Q2 2027"), an optional note, and an optional green index numeral.
 * The numeral comes from the rendering parameter `SectionNumber`: leave it empty for unnumbered
 * heads (the Investors page dropped its numbers in the Nov 11, 2026 review).
 */
export function SectionHead({
  id,
  index,
  heading,
  sub,
  note,
}: {
  id: string;
  index?: string;
  heading: TextField;
  sub?: TextField;
  note?: TextField;
}) {
  return (
    <div className="dy-irp-head">
      <div className="dy-irp-head-title">
        <h2 id={id}>
          {index && (
            <span className="dy-irp-index" aria-hidden="true">
              {index}
            </span>
          )}
          <Text field={heading} />
        </h2>
        {sub?.value ? <Text tag="span" className="dy-irp-sub" field={sub} /> : null}
      </div>
      {note?.value ? <Text tag="p" field={note} /> : null}
    </div>
  );
}

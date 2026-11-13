import { Text, type TextField } from '@sitecore-content-sdk/nextjs';

/**
 * Numbered section head used by interior pages: green index numeral, H2, optional dated note.
 * The number comes from the rendering parameter `SectionNumber` so authors can reorder sections.
 */
export function SectionHead({ id, index, heading, note }: { id: string; index?: string; heading: TextField; note?: TextField }) {
  return (
    <div className="dy-irp-head">
      <h2 id={id}>
        {index && (
          <span className="dy-irp-index" aria-hidden="true">
            {index}
          </span>
        )}
        <Text field={heading} />
      </h2>
      {note?.value ? <Text tag="p" field={note} /> : null}
    </div>
  );
}

'use client';
import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Text, useSitecore, type TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { useSiteUI } from 'lib/site-ui';
import { Signal } from 'components/ui/Signal';
import { currentUtm, submitInquiry } from './submit';

/**
 * Let's get to work — the closing form (brief §4.10). A square toggle of four intents; each intent
 * asks only for its own fields. The Careers intent ("roles" behaviour) opens the roles drawer with
 * the trade and place instead of sending. If a company was selected on the map, the Customer
 * prompt names it. Submission goes through `submitInquiry()` (./submit.ts), which sends nothing
 * until the Sitecore Forms / CRM integration replaces it.
 *
 * Datasource template: Contact Form
 *   Heading, Prompt, IntentsLabel, Intents (Inquiry Intent items)
 *   NameLabel, EmailLabel, OptionalLabel, SelectPlaceholder
 *   SelectedCompanyLead, SelectedCompanyNote, SelectedCompanyMessage — `{company}` is replaced
 *   ThankYouHeading, ThankYouBody, SendAnotherLabel, ErrorMessage
 * Inquiry Intent: Key, Label, Prompt, SubmitLabel, Behavior ("inquiry" | "roles"), Fields (Inquiry Field items)
 * Inquiry Field: Name, Label, FieldType (text|email|tel|select|textarea), Required, FullWidth,
 *   AutoComplete, Placeholder, Options (Form Option items: Text, Value)
 */
type FormOption = { id?: string; fields: { Text: TextField; Value: TextField } };
type InquiryField = {
  id?: string;
  fields: {
    Name: TextField;
    Label: TextField;
    FieldType: TextField;
    Required: TextField;
    FullWidth: TextField;
    AutoComplete: TextField;
    Placeholder: TextField;
    Options?: FormOption[];
  };
};
type Intent = {
  id?: string;
  fields: { Key: TextField; Label: TextField; Prompt: TextField; SubmitLabel: TextField; Behavior: TextField; Fields: InquiryField[] };
};
type ContactFormFields = {
  Heading: TextField;
  Prompt: TextField;
  IntentsLabel: TextField;
  Intents: Intent[];
  NameLabel: TextField;
  EmailLabel: TextField;
  OptionalLabel: TextField;
  SelectPlaceholder: TextField;
  SelectedCompanyLead: TextField;
  SelectedCompanyNote: TextField;
  SelectedCompanyMessage: TextField;
  ThankYouHeading: TextField;
  ThankYouBody: TextField;
  SendAnotherLabel: TextField;
  ErrorMessage: TextField;
};
type ContactFormProps = ComponentProps & { fields: ContactFormFields };

const str = (f?: TextField) => ((f?.value as string) ?? '').toString();
const on = (f?: TextField) => ['1', 'true'].includes(str(f).toLowerCase());

function FieldControl({ field, labels, defaultValue, idPrefix }: {
  field: InquiryField;
  labels: { optional: string; select: string };
  defaultValue?: string;
  idPrefix: string;
}) {
  const f = field.fields;
  const name = str(f.Name);
  const type = str(f.FieldType) || 'text';
  const required = on(f.Required);
  const className = `dy-field${on(f.FullWidth) ? ' dy-field--full' : ''}`;
  const id = `${idPrefix}-${name}`;
  const common = {
    id,
    name,
    required,
    autoComplete: str(f.AutoComplete) || undefined,
    placeholder: str(f.Placeholder) || undefined,
  };
  const label = (
    <span>
      <Text field={f.Label} />
      {!required && <small>{labels.optional}</small>}
    </span>
  );
  if (type === 'select') {
    return (
      <label className={`${className} dy-select-label`} htmlFor={id}>
        {label}
        <select {...common} defaultValue="">
          <option value="" disabled>
            {labels.select}
          </option>
          {(f.Options ?? []).map((o, i) => (
            <option key={o.id ?? i} value={str(o.fields.Value) || str(o.fields.Text)}>
              {str(o.fields.Text)}
            </option>
          ))}
        </select>
        <ChevronDown className="dy-chevron" aria-hidden="true" />
      </label>
    );
  }
  if (type === 'textarea') {
    return (
      <label className={className} htmlFor={id}>
        {label}
        <textarea {...common} rows={3} defaultValue={defaultValue} />
      </label>
    );
  }
  return (
    <label className={className} htmlFor={id}>
      {label}
      <input {...common} type={type} />
    </label>
  );
}

export const Default = ({ fields, params, rendering }: ContactFormProps) => {
  const { openRoles, selectedCompany } = useSiteUI();
  const { page } = useSitecore();
  const intents = fields?.Intents ?? [];
  const [index, setIndex] = useState(0);
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const radios = useRef<(HTMLButtonElement | null)[]>([]);
  const base = `contact-${rendering.uid ?? 'form'}`;

  if (!fields || intents.length === 0) return null;
  const intent = intents[Math.min(index, intents.length - 1)];
  const key = str(intent.fields.Key);
  const roles = str(intent.fields.Behavior) === 'roles';
  const isCustomer = key === 'customer';
  const company = selectedCompany?.name ?? '';
  const withCompany = (f: TextField) => str(f).replace('{company}', company);

  const choose = (i: number, focus = false) => {
    setIndex(i);
    setSent(null);
    setError(false);
    if (focus) radios.current[i]?.focus();
  };

  // Radio-group keyboard model: arrows move and select, Home/End jump.
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in step) next = (index + step[e.key] + intents.length) % intents.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = intents.length - 1;
    if (next === null) return;
    e.preventDefault();
    choose(next, true);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries([...data.entries()].map(([k, v]) => [k, String(v).trim()]));
    if (roles) {
      openRoles({ trade: values.trade ?? '', location: values.location ?? '' });
      return;
    }
    setBusy(true);
    setError(false);
    const result = await submitInquiry({
      intent: key,
      values,
      operatingCompanyId: isCustomer ? selectedCompany?.id : undefined,
      origin: { site: page.siteName ?? '', pageUrl: window.location.href, utm: currentUtm() },
    });
    setBusy(false);
    if (result.ok) setSent(values.name ?? '');
    else setError(true);
  };

  const labels = { optional: str(fields.OptionalLabel), select: str(fields.SelectPlaceholder) };

  return (
    <section id={params?.RenderingIdentifier || 'contact'} className="dy-section dy-closing dy-dark">
      <div>
        <Text tag="h2" field={fields.Heading} />
      </div>
      <div>
        <Text tag="h3" id={`${base}-prompt`} field={fields.Prompt} />
        <div
          role="radiogroup"
          aria-label={str(fields.IntentsLabel) || undefined}
          className="dy-intents"
          onKeyDown={onKey}
        >
          {intents.map((item, i) => (
            <button
              key={item.id ?? i}
              ref={(el) => {
                radios.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={index === i}
              tabIndex={index === i ? 0 : -1}
              data-state={index === i ? 'on' : 'off'}
              onClick={() => choose(i)}
            >
              {str(item.fields.Label)}
            </button>
          ))}
        </div>
        <div className="dy-intent-panel" aria-live="polite">
          {sent !== null ? (
            <div className="dy-sent" role="status">
              <Signal />
              <h4>
                {str(fields.ThankYouHeading)}
                {sent ? `, ${sent}` : ''}.
              </h4>
              <Text tag="p" field={fields.ThankYouBody} />
              <button type="button" className="dy-text-link" onClick={() => setSent(null)}>
                {str(fields.SendAnotherLabel)}
              </button>
            </div>
          ) : (
            <>
              {isCustomer && company && (
                <p>
                  <strong>{withCompany(fields.SelectedCompanyLead)}</strong> {str(fields.SelectedCompanyNote)}
                </p>
              )}
              <Text tag="p" field={intent.fields.Prompt} />
              <form key={key} className="dy-contact-form" onSubmit={submit} aria-labelledby={`${base}-prompt`}>
                {!roles && (
                  <>
                    <label className="dy-field" htmlFor={`${base}-${key}-name`}>
                      <span>{str(fields.NameLabel)}</span>
                      <input id={`${base}-${key}-name`} name="name" autoComplete="name" required />
                    </label>
                    <label className="dy-field" htmlFor={`${base}-${key}-email`}>
                      <span>{str(fields.EmailLabel)}</span>
                      <input id={`${base}-${key}-email`} name="email" type="email" autoComplete="email" required />
                    </label>
                  </>
                )}
                {(intent.fields.Fields ?? []).map((field, i) => (
                  <FieldControl
                    key={field.id ?? i}
                    field={field}
                    labels={labels}
                    idPrefix={`${base}-${key}`}
                    defaultValue={
                      str(field.fields.Name) === 'message' && isCustomer && company ? withCompany(fields.SelectedCompanyMessage) : undefined
                    }
                  />
                ))}
                {error && (
                  <p className="dy-field--full dy-form-error" role="alert">
                    {str(fields.ErrorMessage)}
                  </p>
                )}
                <button type="submit" className="dy-button dy-button--inverse" disabled={busy}>
                  {str(intent.fields.SubmitLabel)} <ArrowRight size={17} aria-hidden="true" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

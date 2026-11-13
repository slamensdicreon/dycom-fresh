/**
 * Inquiry submission — INTEGRATION POINT.
 *
 * Today this sends nothing: it resolves as if the inquiry were accepted, so the designed thank-you
 * state can be reviewed. Replace the body with the Sitecore Forms / CRM integration Dycom chooses
 * (open item: "Inquiry form destination"). The requirements it must then meet:
 *   FRM0001  inquiry type changes the required fields and the routing
 *   FRM0002  notify CMS-configured recipients by inquiry type, operating company and state
 *   FRM0003  record originating site, operating company, page URL and UTMs  (collected below)
 *   FRM0006  inline validation, values kept on error, success message or thank-you redirect
 *   FRM0007  accessible, low-friction bot check
 *   FRM0008  store submissions in Sitecore with export and a retention period
 *   FRM0009  email Dycom and the operating company
 *   FRM0010  (post-MVP) push qualified customer inquiries to a CRM
 *   FRM0012  analytics events for start, success and error with form name and inquiry type
 * Keep the signature: the ContactForm rendering only depends on `{ ok }`.
 */
export type InquiryPayload = {
  /** Intent key authored on the Inquiry Intent item: customer · supplier · community. */
  intent: string;
  /** Every named form field, as entered. */
  values: Record<string, string>;
  /** Operating company the visitor selected on the map, if any. */
  operatingCompanyId?: string;
  /** FRM0003 origin data. */
  origin: { site: string; pageUrl: string; utm: Record<string, string> };
};

export type InquiryResult = { ok: boolean };

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResult> {
  if (process.env.NODE_ENV === 'development') {
    console.info('[ContactForm] inquiry not sent — no form destination is configured yet', payload);
  }
  return { ok: true };
}

/** UTM parameters from the current URL, for FRM0003. */
export function currentUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const utm: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (key.startsWith('utm_')) utm[key] = value;
  });
  return utm;
}

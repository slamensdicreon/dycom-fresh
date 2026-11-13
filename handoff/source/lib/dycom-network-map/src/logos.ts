// Operating-company logos. Each company's own header logo, taken from its
// website on 5 Nov 2026 (user decision: pull them from the company sites),
// trimmed to its visible bounds and reduced to at most 640×240, lives in App
// Storage under dycom/company-logos/<id>.png (SVG for National Technology
// Integrators), served by the API server's public-objects route like the
// photography library. Power Solutions publishes only a white logo; its white
// marks were recoloured Civic Blue so it reads on a light card.
//
// Upload or refresh with: LOGOS=<dir> pnpm --filter @workspace/scripts run upload:dycom-company-logos

/** Set at build time for a standalone (handoff) build of the Final Design Direction; undefined in the review workspace and in Node scripts. */
const MEDIA_BASE = (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_DYCOM_MEDIA_BASE;

/** Same-origin like the photography, so every Dycom site shares one URL; a standalone build reads them from its own media folder. */
export const COMPANY_LOGO_BASE = MEDIA_BASE ? `${MEDIA_BASE}company-logos/` : '/api/storage/public-objects/dycom/company-logos/';

/** Companies with a logo on file and the file's extension. Add an entry when a logo is uploaded. */
const LOGO_FILES: Record<string, 'png' | 'svg'> = {
  '3655': 'png', '3699': 'png', '3701': 'png', '3705': 'png', '3735': 'png', '3751': 'png', '3757': 'png', '3827': 'png', '3846': 'png', '3865': 'png',
  '3876': 'png', '3882': 'png', '3949': 'png', '3954': 'png', '3956': 'png', '3965': 'png', '3994': 'png', '4004': 'png', '4022': 'png', '4025': 'png',
  '4047': 'png', '4052': 'png', '4058': 'png', '4064': 'png', '4100': 'png', '4107': 'png', '4139': 'png', '4147': 'png', '4152': 'png', '4165': 'png',
  '4185': 'png', '4208': 'png', '4217': 'png', '7221': 'png', '7712': 'png', '7970': 'png', '8676': 'png', '8924': 'png', '9151': 'svg',
};

/** URL of a company's logo, or null when none is on file (callers fall back to the Dycom signal mark). */
export function companyLogo(id: string): string | null {
  const ext = LOGO_FILES[id];
  return ext ? `${COMPANY_LOGO_BASE}${id}.${ext}` : null;
}

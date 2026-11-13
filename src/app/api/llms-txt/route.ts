import scConfig from 'sitecore.config';
import client from 'lib/sitecore-client';

// Requirement RES0003: content is indexed for answer engines through llms.txt.
export async function GET() {
  const text = await client.getLlmsTxt({ siteName: scConfig.defaultSite });
  if (!text) return new Response('Not found', { status: 404 });
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

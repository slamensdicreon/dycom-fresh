import { NextRequest } from 'next/server';
import scConfig from 'sitecore.config';
import client from 'lib/sitecore-client';

export async function GET(req: NextRequest) {
  const xml = await client.getSiteMap({
    reqHost: req.headers.get('host') || 'localhost',
    reqProtocol: req.headers.get('x-forwarded-proto') || 'https',
    siteName: scConfig.defaultSite,
  });
  return new Response(xml, { headers: { 'Content-Type': 'text/xml;charset=utf-8' } });
}

import scConfig from 'sitecore.config';
import client from 'lib/sitecore-client';

export async function GET() {
  const robots = (await client.getRobots(scConfig.defaultSite)) ?? '';
  return new Response(robots, { headers: { 'Content-Type': 'text/plain' } });
}

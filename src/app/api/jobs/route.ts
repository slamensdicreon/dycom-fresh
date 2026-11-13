import { NextRequest } from 'next/server';
import { jobsProvider } from 'lib/jobs';

/**
 * GET /api/jobs?work=&location=&companyId=&department=
 * Open roles from the jobs provider. The roles drawer loads the full list once and filters in the
 * browser (≈1,000 requisitions, ~15 KB gzipped) so filtering is instant as a visitor types; the
 * query parameters serve other consumers such as future job-search and company pages.
 */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const result = await jobsProvider.search({
    work: p.get('work') ?? undefined,
    location: p.get('location') ?? undefined,
    companyId: p.get('companyId') ?? undefined,
    department: p.get('department') ?? undefined,
  });
  return Response.json(result, { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' } });
}

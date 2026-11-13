import 'server-only';
import { LocalJobsProvider } from './local-jobs-provider';
import type { JobsProvider } from './types';

/**
 * The one jobs source for the app. Replace `LocalJobsProvider` with a SuccessFactors provider when
 * the feed is connected; route handlers and server components only see `JobsProvider`.
 */
export const jobsProvider: JobsProvider = new LocalJobsProvider();

export type { Job, JobQuery, JobsResult, HiringCompany, JobsProvider } from './types';

'use client';
import { useEffect, useState } from 'react';
import { Text, useSitecore, type Field, type LinkField, type TextField } from '@sitecore-content-sdk/nextjs';
import { X } from 'lucide-react';
import type { ComponentProps } from 'lib/component-props';
import { SiteLink } from 'components/ui/links';
import { Signal } from 'components/ui/Signal';

/**
 * Results bar — after an earnings release the latest results and the call replay sit above the
 * site header on every page for a window of days, then the bar retires and the Investors page
 * carries the results again (Investors page review, November 11, 2026). A visitor can dismiss it
 * for the browser session.
 *
 * Visibility: `ForceShow` (review switch — on while Dycom reviews the bar), or today within
 * [ReleaseDate, ReleaseDate + WindowDays). Pages are statically rendered, so the server renders the
 * bar only when ForceShow is on; otherwise the browser decides after load, so a bar outside its
 * window never flashes. In the build ReleaseDate and the links come from the IR feed's latest
 * release (open decision D-IR); the Investors menu keeps a permanent "Latest results & call
 * replay" link independent of this bar.
 *
 * Datasource template: Results Bar — Label, Text, ReleaseLink, ReplayLink, ReleaseDate (ISO date),
 * WindowDays (integer), ForceShow (checkbox), RegionLabel, DismissLabel
 */
type ResultsBarFields = {
  Label: TextField;
  Text: TextField;
  ReleaseLink: LinkField;
  ReplayLink: LinkField;
  ReleaseDate: Field<string>;
  WindowDays: Field<string | number>;
  ForceShow: Field<boolean>;
  RegionLabel: TextField;
  DismissLabel: TextField;
};
type ResultsBarProps = ComponentProps & { fields: ResultsBarFields };

const DISMISS_KEY = 'dycom:results-bar-dismissed';

export function inResultsWindow(releaseIso: string | undefined, windowDays: number, now = new Date()): boolean {
  if (!releaseIso) return false;
  const start = new Date(`${releaseIso.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(start.getTime())) return false;
  const end = new Date(start);
  end.setDate(end.getDate() + windowDays);
  return now >= start && now < end;
}

export const Default = ({ fields }: ResultsBarProps) => {
  const { page } = useSitecore();
  const editing = page.mode.isEditing;
  const force = Boolean(fields?.ForceShow?.value) || editing;
  // 'server' until mounted: the first paint matches the static HTML (shown only when forced).
  const [state, setState] = useState<'server' | 'show' | 'hide'>('server');

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISS_KEY) === fields?.ReleaseDate?.value;
    } catch {
      /* storage blocked: the bar simply returns on the next page */
    }
    const days = Number(fields?.WindowDays?.value) || 14;
    const show = editing || (!dismissed && (force || inResultsWindow(fields?.ReleaseDate?.value, days)));
    setState(show ? 'show' : 'hide');
  }, [fields, force, editing]);

  const visible = state === 'server' ? force : state === 'show';
  if (!fields || !visible) return null;

  const dismiss = () => {
    setState('hide');
    try {
      // Keyed to the release, so the next quarter's bar shows even in the same session.
      window.sessionStorage.setItem(DISMISS_KEY, String(fields.ReleaseDate?.value ?? '1'));
    } catch {
      /* storage blocked */
    }
  };

  return (
    <div className="dy-results-bar" role="region" aria-label={(fields.RegionLabel?.value as string) || 'Latest results'}>
      <Signal />
      <p>
        <Text tag="strong" field={fields.Label} />
        <Text tag="span" field={fields.Text} />
      </p>
      <nav aria-label={`${(fields.RegionLabel?.value as string) || 'Latest results'} links`}>
        <SiteLink field={fields.ReleaseLink} />
        <SiteLink field={fields.ReplayLink} />
      </nav>
      <button
        type="button"
        className="dy-results-bar-close"
        aria-label={(fields.DismissLabel?.value as string) || 'Dismiss latest results'}
        onClick={dismiss}
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
};

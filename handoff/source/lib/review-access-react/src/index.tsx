import { ReactNode, useEffect, useState } from "react";
export { HomepageOnlyPreview } from "./HomepageOnlyPreview";

const icreonLogoUrl = new URL("./icreon-logo.svg", import.meta.url).href;

type AccessState = "checking" | "denied" | "locked" | "authorized";

export function ReviewAccessGate({
  children,
  conceptSlug,
}: {
  children: ReactNode;
  conceptSlug: string;
}) {
  const [state, setState] = useState<AccessState>("checking");

  useEffect(() => {
    let controller: AbortController | null = null;
    let pending = false;
    let disposed = false;
    setState("checking");
    const checkAccess = async () => {
      if (pending || disposed) return;
      pending = true;
      controller = new AbortController();
      try {
        const response = await fetch(`/api/concepts/${encodeURIComponent(conceptSlug)}/access`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        let next: AccessState = response.ok ? "authorized" : "denied";
        if (response.status === 403) {
          const body = await response.json();
          if (body.code === "CONCEPT_LOCKED") next = "locked";
        }
        if (!disposed) setState(next);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (!disposed) setState("denied");
      } finally {
        pending = false;
      }
    };
    const checkWhenVisible = () => {
      if (document.visibilityState === "visible") void checkAccess();
    };
    void checkAccess();
    const interval = window.setInterval(checkWhenVisible, 15_000);
    window.addEventListener("focus", checkWhenVisible);
    document.addEventListener("visibilitychange", checkWhenVisible);
    return () => {
      disposed = true;
      controller?.abort();
      window.clearInterval(interval);
      window.removeEventListener("focus", checkWhenVisible);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, [conceptSlug]);

  if (state === "authorized") {
    return <div className="review-access-root">{children}</div>;
  }

  return (
    <div className="review-access-root review-access-root-locked">
      <style>{styles}</style>
      <div className="review-access-overlay">
        {state === "checking" ? (
          <div className="review-access-checking" role="status">
            Checking project access…
          </div>
        ) : (
          <div className="review-access-card">
            <img className="review-access-brand" src={icreonLogoUrl} alt="Icreon" />
            <p className="review-access-kicker">Private concept review</p>
            <h1>{state === "locked" ? "Concept locked" : "Sign in required"}</h1>
            <p className="review-access-copy">
              {state === "locked"
                ? "Only administrators can open this concept. Your project access is unchanged."
                : "Open this concept from your authenticated review workspace."}
            </p>
            <a href="/">Open workspace</a>
            <p className="review-access-note">{state === "locked" ? "Administrator access only" : "Authorized project members only"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = `
.review-access-root{min-height:100%;position:relative}
.review-access-root-locked{width:100vw;height:100vh;overflow:hidden;background:#eef0f5}
.review-access-root-locked:before{position:absolute;inset:-12%;content:"";background:radial-gradient(circle at 23% 24%,rgba(55,103,255,.42),transparent 25%),radial-gradient(circle at 78% 65%,rgba(17,17,17,.34),transparent 28%),linear-gradient(135deg,#f8f9fb 20%,#dfe4f3 52%,#f8f9fb 82%);filter:blur(32px);transform:scale(1.08)}
.review-access-overlay{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;padding:24px;background:rgba(244,245,247,.38);backdrop-filter:blur(18px);font-family:"New Hero",Inter,ui-sans-serif,system-ui,sans-serif;color:#111}
.review-access-card{width:min(100%,420px);padding:36px;border:1px solid rgba(255,255,255,.8);border-radius:22px;background:rgba(255,255,255,.92);box-shadow:0 28px 90px rgba(18,27,54,.18)}
.review-access-brand{display:block;width:122px;height:auto;margin:-11px 0}
.review-access-kicker{margin:34px 0 10px;color:#3767ff;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
.review-access-card h1{margin:0;font-size:34px;line-height:1.05;letter-spacing:-.04em}
.review-access-copy{margin:14px 0 28px;color:#666b75;font-size:14px;line-height:1.55}
.review-access-card a{display:grid;height:48px;place-items:center;border-radius:10px;background:#3767ff;color:white;font-family:inherit;font-size:13px;font-weight:700;text-decoration:none}
.review-access-note{margin:20px 0 0;color:#9297a1;font-size:10px;letter-spacing:.11em;text-align:center;text-transform:uppercase}
.review-access-checking{padding:16px 20px;border-radius:999px;background:white;box-shadow:0 12px 40px rgba(18,27,54,.14);font-size:13px;font-weight:600}
@media(max-width:520px){.review-access-overlay{padding:16px}.review-access-card{padding:28px 22px;border-radius:18px}.review-access-kicker{margin-top:30px}.review-access-card h1{font-size:30px}}
`;
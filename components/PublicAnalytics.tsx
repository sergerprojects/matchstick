"use client";

import { useEffect, useState } from "react";

function publicPath(path: string): boolean {
  if (/\/(?:admin|api|auth|account|sign-in|signin|login)(?:\/|$)/.test(path)) return false;
  return /^\/matchstick(?:\/(?:[a-z0-9-]+|(?:stories|projects|editions)\/[a-z0-9-]+))?\/?$/.test(path);
}

/** Production-only anonymous page/performance counts. No app data or identities. */
export function PublicAnalytics() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const privacy = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (location.hostname !== "sergerprojects.github.io" || location.search || location.hash ||
        !publicPath(location.pathname) || privacy.globalPrivacyControl ||
        navigator.doNotTrack === "1") return;
    // A private same-site referrer must not be sent to an external collector.
    if (document.referrer) {
      try {
        const referrer = new URL(document.referrer);
        if (referrer.search || referrer.hash || referrer.username || referrer.password ||
            (referrer.origin !== location.origin && referrer.pathname !== "/") ||
            (referrer.origin === location.origin && !publicPath(referrer.pathname))) return;
      } catch { return; }
    }
    if (document.getElementById("public-cloudflare-analytics")) return;
    const script = document.createElement("script");
    script.id = "public-cloudflare-analytics";
    script.type = "module";
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.dataset.cfBeacon = JSON.stringify({ token: "c5eff3caa1a447ff85d43245c6361ae0", spa: true });
    script.referrerPolicy = "strict-origin";
    document.body.appendChild(script);
    setEnabled(true);
  }, []);
  return enabled ? <p style={{ padding: "1rem", textAlign: "center", fontSize: "0.75rem" }}>Anonymous page and performance counts. No analytics cookies, visitor profiles or recordings. <a href="https://developers.cloudflare.com/speed/observatory/rum-beacon/#privacy-information" target="_blank" rel="noreferrer">Privacy details</a></p> : null;
}

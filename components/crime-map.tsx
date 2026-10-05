'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight, Maximize2, ShieldCheck } from 'lucide-react';

// Wadsworth's official map link, checked October 5, 2026:
// https://www.wadsworthcity.com/909/LexisNexis-Community-Crime-Map
const providerUrl = 'https://communitycrimemap.com/?agency-jump-dropdown=OH%20-%20Wadsworth';

export default function CrimeMap() {
  const panel = useRef<HTMLDivElement>(null);
  const [fullscreenUnavailable, setFullscreenUnavailable] = useState(false);

  async function expandMap() {
    try {
      if (!panel.current?.requestFullscreen) throw new Error('Fullscreen unavailable');
      await panel.current.requestFullscreen();
    } catch {
      setFullscreenUnavailable(true);
    }
  }

  return (
    <section className="crime-map-section" aria-labelledby="crime-map-heading">
      <div className="crime-map-heading">
        <div>
          <span className="kicker"><ShieldCheck size={15} /> Around your neighborhood</span>
          <h2 id="crime-map-heading">The local crime map.</h2>
          <p>Explore reported incidents here. Use the map’s date and event filters to choose what you see.</p>
        </div>
        <button className="outline-button" onClick={expandMap}><Maximize2 size={15} /> Expand map</button>
      </div>

      <div className="crime-map-frame" ref={panel}>
        <iframe
          src={providerUrl}
          title="LexisNexis Community Crime Map — Wadsworth, Ohio"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      <div className="crime-map-credit">
        <p>Live provider view · LexisNexis Community Crime Map. The provider may ask you to accept its terms before displaying the map.</p>
        <a href={providerUrl} target="_blank" rel="noopener noreferrer">Trouble loading? Open the provider view <ArrowUpRight size={13} /><span className="sr-only"> (opens in a new tab)</span></a>
      </div>
      <p className="crime-map-context">This map shows selected reports shared by participating agencies, not every crime. Check the map’s reporting period and coverage before comparing areas. An incident report is not a conviction.</p>
      {fullscreenUnavailable && <p className="small-note" role="status">Full-screen view is unavailable in this browser. You can still pan, zoom and filter the map here.</p>}
    </section>
  );
}

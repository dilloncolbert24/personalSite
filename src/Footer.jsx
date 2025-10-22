import React, { useMemo, useState } from 'react';
import headshot from './bayWheels_image.webp';

const MODE_OPTIONS = ['Walk', 'Bike', 'Transit', 'Car', 'Rideshare', 'Other'];

function makeMonthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/* Link lists (edit to your taste) */
const FOOTER_LINK_GROUPS = [
  {
    title: 'Organizations',
    links: [
      { label: 'NACTO', href: 'https://nacto.org' },
      { label: 'Strong Towns', href: 'https://www.strongtowns.org' },
      { label: 'TransitCenter', href: 'https://transitcenter.org' },
      { label: 'Rails-to-Trails Conservancy', href: 'https://www.railstotrails.org' },
      { label: 'PeopleForBikes', href: 'https://www.peopleforbikes.org' },
    ],
  },
  {
    title: 'Policy & Data',
    links: [
      { label: 'USDOT BTS', href: 'https://www.bts.gov' },
      { label: 'FHWA MUTCD', href: 'https://mutcd.fhwa.dot.gov' },
      { label: 'EPA MOVES', href: 'https://www.epa.gov/moves' },
      { label: 'NHTS', href: 'https://nhts.ornl.gov' },
      { label: 'OpenStreetMap', href: 'https://www.openstreetmap.org' },
    ],
  },
  {
    title: 'Design & Inspiration',
    links: [
      { label: 'Streetmix', href: 'https://streetmix.net' },
      { label: 'Human Transit (blog)', href: 'https://humantransit.org' },
      { label: 'CityLab', href: 'https://www.bloomberg.com/citylab' },
      { label: 'Urban Observatory', href: 'https://urbanobservatory.org' },
      { label: 'Urban Design Group', href: 'https://www.udg.org.uk' },
    ],
  },
  {
    title: 'Local / STL',
    links: [
      { label: 'Metro Transit', href: 'https://www.metrostlouis.org' },
      { label: 'Trailnet', href: 'https://trailnet.org' },
      { label: 'Great Rivers Greenway', href: 'https://greatriversgreenway.org' },
      { label: 'East-West Gateway COG', href: 'https://www.ewgateway.org' },
      { label: 'MoDOT Projects', href: 'https://www.modot.org' },
    ],
  },
];

/* Simple external link renderer */
const ExternalFooterLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 text-white/90 hover:text-white underline-offset-4 hover:underline"
  >
    <span>{children}</span>
    {/* external icon removed to keep things cleaner here; add if you want */}
  </a>
);

const Footer = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  React.useEffect(() => {
    const onResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const monthKey = useMemo(() => makeMonthKey(), []);
  const defaultCounts = useMemo(
    () => MODE_OPTIONS.reduce((acc, m) => { acc[m] = 0; return acc; }, {}),
    []
  );

  const [modeCounts, setModeCounts] = useState(() => {
    if (typeof window === 'undefined') return defaultCounts;
    const raw = window.localStorage.getItem(`modePoll:${monthKey}:counts`);
    return raw ? JSON.parse(raw) : defaultCounts;
  });

  const [hasVoted, setHasVoted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(`modePoll:${monthKey}:voted`) === '1';
  });

  const handleVote = (mode) => {
    if (hasVoted) return;
    const next = { ...modeCounts, [mode]: (modeCounts[mode] || 0) + 1 };
    setModeCounts(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`modePoll:${monthKey}:counts`, JSON.stringify(next));
      window.localStorage.setItem(`modePoll:${monthKey}:voted`, '1');
    }
    setHasVoted(true);
  };

  const totalVotes = Object.values(modeCounts).reduce((a, b) => a + b, 0);

  return (
    <footer className="bg-[#0a0b1d] pt-8 md:pt-16 relative z-40 isolate pointer-events-auto" id="contact">
      <div className="container max-w-screen-xl mx-auto px-4">
        {/* Upper band: Left = Title + Headshot, Right = Poll */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-14">
          {/* LEFT: Title + Headshot + email (centered under photo) */}
          <div className="order-1 flex flex-col items-center text-center gap-4 md:gap-6">
            <span className="text-4xl md:text-7xl text-white border-b-4 border-[#8544ff] font-bold pb-1">
              Connect with me!
            </span>

            <a
              href="mailto:c.dillon@wustl.edu"
              aria-label="Email Dillon Colbert"
              title="Click the photo to email me"
              className="block"
            >
              <img
                src={headshot}
                alt="Dillon Colbert"
                className="w-44 h-44 md:w-64 md:h-64 rounded-full object-cover object-center border border-white/20 shadow-lg transition duration-700 cursor-pointer hover:scale-[1.02]"
              />
            </a>

            <span className="inline-flex items-center text-[11px] md:text-xs px-2 py-0.5 rounded-full bg-[#8544ff] text-white shadow whitespace-nowrap">
              Click photo to email me
            </span>

            <p className="text-white/70 text-sm">
              Or email:{" "}
              <a className="underline hover:text-[#8544ff]" href="mailto:c.dillon@wustl.edu">
                c.dillon@wustl.edu
              </a>
            </p>
          </div>

          {/* RIGHT: Poll (even spacing between headshot and page edge) */}
          <div className="order-2 flex-1 min-w-0 w-full md:ml-12 lg:ml-16 xl:ml-20 max-w-3xl">
            <p className="text-lg md:text-xl text-white mb-2">
              How did you get to work today?
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {MODE_OPTIONS.map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleVote(mode)}
                  disabled={hasVoted}
                  className={`px-3 py-1 rounded-full border transition ${
                    hasVoted ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#8544ff]/20'
                  } border-[#8544ff] text-white text-sm md:text-base`}
                  aria-label={`Vote for ${mode}`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="w-full max-w-2xl">
              {totalVotes === 0 ? (
                <p className="text-white/70 text-sm">
                  Be the first to vote. This resets monthly and stays on your device.
                </p>
              ) : (
                <div className="space-y-2" aria-live="polite">
                  {MODE_OPTIONS.map((mode) => {
                    const count = modeCounts[mode] || 0;
                    const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
                    return (
                      <div key={mode} className="flex items-center gap-3">
                        <div className="w-20 text-white/90 text-sm">{mode}</div>
                        <div className="flex-1">
                          <div className="h-2 rounded bg-white/15 overflow-hidden">
                            <div
                              className="h-2 rounded bg-[#8544ff]"
                              style={{ width: `${pct}%` }}
                              aria-label={`${mode}: ${count} (${pct}%)`}
                            />
                          </div>
                        </div>
                        <div className="w-16 text-right text-white/70 text-sm tabular-nums">
                          {pct}%
                        </div>
                      </div>
                    );
                  })}
                  <div className="text-white/70 text-xs mt-1">
                    Total votes this month: {totalVotes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lower band: link lists */}
        <div className="mt-12 md:mt-16 border-t border-white/10 pt-8 md:pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {FOOTER_LINK_GROUPS.map(({ title, links }) => (
              <section key={title} aria-labelledby={`${title.replace(/\s+/g, '-')}-heading`}>
                <h3
                  id={`${title.replace(/\s+/g, '-')}-heading`}
                  className="text-2xl font-semibold text-white mb-4"
                >
                  {title}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((l) => (
                    <li key={l.href}>
                      <ExternalFooterLink href={l.href}>{l.label}</ExternalFooterLink>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

        <div className="mt-10 text-white/50 text-sm">
            © {new Date().getFullYear()} Dillon Colbert. Designed in Visual Studio Code.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useEffect, useState } from 'react';
import { AiOutlineArrowDown } from 'react-icons/ai';

const Hero = () => {
  const [warmingC, setWarmingC] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const maxScale = 2.0; // upper bound for the display in °C

  // Robustly extract the latest monthly anomaly from the API's real shapes
  const extractLatestAnomaly = (data) => {
    try {
      // Primary shape from the API: { result: [ { time, station, land, ocean } , ... ] }
      const arr =
        (Array.isArray(data?.result) && data.result.length && data.result) ||
        (Array.isArray(data?.monthlyAnomaly) && data.monthlyAnomaly) ||
        [];

      if (arr.length) {
        const last = arr[arr.length - 1];
        const keys = ['anomaly', 'value', 'land', 'ocean', 'station', 'global', 'current'];
        for (const k of keys) {
          const v = Number(last?.[k] ?? data?.[k]);
          if (Number.isFinite(v)) return v;
        }
      }

      if (typeof data?.global === 'number') return data.global;
      if (typeof data?.current === 'number') return data.current;
      return null;
    } catch {
      return null;
    }
  };

  // Fetch with timeout, cache-busting, and "don't wipe last good value"
  const fetchWarming = async (opts = {}) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000); // 6s timeout

    try {
      setIsLoading(true);
      setError(null);

      const resp = await fetch('https://global-warming.org/api/temperature-api', {
        signal: ctrl.signal,
        cache: 'no-store',
        ...opts,
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      const latest = extractLatestAnomaly(data);
      if (!Number.isFinite(latest)) throw new Error('Unexpected data format');

      setWarmingC(latest);
      return true; // success
    } catch (err) {
      console.error('Failed to fetch warming data:', err);
      if (warmingC == null) setError('Could not load latest climate value.');
      return false; // failure (so caller can decide to retry)
    } finally {
      clearTimeout(t);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let retryMs = 30000; // 30s, backs off to 5m
    let stopped = false;

    const tryFetch = async () => {
      const ok = await fetchWarming();
      if (!stopped && !ok) {
        setTimeout(tryFetch, retryMs);
        retryMs = Math.min(retryMs * 2, 5 * 60 * 1000);
      }
    };

    tryFetch(); // initial load
    const daily = setInterval(fetchWarming, 1000 * 60 * 60 * 24); // refresh daily
    return () => {
      stopped = true;
      clearInterval(daily);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const percent =
    warmingC !== null
      ? Math.max(0, Math.min(100, (warmingC / maxScale) * 100))
      : 0;

  return (
    <div className="relative h-screen w-full" id="hero">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        autoPlay
        loop
        muted
      >
        <source src="trainVideo.mp4" type="video/mp4" />
      </video>

      {/* Grid layout balances space above content and above the arrow */}
      <div className="absolute inset-0 text-white">
        <div className="mx-auto h-full max-w-5xl px-4">
          {/* 1fr (top spacer) / auto (content) / 1fr (arrow area) */}
          <div className="grid h-full grid-rows-[1fr_auto_1fr]">
            <div />

            {/* Center content */}
            <div className="flex flex-col items-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 md:mb-10 text-center">
              Dillon Colbert
              </h1>

              {/* Bio (smaller text, tidy spacing) */}
              <p className="mt-4 sm:mt-6 md:mt-8 mb-6 sm:mb-8 md:mb-10 text-xs sm:text-sm md:text-base max-w-2xl text-center leading-relaxed opacity-90">
                College graduate actively researching sustainable transportation, 
                transit-oriented development, parking reform, and green infrastructure, 
                among other urbanism-related solutions in the public realm. 
                With a background in Environmental Engineering, I work to decarbonize the transportation sector and reimagine how cities are designed. 
                <i><b>
                <br /><br />
                <span
                  className="inline-block px-2 sm:px-2.5 py-0.5 rounded-md bg-black/55 backdrop-blur-sm ring-1 ring-black/50 shadow-[0_2px_8px_rgba(0,0,0,0.6)] text-[#ff2d55]"
                  style={{
                    WebkitTextStroke: "0.6px rgba(0,0,0,0.6)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.8)"
                  }}
                >
                  There is no time to wait. Let&apos;s design cities for people, not cars.
                </span>
              </b></i>


              </p>
              {/* Global warming indicator */}
              <div className="mt-8 sm:mt-10 md:mt-8 w-full flex flex-col items-center">
                <div className="backdrop-blur-sm bg-white/10 border border-white/15 rounded-2xl px-4 py-3 shadow-lg max-w-md w-full">
                  <div className="flex items-end justify-between text-[10px] sm:text-xs opacity-90">
                    <span>0°C</span>
                    <span>{maxScale.toFixed(1)}°C</span>
                  </div>

                  <div className="relative mt-1 h-2 rounded-full overflow-hidden bg-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-amber-300 to-rose-500 opacity-90" />
                    {/* Marker */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                      style={{ left: `${percent}%` }}
                      aria-hidden="true"
                    >
                      <div className="h-4 w-[2px] bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="opacity-80">
                      Global warming since pre-industrial (latest monthly)
                    </span>
                    <span className="font-semibold">
                      {isLoading && warmingC == null
                        ? 'Loading…'
                        : warmingC != null
                          ? `${warmingC.toFixed(2)}°C`
                          : '—'}
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-[10px] sm:text-xs opacity-70 text-center max-w-md">
                  Data from a public climate API. Values update as new monthly data is released.
                </p>

                {error && (
                  <p className="mt-2 text-[10px] sm:text-xs text-red-300">
                    {error}
                  </p>
                )}
              </div>
            </div>

            {/* Arrow area with generous padding from bottom */}
            <div className="flex items-end justify-center pb-12 sm:pb-16">
              <button
                type="button"
                className="z-50 cursor-pointer animate-bounce"
                onClick={handleScrollDown}
                aria-label="Scroll down"
              >
                <AiOutlineArrowDown size={60} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-[#0a0b1d] to-transparent"></div>
    </div>
  );
};

export default Hero;

import React, { useEffect, useState, useRef } from 'react';
import { AiOutlineArrowDown } from 'react-icons/ai';

const Hero = () => {
  const [warmingC, setWarmingC] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const maxScale = 2.0; // upper bound for the display in °C

  const extractLatestAnomaly = (data) => {
    try {
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

  const fetchWarming = async (opts = {}) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
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
      return true;
    } catch (err) {
      console.error('Failed to fetch warming data:', err);
      if (warmingC == null) setError('Could not load latest climate value.');
      return false;
    } finally {
      clearTimeout(t);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let retryMs = 30000;
    let stopped = false;
    const tryFetch = async () => {
      const ok = await fetchWarming();
      if (!stopped && !ok) {
        setTimeout(tryFetch, retryMs);
        retryMs = Math.min(retryMs * 2, 5 * 60 * 1000);
      }
    };
    tryFetch();
    const daily = setInterval(fetchWarming, 1000 * 60 * 60 * 24);
    return () => {
      stopped = true;
      clearInterval(daily);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Nudge autoplay reliably across browsers (esp. iOS Safari)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const ensurePlay = () => {
      const p = v.play?.();
      if (p && typeof p.then === 'function') {
        p.catch(() => {
          // If autoplay is still blocked, we still avoid showing controls.
          // No-op: background video is purely decorative.
        });
      }
    };

    if (v.readyState >= 2) ensurePlay();
    else v.addEventListener('loadeddata', ensurePlay, { once: true });

    return () => v.removeEventListener?.('loadeddata', ensurePlay);
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const percent =
    warmingC !== null ? Math.max(0, Math.min(100, (warmingC / maxScale) * 100)) : 0;

  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden" id="hero">
      {/* Hide any native control chrome defensively */}
      <style>{`
        video.no-controls::-webkit-media-controls { display: none !important; }
        video.no-controls::-webkit-media-controls-enclosure { display: none !important; }
      `}</style>

      <video
        ref={videoRef}
        className="no-controls absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
        aria-hidden="true"
        onContextMenu={(e) => e.preventDefault()}
        poster="trainPoster.jpg"
      >
        {/* Provide both sources; Safari prefers MP4, others may pick WebM */}
        <source src="trainVideo.webm" type="video/webm" />
        <source src="trainVideo.mp4" type="video/mp4" />
      </video>

      {/* Content */}
      <div className="absolute inset-0 text-white">
        <div className="mx-auto h-full max-w-5xl px-3 sm:px-4">
          <div className="grid h-full grid-rows-[1fr_auto_1fr]">
            <div />
            <div className="flex flex-col items-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 md:mb-10 text-center leading-tight">
                Dillon Colbert
              </h1>

              <p className="mt-4 sm:mt-6 md:mt-8 mb-6 sm:mb-8 md:mb-10 text-[13px] sm:text-sm md:text-base max-w-2xl text-center leading-relaxed opacity-90">
                College graduate actively researching sustainable transportation,
                transit-oriented development, parking reform, and green infrastructure,
                among other urbanism-related solutions in the public realm.
                With a background in Environmental Engineering, I work to decarbonize the transportation sector and reimagine how cities are designed.
                <i><b>
                  <br /><br />
                  <span
                    className="inline-block px-2 sm:px-2.5 py-0.5 rounded-md bg-black/55 backdrop-blur-sm ring-1 ring-black/50 shadow-[0_2px_8px_rgba(0,0,0,0.6)] text-[#ff2d55]"
                    style={{
                      WebkitTextStroke: '0.6px rgba(0,0,0,0.6)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
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

            {/* Arrow area with safe-area friendly padding */}
            <div className="flex items-end justify-center pb-12 sm:pb-16 md:pb-20 [padding-bottom:calc(env(safe-area-inset-bottom)+3.5rem)]">
              <button
                type="button"
                className="z-50 cursor-pointer touch-manipulation animate-bounce"
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
      <div className="pointer-events-none absolute bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-[#0a0b1d] to-transparent" />
    </div>
  );
};

export default Hero;

import React, { useEffect, useState, useRef } from 'react';
import { AiOutlineArrowDown } from 'react-icons/ai';

const Hero = () => {
  const [warmingC, setWarmingC] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const maxScale = 2.0; 

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
      return typeof data?.global === 'number' ? data.global : (typeof data?.current === 'number' ? data.current : null);
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
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const ensurePlay = () => {
      const p = v.play?.();
      if (p && typeof p.then === 'function') p.catch(() => {});
    };
    if (v.readyState >= 2) ensurePlay();
    else v.addEventListener('loadeddata', ensurePlay, { once: true });
    return () => v.removeEventListener?.('loadeddata', ensurePlay);
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const percent = warmingC !== null ? Math.max(0, Math.min(100, (warmingC / maxScale) * 100)) : 0;

  return (
    /* 1. Added bg-[#0a0b1d] so the site looks good even without the video */
    <div className="relative min-h-[100svh] w-full overflow-hidden bg-[#0a0b1d]" id="hero">
      <style>{`
        video.no-controls::-webkit-media-controls { display: none !important; }
        video.no-controls::-webkit-media-controls-enclosure { display: none !important; }
      `}</style>

      {/* 2. Set opacity and z-index to keep the video in the background */}
      <video
        ref={videoRef}
        className="z-0 no-controls absolute inset-0 h-full w-full object-cover pointer-events-none select-none opacity-50"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        aria-hidden="true"
      >
        <source src="/trainVideo.webm" type="video/webm" />
        <source src="/trainVideo.mp4" type="video/mp4" />
      </video>

      {/* 3. Dark overlay to ensure white text is readable against a busy video */}
      <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />

      <div className="z-20 relative h-full w-full text-white">
        <div className="mx-auto h-full max-w-5xl px-3 sm:px-4">
          <div className="grid h-full grid-rows-[1fr_auto_1fr] min-h-[100svh]">
            <div />
            
            <div className="flex flex-col items-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 text-center leading-tight">
                Dillon Colbert
              </h1>

              <p className="mt-4 sm:mt-6 mb-6 text-sm md:text-base max-w-2xl text-center leading-relaxed opacity-95">
                Masters student in Urban Data Science actively researching sustainable transportation,
                transit-oriented development, and parking reform. With a background in Environmental Engineering, 
                I work to decarbonize the transportation sector and reimagine how cities are designed.
                <br /><br />
                <i><b>
                  <span className="inline-block px-3 py-1 rounded-md bg-black/60 backdrop-blur-md ring-1 ring-white/10 shadow-xl text-[#ff2d55]">
                    There is no time to wait. Let&apos;s design cities for people, not cars.
                  </span>
                </b></i>
              </p>

              {/* Climate Widget */}
              <div className="mt-8 w-full flex flex-col items-center">
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-3 shadow-2xl max-w-md w-full">
                  <div className="flex items-end justify-between text-[10px] sm:text-xs opacity-90">
                    <span>0°C</span>
                    <span>{maxScale.toFixed(1)}°C</span>
                  </div>
                  <div className="relative mt-1 h-2 rounded-full overflow-hidden bg-gray-800">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-amber-300 to-rose-500 opacity-90" />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                      style={{ left: `${percent}%` }}
                    >
                      <div className="h-4 w-[2px] bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="opacity-80">Global warming (latest monthly)</span>
                    <span className="font-semibold">
                      {isLoading && warmingC == null ? 'Loading…' : warmingC != null ? `${warmingC.toFixed(2)}°C` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-center pb-12 sm:pb-20">
              <button
                type="button"
                className="z-50 cursor-pointer animate-bounce hover:text-[#ff2d55] transition-colors"
                onClick={handleScrollDown}
              >
                <AiOutlineArrowDown size={60} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-[#0a0b1d] to-transparent z-10" />
    </div>
  );
};

export default Hero;
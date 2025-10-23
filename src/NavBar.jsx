"use client";

import React, { useState } from "react";
import {
  FaXmark,
  FaEnvelope,
  FaCity,
  FaMap,
  FaMusic,
  FaDownload,
} from "react-icons/fa6";
import Lottie from "lottie-react";
import cyclistAnimation from "./assets/cyclist.json";

// Replace with your public Zotero collection/folder URL
const ZOTERO_URL =
  "https://www.zotero.org/yourname/collections/your-collection-id";

const NAV_ITEMS = [
  { label: "MAP", href: "#blueprint", Icon: FaMap },
  { label: "PROJECTS", href: "#projects", Icon: FaCity },
  { label: "CONTACT", href: "#contact", Icon: FaEnvelope },
];

const SKYLINE_IMG = "/skyline.png";

const NOW_PLAYING_STATIC = {
  isPlaying: true,
  title: "Midnight Rendezvous",
  artist: "Casiopea",
  album: "Mint Jams",
  artworkSrc: "/album1.png",
  url: "https://music.apple.com/us/album/here-we-go/1585686346?i=1585686607",
};

const NowPlayingStatic = ({ data = NOW_PLAYING_STATIC }) => {
  const { isPlaying, title, artist, album, artworkSrc, url } = data;

  const pill = (
    <div className="group flex items-center gap-2 rounded-full px-3 h-10 bg-white/5 hover:bg-white/10 text-white transition border border-white/10">
      {artworkSrc ? (
        <img
          src={artworkSrc}
          alt={`${album || title} album cover`}
          className="w-8 h-8 rounded-sm object-cover ring-1 ring-white/20 shrink-0"
        />
      ) : (
        <FaMusic className="opacity-80 shrink-0" aria-hidden="true" />
      )}

      <div className="min-w-0 leading-tight">
        <div className="text-[9px] font-medium truncate">{title}</div>
        {artist ? (
          <div className="text-[8px] text-white/70 truncate">{artist}</div>
        ) : null}
      </div>

      <div
        className={`ml-1 flex items-end gap-[2px] ${isPlaying ? "eq eq-on" : "opacity-60"}`}
        aria-hidden="true"
      >
        <span className="eq-bar h-2 w-[2px] bg-white/80 rounded-sm" />
        <span className="eq-bar h-3 w-[2px] bg-white/80 rounded-sm" />
        <span className="eq-bar h-2 w-[2px] bg-white/80 rounded-sm" />
      </div>
    </div>
  );

  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0">
      {pill}
    </a>
  ) : (
    <div className="shrink-0">{pill}</div>
  );
};

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState("MAP");

  const toggleMenu = () => setIsMenuOpen((s) => !s);

  return (
    <div className="fixed top-0 left-0 w-full z-20 pt-2">
      <div className="max-w-screen-xl mx-auto px-2">
        {/* change: overflow-visible on mobile to avoid clipping; keep original overflow-hidden from md+ */}
        <div className="relative bg-[#0a0b1d]/70 backdrop-blur-md rounded-lg shadow-lg overflow-visible md:overflow-hidden">
          <div className="flex items-center gap-3 px-3 py-1 relative">
            {/* Initials badge */}
            <a
              href="#top"
              className="w-12 h-12 rounded-full bg-[#38b000] flex items-center justify-center text-white font-bold text-lg shadow-md select-none z-10"
              aria-label="Go to top"
            >
              DC
            </a>

            {/* Track with skyline image and road — DO NOT CHANGE */}
            <div className="relative flex-1 hidden md:block pointer-events-none h-24 overflow-visible self-center">
              <div
                className="skyline-img"
                style={{ backgroundImage: `url(${SKYLINE_IMG})` }}
                aria-hidden="true"
              />
              <div className="road" aria-hidden="true" />
              <div className="cyclist" aria-hidden="true">
                <Lottie animationData={cyclistAnimation} loop autoplay style={{ height: 50 }} />
              </div>
            </div>

            {/* Right cluster: nav tiles + Résumé */}
            <div className="hidden md:flex items-start gap-2 relative z-10 ml-auto">
              {/* Nav tiles */}
              <nav className="flex flex-wrap items-center gap-2 justify-end">
                {NAV_ITEMS.map(({ label, href, Icon, external }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => {
                      if (!external) setActive(label);
                    }}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className={`btn-outline inline-flex items-center gap-2 rounded-full px-3 h-10 text-sm font-semibold tracking-wide leading-none ${
                      active === label ? "ring-2 ring-[#38b000]/40" : ""
                    }`}
                  >
                    <Icon aria-hidden="true" className="opacity-90" />
                    <span className="whitespace-nowrap">{label}</span>
                  </a>
                ))}
              </nav>

              {/* Résumé */}
              <div className="flex flex-col items-end gap-2">
                <a
                  href="/resume.pdf"
                  download
                  className="btn-outline inline-flex items-center gap-2 rounded-full px-3 h-10 text-sm font-semibold tracking-wide leading-none"
                >
                  <FaDownload aria-hidden="true" />
                  <span className="uppercase">RESUME</span>
                </a>
              </div>

              {/* Compact Now Playing at the far right */}
              <NowPlayingStatic />
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={toggleMenu}
              className="md:hidden ml-auto flex items-center justify-center w-10 h-10 rounded border border-white/70 text-white hover:text-[#38b000] hover:border-[#38b000] transition"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <FaXmark className="text-xl" />
              ) : (
                <div className="space-y-1.5">
                  <span className="block w-6 h-0.5 bg-current"></span>
                  <span className="block w-6 h-0.5 bg-current"></span>
                  <span className="block w-6 h-0.5 bg-current"></span>
                </div>
              )}
            </button>
          </div>

          {/* Mobile dropdown */}
          {isMenuOpen && (
            <div className="md:hidden flex flex-col items-stretch gap-2 px-3 pb-4">
              {NAV_ITEMS.map(({ label, href, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => {
                    if (!external) setActive(label);
                    setIsMenuOpen(false);
                  }}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="btn-outline flex items-center gap-3 rounded-full px-3 py-2 leading-none"
                >
                  <Icon aria-hidden="true" className="opacity-90" />
                  <span>{label}</span>
                </a>
              ))}

              <a
                href="/resume.pdf"
                download
                className="btn-outline flex items-center justify-center gap-2 rounded-full px-3 py-2 leading-none"
              >
                <FaDownload aria-hidden="true" />
                <span className="uppercase">DOWNLOAD RESUME</span>
              </a>

              {/* Compact Now Playing */}
              <div className="mt-1">
                <NowPlayingStatic />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Styles used by buttons and visuals */}
      <style>{`
        :root {
          --cyclist-w: 80px;
          --road-h: 10px;
          --ride-extra: 30px;
          --cyclist-drop: 16px;
        }

        .btn-outline {
          color: #b5ffb8;
          background: transparent;
          border: 1px solid rgba(56,176,0,0.65);
          box-shadow: 0 0 0 1px rgba(56,176,0,0.25) inset;
          transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
        }
        .btn-outline:hover {
          background: rgba(56,176,0,0.12);
          color: #ffffff;
          border-color: rgba(56,176,0,0.9);
        }

        /* SKYLINE — do not change */
        .skyline-img {
          position: absolute;
          inset: 0;
          transform: translateY(calc(1.75 * var(--road-h) - 6px));
          background-size: 72% auto;
          background-repeat: no-repeat;
          background-position: center bottom;
          z-index: -1;
        }

        .road {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: var(--road-h);
          z-index: 4;

          /* green bike-lane surface */
          background-color: #38b000;

          /* thin white edge lines (top & bottom) */
          background-image: linear-gradient(
            to bottom,
            #ffffff 2px,
            transparent 2px calc(100% - 2px),
            #ffffff calc(100% - 2px)
          );
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }

        .road::after {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          height: 1.5px; /* thin center stripe */
          background-image: repeating-linear-gradient(
            to right,
            #ffd700 0 8px,      /* dash length */
            transparent 8px 20px /* gap */
          );
          pointer-events: none;
        }

        .cyclist {
          position: absolute;
          bottom: calc(var(--road-h) - var(--cyclist-drop));
          left: 0;
          transform: scaleX(1);
          animation: ride-loop 12s linear infinite;
          will-change: left, transform;
          z-index: 5;
        }
        @keyframes ride-loop {
          0%   { left: 0%; transform: scaleX(1); }
          45%  { left: calc(100% - var(--cyclist-w) + var(--ride-extra)); transform: scaleX(1); }
          50%  { left: calc(100% - var(--cyclist-w) + var(--ride-extra)); transform: scaleX(-1); }
          95%  { left: 0%; transform: scaleX(-1); }
          100% { left: 0%; transform: scaleX(1); }
        }

        .eq-on .eq-bar:nth-child(1) { animation: eq-bounce 1s ease-in-out infinite; }
        .eq-on .eq-bar:nth-child(2) { animation: eq-bounce 1s ease-in-out .15s infinite; }
        .eq-on .eq-bar:nth-child(3) { animation: eq-bounce 1s ease-in-out .3s infinite; }
        @keyframes eq-bounce {
          0%, 100% { height: 0.4rem; opacity: 0.7; }
          50% { height: 0.9rem; opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cyclist { animation: none; }
          .eq-on .eq-bar { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default NavBar;

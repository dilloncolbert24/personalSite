import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.fullscreen/Control.FullScreen.css";
import "leaflet.fullscreen";
import { motion, AnimatePresence } from "framer-motion";
import { FaHouseChimney, FaMapPin } from "react-icons/fa6";
import { FaBusAlt } from "react-icons/fa";
import { LuCircleParkingOff } from "react-icons/lu";
import { PiPlantBold } from "react-icons/pi";
import { SiMta } from "react-icons/si";
import { MdDirectionsBike, MdDirectionsWalk } from "react-icons/md";
import { renderToStaticMarkup } from "react-dom/server";

/* Make sure the fullscreen button can't be hidden by Tailwind resets or z-index */
const fullscreenStyle = `
  .leaflet-control-container .leaflet-control-fullscreen {
    display: block !important;
    z-index: 1000 !important;
  }
`;
if (typeof document !== "undefined" && !document.getElementById("fullscreen-style")) {
  const style = document.createElement("style");
  style.id = "fullscreen-style";
  style.innerHTML = fullscreenStyle;
  document.head.appendChild(style);
}

/* Fix Leaflet default marker icon paths */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* Generic colored pin (SVG) */
const makeMarkerIcon = (hex = "#3b82f6") => {
  const svg = `
    <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M16 0C7.163 0 0 7.156 0 16c0 11.5 16 32 16 32s16-20.5 16-32C32 7.156 24.837 0 16 0z" fill="${hex}"/>
        <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>
      </g>
    </svg>
  `.trim();

  return L.icon({
    iconUrl: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -44],
    className: "custom-colored-marker",
  });
};

/* Build a Leaflet icon from a React icon component */
const makeMarkerFromReactIcon = (Icon, { size = 40, color = "#ef4444" } = {}) => {
  const svgString = renderToStaticMarkup(<Icon size={size} color={color} />);
  return L.icon({
    iconUrl: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgString),
    iconSize: [size, size],
    iconAnchor: [size / 2, size * 0.9],
    popupAnchor: [0, -size * 0.85],
    className: "custom-reacticon-marker",
  });
};

/* Places (kept intact) */
const places = [
  {
    id: 0,
    coords: [38.9792, -90.9807], // Troy, MO
    title: "Troy, MO",
    date: "Hometown",
    description:
      "Where it all started — my roots in a small town shaped how I see the connection between community and built environment.",
    images: [
      { src: "/pw-troy-1909.jpg", caption: "Troy in 1909. Historic downtowns are super fascinating to me now, especially since it's impossible to build them with current regulation in most places. My work in parking reform addresses this.", color: "#ff6600" },
      { src: "/creek.webp", caption: "This creek near my house grew my environmental connection with water. I  attribute my fascination with the Mississippi and working with stormwater management to it.", color: "#ff6600" },
      { src: "/driveway.webp", caption: "A nice wooded walk across from my house set a high standard for green space in my life.", color: "#ff6600" }
    ],
    markerIcon: makeMarkerFromReactIcon(FaHouseChimney, { size: 44, color: "#000000" }),
  },
  {
    id: 1,
    coords: [38.627, -90.199],
    title: "St. Louis, MO",
    date: "2022–Present",
    description:
      "Organized Parking Day, coordinated nonprofits and local leaders. Helped shape my focus on tactical urbanism and public space design.",
    images: [
      { src: "/images/stl.jpg", caption: "Downtown St. Louis" },
      { src: "/images/stl2.jpg", caption: "Public space activation", color: "#00ccff" },
    ],
    markerIcon: makeMarkerFromReactIcon(FaMapPin, { size: 44, color: "#ef4444" }),
  },
  {
    id: 2,
    coords: [40.7128, -74.006],
    title: "New York City, NY",
    date: "Dec 2024, Aug 2025",
    description:
      "I used the subway and buses for transport and was captivated by adaptive reuses like the High Line and Dumbo, BK.",
    images: [
      { src: "/highLine.webp", caption: "The High Line" },
      { src: "/pedPath_Manhattan.webp", caption: "Pedestrian path", color: "#000000",
        src: "/NYCmultimodal.webp", caption: "The organized chaos of Manhattan's streets: 5th Ave & W 55th St in December 2024", color: "#000000" },
    ],
    markerIcon: makeMarkerFromReactIcon(SiMta, { size: 44, color: "#08179C" }),
  },
  {
    id: 3,
    coords: [37.7749, -122.4194],
    title: "San Francisco, CA",
    date: "2020",
    description:
      "Observed parklet culture and strong BRT planning efforts. Influenced my ideas for people-first streets in St. Louis.",
    images: [{ src: "/images/sf.jpg", caption: "SF Parklet" }],
    markerIcon: makeMarkerFromReactIcon(MdDirectionsWalk, { size: 44, color: "#FF4F00" }),
  },
  {
    id: 4,
    coords: [19.4326, -99.1332],
    title: "Ciudad de Mexico, MX",
    date: "2019",
    description:
      "Studied vibrant public spaces and multimodal systems, which shaped my thinking on equitable urban mobility.",
    images: [{ src: "/images/mexico.jpg", caption: "Zócalo, Mexico City" }],
    markerIcon: makeMarkerFromReactIcon(FaBusAlt, { size: 44, color: "#F245A1" }),
  },
  {
    id: 5,
    coords: [49.2798, -123.108763],
    title: "Vancouver, BC, CA",
    date: "2025",
    description:
      "Saw the benefits of people-first urban design and strong cycling infrastructure.",
    images: [
      { src: "/vancouverParklet.png", caption: "Vancouver parklet" },
      { src: "/vancouver_bikeStreet.png", caption: "Bike-priority street" },
      { src: "/vancouverBikeshare.png", caption: "Bike share station" },
    ],
    markerIcon: makeMarkerFromReactIcon(LuCircleParkingOff, { size: 44, color: "#000000" }),
  },
  {
    id: 6,
    coords: [1.299195, 103.774614],
    title: "Singapore",
    date: "May/June 2023",
    description:
      "Learned from Singapore’s transport integration and public space planning.",
    images: [{ src: "/singapore.jpg", caption: "Singapore streetscape" }],
    markerIcon: makeMarkerFromReactIcon(PiPlantBold, { size: 44, color: "#097969" }),
  },
  {
    id: 7,
    coords: [52.367348, 4.867048],
    title: "Amsterdam, NL",
    date: "Feb 2019, Mar 2024",
    description:
      "My desire for walkability and bikeability originated here.",
    images: [{ src: "/images/amsterdam.jpg", caption: "Cycling culture" }],
    markerIcon: makeMarkerFromReactIcon(MdDirectionsBike, { size: 44, color: "#003DA5" }),
  },
];

/* Slideshow */
const Slideshow = ({ images, interval = 4000 }) => {
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    if (!isModalOpen) {
      const id = setInterval(next, interval);
      return () => clearInterval(id);
    }
  }, [isModalOpen, interval]);

  const variants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const SlideshowContent = ({ full = false }) => (
    <div className="relative w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="relative w-full" onClick={() => !full && setIsModalOpen(true)}>
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index].src}
            alt={images[index].caption || `Slide ${index + 1}`}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`w-full h-[300px] object-cover rounded ${
              !full ? "cursor-pointer" : "object-contain max-h-[90vh]"
            }`}
          />
        </AnimatePresence>
        {images[index].caption && (
          <p
            className="text-center text-sm mt-2"
            style={{ color: images[index].color || "#e5e7eb" }}
          >
            {images[index].caption}
          </p>
        )}
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60 z-10"
          >
            ◀
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60 z-10"
          >
            ▶
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      <SlideshowContent />
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
            className="absolute top-6 right-6 text-white text-4xl font-bold"
          >
            ✕
          </button>
          <div
            className="w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <SlideshowContent full />
          </div>
        </div>
      )}
    </>
  );
};

/* Main component */
const BlueprintMap = () => {
  return (
    <section
      id="blueprint"
      className="bg-[#0a0b1d] text-white py-16 md:py-24 scroll-mt-24"
    >
      <div className="container max-w-screen-xl mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-10 text-center">
          Mapping my Trajectory
        </h2>

        {/* Use relative (not overflow-hidden) so Leaflet controls aren't clipped */}
        <div className="h-[500px] w-full rounded-lg shadow-lg relative">
          <MapContainer
            center={[39.5, -98.35]}
            zoom={4}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
            /* Enable fullscreen control via plugin map options */
            fullscreenControl={true}
            fullscreenControlOptions={{ position: "bottomright" }}
            whenCreated={(map) => {
              // If for some reason the option above didn't attach the control, add it manually:
              if (!map.fullscreenControl) {
                L.control.fullscreen({ position: "bottomright" }).addTo(map);
              }

              // Require ctrl/cmd to zoom via wheel
              map.on("wheel", (e) => {
                if (e.originalEvent.ctrlKey || e.originalEvent.metaKey) {
                  map.scrollWheelZoom.enable();
                } else {
                  map.scrollWheelZoom.disable();
                }
              });
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            {places.map((p) => (
              <Marker
                key={p.id}
                position={p.coords}
                icon={p.markerIcon || makeMarkerIcon()}
              >
                <Popup>
                  <div
                    className="text-black max-w-[260px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="font-bold text-lg">{p.title}</h3>
                    <p className="text-sm text-gray-700 mb-1">{p.date}</p>
                    <p className="text-sm mb-2">{p.description}</p>
                    <Slideshow images={p.images} />
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default BlueprintMap;

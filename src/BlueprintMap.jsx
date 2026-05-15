// BlueprintMap.js
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
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
  .leaflet-tooltip-custom {
    background-color: #1e293b !important;
    color: #ffffff !important;
    border: 1px solid rgba(255,255,255,0.15) !important;
    border-radius: 0.375rem !important;
    padding: 0.25rem 0.5rem !important;
    font-weight: 500 !important;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
  }
  .leaflet-tooltip-custom::before {
    border-top-color: #1e293b !important;
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

/* Places (All original icon hex codes meticulously preserved) */
const places = [
  {
    id: 0,
    coords: [38.9792, -90.9807],
    title: "Troy, MO",
    date: "Hometown",
    description:
      "Where it all started — my roots in a small town shaped how I see the connection between community and built environment.",
    images: [
      { src: "/pw-troy-1909.jpg", caption: "Troy in 1909. Historic downtowns are super fascinating to me now, especially since it's impossible to build them with current regulation in most places. My work in parking reform addresses this.", color: "#000000" },
      { src: "/creek.webp", caption: "This creek near my house grew my environmental connection with water. I  attribute my fascination with the Mississippi and working with stormwater management to it.", color: "#00000" },
      { src: "/driveway.webp", caption: "A nice wooded walk across from my house set a high standard for green space in my life.", color: "#000000" }
    ],
    markerIcon: makeMarkerFromReactIcon(FaHouseChimney, { size: 44, color: "#000000" }),
  },
  {
    id: 1,
    coords: [38.627, -90.199],
    title: "Downtown St. Louis, MO",
    date: "May 2025–Present",
    description:
      "After graduating, I moved Downtown to live car-free/car light. I'm now able to walk, bike, or take public transit for a majority of trips. Topics I'm currently researching in Downtown are urban growth models, parking reform, and highway removal.",
    images: [
      { src: "/riverfrontParking.webp", caption: "Rivefront inactivation is a major issue in St. Louis, where much of its historic levee and postindustrial land sits vacant and underutilized.", color: "#000000" },
      { src: "/archDivide.webp", caption: "I-44 rips through Downtown, dividing the Arch Grounds and the rest of Downtown. Many cities have explored highway removal or rerouting, and I believe St. Louis could follow suit.", color: "#000000"},
      { src: "/11th&locust.webp", caption: "Off-street parking makes up 27% of St. Louis's central city, according to the Parking Reform Network's Parking Lot Map.", color: "#000000"},
      { src: "/metroLL.webp", caption: "Housed inside the Eads Bridge, the oldest steel-frame bridge in the world, Laclede's Landing Metrolink station has one of my favorite views of the Arch.", color: "#000000"},
      { src: "/jazz.webp", caption: "Laclede's Landing, a historic district in Downtown with a rich music history, has a phenomenal amount of potential. I hosted this jazz jam through my club in Summer 2025, with the first being in Oct 2024. I am now volunteering in the district's design committee. ", color: "#000000"},
      { src: "/sundeckers.webp", caption: "Even Mission Dolores Park, not even in the top 5 largest municipal parks in San Francisco, was incredibly busy on a non-event day.", color: "#000000"},
      { src: "/cityMuseumLot.webp", caption: "Even Mission Dolores Park, not even in the top 5 largest municipal parks in San Francisco, was incredibly busy on a non-event day.", color: "#000000"}
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
      { src: "/pedPath_Manhattan.webp", caption: "Pedestrian path", color: "#000000"},
      { src: "/NYCmultimodal.webp", caption: "The organized chaos of Manhattan's streets: 5th Ave & W 55th St in December 2024", color: "#000000" },
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
    images: [
      { src: "/strawberryHill.webp", caption: "Golden Gate Park, one of the truest urban forests I've ever seen. A true flagship park and receiving of my highest praise.", color: "#000000" },
      { src: "/salesforcePark.webp", caption: "Salesforce Park, an elevated urban park in Downtown San Francisco. This park defies the typical definition of urban green space and provides an excellent third space for residents, employees, and visitors alike.", color: "#000000"},
      { src: "/missionDolores.webp", caption: "Even Mission Dolores Park, not even in the top 5 largest municipal parks in San Francisco, was incredibly busy on a non-event day.", color: "#000000"}
    ],
    markerIcon: makeMarkerFromReactIcon(MdDirectionsWalk, { size: 44, color: "#FF4F00" }),
  },
  {
    id: 4,
    coords: [19.4326, -99.1332],
    title: "Ciudad de Mexico, MX",
    date: "2019",
    description:
      "CDMX is alive, exuding energy, vibrancy, and the volume of foot traffic to match. It does so through fantastic outdoor dining, public squares, cafe culture, and live music, among many factors. I rode my first BRT line here, and it just so happens that theirs is world class.",
    images: [
      { src: "/reforma.webp", caption: "Paseo de la Reforma, the main artery of CDMX, closes to cars every Sunday.", color: "#000000" },
      { src: "/reformaAerial.webp", caption: "Here is a better view of Paseo de la Reforma from the Chapultepec Castle.", color: "#000000"},
      { src: "/centroHistorico.webp", caption: "The historic center began construction in 1521 and functions similarly to many European city centers. Here is where a lot of political activism, cultural displays, and tourism exist.", color: "#000000"},
      { src: "/bikingCDMX.webp", caption: "I frequently used Ecobici, CDMX's public (so impressive) bikeshare system to get around. It's relatively inexpensive and has great access throughout the city.", color: "#000000"},
      { src: "/brtCDMX.webp", caption: "The CDMX BRT system is among the best I've used or studied in the world. Many of the lines have 2 minute headways with fully dedicated corridors and are absolutely spotless.", color: "#000000"},
    ],
    markerIcon: makeMarkerFromReactIcon(FaBusAlt, { size: 44, color: "#F245A1" }),
  },
  {
    id: 5,
    coords: [49.2798, -123.108763],
    title: "Vancouver, BC, CA",
    date: "2025",
    description:
      "A true city of new urbanism. Much of the architecture was modern, which I'm not as fond of as historic, but everything was designed so intentionally for the human scale. ",
    images: [
      { src: "/vancouverParklet.webp", caption: "Vancouver parklet" , color: "#000000"},
      { src: "/vancouver_bikeStreet.webp", caption: "Bike-priority street" , color: "#000000"},
      { src: "/vancouverBikeshare.webp", caption: "Bike share station" , color: "#000000"},
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
    images: [{ src: "/singapore.jpg", caption: "Singapore streetscape", color: "#000000" }],
    markerIcon: makeMarkerFromReactIcon(PiPlantBold, { size: 44, color: "#097969" }),
  },
  {
    id: 7,
    coords: [52.367348, 4.867048],
    title: "Amsterdam, NL",
    date: "Feb 2019, Mar 2024",
    description:
      "My desire for walkability and bikeability originated here.",
    images: [{ src: "/images/amsterdam.jpg", caption: "Cycling culture", color: "#000000" }],
    markerIcon: makeMarkerFromReactIcon(MdDirectionsBike, { size: 44, color: "#003DA5" }),
  },
];

/* Internal Map Event Handler Subcomponent */
const MapController = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (!map.fullscreenControl) {
      L.control.fullscreen({ position: "bottomright" }).addTo(map);
    }

    const mapContainerElement = map.getContainer();

    const activateInteractions = () => {
      map.scrollWheelZoom.enable();
      map.dragging.enable();
    };

    const deactivateInteractions = () => {
      map.scrollWheelZoom.disable();
    };

    map.scrollWheelZoom.disable();

    mapContainerElement.addEventListener("click", activateInteractions);
    mapContainerElement.addEventListener("mouseleave", deactivateInteractions);

    return () => {
      mapContainerElement.removeEventListener("click", activateInteractions);
      mapContainerElement.removeEventListener("mouseleave", deactivateInteractions);
    };
  }, [map]);

  return null;
};

/* Individual Marker Component Wrapper */
const InteractiveMarker = ({ place }) => {
  const map = useMap();

  return (
    <Marker
      position={place.coords}
      icon={place.markerIcon || makeMarkerIcon()}
      eventHandlers={{
        click: () => {
          // Dynamic zoom depth adjustment to layer 15 for close block visualization
          map.flyTo(place.coords, 15, {
            duration: 1.75,
            easeLinearity: 0.25
          });
        }
      }}
    >
      <Tooltip direction="top" offset={[0, -40]} className="leaflet-tooltip-custom">
        {place.title}
      </Tooltip>
      
      {/* OPTIMIZATION: Added autoPanPadding to force the map framework to shift down 
        so slide containers are never clipped by non-maximized viewports.
      */}
      <Popup autoPan={true} autoPanPadding={[20, 50]}>
        <div className="text-black max-w-[260px]" onClick={(e) => e.stopPropagation()}>
          <h3 className="font-bold text-lg">{place.title}</h3>
          <p className="text-sm text-gray-700 mb-1">{place.date}</p>
          <p className="text-sm mb-2">{place.description}</p>
          <Slideshow images={place.images} />
        </div>
      </Popup>
    </Marker>
  );
};

/* Slideshow Component */
const Slideshow = ({ images, interval = 5000 }) => {
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
          <p className="text-center text-sm mt-2" style={{ color: images[index].color || "#e5e7eb" }}>
            {images[index].caption}
          </p>
        )}
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/60 z-10"
          >
            ◀
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
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
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <button onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }} className="absolute top-6 right-6 text-white text-4xl font-bold">✕</button>
          <div className="w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <SlideshowContent full />
          </div>
        </div>
      )}
    </>
  );
};

/* Main Component Architecture */
const BlueprintMap = () => {
  return (
    <section id="blueprint" className="bg-[#0a0b1d] text-white py-16 md:py-24 scroll-mt-24">
      <div className="container max-w-screen-xl mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-10 text-center">
          Mapping my Trajectory
        </h2>

        <div className="h-[500px] w-full rounded-lg shadow-lg relative overflow-hidden border border-white/10 group">
          
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent pointer-events-none transition-colors duration-300 z-[401] flex items-center justify-center">
            <span className="bg-slate-900/90 border border-white/10 backdrop-blur-sm text-xs font-medium tracking-wider uppercase px-3 py-1.5 rounded opacity-100 group-hover:opacity-0 transition-opacity duration-300">
              Click Map to Interact
            </span>
          </div>

          <MapContainer
            center={[20.0, -30.0]} 
            zoom={2.5}
            minZoom={2}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
            fullscreenControl={false}
          >
            {/* Requirement 2: Clean, legible dark style with visible land masses/grids */}
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openapi.openstreetmap.org">OpenStreetMap</a> contributors'
            />
            
            <MapController />

            {places.map((p) => (
              <InteractiveMarker key={p.id} place={p} />
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default BlueprintMap;
import React, { useState } from 'react';
import { FaFilePdf } from "react-icons/fa6";
import { CgWebsite } from "react-icons/cg";

const Project = ({ image, shortDescription, title, longDescription, timeSpent, docLink, webLink, size }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleFlip = () => setIsFlipped(!isFlipped);

  const heightClass = size === 'xl' ? 'h-[36rem]' : 'h-96';
  const isVideo = image.endsWith('.mp4');

  return (
    <div
      className={`relative w-full ${heightClass} cursor-pointer group perspective rounded-lg overflow-hidden`}
      onClick={toggleFlip}
    >
      <div className={`transition-transform duration-700 transform-style preserve-3d w-full h-full ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* FRONT SIDE */}
        <div className="absolute w-full h-full backface-hidden rounded-lg">
          {isVideo ? (
            <video
              src={image}
              className="w-full h-full object-cover rounded-lg"
              loop
              muted
              autoPlay
              playsInline
            />
          ) : (
            <img src={image} alt={title} className="w-full h-full object-cover rounded-lg" />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white">
            <h3 className="text-2xl font-bold mb-1">{title}</h3>
            <p>{shortDescription}</p>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute w-full h-full rotate-y-180 backface-hidden rounded-lg overflow-hidden">
          {/* Blurred background image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${image})`,
              filter: 'blur(12px) brightness(0.6)',
            }}
          ></div>

          {/* Foreground content */}
          <div className="relative z-10 w-full h-full p-6 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-4">{title}</h3>
              <p className="text-base mb-6 whitespace-pre-line">
                {longDescription.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-white/30 pt-4 flex items-center justify-between">
              <p className="text-sm">Time Spent: {timeSpent}</p>

              {/* Links grouped together */}
              <div className="flex items-center space-x-3">
                {docLink && (
                  <a
                    href={docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white text-lg sm:text-xl hover:underline"
                  >
                    <FaFilePdf className="mr-1 text-red-500" />
                    PDF
                  </a>
                )}
                {webLink && (
                  <a
                    href={webLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-white text-lg sm:text-xl hover:underline"
                  >
                    <CgWebsite className="mr-1 text-red-500" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;

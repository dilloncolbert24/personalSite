// Projects.js
import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import Project from './Project';

const Projects = () => {
  const projectsData = [
    {
      image: '/accessSTL.webp',
      shortDescription: 'President',
      title: 'WUrbanists - WashU Transportation Club',
      longDescription:
        "When serving as the president for WUrbanists, I was able to advance multiple projects such as a regional bikeshare program, a collaboration to decrease car dependency with Forest Park, St. Louis' flagship park, and Metro U-Pass registration to increase student utilization of public transit. I organized events and tirelessly met with university leaders to get students off-campus and into the community, fighting against a phenomenon known as the \"WashU Bubble\" and the brain drain in St. Louis I believe can be significantly attributed to a lack of mobility.  \n \n Under my leadership, we were able to increase our funding category from II -> I and increase average event attendance from <5 to 15-20. We were also able to strengthen our relationship with the WashU Office of Sustainability, our Sam Fox School of Design and its faculty, and green groups at Saint Louis University and the University of Missouri-St. Louis. \n \n We believe that these developments position AccessSTL to help execute university initiatives like \" WashU in St. Louis, for St. Louis\" along with sustainability goals, and work to maximize the university's regional impact.  \n",
      timeSpent: 'Jun 2024 - May 2025',
      webLink: 'https://wustl.presence.io/organization/accessstl',
      size: 'xl',
    },
    {
      image: '/washaveParklet.webp',
      shortDescription: 'Reimagining the streets of St. Louis',
      title: 'WashAve Parking Day',
      longDescription:
        'On September 19, 2025 and the months preceding, I, on behalf of Strongtowns and the Parking Reform Network, was the primary organizer and host of a Parking Day segment along Washington Avenue in Downtown St. Louis, MO, where I coordinated nonprofits such as the STL Urbanists, Trailnet, and Greater St. Louis Inc., local businesses, politicians, and the St. Louis Office of the Treasurer.\n \n The focus was on outdoor dining and increasing foot traffic with parklets, where model cities like San Francisco, New York City, and Vancouver have shown strong benefits in their public realms. For long term goals, this segment aims to catalyze permanent installation of parklets for supporting businesses and propose a vibrant, lively Washington Ave desgined for people, not cars.\n',
      timeSpent: 'Jul - Sep 2025',
      docLink: 'https://drive.google.com/file/d/1QhRZchegO0ADi_baCSpWIMnjKAIZcYBm/view?usp=sharing',
      webLink: 'https://www.myparkingday.org/',
      size: 'lg',
    },
    {
      image: '/GWS.webp',
      shortDescription: 'Community Design Research',
      title: 'Gateway South Redevelopment',
      longDescription:
        'Researched the history of erasure relevant to Chouteau\'\s Landing, a postindustrial site south of the Gateway Arch, in three categories: Transportation Infrastructure, Multimodal Connection to East St. Louis, and Anchor Institutions. This aid plans advanced by Good Developments and art curation by community partner Counterpublic.',
      timeSpent: 'Jun 2025 - Jan 2026',
      size: 'sm',
    },
    {
      image: '/garmentDistrict.jpg',
      shortDescription: 'Analyzing data on off-street parking',
      title: 'Parking Reform in Downtown',
      longDescription:
        'Collected and analyzed data on parking in the Washington Avenue Garment District, a St. Louis City placemaking project from 2018. Currently, the overall parking ratio in the district is 30%, and north of Washington it is 37.3%. I plan to extend this into work with the STL Urbanists Mappers working group to pressure data-driven solutions for off-street parking in the City. ',
      timeSpent: 'SU25',
      docLink: 'https://drive.google.com/file/d/16-CWbPyyaCb1SRQdmALofh6TKTPxrmzj/view?usp=sharing',
      size: 'sm',
    },
    {
      image: '/forestPark.webp', 
      shortDescription: 'Facilitating conversations about the built environment in St. Louis\' flagship park',
      title: 'Forest Park Walking Audit',
      longDescription:
        "Forest Park, one of the largest urban parks in the US, is located right next to WashU. However, despite its marketing as the \"front yard of the university,\" it still serves as an extension of the east end parking garage.",
      timeSpent: 'Jun 2024 - May 2025',
      size: 'lg',
    },
    {
      image: '/bikeshare.png',
      shortDescription: 'Restarting discussions about a regional bikeshare system',
      title: 'St. Louis Bikeshare',
      longDescription:
        'This was the idea that I initially joined AccessSTL with in June 2024. The initial goal was to restart conversations around the never-executed St. Louis Bike Share Study from 2014, where ideally, WashU would resume leading conversations due to their investment at the time. Since then, I\'ve developed multiple presentation iterations to pitch to university leaders, including the Office of Sustainability and Mobility Task Force, which consists of administrators from across many university departments. \n\n The Project has since developed from a university-catalyzed model into a nonprofit-housed, regional model. I aim to garner political support, corporate and municipal funding, and community desire through a grassroots marketing campaign led by the STL Urbanists, where I\'ve launching a dedicated working group.   ',
      timeSpent: 'Jun 2024 - Current',
      size: 'xl',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projectsData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projectsData.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="bg-[#0a0b1d] py-16" id="projects">
      <div className="container max-w-screen-xl mx-auto px-4">
        <h2 className="text-7xl font-bold mb-16 text-center text-white">My Projects</h2>
        
        <div className="relative max-w-4xl mx-auto flex items-center">
          {/* Left Arrow Button - Desktop */}
          <button
            onClick={prevSlide}
            className="absolute left-[-5rem] z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-sm border border-white/10 cursor-pointer"
            aria-label="Previous Slide"
          >
            <FaChevronLeft className="text-xl" />
          </button>

          {/* Slider Window Container */}
          <div className="w-full overflow-hidden select-none rounded-lg">
            <div 
              className="flex transition-transform duration-500 ease-out transform-gpu will-change-transform"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {projectsData.map((project, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <Project {...project} size="xl" isActive={index === currentIndex} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow Button - Desktop */}
          <button
            onClick={nextSlide}
            className="absolute right-[-5rem] z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-sm border border-white/10 cursor-pointer"
            aria-label="Next Slide"
          >
            <FaChevronRight className="text-xl" />
          </button>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden justify-center items-center space-x-8 mt-6">
          <button 
            onClick={prevSlide} 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white cursor-pointer active:scale-95 transition"
            aria-label="Previous Slide"
          >
            <FaChevronLeft className="text-lg" />
          </button>
          <button 
            onClick={nextSlide} 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white cursor-pointer active:scale-95 transition"
            aria-label="Next Slide"
          >
            <FaChevronRight className="text-lg" />
          </button>
        </div>

        {/* Navigation Indicator Dots */}
        <div className="flex justify-center space-x-2.5 mt-8">
          {projectsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === index ? 'w-8 bg-red-500' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
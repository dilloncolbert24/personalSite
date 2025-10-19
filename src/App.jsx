import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Hero from './Hero';
import NavBar from './NavBar';
import Project from './Project';
import Projects from  './Projects';
import Footer from './Footer';
import BlueprintMap from './BlueprintMap';

function App() {
  return (
    <>
        <Hero />
        <NavBar />
        <BlueprintMap />
        <Projects />
        <Footer />
    </>
  )
}

export default App

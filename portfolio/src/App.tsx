import React from 'react';
// @ts-nocheck
import { Header } from './components/Header';
import { Hero } from './components/sections/Hero';
import { AboutSection } from './components/sections/About';
import { ProjectsSection } from './components/sections/Projects';
import { SimulatorSection } from './components/sections/Simulator';
import { TerminalSection } from './components/sections/Terminal';
import { ContactSection } from './components/sections/Contact';

function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-white selection:text-black bg-[#0a0a0c]">
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <ProjectsSection />
        <SimulatorSection />
        <TerminalSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;

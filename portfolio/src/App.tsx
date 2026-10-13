import React, { lazy, Suspense } from 'react';
// @ts-nocheck
import { Header } from './components/Header';
import { Hero } from './components/sections/Hero';
import { AboutSection } from './components/sections/About';
const ProjectsSection = lazy(() => import('./components/sections/Projects').then(module => ({ default: module.ProjectsSection }))); 
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
        <Suspense fallback={<section id="projects" className="min-h-[500px] py-24 text-center text-gray-400" aria-live="polite">Loading projects…</section>}>
          <ProjectsSection />
        </Suspense>
        <SimulatorSection />
        <TerminalSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;

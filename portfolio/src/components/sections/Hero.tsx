import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, Activity } from 'lucide-react';
import { format } from 'date-fns';

export function Hero() {
  const { t } = useTranslation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate Tashkent time (UTC+5)
      const d = new Date();
      const localTime = d.getTime();
      const localOffset = d.getTimezoneOffset() * 60000;
      const utc = localTime + localOffset;
      const tashkent = utc + (3600000 * 5);
      setTime(new Date(tashkent));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="min-h-screen relative flex items-center justify-center border-b border-[#222] overflow-hidden">
      {/* Abstract Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
           style={{ backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-start mt-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 hairline-border rounded-sm bg-[#111] text-xs font-mono text-gray-400"
        >
          <Activity size={14} className="text-green-500" />
          <span>{t('hero.systemStatus')}</span>
          <span className="mx-2">|</span>
          <span>{t('hero.localTime')}: {format(time, 'HH:mm:ss')} (Tashkent)</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-4"
        >
          JIMMIY
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl md:text-3xl font-mono text-gray-300 mb-6 flex items-center gap-4"
        >
          <TerminalIcon className="text-gray-500" />
          <span>{t('hero.title')}</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl font-mono"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex gap-4"
        >
          <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 bg-white text-black font-mono font-bold hover:bg-gray-200 transition-colors rounded-sm uppercase text-sm tracking-wider">
            {t('nav.projects')}
          </button>
          <button onClick={() => document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 hairline-border hover:bg-[#111] transition-colors rounded-sm text-white font-mono uppercase text-sm tracking-wider flex items-center gap-2">
            <TerminalIcon size={16} />
            {t('nav.terminal')}
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent mx-auto" />
      </motion.div>
    </section>
  );
}

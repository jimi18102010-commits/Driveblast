import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Server, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function SimulatorSection() {
  const { t } = useTranslation();
  const [packets, setPackets] = useState<{ id: number; dropped: boolean }[]>([]);
  const [packetCount, setPacketCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a new packet every ~800ms
      const isDrop = Math.random() > 0.3; // 70% chance to drop
      setPackets(prev => [...prev.slice(-4), { id: Date.now(), dropped: isDrop }]);
      setPacketCount(c => c + 1);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="simulator" className="py-24 border-b border-[#222]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-mono text-white mb-4 border-l-2 border-white pl-4 uppercase">
          {t('simulator.title')}
        </h2>
        <p className="text-gray-400 font-mono text-sm mb-12 max-w-2xl">
          {t('simulator.desc')}
        </p>

        <div className="glass-panel p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">

          {/* Incoming packets */}
          <div className="flex flex-col items-center w-full md:w-1/4">
            <div className="text-xs font-mono text-gray-500 mb-4 uppercase">{t('simulator.incoming')}</div>
            <div className="h-32 w-full flex justify-center items-center relative">
              {packets.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  className="w-12 h-8 bg-blue-500/20 border border-blue-500 rounded-sm absolute flex items-center justify-center text-[10px] font-mono text-blue-300"
                  style={{ zIndex: packets.length - i }}
                >
                  PKT
                </motion.div>
              ))}
            </div>
          </div>

          {/* eBPF / XDP Hook */}
          <div className="relative w-full md:w-1/2 flex justify-center">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/50 via-red-500/50 to-green-500/50 -translate-y-1/2 z-0 hidden md:block"></div>

            <div className="z-10 bg-[#0a0a0c] border border-red-500 p-6 rounded-sm shadow-[0_0_15px_rgba(239,68,68,0.2)] flex flex-col items-center min-w-[200px]">
              <ShieldAlert className="text-red-500 mb-2" size={24} />
              <div className="text-sm font-mono font-bold text-white mb-1">XDP_DROP</div>
              <div className="text-[10px] font-mono text-red-400">{t('simulator.latency')}</div>
              <div className="mt-4 text-xs font-mono text-gray-400">Processed: {packetCount}</div>
            </div>
          </div>

          {/* Kernel / User Space */}
          <div className="flex flex-col items-center w-full md:w-1/4">
            <div className="text-xs font-mono text-gray-500 mb-4 uppercase">{t('simulator.kernel')}</div>
            <div className="h-32 w-full flex flex-col justify-center items-center gap-4 relative border-l border-dashed border-gray-700 pl-8 md:pl-0 md:border-l-0 md:border-l-none">
                <div className="flex items-center gap-2 text-red-400 font-mono text-xs">
                  <XIcon size={14} /> {t('simulator.dropped')}
                </div>
                <div className="flex items-center gap-2 text-green-400 font-mono text-xs opacity-30">
                  <CheckCircle2 size={14} /> {t('simulator.passed')}
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function XIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
}

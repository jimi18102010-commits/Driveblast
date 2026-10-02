import React from 'react';
// @ts-nocheck
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function AboutSection() {
  const { t } = useTranslation();

  const skills = [
    { category: 'Languages', items: ['C', 'C++', 'Rust', 'Python'] },
    { category: 'Low-Level', items: ['Linux Kernel', 'eBPF', 'XDP', 'Networking'] },
    { category: 'Performance', items: ['ONNX Runtime', 'High-speed streaming', 'TCP/IP'] },
    { category: 'Tools', items: ['Git', 'Vite', 'React', 'Tailwind'] },
  ];

  return (
    <section id="about" className="py-24 border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* About Me */}
          <div>
            <h2 className="text-2xl font-mono text-white mb-8 border-l-2 border-white pl-4 uppercase">
              {t('about.title')}
            </h2>
            <div className="space-y-6 text-gray-300 font-mono text-sm leading-relaxed glass-panel p-8">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="text-gray-500 mr-2">&gt;</span> {t('about.name')}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <span className="text-gray-500 mr-2">&gt;</span> {t('about.age')}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <span className="text-gray-500 mr-2">&gt;</span> {t('about.location')}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="pt-4 border-t border-[#222]">
                <span className="text-green-400 mr-2">#</span> {t('about.specialization')}
              </motion.div>
            </div>
          </div>

          {/* Skills (mapped to #skills in nav, but displayed alongside about) */}
          <div id="skills" className="pt-2">
            <h2 className="text-2xl font-mono text-white mb-8 border-l-2 border-white pl-4 uppercase">
              {t('skills.title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map((group, idx) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-6"
                >
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">{group.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map(item => (
                      <span key={item} className="px-2 py-1 bg-[#1a1a1a] hairline-border text-xs text-gray-300 font-mono">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Cpu } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import vs2015 from 'react-syntax-highlighter/dist/esm/styles/hljs/vs2015';

SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('python', python);

const projectsData = [
  {
    id: 'scapy', titleKey: 'projects.scapy.title', descKey: 'projects.scapy.desc',
    tech: ['Python', 'IPv6', 'Packet Parsing'],
    sourceUrl: 'https://github.com/secdev/scapy/pull/5214',
    code: `# Excerpt from the open Scapy PR #5214.
# Check payload length before indexing a truncated routing header.
elif self.nh == 43 and len(p) > 2 and p[2] == 4:
    return IPv6ExtHdrSegmentRouting`,
    language: 'python'
  },
  {
    id: 'driveblast', titleKey: 'projects.driveblast.title', descKey: 'projects.driveblast.desc',
    tech: ['Python', 'HTTP Range', 'Streaming'],
    sourceUrl: 'https://github.com/jimi18102010-commits/Driveblast',
    code: `# Public Python API usage; not a performance benchmark.
from driveblast import download

path = download(
    "https://drive.google.com/file/d/YOUR_FILE_ID/view",
    output="dataset.zip",
    resume=True,
)`,
    language: 'python'
  },
  {
    id: 'faceblast', titleKey: 'projects.faceblast.title', descKey: 'projects.faceblast.desc',
    tech: ['Python', 'OpenCV', 'ONNX Models'],
    sourceUrl: 'https://github.com/jimi18102010-commits/faceblast',
    code: `# OpenCV YuNet + SFace models via the public API.
from faceblast import compare_faces

result = compare_faces("photo1.jpg", "photo2.jpg")
print(result.similarity, result.is_match)
# Similarity is not calibrated identity probability.`,
    language: 'python'
  },
  {
    id: 'vortex', titleKey: 'projects.vortex.title', descKey: 'projects.vortex.desc',
    tech: ['Python', 'C', 'IPv4 XDP', 'Linux'],
    sourceUrl: 'https://github.com/jimi18102010-commits/vortex',
    code: `/* Illustrative excerpt from the expiry-aware audit fix. */
struct ban_record *ban = bpf_map_lookup_elem(&blocked_ips, &src_ip);
if (ban && bpf_ktime_get_ns() >= ban->expires_ns) {
    bpf_map_delete_elem(&blocked_ips, &src_ip);
    ban = 0;
}
if (ban)
    return XDP_DROP;
/* This is not a throughput or latency benchmark. */`,
    language: 'c'
  }
];

export function ProjectsSection() {
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<typeof projectsData[0] | null>(null);

  return (
    <section id="projects" className="py-24 border-b border-[#222] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-mono text-white mb-12 border-l-2 border-white pl-4 uppercase">
          {t('projects.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectsData.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel group cursor-pointer hover:border-gray-500 transition-colors"
              onClick={() => setSelectedProject(project)}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-mono font-bold text-white group-hover:text-green-400 transition-colors">
                    {t(project.titleKey)}
                  </h3>
                  <Activity size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-sm text-gray-400 mb-6 font-sans leading-relaxed min-h-[80px]">
                  {t(project.descKey)}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map(tech => (
                    <span key={tech} className="text-xs font-mono px-2 py-1 bg-[#1a1a1a] hairline-border text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
                <button className="text-xs font-mono text-white uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  {t('projects.viewDetails')} <span className="text-green-400">-&gt;</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="glass-panel w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b border-[#333] bg-[#0a0a0c]">
                <h3 className="text-lg font-mono font-bold text-white">{t(selectedProject.titleKey)}</h3>
                <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-white p-2">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-[#050505]">
                <p className="text-gray-300 mb-8 font-sans leading-relaxed max-w-3xl">
                  {t(selectedProject.descKey)}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-mono text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                      <Cpu size={16} /> {t('projects.architecture')}
                    </h4>
                    <p className="text-gray-400 font-mono text-sm mb-4">{t('projects.limitations')}</p>
                    <a href={selectedProject.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                      GitHub ↗
                    </a>
                  </div>

                  <div>
                    <h4 className="text-sm font-mono text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                      <TerminalIcon size={16} /> {t('projects.sourceCode')}
                    </h4>
                    <div className="text-[13px] rounded-sm overflow-hidden hairline-border">
                      <SyntaxHighlighter
                        language={selectedProject.language}
                        style={vs2015}
                        customStyle={{ margin: 0, padding: '1rem', background: '#0d0d0d' }}
                      >
                        {selectedProject.code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Temporary icon fallback if missing import above
function TerminalIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;
}

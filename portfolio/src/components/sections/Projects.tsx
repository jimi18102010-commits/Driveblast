import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Cpu } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import vs2015 from 'react-syntax-highlighter/dist/esm/styles/hljs/vs2015';

SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('python', python);

const projectsData = [
  {
    id: 'scapy',
    titleKey: 'projects.scapy.title',
    descKey: 'projects.scapy.desc',
    tech: ['Python', 'Networking', 'DNS', 'TLS'],
    code: `// Scapy EDNS0 / TLS SNI Fix Snippet
class EDNS0(Packet):
    name = "EDNS0"
    fields_desc = [
        ByteField("opt_code", 0),
        ShortField("opt_len", 0),
        StrLenField("opt_data", "", length_from=lambda pkt: pkt.opt_len)
    ]

    def extract_padding(self, s):
        return "", s`,
    language: 'python'
  },
  {
    id: 'driveblast',
    titleKey: 'projects.driveblast.title',
    descKey: 'projects.driveblast.desc',
    tech: ['Python', 'Rust', 'HTTP 206', 'Streaming'],
    code: `// DriveBlast Chunked HTTP 206 Rust Core
async fn fetch_chunk(url: &str, start: u64, end: u64) -> Result<Vec<u8>, Error> {
    let client = reqwest::Client::new();
    let res = client.get(url)
        .header("Range", format!("bytes={}-{}", start, end))
        .send()
        .await?;

    let bytes = res.bytes().await?;
    Ok(bytes.to_vec())
}`,
    language: 'rust'
  },
  {
    id: 'faceblast',
    titleKey: 'projects.faceblast.title',
    descKey: 'projects.faceblast.desc',
    tech: ['C++', 'ONNX Runtime', 'Computer Vision'],
    code: `// FaceBlast Inference Engine (C++)
void FaceBlast::infer(const cv::Mat& frame) {
    auto input_tensor = preprocess(frame);
    std::vector<const char*> input_names = {"input"};
    std::vector<const char*> output_names = {"output"};

    auto output_tensors = session.Run(
        Ort::RunOptions{nullptr},
        input_names.data(), &input_tensor, 1,
        output_names.data(), 1
    );

    postprocess(output_tensors.front());
}`,
    language: 'cpp'
  },
  {
    id: 'vortex',
    titleKey: 'projects.vortex.title',
    descKey: 'projects.vortex.desc',
    tech: ['C', 'eBPF', 'XDP', 'Linux Kernel'],
    code: `// VORTEX XDP Drop Hook (eBPF C)
SEC("xdp_drop")
int xdp_drop_prog(struct xdp_md *ctx) {
    void *data = (void *)(long)ctx->data;
    void *data_end = (void *)(long)ctx->data_end;

    struct ethhdr *eth = data;
    if (data + sizeof(*eth) > data_end)
        return XDP_PASS;

    if (eth->h_proto == bpf_htons(ETH_P_IP)) {
        // Fast path drop for specific IP logic
        return XDP_DROP; // Latency < 0.8 µs
    }

    return XDP_PASS;
}`,
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
                      <Cpu size={16} /> {t('projects.architecture')} & {t('projects.metrics')}
                    </h4>
                    <div className="space-y-4 font-mono text-sm">
                      {selectedProject.id === 'driveblast' && (
                        <div className="glass-panel p-4 border-l-2 border-l-blue-500">
                          <div className="text-gray-400 mb-1">Speed Comparison</div>
                          <div className="flex items-center gap-4">
                            <span className="text-white">DriveBlast:</span>
                            <div className="flex-1 h-2 bg-[#222] relative"><div className="absolute inset-y-0 left-0 bg-blue-500 w-full"></div></div>
                            <span className="text-blue-400">100%</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-gray-400">Others:</span>
                            <div className="flex-1 h-2 bg-[#222] relative"><div className="absolute inset-y-0 left-0 bg-gray-500 w-[26%]"></div></div>
                            <span className="text-gray-500">26%</span>
                          </div>
                        </div>
                      )}
                      {selectedProject.id === 'faceblast' && (
                        <div className="glass-panel p-4 border-l-2 border-l-purple-500">
                          <div className="text-gray-400 mb-1">Inference Latency</div>
                          <div className="flex items-center gap-4">
                            <span className="text-white">FaceBlast:</span>
                            <span className="text-purple-400 font-bold">&lt; 15 ms</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-gray-400">dlib/PyTorch:</span>
                            <span className="text-gray-500">450 ms</span>
                          </div>
                        </div>
                      )}
                      {selectedProject.id === 'vortex' && (
                        <div className="glass-panel p-4 border-l-2 border-l-red-500">
                          <div className="text-gray-400 mb-1">Drop Latency (eBPF)</div>
                          <div className="flex items-center gap-4">
                            <span className="text-white">VORTEX:</span>
                            <span className="text-red-400 font-bold">&lt; 0.8 µs</span>
                          </div>
                        </div>
                      )}
                    </div>
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

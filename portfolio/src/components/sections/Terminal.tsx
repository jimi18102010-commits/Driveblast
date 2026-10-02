import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function TerminalSection() {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<{ type: 'command' | 'output'; text: string }[]>([
    { type: 'output', text: t('terminal.welcome') }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOutput([{ type: 'output', text: t('terminal.welcome') }]);
  }, [i18n.language, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let response = '';

    switch (trimmed) {
      case 'help':
        response = `Available commands:
  help      - Show this message
  about     - Display biography
  projects  - List projects
  skills    - List tech stack
  neofetch  - System information
  stats     - Quick metrics
  contact   - Contact info
  clear     - Clear terminal`;
        break;
      case 'about':
        response = `${t('about.name')}\n${t('about.age')}\n${t('about.location')}\n${t('about.specialization')}`;
        break;
      case 'projects':
        response = `1. Scapy (Upstream PR #5214)\n2. DriveBlast\n3. FaceBlast\n4. VORTEX (eBPF)`;
        break;
      case 'skills':
        response = `Languages: C, C++, Rust, Python\nSystems: Linux Kernel, eBPF / XDP\nAI/ML: ONNX Runtime\nNetworking: TCP/IP, HTTP 206\nTools: Git, Vite, React`;
        break;
      case 'neofetch':
        response = `
       .MMM..       jimmiy@tashkent
      MMMMMMM.      ---------------
     .MMMMMMMM.     OS: Linux Kernel Dev
     MMMMMMMMMM     Uptime: 15 years
    .MMMMMMMMMM.    Shell: zsh (simulated)
    MMMMMMMMMMMM    CPU: High-Speed Brain
   .MMMMMMMMMMMM.   Stack: C, Rust, Python, eBPF
`;
        break;
      case 'stats':
        response = `DriveBlast: 3.8x faster\nFaceBlast: 15ms inference (vs 450ms)\nVORTEX: Drop latency < 0.8 µs`;
        break;
      case 'contact':
        response = `GitHub: https://github.com/jimi18102010-commits\nTelegram: https://t.me/jimi_00`;
        break;
      case 'clear':
        setOutput([]);
        return;
      case '':
        return;
      default:
        response = `Command not found: ${trimmed}. Type 'help' for available commands.`;
    }

    setOutput(prev => [
      ...prev,
      { type: 'command', text: `root@jimmiy:~$ ${cmd}` },
      { type: 'output', text: response }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <section id="terminal" className="min-h-screen py-24 border-b border-[#222]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-mono text-white mb-8">./terminal.sh</h2>

        <div className="glass-panel rounded-sm overflow-hidden flex flex-col h-[600px]">
          {/* Terminal Header */}
          <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-[#333]">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="ml-4 text-xs font-mono text-gray-400">root@jimmiy:~</div>
          </div>

          {/* Terminal Body */}
          <div className="flex-1 p-4 bg-[#050505] overflow-y-auto font-mono text-sm">
            {output.map((line, i) => (
              <div key={i} className="mb-2 whitespace-pre-wrap">
                {line.type === 'command' ? (
                  <span className="text-white">{line.text}</span>
                ) : (
                  <span className="text-gray-400">{line.text}</span>
                )}
              </div>
            ))}

            <div className="flex items-center">
              <span className="text-green-500 mr-2">root@jimmiy:~$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-white font-mono"
                autoFocus
                spellCheck={false}
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </section>
  );
}

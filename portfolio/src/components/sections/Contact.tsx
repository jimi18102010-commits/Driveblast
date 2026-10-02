import React from 'react';
// @ts-nocheck
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';

function GithubIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>;
}

export function ContactSection() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-mono text-white mb-12 uppercase tracking-widest">
          {t('contact.title')}
        </h2>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <a
            href="https://github.com/jimi18102010-commits"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-8 py-4 glass-panel hover:bg-white hover:text-black transition-all group w-full sm:w-auto justify-center"
          >
            <GithubIcon size={24} className="group-hover:text-black text-gray-300" />
            <span className="font-mono text-lg group-hover:font-bold">GitHub</span>
          </a>

          <a
            href="https://t.me/jimi_00"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-8 py-4 glass-panel hover:bg-[#0088cc] hover:text-white hover:border-[#0088cc] transition-all group w-full sm:w-auto justify-center"
          >
            <Send size={24} className="text-gray-300 group-hover:text-white" />
            <span className="font-mono text-lg group-hover:font-bold">Telegram</span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-mono text-gray-600">
        &copy; {new Date().getFullYear()} Jimmiy. High-speed systems.
      </div>
    </section>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const languages = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'uz', label: 'UZ' },
  { code: 'de', label: 'DE' },
  { code: 'zh', label: 'ZH' },
];

const navLinks = [
  { href: '#about', label: 'nav.about' },
  { href: '#skills', label: 'nav.skills' },
  { href: '#projects', label: 'nav.projects' },
  { href: '#terminal', label: 'nav.terminal' },
  { href: '#simulator', label: 'nav.simulator' },
  { href: '#contact', label: 'nav.contact' },
];

export function Header() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setLangMenuOpen(false);
  };

  const scrollTo = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
        isScrolled ? 'bg-[#0a0a0c]/80 backdrop-blur-md border-[#333]' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-sm bg-white text-[#0a0a0c] flex items-center justify-center font-bold font-mono text-xl">
              J
            </div>
            <span className="font-mono text-sm tracking-wider font-semibold">JIMMIY</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-widest font-mono relative group"
              >
                {t(link.label)}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Globe size={18} />
                <span className="text-sm font-mono uppercase">{i18n.language}</span>
              </button>

              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-32 bg-[#111] border border-[#333] rounded-sm py-1 shadow-xl"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={cn(
                        'block w-full text-left px-4 py-2 text-sm font-mono',
                        i18n.language === lang.code ? 'text-white bg-[#222]' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0c] border-b border-[#333] absolute top-16 left-0 right-0">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left px-3 py-2 text-base font-mono uppercase text-gray-400 hover:text-white hover:bg-[#111] transition-colors"
              >
                {t(link.label)}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

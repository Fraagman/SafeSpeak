"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Navigation() {
  const { t } = useTranslation('common');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("0.0");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["0.0", "1.0", "2.0", "3.0", "4.0", "5.0"];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(`section-${sections[i]}`);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(`section-${sectionId}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: "0.0", label: t('home'), href: "/" },
    { id: "1.0", label: t('features'), href: "#features" },
    { id: "2.0", label: t('resources'), href: "/resources" },
    { id: "3.0", label: t('stories'), href: "#stories" },
    { id: "4.0", label: t('support'), href: "#support" },
    { id: "5.0", label: t('about'), href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
            SafeSpeak
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.id === "0.0" || item.id === "2.0" || item.id === "5.0" 
                  ? window.location.href = item.href 
                  : scrollToSection(item.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex lg:hidden items-center gap-4">
            <Link href="/resources" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
              {t('resources')}
            </Link>
            <Link href="/settings" className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
              {t('settings')}
            </Link>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2 animate-fade-in-up">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.id === "0.0" || item.id === "2.0" || item.id === "5.0" 
                  ? window.location.href = item.href 
                  : scrollToSection(item.id)}
                className="block w-full text-left px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
            <Link 
              href="/settings" 
              className="block px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('settings')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}


"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/Reveal";
import { Parallax } from "@/components/Parallax";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";
import { DemoOne } from "@/components/ui/demo";
import { FeaturesSectionWithCardGradient } from "@/components/blocks/feature-section-with-card-gradient";

export default function Page() {
  const { t } = useTranslation('common');
  return (
    <div className="mx-auto max-w-6xl px-4 relative">
      {/* Horizon Three.js background */}
      <DemoOne />

      {/* Hero Section */}
      <section className="relative py-24 min-h-[80vh] flex items-center overflow-hidden">
        {/* Content */}
        <div className="relative z-10 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, ease: "easeOut" }}
            className="max-w-4xl text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight"
          >
            <span className="grad-text">{t('report_safely')}</span> {t('get_support_fast')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .15, duration: .7 }}
            className="mt-6 max-w-2xl text-lg text-white/80"
          >
            {t('anonymous_reporting_desc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .25, duration: .7 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/report/new" className="group relative inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-black hover:bg-white/90 transition">
              {t('create_report')}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/resources" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-white/90 hover:bg-white/10 transition">
              {t('browse_resources')}
            </Link>
          </motion.div>
        </div>

        {/* Parallax accents */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Parallax offset={40}>
            <div className="absolute -top-10 right-10 h-28 w-28 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/20 blur-2xl animate-float" />
          </Parallax>
          <Parallax offset={30}>
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-gradient-to-tr from-emerald-400/20 to-cyan-400/20 blur-2xl animate-float" />
          </Parallax>
        </div>
      </section>

      {/* Scroll Velocity Text */}
      <VelocityScroll
        text={t('confidential_encrypted')}
        default_velocity={5}
        className="font-display text-center text-2xl font-bold tracking-wider text-white md:text-4xl md:leading-[3rem]"
      />

      {/* Features Section with Card Gradient */}
      <FeaturesSectionWithCardGradient />

      {/* CTA */}
      <section className="relative my-20 rounded-3xl border border-white/10 backdrop-blur-sm p-10 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-semibold text-white">{t('ready_when_you_are')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">{t('no_account_required')}</p>
          <div className="mt-6">
            <Link href="/report/new" className="rounded-full bg-white px-5 py-2.5 text-black hover:bg-white/90 transition">
              {t('start_a_report')}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* About Us Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">{t('about_safespeak')}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">{t('our_mission')}</h3>
              <p className="text-white/80 leading-relaxed">
                {t('our_mission_desc')}
              </p>
              <div className="pt-4">
                <h4 className="text-lg font-medium text-white mb-3">{t('key_features')}</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                    {t('end_to_end_encrypted_reporting')}
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                    {t('ai_powered_resource_matching')}
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                    {t('no_personal_data_collection')}
                  </li>
                  <li className="flex items-center text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>
                    {t('verified_support_network')}
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-6">{t('why_choose_safespeak')}</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-purple-500/20 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">{t('secure_private')}</h4>
                    <p className="text-white/70 mt-1">{t('secure_private_desc')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">{t('fast_response')}</h4>
                    <p className="text-white/70 mt-1">{t('fast_response_desc')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-emerald-500/20 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">{t('trusted_network')}</h4>
                    <p className="text-white/70 mt-1">{t('trusted_network_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold text-white mb-6">{t('our_commitment')}</h3>
            <p className="max-w-3xl mx-auto text-white/80 leading-relaxed">
              {t('our_commitment_desc')}
            </p>
            <div className="mt-8">
              <a href="/about" className="inline-flex items-center text-white hover:text-white/80 transition-colors">
                {t('learn_more_mission')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

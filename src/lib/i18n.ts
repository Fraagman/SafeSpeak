import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../locales/en/common.json';
import hiCommon from '../locales/hi/common.json';
import mrCommon from '../locales/mr/common.json';
import taCommon from '../locales/ta/common.json';
import teCommon from '../locales/te/common.json';
import bnCommon from '../locales/bn/common.json';
import guCommon from '../locales/gu/common.json';
import knCommon from '../locales/kn/common.json';
import mlCommon from '../locales/ml/common.json';
import paCommon from '../locales/pa/common.json';
import urCommon from '../locales/ur/common.json';
import enLearn from '../locales/en/learn.json';
import hiLearn from '../locales/hi/learn.json';
import mrLearn from '../locales/mr/learn.json';
import taLearn from '../locales/ta/learn.json';
import teLearn from '../locales/te/learn.json';
import bnLearn from '../locales/bn/learn.json';
import guLearn from '../locales/gu/learn.json';
import knLearn from '../locales/kn/learn.json';
import mlLearn from '../locales/ml/learn.json';
import paLearn from '../locales/pa/learn.json';
import urLearn from '../locales/ur/learn.json';

const resources = {
  en: { common: enCommon, learn: enLearn },
  hi: { common: hiCommon, learn: hiLearn },
  mr: { common: mrCommon, learn: mrLearn },
  ta: { common: taCommon, learn: taLearn },
  te: { common: teCommon, learn: teLearn },
  bn: { common: bnCommon, learn: bnLearn },
  gu: { common: guCommon, learn: guLearn },
  kn: { common: knCommon, learn: knLearn },
  ml: { common: mlCommon, learn: mlLearn },
  pa: { common: paCommon, learn: paLearn },
  ur: { common: urCommon, learn: urLearn },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'learn'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;


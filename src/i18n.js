import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationHI from './locales/hi/translation.json';
import translationMR from './locales/mr/translation.json';
import translationAS from './locales/as/translation.json';
import translationBN from './locales/bn/translation.json';
import translationBRX from './locales/brx/translation.json';
import translationDOI from './locales/doi/translation.json';
import translationGU from './locales/gu/translation.json';
import translationKN from './locales/kn/translation.json';
import translationKS from './locales/ks/translation.json';
import translationGOM from './locales/gom/translation.json';
import translationMAI from './locales/mai/translation.json';
import translationML from './locales/ml/translation.json';
import translationMNI from './locales/mni/translation.json';
import translationNE from './locales/ne/translation.json';
import translationOR from './locales/or/translation.json';
import translationPA from './locales/pa/translation.json';
import translationSA from './locales/sa/translation.json';
import translationSAT from './locales/sat/translation.json';
import translationSD from './locales/sd/translation.json';
import translationTA from './locales/ta/translation.json';
import translationTE from './locales/te/translation.json';
import translationUR from './locales/ur/translation.json';

const resources = {
  en: { translation: translationEN },
  hi: { translation: translationHI },
  mr: { translation: translationMR },
  as: { translation: translationAS },
  bn: { translation: translationBN },
  brx: { translation: translationBRX },
  doi: { translation: translationDOI },
  gu: { translation: translationGU },
  kn: { translation: translationKN },
  ks: { translation: translationKS },
  gom: { translation: translationGOM },
  mai: { translation: translationMAI },
  ml: { translation: translationML },
  mni: { translation: translationMNI },
  ne: { translation: translationNE },
  or: { translation: translationOR },
  pa: { translation: translationPA },
  sa: { translation: translationSA },
  sat: { translation: translationSAT },
  sd: { translation: translationSD },
  ta: { translation: translationTA },
  te: { translation: translationTE },
  ur: { translation: translationUR },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

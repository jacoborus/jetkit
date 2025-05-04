import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import enJSON from "@/locale/en.json" with { type: "json" };
// import esJSON from "@/locale/es.json" with { type: "json" };

i18n.use(initReactI18next).init({
  resources: {
    en: {},
    es: {},
    // en: { ...enJSON },
    // es: { ...esJSON },
  },
  lng: "en",
});

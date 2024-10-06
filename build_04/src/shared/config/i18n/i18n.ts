import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import I18NextHttpBackend from "i18next-http-backend";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector"

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: __IS_DEV__,

        interpolation: {
            escapeValue: false // react already safes from xss
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        }

    });

export default i18n;
import { I18n, MissingTranslation } from "i18n-js";

import en from "./en";
import vi from "./vi";
import zh from "./zh";

const i18n = new I18n({
    default: en,
    en,
    vi,
    zh,
});

i18n.missingTranslation.get = () => undefined;

export default i18n;

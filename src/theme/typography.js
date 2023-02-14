export const GoogleSansFont = {
    "google-sans-thin": require("../assets/fonts/google-sans/GoogleSans-Thin.otf"),
    "google-sans-light": require("../assets/fonts/google-sans/GoogleSans-Light.otf"),
    "google-sans-regular": require("../assets/fonts/google-sans/GoogleSans-Regular.otf"),
    "google-sans-italic": require("../assets/fonts/google-sans/GoogleSans-Italic.otf"),
    "google-sans-medium": require("../assets/fonts/google-sans/GoogleSans-Medium.otf"),
    "google-sans-medium-italic": require("../assets/fonts/google-sans/GoogleSans-MediumItalic.otf"),
    "google-sans-bold": require("../assets/fonts/google-sans/GoogleSans-Bold.otf"),
    "google-sans-bold-italic": require("../assets/fonts/google-sans/GoogleSans-BoldItalic.otf"),
    "google-sans-black": require("../assets/fonts/google-sans/GoogleSans-Black.otf"),
};

export const GoogleSansFontType = {
    light: "google-sans-light",
    regular: "google-sans-regular",
    italic: "google-sans-italic",
    medium: "google-sans-medium",
    mediumItalic: "google-sans-medium-italic",
    bold: "google-sans-bold",
    boldItalic: "google-sans-bold-italic",
    black: "google-sans-black",
};

export const MontserratFont = {
    "montserrat-black": require("../assets/fonts/montserrat/Montserrat-Black.otf"),
};

export const MontserratFontType = {
    black: "montserrat-black",
};

export const Nunito = {
    "nunito-light": require("../assets/fonts/nunito/Nunito-Light.ttf"),
    "nunito-regular": require("../assets/fonts/nunito/Nunito-Regular.ttf"),
    "nunito-italic": require("../assets/fonts/nunito/Nunito-Italic.ttf"),
    "nunito-medium": require("../assets/fonts/nunito/Nunito-SemiBold.ttf"),
    "nunito-medium-italic": require("../assets/fonts/nunito/Nunito-SemiBoldItalic.ttf"),
    "nunito-bold": require("../assets/fonts/nunito/Nunito-Bold.ttf"),
    "nunito-bold-italic": require("../assets/fonts/nunito/Nunito-BoldItalic.ttf"),
    "nunito-extrabold": require("../assets/fonts/nunito/Nunito-ExtraBold.ttf"),
    "nunito-black": require("../assets/fonts/nunito/Nunito-Black.ttf"),
};

export const NunitoType = {
    light: "nunito-light",
    regular: "nunito-regular",
    italic: "nunito-italic",
    medium: "nunito-medium",
    mediumItalic: "nunito-medium-italic",
    bold: "nunito-bold",
    boldItalic: "nunito-bold-italic",
    extrabold: "nunito-extrabold",
    black: "nunito-black",
};

export const appFont = { ...GoogleSansFont, ...MontserratFont, ...Nunito };

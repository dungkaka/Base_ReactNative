import { unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React from "react";
import { StyleSheet, Text } from "react-native";

export const AppText = (props) => {
    return <Text {...props} style={[styles.text, props.style]} />;
};

export const AppTextItalic = (props) => {
    return <Text {...props} style={[styles.textItalic, props.style]} />;
};

export const AppTextBold = (props) => {
    return <Text {...props} style={[styles.textBold, props.style]} />;
};

export const AppTextBoldItalic = (props) => {
    return <Text {...props} style={[styles.textBoldItalic, props.style]} />;
};

export const AppTextMedium = (props) => {
    return <Text {...props} style={[styles.textMedium, props.style]} />;
};

export const AppTextMediumItalic = (props) => {
    return <Text {...props} style={[styles.textMediumItalic, props.style]} />;
};

const styles = StyleSheet.create({
    text: {
        fontSize: 14 * unit,
        fontFamily: GoogleSansFontType.regular,
    },
    textItalic: {
        fontSize: 14 * unit,
        fontFamily: GoogleSansFontType.italic,
    },
    textBold: {
        fontSize: 14 * unit,
        fontFamily: GoogleSansFontType.bold,
    },
    textBoldItalic: {
        fontSize: 14 * unit,
        fontFamily: GoogleSansFontType.boldItalic,
    },
    textMedium: {
        fontSize: 14 * unit,
        fontFamily: GoogleSansFontType.medium,
    },
    textMediumItalic: {
        fontSize: 14 * unit,
        fontFamily: GoogleSansFontType.mediumItalic,
    },
});

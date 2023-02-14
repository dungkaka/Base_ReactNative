import { ConfigService } from "@services/config";
import { sF } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import i18n from "@utils/locales";
import React from "react";
import { Text } from "react-native";
import Animated from "react-native-reanimated";

export const TEXT_TYPE = {
    REGULAR: GoogleSansFontType.regular,
    ITALIC: GoogleSansFontType.italic,
    MEDIUM: GoogleSansFontType.medium,
    MEDIUM_ITALIC: GoogleSansFontType.mediumItalic,
    BOLD: GoogleSansFontType.bold,
    BOLD_ITALIC: GoogleSansFontType.boldItalic,
};

export const AppText = ({ type = TEXT_TYPE.REGULAR, text, children, ...props }) => {
    const { lang } = ConfigService.useConfig();

    const _text = text ? i18n.t(text) : undefined;
    return (
        <Text
            {...props}
            style={[
                {
                    fontSize: sF,
                    fontFamily: type,
                },
                props.style,
            ]}
        >
            {_text ? _text : children}
        </Text>
    );
};

export const AnimatedAppText = ({ type = TEXT_TYPE.REGULAR, text, children, ...props }) => {
    const { lang } = ConfigService.useConfig();

    const _text = text ? i18n.t(text) : undefined;
    return (
        <Animated.Text
            {...props}
            style={[
                {
                    fontSize: sF,
                    fontFamily: type,
                },
                props.style,
            ]}
        >
            {_text ? _text : children}
        </Animated.Text>
    );
};

AppText.prototype = Text.prototype;
AnimatedAppText.prototype = Animated.Text.prototype;

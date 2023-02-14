import { AppText } from "@lib/AppText";
import { usePrevious } from "@hooks/usePrevious";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const FormErrorMessage = ({ error = undefined }) => {
    const showErrorAnimated = useSharedValue(0);
    const preMessage = usePrevious(error?.message);

    useEffect(() => {
        if (error) {
            showErrorAnimated.value = withTiming(1, { duration: 250 });
        } else {
            showErrorAnimated.value = withTiming(0, { duration: 250 });
        }
    }, [!error]);

    const errorAnimated = useAnimatedStyle(() => ({
        opacity: showErrorAnimated.value,
        transform: [
            {
                translateX: 10 * showErrorAnimated.value,
            },
        ],
    }));

    return (
        <View style={styles.errorContainer}>
            <Animated.Text style={[styles.textError, errorAnimated]}>{error ? error.message : preMessage}</Animated.Text>
        </View>
    );
};

export default FormErrorMessage;

const styles = StyleSheet.create({
    errorContainer: {
        paddingLeft: 2 * unit,
    },
    textError: {
        color: "red",
        fontFamily: GoogleSansFontType.regular,
    },
});

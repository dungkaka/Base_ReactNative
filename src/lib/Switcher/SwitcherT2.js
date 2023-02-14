import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Color } from "@theme/colors";
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { GoogleSansFontType } from "@theme/typography";
import { useOnlyDidUpdateEffect } from "@hooks/useOnlyDidUpdateEffect";
import { unit } from "@theme/styleContants";
import { AnimatedAppText, AppText } from "@lib/Typography/AppText";

/*
    When value != undefined, component is controlled by parent, value from parent change 
    will not run onChange props, but when user click on switcher, 
    it still run onChange with tend value.

    When value is undefined, value of component will controlled by activeAnimated Value.

    When value turn from undefined to != undefined, but it will controlled by value of parent.
*/

const SwitcherT2 = ({
    initialValue = false,
    disable = false,
    leftText = "off",
    rightText = "on",
    value = undefined,
    onChange = (value) => {},
    style = styles.container,
}) => {
    const activeAnimated = useSharedValue(value != undefined ? (value ? 1 : 0) : initialValue ? 1 : 0);

    useOnlyDidUpdateEffect(() => {
        if (value == false) activeAnimated.value = withTiming(0);
        if (value == true) activeAnimated.value = withTiming(1);
    }, [value]);

    const swichAnimatedStyle = useAnimatedStyle(() => ({
        left: `${activeAnimated.value * 50}%`,
    }));

    const leftTextAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(activeAnimated.value, [0, 1], ["rgb(55,55,55)", "rgb(242,242,242)"]),
    }));

    const rightTextAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(activeAnimated.value, [0, 1], ["rgb(242,242,242)", "rgb(55,55,55)"]),
    }));

    return (
        <View style={style} pointerEvents={disable ? "none" : "auto"}>
            <View style={styles.background} />
            <Animated.View style={[styles.switch, swichAnimatedStyle]} />
            <View style={styles.select}>
                <Pressable
                    onPress={() => {
                        if (value == undefined) activeAnimated.value = withTiming(0);
                        onChange(false);
                    }}
                    style={styles.block}
                >
                    <AnimatedAppText text={leftText} style={[styles.text, leftTextAnimatedStyle]} />
                </Pressable>
                <Pressable
                    onPress={() => {
                        if (value == undefined) activeAnimated.value = withTiming(1);
                        onChange(true);
                    }}
                    style={styles.block}
                >
                    <AnimatedAppText text={rightText} style={[styles.text, rightTextAnimatedStyle]}>
                        {rightText}
                    </AnimatedAppText>
                </Pressable>
            </View>
        </View>
    );
};

export default SwitcherT2;

const styles = StyleSheet.create({
    container: {
        width: 200 * unit,
    },
    background: {
        ...StyleSheet.absoluteFill,
        backgroundColor: Color.gray_8,
        borderRadius: 16,
    },
    switch: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "50%",
        backgroundColor: Color.gray_2,
        borderRadius: 16,
        transform: [
            {
                scale: 1.05,
            },
        ],
    },
    select: {
        flexDirection: "row",
        height: 40,
        borderRadius: 12,
    },
    block: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontFamily: GoogleSansFontType.medium,
        fontSize: 15 * unit,
    },
});

import { AppTextMedium } from "@lib/AppText";
import { rem, unit } from "@theme/styleContants";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export const RotateLogo = ({ size = 4 * rem, showDes = true, des = "Đang tải ...", desColor = "#1484b6" }) => {
    const animatedIcon = useSharedValue(0);

    const rotateStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotateZ: 360 * animatedIcon.value + "deg",
            },
        ],
    }));

    return (
        <View style={styles.container}>
            <View style={styles.block}>
                <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        width: size,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Animated.View
                        style={{
                            width: size / 6,
                            height: size / 6,
                            backgroundColor: "rgba(0,0,0,0.05)",
                            borderRadius: size / 4,
                        }}
                    />
                </View>

                <Animated.Image
                    source={require("@assets/images/logo.png")}
                    resizeMode="contain"
                    style={[
                        {
                            height: size,
                            width: size,
                        },
                        rotateStyle,
                    ]}
                    onLoadEnd={() => {
                        animatedIcon.value = withRepeat(
                            withTiming(1, { duration: 6000, easing: Easing.bezier(1, 1, 0, 0) }),
                            -1
                        );
                    }}
                />
            </View>

            {showDes && (
                <AppTextMedium style={{ paddingVertical: rem, fontSize: (10 + size / 10) * unit, color: desColor }}>
                    {des}
                </AppTextMedium>
            )}
        </View>
    );
};

export const RotateLogoPage = (props) => {
    return (
        <View style={styles.container}>
            <RotateLogo {...props} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: "center" },
    block: { justifyContent: "flex-end" },
});

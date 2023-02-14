import { AppText, AppTextBold, AppTextMedium } from "@lib/AppText";
import { rem, unit } from "@theme/styleContants";
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export const JumpLogo = ({ size = 4 * rem, showDes = true, des = "Đang tải ...", desColor = "#1484b6" }) => {
    const animatedIcon = useSharedValue(0);

    const jumpStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: -(size / 12) - (animatedIcon.value * size) / 6,
            },
        ],
    }));

    const shadowStyle = useAnimatedStyle(() => ({
        transform: [{ scaleX: 5 - animatedIcon.value }, { scaleY: 1 - animatedIcon.value / 8 }],
    }));

    return (
        <View style={{ alignItems: "center" }}>
            <View style={{ justifyContent: "flex-end" }}>
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
                        style={[
                            {
                                width: size / 6,
                                height: size / 6,
                                backgroundColor: "rgba(0,0,0,0.05)",
                                borderRadius: size / 4,
                            },
                            shadowStyle,
                        ]}
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
                        jumpStyle,
                    ]}
                    onLoadEnd={() => {
                        animatedIcon.value = withSpring(1, {
                            damping: 0,
                            mass: 2,
                        });
                    }}
                />
            </View>

            {showDes && (
                <AppTextMedium style={{ paddingVertical: rem / 2, fontSize: 10 + size / 10, color: desColor }}>
                    {des}
                </AppTextMedium>
            )}
        </View>
    );
};

export const JumpLogoPage = (props) => {
    return (
        <View style={styles.container}>
            <JumpLogo {...props} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

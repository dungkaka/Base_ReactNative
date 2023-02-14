import { AppTextMedium } from "@lib/AppText";
import { AppColor } from "@theme";
import { rem, unit } from "@theme/styleContants";
import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

export const CartAction = ({
    size = 4 * rem,
    showDes = true,
    des = "Đang tải ...",
    color = AppColor.primary,
    desColor = AppColor.primary,
}) => {
    return (
        <View style={[styles.container, { top: -size / 4 }]}>
            <View style={styles.block}>
                <LottieView
                    style={{ height: 2 * size, width: 2 * size, bottom: -size / 4 }}
                    source={require("@assets/lottie/loading-1.json")}
                    autoPlay={true}
                    loop={true}
                    colorFilters={[
                        {
                            keypath: "Loader 3",
                            color: color,
                        },
                    ]}
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

export const CartActionPage = (props) => {
    return (
        <View style={styles.pageContainer}>
            <CartAction {...props} />
        </View>
    );
};

export const CartActionPageOverlay = (props) => {
    return (
        <View style={styles.pageOverlayContainer}>
            <CartActionPage {...props} />
        </View>
    );
};

export const CartActionPopupOverlay = (props) => {
    return (
        <View style={styles.pageOverlayContainer}>
            <View style={styles.pageContainer}>
                <View style={styles.cartActionPopupContainer}>
                    <CartAction size={3.5 * rem} color="#ffffff" desColor="white" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: "center" },
    pageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    block: { justifyContent: "flex-end" },
    pageOverlayContainer: { ...StyleSheet.absoluteFill, zIndex: 999, backgroundColor: "rgba(255,255,255,0.5)" },
    cartActionPopupContainer: {
        width: 200,
        height: 150,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10 * unit,
    },
});

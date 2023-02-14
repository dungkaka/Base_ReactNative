import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Badge = ({ count = 0 }) => {
    if (!count) return null;

    return (
        <View style={styles.block}>
            <View style={[styles.container, { right: count < 99 ? -8 : -14 }]}>
                <Text numberOfLines={1} style={styles.textCount}>
                    {count < 99 ? count : "99+"}
                </Text>
            </View>
        </View>
    );
};

export default Badge;

const styles = StyleSheet.create({
    block: {
        position: "absolute",
        right: 0,
        top: 0,
    },
    container: {
        position: "absolute",
        top: -4,
        minWidth: 20,
        borderRadius: 20,
        paddingVertical: 1,
        paddingHorizontal: 2,
        backgroundColor: Color.redOrange,
        borderWidth: 1,
        borderColor: "#ffffff",
    },
    textCount: {
        color: "white",
        fontSize: 11 * unit,
        textAlign: "center",
        paddingHorizontal: 2 * unit,
        fontFamily: GoogleSansFontType.medium,
    },
});

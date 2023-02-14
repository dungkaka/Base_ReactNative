import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Space } from "../theme/spacing";
import { random_color } from "../utils";
import { AppText } from "./AppText";

const Tag = React.memo(({ style, title, styleItem, touchable = true, onPress = null }) => {
    const randomColor = random_color();

    return (
        <TouchableOpacity
            onPress={() => {
                touchable && onPress ? onPress() : null;
            }}
            disabled={!touchable}
            style={[styles.container, { backgroundColor: randomColor }, style]}
        >
            <AppText style={[styles.title, styleItem]}>{title}</AppText>
        </TouchableOpacity>
    );
});

export default Tag;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Space._14,
        paddingVertical: Space._4,
        borderRadius: 20,
    },
    title: {
        color: "white",
    },
});

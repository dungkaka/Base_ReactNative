import { unit } from "@theme/styleContants";
import React from "react";
import { ActivityIndicator } from "react-native";

export const LoadingIcon = ({ size = 20 * unit, isIconAnimating = true, color = "white", style = {} }) => (
    <ActivityIndicator style={style} size={size} color={color} animating={isIconAnimating} />
);

import { useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { BackHandler } from "react-native";

export const useGoBackHandler = (callback) => {
    const navigation = useNavigation();
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                callback ? callback() : navigation.goBack();
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, [])
    );
};

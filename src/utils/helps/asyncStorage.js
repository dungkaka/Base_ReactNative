import { AsyncStorage } from "react-native";

export const getAsync = async (item) => {
    try {
        const value = await AsyncStorage.getItem(item);
        return value != null ? JSON.parse(value) : null;
    } catch (e) {
        return null;
    }
};

export const setASync = async (item, value) => {
    try {
        const stringValue = JSON.stringify(value);
        await AsyncStorage.setItem(item, stringValue);
    } catch (e) {
        return null;
    }
};

import React, { useRef, useState } from "react";
import { Switch } from "react-native";
import { Color } from "../theme/colors";

const AutoSwitch = ({ startOnPress = () => {}, onPress = () => {}, afterOnPress = () => {}, initialAppColor = "default" }) => {
    const [isEnabled, setIsEnabled] = useState(initialAppColor == "dark" ? true : false);
    const canSwitch = useRef(true);

    const toggleSwitch = async () => {
        await startOnPress();
        if (canSwitch.current) {
            canSwitch.current = false;
            setIsEnabled((previousState) => !previousState);
            await onPress();
            afterOnPress();
            canSwitch.current = true;
        }
    };

    return (
        <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? Color.blueDark : "#f4f3f4"}
            // ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
        />
    );
};

export default AutoSwitch;

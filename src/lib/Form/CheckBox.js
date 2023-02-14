import { Entypo } from "@expo/vector-icons";
import { AppColor } from "@theme";
import { Color } from "@theme/colors";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

/*
    When value != undefined, component is controlled by parent, value from parent change 
    will not run onChange props, but when user click on checkbox, 
    it still run onChange with tend value.

    When value is undefined, value of component will receive value of active state.

    When value turn from undefined to != undefined, 
    (component will keep active state) but it will controlled by value of parent.
*/

const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

const CheckBox = ({
    initialValue = false,
    style,
    styleActive = styles.activeBlock,
    disabled = false,
    value,
    onChange = (value) => {},
    Title,
}) => {
    const [active, setActive] = useState(initialValue);

    if (value != undefined) {
        return (
            <TouchableOpacity
                disabled={disabled}
                style={styles.container}
                activeOpacity={0.8}
                onPress={() => {
                    onChange(!value);
                }}
                hitSlop={hitSlop}
            >
                <View style={[styles.block, value ? styleActive : {}, style]}>
                    {value && <Entypo name="check" size={13} color="white" />}
                </View>
                {Title}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            disabled={disabled}
            style={styles.container}
            activeOpacity={0.8}
            onPress={() => {
                setActive(!active);
                onChange(!active);
            }}
            hitSlop={hitSlop}
        >
            <View style={[styles.block, active ? styleActive : {}, style]}>
                {active && <Entypo name="check" size={13} color="white" />}
            </View>
            {Title}
        </TouchableOpacity>
    );
};

export default CheckBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    block: {
        height: 16,
        width: 16,
        borderRadius: 2,
        borderColor: Color.gray_8,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    activeBlock: {
        borderWidth: 0,
        backgroundColor: AppColor.primary,
    },
});

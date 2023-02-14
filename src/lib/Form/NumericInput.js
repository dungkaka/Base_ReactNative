import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import { Color } from "@theme/colors";
import { Int } from "@utils/helps/number";
import { useOnlyDidUpdateLayoutEffect } from "@hooks/useOnlyDidUpdateLayoutEffetct";

/*
    When value != undefined, component is controlled by parent, value from parent change 
    will not run onChange props, but when user click on button - or +, 
    it still run onChange with tend value.

    When value is undefined, value of component will receive value of VALUE state.

    When value turn from undefined to != undefined, 
    (component will keep VALUE state) but it will controlled by value of parent.
*/

const NumericInput = forwardRef(
    (
        {
            initialValue = "0",
            size = 17,
            maxLength = 5,
            boxWidth,
            minValue = "0",
            maxValue = "99999",
            onChange = (value) => {},
            value,
        },
        ref
    ) => {
        const min = useRef(Int(minValue)).current;
        const max = useRef(Int(maxValue)).current;
        const [VALUE, setValue] = useState(initialValue);

        useImperativeHandle(ref, () => ({
            getValue: () => Int(VALUE),
            setValue: (value) => onChangeText(value.toString()),
        }));

        useOnlyDidUpdateLayoutEffect(() => {
            onChange(VALUE);
        }, [VALUE]);

        const inputTranform = (text) => {
            if (text == "") return "0";
            else if (Int(text) < min) return minValue;
            else if (Int(text) > max) return maxValue;
            else return text.replace(/[^0-9|-]/g, "");
        };

        const onChangeText = (text) => {
            setValue(inputTranform(text));
        };

        if (value != undefined) {
            return (
                <View style={[styles.container, { width: boxWidth ? boxWidth : (size / 3 + 4) * rem }]}>
                    <View style={styles.leftIconContainer}>
                        <Feather
                            onPress={() => {
                                onChange((Int(value) - 1).toString());
                            }}
                            style={styles.leftIcon}
                            name="minus"
                            size={size}
                            color={VALUE <= min ? Color.gray_6 : "black"}
                        />
                    </View>

                    <TextInput
                        value={value}
                        onChangeText={(text) => onChange(inputTranform(text))}
                        style={[styles.input, { fontSize: size }]}
                        keyboardType="numeric"
                        defaultValue={VALUE}
                        textAlign="center"
                        maxLength={maxLength}
                    />

                    <View style={styles.rightIconContainer}>
                        <Feather
                            onPress={() => {
                                onChange((Int(value) + 1).toString());
                            }}
                            style={styles.rightIcon}
                            name="plus"
                            size={size}
                            color={VALUE >= max ? Color.gray_6 : "black"}
                        />
                    </View>
                </View>
            );
        }

        return (
            <View style={[styles.container, { width: boxWidth ? boxWidth : (size / 3 + 4) * rem }]}>
                <View style={styles.leftIconContainer}>
                    <Feather
                        onPress={() => {
                            const intValue = Int(VALUE);
                            if (intValue > min) {
                                const newValue = intValue - 1;
                                setValue(newValue.toString());
                            }
                        }}
                        style={styles.leftIcon}
                        name="minus"
                        size={size}
                        color={VALUE <= min ? Color.gray_6 : "black"}
                    />
                </View>

                <TextInput
                    value={VALUE}
                    onChangeText={onChangeText}
                    style={[styles.input, { fontSize: size }]}
                    keyboardType="numeric"
                    defaultValue={VALUE}
                    textAlign="center"
                    maxLength={maxLength}
                />

                <View style={styles.rightIconContainer}>
                    <Feather
                        onPress={() => {
                            const intValue = Int(VALUE);
                            if (intValue < max) {
                                const newValue = intValue + 1;
                                setValue(newValue.toString());
                            }
                        }}
                        style={styles.rightIcon}
                        name="plus"
                        size={size}
                        color={VALUE >= max ? Color.gray_6 : "black"}
                    />
                </View>
            </View>
        );
    }
);

export default NumericInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        width: 9 * rem,
        borderRadius: 6 * unit,
        borderColor: Color.gray_3,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: GoogleSansFontType.medium,
        fontSize: 16 * unit,
    },
    leftIconContainer: {
        borderRightColor: Color.gray_3,
        borderRightWidth: 1,
    },
    leftIcon: {
        paddingVertical: 8 * unit,
        paddingHorizontal: 10 * unit,
    },
    rightIconContainer: {
        borderLeftColor: Color.gray_3,
        borderLeftWidth: 1,
    },
    rightIcon: {
        paddingVertical: 8 * unit,
        paddingHorizontal: 10 * unit,
    },
});

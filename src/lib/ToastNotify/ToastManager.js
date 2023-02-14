import { AppText } from "@lib/AppText";
import { hitSlop20 } from "@lib/Pressable/utils";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Color } from "@theme/colors";
import { fontUnit, rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import Constants from "expo-constants";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
    Easing,
    Layout,
    runOnJS,
    Transition,
    Transitioning,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";
import Portal from "@lib/Portal";

const width = 350;
const TRANSLATE_X_THRESHOLD = -width * 0.25;

const contextClass = {
    success: {
        bg: "white",
        title: "#15cfaa",
        progress: "#15cfaa",
        IconFamily: Ionicons,
        iconName: "checkmark-circle-outline",
    },
    error: {
        bg: "white",
        title: "#fa442f",
        progress: "#fa442f",
        IconFamily: Feather,
        iconName: "x-circle",
    },
    warning: {
        bg: "white",
        title: Color.orangeLight,
        progress: Color.orangeLight,
        IconFamily: Feather,
        iconName: "alert-circle",
    },
    info: {
        bg: "white",
        title: Color.blueMax,
        progress: Color.blueMax,
        IconFamily: Feather,
        iconName: "info",
    },
    default: {
        bg: "white",
        title: Color.blueMax,
        progress: Color.blueMax,
        IconFamily: Feather,
        iconName: "info",
    },
};

const AnimatedItem = React.memo(
    ({ didShowToast, removeToast, item: { id, type, title, description, duration } }) => {
        const context = contextClass[type] || contextClass["default"];
        const animatedItem = useSharedValue(-1);
        let timeOutDeleteToast = 0;

        useEffect(() => {
            animatedItem.value = withTiming(0, { easing: Easing.bezier(0.51, 0.13, 0.05, 1.13), duration: 450 }, () => {
                runOnJS(didShowToast)();
                runOnJS(deleteItemDelay)();

                animatedItem.value = withDelay(300, withTiming(0));
            });
        }, []);

        const onStartTouchToast = () => {
            clearTimeout(timeOutDeleteToast);
        };

        const deleteItemDelay = () => {
            if (timeOutDeleteToast || animatedItem.value != 0) clearTimeout(timeOutDeleteToast);

            timeOutDeleteToast = setTimeout(() => {
                deleteItem();
            }, duration);
        };

        const deleteItem = (duration = 400) => {
            animatedItem.value = withTiming(-1, { duration: duration, easing: Easing.bezier(0.23, 0.84, 0.39, 1.03) }, () => {
                runOnJS(removeToast)(id);
            });
        };

        const panGesture = useAnimatedGestureHandler({
            onStart: () => {
                runOnJS(onStartTouchToast)();
            },
            onActive: (event) => {
                animatedItem.value = event.translationX / width;
            },
            onEnd: () => {
                const shouldDeleteItem = animatedItem.value * width < TRANSLATE_X_THRESHOLD;
                if (shouldDeleteItem) {
                    runOnJS(deleteItem)(500 + animatedItem.value * 500);
                } else {
                    animatedItem.value = withTiming(0, null, () => {
                        runOnJS(deleteItemDelay)();
                    });
                }
            },
        });

        const animatedContainer = useAnimatedStyle(() => {
            const translateX = width * animatedItem.value;
            const opacity = 1 - animatedItem.value * animatedItem.value;

            return {
                transform: [{ translateX: translateX }],
                opacity: opacity,
            };
        });

        return (
            <PanGestureHandler onGestureEvent={panGesture}>
                <Animated.View style={[styles.singleItemView, animatedContainer]}>
                    <View style={[styles.singleItemContainer, { borderLeftColor: context.title }]}>
                        <View style={styles.singleItemContentContainer}>
                            <context.IconFamily name={context.iconName} size={24} color={context.title} />
                        </View>
                        <View>
                            <AppText style={[styles.title, { color: context.title }]}>{title}</AppText>
                            <AppText numberOfLines={8} style={styles.description}>
                                {description}
                            </AppText>
                        </View>
                    </View>

                    <TouchableOpacity hitSlop={hitSlop20} style={styles.closeButton} onPress={() => deleteItem()}>
                        <Text style={styles.deleteIcon}>{"\u00D7"}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </PanGestureHandler>
        );
    },
    (prevProps, nextProps) => prevProps.item.id == nextProps.item.id
);

export const ToastManager = ({ position = "bottom" }) => {
    const [valueArray, setValueArray] = useState([]);
    const transitionRef = useRef();
    const transition = useRef(<Transition.Change interpolation="easeInOut" />).current;
    const TransitionView = Platform.OS == "android" ? Transitioning.View : View;

    const didShowToast = useCallback(() => {}, []);

    const showToast = useCallback(({ type = "default", title = "Thông báo", description = "Nội dung", duration = 3000 }) => {
        // Platform.OS == "android" && transitionRef.current?.animateNextTransition();
        setValueArray((arrayToast) => {
            const newToast = {
                id: Date.now().toString(),
                type,
                title: title,
                description,
                duration,
            };

            return [...arrayToast, newToast];
        });
    }, []);

    const removeToast = useCallback((id) => {
        Platform.OS == "android" && transitionRef.current?.animateNextTransition();
        setValueArray((arrayToast) => {
            const newArray = arrayToast.filter((toast) => toast.id != id);
            return newArray;
        });
    }, []);

    const clearAllToast = useCallback(() => {
        Platform.OS == "android" && transitionRef.current?.animateNextTransition();
        setValueArray([]);
    }, []);

    Toast.showToast = showToast;
    Toast.clearAllToast = clearAllToast;

    const layout = Layout.duration(200).springify();

    return (
        <Portal>
            <TransitionView
                ref={transitionRef}
                transition={transition}
                style={[
                    styles.container,
                    position == "bottom"
                        ? {
                              bottom: 0,
                              marginBottom: rem,
                          }
                        : {
                              top: 0,
                              marginTop: Constants.statusBarHeight,
                          },
                ]}
            >
                <Animated.FlatList
                    itemLayoutAnimation={layout}
                    data={valueArray}
                    scrollEnabled={false}
                    // removeClippedSubviews={true}
                    contentContainerStyle={[
                        styles.flatlistContainer,
                        position == "top"
                            ? {
                                  flexDirection: "column",
                                  paddingBottom: 100,
                              }
                            : { flexDirection: "column-reverse", paddingTop: 100 },
                        valueArray.length == 0
                            ? {
                                  paddingRight: 0,
                              }
                            : {},
                    ]}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AnimatedItem item={item} removeToast={removeToast} didShowToast={didShowToast} />
                    )}
                />
            </TransitionView>
        </Portal>
    );
};

const Toast = {};

export const showToast = ({ type, title, description, duration } = {}) => {
    Toast.showToast && Toast.showToast({ type, title, description, duration });
};

export const showToastSuccess = ({ title, description } = {}) => {
    showToast({
        type: "success",
        title: title,
        description: description,
    });
};

export const showToastError = ({ title, description } = {}) => {
    showToast({
        type: "error",
        title: title,
        description: description,
    });
};

export const clearAllToast = () => {
    Toast.clearAllToast && Toast.clearAllToast();
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        zIndex: 9999,
        justifyContent: "center",
        backgroundColor: "transparent",
    },

    flatlistContainer: {
        flex: 1,
        flexGrow: 1,
        paddingVertical: rem,
        paddingRight: 2 * rem,
        justifyContent: "flex-start",
    },

    contentContainer: {
        flexDirection: "column",
    },

    singleItemView: {
        flexDirection: "row",
        width: 320 * unit,
        marginLeft: 14 * unit,
        marginVertical: rem / 2,
        backgroundColor: "rgba(0,0,0,0.85)",
        alignItems: "flex-start",
        justifyContent: "center",
        borderRadius: 12 * unit,
        elevation: 6,
        overflow: "hidden",
    },

    singleItemContainer: {
        flex: 1,
        paddingVertical: 1.5 * rem,
        paddingLeft: rem,
        paddingRight: 5 * rem,
        borderLeftWidth: 6 * unit,
        flexDirection: "row",
        justifyContent: "flex-start",
    },

    singleItemContentContainer: { paddingRight: 8 * unit },

    title: {
        fontSize: 15 * fontUnit,
        fontFamily: GoogleSansFontType.bold,
    },

    description: {
        paddingTop: 2 * unit,
        color: Color.gray_2,
    },

    TouchableOpacityStyle: {
        position: "absolute",
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        right: 30,
        bottom: 30,
    },

    FloatingButtonStyle: {
        resizeMode: "contain",
        width: 50,
        height: 50,
    },

    closeButton: {
        position: "absolute",
        right: 0,
        padding: 10 * unit,
        width: 50 * unit,
        height: 50 * unit,
    },

    deleteIcon: {
        width: "100%",
        color: Color.gray_4,
        fontSize: 30 * unit,
    },
});

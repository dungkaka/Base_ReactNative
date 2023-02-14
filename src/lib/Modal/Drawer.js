import Portal from "@burstware/react-native-portal";
import { WIDTH } from "@theme/scale";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { BackHandler, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView);

// Only use this component wrapped inside a <Portal.Host> component.
// <Portal.Host> component should be inside a full screen component.

const Drawer = forwardRef(({ drawerStyle = { minWidth: WIDTH / 2 }, onPressBackdrop, children, position = "right" }, ref) => {
    const _p = useRef(position == "right" ? 1 : -1).current;
    const animateModal = useSharedValue(_p);
    const displayModal = useSharedValue("none");

    useEffect(() => {
        return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, []);

    useImperativeHandle(ref, () => ({
        open: () => {
            animatedOpenModal();
        },
        close: () => {
            animatedCloseModal();
        },
    }));

    const onBackPress = useCallback(() => {
        animatedCloseModal();
        return true;
    }, []);

    const animatedOpenModal = () => {
        displayModal.value = "flex";
        animateModal.value = withTiming(0, { duration: 400 });
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
    };

    const animatedCloseModal = () => {
        animateModal.value = withTiming(_p, { duration: 400 }, () => {
            displayModal.value = "none";
        });
        Keyboard.dismiss();
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };

    const modalAnimated = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: animateModal.value * WIDTH,
                },
            ],
        };
    });

    const backDropAnimated = useAnimatedStyle(() => ({
        opacity: interpolate(animateModal.value, [0, _p], [1, 0]),
    }));

    const containerStyle = useAnimatedStyle(() => ({
        display: displayModal.value,
    }));

    return (
        <Portal>
            <AnimatedKeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={[styles.modalContainer, containerStyle]}
            >
                <AnimatedPressable
                    style={[styles.backdrop, backDropAnimated]}
                    onPress={() => {
                        onPressBackdrop ? onPressBackdrop : animatedCloseModal();
                    }}
                />
                <Animated.View style={[styles.modal, drawerStyle, _p == 1 ? { right: 0 } : { left: 0 }, modalAnimated]}>
                    {children}
                </Animated.View>
            </AnimatedKeyboardAvoidingView>
        </Portal>
    );
});

export default Drawer;

const styles = StyleSheet.create({
    modalContainer: {
        ...StyleSheet.absoluteFill,
        overflow: "hidden",
        backgroundColor: "transparent",
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modal: {
        position: "absolute",
        top: 0,
        height: "100%",
    },
});

{
    /* <TouchableWithoutFeedback onPress={animatedCloseModal}>
                <Animated.View style={[styles.backdrop, backDropAnimated]} />
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.modal, drawerStyle, _p == 1 ? { right: 0 } : { left: 0 }, modalAnimated]}>
                {children}
            </Animated.View> */
}

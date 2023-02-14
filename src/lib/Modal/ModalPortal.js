import Portal from "@lib/Portal";
import { HEIGHT, WIDTH } from "@theme/scale";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { BackHandler, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet } from "react-native";
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView);

// Only use this component wrapped inside a <Portal.Host> component.
// <Portal.Host> component should be inside a full screen component.

// Bug on IOS, sometime, modal onIOS is scale not expect on somewhere first rerender on parent view because of modalAnimated (unknow reason), so please alway render Modal at the first time and control render child inside, see ModalDatePicker to see example ({date && ...}).

const ModalPortal = forwardRef(
    (
        {
            lazyLoad = true,
            unmountOnHide = false,
            modalStyle = styles.modal,
            backDropColor = "rgba(0,0,0,0.5)",
            animationTimeIn = 400,
            animationTimeout = 250,
            onPressBackdrop,
            onBackHandler = () => {},
            onAnimatedOpenEnd = () => {},
            onAnimatedCloseEnd = () => {},
            children,
            // A props for modal contain input so that we can click outside to hide keyboard.
            containInputControlKeyboard = false,
        },
        ref
    ) => {
        const [isReady, setIsReady] = useState(!lazyLoad && !unmountOnHide);
        const animateModal = useSharedValue(0);
        const displayModal = useSharedValue(0);
        const willOpenModal = useRef(false);

        useEffect(() => {
            return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, []);

        useLayoutEffect(() => {
            if (isReady && willOpenModal.current) requestAnimationFrame(() => animatedOpenModal());
            willOpenModal.current = false;
        }, [isReady]);

        useImperativeHandle(ref, () => ({
            open: () => {
                if (!isReady) {
                    willOpenModal.current = true;
                    setIsReady(true);
                    return;
                }

                requestAnimationFrame(() => animatedOpenModal());
            },
            close: () => {
                requestAnimationFrame(() => animatedCloseModal());
            },
        }));

        const onBackPress = useCallback(() => {
            onBackHandler();
            return true;
        }, []);

        const animatedOpenModal = () => {
            displayModal.value = 1;
            animateModal.value = withTiming(
                1,
                { easing: Easing.bezier(0.39, 0.35, 0.14, 1.26), duration: animationTimeIn },
                () => {
                    runOnJS(onAnimatedOpenEnd)();
                }
            );
            BackHandler.addEventListener("hardwareBackPress", onBackPress);
        };

        const animatedCloseModal = () => {
            // When close right after open, maybe overlay still show, need that to sure close completely run !
            animateModal.value = withDelay(
                2,
                withTiming(
                    0,
                    {
                        easing: Easing.inOut(Easing.quad),
                        duration: animationTimeout,
                    },
                    () => {
                        displayModal.value = 0;
                        runOnJS(onAnimatedCloseEnd)();
                        unmountOnHide && runOnJS(setIsReady)(false);
                    }
                )
            );
            Keyboard.dismiss();
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        };

        const modalAnimated = useAnimatedStyle(() => {
            return {
                transform: [
                    {
                        scale: 0.5 + animateModal.value * 0.5,
                    },
                ],
            };
        });

        const containerStyle = useAnimatedStyle(() => {
            return Platform.OS == "ios"
                ? {
                      opacity: animateModal.value * 1.2,
                      transform: [
                          {
                              scale: displayModal.value,
                          },
                      ],
                  }
                : {
                      opacity: animateModal.value * 1.2,
                      transform: [
                          {
                              translateX: (1 - displayModal.value) * WIDTH * 2,
                          },
                      ],
                      //   display: displayModal.value ? "flex" : "none",
                      //   width: displayModal.value == 1 ? "100%" : "0%",
                      //   height: displayModal.value == 1 ? "100%" : "0%",
                  };
        });

        return (
            <Portal>
                <AnimatedKeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={[styles.modalContainer, containerStyle]}
                >
                    <AnimatedPressable
                        style={[styles.backdrop, { backgroundColor: backDropColor }]}
                        onPress={() => {
                            onPressBackdrop ? onPressBackdrop() : animatedCloseModal();
                        }}
                    />
                    <Animated.View
                        onStartShouldSetResponder={() => containInputControlKeyboard}
                        onResponderRelease={containInputControlKeyboard ? Keyboard.dismiss : undefined}
                        style={[modalStyle, modalAnimated]}
                    >
                        {isReady && children}
                    </Animated.View>
                </AnimatedKeyboardAvoidingView>
            </Portal>
        );
    }
);

export default ModalPortal;

const styles = StyleSheet.create({
    modalContainer: {
        ...StyleSheet.absoluteFill,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "transparent",
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modal: {},
});

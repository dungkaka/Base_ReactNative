import Portal from "@lib/Portal";
import { HEIGHT, WIDTH } from "@theme/scale";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { BackHandler, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet } from "react-native";
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView);

// Only use this component wrapped inside a <Portal.Host> component.
// <Portal.Host> component should be inside a full screen component.

// Bug on IOS, sometime, modal onIOS is scale not expect on somewhere first rerender on parent view because of modalAnimated (unknow reason), so please alway render Modal at the first time and control render child inside, see ModalDatePicker to see example ({date && ...}).

/* Usage: 
-- BASIC --

    ref.current.open({
        controlElementRef: buttonRef,
        originPlace: POPUP_ORIGIN_PLACE.BOTTOM_LEFT,
        direction: POPUP_DIRECTION.RIGHT,
        relativeXY: [0, 20],
        vectorTransform: [100, 100],
    })

    . controlElementRef: Button click to show popup
    . originPlace: A point that popup start from
    . direction: A direction that popup will animated to
    . relativeXY: Relative coordinate to origin place
    . vectorTransfrom: Transform path (vector của phép tịnh tiến)

-- ADVANCE 1 -- Determine a start point and end point

    Use when case you had a start point and end point of transfrom fromXY -> toXY.
    When declare fromXY: originPlace is ignored
    When declare toXY: vectoTransfrom is ignored
    When declare both fromXY to toXY: originPlace, direction, relativeXY, vectorTransfrom is ignored

    ref.current.open({
        controlElementRef: buttonRef,
        originPlace: POPUP_ORIGIN_PLACE.BOTTOM_LEFT,
        direction: POPUP_DIRECTION.RIGHT,
        relativeXY: [0, 20],
        vectorTransform: [100, 100],
        fromXY: [0, HEIGHT / 3],
        toXY: [WIDTH / 2, HEIGHT / 2],
    })

-- ADVANCE 2 -- Set popup with initial scale and borderAnimated
    For determined edge border may not want to apply borderAnimatedDynamicInterpolate,
    set border radius on modalStyle (borderTopLeftRadius: 0 || borderBottomRightRadius: 0 || ...)
    First parameter is value of border, second parameter is which vertext that apply border
    include [top-left, top-right, bottom-right, bottom-left], 1 is apply, 0 is non.

    ref.current.open({
        ...
        borderAnimatedInterpolate: [30, [0, 1, 1, 1]],
        initialScale: 0.2,
    })

*/

export const POPUP_DIRECTION = {
    RIGHT_DOWN: "RIGHT_DOWN",
    LEFT_DOWN: "LEFT_DOWN",
    RIGHT_UP: "RIGHT_UP",
    LEFT_UP: "LEFT_UP",
    CENTER: "CENTER",
    DOWN: "TOP",
    UP: "BOTTOM",
    RIGHT: "RIGHT",
    LEFT: "LEFT",
};

export const POPUP_ORIGIN_PLACE = {
    TOP_LEFT: "TOP_LEFT",
    TOP_RIGHT: "TOP_RIGHT",
    BOTTOM_LEFT: "BOTTOM_LEFT",
    BOTTOM_RIGHT: "BOTTOM_RIGHT",
    CENTER: "CENTER",
    TOP: "TOP",
    BOTTOM: "BOTTOM",
    RIGHT: "RIGHT",
    LEFT: "LEFT",
};

const Popup = forwardRef(
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
        const startCoordinateModal = useSharedValue([0, 0]);
        const endCoordinateModal = useSharedValue([0, 0]);
        const modalLayout = useSharedValue();
        const controlElementLayout = useSharedValue();
        const relativeModalLayout = useSharedValue({
            direction: POPUP_DIRECTION.CENTER,
            originPlace: POPUP_ORIGIN_PLACE.CENTER,
            relativeXY: [0, 0],
            toXY: [0, 0],
            fromXY: [0, 0],
        });
        const styleModalLayout = useSharedValue({
            borderAnimatedInterpolate: [0, [0, 0, 0, 0]],
            initialScale: 0.2,
        });

        useEffect(() => {
            return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, []);

        useImperativeHandle(ref, () => ({
            open: ({
                controlElementRef,
                originPlace,
                direction,
                relativeXY,
                vectorTransform,
                fromXY,
                toXY,
                borderAnimatedInterpolate = [0, [0, 0, 0, 0]],
                initialScale = 0.2,
            } = {}) => {
                if (!isReady) {
                    setIsReady(true);
                }
                relativeModalLayout.value = {
                    direction,
                    originPlace,
                    vectorTransform,
                    relativeXY,
                    toXY,
                    fromXY,
                };
                styleModalLayout.value = {
                    borderAnimatedInterpolate,
                    initialScale,
                };
                if (controlElementRef?.current) {
                    controlElementRef.current.measure((x, y, w, h, px, py) => {
                        controlElementLayout.value = {
                            width: w,
                            height: h,
                            x: px,
                            y: py,
                            start: true,
                        };
                    });
                } else {
                    controlElementLayout.value = {
                        start: true,
                    };
                }
            },
            close: () => {
                requestAnimationFrame(() => animatedCloseModal());
            },
        }));

        const requestAnimationFrameModal = () => {
            requestAnimationFrame(() => animatedOpenModal());
        };

        useAnimatedReaction(
            () => {
                modalLayout.value;
                controlElementLayout.value;
            },
            () => {
                // For lazyload or unmouneOnHide, await until got the layout of modal
                if (controlElementLayout.value?.start && modalLayout.value) {
                    if (isReady) {
                        const {
                            x: x1 = WIDTH / 2,
                            y: y1 = HEIGHT / 2,
                            width: w1 = 0,
                            height: h1 = 0,
                        } = controlElementLayout.value || {};
                        const { x: x2, y: y2, width: w2 = 0, height: h2 = 0 } = modalLayout.value || {};

                        // transform coordinate from center of screen to top_left of screen
                        const OXY = [x1 - WIDTH / 2, y1 - HEIGHT / 2];
                        const {
                            originPlace,
                            direction,
                            vectorTransform = [0, 0],
                            relativeXY: rXY = [0, 0],
                            fromXY,
                            toXY,
                        } = relativeModalLayout.value;

                        const { initialScale } = styleModalLayout.value;

                        // ox: origin x by relativeModalLayout origin
                        // oy: origin y by relativeModalLayout
                        // kx: hệ số translate_X to right (1) or left (-1) , 0 is no translate
                        // ky: hệ số translate_y to right (1) or left (-1) , 0 is no translate
                        let o_xy, k_xy;

                        switch (originPlace) {
                            case POPUP_ORIGIN_PLACE.TOP_LEFT:
                                o_xy = OXY;
                                break;
                            case POPUP_ORIGIN_PLACE.TOP_RIGHT:
                                o_xy = [OXY[0] + w1, OXY[1]];
                                break;
                            case POPUP_ORIGIN_PLACE.BOTTOM_LEFT:
                                o_xy = [OXY[0], OXY[1] + h1];
                                break;
                            case POPUP_ORIGIN_PLACE.BOTTOM_RIGHT:
                                o_xy = [OXY[0] + w1, OXY[1] + h1];
                                break;
                            case POPUP_ORIGIN_PLACE.TOP:
                                o_xy = [OXY[0] + w1 / 2, OXY[1]];
                                break;
                            case POPUP_ORIGIN_PLACE.RIGHT:
                                o_xy = [OXY[0] + w1, OXY[1] + h1 / 2];
                                break;
                            case POPUP_ORIGIN_PLACE.BOTTOM:
                                o_xy = [OXY[0] + w1 / 2, OXY[1] + h1];
                                break;
                            case POPUP_ORIGIN_PLACE.LEFT:
                                o_xy = [OXY[0], OXY[1] + h1 / 2];
                                break;
                            case POPUP_ORIGIN_PLACE.CENTER:
                                o_xy = [OXY[0] + w1 / 2, OXY[1] + h1 / 2];
                                break;
                            default:
                                o_xy = [OXY[0] + w1 / 2, OXY[1] + h1 / 2];
                                break;
                        }

                        switch (direction) {
                            case POPUP_DIRECTION.RIGHT_DOWN:
                                k_xy = [1, 1];
                                break;
                            case POPUP_DIRECTION.LEFT_DOWN:
                                k_xy = [-1, 1];
                                break;
                            case POPUP_DIRECTION.RIGHT_UP:
                                k_xy = [1, -1];
                                break;
                            case POPUP_DIRECTION.LEFT_UP:
                                k_xy = [-1, -1];
                                break;
                            case POPUP_DIRECTION.DOWN:
                                k_xy = [0, 1];
                                break;
                            case POPUP_DIRECTION.UP:
                                k_xy = [0, -1];
                                break;
                            case POPUP_DIRECTION.RIGHT:
                                k_xy = [1, 0];
                                break;
                            case POPUP_DIRECTION.LEFT:
                                k_xy = [-1, 0];
                                break;
                            case POPUP_DIRECTION.CENTER:
                                k_xy = [0, 0];
                                break;
                            default:
                                k_xy = [0, 0];
                                break;
                        }

                        startCoordinateModal.value = fromXY
                            ? [-WIDTH / 2 + fromXY[0], -HEIGHT / 2 + fromXY[1]]
                            : [
                                  o_xy[0] + rXY[0] + k_xy[0] * ((w2 / 2) * initialScale),
                                  o_xy[1] + rXY[1] + k_xy[1] * ((h2 / 2) * initialScale),
                              ];
                        endCoordinateModal.value = toXY
                            ? [-WIDTH / 2 + toXY[0], -HEIGHT / 2 + toXY[1]]
                            : [
                                  o_xy[0] + rXY[0] + vectorTransform[0] + k_xy[0] * (w2 / 2),
                                  o_xy[1] + rXY[1] + vectorTransform[1] + k_xy[1] * (h2 / 2),
                              ];
                        runOnJS(requestAnimationFrameModal)();
                    }
                    controlElementLayout.value = {
                        ...controlElementLayout.value,
                        start: false,
                    };
                }
            }
        );

        const onBackPress = useCallback(() => {
            onBackHandler();
            return true;
        }, []);

        const animatedOpenModal = () => {
            displayModal.value = 1;
            animateModal.value = withTiming(
                1,
                { easing: Easing.bezier(0.4, 0.35, 0.15, 1.2), duration: animationTimeIn },
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
                        easing: Easing.in(Easing.quad),
                        duration: animationTimeout,
                    },
                    () => {
                        displayModal.value = 0;
                        startCoordinateModal.value = [0, 0];
                        endCoordinateModal.value = [0, 0];
                        runOnJS(onAnimatedCloseEnd)();
                        unmountOnHide && runOnJS(setIsReady)(false);
                    }
                )
            );
            Keyboard.dismiss();
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        };

        const modalAnimated = useAnimatedStyle(() => {
            const { initialScale, borderAnimatedInterpolate: bAI } = styleModalLayout.value;
            const b = bAI[0] > 0 ? interpolate(animateModal.value, [0, 1], [bAI[0], 0]) : 0;

            return {
                borderTopLeftRadius: bAI[1][0] != 1 ? 0 : b,
                borderTopRightRadius: bAI[1][1] != 1 ? 0 : b,
                borderBottomRightRadius: bAI[1][2] != 1 ? 0 : b,
                borderBottomLeftRadius: bAI[1][3] != 1 ? 0 : b,
                overflow: bAI[0] > 0 ? "hidden" : "visible",
                transform: [
                    {
                        translateX: interpolate(
                            animateModal.value,
                            [0, 1],
                            [startCoordinateModal.value[0], endCoordinateModal.value[0]]
                        ),
                    },
                    {
                        translateY: interpolate(
                            animateModal.value,
                            [0, 1],
                            [startCoordinateModal.value[1], endCoordinateModal.value[1]]
                        ),
                    },
                    {
                        scale: initialScale + animateModal.value * (1 - initialScale),
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
                      opacity: interpolate(animateModal.value, [0, 0.2, 1], [0, 0.6, 1]),
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
                        onLayout={(event) => {
                            if (isReady) modalLayout.value = event.nativeEvent.layout;
                        }}
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

export default Popup;

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
    },
    modal: {},
});

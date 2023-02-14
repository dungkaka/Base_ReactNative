import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
    Easing,
    Extrapolate,
    interpolate,
    useAnimatedGestureHandler,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
const { width: WIDTH } = Dimensions.get("window");

// CONVERT WHEEL PICKER FROM WILLIAM PROJECT ON REANIMATED V2.
// It does not include masked-view or default value, just convert animation.

// Some variable and constant to use in this project
const ITEM_HEIGHT = 34;
const VISIBLE_ITEMS = 5;
const timmingConfig = {
    duration: 1000,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
};
const start = 1960;
const values = new Array(new Date().getFullYear() - start + 1)
    .fill(0)
    .map((_, i) => {
        const value = start + i;
        return { value, label: `${value}` };
    })
    .reverse();

const snapPoint = (value, velocity, points) => {
    "worklet";
    const point = value + 0.2 * velocity;
    const deltas = points.map((p) => {
        return Math.abs(point - p);
    });
    const minDelta = Math.min.apply(null, deltas);
    return points.filter((p) => {
        return Math.abs(point - p) === minDelta;
    })[0];
};

const usePanGestureHandler = (snapPoints) => {
    const offset = useSharedValue(-ITEM_HEIGHT);
    const position = useSharedValue(offset.value);
    const toValue = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: () => {
            offset.value = position.value;
        },
        onActive: (event) => {
            position.value = offset.value + event.translationY;
            toValue.value = snapPoint(position.value, event.velocityY, snapPoints);
        },
        onEnd: () => {
            position.value = withTiming(toValue.value, timmingConfig);
        },
    });

    return { position, gestureHandler };
};

const GestureHandler = ({ max, pickerTranslateY }) => {
    const snapPoints = new Array(max).fill(0).map((_, i) => i * -ITEM_HEIGHT);
    const { position, gestureHandler } = usePanGestureHandler(snapPoints);

    useAnimatedReaction(
        () => {
            position.value;
        },
        () => {
            pickerTranslateY.value = position.value + ITEM_HEIGHT * 2;
        },
        []
    );

    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(255, 255, 255, 0.1)" }]} />
        </PanGestureHandler>
    );
};

const Picker = ({ values, defaultValue }) => {
    const translateY = useSharedValue(0);

    const viewStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <View style={styles.pickerContainer}>
            <Animated.View style={viewStyle}>
                {values.map((v, i) => {
                    const y = useDerivedValue(() =>
                        interpolate(
                            (translateY.value - ITEM_HEIGHT * 2) / -ITEM_HEIGHT,
                            [i - 3, i, i + 3],
                            [-1, 0, 1],
                            Extrapolate.CLAMP
                        )
                    );

                    const childViewStyle = useAnimatedStyle(() => ({
                        transform: [
                            { perspective: 500 },
                            { rotateX: 90 * y.value + "deg" },
                            {
                                scale: 1 - 0.1 * Math.abs(y.value),
                            },
                        ],
                    }));

                    return (
                        <Animated.View key={v.value} style={[styles.item, childViewStyle]}>
                            <Text style={styles.label}>{v.label}</Text>
                        </Animated.View>
                    );
                })}
            </Animated.View>

            <GestureHandler pickerTranslateY={translateY} max={values.length} />
        </View>
    );
};

const Index = () => {
    return (
        <View style={styles.appContainer}>
            <Text style={styles.title}>What year were you born?</Text>
            <Picker values={values} />
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    pickerContainer: {
        width: 0.61 * WIDTH,
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        overflow: "hidden",
    },
    title: {
        color: "white",
        fontSize: 24,
        marginBottom: 31,
    },
    item: {
        height: ITEM_HEIGHT,
        justifyContent: "center",
    },
    label: {
        color: "white",
        fontSize: 24,
        lineHeight: ITEM_HEIGHT,
        textAlign: "center",
        textAlignVertical: "center",
    },
});

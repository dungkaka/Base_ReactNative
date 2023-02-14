import MaskedView from "@react-native-masked-view/masked-view";
import { WIDTH } from "@theme/scale";
import React, { Fragment, useRef } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Animated, {
    runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from "react-native-reanimated";

const FlatListAnimted = Animated.createAnimatedComponent(FlatList);

const Item = React.memo(({ item, i, scrollPosition, h, half, renderChild }) => {
    const animatedItem = useDerivedValue(() => {
        const v = (scrollPosition.value - i) / (half + 1);
        if (v <= -1) return -1;
        if (v >= 1) return 1;
        return v;
    });

    const childViewStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: half * 200 },
            { rotateX: 80 * animatedItem.value + "deg" },
            {
                scale: 1 - 0.1 * Math.abs(animatedItem.value),
            },
        ],
    }));

    return (
        <Animated.View style={[styles.item, { height: h }, childViewStyle]}>{renderChild({ item, index: i })}</Animated.View>
    );
});

const WheelPicker = ({
    wheelRef = useRef(),
    data = [],
    itemHeight: h = 30,
    numberVisibleItem: n = 5,
    opacityInactiveItem = 0.5,
    onValueChange = () => {},
    renderChild = ({ item, index }) => <Text style={styles.label}>Item {index}</Text>,
    initialIndex = -1,
    windowSize = 5,
    initialNumToRender = 5,
    decelerationRate = 0.9,
}) => {
    const half = (n - 1) / 2;
    const scrollPosition = useSharedValue(0);

    const renderItem = ({ item, index }) => {
        return <Item item={item} i={index} h={h} scrollPosition={scrollPosition} half={half} renderChild={renderChild} />;
    };

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollPosition.value = event.contentOffset.y / h;
        },
        onMomentumEnd: (event) => {
            runOnJS(onValueChange)(Math.round(event.contentOffset.y / h));
        },
    });

    return (
        <View style={{ height: n * h, width: "100%" }}>
            <MaskedView
                // pointerEvents={"none"}
                style={styles.maskedView}
                maskElement={
                    <Fragment>
                        <View style={{ height: h * half, backgroundColor: `rgba(0,0,0,${opacityInactiveItem})` }} />
                        <View style={{ height: h, backgroundColor: "white" }} />
                        <View style={{ height: h * half, backgroundColor: `rgba(0,0,0,${opacityInactiveItem})` }} />
                    </Fragment>
                }
            >
                <FlatListAnimted
                    ref={wheelRef}
                    scrollEventThrottle={16}
                    windowSize={windowSize}
                    initialNumToRender={initialNumToRender}
                    contentContainerStyle={{
                        paddingTop: h * half,
                        paddingBottom: h * half,
                    }}
                    getItemLayout={(data, index) => ({
                        length: h,
                        offset: h * index,
                        index,
                    })}
                    initialScrollIndex={initialIndex}
                    snapToOffsets={data.map((_, i) => i * h)}
                    snapToAlignment="center"
                    keyExtractor={(i) => i.label}
                    data={data}
                    renderItem={renderItem}
                    decelerationRate={decelerationRate}
                    onScroll={scrollHandler}
                    // removeClippedSubviews={true} bug on IOS
                    showsVerticalScrollIndicator={false}
                    fadingEdgeLength={h}
                />
            </MaskedView>
        </View>
    );
};

export default WheelPicker;

const styles = StyleSheet.create({
    container: {
        width: 0.61 * WIDTH,
        overflow: "hidden",
    },
    maskedView: {
        flex: 1,
        flexDirection: "row",
        height: "100%",
    },
    item: {
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        textAlignVertical: "center",
    },
});

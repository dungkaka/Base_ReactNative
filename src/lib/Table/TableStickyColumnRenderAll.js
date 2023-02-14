import React from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
    interpolate,
    scrollTo,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
const FlatListAnimated = Animated.createAnimatedComponent(FlatList);

const MemoRow = React.memo(
    ({ children = null, heightRow }) => {
        return <View style={{ height: heightRow, overflow: "hidden" }}>{children}</View>;
    },
    () => true
);

const TableStickyColumnRenderAll = ({
    data = [],
    leftHeader = null,
    rightHeader = null,
    LeftRow = ({ item, index }) => null,
    RightRow = ({ item, index }) => null,
    containerStyle,
    rightContainerStyle,
    leftContainerStyle,
    heightRow = 50,
    heightHeader = 50,
    leftWidth = 100,
    stickPosition = 100,
}) => {
    const allowScroll = useSharedValue(0);
    const rightARef = useAnimatedRef();
    const leftARef = useAnimatedRef();
    const leftContainerAnimated = useSharedValue(0);

    const onRightScroll = useAnimatedScrollHandler({
        onBeginDrag: () => {
            allowScroll.value = 2;
        },
        onScroll: (event) => {
            if (allowScroll.value == 1) return;
            scrollTo(leftARef, 0, event.contentOffset.y, false);
            allowScroll.value = 0;
        },
    });

    const onLeftScroll = useAnimatedScrollHandler({
        onBeginDrag: () => {
            allowScroll.value = 1;
        },
        onScroll: (event) => {
            if (allowScroll.value == 2) return;
            scrollTo(rightARef, 0, event.contentOffset.y, false);
            allowScroll.value = 0;
        },
    });

    const onRightHorizontalScroll = useAnimatedScrollHandler((event) => {
        const x = event.contentOffset.x;
        leftContainerAnimated.value = x > stickPosition ? -stickPosition : -x;
    });

    const leftContainerStyleAnimated = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: leftContainerAnimated.value,
            },
        ],
    }));

    const renderLeftRow = ({ item, index }) => (
        <MemoRow key={index} heightRow={heightRow}>
            <LeftRow index={index} item={item} />
        </MemoRow>
    );

    const renderRightRow = ({ item, index }) => (
        <MemoRow key={index} heightRow={heightRow}>
            <RightRow index={index} item={item} />
        </MemoRow>
    );

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.rightContainer, rightContainerStyle]}>
                <Animated.ScrollView horizontal scrollEventThrottle={16} onScroll={onRightHorizontalScroll}>
                    <View>
                        <View style={{ height: heightHeader, paddingLeft: leftWidth, overflow: "hidden" }}>{rightHeader}</View>
                        <FlatListAnimated
                            ref={rightARef}
                            getItemLayout={(data, index) => ({
                                length: heightRow,
                                offset: heightRow * index,
                                index,
                            })}
                            contentContainerStyle={{ paddingLeft: leftWidth }}
                            windowSize={7}
                            bounces={false}
                            keyExtractor={(_, i) => i.toString()}
                            data={data}
                            scrollEventThrottle={16}
                            onScroll={onRightScroll}
                            renderItem={renderRightRow}
                            decelerationRate={0.9}
                        />
                    </View>
                </Animated.ScrollView>
            </View>
            <Animated.View style={[{ width: leftWidth }, leftContainerStyleAnimated, leftContainerStyle]}>
                <View style={{ height: heightHeader, overflow: "hidden" }}>{leftHeader}</View>

                <FlatListAnimated
                    ref={leftARef}
                    getItemLayout={(data, index) => ({
                        length: heightRow,
                        offset: heightRow * index,
                        index,
                    })}
                    windowSize={7}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(_, i) => i.toString()}
                    data={data}
                    renderItem={renderLeftRow}
                    onScroll={onLeftScroll}
                    scrollEventThrottle={16}
                    bounces={false}
                    decelerationRate={0.9}
                />
            </Animated.View>
        </View>
    );
};

export default TableStickyColumnRenderAll;

const styles = StyleSheet.create({
    padding: {
        padding: 12,
    },
    container: {
        flexDirection: "row",
    },
    rightContainer: {
        ...StyleSheet.absoluteFill,
    },
});

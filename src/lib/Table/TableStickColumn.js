import { AppTextMedium } from "@lib/AppText";
import Pagination from "@lib/Pagination/TabPagination";
import { Color } from "@theme/colors";
import { rem } from "@theme/styleContants";
import React, { Fragment } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Animated, {
    scrollTo,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
const FlatListAnimated = Animated.createAnimatedComponent(FlatList);

const MemoRow = React.memo(
    ({ children = null, heightRow, index }) => {
        return <View style={{ height: heightRow }}>{children}</View>;
    },
    (prev, next) => prev.item == next.item && prev.isMark == next.isMark
);

const TableStickColumn = ({
    data = [],
    marks = {},
    keyItem = "key",
    renderLeftHeader = () => null,
    renderRightHeader = () => null,
    renderLeftRow: pRenderLeftRow = ({ item, index }) => null,
    renderRightRow: pRenderRightRow = ({ item, index }) => null,
    containerStyle,
    rightContainerStyle,
    leftContainerStyle,
    heightRow = 50,
    heightHeader = 50,
    leftWidth = 100,
    stickPosition = 100,
    EmptyDataComponent = null,
    showPagination = false,
    paginationInfo = { total: 0, page: 0, pageSize: 20, currentPageSize: 0, onChangePage: (page) => {} },
    paginationContainerStyle,
}) => {
    const allowScroll = useSharedValue(0);
    const rightARef = useAnimatedRef();
    const leftARef = useAnimatedRef();
    const leftContainerAnimated = useSharedValue(0);
    const currentDragScroll = useSharedValue(0);
    const paginationAnimated = useSharedValue(0);

    const changeStatusPagination = (dif) => {
        "worklet";
        if (Math.abs(dif) < 25) {
        } else if (dif < 0) {
            paginationAnimated.value = withTiming(0);
        } else paginationAnimated.value = withTiming(80);
    };

    const onRightScroll = useAnimatedScrollHandler({
        onBeginDrag: (event) => {
            currentDragScroll.value = event.contentOffset.y;
            allowScroll.value = 2;
        },
        onScroll: (event) => {
            if (allowScroll.value == 1) return;
            scrollTo(leftARef, 0, event.contentOffset.y, false);
            allowScroll.value = 0;
        },
        onEndDrag: (event) => {
            changeStatusPagination(event.contentOffset.y - currentDragScroll.value);
        },
    });

    const onLeftScroll = useAnimatedScrollHandler({
        onBeginDrag: (event) => {
            currentDragScroll.value = event.contentOffset.y;
            allowScroll.value = 1;
        },
        onScroll: (event) => {
            if (allowScroll.value == 2) return;
            scrollTo(rightARef, 0, event.contentOffset.y, false);
            allowScroll.value = 0;
        },
        onEndDrag: (event) => {
            changeStatusPagination(event.contentOffset.y - currentDragScroll.value);
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

    const paginationStyleAnimated = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: paginationAnimated.value,
            },
        ],
    }));

    const renderLeftRow = ({ item, index }) => {
        const isMark = !!marks[item[keyItem]];
        return (
            <MemoRow heightRow={heightRow} item={item} isMark={isMark}>
                {pRenderLeftRow({ item, index, isMark })}
            </MemoRow>
        );
    };

    const renderRightRow = ({ item, index }) => {
        const isMark = !!marks[item[keyItem]];
        return (
            <MemoRow heightRow={heightRow} item={item} isMark={isMark}>
                {pRenderRightRow({ item, index, isMark })}
            </MemoRow>
        );
    };

    return (
        <Fragment>
            <View style={[styles.container, data.length == 0 ? { flex: 0 } : undefined, containerStyle]}>
                <View style={[styles.rightContainer, rightContainerStyle]}>
                    <Animated.ScrollView horizontal scrollEventThrottle={16} onScroll={onRightHorizontalScroll}>
                        <View>
                            <View style={{ height: heightHeader, paddingLeft: leftWidth, overflow: "hidden" }}>
                                {renderRightHeader()}
                            </View>
                            <FlatListAnimated
                                ref={rightARef}
                                getItemLayout={(data, index) => ({
                                    length: heightRow,
                                    offset: heightRow * index,
                                    index,
                                })}
                                initialNumToRender={heightRow > 80 ? 8 : 12}
                                contentContainerStyle={{ paddingLeft: leftWidth }}
                                windowSize={7}
                                bounces={false}
                                keyExtractor={(item, index) => (item?.[keyItem] || index).toString()}
                                data={data}
                                scrollEventThrottle={16}
                                onScroll={onRightScroll}
                                renderItem={renderRightRow}
                                decelerationRate={0.9}
                                nestedScrollEnabled
                            />
                        </View>
                    </Animated.ScrollView>
                </View>
                <Animated.View style={[{ width: leftWidth }, leftContainerStyleAnimated, leftContainerStyle]}>
                    <View style={{ height: heightHeader, overflow: "hidden" }}>{renderLeftHeader()}</View>
                    <FlatListAnimated
                        ref={leftARef}
                        getItemLayout={(data, index) => ({
                            length: heightRow,
                            offset: heightRow * index,
                            index,
                        })}
                        windowSize={7}
                        initialNumToRender={heightRow > 80 ? 8 : 12}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => (item?.[keyItem] || index).toString()}
                        data={data}
                        renderItem={renderLeftRow}
                        onScroll={onLeftScroll}
                        scrollEventThrottle={16}
                        bounces={false}
                        decelerationRate={0.9}
                        nestedScrollEnabled
                    />
                </Animated.View>
            </View>
            {data.length == 0 ? (
                EmptyDataComponent ? (
                    EmptyDataComponent
                ) : (
                    <View style={styles.centerEmptyData}>
                        <AppTextMedium style={{ color: Color.gray_8 }}>Dữ liệu trống</AppTextMedium>
                    </View>
                )
            ) : null}
            {showPagination ? (
                <Animated.View style={[styles.paginationBlock, paginationContainerStyle, paginationStyleAnimated]}>
                    <Pagination
                        total={paginationInfo.total}
                        page={paginationInfo.page}
                        limit={paginationInfo.pageSize}
                        numberShow={paginationInfo.currentPageSize}
                        onChangePage={paginationInfo.onChangePage}
                    />
                </Animated.View>
            ) : null}
        </Fragment>
    );
};

export default TableStickColumn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
    },
    rightContainer: {
        ...StyleSheet.absoluteFill,
    },
    centerEmptyData: {
        justifyContent: "center",
        alignItems: "center",
        padding: rem,
    },
    paginationBlock: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 6,
        marginHorizontal: 8,
        paddingVertical: 6,
        paddingHorizontal: 8,
        backgroundColor: "white",
        opacity: 0.9,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Color.gray_2,
    },
});

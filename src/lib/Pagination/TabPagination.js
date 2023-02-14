import { AppText, AppTextMedium } from "@lib/AppText";
import { Color } from "@theme/colors";
import React, { useEffect, useRef } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { unit } from "@theme/styleContants";
import { ColorDefault } from "@theme";
import { GoogleSansFontType } from "@theme/typography";

const calPagin12 = (page, totalPage, limit, numberShow) => {
    let pageArray = [];

    if (totalPage <= 12) {
        for (let i = 1; i <= totalPage; i++) {
            pageArray.push(i);
        }
    } else if (page < 6 || page > totalPage) {
        pageArray = [1, 2, 3, 4, 5, 6, 7, null, totalPage - 2, totalPage - 1, totalPage];
    } else if (page > totalPage - 6) {
        pageArray = [
            1,
            2,
            3,
            null,
            totalPage - 6,
            totalPage - 5,
            totalPage - 4,
            totalPage - 3,
            totalPage - 2,
            totalPage - 1,
            totalPage,
        ];
    } else {
        pageArray = [1, 2, 3, null, page - 1, page, page + 1, page + 2, null, totalPage - 2, totalPage - 1, totalPage];
    }

    const startResult = page > totalPage ? 0 : (page - 1) * limit + 1;
    const endResult = page > totalPage ? 0 : (page - 1) * limit + numberShow;

    return {
        pageArray,
        startResult,
        endResult,
    };
};

const calPagin8 = (page, totalPage, limit, numberShow) => {
    let pageArray = [];

    if (totalPage <= 8) {
        for (let i = 1; i <= totalPage; i++) {
            pageArray.push(i);
        }
    } else if (page < 5 || page > totalPage) {
        pageArray = [1, 2, 3, 4, 5, null, totalPage - 1, totalPage];
    } else if (page > totalPage - 4) {
        pageArray = [1, 2, null, totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
    } else {
        pageArray = [1, 2, null, page - 1, page, page + 1, null, totalPage - 1, totalPage];
    }

    const startResult = page > totalPage ? 0 : (page - 1) * limit + 1;
    const endResult = page > totalPage ? 0 : (page - 1) * limit + numberShow;

    return {
        pageArray,
        startResult,
        endResult,
    };
};

const ItemPag = ({ page, item, index, onChangePage }) => {
    if (item == null)
        return (
            <View style={styles.dotPage}>
                <AppText key={index}>. . .</AppText>
            </View>
        );

    return (
        <Pressable key={index} style={styles.pageBlock} onPress={() => onChangePage(item)}>
            <View style={item == page ? styles.pageContainerActive : styles.pageContainer}>
                <Text style={item == page ? styles.textPageActive : styles.textPage}>{item}</Text>
            </View>
        </Pressable>
    );
};

const Pagination = ({ showDes = false, total = 0, page = 1, limit = 20, numberShow = 0, onChangePage = (page) => {} }) => {
    const totalPage = Math.ceil(total / limit);
    const flatListRef = useRef();

    const { pageArray, startResult, endResult } = calPagin12(page, totalPage, limit, numberShow);

    useEffect(() => {
        const index = pageArray.findIndex((_page) => _page == page) - 2;
        totalPage > 0 &&
            flatListRef.current?.scrollToIndex?.({
                animated: false,
                index: index >= 0 ? index : 0,
            });
    }, [page]);

    return (
        <View style={styles.container}>
            {showDes && (
                <View style={styles.des}>
                    <AppText>Showing </AppText>
                    <AppTextMedium>{startResult} </AppTextMedium>
                    <AppText>to </AppText>
                    <AppTextMedium>{endResult} </AppTextMedium>
                    <AppText>of </AppText>
                    <AppTextMedium>{total} </AppTextMedium>
                    <AppText>results</AppText>
                </View>
            )}
            <View style={styles.listPage}>
                <Pressable disabled={page <= 1} onPress={() => onChangePage(page - 1)} style={styles.backIcon}>
                    <AntDesign name="left" size={16} color={Color.gray_10} />
                </Pressable>
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={flatListRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        getItemLayout={(data, index) => ({
                            length: 46,
                            offset: 46 * index,
                            index,
                        })}
                        initialNumToRender={10}
                        snapToAlignment="center"
                        // initialScrollIndex={pageArray.findIndex((_page) => _page == page) - 2}
                        data={pageArray}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <ItemPag page={page} item={item} index={index} onChangePage={onChangePage} />
                        )}
                    />
                </View>

                <Pressable disabled={page >= totalPage} style={styles.leftIcon} onPress={() => onChangePage(page + 1)}>
                    <AntDesign name="right" size={16} color={Color.gray_10} />
                </Pressable>
            </View>
        </View>
    );
};

export default React.memo(Pagination);

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    des: {
        paddingBottom: 4,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    listPage: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    backIcon: {
        height: 32,
        justifyContent: "center",
        marginVertical: 2 * unit,
        marginHorizontal: 3 * unit,
        paddingHorizontal: 6,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        borderColor: Color.gray_4,
        borderWidth: 1,
    },
    pageBlock: {
        width: 46,
        paddingHorizontal: 3,
        marginVertical: 2 * unit,
    },
    pageContainer: {
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
        borderRadius: 4,
        borderColor: Color.gray_4,
        borderWidth: 1,
    },
    pageContainerActive: {
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 1,
        borderRadius: 4,
        backgroundColor: ColorDefault.primary,
    },
    textPage: {
        color: Color.gray_12,
        fontFamily: GoogleSansFontType.regular,
    },
    textPageActive: {
        color: "white",
        fontFamily: GoogleSansFontType.bold,
    },
    leftIcon: {
        height: 32,
        marginVertical: 2 * unit,
        justifyContent: "center",
        marginHorizontal: 3 * unit,
        paddingHorizontal: 6,
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        borderColor: Color.gray_4,
        borderWidth: 1,
    },
    dotPage: {
        width: 46,
        alignItems: "center",
        justifyContent: "flex-end",
        bottom: 2,
    },
});

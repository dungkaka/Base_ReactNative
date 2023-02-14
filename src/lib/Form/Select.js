import { AppText, AppTextBold } from "@lib/AppText";
import ModalPortal from "@lib/Modal/ModalPortal";
import { MaterialIcons } from "@expo/vector-icons";
import { useOnlyDidUpdateLayoutEffect } from "@hooks/useOnlyDidUpdateLayoutEffetct";
import { ColorDefault } from "@theme";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MemoSelectItem = React.memo(
    ({ children = null, required, itemHeight, option, isActive, setActiveOption }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    if (isActive && !required) {
                        setActiveOption(undefined);
                        return;
                    } else {
                        setActiveOption(option);
                    }
                }}
                style={[styles.itemMemoSelectContainer, itemHeight ? { height: itemHeight } : { minHeight: 38 }]}
            >
                {children}
            </TouchableOpacity>
        );
    },
    (prev, next) => prev.isActive == next.isActive
);

const _OptionItem = ({ option, isActive }) => (
    <View style={styles.itemSelectContainer}>
        <AppText numberOfLines={2} style={[styles.itemSelect, isActive ? styles.activeItemSelect : {}]}>
            {option?.value.toString()}
        </AppText>
        {isActive ? <MaterialIcons name="cancel" style={styles.iconActive} /> : null}
    </View>
);

const _options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({
    key: i,
    value: "Option " + i,
}));

// Should care itemHeight when data length > 10
const Select = forwardRef(
    (
        {
            options = _options,
            initialOption = undefined,
            initialOptionOnChangeOptions = undefined,
            required = false,
            OptionItem = _OptionItem,
            onOk,
            title = "Selection",
            itemHeight = null,
            flatListProps = {},
        },
        ref
    ) => {
        const optionByKey = useMemo(() => {
            const temp = {};
            options.forEach((option, index) => {
                option.index = index;
                temp[option.key] = option;
            });
            return temp;
        }, [options]);

        const modalRef = useRef();
        const flatlistRef = useRef();
        const [activeOption, setActiveOption] = useState(initialOption);

        useOnlyDidUpdateLayoutEffect(() => {
            if (initialOptionOnChangeOptions) return setActiveOption(initialOptionOnChangeOptions);
            setActiveOption(undefined);
        }, [options]);

        useImperativeHandle(ref, () => ({
            open: (key) => {
                const option = optionByKey[key];
                if (option) {
                    if (option.key != activeOption?.key) setActiveOption(option);
                    flatlistRef.current?.scrollToIndex({ index: option.index, animated: false, viewPosition: 0.5 });
                } else {
                    setActiveOption(undefined);
                }

                modalRef.current.open();
            },
            close: () => {
                modalRef.current.close();
            },
            getSelection: () => activeOption,
        }));

        const renderItem = ({ item, index }) => {
            const isActive = item.key == activeOption?.key;
            return (
                <MemoSelectItem
                    required={required}
                    itemHeight={itemHeight}
                    isActive={isActive}
                    option={item}
                    setActiveOption={setActiveOption}
                >
                    <OptionItem option={item} index={index} isActive={isActive} />
                </MemoSelectItem>
            );
        };

        return (
            <ModalPortal
                ref={modalRef}
                onBackHandler={() => modalRef.current.close()}
                modalStyle={styles.modalStyle}
                lazyLoad={Platform.OS == "ios" ? true : false}
                unmountOnHide={false}
            >
                <View style={styles.modalContainer}>
                    {/* Title */}
                    <View style={styles.headerModal}>
                        <AppTextBold style={styles.leftTitleHeader}>{title}</AppTextBold>
                    </View>

                    <FlatList
                        ref={flatlistRef}
                        contentContainerStyle={styles.listContainer}
                        scrollEventThrottle={16}
                        windowSize={5}
                        initialNumToRender={12}
                        getItemLayout={
                            itemHeight
                                ? (options, index) => ({
                                      length: itemHeight,
                                      offset: itemHeight * index,
                                      index,
                                  })
                                : undefined
                        }
                        initialScrollIndex={activeOption ? optionByKey[activeOption.key]?.index : 0}
                        keyExtractor={(item, i) => item.key.toString()}
                        data={options}
                        renderItem={renderItem}
                        {...flatListProps}
                    />

                    {/* Footer */}
                    <View style={styles.footerModal}>
                        {/* Cancel */}
                        <TouchableOpacity
                            style={styles.buttonFooterModal}
                            onPress={() => {
                                modalRef.current.close();
                            }}
                        >
                            <AppText style={styles.textButtonFooterModal}> Cancel </AppText>
                        </TouchableOpacity>

                        {/* OK */}
                        <TouchableOpacity
                            style={styles.buttonFooterModal}
                            onPress={() => {
                                onOk ? onOk() : modalRef.current.close();
                            }}
                        >
                            <Text style={styles.textButtonFooterModal}> OK </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ModalPortal>
        );
    }
);

export default React.memo(Select, (prev, next) => prev.options == next.options);

const styles = StyleSheet.create({
    modalStyle: {
        width: 23 * rem,
        minWidth: "60%",
        minHeight: 23 * rem,
        maxHeight: "65%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContainer: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 12 * unit,
    },

    headerModal: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24 * unit,
        paddingTop: 2 * rem,
        paddingBottom: rem,
    },

    leftTitleHeader: {
        fontSize: 18 * unit,
        color: Color.gray_10,
    },

    listContainer: {
        paddingVertical: rem,
        paddingHorizontal: 12 * unit,
    },
    footerModal: {
        flexDirection: "row",
        marginHorizontal: 6 * unit,
        borderTopWidth: 1,
        borderTopColor: Color.gray_2,
    },
    buttonFooterModal: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 14 * unit,
    },
    textButtonFooterModal: {
        fontSize: 16 * unit,
        paddingHorizontal: 4 * unit,
        color: Color.gray_10,
        fontFamily: GoogleSansFontType.bold,
    },

    itemSelectContainer: {
        flexDirection: "row",
    },
    itemSelect: {
        flex: 1,
        paddingVertical: 8 * unit,
        marginVertical: 2 * unit,
        fontFamily: GoogleSansFontType.medium,
        fontSize: 15 * unit,
        color: Color.gray_9,
    },
    activeItemSelect: {
        paddingHorizontal: 12 * unit,
        color: "white",
        backgroundColor: ColorDefault.primary,
        borderRadius: 16 * unit,
        overflow: "hidden",
    },
    iconActive: {
        marginLeft: 6 * unit,
        flexDirection: "row",
        textAlignVertical: "center",
        fontSize: 32 * unit,
        color: ColorDefault.primary,
    },
    itemMemoSelectContainer: {
        flex: 1,
        paddingHorizontal: 14 * unit,
        justifyContent: "center",
        alignItems: "center",
    },
});

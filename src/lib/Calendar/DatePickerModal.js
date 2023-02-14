import { AppText, AppTextBold, AppTextMedium } from "@lib/AppText";
import ModalPortal from "@lib/Modal/ModalPortal";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DatePicker from "./DatePicker";
import { MODE, validateDate } from "./utils";

const renderTitle = (mode) => {
    switch (mode) {
        case "day":
            return "Chọn ngày";
        case "month":
            return "Chọn tháng";
        case "year":
            return "Chọn năm";
        default:
            return "Chọn ngày";
    }
};

const _ModalDatePicker = forwardRef(({ onOk, mode = "day", initialDate, delayRender = 200 }, ref) => {
    const modalRef = useRef();
    const [date, setDate] = useState(delayRender > 0 ? undefined : initialDate);

    useEffect(() => {
        if (!date)
            setTimeout(() => {
                requestAnimationFrame(() => {
                    setDate(initialDate);
                });
            }, delayRender);
    }, []);

    useImperativeHandle(ref, () => ({
        open: (date) => {
            if (date) setDate(date);
            modalRef.current?.open();
        },
        close: () => {
            modalRef.current.close();
        },
        getData: () => ({ date: date, isValid: isValidDate }),
    }));

    if (!date) return null;

    const isValidDate = validateDate(mode, date?.year, date?.month, date?.day);

    return (
        <ModalPortal
            ref={modalRef}
            onBackHandler={() => modalRef.current.close()}
            modalStyle={styles.modalStyle}
            lazyLoad={false}
            unmountOnHide={false}
        >
            <View style={styles.modalContainer}>
                <View style={styles.headerModal}>
                    <AppTextBold style={styles.leftTitleHeader}>{renderTitle(mode)}</AppTextBold>
                    <View style={styles.rightTitleContainerHeader}>
                        {isValidDate ? null : <FontAwesome name="exclamation" size={20} color={Color.redPastel} />}

                        <View style={styles.rightTitleHeader}>
                            <AntDesign name="calendar" size={18} color={Color.gray_8} />

                            <AppTextMedium style={styles.rightTitleText}>
                                {MODE[mode] <= MODE.day && date.day + "/"}
                                {MODE[mode] <= MODE.month && date.month + "/"}
                                {date.year}
                                {MODE[mode] <= MODE.hour
                                    ? " - " +
                                      (date.hour < 10 ? "0" + date.hour : date.hour) +
                                      ":" +
                                      (date.minute < 10 ? "0" + date.minute : date.minute) +
                                      ":00"
                                    : "  "}
                            </AppTextMedium>
                        </View>
                    </View>
                </View>

                <View style={styles.datePickerContainer}>
                    <DatePicker mode={mode} value={date} inititalValue={date} onDateChange={setDate} />
                </View>

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
                            onOk
                                ? onOk(() => {
                                      modalRef.current.close();
                                  })
                                : modalRef.current.close();
                        }}
                    >
                        <Text style={styles.textButtonFooterModal}> OK </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ModalPortal>
    );
});

export const ModalDatePicker = React.memo(_ModalDatePicker, (prev, next) => prev.mode == next.mode);

const styles = StyleSheet.create({
    modalStyle: {
        width: 23 * rem,
        minWidth: "60%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContainer: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 8 * unit,
        borderRadius: 12 * unit,
    },

    headerModal: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18 * unit,
        paddingTop: 2 * rem,
        paddingBottom: rem,
    },

    leftTitleHeader: {
        fontSize: 18 * unit,
        color: Color.gray_10,
    },

    rightTitleContainerHeader: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },

    rightTitleHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 6 * unit,
        paddingHorizontal: 12 * unit,
        marginLeft: 6 * unit,
        backgroundColor: Color.gray_0,
        borderRadius: 6 * unit,
        borderWidth: 1,
        borderColor: Color.gray_3,
    },

    rightTitleText: {
        fontSize: 15 * unit,
        color: Color.gray_8,
        paddingHorizontal: 12 * unit,
    },

    datePickerContainer: {
        paddingBottom: 24 * unit,
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
});

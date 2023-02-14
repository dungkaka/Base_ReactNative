import { AppTextMedium } from "@lib/AppText";
import WheelPicker from "@lib/Wheel/WheelPicker";
import { useOnlyDidUpdateEffect } from "@hooks/useOnlyDidUpdateEffect";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import { time } from "@utils/helps/time";
import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { days as DAYS, hours as HOURS, minutes as MINUTES, MODE, months as MONTHS, years as YEARS } from "./utils";

const ITEM_HEIGHT = 34;

const MemoWheelPicker = React.memo(WheelPicker, () => true);

const DatePicker = ({
    days = DAYS,
    months = MONTHS,
    years = YEARS,
    hours = HOURS,
    minutes = MINUTES,
    mode = "day",
    value = {},
    inititalValue = time().toDateObject(),
    onDateChange = () => {},
}) => {
    const valueRef = useRef({ ...inititalValue });

    const dayWheelRef = useRef();
    const monthWheelRef = useRef();
    const yearWheelRef = useRef();
    const hourWheelRef = useRef();
    const minuteWheelRef = useRef();

    useOnlyDidUpdateEffect(() => {
        if (valueRef.current == value) return;

        const preValueRef = valueRef.current;
        valueRef.current = value;

        if (MODE[mode] <= MODE.day) {
            const dayIndex = days.findIndex((d) => d.value == value.day);
            if (dayIndex != -1) {
                dayWheelRef.current.scrollToIndex({ animated: false, index: dayIndex == 0 ? 0.01 : dayIndex });
            } else {
                valueRef.current.day = preValueRef.day;
            }
        }

        if (MODE[mode] <= MODE.month) {
            const monthIndex = months.findIndex((m) => m.value == value.month);
            if (monthIndex != -1) {
                monthWheelRef.current.scrollToIndex({
                    animated: false,
                    index: monthIndex == 0 ? 0.01 : monthIndex,
                });
            } else {
                valueRef.current.month = preValueRef.month;
            }
        }

        const yearIndex = years.findIndex((y) => y.value == value.year);
        if (yearIndex != -1) {
            yearWheelRef.current.scrollToIndex({ animated: false, index: yearIndex == 0 ? 0.01 : yearIndex });
        } else {
            valueRef.current.year = preValueRef.year;
        }

        if (MODE[mode] <= MODE.hour) {
            const hourIndex = hours.findIndex((h) => h.value == value.hour);
            if (hourIndex != -1) {
                hourWheelRef.current.scrollToIndex({
                    animated: false,
                    index: hourIndex == 0 ? 0.01 : hourIndex,
                });
            } else {
                valueRef.current.hour = preValueRef.hour;
            }
        }

        if (MODE[mode] <= MODE.minute) {
            const minuteIndex = minutes.findIndex((m) => m.value == value.minute);
            if (minuteIndex != -1) {
                minuteWheelRef.current.scrollToIndex({
                    animated: false,
                    index: minuteIndex == 0 ? 0.01 : minuteIndex,
                });
            } else {
                valueRef.current.minute = preValueRef.minute;
            }
        }
    }, [value]);

    return (
        <View style={styles.pickerContainer}>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.lineViewContainer}>
                    <View style={styles.lineView} />
                </View>
                {MODE[mode] <= MODE.day && (
                    <View style={styles.dayContainter}>
                        <AppTextMedium style={styles.pickerTitle}>Ngày</AppTextMedium>
                        <MemoWheelPicker
                            wheelRef={dayWheelRef}
                            windowSize={3}
                            initialNumToRender={3}
                            decelerationRate={0.9}
                            itemHeight={ITEM_HEIGHT}
                            data={days}
                            initialIndex={days.findIndex((d) => d.value == valueRef.current.day)}
                            renderChild={({ item, index }) => <Text style={styles.label}>{item.label}</Text>}
                            onValueChange={(index) => {
                                valueRef.current = { ...valueRef.current, day: days[index].value };
                                onDateChange(valueRef.current);
                            }}
                        />
                    </View>
                )}

                {MODE[mode] <= MODE.month && (
                    <View style={styles.monthContainter}>
                        <AppTextMedium style={styles.pickerTitle}>Tháng</AppTextMedium>
                        <MemoWheelPicker
                            wheelRef={monthWheelRef}
                            windowSize={3}
                            initialNumToRender={3}
                            decelerationRate={0.9}
                            itemHeight={ITEM_HEIGHT}
                            data={months}
                            initialIndex={months.findIndex((m) => m.value == valueRef.current.month)}
                            renderChild={({ item, index }) => <Text style={styles.label}>{item.label}</Text>}
                            onValueChange={(index) => {
                                valueRef.current = { ...valueRef.current, month: months[index].value };
                                onDateChange(valueRef.current);
                            }}
                        />
                    </View>
                )}

                <View style={styles.yearContainter}>
                    <AppTextMedium style={styles.pickerTitle}>Năm</AppTextMedium>
                    <MemoWheelPicker
                        wheelRef={yearWheelRef}
                        windowSize={3}
                        initialNumToRender={3}
                        decelerationRate={0.9}
                        itemHeight={ITEM_HEIGHT}
                        data={years}
                        initialIndex={years.findIndex((y) => y.value == valueRef.current.year)}
                        renderChild={({ item, index }) => <Text style={styles.label}>{item.label}</Text>}
                        onValueChange={(index) => {
                            valueRef.current = { ...valueRef.current, year: years[index].value };
                            onDateChange(valueRef.current);
                        }}
                    />
                </View>

                {MODE[mode] <= MODE.hour && (
                    <View style={styles.hourContainer}>
                        <AppTextMedium style={styles.pickerTitle}>Giờ</AppTextMedium>
                        <MemoWheelPicker
                            wheelRef={hourWheelRef}
                            windowSize={3}
                            initialNumToRender={3}
                            decelerationRate={0.9}
                            itemHeight={ITEM_HEIGHT}
                            data={hours}
                            initialIndex={hours.findIndex((h) => h.value == valueRef.current.hour)}
                            renderChild={({ item, index }) => <Text style={styles.label}>{item.label}</Text>}
                            onValueChange={(index) => {
                                valueRef.current = { ...valueRef.current, hour: hours[index].value };
                                onDateChange(valueRef.current);
                            }}
                        />
                    </View>
                )}

                {MODE[mode] <= MODE.minute && (
                    <View style={styles.minuteContainer}>
                        <AppTextMedium style={styles.pickerTitle}>Phút</AppTextMedium>
                        <MemoWheelPicker
                            wheelRef={minuteWheelRef}
                            windowSize={3}
                            initialNumToRender={3}
                            decelerationRate={0.9}
                            itemHeight={ITEM_HEIGHT}
                            data={minutes}
                            initialIndex={minutes.findIndex((m) => m.value == valueRef.current.minute)}
                            renderChild={({ item, index }) => <Text style={styles.label}>{item.label}</Text>}
                            onValueChange={(index) => {
                                valueRef.current = { ...valueRef.current, minute: minutes[index].value };
                                onDateChange(valueRef.current);
                            }}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

export default DatePicker;

const styles = StyleSheet.create({
    pickerContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    pickerTitle: {
        color: Color.gray_10,
        fontSize: 17 * unit,
        lineHeight: 48 * unit,
    },
    label: {
        fontSize: 20 * unit,
        color: Color.gray_10,
        textAlign: "center",
        textAlignVertical: "center",
    },
    lineViewContainer: {
        position: "absolute",
        top: 48 * unit + ITEM_HEIGHT * 2,
        right: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    lineView: {
        width: "88%",
        height: ITEM_HEIGHT + 2,
        backgroundColor: "transparent",
        borderTopWidth: 1,
        borderTopColor: Color.gray_4,
        borderBottomWidth: 1,
        borderBottomColor: Color.gray_4,
    },
    dayContainter: {
        flex: 3,
        alignItems: "center",
    },
    monthContainter: {
        flex: 3,
        alignItems: "center",
    },
    yearContainter: {
        flex: 3,
        alignItems: "center",
    },
    hourContainer: {
        flex: 3,
        alignItems: "center",
    },
    minuteContainer: {
        flex: 3,
        alignItems: "center",
    },
});

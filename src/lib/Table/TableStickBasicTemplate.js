import { AppText, AppTextMedium } from "@lib/AppText";
import TableStickColumn from "@lib/Table/TableStickColumn";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { emptyObject } from "@utils/helps/functions";
import React, { Fragment, useState } from "react";
import { StyleSheet, View } from "react-native";

const _data = new Array(20).fill(0).map((item, index) => ({
    column1: index + 1,
    column2: "A Column",
    column3: "Something",
    column4: "Test",
    column5: "Last",
}));

const _options = [
    { key: "column1", title: "Col 1", width: 5 * rem },
    { key: "column2", title: "Col 2", width: 8 * rem },
    { key: "column3", title: "Col 3", width: 10 * rem },
    { key: "column4", title: "Col 4", width: 8 * rem },
    { key: "column5", title: "Col 5", width: 10 * rem },
];

const _left = [0];

const TableStickBasicTemplate = ({
    data = _data,
    marks = emptyObject,
    keyItem = "key",
    options = _options,
    left = _left,
    heightHeader = 60,
    heightRow = 56,
    stickPosition = 5 * rem,
    cellStyle,
    cellHeaderStyle = { borderRightWidth: 0 },
    rowStyle = styles.row,
    containerStyle,
    leftContainerStyle = styles.sideContainer,
    rightContainerStyle = styles.sideContainer,
    headerContainerStyle = styles.headerContainer,
    textHeaderStyle,
    numberLinesContentCell = 3,
    showPagination = false,
    paginationInfo = { total: 0, page: 0, pageSize: 20, currentPageSize: 0, onChangePage: (page) => {} },
    paginationContainerStyle,
}) => {
    const right = options.map((_, i) => i).filter((_, i) => !left.includes(i));

    const tableStyles = StyleSheet.create(
        options.map((option, index) => ({
            ...styles.cell,
            ...cellStyle,
            width: option.width,
        }))
    );

    const renderLeftHeader = () => (
        <View style={headerContainerStyle}>
            {left.map((i) => {
                if (options[i].renderHeader) {
                    return (
                        <Fragment key={i}>
                            {options[i].renderHeader({ cellHeaderStyle: [tableStyles[i], cellHeaderStyle] })}
                        </Fragment>
                    );
                }
                return (
                    <View key={i} style={[tableStyles[i], cellHeaderStyle]}>
                        <AppTextMedium style={[styles.textHeader, textHeaderStyle]}>{options[i].title}</AppTextMedium>
                    </View>
                );
            })}
        </View>
    );

    const renderRightHeader = () => (
        <View style={headerContainerStyle}>
            {right.map((i) => {
                if (options[i].renderHeader) {
                    return (
                        <Fragment key={i}>
                            {options[i].renderHeader({ cellHeaderStyle: [tableStyles[i], cellHeaderStyle] })}
                        </Fragment>
                    );
                }
                return (
                    <View key={i} style={[tableStyles[i], cellHeaderStyle]}>
                        <AppTextMedium style={[styles.textHeader, textHeaderStyle]}>{options[i].title}</AppTextMedium>
                    </View>
                );
            })}
        </View>
    );

    const renderLeftRow = ({ item = {}, index, isMark }) => {
        return (
            <View style={rowStyle}>
                {left.map((i) => {
                    if (options[i].render)
                        return (
                            <Fragment key={i}>{options[i].render({ item, index, isMark, cellStyle: tableStyles[i] })}</Fragment>
                        );
                    return (
                        <View key={i} style={tableStyles[i]}>
                            <AppText numberOfLines={numberLinesContentCell} style={styles.textCell}>
                                {item[options[i].key]}
                            </AppText>
                        </View>
                    );
                })}
            </View>
        );
    };

    const renderRightRow = ({ item = {}, index, isMark }) => (
        <View style={rowStyle}>
            {right.map((i) => {
                if (options[i].render)
                    return <Fragment key={i}>{options[i].render({ item, index, isMark, cellStyle: tableStyles[i] })}</Fragment>;
                return (
                    <View key={i} style={tableStyles[i]}>
                        <AppText numberOfLines={numberLinesContentCell} style={styles.textCell}>
                            {item[options[i].key]}
                        </AppText>
                    </View>
                );
            })}
        </View>
    );

    return (
        <Fragment>
            <TableStickColumn
                data={data}
                marks={marks}
                renderLeftHeader={renderLeftHeader}
                renderRightHeader={renderRightHeader}
                renderRightRow={renderRightRow}
                renderLeftRow={renderLeftRow}
                heightHeader={heightHeader}
                heightRow={heightRow}
                stickPosition={stickPosition}
                leftWidth={left.reduce((sum, i) => sum + options[i].width, 0)}
                leftContainerStyle={leftContainerStyle}
                rightContainerStyle={rightContainerStyle}
                containerStyle={containerStyle}
                keyItem={keyItem}
                showPagination={showPagination}
                paginationInfo={paginationInfo}
                paginationContainerStyle={paginationContainerStyle}
            />
        </Fragment>
    );
};

export default React.memo(
    TableStickBasicTemplate,
    (prev, next) => prev.data == next.data && prev.options == next.options && prev.marks == next.marks
);

const styles = StyleSheet.create({
    padding: {
        padding: 12,
    },
    headerContainer: { flex: 1, flexDirection: "row", backgroundColor: Color.blueModern_2 },
    textHeader: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: "white",
    },
    textCell: {
        fontSize: 13 * unit,
        textAlign: "center",
        color: Color.gray_11,
    },
    cellHeader: {
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    cell: {
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Color.gray_2,
        // overflow: "hidden",
    },
    row: {
        flex: 1,
        flexDirection: "row",
        // overflow: "hidden",
    },
    sideContainer: {
        backgroundColor: "white",
    },
});

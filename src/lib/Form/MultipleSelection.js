import { AppText } from "@lib/AppText";
import Select from "@lib/Form/Select";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useOnlyDidUpdateEffect } from "@utils/hooks/useOnlyDidUpdateEffect";
import MultipleSelect from "./MultipleSelect";

function MultipleSelection({
    data,
    required = true,
    disabled = false,
    initialOptions = [],
    initialOptionsOnChangeData = [],
    emptyOption = "Chọn",
    title = "Selection",
    containerStyle = styles.displaySelectValueContainer,
    renderValueComponent,
    onChange = (select) => {},
    ...otherProps
}) {
    const selectRef = useRef();
    const [selects, setSelects] = useState(initialOptions);

    useOnlyDidUpdateEffect(() => {
        onChange(selects);
    }, [selects]);

    useOnlyDidUpdateEffect(() => {
        setSelects(initialOptionsOnChangeData);
    }, [data]);

    return (
        <Fragment>
            <Pressable
                disabled={disabled}
                onPress={() => {
                    selectRef.current.open(selects);
                }}
                style={containerStyle}
            >
                {renderValueComponent
                    ? renderValueComponent(selects)
                    : selects.map((select) => (
                          <AppText key={select.key} style={styles.textSelectDisplay}>
                              {select ? select.value : emptyOption} ,{" "}
                          </AppText>
                      ))}
            </Pressable>

            <MultipleSelect
                required={required}
                initialOptions={initialOptions}
                itemHeight={48}
                options={data}
                ref={selectRef}
                onOk={() => {
                    selectRef.current.close();
                    setSelects(selectRef.current.getSelection());
                }}
                title={title}
                {...otherProps}
            />
        </Fragment>
    );
}

export default MultipleSelection;

const styles = StyleSheet.create({
    displaySelectValueContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 6 * unit,
        paddingHorizontal: 12 * unit,
        backgroundColor: Color.gray_0,
        borderRadius: 6 * unit,
        borderWidth: 1,
        borderColor: Color.gray_3,
    },
    textSelectDisplay: {
        fontSize: 15 * unit,
        color: Color.gray_8,
        paddingHorizontal: 6 * unit,
    },
});

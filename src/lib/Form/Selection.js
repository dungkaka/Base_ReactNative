import { AppText } from "@lib/AppText";
import Select from "@lib/Form/Select";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import { useOnlyDidUpdateEffect } from "@utils/hooks/useOnlyDidUpdateEffect";
import React, { Fragment, useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

function Selection({
    data,
    required = true,
    disabled = false,
    initialOption = undefined,
    initialOptionOnChangeData = undefined,
    emptyOption = "Chọn",
    title = "Selection",
    containerStyle = styles.displaySelectValueContainer,
    renderValueComponent,
    onChange = (select) => {},
    listenParentValue = false,
    value = undefined,
    ...otherProps
}) {
    const selectRef = useRef();
    const changeFromInside = useRef(false);
    const [select, setSelect] = useState(listenParentValue ? value : initialOption);

    // For only use parent value
    useOnlyDidUpdateEffect(() => {
        changeFromInside.current = false;
        if (listenParentValue && select?.key != value?.key) {
            setSelect(value);
        }
    }, [value?.key]);

    useOnlyDidUpdateEffect(() => {
        if (changeFromInside.current) onChange(select);
    }, [select?.key]);

    useOnlyDidUpdateEffect(() => {
        if (!listenParentValue) {
            changeFromInside.current = true;
            setSelect(initialOptionOnChangeData);
        }
    }, [data]);

    return (
        <Fragment>
            <Pressable
                disabled={disabled}
                onPress={() => {
                    selectRef.current.open(select?.key);
                }}
                style={containerStyle}
            >
                {renderValueComponent ? (
                    renderValueComponent(select)
                ) : (
                    <AppText style={styles.textSelectDisplay}>{select ? select.value : emptyOption}</AppText>
                )}
            </Pressable>

            <Select
                required={required}
                initialOption={initialOption}
                options={data}
                initialOptionOnChangeOptions={initialOptionOnChangeData}
                itemHeight={48}
                ref={selectRef}
                onOk={() => {
                    selectRef.current.close();
                    const select = selectRef.current.getSelection();
                    changeFromInside.current = true;
                    setSelect(select);
                }}
                title={title}
                {...otherProps}
            />
        </Fragment>
    );
}

export default Selection;

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

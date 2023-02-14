import React, { useRef } from "react";
import { Pressable } from "react-native";
import ModalAlert from "./ModalAlert";

const ButtonModalAlert = ({ title, content, onOk, onCancel, style, children, disabled = false }) => {
    const modalAlertRef = useRef();

    return (
        <Pressable style={style} disabled={disabled} onPress={() => modalAlertRef.current.open()}>
            {children}
            <ModalAlert modalAlertRef={modalAlertRef} title={title} content={content} onOk={onOk} onCancel={onCancel} />
        </Pressable>
    );
};

export default React.memo(ButtonModalAlert);

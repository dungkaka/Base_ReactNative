import ModalAlert from "@lib/Modal/ModalAlert";
import React, { useCallback, useRef, useState } from "react";

const ConfirmAlert = () => {
    const modalRef = useRef();
    const [info, setInfo] = useState({});

    const onBackHandler = useCallback(() => {
        modalRef.current.close();
    });

    const confirmAlert = (info) => {
        setInfo(info);
        modalRef.current.open();
    };

    ConfirmAlertManager.confirmAlert = confirmAlert;

    return <ModalAlert modalAlertRef={modalRef} {...info} onBackHandler={onBackHandler} />;
};

const ConfirmAlertManager = {};

export const confirmAlert = ({ title, content, textOK, textCancel, onOk, onCancel } = {}) => {
    ConfirmAlertManager.confirmAlert &&
        ConfirmAlertManager.confirmAlert({ title, content, textOK, textCancel, onOk, onCancel });
};

export default ConfirmAlert;

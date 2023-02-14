import { AppText, TEXT_TYPE } from "@lib/Typography/AppText";
import { Color } from "@theme/colors";
import { HEIGHT } from "@theme/scale";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ModalPortal from "./ModalPortal";

const LoadingIcon = ({ isIconAnimating, color }) => (
    <ActivityIndicator size={20 * unit} color={color} animating={isIconAnimating} />
);

const ModalAlert = ({
    modalAlertRef = useRef(),
    title = "Alert",
    content = "Alert Content",
    renderContent,
    textOK = "ok",
    textCancel = "cancel",
    onOk,
    onCancel,
    onBackHandler,
    onPressBackdrop,
}) => {
    const mount = useRef(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => {
            mount.current = false;
        };
    }, []);

    const otherProps = () => {
        const otherProps = {};
        if (onBackHandler) otherProps.onBackHandler = onBackHandler;
        if (onPressBackdrop) otherProps.onPressBackdrop = onPressBackdrop;

        return otherProps;
    };

    return (
        <ModalPortal ref={modalAlertRef} modalStyle={styles.modalStyle} {...otherProps()}>
            <View style={styles.modalContainer}>
                {/* Title */}
                <View>
                    <AppText text={title} style={styles.titleModal}>
                        {title}
                    </AppText>
                </View>

                {/* Content */}
                <View style={{ minHeight: 6 * rem, maxHeight: HEIGHT * 0.8 }}>
                    {renderContent ? (
                        renderContent()
                    ) : (
                        <AppText text={content} style={styles.content}>
                            {content}
                        </AppText>
                    )}
                </View>
                {/* Footer */}
                <View style={styles.footerModal}>
                    {/* Cancel */}
                    <TouchableOpacity
                        style={styles.buttonFooterModal}
                        onPress={() =>
                            onCancel
                                ? onCancel(() => {
                                      if (mount.current) setLoading(false);
                                  })
                                : modalAlertRef.current.close()
                        }
                    >
                        <AppText text={textCancel} type={TEXT_TYPE.BOLD} style={styles.textButtonFooterModal}>
                            {textCancel}
                        </AppText>
                    </TouchableOpacity>
                    {/* OK */}

                    <TouchableOpacity
                        style={styles.buttonFooterModal}
                        onPress={() => {
                            onOk
                                ? onOk(
                                      () => {
                                          if (mount.current) setLoading(true);
                                      },
                                      () => {
                                          if (mount.current) setLoading(false);
                                      },
                                      () => {
                                          if (mount.current) modalAlertRef.current.close();
                                      }
                                  )
                                : modalAlertRef.current.close();
                        }}
                    >
                        <AppText text={textOK} type={TEXT_TYPE.BOLD} style={styles.textButtonFooterModal}>
                            {textOK}
                        </AppText>
                        <LoadingIcon isIconAnimating={loading} color={Color.gray_10} />
                    </TouchableOpacity>
                </View>
            </View>
        </ModalPortal>
    );
};

export default React.memo(ModalAlert);

const styles = StyleSheet.create({
    modalStyle: {
        width: "78%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "white",
        padding: 16 * unit,
        borderRadius: 12 * unit,
    },
    titleModal: {
        fontSize: 20 * unit,
        padding: 6 * unit,
        fontFamily: GoogleSansFontType.bold,
        color: Color.gray_9,
    },
    content: {
        color: Color.gray_10,
        paddingHorizontal: 6 * unit,
        paddingTop: 4 * unit,
        paddingBottom: 26 * unit,
    },
    footerModal: {
        flexDirection: "row",
        marginHorizontal: 6 * unit,
        paddingTop: 12 * unit,
        borderTopWidth: 1,
        borderTopColor: Color.gray_2,
    },
    buttonFooterModal: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    textButtonFooterModal: {
        fontSize: 16 * unit,
        paddingHorizontal: 4 * unit,
        color: Color.gray_10,
    },
});

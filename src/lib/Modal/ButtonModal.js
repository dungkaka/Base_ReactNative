import { AppText, AppTextBold, AppTextMedium } from "@lib/AppText";
import { LoadingIcon } from "@lib/Loading/DefaultIconLoading";
import { Color } from "@theme/colors";
import { rem, unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import ModalPortal from "./ModalPortal";

const ButtonModal = ({
    title = "Modal",
    content,
    onOk,
    onCancel,
    style,
    children,
    renderContentModal = () => null,
    disabled = false,
    lazyLoad,
    unmountOnHide,
}) => {
    const modalRef = useRef();
    const mount = useRef(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => {
            mount.current = false;
        };
    }, []);

    return (
        <Pressable style={style} disabled={disabled} onPress={() => modalRef.current.open()}>
            {children}
            <ModalPortal lazyLoad={lazyLoad} unmountOnHide={unmountOnHide} ref={modalRef} modalStyle={styles.modalStyle}>
                <View style={styles.modalContainer}>
                    {/* Title */}
                    <View style={styles.headerModal}>
                        <AppTextBold style={styles.titleModal}>{title}</AppTextBold>
                    </View>

                    {/* Content */}
                    <ScrollView style={styles.content}>{renderContentModal()}</ScrollView>
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
                                    : modalRef.current.close()
                            }
                        >
                            <AppText style={styles.textButtonFooterModal}> Đóng </AppText>
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
                                              if (mount.current) modalCustomRef.current.close();
                                          }
                                      )
                                    : modalRef.current.close();
                            }}
                        >
                            <Text style={styles.textButtonFooterModal}> OK </Text>
                            <LoadingIcon isIconAnimating={loading} color={Color.gray_10} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ModalPortal>
        </Pressable>
    );
};

export default React.memo(ButtonModal);

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
    titleModal: {
        fontSize: 18 * unit,
        fontFamily: GoogleSansFontType.bold,
        color: Color.gray_10,
    },
    content: {
        paddingVertical: rem,
        paddingHorizontal: 24 * unit,
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

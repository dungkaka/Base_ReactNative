import { AppText } from "@lib/AppText";
import BottomSheet from "@lib/Modal/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "@theme/colors";
import { HEIGHT } from "@theme/scale";
import { unit } from "@theme/styleContants";
import * as ImagePicker from "expo-image-picker";
import React, { Fragment, useEffect, useRef } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

const ImagePickerOneV2 = ({
    style,
    onChangeImage,
    type = "all",
    children,
    base64 = false,
    quality = 1,
    allowsEditing = false,
}) => {
    const bottomSheetChooseMethodPickerRef = useRef();

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert("Rất tiếc, bạn không có quyền truy cập vào ảnh trên thiết bị này !");
                }
            }
        })();
    }, []);

    const pickImage = () => {
        switch (type) {
            case "library":
                return pickImageFromLib();
            case "camera":
                return pickImageFromCamera();
            case "all":
                return chooseMethodPicker();
            default:
                return chooseMethodPicker();
        }
    };

    const chooseMethodPicker = () => {
        bottomSheetChooseMethodPickerRef.current?.open?.();
    };

    const pickImageFromCamera = async () => {
        const res = await ImagePicker.requestCameraPermissionsAsync();
        if (res.status !== "granted") {
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: allowsEditing,
            quality: quality,
            base64: base64,
        });

        if (!result.cancelled) {
            const uri = result.uri;
            const name = uri.substring(uri.lastIndexOf("/") + 1);
            const base64Obj = base64
                ? {
                      base64: result.base64,
                  }
                : {};
            onChangeImage({
                uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
                name: name,
                type: "image/" + name.substring(name.lastIndexOf(".") + 1),
                ...base64Obj,
            });
        }
    };

    const pickImageFromLib = async () => {
        const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (res?.status !== "granted") {
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: allowsEditing,
            quality: quality,
            base64: base64,
        });

        if (!result.cancelled) {
            const uri = result.uri;
            const name = uri.substring(uri.lastIndexOf("/") + 1);
            const base64Obj = base64
                ? {
                      base64: result.base64,
                  }
                : {};
            onChangeImage({
                uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
                name: name,
                type: "image/" + name.substring(name.lastIndexOf(".") + 1),
                ...base64Obj,
            });
        }
    };

    return (
        <Fragment>
            <Pressable style={style} onPress={pickImage}>
                {children}
            </Pressable>
            {type == "all" && (
                <BottomSheet ref={bottomSheetChooseMethodPickerRef} bottomSheetStyle={styles.modalContainer}>
                    <View style={styles.modal}>
                        <View style={styles.contentContainer}>
                            <Pressable
                                onPress={() => {
                                    pickImageFromLib();
                                    bottomSheetChooseMethodPickerRef.current.close();
                                }}
                                style={styles.itemContainer}
                            >
                                <Ionicons name="ios-image-outline" size={38} color={Color.gray_8} />
                                <AppText>Thư viện</AppText>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    pickImageFromCamera();
                                    bottomSheetChooseMethodPickerRef.current.close();
                                }}
                                style={styles.itemContainer}
                            >
                                <Ionicons name="camera-outline" size={38} color={Color.gray_8} />
                                <AppText>Máy ảnh</AppText>
                            </Pressable>
                        </View>
                    </View>
                </BottomSheet>
            )}
        </Fragment>
    );
};

export default ImagePickerOneV2;

const styles = StyleSheet.create({
    modalContainer: {
        bottom: -HEIGHT * 0.1,
    },
    modal: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 12 * unit,
        paddingBottom: HEIGHT * 0.1,
    },
    contentContainer: {
        flexDirection: "row",
        padding: 30 * unit,
    },
    itemContainer: {
        paddingRight: 30 * unit,
        justifyContent: "center",
        alignItems: "center",
    },
});

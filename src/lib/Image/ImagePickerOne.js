import { useOnlyDidUpdateEffect } from "@hooks/useOnlyDidUpdateEffect";
import * as ImagePicker from "expo-image-picker";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Platform, Pressable } from "react-native";

const ImagePickerOne = forwardRef(
    ({ initialValue, style, onChangeImage, type = "library", renderItem = (image) => null }, ref) => {
        const [image, setImage] = useState(initialValue);

        useImperativeHandle(ref, () => ({
            setImage: setImage,
        }));

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

        useOnlyDidUpdateEffect(() => {
            onChangeImage(image);
        }, [image]);

        const pickImage = () => {
            switch (type) {
                case "library":
                    return pickImageFromLib();
                case "camera":
                    return pickImageFromCamera();
                default:
                    return pickImageFromLib();
            }
        };

        const pickImageFromCamera = async () => {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                // allowsEditing: true,
                quality: 1,
            });

            if (!result.cancelled) {
                const uri = result.uri;
                const name = uri.substring(uri.lastIndexOf("/") + 1);
                setImage({
                    uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
                    name: name,
                    type: "image/" + name.substring(uri.lastIndexOf(".") + 1),
                });
            }
        };

        const pickImageFromLib = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                // allowsEditing: true,
                quality: 1,
            });

            if (!result.cancelled) {
                const uri = result.uri;
                const name = uri.substring(uri.lastIndexOf("/") + 1);
                setImage({
                    uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
                    name: name,
                    type: "image/" + name.substring(name.lastIndexOf(".") + 1),
                });
            }
        };

        return (
            <Pressable style={style} onPress={pickImage}>
                {renderItem(image)}
            </Pressable>
        );
    }
);

export default ImagePickerOne;

import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, ActivityIndicator, TouchableOpacity } from "react-native";
import { Color } from "../theme/colors";
import { FontSize } from "../theme/fontSize";
import { Space } from "../theme/spacing";
import { AppText } from "./AppText";

const LoadingIcon = ({ isIconAnimating }) => (
    <ActivityIndicator size="large" color={Color.blueModern_2} style={{ marginVertical: 5 }} animating={isIconAnimating} />
);

const ReloadPage = ({ onReload = () => {}, error, message = "Reload" }) => {
    const isUnmount = useRef(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => {
            isUnmount.current = true;
        };
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: Space._50,
            }}
        >
            <AppText
                style={{
                    flexWrap: "wrap",
                    fontSize: FontSize._16,
                    textAlign: "center",
                    color: Color.gray_8,
                    textDecorationStyle: "dotted",
                }}
            >
                {message.startsWith("Mô tả lỗi:")
                    ? message
                    : "Có lỗi xảy ra mất rùi, bạn tải lại trang để làm mới dữ liệu nha !"}
            </AppText>

            <View style={{ marginTop: Space._20 }}>
                {loading ? (
                    <LoadingIcon isIconAnimating={loading}></LoadingIcon>
                ) : (
                    <TouchableOpacity
                        style={{
                            paddingVertical: Space._10,
                            paddingHorizontal: Space._20,
                            backgroundColor: Color.blueModern_2,
                            borderRadius: 10,
                        }}
                        onPress={() => {
                            onReload(
                                () => setLoading(true),
                                () => {
                                    if (!isUnmount.current) setLoading(false);
                                },
                                () => {
                                    if (!isUnmount.current) setLoading(false);
                                }
                            );
                        }}
                    >
                        <AppText style={{ color: "white", fontSize: FontSize._16 }}>Tải lại</AppText>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default ReloadPage;

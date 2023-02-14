import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ModalPortal from "@lib/Modal/ModalPortal";
import Portal from "@lib/Portal";
import { Color } from "theme/colors";
import { HEIGHT, WIDTH } from "theme/scale";
import { useRef } from "react";
import Popup, { POPUP_DIRECTION, POPUP_ORIGIN_PLACE } from "@lib/Modal/Popup";
import { useState } from "react";
import BottomSheet from "@lib/Modal/BottomSheet";

export default function App() {
    const modalRef = useRef();
    const boxRef = useRef();
    const bottomSheetRef = useRef();

    return (
        <Portal.Host>
            <View style={styles.container}>
                <Pressable
                    onPress={() => {
                        modalRef.current.open({
                            controlElementRef: boxRef,
                            originPlace: POPUP_ORIGIN_PLACE.BOTTOM_LEFT,
                            direction: POPUP_DIRECTION.RIGHT_DOWN,
                            relativeXY: [0, 20],
                            // vectorTransform: [100, 100],

                            // fromXY: [WIDTH - 60, 120],
                            // toXY: [WIDTH / 2, HEIGHT / 2],
                            initialScale: 0.2,
                            borderAnimatedInterpolate: [200, [1, 1, 1, 1]],
                        });
                    }}
                    style={{
                        position: "absolute",
                        top: 80,
                        left: 30,
                        padding: 12,
                        backgroundColor: Color.blueModern_1,
                        borderRadius: 12,
                        zIndex: 1,
                    }}
                >
                    <Text style={{ color: "#ffffff" }}>CONTROL</Text>
                </Pressable>
                <ScrollView style={{ width: WIDTH }} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ height: 800 }}></View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <View
                            ref={boxRef}
                            style={{
                                width: 100,
                                height: 100,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: Color.blueModern_1,
                                borderRadius: 12,
                            }}
                        ></View>
                    </View>

                    <View style={{ height: 1000 }}></View>
                </ScrollView>
            </View>
            <Popup
                backDropColor="rgba(0,0,0,0.5)"
                style={{ borderRadius: 200 }}
                animationTimeIn={600}
                animationTimeout={300}
                ref={modalRef}
            >
                <View style={{ height: 260, width: 200, borderRadius: 24, backgroundColor: "#ffffff" }}></View>
            </Popup>
            <BottomSheet ref={bottomSheetRef}>
                <View style={{ height: 450, width: WIDTH, borderRadius: 24, backgroundColor: "#ffffff" }}></View>
            </BottomSheet>
        </Portal.Host>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

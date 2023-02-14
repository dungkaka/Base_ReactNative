import { Color } from "@theme/colors";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import WebView from "react-native-webview";
import { getJavascriptSource } from "./utils";
let minifiedEChartsFramework;
let html = null;

const ID = () => `_${Math.random().toString(36).substr(2, 9)}`;

const EchartsWebView = forwardRef(
    ({ onLoadEnd = () => {}, onData = () => {}, customTemplate, additionalCode, option, delayRender = 100 }, ref) => {
        const [source, setSource] = useState(null);
        const webviewRef = useRef();

        useImperativeHandle(ref, () => ({
            getOption: getOption,
            setOption: setOption,
            clear: clear,
        }));

        useEffect(() => {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    if (!minifiedEChartsFramework) {
                        minifiedEChartsFramework = require("./echartsJS").default;
                        html = `<!DOCTYPE html>
                                        <html>
                                            <head>
                                                <meta http-equiv="content-type" content="text/html; charset=utf-8">
                                                <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
                                                <style>
                                                    html,body {
                                                        height: 100%;
                                                        width: 100%;
                                                        margin: 0;
                                                        padding: 0;
                                                        background-color: rgba(0, 0, 0, 0);
                                                    }
                                                    #main {
                                                        height: 100%;
                                                        width: 100%;
                                                        background-color: rgba(0, 0, 0, 0);
                                                    }
                                                </style>
                                                
                                                <script>
                                                    ${minifiedEChartsFramework}
                                                </script>
                                            </head>
                                    
                                            <body>
                                                <div id="main" />
                                            </body>
                                        </html>`;
                    }
                    setSource({
                        html: html,
                    });
                });
            }, delayRender);
        }, []);

        const callbacks = useRef({}).current;

        const onMessage = (e) => {
            try {
                if (!e) return null;
                const data = JSON.parse(e.nativeEvent.data);
                switch (data.type) {
                    case "DATA":
                        onData(data.payload);
                        break;
                    case "CALLBACK":
                        const { uuid } = data;
                        callbacks[uuid](data.payload);
                        break;
                    default:
                        break;
                }
            } catch (error) {}
        };

        const postMessage = (data) => {
            webviewRef.current.postMessage(JSON.stringify(data));
        };

        const getOption = (callback, properties = undefined) => {
            const uuid = ID();
            callbacks[uuid] = callback;
            const data = {
                type: "GET_OPTION",
                uuid,
                properties,
            };
            postMessage(data);
        };

        const setOption = (option, notMerge, lazyUpdate) => {
            const data = {
                type: "SET_OPTION",
                payload: {
                    option,
                    notMerge: notMerge || false,
                    lazyUpdate: lazyUpdate || false,
                },
            };
            postMessage(data);
        };

        const clear = () => {
            const data = {
                type: "CLEAR",
            };
            postMessage(data);
        };

        const _onLoadEnd = () => {
            if (webviewRef.current) {
                webviewRef.current.injectJavaScript(getJavascriptSource({ option, additionalCode }));
            }
            onLoadEnd();
        };

        return (
            <TouchableWithoutFeedback style={styles.container}>
                {source ? (
                    <WebView
                        ref={webviewRef}
                        cacheEnabled={true}
                        style={{ backgroundColor: "transparent" }}
                        directionalLockEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        scalesPageToFit={false}
                        source={source}
                        onMessage={onMessage}
                        allowFileAccess
                        allowUniversalAccessFromFileURLs
                        onLoadEnd={_onLoadEnd}
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size={42} color={Color.gray_6} animating={true} />
                    </View>
                )}
            </TouchableWithoutFeedback>
        );
    }
);

export default React.memo(EchartsWebView);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

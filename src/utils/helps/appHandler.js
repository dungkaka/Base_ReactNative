import { LogBox, Platform, UIManager } from "react-native";

export const handleKillApp = () => {
    const defaultErrorHandler = (ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()) || ErrorUtils._globalHandler;
    let handledError = false;

    const globalErrorHandler = async (err, isFatal) => {
        if (!handledError) {
            handledError = true;
            try {
                console.log("KILL_APP", isFatal + err.message);
            } catch (e) {}
        }
        return defaultErrorHandler(err, isFatal);
    };

    ErrorUtils.setGlobalHandler(globalErrorHandler);
};

// ---------------------------- Ignore Warn -----------------------------------
const ignoreWarns = [
    "Setting a timer for a long period of time",
    "Could not find image file",
    "`new NativeEventEmitter()` was called with a non-null argument",
    "Sending `onAnimatedValueUpdate` with no listeners registered",
    "Can't open url: tbopen://m.taobao.com/tbopen/index.html",
];
const warn = console.warn;
console.warn = (...arg) => {
    for (let i = 0; i < ignoreWarns.length; i++) {
        if (arg[0].startsWith(ignoreWarns[i])) {
            return;
        }
    }
    warn(...arg);
};
// -----------------------------------------------------------------------------

// ---------------------------- Ignore Error -----------------------------------
const ignoreErrors = ["VirtualizedLists should never be nested inside plain ScrollViews with the same orientation"];
const error = console.error;
console.error = (...arg) => {
    for (let i = 0; i < ignoreErrors.length; i++) {
        if (arg[0].startsWith(ignoreErrors[i])) {
            return;
        }
    }
    error(...arg);
};
// -----------------------------------------------------------------------------

export const ignoreLogs = () => {
    LogBox.ignoreLogs([...ignoreWarns, ...ignoreErrors]);
};

export const enableAnimationExperimental = () => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
};

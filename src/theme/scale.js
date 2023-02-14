import { Dimensions, Platform, StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");

const hasNotch = () => {
    if (Platform.OS === "android") {
        return StatusBar.currentHeight > 25;
    }
};

const WIDTH = width;
const HEIGHT = Platform.OS == "android" && hasNotch() ? height + StatusBar.currentHeight : height;

const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];

//Guideline sizes are based on standard ~5.5" screen mobile device
const guidelineBaseWidth = 372;
const guidelineBaseHeight = 680; // optional

const scale = (size) => (shortDimension / guidelineBaseWidth) * size;
const verticalScale = (size) => (longDimension / guidelineBaseHeight) * size; //optional
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const HEIGHT_WITHOUT_STATUS_BAR = height - StatusBar.currentHeight;

export { scale, verticalScale, moderateScale, WIDTH, HEIGHT, HEIGHT_WITHOUT_STATUS_BAR };

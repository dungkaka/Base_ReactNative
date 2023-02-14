import { PixelRatio } from "react-native";
import { moderateScale } from "./scale";

const scaleSystem = PixelRatio.getFontScale();

const fontScale = (size) => moderateScale(size, 0.5);
const spaceScale = (size) => moderateScale(size, 0.8);

export const fontUnit = fontScale(1) / scaleSystem;

export const spaceUnit = spaceScale(1);

export const unit = fontUnit;
export const rem = 14 * fontUnit;

// standard font size
export const sF = 14 * unit;

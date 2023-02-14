import { throttle } from "@utils/helps/functions";
import { useRef } from "react";

export const useThrottle = () => {
    const throttleRef = useRef();

    return (callback, delay) => throttle(throttleRef, callback, delay);
};

import { useRef, useEffect } from "react";

// Su dung de lay gia tri preVious State
export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

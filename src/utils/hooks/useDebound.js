import { debounce } from "@utils/helps/functions";
import { useRef } from "react";

export const useDebound = (runFirst = false) => {
    const debounceRef = useRef();
    const isRunnedFirst = useRef();

    if (runFirst && !isRunnedFirst.current) {
        isRunnedFirst.current = true;
        return (callback, delay) => debounce(debounceRef, callback, 0);
    }

    return (callback, delay) => debounce(debounceRef, callback, delay);
};

import { useEffect, useRef } from "react";

// Customhook su dung trong function component, duoc su dung khi ban muon chay sideEffect duy nhat mot lan
// khi gia tri dependence khac null, false, undefined

// Equivalent to componentDidUpdate
export const useFirstTrueEffect = (func, trueValue) => {
    const firstRun = useRef(false);

    useEffect(() => {
        if (!firstRun.current && trueValue) {
            func();
            firstRun.current == true;
        }
    }, [trueValue]);
};

import { useRef, useEffect } from "react";

// Customhook su dung trong function component, giong nhu 1 function binh thuong
// function component, thu tu cua useEffect trong vi du duoi cung tuong ung voi
// function duoc goi truoc hay sau Effect trong thang cha.

// Equivalent to componentDidUpdate
export const useOnlyDidUpdateEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
};

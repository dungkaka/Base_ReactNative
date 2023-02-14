import { useRef } from "react";

export const useWillMountEffect = (func) => {
    const willMount = useRef(true);

    if (willMount.current) func();

    willMount.current = false;
};

// or
const useComponentWillMount = (func) => {
    useMemo(func, []);
};

import { fetcher as defaultFetcher } from "@utils/helps/request";
import { useEffect, useRef } from "react";
import useSWR, { unstable_serialize, useSWRConfig } from "swr";
import { useOnlyDidUpdateFocusEffect } from "./useOnlyDidUpdateFocusEffect";
import { usePrevious } from "./usePrevious";

export const useAPIFetcher = (key, options, fetcher) => {
    return useSWR(key, fetcher ? fetcher : defaultFetcher, {
        compare: (a, b) => a == b,
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: true,
        errorRetryInterval: 1000,
        errorRetryCount: 2,
        dedupingInterval: timeInterval.XX_SHORT,
        ...options,
    });
};

export const timeInterval = {
    XX_SHORT: 5000,
    X_SHORT: 10000,
    SHORT: 60000,
    NORMAL: 180000,
    LONG: 300000,
    X_LONG: 600000,
};

/*
    * key: can be url or array of key. "api/v1" or ["api/v1", param1, param2];

    * revalidateOnMount = false will prevent fetch API when component mounted, need to use mutate to force validate.
    In span time dedupingInterval, validate only happen with mutate(). That mean, if revalidateOnMount = true, and component A
    mount in time of dedupingInterval, it will not revalidate, just use old data from previous hook.

    * revalidateIfStale: if revalidateIfStale = false, don't declare revalidateOnMount, or make revalidateOnMount = false,

    * IN EACH TIME, useSWR always take data from cache if it already validate before, then revalidate and return new value.
    Even revalidateOnMount = false or isPaused() = true, it still follow this rule.

    * isPaused() : when isPaused return true, it will not revalidation even when you call mutate(). If you want to mutate work, you also need to change return value of isPaused() before; It is helpfull when you want to call add, delete method of list of your customhook but not want to re-render current component because mutate not working in THIS component.

    * dedupingInterval: determined should revalidate request in the next period of time. That mean, if you have component A with dedupingInterval = 5000 and component B with dedupingInterval = 1000 (A and B same key). When you are in component A, 
    after 3s go to component B, the request will not revalidate. But if you are in component B, after 3s go to component A, 
    the request will revalidate. 

    * All config value will keep until we call mutate(). That mean, if a config value depend on some state of component, when update state, config of useSWR not change; until you call mutate(), it will revalidate useSWR with new config value that depend on state.


*/

/* ----------------------------------------------------------------------------------------------- */

// Suggest order of middleware: [auth, expiredTime(20000), listen, saveActiveData]

// Hook for middleware return addition activeData, that is lastest recently fetch success;
// Use this hook in case may have different key fetch or want to keep active data for error in next fetch
// Work per hook
export const saveActiveData = (useSWRNext) => (key, fetcher, config) => {
    const lastWorkData = useRef();
    const swr = useSWRNext(key, fetcher, config);

    useEffect(() => {
        if (swr.data) lastWorkData.current = swr.data;
    }, [swr.data]);

    // activeData is the last recently data is not undefined (that mean the last success fetch data include current fetch)

    swr.activeData = swr.data ? swr.data : lastWorkData.current;

    return swr;
};

// Deprecated
// Hook for middleware sure that cache is not avaiable when change key, but dedupingInterval still work;
export const noCache = (useSWRNext) => (key, fetcher, config) => {
    const { cache } = useSWRConfig();
    const preKey = usePrevious(key);

    if (key != preKey) cache.delete(key);

    const swr = useSWRNext(key, fetcher, config);

    return swr;
};

// Set expiredTime for a request
// How to use: Make sure set dedupingInterval very short and revalidateIfStale = false
// Because it will revalidate base on expiredTime, and ignore dedupingInterval.
export const expiredTime = (time, keepExistData) => (useSWRNext) => (key, fetcher, config) => {
    const { cache } = useSWRConfig();
    const sKey = unstable_serialize(key);
    const preKey = usePrevious(sKey);
    let revalidateIfStale = false;

    if (sKey != preKey) {
        const isExpiredTime = cache.get("TIME_" + sKey) ? cache.get("TIME_" + sKey) < Date.now() : true;
        if (isExpiredTime) {
            if (!keepExistData) cache.delete(sKey);
            revalidateIfStale = true;
        }
    }

    const swr = useSWRNext(key, fetcher, {
        ...config,
        revalidateIfStale: revalidateIfStale,
        onSuccess: () => {
            cache.set("TIME_" + sKey, Date.now() + time);
        },
    });

    swr.mutateWithExpiredTime = (expiredTime, ...arg) => {
        let _expiredTime = expiredTime;
        if (!expiredTime || expiredTime < 0) _expiredTime = time;
        const isExpiredTime = cache.get("TIME_" + sKey) ? cache.get("TIME_" + sKey) - time + _expiredTime < Date.now() : true;
        if (isExpiredTime) {
            swr.mutate(...arg);
        }
    };

    return swr;
};

// if have expiredTime, use this hook after expiredTime
export const revalidateFocusEffect =
    (verifyExpired = true) =>
    (useSWRNext) =>
    (key, fetcher, config) => {
        const { cache } = useSWRConfig();
        const sKey = unstable_serialize(key);
        const swr = useSWRNext(key, fetcher, config);
        const revalidate = useRef();
        revalidate.current = () => {
            if (!verifyExpired) swr.mutate(key);
            else {
                const isExpiredTime = cache.get("TIME_" + sKey) ? cache.get("TIME_" + sKey) < Date.now() : true;
                if (isExpiredTime) {
                    swr.mutate(sKey);
                }
            }
        };

        useOnlyDidUpdateFocusEffect(() => {
            revalidate.current();
        }, []);

        return swr;
    };

export const resetExpiredTime = (cache, keyPart) => {
    const regex = new RegExp(`TIME_.+${keyPart}`);
    for (const key of cache.keys()) {
        if (regex.test(key)) {
            cache.delete(key);
        }
    }
};

// Hook for control listen Data, Validating, Error
export const listen =
    (data = true, validating = true, error = true) =>
    (useSWRNext) =>
    (key, fetcher, config) => {
        const { cache } = useSWRConfig();
        const swr = useSWRNext(key, fetcher, { isPaused: () => (data ? false : true), ...config });

        return {
            data: data ? swr.data : cache.get(unstable_serialize(key)),
            isValidating: validating ? swr.isValidating : null,
            error: error ? swr.error : null,
            mutate: swr.mutate,
        };
    };

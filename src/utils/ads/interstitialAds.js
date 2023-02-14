import { AdEventType, InterstitialAd } from "react-native-google-mobile-ads";
// import * as FacebookAds from "expo-ads-facebook";
import NetInfo from "@react-native-community/netinfo";
import { time } from "@utils/helps/time";
import { AdsMobId } from "constant/AdsId";
import { useFocusEffect } from "@react-navigation/native";
import { useRef } from "react";
import { useCallback } from "react";
import { useEffect } from "react";

export const interstitial = InterstitialAd.createForAdRequest(AdsMobId.INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: true,
});

export const global = {
    didInit: false,
    isLoaded: false,
    expiredShowFullAds: time(),
    delayTimeRequestFullAds: 0,
};

let readyRequestNewFacebookAds = true;

export const useFullAds = ({ instance = interstitial, loadAdManually = false } = {}) => {
    const ads = useRef({
        isLoaded: false,
        unsubscribeLoaded: undefined,
        unsubscribeClosed: undefined,
        unsubscribeError: undefined,
    }).current;

    useEffect(() => {
        ads.unsubscribeLoaded = instance.addAdEventListener(AdEventType.LOADED, () => {
            ads.isLoaded = true;
        });

        ads.unsubscribeError = instance.addAdEventListener(AdEventType.ERROR, () => {
            // Code here
        });

        // Unsubscribe from events on unfocus screen
        return () => {
            ads.unsubscribeLoaded();
            ads.unsubscribeError();
        };
    }, []);

    !loadAdManually &&
        useFocusEffect(
            useCallback(() => {
                // Start loading the instance straight away
                // Notice that inside library handled prevent multiple load, don't need to handle it more.
                loadAds();
            }, [])
        );

    const loadAds = () => {
        global.didInit && !ads.isLoaded && instance.load();
    };

    const showAdMob = async ({ onNotReady = () => {}, onCloseAd = () => {} }) => {
        if (ads.isLoaded) {
            instance.show();
            const handleCloseAdMob = () => {
                onCloseAd();
                global.expiredShowFullAds = time().add(global.delayTimeRequestFullAds, "m");
                loadAds();
            };

            ads.unsubscribeClosed = instance.addAdEventListener(AdEventType.CLOSED, () => {
                ads.isLoaded = false;
                handleCloseAdMob();
                ads.unsubscribeClosed();
            });
        } else onNotReady();
    };

    const show = async ({
        onNotReady = () => {},
        onDidClickFacebookAds = () => {},
        onNotReadyAdMob = () => {},
        onCloseAdMob = () => {},
    } = {}) => {
        // kiem tra da san sang chay quang cao hay khong
        if (time().isBefore(global.expiredShowFullAds) || !readyRequestNewFacebookAds) {
            onNotReady();
            return;
        }

        const stateNetwork = await NetInfo.fetch();
        if (!stateNetwork.isConnected) {
            global.expiredShowFullAds = time().add(30, "s");
            onNotReady();
            return;
        }

        // enableLoading

        showAdMob({
            onNotReady: () => {
                // disableLoading
                onNotReadyAdMob();
            },
            onCloseAd: () => {
                // disableLoading
                onCloseAdMob();
            },
        });

        // showFaceBookAds({
        //     onDidClickAds: () => {
        //         disableLoading
        //         onDidClickFacebookAds();
        //     },
        //     onError: () =>
        //         showAdMob({
        //             onNotReady: () => {
        //                 disableLoading
        //                 onNotReadyAdMob();
        //             },
        //             onCloseAd: () => {
        //                 disableLoading
        //                 onCloseAdMob();
        //             },
        //         }),
        // });
    };

    return {
        show,
        ads: ads,
        loadAds,
    };
};

// export const showFaceBookAds = async ({ onDidClickAds = () => {}, onError = () => {} }) => {
//     let canDoActionOnDidClick = true;
//     let didClick = false;

//     setTimeout(() => {
//         // Neu qua 3,5s nguoi dung chua an nut tat quang cao thi se chuyen sang screen tiep theo luon, dong thoi vo hieu hoa onDidClickAds
//         if (!didClick) {
//             onDidClickAds();
//             canDoActionOnDidClick = false;
//         }
//     }, 3500);

//     try {
//         readyRequestNewFacebookAds = false;
//         await FacebookAds.InterstitialAdManager.showAd(FacebookAdsId.INTERSTITIAL);

//         global.expiredShowFullAds = time().add(global.delayTimeRequestFullAds, "m");
//         readyRequestNewFacebookAds = true;
//         didClick = true;

//         if (canDoActionOnDidClick) onDidClickAds();
//     } catch (e) {
//         // Neu quang cao load loi sau 3,5s thi tu hieu la da click vao quang cao
//         readyRequestNewFacebookAds = true;
//         didClick = true;
//         canDoActionOnDidClick && onError();
//     }
// };

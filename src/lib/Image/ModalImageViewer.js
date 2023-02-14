import ModalPortal from "@lib/Modal/ModalPortal";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Image, StyleSheet } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { LoadingIcon } from "@lib/Loading/DefaultIconLoading";

const ModalImageViewer = forwardRef((props, ref) => {
    const [images, setImages] = useState([]);
    const modalRef = useRef();

    useImperativeHandle(ref, () => ({
        open: (images) => {
            setImages(images);
            modalRef.current.open();
        },
        close: () => {
            modalRef.current.close();
        },
    }));

    return (
        <ModalPortal
            modalStyle={{ width: "100%", height: "100%", backgroundColor: "black" }}
            ref={modalRef}
            lazyLoad={true}
            unmountOnHide={true}
            onBackHandler={() => modalRef.current.close()}
        >
            <ImageViewer
                failImageSource={"Tải thất bại !"}
                loadingRender={() => <LoadingIcon size={32} />}
                useNativeDriver={true}
                imageUrls={images}
                renderImage={(props) => <Image {...props} />}
            />
        </ModalPortal>
    );
});

export default ModalImageViewer;

const styles = StyleSheet.create({});

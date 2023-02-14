import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";

const createThrottleTouchable = (Touchable) =>
  forwardRef((props, ref) => {
    const mount = useRef(true);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
      return () => (mount.current = false);
    }, []);

    useEffect(() => {
      if (disabled && !props.enableHandled)
        setTimeout(
          () => {
            setDisabled(false);
          },
          props.interval && mount.current ? props.interval : 2000
        );
    }, [disabled]);

    useImperativeHandle(ref, () => ({
      changeDisabled: (params) => {
        setDisabled(params);
      },
    }));

    const handleOnPress = () => {
      setDisabled(true);
      props.onPress();
    };

    return (
      <Touchable {...props} disabled={disabled} onPress={handleOnPress}>
        {disabled && props.leftThrottleContent}
        {props.children}
        {disabled && props.rightThrottleContent}
      </Touchable>
    );
  });

const ThrottleTouchableOpacity = createThrottleTouchable(TouchableOpacity);

export default ThrottleTouchableOpacity;

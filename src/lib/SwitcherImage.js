import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

export default SwitcherImage = (props) => {
  const { nextSource, prevSource } = props;

  const fadeInOpacity = useRef(new Animated.Value(0)).current;
  const fadeOutOpacity = useRef(new Animated.Value(1)).current;

  fadeInOpacity.setValue(0);
  fadeOutOpacity.setValue(1);

  useEffect(() => {
    onLoad();
  }, [nextSource]);

  const onLoad = () => {
    Animated.timing(fadeInOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeOutOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={props.styleContainer}>
      <Animated.Image {...props} source={nextSource} style={[styles.image, { opacity: fadeInOpacity }]} />
      {prevSource && (
        <Animated.Image {...props} style={[styles.image, { opacity: fadeOutOpacity, zIndex: -99 }]} source={prevSource} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

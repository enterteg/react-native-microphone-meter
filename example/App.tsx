import { Subscription } from "expo-modules-core";
import { useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import * as ReactNativeMicrophoneMeter from "react-native-microphone-meter";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

export default function App() {
  const audioListener = useRef<Subscription>();
  const animatedVolume = useSharedValue(-120); // db -120 means silence
  const volumes = useRef<number[]>([]);

  const startMonitoringAudio = () => {
    try {
      audioListener.current =
        ReactNativeMicrophoneMeter.addOnVolumeChangeListener(({ db }) => {
          animatedVolume.value = withTiming(db, { duration: 16 });
        });
      ReactNativeMicrophoneMeter.startMonitoringAudio();
    } catch (e) {
      console.log(e);
    }
  };

  const stopMonitoringAudio = () => {
    volumes.current = [];
    audioListener.current?.remove();
    try {
      ReactNativeMicrophoneMeter.stopMonitoringAudio();
    } catch (e) {
      console.log(e);
    }
  };

  const animatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        animatedVolume.value,
        [-40, 0],
        ["black", "white"]
      ),
    }),
    []
  );

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Button title="Start Monitoring" onPress={startMonitoringAudio} />
      <Button title="Stop Monitoring" onPress={stopMonitoringAudio} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

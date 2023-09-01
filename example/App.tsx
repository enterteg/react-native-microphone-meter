import { Subscription } from 'expo-modules-core';
import { useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';


import { ReactNativeMicrophoneMeter, ReactNativeTorch } from 'react-native-microphone-meter';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolateColor, useAnimatedReaction, interpolate } from 'react-native-reanimated';

const INTERVAL = 20
export default function App() {
  const audioListener = useRef<Subscription>()
  const animatedVolume = useSharedValue(-120) // -120 db means silence
  const volumes = useRef<number[]>([])

  useEffect(() => {
    return () => {
      stopMonitoringAudio()
    }
  })

  const onVolumeChange = ({ db }: { db: number }) => {
    animatedVolume.value = withTiming(db, { duration: INTERVAL })
    const intensity = interpolate(animatedVolume.value, [-30, 0], [0, 1])
    try {
      ReactNativeTorch.setIntensity(intensity)
    } catch (e) {
      // do nothing on error
    }
  }
  
  const startMonitoringAudio = () => {
    try {
      audioListener.current = ReactNativeMicrophoneMeter.addOnVolumeChangeListener(onVolumeChange)
      ReactNativeMicrophoneMeter.startMonitoringAudio(INTERVAL)
    } catch (e) {
      console.log(e)
    } 
  }

  const stopMonitoringAudio = () => {
    volumes.current = []
    audioListener.current?.remove()
    try {
      ReactNativeMicrophoneMeter.stopMonitoringAudio()
    } catch (e) {
      console.log(e)
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(animatedVolume.value, [-40, 0], ['black', 'white'])
  }), [])

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Button
        title='Start Monitoring'
        onPress={startMonitoringAudio}
      />
      <Button
        title='Stop Monitoring'
        onPress={stopMonitoringAudio}
      />
      <Button
        title='Turn torch on'
        onPress={() => ReactNativeTorch.turnOn()}
      />
      <Button
        title='Turn torch off'
        onPress={() => ReactNativeTorch.turnOff()}
      />
      <Slider
        style={{width: 200, height: 40}}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onValueChange={(value) => {
          console.log(value)
          try {
            ReactNativeTorch.setIntensity(value)
          } catch (e) {
            console.log(e)
          }
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import * as ReactNativeMicrophoneMeter from 'react-native-microphone-meter';

export default function App() {
  useEffect(() => {
    ReactNativeMicrophoneMeter.addOnVolumeChangeListener(({ db }) => {
      console.log('Volume changed', db)
    })
  }, [])

  return (
    <View style={styles.container}>
      <Button
      title='Start Monitoring'
      onPress={() => ReactNativeMicrophoneMeter.startMonitoringAudio()}
    />
      <Button
      title='Stop Monitoring'
      onPress={() => ReactNativeMicrophoneMeter.stopMonitoringAudio()}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

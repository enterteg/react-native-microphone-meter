import { StyleSheet, Text, View } from 'react-native';

import * as ReactNativeMicrophoneMeter from 'react-native-microphone-meter';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ReactNativeMicrophoneMeter.hello()}</Text>
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

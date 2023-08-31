import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ReactNativeMicrophoneMeterViewProps } from './ReactNativeMicrophoneMeter.types';

const NativeView: React.ComponentType<ReactNativeMicrophoneMeterViewProps> =
  requireNativeViewManager('ReactNativeMicrophoneMeter');

export default function ReactNativeMicrophoneMeterView(props: ReactNativeMicrophoneMeterViewProps) {
  return <NativeView {...props} />;
}

import * as React from 'react';

import { ReactNativeMicrophoneMeterViewProps } from './ReactNativeMicrophoneMeter.types';

export default function ReactNativeMicrophoneMeterView(props: ReactNativeMicrophoneMeterViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}

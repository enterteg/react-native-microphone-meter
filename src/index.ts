import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ReactNativeMicrophoneMeter.web.ts
// and on native platforms to ReactNativeMicrophoneMeter.ts
import ReactNativeMicrophoneMeterModule from './ReactNativeMicrophoneMeterModule';
import ReactNativeMicrophoneMeterView from './ReactNativeMicrophoneMeterView';
import { ChangeEventPayload, ReactNativeMicrophoneMeterViewProps } from './ReactNativeMicrophoneMeter.types';

// Get the native constant value.
export const PI = ReactNativeMicrophoneMeterModule.PI;

export function hello(): string {
  return ReactNativeMicrophoneMeterModule.hello();
}

export async function setValueAsync(value: string) {
  return await ReactNativeMicrophoneMeterModule.setValueAsync(value);
}

const emitter = new EventEmitter(ReactNativeMicrophoneMeterModule ?? NativeModulesProxy.ReactNativeMicrophoneMeter);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ReactNativeMicrophoneMeterView, ReactNativeMicrophoneMeterViewProps, ChangeEventPayload };

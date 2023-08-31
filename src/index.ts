import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to ReactNativeMicrophoneMeter.web.ts
// and on native platforms to ReactNativeMicrophoneMeter.ts
import ReactNativeMicrophoneMeterModule from "./ReactNativeMicrophoneMeterModule";
import {
  OnVolumeChangePayload,
  ReactNativeMicrophoneMeterViewProps,
} from "./ReactNativeMicrophoneMeter.types";

export function startMonitoringAudio(): void {
  ReactNativeMicrophoneMeterModule.startMonitoringAudio();
}

export function stopMonitoringAudio(): void {
  ReactNativeMicrophoneMeterModule.stopMonitoringAudio();
}

export async function askForPermissions(): Promise<void> {
  ReactNativeMicrophoneMeterModule.askForPermissions();
}

const emitter = new EventEmitter(ReactNativeMicrophoneMeterModule);

export function addOnVolumeChangeListener(
  listener: (event: OnVolumeChangePayload) => void
): Subscription {
  return emitter.addListener<OnVolumeChangePayload>("onVolumeChange", listener);
}


export { ReactNativeMicrophoneMeterViewProps, OnVolumeChangePayload };

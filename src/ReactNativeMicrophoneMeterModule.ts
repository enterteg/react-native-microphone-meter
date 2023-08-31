import { requireNativeModule } from "expo-modules-core";

interface ReactNativeMicrophoneMeterModule {
  readonly askForPermissions: () => Promise<void>;
  readonly startMonitoringAudio: () => void;
  readonly stopMonitoringAudio: () => void;
  startObserving?: () => void;
  stopObserving?: () => void;

  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

export default requireNativeModule<ReactNativeMicrophoneMeterModule>(
  "ReactNativeMicrophoneMeter"
);

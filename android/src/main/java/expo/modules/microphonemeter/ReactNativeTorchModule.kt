package expo.modules.microphonemeter

import android.content.Context
import android.hardware.camera2.CameraManager
import android.os.Build
import androidx.annotation.RequiresApi
import expo.modules.interfaces.permissions.Permissions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.math.roundToInt

class ReactNativeTorchModule : Module() {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.


    private fun getCameraManager(): CameraManager {
        val cameraManager: CameraManager = appContext.reactContext?.getSystemService(Context.CAMERA_SERVICE) as CameraManager

        return cameraManager
    }


    @RequiresApi(Build.VERSION_CODES.TIRAMISU)
    override fun definition() = ModuleDefinition {

        Name("ReactNativeTorch")

        AsyncFunction("turnOn"){ promise: expo.modules.kotlin.Promise ->
            var result = Permissions.askForPermissionsWithPermissionsManager(appContext.permissions, promise,
                    android.Manifest.permission.CAMERA)

            var cameraManager = getCameraManager()
            val cameraIds: Array<String> = cameraManager.cameraIdList
            val rearCameraId = cameraIds[0]


            cameraManager.turnOnTorchWithStrengthLevel(rearCameraId, 1)
            // cameraManager.turnOnTorchWithStrengthLevel(rearCameraId, cameraCharacteristics.get(FLASH_INFO_STRENGTH_MAXIMUM_LEVEL))
            Unit
        }

        Function("turnOff"){
            var cameraManager = getCameraManager()
            val cameraIds: Array<String> = cameraManager.cameraIdList
            val rearCameraId = cameraIds[0]
            cameraManager.turnOnTorchWithStrengthLevel(rearCameraId, 0)
        }

        Function("setIntensity") { intensity: Double ->
            var cameraManager = getCameraManager()
            val cameraIds: Array<String> = cameraManager.cameraIdList
            val rearCameraId = cameraIds[0]
            // we get intensity from 0 to 1 from React Native, so let's convert it to 0 -> 100
            val intIntensity = (intensity*100).roundToInt()
            cameraManager.turnOnTorchWithStrengthLevel(rearCameraId, intIntensity)
        }
    }
}

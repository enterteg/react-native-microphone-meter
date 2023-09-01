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
            Unit
        }

        Function("turnOff"){
            var cameraManager = getCameraManager()
            val cameraIds: Array<String> = cameraManager.cameraIdList
            val rearCameraId = cameraIds[0]
            cameraManager.setTorchMode(rearCameraId, false);
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

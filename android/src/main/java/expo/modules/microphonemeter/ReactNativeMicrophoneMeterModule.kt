package expo.modules.microphonemeter

import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.util.Log
import expo.modules.interfaces.permissions.Permissions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.Arrays
import java.util.jar.Manifest

class ReactNativeMicrophoneMeterModule : Module() {

  private val sampleRate = 8000
  private val channelConfig = AudioFormat.CHANNEL_IN_MONO
  private val audioFormat = AudioFormat.ENCODING_PCM_16BIT
  private var bufferSize: Int = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat)
  private lateinit var audioRecord: AudioRecord


  private fun processAudioData() {
    val audioData = ShortArray(bufferSize)
    while (audioRecord.recordingState == AudioRecord.RECORDSTATE_RECORDING) {
      audioRecord.read(audioData, 0, bufferSize)

      // Here you can process the audio data
      System.out.println(Arrays.toString((audioData)))
    }
  }


  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {


    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ReactNativeMicrophoneMeter')` in JavaScript.
    Name("ReactNativeMicrophoneMeter")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }

    AsyncFunction("askForPermissions") {promise: Promise ->
      var result = Permissions.askForPermissionsWithPermissionsManager(appContext.permissions, promise,
              android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
              android.Manifest.permission.RECORD_AUDIO)
    }
    Function("startMonitoringAudio"){
      //setContentView(R.layout.activity_main)

      try {
        audioRecord = AudioRecord(MediaRecorder.AudioSource.MIC, sampleRate, channelConfig, audioFormat, bufferSize)
        audioRecord.startRecording()

        // Create a background thread to process audio data
        Thread(Runnable {
          processAudioData()
        }).start()
      }catch(e: SecurityException){
        // ignore for now
      }
    }

    Function("stopMonitoringAudio"){
      // Make sure to release the audio recorder
      if (audioRecord.state == AudioRecord.STATE_INITIALIZED) {
        audioRecord.stop()
        audioRecord.release()
      }
    }

    Function("startObserving"){}

    Function("stopObserving"){}

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(ReactNativeMicrophoneMeterView::class) {
      // Defines a setter for the `name` prop.
      Prop("name") { view: ReactNativeMicrophoneMeterView, prop: String ->
        println(prop)
      }
    }
  }
}

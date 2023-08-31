import AVFoundation
import ExpoModulesCore

internal class RecordingSessionException: Exception {
  override var reason: String {
    "Recording session setup failed"
  }
}

internal class AudioCaptureException: Exception {
  override var reason: String {
    "Audio capture failed"
  }
}

internal class RecordingTerminationException: Exception {
  override var reason: String {
    "Stopping the recording failed"
  }
}


public class ReactNativeMicrophoneMeterModule: Module {
  private var audioRecorder: AVAudioRecorder?
  private var recordingSession: AVAudioSession?
  
  private func captureAudio() throws {
    let temporaryDirectoryURL = FileManager.default.temporaryDirectory
    let audioRecordingURL = temporaryDirectoryURL.appendingPathComponent("audioMeterRecording.m4a")
    
    let settings = [
      AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
      AVSampleRateKey: 12000,
      AVNumberOfChannelsKey: 1,
      AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
    ]
    
    do {
      let audioRecorder = try AVAudioRecorder(url: audioRecordingURL, settings: settings)
      self.audioRecorder = audioRecorder
      audioRecorder.record()
      audioRecorder.isMeteringEnabled = true
      
      Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { timer in
        audioRecorder.updateMeters()
        let db = audioRecorder.averagePower(forChannel: 0)
        print(db)
        self.sendEvent("onVolumeChange", [
          "db": db
        ])
      }
    } catch {
      throw AudioCaptureException()
    }
  }
  
  public func definition() -> ModuleDefinition {
    Name("ReactNativeMicrophoneMeter")
    
    Events("onVolumeChange")
    
    Function("startMonitoringAudio") {
      let recordingSession = AVAudioSession.sharedInstance()
      self.recordingSession = recordingSession
      do {
        try recordingSession.setCategory(.record)
        try recordingSession.setActive(true)
        
        recordingSession.requestRecordPermission({ result in
          guard result else { return }
        })
        
        try captureAudio()
      } catch {
        throw RecordingSessionException()
      }
    }
    
    Function("stopMonitoringAudio") {
      do {
        audioRecorder?.stop()
        audioRecorder?.deleteRecording()
        try recordingSession?.setActive(false)
      } catch {
        throw RecordingTerminationException()
      }
      
    }
  }
}

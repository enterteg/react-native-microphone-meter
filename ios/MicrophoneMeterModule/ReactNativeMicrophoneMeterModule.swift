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
  private var timer : Timer?
  
  private func captureAudio(interval: Int) throws {
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
      print(interval / 1000)
      self.timer = Timer.scheduledTimer(withTimeInterval: Double(interval) / 1000.0, repeats: true) { timer in
        audioRecorder.updateMeters()
        let db = audioRecorder.averagePower(forChannel: 0)
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
    
    Function("startMonitoringAudio") { (interval: Int) in
      let recordingSession = AVAudioSession.sharedInstance()
      self.recordingSession = recordingSession
      do {
        try recordingSession.setCategory(.record)
        try recordingSession.setActive(true)
        
        recordingSession.requestRecordPermission({ result in
          guard result else { return }
        })
        
        try captureAudio(interval: interval)
      } catch {
        throw RecordingSessionException()
      }
    }
    
    Function("stopMonitoringAudio") {
      do {
        self.timer?.invalidate()
        audioRecorder?.stop()
        audioRecorder?.deleteRecording()
        try recordingSession?.setActive(false)
      } catch {
        throw RecordingTerminationException()
      }
      
    }
  }
}

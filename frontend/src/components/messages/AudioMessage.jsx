import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import WaveSurfer from "wavesurfer.js";
import { Mic, OctagonPause, PlayCircle, X } from "lucide-react";

const AudioMessage = ({
  isRecording,
  setIsRecording,
  audioBlob,
  setAudioBlob,
  audioUrl,
  setAudioUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const waveformRef = useRef(null); // For WaveSurfer container
  const waveSurferInstance = useRef(null); // For WaveSurfer instance
  const mediaRecorderRef = useRef(null);

  // Initialize WaveSurfer
  useEffect(() => {
    if (audioUrl && waveformRef.current) {
      // Cleanup previous instance if any
      if (waveSurferInstance.current) {
        waveSurferInstance.current.destroy();
      }

      // Create a new instance
      waveSurferInstance.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#ff4081",
        cursorColor: "#000",
        responsive: true,
        backend: "WebAudio",
        normalize: true,
        height: 50,
      });

      waveSurferInstance.current.load(audioUrl);

      // Event listener for when the audio finishes
      waveSurferInstance.current.on("finish", () => {
        setIsPlaying(false);
      });

      // Cleanup on component unmount or URL change
      return () => {
        if (waveSurferInstance.current) {
          waveSurferInstance.current.destroy();
        }
      };
    }
  }, [audioUrl]);

  // Start Recording
  const startRecording = async () => {
    try {
      setAudioBlob(null);
      setAudioUrl(null);
      setIsPlaying(false);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      if (!isRecording) {
        setIsRecording(true);
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (isRecording) {
        setIsRecording(false);
      }
    }
  };

  // Play or Pause Audio
  const togglePlay = () => {
    if (waveSurferInstance.current) {
      if (isPlaying) {
        waveSurferInstance.current.pause();
      } else {
        waveSurferInstance.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex gap-5 items-center   ">
      <div>
        <button
          onClick={startRecording}
          disabled={isRecording}
          className={isRecording ? `hidden` : "block"}
        >
          <Mic />
        </button>
        <button
          onClick={stopRecording}
          className={!isRecording ? `hidden` : "block"}
        >
          <X />
        </button>
      </div>

      {audioUrl && (
        <div className="flex gap-4  ">
          <div ref={waveformRef} style={{ width: "200px", height: "100%" }} />
          <div className="flex gap-4">
            <button onClick={togglePlay}>
              {isPlaying ? <OctagonPause /> : <PlayCircle />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioMessage;

import React, { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { Mic, OctagonPause, PlayCircle, X } from "lucide-react";

export const AudioMessagePlayer = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const waveformRef = useRef(null);
  const waveSurferInstance = useRef(null);

  // Initialize WaveSurfer instance
  useEffect(() => {
    if (audioUrl && waveformRef.current) {
      if (waveSurferInstance.current) {
        waveSurferInstance.current.destroy();
      }

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

      waveSurferInstance.current.on("finish", () => {
        setIsPlaying(false);
      });

      return () => {
        waveSurferInstance.current.destroy();
      };
    }
  }, [audioUrl]);

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
    <div className="flex items-center gap-4">
      <div ref={waveformRef} style={{ width: "300px", height: "50px" }} />
      <button onClick={togglePlay} className="text-xl">
        {isPlaying ? <OctagonPause /> : <PlayCircle />}
      </button>
    </div>
  );
};

import { useEffect, useRef } from "react";

export const useGameAudio = (isPlaying: boolean, crashed: boolean) => {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const crashRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    musicRef.current = new Audio("/music.mp3");
    crashRef.current = new Audio("/crash.mp3");

    // Loop background music
    if (musicRef.current) {
      musicRef.current.loop = true;
      musicRef.current.volume = 0.3;
    }

    // Set crash sound volume
    if (crashRef.current) {
      crashRef.current.volume = 0.5;
    }

    return () => {
      // Cleanup on unmount
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
      if (crashRef.current) {
        crashRef.current.pause();
        crashRef.current = null;
      }
    };
  }, []);

  // Handle background music based on game state
  useEffect(() => {
    if (!musicRef.current) return;

    if (isPlaying) {
      musicRef.current.play().catch(() => {
        // Handle autoplay restrictions
        console.log("Audio autoplay prevented. User interaction required.");
      });
    } else {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  // Handle crash sound
  useEffect(() => {
    if (crashed && crashRef.current) {
      crashRef.current.currentTime = 0;
      crashRef.current.play().catch(() => {
        console.log("Crash sound failed to play.");
      });
    }
  }, [crashed]);

  return {
    playMusic: () => musicRef.current?.play(),
    stopMusic: () => musicRef.current?.pause(),
    playCrash: () => crashRef.current?.play(),
  };
};

"use client"

import React, { useState, useEffect } from "react";

const useAudio = url => {
  const [audio, setAudio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!playing)
    {
      setPlaying(true);
      audio.currentTime = 0;
    }
  }
  useEffect(() => {
      playing ? audio.play() : audio.pause();
    },
    [playing]
  );

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (playing) {
        setPlaying(false)
      }
    }, 3000); // set the timeout to 5 seconds (5000 milliseconds)

    return () => {
      clearTimeout(timer);
    }
  }, [playing]);

  return [playing, toggle];
};

const Player = ({ url }) => {
  const [playing, toggle] = useAudio(url);

  return (
    <div>
      <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
    </div>
  );
};

export default Player;
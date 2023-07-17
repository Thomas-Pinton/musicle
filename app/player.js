"use client"

import React, { useState, useEffect } from "react";
import './player.css'

let buttonUrl = 'https://cdn2.iconfinder.com/data/icons/button-v1/30/15-256.png'

const useAudio = (url, timeToPlay) => {
  console.log("Url 2 ", url)
  const [audio, setAudio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!playing)
    {
      audio.currentTime = 0;
    }
    setPlaying(!playing);
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
    }, timeToPlay * 1000); // set the timeout to 5 seconds (5000 milliseconds)

    return () => {
      clearTimeout(timer);
    }
  }, [playing]);

  return [playing, toggle];
};

const Player = ({ url, timeToPlay, onClickPlay }) => {

  console.log("Url player", url)
  const [playing, toggle] = useAudio(url, timeToPlay);

  return (
    <div>,
      <button className="playButton" onClick={() => {toggle(), onClickPlay()}}>{playing ? "Pause" : "Play"}
        {/* <img src={buttonUrl}/> */}
      </button>
    </div>
  );
};

export default Player;
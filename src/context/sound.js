import React, { createContext, useState } from "react";
import useSound from "use-sound";

import beginSound from "../sounds/begin.mp3";
import confirmSound from "../sounds/confirm.mp3";
import timerEndSound from "../sounds/timerend.mp3";
import winnerSound from "../sounds/winner.mp3";
import loserSound from "../sounds/loser.mp3";

const SoundContext = createContext({});

function SoundProvider({ children }) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mute, setMute] = useState(false);
  const [playBeginSounds, { stop: stopBeginSound }] = useSound(beginSound, {
    onload: () => setCount((count) => count + 1),
  });
  const [
    playConfirmSounds,
    { stop: stopConfirmSound, isPlaying: isConfirmSoundPlaying },
  ] = useSound(confirmSound, {
    onload: () => setCount((count) => count + 1),
  });
  const [
    playTimerEndSounds,
    { stop: stopTimerEndSound, isPlaying: isTimerEndSoundPlaying },
  ] = useSound(timerEndSound, {
    onload: () => setCount((count) => count + 1),
  });
  const [playWinnerSounds, { stop: stopWinnerSound }] = useSound(winnerSound, {
    onload: () => setCount((count) => count + 1),
  });
  const [playLoserSounds, { stop: stopLoserSound }] = useSound(loserSound, {
    onload: () => setCount((count) => count + 1),
  });

  const toggleMute = () => {
    setMute(!mute);
  };

  const playBeginSound = () => {
    if (!mute) {
      playBeginSounds();
    }
  };
  const playConfirmSound = () => {
    if (!mute) {
      playConfirmSounds();
    }
  };
  const playTimerEndSound = () => {
    if (!mute) {
      playTimerEndSounds();
    }
  };
  const playWinnerSound = () => {
    if (!mute) {
      playWinnerSounds();
    }
  };
  const playLoserSound = () => {
    if (!mute) {
      playLoserSounds();
    }
  };

  React.useEffect(() => {
    if (mute) {
      stopBeginSound();
      stopConfirmSound();
      stopTimerEndSound();
      stopWinnerSound();
      stopLoserSound();
    }
  }, [mute]);

  React.useEffect(() => {
    if (count === 5) {
      setLoading(false);
    }
  }, [count]);

  return (
    <SoundContext.Provider
      value={{
        playBeginSound,
        stopBeginSound,
        playConfirmSound,
        stopConfirmSound,
        isConfirmSoundPlaying,
        playTimerEndSound,
        stopTimerEndSound,
        isTimerEndSoundPlaying,
        playWinnerSound,
        stopWinnerSound,
        mute,
        loadingSound: loading,
        playLoserSound,
        stopLoserSound,
        toggleMute,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export { SoundContext, SoundProvider };

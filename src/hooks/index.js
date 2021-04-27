import React, { useState, useEffect, useRef } from 'react';

export function useTimer(callback, timerDuration, startTime) {
  const savedCallback = useRef();
  const remainingTime = Math.max(timerDuration - (Math.floor((new Date().getTime() - startTime.getTime()) / 1000)), 0)
  const [timer, setTimer] = useState(remainingTime)

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let intervalId
    function callback() {
      const timeLeft = timerDuration - Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      if (timeLeft >= 0) {
        setTimer(timeLeft)
      } else {
        clearInterval(intervalId)
        savedCallback.current();
      }
    }
    intervalId = setInterval(callback, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return timer
}

export const useIsMounted = () => {
  const ref = React.useRef(false)
  const [, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    ref.current = true
    setIsMounted(true)
    return () => (ref.current = false)
  }, [])
  return () => ref.current
}

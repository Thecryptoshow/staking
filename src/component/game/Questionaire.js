import React, { useContext, useEffect } from "react";
import { useTimer } from "../../hooks";
import Button  from "./Button";
import Confirm from "./Confirm";
import { SoundContext } from "../../context/sound";

const Timer = ({ timerDuration, startTime, timeOver, confirm }) => {
  const timer = useTimer(timeOver, timerDuration, startTime);
  const {
    playTimerEndSound,
    stopTimerEndSound,
    isTimerEndSoundPlaying,
  } = useContext(SoundContext);
  useEffect(() => {
    if (!confirm && timer <= 8 && !isTimerEndSoundPlaying) {
      playTimerEndSound();
    }
    if ((confirm && isTimerEndSoundPlaying) || timer <= 0) {
      stopTimerEndSound();
    }
  }, [timer, isTimerEndSoundPlaying, stopTimerEndSound]);
  return <div className="timer">Timer: {timer}</div>;
};

const Questionaire = ({
  question,
  options,
  startTime,
  timerDuration,
  updateGameState,
  confirm,
  userAnswer,
  wsClient,
  confirmedPlayerCount,
}) => {
  const { playConfirmSound } = useContext(SoundContext);

  const updateAnswer = (answer) => {
    !confirm && updateGameState({ userAnswer: answer });
  };

  const setConfirm = () => {
    if (userAnswer && !confirm) {
      playConfirmSound();
      updateGameState({ confirm: true });
    }
  };

  // handleTimer Over is called by Timer after timeout defined in App.js
  const handleTimerOver = () => {
    updateGameState({ isTimeOver: true });
  };

  return (
    <div className="row">
      <div className="col-sm col-md-9 col-lg-9">
        <div
          className="question"
          dangerouslySetInnerHTML={{
            __html: question,
          }}
        ></div>

        <div className="answers mt-5">
          <div className="row">
            <Button
              onClick={() => updateAnswer(options[0])}
              isSelected={userAnswer === options[0]}
              value={options[0]}
            />
            <Button
              onClick={() => updateAnswer(options[1])}
              isSelected={userAnswer === options[1]}
              value={options[1]}
            />
            <Button
              onClick={() => updateAnswer(options[2])}
              isSelected={userAnswer === options[2]}
              value={options[2]}
            />
            <Button
              onClick={() => updateAnswer(options[3])}
              isSelected={userAnswer === options[3]}
              value={options[3]}
            />
          </div>
        </div>
      </div>

      <div className="col-sm col-md-3 col-lg-3">
        <div className="answer-submit">
          <div className="row">
            <div className="col-sm">
              <Timer
                startTime={startTime}
                timerDuration={timerDuration}
                confirm={confirm}
                timeOver={handleTimerOver}
              />

              <Confirm
                flash={
                  !confirm &&
                  timerDuration -
                    (new Date().getTime() - startTime.getTime()) / 1000 <=
                    8
                }
                onClick={() => {
                  if (userAnswer) {
                    setConfirm(true);
                    wsClient.current &&
                      wsClient.current.send(
                        JSON.stringify({ type: "answer", answer: userAnswer })
                      );
                  }
                }}
                className={confirm ? "selected-btn" : "confirm"}
                value={confirm ? "CONFIRMED" : "CONFIRM"}
              />

              <div className="players">PLAYERS {confirmedPlayerCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionaire;

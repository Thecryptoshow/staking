import React, { useState, useEffect, useContext } from "react";
import { Questionaire, UserInfo } from "../../component/game";
import { useTimer } from "../../hooks";
import { SoundContext } from "../../context/sound";
import { w3cwebsocket } from "websocket";
const WEB_SOCKET_ENDPOINT = "wss://mynewapptestqq.herokuapp.com/";

const Timer = ({ timerDuration, startTime, timeOver, showContent }) => {
  const timer = useTimer(timeOver, timerDuration, startTime);
  return showContent ? (
    <h1 className="cols-span-6 text-white text-2xl text-center">
      {!timerDuration ? "Loading.." : `NEXT QUESTION IN: ${timer}`}
    </h1>
  ) : null;
};

const getInitialState = () => ({
  // The game has started if true
  isPlaying: false,
  // The start time when the game began
  startTime: null,
  // The question
  question: null,
  // The correct answer
  isCorrect: null,
  // The time duration to answer the question
  timerDuration: 5,
  // The options provided in the question
  options: null,
  // The start time for count down to next question
  loadStartTime: new Date(),
  // Gap between question
  questionGap: null,
  // User selected Answer
  confirm: false,
  // User confirmation
  userAnswer: null,
  // game time over
  isTimeOver: false,
  // total number of players
  confirmedPlayerCount: 0,
  shownResult: true,
});

function App({ userName, updateUserName, setPopupShown }) {
  // Populate game state with initial state. Tha first question starts in 5 seconds
  const [
    {
      shownResult,
      isPlaying,
      questionGap,
      loadStartTime,
      startTime,
      question,
      isCorrect,
      timerDuration,
      options,
      userAnswer,
      isTimeOver,
      confirm,
      confirmedPlayerCount,
    },
    setGameState,
  ] = useState(getInitialState(5));
  const client = React.useRef(null);
  // Box state
  const [showContent, toggleContent] = useState(true);
  const [showExpandedBox, toggleExpandedBox] = useState(false);

  const { playBeginSound } = useContext(SoundContext);
  // Helper method to update state
  const updateGameState = (updateObj) => {
    setGameState((state) => ({ ...state, ...updateObj }));
  };

  useEffect(() => {
    if (isPlaying) {
      playBeginSound();
    }
  }, [isPlaying]);

  // Start Game fetches question and updates state
  const startGame = () => {
    updateGameState();
  };

  // End the game
  const endGame = () => {
    setGameState(getInitialState());
  };

  // Start the game on component mount
  useEffect(() => {
    client.current = new w3cwebsocket(WEB_SOCKET_ENDPOINT);
    client.current.onmessage = (message) => {
      const msg = JSON.parse(message.data);
      const newStartTime = new Date(msg.startTime);
      const question = msg.question;
      console.log(msg);
      switch (msg.state) {
        case "PLAYING":
          if (msg.updateCountOnly) {
            updateGameState({
              confirmedPlayerCount: msg.confirmedPlayerCount,
            });
          } else {
            updateGameState({
              confirmedPlayerCount: msg.confirmedPlayerCount,
              question: question,
              options: (msg.options || []).sort(() => Math.random() - 0.5),
              startTime: newStartTime,
              loadStartTime: newStartTime,
              isPlaying: true,
              questionGap: msg.questionGap,
              timerDuration: msg.questionDuration,
              confirm: false,
              userAnswer: null,
              shownResult: false,
            });
          }
          break;
        case "LOADING":
          if (msg.isCorrect !== undefined || question != undefined) {
            console.log(msg, msg.isCorrect, question);
            setPopupShown({
              isCorrect: msg.isCorrect,
              isPopUpShow: true,
            });
          }

          updateGameState({
            isCorrect: msg.isCorrect,
            confirmedPlayerCount: msg.confirmedPlayerCount,
            startTime: newStartTime,
            loadStartTime: newStartTime,
            isPlaying: false,
            questionGap: msg.questionGap,
            timerDuration: msg.questionDuration,
          });
          break;
        default:
      }
    };
    client.current.onopen = () => {
      client.current.send(JSON.stringify({ type: "get_state_all" }));
    };
    return () => client.current.close();
  }, []);

  // handle left box click
  const openNewWindow = () => {
    window.open("https://thecrypto.show/");
  };

  // handle center box click
  const hideContent = () => {
    toggleContent(!showContent);
    toggleExpandedBox(false);
  };

  // handle right box click
  const expandedView = () => {
    toggleExpandedBox(!showExpandedBox);
    toggleContent(true);
  };

  return (
    <div>
      {!userName ? (
        <UserInfo updateUserName={updateUserName} wsClient={client} />
      ) : (
        <>
          <div style={{color: "white"}}> Hello {userName} ! </div>
        <br/><br/>
          {isPlaying && showContent && !showExpandedBox ? (
            <Questionaire
              showContent={showContent}
              startTime={startTime}
              isCorrect={isCorrect}
              options={options}
              question={question}
              timerDuration={timerDuration}
              userAnswer={userAnswer}
              confirm={confirm}
              updateGameState={updateGameState}
              wsClient={client}
              confirmedPlayerCount={confirmedPlayerCount}
            />
          ) : (
            <div
              className="grid gap-6 border-8 p-10 border-yellow-300 bg-gray-700 content-center justify-center"
              style={{
                // minWidth: 900,
                minHeight: 450,
                opacity: showExpandedBox ? "0" : "1",
              }}
            >
              {!showContent && (
                <h1 className="cols-span-6 text-white text-2xl text-center">
                  Expanded Box Text
                </h1>
              )}
              {!isPlaying && questionGap && (
                <Timer
                  showContent={showContent}
                  timerDuration={questionGap}
                  startTime={loadStartTime}
                  timeOver={() => {}}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;

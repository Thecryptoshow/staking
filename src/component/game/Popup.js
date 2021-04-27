import React, { useContext, useEffect } from "react";
import Continue from "./Continue";
import { SoundContext } from "../../context/sound";
import { Link } from "react-router-dom";

const Popup = ({ correct, onProceed, show, confirmed }) => {
  const {
    playWinnerSound,
    stopWinnerSound,
    playLoserSound,
    stopLoserSound,
  } = useContext(SoundContext);
  useEffect(() => {
    if (show) {
      if (correct) {
        playWinnerSound();
      } else {
        playLoserSound();
      }
    }
    return () => {
      console.log("stopping sound");
      stopLoserSound();
      stopWinnerSound();
    };
  }, [show, correct]);

  return show ? (
    <div
      className="modal fade show"
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: "block", backgroundColor: "#00000047" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <div
              className="modal-wrapper"
              style={{ backgroundColor: correct ? "#58c4dc" : "#766B82" }}
            >
              <img src="/img/template.png" alt="template" id="template" />
              <img
                src="/img/showtoken option 1.png"
                alt="template"
                id="crown"
                style={{ top: correct ? "90px" : "25px" }}
              />
              <div class="content">
                <h2>
                  {correct
                    ? "You answered correctly!"
                    : confirmed
                    ? "Incorrect answer ):"
                    : "Oh no! You forgot to click Confirm"}
                </h2>
                <p>
                  {correct
                    ? "Enjoy Your BNB Profit!"
                    : "Try Again"}
                </p>

                <Continue
                  border={false}
                  onClick={onProceed}
                  className={`continue-btn ${
                    correct ? "bg-blue-300" : "bg-yellow-300"
                  } rounded`}
                  value={"Continue"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
export default Popup;

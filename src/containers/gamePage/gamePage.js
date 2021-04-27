import React, { useState, useEffect } from "react";
import { Popup, UserInfo } from "../../component/game";
import Game from "./game.js";
import { Link } from "react-router-dom";
import { SoundContext } from "../../context/sound";

const CryptoShow = () => {
  const [userName, updateUserName] = useState();
  const [{ isPopUpShow, isCorrect, confirm }, setPopupShown] = useState({
    isPopUpShow: false,
  });
  const { mute, toggleMute, loadingSound } = React.useContext(SoundContext);

  return (
    <div
      className="content-wrapper"
      style={{ backgroundColor: 'black', width: "100%", marginLeft: 0, minHeight: '100vh' }}
    >
      <section className="content">
        <div className="container-fluid ">
          <div className="pt-5 top-section">
            <div className="row">
              <div className="col-sm col-lg-4 col-xl-5">
                <Link
                  to="/"
                  onClick={(event) => event.preventDefault()}
                  className="today-top"
                >
                  Today
                  <br />
                  Top
                  <i className="right fas fa-angle-right"></i>
                </Link>
              </div>
              <div className="col-sm col-lg-4 col-xl-2">
                <Link
                  to="/"
                  onClick={(event) => event.preventDefault()}
                  className="earn-in-pool"
                >
                  Earn
                  <br />
                  <span>SHOW</span>
                  <br />
                  In Pool
                  <i className="right fas fa-angle-right"></i>
                </Link>
              </div>
              <div className="col-sm col-lg-4 col-xl-5">
                <Link
                  to="/"
                  onClick={(event) => event.preventDefault()}
                  className="last-jackpot"
                >
                  Last
                  <br />
                  Jackpot
                  <i className="right fas fa-angle-right"></i>
                </Link>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm col-xl-10 offset-xl-1">
              <div
                className="bottom-section mt-5"
                style={{ userSelect: "none" }}
              >
                {loadingSound ? (
                  "Loading Sound"
                ) : !userName ? (
                  <UserInfo updateUserName={updateUserName} />
                ) : !isPopUpShow ? (
                  <Game
                    userName={userName}
                    updateUserName={updateUserName}
                    setPopupShown={setPopupShown}
                  />
                ) : (
                  <Popup
                    show={true}
                    correct={isCorrect}
                    onProceed={() => setPopupShown({ isPopUpShow: false })}
                    confirmed={isCorrect !== null}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CryptoShow;

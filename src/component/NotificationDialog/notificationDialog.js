import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import logo from "../../assets/images/show_token.png";
//import Countdown from "react-countdown";

//var launchDate = new Date("Sun, 21 Mar 2021 05:00:00 GMT").toUTCString();
// var currDate = new Date();

// let daysDiff =
//   (new Date(launchDate).getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);

// let hoursDiff = (daysDiff - parseInt(daysDiff)) * 24;
// let minDiff = (hoursDiff - parseInt(hoursDiff)) * 60;
// let secDiff = (minDiff - parseInt(minDiff)) * 60;
// slet milisec = (secDiff - parseInt(secDiff)) * 1000;

// const daysLeft = parseInt(daysDiff) * 24 * 60 * 60 * 1000;
// const hourLeft = parseInt(hoursDiff) * 60 * 60 * 1000;
// const minLeft = parseInt(minDiff) * 60 * 1000;
// const secLeft = parseInt(secDiff) * 1000;
//const dayLeft = daysLeft + hourLeft + minLeft + secLeft + milisec;

function NotificationDialog(props) {
  useEffect(() => {
    return () => {
      localStorage.setItem("lastVisit", new Date().getTime());
    };
  }, []);
  return (
    <>
      <Modal
        size="lg"
        className="notify-modal"
        show={true}
        onHide={() => props.setShowDialog(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div  className="modal-logo">
            <img src={logo} /> 
          </div>
          <Modal.Title>
            <div
            className="modal-title_"
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "#008FFF",
                fontSize: 18,
                marginTop: "4%",
                marginBottom: "4%",
              }}
            >
              {" "}
              TOKEN UPGRADE NOTIFICATION
            </div>
          </Modal.Title>
          </Modal.Body>
      </Modal>
    </>
  );
}

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return (
      <span>
         0 Day 00:00:00
      </span>
    );
  } else {
    // Render a countdown
    return (
      <span>
         {days} Day {hours>=10 ? hours :  "0" + hours  }:{minutes >=10 ? minutes : "0" + minutes     }:{seconds>= 10 ? seconds :  "0" +  seconds}
      </span>
    );
  }
};

export default NotificationDialog;

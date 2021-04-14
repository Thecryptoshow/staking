import React from "react";
import "../HomePageInnerDashboard/HomePageInnerDashboard.scss";
import { Button } from "react-bootstrap";

import Countdown from "react-countdown";
import showTokenAdd from "../../config/contractAddress/showTokenAdd";

import { FormattedMessage } from 'react-intl';

let dayLeft;
function setDate() {
  var launchDate = new Date("Mon, 22 Mar 2021 010:00:00 GMT").toUTCString();
  var currDate = new Date();
  let daysDiff =
    (new Date(launchDate).getTime() - currDate.getTime()) /
    (1000 * 60 * 60 * 24);
  let hoursDiff = (daysDiff - parseInt(daysDiff)) * 24;
  let minDiff = (hoursDiff - parseInt(hoursDiff)) * 60;
  let secDiff = (minDiff - parseInt(minDiff)) * 60;
  let milisec = (secDiff - parseInt(secDiff)) * 1000;
  const daysLeft = parseInt(daysDiff) * 24 * 60 * 60 * 1000;
  const hourLeft = parseInt(hoursDiff) * 60 * 60 * 1000;
  const minLeft = parseInt(minDiff) * 60 * 1000;
  const secLeft = parseInt(secDiff) * 1000;
  dayLeft = daysLeft + hourLeft + minLeft + secLeft + milisec;
}

class CountDown extends React.PureComponent {
  constructor(props) {
    super(props);
    setDate();
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="card-item minting-start">
          <div className="card-item-details single-card">
            <div className="card-item-price ms">
              <div className="block1">
                <h6><FormattedMessage id={'mintingStartsIn'} /> #5902715</h6>
                <h2>
                {/* Opening soon today ! */}
                  <Countdown
                    date={new Date().getTime() + dayLeft}
                    renderer={renderer}
                  />
                </h2>
              </div>
              <div 
                className="block2"
                style={{ marginRight: "5px" }}
                >
                <Button
                  block
                  variant="primary"
                  style={window.screen.width <= 768 ? { display: "none"} : null}
                  onClick={() =>
                    window.open(
                      `https://exchange.pancakeswap.finance/#/swap?outputCurrency=${showTokenAdd}`,
                      "_blank"
                    )
                  }
                >
                  <FormattedMessage id={'buySHOW'} />
                </Button>
                <FormattedMessage id={'getShowCreateLPInPanecakeSwap'} />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
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
export default CountDown;

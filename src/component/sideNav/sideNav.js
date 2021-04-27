import React, { useState, useEffect, useReducer } from "react";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import "./sideNav.scss";
import logoSHOW from "../../assets/images/show_token.png";

import {
  binanceMainNet,
  binanceTestNet,
  providerUrl,
  providerUrlForShowPrice,
} from "../../config/chainIds";

import {
  setMetaMask,
  setContract,
  deleteContract,
  deleteMetaMask,
  setApprovalForShow,
  setApprovalForLp,
  deleteApprovalForShow,
  deleteApprovalForLp,
  setDecimalsForShow,
  setDecimalsForLp,
  deleteDecimalsForShow,
  deleteDecimalsForLp,
  setValuesForShowPrice,
  setLPCirSupp,
  setTotalFarms,
  setTotalStakes,
  setAPYShow,
  setAPYLp,
} from "../../_actions/metaMaskActions";

import LpAbi from "../../config/abi/LpAbi";
import ShowAbi from "../../config/abi/ShowAbi";
import StakingAbi from "../../config/abi/StakingAbi";
import panCakeSwapAbi from "../../config/abi/panCakeSwapAbi";
import showBNBAbi from "../../config/abi/showBNBAbi";

import LPTokenAdd from "../../config/contractAddress/LPTokenAdd";
import showTokenAdd from "../../config/contractAddress/showTokenAdd";
import StakingContractAdd from "../../config/contractAddress/StakingContractAdd";
import pancakeSwapAdd from "../../config/contractAddress/pancakeSwapAdd";
import showBNBAdd from "../../config/contractAddress/showBNBAdd";
import ValueLoader from "../../component/ValueLoader/valueLoader";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { connect } from "react-redux";
//import insertComma from "../../utils/insertComma";

const Web3 = require("web3");

var showToggleCommunity = false;

const initialState = {
  bnbPriceDollar: "",
  showBNBPriceDollar: "",
  noOfShow: "",
  noOfBNB: "",

  noOfShow: 0,
  noOfBNB: 0,

  circulatingSuppLp: 0,

  totalFarms: 0,
  totalStakes: 0,
};

function reducer(state, action) {
  return { ...state, [action.key]: action.value };
}

const Side = (props) => {
  const [open, setOpen] = useState(true);
  const [selectedlink, setSelectedlink] = useState("Home");

  const [bnbPriceDollar, setBnbPriceDollar] = useState("");
  const [showBNBPriceDollar, setShowBNBPriceDollar] = useState("");

  const [count, setCount] = useState(0);

  const [state, dispatch] = useReducer(reducer, initialState);

  const parts = window.location.href.split("/");
  var myUrl = parts[parts.length - 1];
  function handleClose() {
    document.getElementById("mySidenav").classList.remove("showClass");
    document.getElementById("mySidenav").classList.add("hideClass");
    document.getElementById("overlay").classList.remove("overlay");
  }

  function changeSelectedTab(key) {
    setSelectedlink(key);
    document.getElementById("mySidenav").classList.remove("showClass");
    document.getElementById("mySidenav").classList.add("hideClass");
    document.getElementById("overlay").classList.remove("overlay");

    showToggleCommunity = false;
    // }
    props.changeSelectedTab(key);
  }

  useEffect(() => {
    let web3, web3ForShowPrice;
    if (
      Web3.givenProvider &&
      Web3.givenProvider.networkVersion === binanceMainNet &&
      Web3.givenProvider.networkVersion === binanceTestNet
    ) {
      web3 = new Web3(Web3.givenProvider);
    } else {
      web3 = new Web3(providerUrl);
    }

    web3ForShowPrice = new Web3(providerUrlForShowPrice);

    let lpContract = new web3.eth.Contract(LpAbi, LPTokenAdd);
    let showContract = new web3.eth.Contract(ShowAbi, showTokenAdd);
    let stakingContract = new web3.eth.Contract(
      StakingAbi,
      StakingContractAdd
    );
    let panCakeSwapContract = new web3ForShowPrice.eth.Contract(
      panCakeSwapAbi,
      pancakeSwapAdd
    );

    let showBNBReserveContract = new web3ForShowPrice.eth.Contract(
      showBNBAbi,
      showBNBAdd
    );

    let obj = {
      lpContract,
      showContract,
      stakingContract,
      panCakeSwapContract,
      showBNBReserveContract,
    };
    props.setContract(obj);
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 6000);

    getStatsWithOutMetaMask(obj);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    APR(props.contract, 3.99, 100, "LP");
    APR(props.contract, 3.99, 100, "SHOW");
    if (count !== 0) {
      getStatsWithOutMetaMask();
    }
  }, [count]);

  function APR(contract, tokenPerBlock, investment, For) {
    if (
      contract &&
      state.bnbPriceDollar &&
      state.showBNBPriceDollar &&
      state.noOfShow &&
      state.totalFarms &&
      state.circulatingSuppLp
    ) {
      contract.stakingContract.methods
        .ShowPerBlock()
        .call()
        .then((response) => {
          let res = parseInt(response) / Math.pow(10, 18);
          console.log("res for token per  block", res);
          let priceOfToken = state.bnbPriceDollar * state.showBNBPriceDollar;
          let TVL = 0;
          if (For === "SHOW") {
            // priceOfToken = props.bnbPriceDollar * props.showBNBPriceDollar;
            TVL = priceOfToken * (state.totalStakes / Math.pow(10, 18));
          } else {
            let totalTVL =
              state.bnbPriceDollar * state.showBNBPriceDollar * state.noOfShow +
              state.bnbPriceDollar * state.noOfBNB;
            let priceOfTokenForLP = totalTVL / state.circulatingSuppLp;
            TVL = priceOfTokenForLP * (state.totalFarms / Math.pow(10, 18));
          }
          const daysInMonth = 365;
          const blockPerDay = 28800;

          let valuePercentage;
          let price;
          let dailyAPR;
          let yearlyAPR;
          let investmentLocked;
          let APY;
          if (For == "LP") {
            // contract.lpContract.methods
            //   .balanceOf(StakingContractAdd)
            //   .call()
            //   .then((emissionRate) => {
                // console.log("emissionRate Lp", parseFloat(emissionRate));
                valuePercentage = (res * parseFloat(50)) / 100;
                var LPperDay = blockPerDay * valuePercentage;
                price = LPperDay * priceOfToken;
                // console.log(price);
                dailyAPR = (price / TVL) * 100;
                investmentLocked = investment;
                for (let i = 0; i < 365; i++) {
                  investment = (dailyAPR * investment) / 100 + investment;
                }
                APY = (investment / investmentLocked - 1) * 100;
                // console.log(APY);
                yearlyAPR = dailyAPR * 365;
                // console.log(yearlyAPR);
                if (APY !== Infinity) {
                  const APY_LP = isNaN(APY) ? 0 : APY;
                  const APR_LP = isNaN(yearlyAPR) ? 0 : yearlyAPR;

                  props.setAPYLp({
                    APY_LP,
                    APR_LP,
                    emissionRate: res,
                  });
                } else {
                  props.setAPYLp({
                    APY_LP: isNaN(APY) ? 0 : 0,
                    APR_LP: isNaN(yearlyAPR) ? 0 : yearlyAPR,
                    emissionRate: res,
                  });
                }
              // })
              // .catch((err) => {
              //   // console.log("err", err);
              // });
            // console.log(APY);
          } else if (For == "SHOW") {
            // contract.stakingContract.methods
            //   .showShare()
            //   .call()
            //   .then((emissionRate) => {
                // console.log("emissionRate Show", parseFloat(emissionRate));
                valuePercentage = (res * parseFloat(50)) / 100;
                console.log("value .....", valuePercentage);
                var SHOWperDay = blockPerDay * valuePercentage;
                price = SHOWperDay * priceOfToken;
                // console.log(price);
                dailyAPR = (price / TVL) * 100;
                console.log("Daily ....", dailyAPR);
                investmentLocked = investment;
                for (let i = 0; i < 365; i++) {
                  investment = (dailyAPR * investment) / 100 + investment;
                }
                APY = (investment / investmentLocked - 1) * 100;
                console.log("APY ....",APY, investment, dailyAPR, investmentLocked);
                yearlyAPR = dailyAPR * 365;
                // console.log("yearlyAPR", isNaN(yearlyAPR));
                if (APY !== Infinity) {
                  const APY_SHOW = isNaN(APY) ? 0 : APY;
                  const APR_SHOW = isNaN(yearlyAPR) ? 0 : yearlyAPR;
                  props.setAPYShow({
                    APY_SHOW,
                    APR_SHOW,
                    emissionRate: res,
                  });
                  
                } else {
                  const APY_SHOW = isNaN(APY) ? 0 : 0;
                  const APR_SHOW = isNaN(yearlyAPR) ? 0 : yearlyAPR;
                  props.setAPYShow({
                    APY_SHOW,
                    APR_SHOW,
                    emissionRate: res,
                  });
                  
                }
                // console.log(APY);
              // })
              // .catch((err) => {
              //   //console.log("err", err);
              // });
          }
        })
        .catch((err) => {
          // console.log("err", err);
        });
    }
  }

  function getStatsWithOutMetaMask(conObj) {
    const contract = props.contract ? props.contract : conObj;

    if (contract) {
      contract.panCakeSwapContract.methods
        .getReserves()
        .call()
        .then((res) => {
          const bnbPriceDollar = parseInt(res[1]) / parseInt(res[0]);
          contract.showBNBReserveContract.methods
            .getReserves()
            .call()
            .then((res) => {
              const showBNBPriceDollar = parseInt(res[0]) / parseInt(res[1]);
              dispatch({ key: "bnbPriceDollar", value: bnbPriceDollar });
              dispatch({
                key: "showBNBPriceDollar",
                value: showBNBPriceDollar,
              });
              dispatch({
                key: "noOfShow",
                value: parseInt(res[0]) / Math.pow(10, 18),
              });
              dispatch({
                key: "noOfBNB",
                value: parseInt(res[1]) / Math.pow(10, 18),
              });

              props.setValuesForShowPrice({
                bnbPriceDollar,
                showBNBPriceDollar,
                noOfShow: parseInt(res[0]) / Math.pow(10, 18),
                noOfBNB: parseInt(res[1]) / Math.pow(10, 18),
              });
            })
            .catch((err) => {
              //console.log("err", err);
            });
        })
        .catch((err) => {
          //console.log("err", err);
        });

      contract.showBNBReserveContract.methods
        .totalSupply()
        .call()
        .then((res) => {
          // console.log(
          //   "circulating supply LP",
          //   parseInt(res) / Math.pow(10, 18)
          // );
          dispatch({
            key: "circulatingSuppLp",
            value: parseInt(res) / Math.pow(10, 18),
          });
          props.setLPCirSupp(parseInt(res) / Math.pow(10, 18));
        })
        .catch((err) => {
          //console.log("err in LP CS", err);
        });

      contract.lpContract.methods
        .balanceOf(StakingContractAdd)
        .call()
        .then((res) => {
          // console.log("totalFarms in nav", typeof res, res);
          dispatch({
            key: "totalFarms",
            value: parseInt(res),
          });
          props.setTotalFarms(parseInt(res));
        })
        .catch((err) => {
          //console.log("err totalFarms in nav", err);
        });
      contract.stakingContract.methods
        .totalStaked()
        .call()
        .then((res) => {
          dispatch({
            key: "totalStakes",
            value: parseInt(res),
          });
          props.setTotalStakes(parseInt(res));
        })
        .catch((err) => {
          // console.log("err totalStakes in sidenav", err);
        });
    }
  }

  
  // setTimeout(() => {
  //   if (
  //     (props.location.pathname.includes("/market-") || props.location.pathname.includes("/item-sell")) || 
  //     (props.location.pathname === "/" &&
  //       window.innerWidth >= 930 &&
  //       window.innerWidth <= 1120)
  //   ) {
  //     document.getElementById("mySidenav").classList.add("mobile-sidebar");
  //   } else {
  //     document.getElementById("mySidenav").classList.remove("mobile-sidebar");
  //   }
  // }, 700);
  return (
    <>
      <div id="overlay" onClick={handleClose} className="overlay"></div>

      <div id="mySidenav" className="sidenav hideClass">
        <div>
          <ul className="sidebar-links">
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip
                  style={
                    props.location.pathname.includes("/market-")
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  Home
                </Tooltip>
              }
            >
              <li className={myUrl === "" ? "active" : null}>
                <NavLink to="/" onClick={() => changeSelectedTab("Home")}>
                  <span>
                    <svg width="23" height="23" viewBox="0 0 70 70">
                      <defs>
                        <clipPath id="clip-Home">
                          <rect width="70" height="70" />
                        </clipPath>
                      </defs>
                      <g id="Home" clipPath="url(#clip-Home)">
                        <path
                          id="home_1_"
                          data-name="home (1)"
                          d="M68.62,30.446l-.005-.005L40.057,1.887a6.445,6.445,0,0,0-9.115,0L2.4,30.426l-.029.029A6.441,6.441,0,0,0,6.66,41.435c.066.006.132.01.2.01H8V62.457A7.551,7.551,0,0,0,15.54,70H26.713a2.051,2.051,0,0,0,2.051-2.051V51.474a3.445,3.445,0,0,1,3.442-3.441H38.8a3.445,3.445,0,0,1,3.441,3.441V67.949A2.051,2.051,0,0,0,44.287,70H55.46A7.551,7.551,0,0,0,63,62.457V41.444h1.055a6.445,6.445,0,0,0,4.561-11Zm-2.9,6.21a2.329,2.329,0,0,1-1.657.687H60.952A2.051,2.051,0,0,0,58.9,39.394V62.457A3.445,3.445,0,0,1,55.46,65.9H46.338V51.474A7.551,7.551,0,0,0,38.8,43.932h-6.59a7.552,7.552,0,0,0-7.544,7.543V65.9H15.54a3.445,3.445,0,0,1-3.441-3.44V39.394a2.051,2.051,0,0,0-2.051-2.051H6.995l-.1,0a2.34,2.34,0,0,1-1.614-4h0l0,0L33.844,4.787a2.342,2.342,0,0,1,3.313,0l28.55,28.546.013.013a2.348,2.348,0,0,1,0,3.31Zm0,0"
                          transform="translate(-0.5 0.001)"
                        />
                      </g>
                    </svg>
                  </span>{" "}
                  <span style={{ paddingTop: "2px" }}>
                    <FormattedMessage id={"home"} />
                  </span>
                </NavLink>
              </li>
            </OverlayTrigger>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip
                  style={
                    props.location.pathname.includes("/market-")
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  Farm
                </Tooltip>
              }
            >
              <li className={myUrl === "farm" ? "active" : null}>
                <NavLink to="/farm" onClick={() => changeSelectedTab("Form")}>
                  <span>
                    <svg width="23" height="23" viewBox="0 0 70 70">
                      <defs>
                        <clipPath id="clip-Farm_">
                          <rect width="70" height="70" />
                        </clipPath>
                      </defs>
                      <g
                        id="Farm_"
                        data-name="Farm "
                        clipPath="url(#clip-Farm_)"
                      >
                        <g id="seed" transform="translate(0.491 -23.587)">
                          <path
                            id="Path_243"
                            data-name="Path 243"
                            d="M69.358,59.555a8.732,8.732,0,0,0-12.274,0l-.041.04a4.6,4.6,0,0,1-6.471,0l-.036-.035a8.732,8.732,0,0,0-12.274,0l-.041.04a4.547,4.547,0,0,1-1.169.84V47.052c4.794-.361,8.6-2.02,11.341-4.945,4.878-5.211,4.4-12.476,4.38-12.783l-.129-1.756-1.769-.128c-.309-.022-7.626-.494-12.874,4.349a14.433,14.433,0,0,0-3,3.924,14.432,14.432,0,0,0-3-3.924c-5.248-4.844-12.565-4.372-12.874-4.349l-1.769.128-.129,1.756c-.023.307-.5,7.572,4.38,12.783,2.738,2.925,6.547,4.584,11.341,4.945V60.444a4.568,4.568,0,0,1-1.194-.854l-.036-.035a8.732,8.732,0,0,0-12.274,0l-.041.04a4.595,4.595,0,0,1-6.47,0l-.036-.035a8.732,8.732,0,0,0-12.274,0L0,60.173v29.3H70V60.191ZM39.312,73.26c0,1.485-.56,3.977-4.312,3.977s-4.312-2.492-4.312-3.977c0-1.736,2.236-4.322,4.31-6.115C36.883,68.782,39.312,71.4,39.312,73.26ZM40.775,34.8a13.552,13.552,0,0,1,7.844-3.224,13.281,13.281,0,0,1-3.232,7.757,12.492,12.492,0,0,1-8.232,3.62A12.34,12.34,0,0,1,40.775,34.8ZM24.636,39.355a13.353,13.353,0,0,1-3.247-7.789A13.478,13.478,0,0,1,29.2,34.776a12.327,12.327,0,0,1,3.645,8.175A12.507,12.507,0,0,1,24.636,39.355ZM65.893,85.394H4.107V61.95a4.6,4.6,0,0,1,5.885.489l.041.04a8.722,8.722,0,0,0,12.269,0l.045-.045a4.6,4.6,0,0,1,6.466,0l.041.04a8.633,8.633,0,0,0,3.04,1.954c-2.153,1.932-5.312,5.359-5.312,8.827,0,4.818,3.383,8.055,8.419,8.055s8.419-3.237,8.419-8.055c0-3.471-3.164-6.9-5.317-8.832a8.615,8.615,0,0,0,3.02-1.945l.045-.045a4.6,4.6,0,0,1,6.466,0l.041.04a8.73,8.73,0,0,0,12.269,0l.045-.045a4.6,4.6,0,0,1,5.905-.474Z"
                            transform="translate(0 0)"
                          />
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span style={{ paddingTop: "2px" }}>
                    <FormattedMessage id={"farm"} />
                  </span>
                </NavLink>
              </li>
            </OverlayTrigger>            
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip
                  style={
                    props.location.pathname.includes("/market-")
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  Game
                </Tooltip>
              }
            >
              <li className={myUrl === "game" ? "active" : null}>
                <NavLink to="/game" onClick={() => changeSelectedTab("Form")}>
                  <span>
                    <svg width="23" height="23" viewBox="0 0 70 70">
                      <defs>
                        <clipPath id="clip-Farm_">
                          <rect width="70" height="70" />
                        </clipPath>
                      </defs>
                      <g
                        id="Game_"
                        data-name="Game "
                        clipPath="url(#clip-Farm_)"
                      >
                        <g id="seed" transform="translate(0.491 -23.587)">
                          <path
                            id="Path_243"
                            data-name="Path 243"
                            d="M69.358,59.555a8.732,8.732,0,0,0-12.274,0l-.041.04a4.6,4.6,0,0,1-6.471,0l-.036-.035a8.732,8.732,0,0,0-12.274,0l-.041.04a4.547,4.547,0,0,1-1.169.84V47.052c4.794-.361,8.6-2.02,11.341-4.945,4.878-5.211,4.4-12.476,4.38-12.783l-.129-1.756-1.769-.128c-.309-.022-7.626-.494-12.874,4.349a14.433,14.433,0,0,0-3,3.924,14.432,14.432,0,0,0-3-3.924c-5.248-4.844-12.565-4.372-12.874-4.349l-1.769.128-.129,1.756c-.023.307-.5,7.572,4.38,12.783,2.738,2.925,6.547,4.584,11.341,4.945V60.444a4.568,4.568,0,0,1-1.194-.854l-.036-.035a8.732,8.732,0,0,0-12.274,0l-.041.04a4.595,4.595,0,0,1-6.47,0l-.036-.035a8.732,8.732,0,0,0-12.274,0L0,60.173v29.3H70V60.191ZM39.312,73.26c0,1.485-.56,3.977-4.312,3.977s-4.312-2.492-4.312-3.977c0-1.736,2.236-4.322,4.31-6.115C36.883,68.782,39.312,71.4,39.312,73.26ZM40.775,34.8a13.552,13.552,0,0,1,7.844-3.224,13.281,13.281,0,0,1-3.232,7.757,12.492,12.492,0,0,1-8.232,3.62A12.34,12.34,0,0,1,40.775,34.8ZM24.636,39.355a13.353,13.353,0,0,1-3.247-7.789A13.478,13.478,0,0,1,29.2,34.776a12.327,12.327,0,0,1,3.645,8.175A12.507,12.507,0,0,1,24.636,39.355ZM65.893,85.394H4.107V61.95a4.6,4.6,0,0,1,5.885.489l.041.04a8.722,8.722,0,0,0,12.269,0l.045-.045a4.6,4.6,0,0,1,6.466,0l.041.04a8.633,8.633,0,0,0,3.04,1.954c-2.153,1.932-5.312,5.359-5.312,8.827,0,4.818,3.383,8.055,8.419,8.055s8.419-3.237,8.419-8.055c0-3.471-3.164-6.9-5.317-8.832a8.615,8.615,0,0,0,3.02-1.945l.045-.045a4.6,4.6,0,0,1,6.466,0l.041.04a8.73,8.73,0,0,0,12.269,0l.045-.045a4.6,4.6,0,0,1,5.905-.474Z"
                            transform="translate(0 0)"
                          />
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span style={{ paddingTop: "2px" }}>
                    <FormattedMessage id={"game"} />
                  </span>
                </NavLink>
              </li>
            </OverlayTrigger>            
            
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip
                  style={
                    props.location.pathname.includes("/market-")
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  Doc
                </Tooltip>
              }
            >
              <li className={myUrl === "Doc" ? "" : null}>
                <a
                  onClick={() =>
                    window.open("#")
                  }
                  to=""
                  //target="_blank"
                >
                  <span>
                    <svg width="23" height="23" viewBox="0 0 70 70">
                      <defs>
                        <clipPath id="clip-Docs_">
                          <rect width="70" height="70" />
                        </clipPath>
                      </defs>
                      <g
                        id="Docs_"
                        data-name="Docs "
                        clipPath="url(#clip-Docs_)"
                      >
                        <g
                          id="google-docs_1_"
                          data-name="google-docs (1)"
                          transform="translate(-52 0)"
                        >
                          <path
                            id="Path_225"
                            data-name="Path 225"
                            d="M113.137,17.007,96.912.6A2.02,2.02,0,0,0,95.478,0H67.084A6.126,6.126,0,0,0,61,6.152v57.7A6.126,6.126,0,0,0,67.084,70h40.563a6.126,6.126,0,0,0,6.084-6.152V18.457A2.081,2.081,0,0,0,113.137,17.007ZM97.506,7l9.3,9.4H99.534a2.042,2.042,0,0,1-2.028-2.051Zm10.141,58.9H67.084a2.042,2.042,0,0,1-2.028-2.051V6.152A2.042,2.042,0,0,1,67.084,4.1H93.45V14.355a6.126,6.126,0,0,0,6.084,6.152h10.141v43.34A2.042,2.042,0,0,1,107.647,65.9Z"
                            transform="translate(0 0)"
                          />
                          <path
                            id="Path_226"
                            data-name="Path 226"
                            d="M177.366,212H153.028a2.028,2.028,0,1,0,0,4.056h24.338a2.028,2.028,0,1,0,0-4.056Z"
                            transform="translate(-77.831 -182.996)"
                          />
                          <path
                            id="Path_227"
                            data-name="Path 227"
                            d="M177.366,272H153.028a2.028,2.028,0,0,0,0,4.056h24.338a2.028,2.028,0,0,0,0-4.056Z"
                            transform="translate(-77.831 -234.787)"
                          />
                          <path
                            id="Path_228"
                            data-name="Path 228"
                            d="M177.366,332H153.028a2.028,2.028,0,0,0,0,4.056h24.338a2.028,2.028,0,0,0,0-4.056Z"
                            transform="translate(-77.831 -286.578)"
                          />
                          <path
                            id="Path_229"
                            data-name="Path 229"
                            d="M169.253,392H153.028a2.028,2.028,0,0,0,0,4.056h16.225a2.028,2.028,0,0,0,0-4.056Z"
                            transform="translate(-77.831 -338.369)"
                          />
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span style={{ paddingTop: "2px" }}>
                    <FormattedMessage id={"doc"} />
                  </span>
                </a>
              </li>
            </OverlayTrigger>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip
                  style={
                    props.location.pathname.includes("/market-")
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  Community
                </Tooltip>
              }
            >
              <li className="community-link">
                <a
                  className={selectedlink}
                  onClick={() => changeSelectedTab("Community")}
                >
                  <span>
                    <svg width="23" height="23" viewBox="0 0 70 70">
                      <defs>
                        <clipPath id="clip-Community_">
                          <rect width="70" height="70" />
                        </clipPath>
                      </defs>
                      <g
                        id="Community_"
                        data-name="Community "
                        clipPath="url(#clip-Community_)"
                      >
                        <g id="care" transform="translate(0 0)">
                          <path
                            id="Path_237"
                            data-name="Path 237"
                            d="M22.114,144.991a10.6,10.6,0,0,0-9.672-2.831V128.221a6.221,6.221,0,1,0-12.441,0v22.454a11.694,11.694,0,0,0,3.458,8.272l9.7,9.576v4.747a2.051,2.051,0,0,0,2.051,2.051H30.9a2.051,2.051,0,0,0,2.051-2.051V159.438a8.946,8.946,0,0,0-2.629-6.31Zm6.734,26.228H17.264v-3.554a2.051,2.051,0,0,0-.61-1.46L6.339,156.027A7.566,7.566,0,0,1,4.1,150.674V128.221a2.119,2.119,0,0,1,4.238,0v15.786a10.587,10.587,0,0,0-1.177,1.016,2.051,2.051,0,0,0,0,2.9l9.229,9.229a2.051,2.051,0,1,0,2.9-2.9l-7.543-7.543a6.511,6.511,0,0,1,7.477,1.2l8.206,8.137a4.816,4.816,0,0,1,1.416,3.4v11.78Z"
                            transform="translate(0 -105.32)"
                          />
                          <path
                            id="Path_238"
                            data-name="Path 238"
                            d="M297.728,122a6.228,6.228,0,0,0-6.221,6.221V142.16a10.6,10.6,0,0,0-9.672,2.831l-8.206,8.137a8.944,8.944,0,0,0-2.629,6.31V173.27a2.051,2.051,0,0,0,2.051,2.051h15.685a2.051,2.051,0,0,0,2.051-2.051v-4.747l9.7-9.576a11.694,11.694,0,0,0,3.458-8.272V128.221A6.228,6.228,0,0,0,297.728,122Zm2.119,28.674a7.566,7.566,0,0,1-2.238,5.352L287.3,166.205a2.051,2.051,0,0,0-.61,1.46v3.554H275.1V159.438a4.816,4.816,0,0,1,1.416-3.4l8.206-8.137a6.51,6.51,0,0,1,7.477-1.2l-7.543,7.543a2.051,2.051,0,0,0,2.9,2.9l9.229-9.229a2.051,2.051,0,0,0,0-2.9,10.617,10.617,0,0,0-1.177-1.016V128.221a2.119,2.119,0,0,1,4.238,0Z"
                            transform="translate(-233.949 -105.32)"
                          />
                          <path
                            id="Path_239"
                            data-name="Path 239"
                            d="M168.051,34.863h20.508a2.051,2.051,0,0,0,2.051-2.051V26.66a12.325,12.325,0,0,0-7.952-11.509,8.2,8.2,0,1,0-8.705,0A12.325,12.325,0,0,0,166,26.66v6.152A2.051,2.051,0,0,0,168.051,34.863ZM178.3,4.1a4.1,4.1,0,1,1-4.1,4.1A4.106,4.106,0,0,1,178.3,4.1ZM170.1,26.66a8.2,8.2,0,0,1,16.406,0v4.1H170.1Z"
                            transform="translate(-143.305)"
                          />
                        </g>
                      </g>
                      {/* </g> */}
                    </svg>
                  </span>
                  <span style={{ paddingTop: "2px" }}>
                    <FormattedMessage id={"community"} />
                  </span>
                  <span className="drop-down-community">
                    {/* <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15">
                  <defs>
                    <clipPath id="clip-Down">
                      <rect width="16" height="15"/>
                    </clipPath>
                  </defs>
                  <g id="Down" clipPath="url(#clip-Down)">
                    <path id="XMLID_19_" d="M.689,0,0,.689,7.237,7.927,0,15.164l.689.689L8.616,7.927Z" transform="translate(15.853 3) rotate(90)"/>
                  </g>
                </svg> */}
                    <svg width="16" height="15" viewBox="0 0 16 15">
                      <defs>
                        <clipPath id="clip-Down">
                          <rect width="16" height="15" />
                        </clipPath>
                      </defs>
                      <g id="Down" clipPath="url(#clip-Down)">
                        <path
                          id="XMLID_19_"
                          d="M.689,0,0,.689,7.237,7.927,0,15.164l.689.689L8.616,7.927Z"
                          transform="translate(15.853 3) rotate(90)"
                        />
                      </g>
                    </svg>
                  </span>
                </a>
              </li>
            </OverlayTrigger>
          </ul>
          <CommunityLinks />
        </div>
        <div
          className={
            // props.location.pathname.includes("market") ||
            props.location.pathname === "/" &&
            window.innerWidth >= 920 &&
            window.innerWidth <= 1120
              ? "bottom-price small-header-hide"
              : "bottom-price"
          }
        >
          <div
            className="bottom-price-show"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img src={logoSHOW} />
            <div style={{ marginTop: 5 }}>
              {/* ${" "}
              {isNaN(props.bnbPriceDollar * props.showBNBPriceDollar)
                ? "0.00"
                : (props.bnbPriceDollar * props.showBNBPriceDollar).toFixed(4)} */}
              {!(props.bnbPriceDollar && props.showBNBPriceDollar) ? (
                <ValueLoader />
              ) : isNaN(props.bnbPriceDollar * props.showBNBPriceDollar) ? (
                "$0.00"
              ) : (
                "$" +
                (props.bnbPriceDollar * props.showBNBPriceDollar).toFixed(4)
              )}
            </div>
          </div>

          <div className="social-links pl-4">
            
            <a
              onClick={() => {
                showToggleCommunity = false;
              }}
              target="_blank"
              href="https://twitter.com"
            >
              <span>
                <svg
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 512 512"
                >
                  <g>
                    <g>
                      <path
                        d="M512,97.248c-19.04,8.352-39.328,13.888-60.48,16.576c21.76-12.992,38.368-33.408,46.176-58.016
                      c-20.288,12.096-42.688,20.64-66.56,25.408C411.872,60.704,384.416,48,354.464,48c-58.112,0-104.896,47.168-104.896,104.992
                      c0,8.32,0.704,16.32,2.432,23.936c-87.264-4.256-164.48-46.08-216.352-109.792c-9.056,15.712-14.368,33.696-14.368,53.056
                      c0,36.352,18.72,68.576,46.624,87.232c-16.864-0.32-33.408-5.216-47.424-12.928c0,0.32,0,0.736,0,1.152
                      c0,51.008,36.384,93.376,84.096,103.136c-8.544,2.336-17.856,3.456-27.52,3.456c-6.72,0-13.504-0.384-19.872-1.792
                      c13.6,41.568,52.192,72.128,98.08,73.12c-35.712,27.936-81.056,44.768-130.144,44.768c-8.608,0-16.864-0.384-25.12-1.44
                      C46.496,446.88,101.6,464,161.024,464c193.152,0,298.752-160,298.752-298.688c0-4.64-0.16-9.12-0.384-13.568
                      C480.224,136.96,497.728,118.496,512,97.248z"
                      />
                    </g>
                  </g>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const Sidebar = withRouter(Side);

const mapDispatchToProps = {
  setMetaMask,
  setContract,
  deleteContract,
  deleteMetaMask,

  setApprovalForShow,
  setApprovalForLp,
  setDecimalsForShow,
  setDecimalsForLp,
  deleteApprovalForShow,
  deleteApprovalForLp,
  deleteDecimalsForShow,
  deleteDecimalsForLp,

  setValuesForShowPrice,
  setLPCirSupp,

  setTotalStakes,
  setTotalFarms,

  setAPYShow,
  setAPYLp,
};

const mapStateToProps = (state, ownProps) => {
  return {
    metaMaskAddress: state.metaMaskReducer.metaMaskAddress,
    contract: state.metaMaskReducer.contract,
    bnbPriceDollar: state.metaMaskReducer.bnbPriceDollar,
    showBNBPriceDollar: state.metaMaskReducer.showBNBPriceDollar,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

function CommunityLinks() {
  return (
    <ul className="sidebar-links subNav">
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip
            style={
              window.location.hash.includes("/market-")
                ? { display: "block" }
                : { display: "none" }
            }
          >
            Twitter
          </Tooltip>
        }
      >
        <li style={{ fontSize: "1.1em", fontWeight: "bold" }}>
          <a
            onClick={() => {
              showToggleCommunity = false;
            }}
            className="nav-icon"
            target="_blank"
            href="https://twitter.com/"
          >
            <span>
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
              >
                <g>
                  <g>
                    <path
                      d="M512,97.248c-19.04,8.352-39.328,13.888-60.48,16.576c21.76-12.992,38.368-33.408,46.176-58.016
                      c-20.288,12.096-42.688,20.64-66.56,25.408C411.872,60.704,384.416,48,354.464,48c-58.112,0-104.896,47.168-104.896,104.992
                      c0,8.32,0.704,16.32,2.432,23.936c-87.264-4.256-164.48-46.08-216.352-109.792c-9.056,15.712-14.368,33.696-14.368,53.056
                      c0,36.352,18.72,68.576,46.624,87.232c-16.864-0.32-33.408-5.216-47.424-12.928c0,0.32,0,0.736,0,1.152
                      c0,51.008,36.384,93.376,84.096,103.136c-8.544,2.336-17.856,3.456-27.52,3.456c-6.72,0-13.504-0.384-19.872-1.792
                      c13.6,41.568,52.192,72.128,98.08,73.12c-35.712,27.936-81.056,44.768-130.144,44.768c-8.608,0-16.864-0.384-25.12-1.44
                      C46.496,446.88,101.6,464,161.024,464c193.152,0,298.752-160,298.752-298.688c0-4.64-0.16-9.12-0.384-13.568
                      C480.224,136.96,497.728,118.496,512,97.248z"
                    />
                  </g>
                </g>
              </svg>
            </span>
            <span style={{ paddingTop: "2px" }}>
              <FormattedMessage id={"twitter"} />
            </span>
          </a>
        </li>
      </OverlayTrigger>
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip
            style={
              window.location.hash.includes("/market-")
                ? { display: "block" }
                : { display: "none" }
            }
          >
            Telegram
          </Tooltip>
        }
      >
        <li style={{ fontSize: "1.1em", fontWeight: "bold" }}>
          <a
            onClick={() => {
              showToggleCommunity = false;
            }}
            className="nav-icon"
            target="_blank"
            href="https://t.me/"
          >
            <span>
              <svg
                id="Bold"
                enableBackground="new 0 0 24 24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218z" />
              </svg>
            </span>
            <span style={{ paddingTop: "2px" }}>
              <FormattedMessage id={"telegram"} />
            </span>
          </a>
        </li>
      </OverlayTrigger>
      </ul>
  );
}

function MarketLinks(props) {
  return (
    <ul className={"sidebar-links subNav " + props.cls}>
      <li style={{ fontSize: "1.1em", fontWeight: "bold" }}>
        <a
          onClick={() => {
            showToggleCommunity = false;
          }}
          className="nav-icon"
          target="_blank"
          href="https://twitter.com/"
        >
          <span>
            <svg
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
            >
              <g>
                <g>
                  <path
                    d="M512,97.248c-19.04,8.352-39.328,13.888-60.48,16.576c21.76-12.992,38.368-33.408,46.176-58.016
                      c-20.288,12.096-42.688,20.64-66.56,25.408C411.872,60.704,384.416,48,354.464,48c-58.112,0-104.896,47.168-104.896,104.992
                      c0,8.32,0.704,16.32,2.432,23.936c-87.264-4.256-164.48-46.08-216.352-109.792c-9.056,15.712-14.368,33.696-14.368,53.056
                      c0,36.352,18.72,68.576,46.624,87.232c-16.864-0.32-33.408-5.216-47.424-12.928c0,0.32,0,0.736,0,1.152
                      c0,51.008,36.384,93.376,84.096,103.136c-8.544,2.336-17.856,3.456-27.52,3.456c-6.72,0-13.504-0.384-19.872-1.792
                      c13.6,41.568,52.192,72.128,98.08,73.12c-35.712,27.936-81.056,44.768-130.144,44.768c-8.608,0-16.864-0.384-25.12-1.44
                      C46.496,446.88,101.6,464,161.024,464c193.152,0,298.752-160,298.752-298.688c0-4.64-0.16-9.12-0.384-13.568
                      C480.224,136.96,497.728,118.496,512,97.248z"
                  />
                </g>
              </g>
            </svg>
          </span>
          <span style={{ paddingTop: "2px" }}>
            <FormattedMessage id={"twitter"} />
          </span>
        </a>
      </li>
      <li style={{ fontSize: "1.1em", fontWeight: "bold" }}>
        <a
          onClick={() => {
            showToggleCommunity = false;
          }}
          className="nav-icon"
          target="_blank"
          href="https://telegram.org/"
        >
          <span>
            <svg
              id="Bold"
              enableBackground="new 0 0 24 24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m9.417 15.181-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218z" />
            </svg>
          </span>
          <span style={{ paddingTop: "2px" }}>
            <FormattedMessage id={"telegram"} />
          </span>
        </a>
      </li>
    </ul>
  );
}

/**
 * HomePage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from "react";
import "../HomePageInnerDashboard/HomePageInnerDashboard.scss";
//import CountUp from "react-countup";
import { Button, Modal } from "react-bootstrap";

import logoV2 from "../../assets/images/show_token.png";
//import pandaPic from "../../assets/images/image-01.png";
import path_img from "../../assets/images/path_img.png";
import iconshowbng from "../../assets/images/showbnb.png";

// import sampleAbi from "../../config/abi/sample";
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

import { connect } from "react-redux";

import checkWalletConnection from "../../utils/checkWalletConnection";

import { showNotification } from "../../component/Notifications/showNotification";
//import LoadingDialog from "../../component/loadingDialog/loadingDialog";
import { FormattedMessage } from "react-intl";
// import Slider from '../Slider/slider';
// import cardImage from '../../assets/images/image-01.png';
// import logoSHOW from "../../assets/images/show_token.png";
import {
  binanceMainNet,
  binanceTestNet,
  providerUrl,
  providerUrlForShowPrice,
} from "../../config/chainIds";
import { isStaging } from "../../config/stagingSetup";
import ValueLoader from "../../component/ValueLoader/valueLoader";
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
  setTransactionInProgress,
} from "../../_actions/metaMaskActions";

import {
  getShowAllowance,
  getLpAllowance,
} from "../../contractCalls/allowance";

import insertComma from "../../utils/insertComma";
import { showActualValue } from "../../utils/showActualValue";
//import CountDown from "./countDown";

const Web3 = require("web3");

//var dayLeft = 1000 * 60 * 60 * 24 * 10;

class HomeChild extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "Form",
      showModel: false,

      lpReward: 0,
      showReward: 0,

      farmRewards: 0,
      stakeRewards: 0,

      circulatingSupply: "",
      totalSupply: "0",

      loading: false,
      mainHeading: "",
      msg: "",
      subMsg: "",
      forLoading: false,
      forSuccess: false,

      count: 0,

      bnbPriceDollar: "",
      showBNBPriceDollar: "",

      noOfBNB: 0,
      noOfShow: 0,
      loadingFor: "",

      tvlForLp: "0.00",
      tvlForShow: "0.00",
      transactionInProgress: false,

      APY_SHOW: "",
      APY_LP: "",

      APR_SHOW: "",
      APR_LP: "",
    };
  }

  setDecimalsAndApproval(contract, metaMaskAddress) {
    getLpAllowance(metaMaskAddress, contract, this.props.setApprovalForLp);
    getShowAllowance(metaMaskAddress, contract, this.props.setApprovalForShow);
  }

  componentDidMount() {
    // this.APR(0.4, 100, "LP");
    // this.APR(0.4, 100, "SHOW");

    this.intervalId = setInterval(this.timer.bind(this), 6000);
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
    let stakingContract = new web3.eth.Contract(StakingAbi, StakingContractAdd);
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

    this.getStatsWithOutMetaMask(obj);
    this.props.setContract(obj);
    if (this.props.contract && this.props.metaMaskAddress) {
      this.getStats();
    }
  }

  changeSelectedTab(key) {
    this.setState({ selectedTab: key });
  }

  timer() {
    this.setState({ count: this.state.count + 1 });
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
  getStatsWithOutMetaMask(conObj) {
    const contract = this.props.contract ? this.props.contract : conObj;

    contract.showContract.methods
      .totalSupply()
      .call()
      .then((res) => {
        console.log("total supply", typeof res, res);
        this.setState({
          // totalSupply: (parseInt(res) / Math.pow(10, 18)).toFixed(2),
          totalSupply: 90000000,
          circulatingSupply: (parseInt(res) / Math.pow(10, 18)).toFixed(2),
        });
      })
      .catch((err) => {
        // console.log("err in total supply", err);
      });
    contract.panCakeSwapContract.methods
      .getReserves()
      .call()
      .then((res) => {
        console.log("pan cake swap", parseInt(res[1]), " ", parseInt(res[0]));
        const bnbPriceDollar = parseInt(res[1]) / parseInt(res[0]);
        console.log("bnb dollor", bnbPriceDollar);
        this.setState({
          bnbPriceDollar: bnbPriceDollar,
        });
      })
      .catch((err) => {
        //console.log("err bnb price", err);
      });
    contract.showBNBReserveContract.methods
      .getReserves()
      .call()
      .then((res) => {
        const showBNBPriceDollar = parseInt(res[1]) / parseInt(res[0]);
        console.log("no of show", res[1]);
        console.log("no of bnb", res[0]);
        console.log("price ", showBNBPriceDollar);

        this.setState({
          showBNBPriceDollar: showBNBPriceDollar,
          noOfShow: parseInt(res[0]) / Math.pow(10, 18),
          noOfBNB: parseInt(res[1]) / Math.pow(10, 18),
        });
      })
      .catch((err) => {
        //console.log("err showBNBPriceDollar", err);
      });
  }

  getStats() {
    this.props.contract.stakingContract.methods
      // .lpStakeReward(this.props.metaMaskAddress)
      .pendingShow("1",this.props.metaMaskAddress)
      .call()
      .then((res) => {
        // console.log("lpStakeReward", typeof res, res);
        this.setState({
          lpReward: parseInt(res) / Math.pow(10, 18),
        });
      })
      .catch((err) => {
        //console.log("err for getting lpStakeReward", err);
      });

    this.props.contract.stakingContract.methods
      .pendingShow("1",this.props.metaMaskAddress)
      .call()
      .then((res) => {
        // console.log("farmRewards lp", typeof res, res);
        this.setState({
          farmRewards: parseInt(res) / Math.pow(10, 18),
        });
      })
      .catch((err) => {
        //console.log("err", err);
      });

    this.props.contract.stakingContract.methods
      // .showStakeReward(this.props.metaMaskAddress)
      .pendingShow("0",this.props.metaMaskAddress)
      .call()
      .then((res) => {
        // console.log("showStakeReward", typeof res, res);
        this.setState({
          showReward: parseInt(res) / Math.pow(10, 18),
        });
      })
      .catch((err) => {
        //console.log("err for getting showStakeReward", err);
      });

    this.props.contract.stakingContract.methods
      .pendingShow("0",this.props.metaMaskAddress)
      .call()
      .then((res) => {
        // console.log("stakeReward show", typeof res, res);
        this.setState({
          stakeRewards: parseInt(res) / Math.pow(10, 18),
        });
      })
      .catch((err) => {
        //console.log("err", err);
      });

    this.getStatsWithOutMetaMask();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.count !== prevState.count &&
      this.props.contract &&
      this.props.metaMaskAddress
    ) {
      this.getStats();
    }

    if (this.state.count !== prevState.count) {
      // this.APR(5, 100, "LP");
      // this.APR(5, 100, "SHOW");
    } else if (
      this.state.count !== prevState.count &&
      this.props.contract &&
      this.props.metaMaskAddress === ""
    ) {
      this.getStatsWithOutMetaMask();
    }

    if (
      this.props.metaMaskAddress === "" &&
      this.props.metaMaskAddress !== prevProps.metaMaskAddress
    ) {
      this.setState({
        lpReward: 0,
        showReward: 0,
        farmRewards: 0,
        stakeRewards: 0,
      });
    }
  }

  handleInProgressTransaction() {
    showNotification(
      document.getElementById("transactionInProgress").innerHTML,
      document.getElementById("transactiobInProcess").innerHTML,
      "info",
      3000
    );
  }

  handleHarvest(selectedTab, loaderType) {
    if (this.props.transactionInProgress) {
      this.handleInProgressTransaction();
      return;
    }
    if (
      checkWalletConnection(this.props.contract, this.props.metaMaskAddress)
    ) {
      // this.showConfirmationDialog();
      this.setState({ loadingFor: loaderType });
      var web3 = new Web3(this.props.provider);
      let stakingContract = new web3.eth.Contract(
        StakingAbi,
        StakingContractAdd
      );
      web3.eth
        .getAccounts()
        .then((acc) => {
          if (selectedTab === "showbnb") {
            this.props.setTransactionInProgress(true);
            stakingContract.methods
              .harvest("1")
              .send({ from: acc[0] })
              .then((res) => {
                this.props.setTransactionInProgress(false);
                this.handleSuccessResponse(res);
                this.setState({ loadingFor: "" });
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
              })
              .catch((err) => {
                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
                this.setState({ loadingFor: "" });
              });
          } else if (selectedTab === "show") {
            this.props.setTransactionInProgress(true);
            stakingContract.methods
              .harvest("0")
              .send({ from: acc[0] })
              .then((res) => {
                this.props.setTransactionInProgress(false);
                this.handleSuccessResponse(res);
                this.setState({ loadingFor: "" });
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
              })

              .catch((err) => {
                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
                this.setState({ loadingFor: "" });
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
              });
          }
        })
        .catch((err) => {
          this.props.setTransactionInProgress(false);
          this.handleErrorAccount(err);
          this.setState({ loadingFor: "" });
          this.setDecimalsAndApproval(
            this.props.contract,
            this.props.metaMaskAddress
          );
        });
    }
  }

  showConfirmationDialog() {
    this.setState({
      loading: true,
      mainHeading: "Waiting For Confirmation",
      msg: "",
      subMsg: "Confirm your transaction in your wallet",
      forLoading: true,
      forSuccess: false,
    });
  }

  handleSuccessResponse(res) {
    //console.log("res", res);
    // this.setState({
    //   loading: true,
    //   mainHeading: "Transaction Submitted",
    //   msg: "Your transaction has been completed.",
    //   subMsg: "",
    //   forLoading: false,
    //   forSuccess: true,
    // });
    // showNotification(
    //   document.getElementById("success").innerHTML,
    //   document.getElementById("tansactionSuccessFull").innerHTML,
    //   "success",
    //   4000
    // );
  }

  handleErrorTransaction(err) {
    // console.log("err", err);
    this.closeDialog();
    showNotification(
      document.getElementById("error").innerHTML,
      document.getElementById("somethingWentWrong").innerHTML,
      "danger",
      4000
    );
  }

  handleErrorAccount(err) {
    // console.log(err);
    this.closeDialog();
    showNotification(
      document.getElementById("error").innerHTML,
      document.getElementById("errorWhileAccount").innerHTML,
      "danger",
      4000
    );
  }
  setShow(value) {
    this.setState({ showModel: value });
  }
  closeDialog() {
    this.setState({
      loading: false,
      mainHeading: "",
      msg: "",
      subMsg: "",
      forLoading: false,
      forSuccess: false,
    });
  }

  handleCompound(selectedTab, loaderType) {
    if (this.props.transactionInProgress) {
      this.handleInProgressTransaction();
      return;
    }

    if (
      checkWalletConnection(this.props.contract, this.props.metaMaskAddress)
    ) {
      this.setState({ loadingFor: loaderType });
      var web3 = new Web3({ ...this.props.provider });
      let stakingContract = new web3.eth.Contract(
        StakingAbi,
        StakingContractAdd
      );
      web3.eth
        .getAccounts()
        .then((acc) => {
          if (selectedTab === "showbnb") {
            this.props.setTransactionInProgress(true);
            stakingContract.methods
              .compound("1")
              .send({ from: acc[0] })
              .then((res) => {
                this.props.setTransactionInProgress(false);
                this.handleSuccessResponse(res);
                this.setState({ loadingFor: "" });
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
              })
              .catch((err) => {
                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
                this.setState({ loadingFor: "" });
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
              });
          } else if (selectedTab === "show") {
            this.props.setTransactionInProgress(true);
            stakingContract.methods
              .compound("0")
              .send({ from: acc[0] })
              .then((res) => {
                this.props.setTransactionInProgress(false);
                this.handleSuccessResponse(res);
                this.setState({ loadingFor: "" });
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
              })
              .catch((err) => {
                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
                this.setState({ loadingFor: "" });

                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
              });
          }
        })
        .catch((err) => {
          this.props.setTransactionInProgress(false);
          this.handleErrorAccount(err);
          this.setState({ loadingFor: "" });
          this.setDecimalsAndApproval(
            this.props.contract,
            this.props.metaMaskAddress
          );
        });
    }
  }

  calculateTvl() {
    const showPrice = this.props.bnbPriceDollar * this.props.showBNBPriceDollar;
    const totalTvl =
      showPrice * this.props.noOfShow +
      this.props.bnbPriceDollar * this.props.noOfBNB;
    const lpPrice = totalTvl / this.props.circulatingSuppLp;
    const tvlLp = lpPrice * (this.props.totalFarms / Math.pow(10, 18));
    const tvlForShow = showPrice * (this.props.totalStakes / Math.pow(10, 18));
    return tvlLp + tvlForShow;
  }

  render() {
    return (
      <React.Fragment>
        <p style={{ display: "none" }} id="transactionInProgress">
          {" "}
          <FormattedMessage id="transactionInProgress" />
        </p>
        <p style={{ display: "none" }} id="transactiobInProcess">
          {" "}
          <FormattedMessage id="transactiobInProcess" />
        </p>
        <p style={{ display: "none" }} id="success">
          {" "}
          <FormattedMessage id="success" />
        </p>
        <p style={{ display: "none" }} id="tansactionSuccessFull">
          {" "}
          <FormattedMessage id="tansactionSuccessFull" />
        </p>
        <p style={{ display: "none" }} id="error">
          {" "}
          <FormattedMessage id="error" />
        </p>
        <p style={{ display: "none" }} id="somethingWentWrong">
          {" "}
          <FormattedMessage id="somethingWentWrong" />
        </p>
        <p style={{ display: "none" }} id="errorWhileAccount">
          {" "}
          <FormattedMessage id="errorWhileAccount" />
        </p>

        <div className="main-content">
          <div className="placeholder-margin"></div>
          <div className="card-list mainArae">
            <div className="card-item totalValueLocked">
              <div className="card-item-details single-card">
                <div className="card-item-price">
                  <h6>
                    <FormattedMessage id={"totalValue"} />
                  </h6>
                  <h2>
                    {this.props.noOfShow &&
                    this.props.bnbPriceDollar &&
                    this.props.showBNBPriceDollar &&
                    this.props.noOfBNB * this.props.bnbPriceDollar ? (
                      " $" + insertComma(this.calculateTvl().toFixed(2))
                    ) : (
                      <ValueLoader />
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="order-change">
            <div className="card-list mobile-order2">
              <div className="card-item showPrice">
                {/* <div className="v2logo">
                  <img src={logoV2} className="one" alt="" />
                </div> */}
                <div className="card-item-details p-t-10">
                  <div className="v2logo leftBox">
                    <img src={logoV2} className="one" alt="" />
                  </div>
                  <div
                    className="card-item-price"
                    style={{ borderBottom: "1px solid #008FFF" }}
                  >
                    <h6>
                      {" "}
                      <FormattedMessage id={"showPrice"} />
                    </h6>

                    <h2 className="priceHeader">
                      {!(
                        this.props.bnbPriceDollar &&
                        this.props.showBNBPriceDollar
                      ) ? (
                        <ValueLoader />
                      ) : isNaN(
                          this.props.bnbPriceDollar *
                            this.props.showBNBPriceDollar
                        ) ? (
                        "$0.00"
                      ) : (
                        " $" +
                        (
                          this.props.bnbPriceDollar *
                          this.props.showBNBPriceDollar
                        ).toFixed(4)
                      )}
                    </h2>
                  </div>
                  <ul className="summery-card">
                    <li>
                      <div className="card-d1">
                        <FormattedMessage id={"circulatingSupply"} />
                      </div>
                      <div className="border"></div>
                      <div className="card-d2 ">
                        <div className="card-size">
                          {this.state.circulatingSupply ? (
                            insertComma(this.state.circulatingSupply) + " SHOW"
                          ) : (
                            <ValueLoader />
                          )}{" "}
                        </div>
                      </div>
                    </li>

                    <li>
                      <div className="card-d1">
                        {" "}
                        <FormattedMessage id={"maxSupply"} />
                      </div>
                      <div className="border"></div>
                      <div className="card-d2 ">
                        <div className="card-size">
                          {insertComma("99000000") + " SHOW"}
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="card-d1">
                        <FormattedMessage id={"marketCap"} />
                      </div>
                      <div className="border"></div>
                      <div className="card-d2 card-size">
                        {this.state.bnbPriceDollar &&
                        this.props.showBNBPriceDollar &&
                        this.state.circulatingSupply ? (
                          insertComma(
                            (
                              this.state.bnbPriceDollar *
                              this.props.showBNBPriceDollar *
                              this.state.circulatingSupply
                            ).toFixed(2)
                          ) + " $"
                        ) : (
                          <ValueLoader />
                        )}
                      </div>
                    </li>
                    <li>
                      <div className="card-d1">
                        <FormattedMessage id={"fullyDilutedMarketCap"} />{" "}
                      </div>
                      <div className="border"></div>
                      <div className="card-d2 card-size">
                        {this.state.bnbPriceDollar &&
                        this.props.showBNBPriceDollar &&
                        this.state.totalSupply ? (
                          isNaN(
                            this.state.bnbPriceDollar *
                              this.props.showBNBPriceDollar *
                              this.state.totalSupply
                          ) ? (
                            "0.00"
                          ) : (
                            insertComma(
                              (
                                this.state.bnbPriceDollar *
                                this.props.showBNBPriceDollar *
                                this.state.totalSupply
                              ).toFixed(2)
                            ) + " $"
                          )
                        ) : (
                          <ValueLoader />
                        )}
                      </div>
                    </li>

                    <li>
                      <div className="card-d1">
                        <FormattedMessage id={"CurrentEmissionRate"} />{" "}
                      </div>
                      <div className="border"></div>
                      <div className="card-d2 card-size">
                        3.99 SHOW/Block
                        {/* {this.props.emissionRate ? (
                          isNaN(this.props.emissionRate) ? (
                            "0"
                          ) : (
                            insertComma() +
                            " SHOW/Block"
                          )
                        ) : (
                          <ValueLoader />
                        )} */}
                      </div>
                    </li>

                    <li>
                      <div className="card-d1">
                        <FormattedMessage id={"contract"} />{" "}
                      </div>
                      <div className="border"></div>
                      <div
                        style={{ color: "#000000" }}
                        className="card-d2"
                        style={{
                          width: 100,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          window.open(
                            `https://bscscan.com/address/${showTokenAdd}`,
                            "_blank"
                          )
                        }
                      >
                        {showTokenAdd}
                      </div>
                      <div className="card-d2 arrow  card-size">
                        {" "}
                        <img
                          src={path_img}
                          onClick={() =>
                            window.open(
                              `https://bscscan.com/address/${showTokenAdd}`,
                              "_blank"
                            )
                          }
                          alt=""
                        />{" "}
                      </div>
                    </li>
                  </ul>
                  <div className="footer-card total-value-footer">
                    <Button
                      block
                      variant="primary"
                      onClick={() => {
                        this.props.history.push({
                          pathname: "/farm",
                          state: {
                            comingFor: "show",
                          },
                        });
                      }}
                    >
                      <FormattedMessage id={"stakeSHOW"} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="card-item move-up">
                <div className="v2logo ">
                  <img src={iconshowbng} className="two withBGN" alt="" />
                </div>
                <div className="card-item-details">
                  <div className="card-item-price">
                    <h6>
                      <FormattedMessage id={"SHOWBNBPool"} />{" "}
                    </h6>
                    <div className="infodetailsUi">
                      <ul>
                        <li>
                          <span className="namev">APY</span>
                          <span className="border-ui"></span>
                          <span className="value">
                            {this.props.APY_LP ? (
                              insertComma(this.props.APY_LP.toFixed(2)) + "%"
                            ) : (
                              <ValueLoader />
                            )}
                          </span>
                        </li>
                        <li>
                          <span className="namev">APR</span>
                          <span className="border-ui"></span>
                          <span className="value">
                            {" "}
                            {this.props.APR_LP ? (
                              insertComma(this.props.APR_LP.toFixed(2)) + "%"
                            ) : (
                              <ValueLoader />
                            )}
                          </span>
                        </li>
                        <li>
                          <span className="namev">
                            {" "}
                            <FormattedMessage id={"daily"} />
                          </span>
                          <span className="border-ui"></span>
                          <span className="value">
                            {this.props.APR_LP ? (
                              insertComma(
                                (this.props.APR_LP / 365).toFixed(4)
                              ) + "%"
                            ) : (
                              <ValueLoader />
                            )}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="border-top"></div>
                    <h5>
                      <FormattedMessage id={"Earned"} />
                    </h5>
                    <h2>
                      {insertComma(
                        showActualValue(
                          this.state.lpReward + this.state.farmRewards,
                          2,
                          "string"
                        ),
                        true
                      )}
                    </h2>
                    <h3>
                      ~$
                      {insertComma(
                        (
                          this.props.bnbPriceDollar *
                          this.props.showBNBPriceDollar *
                          (this.state.lpReward + this.state.farmRewards)
                        ).toFixed(2),
                        true
                      )}
                    </h3>
                  </div>
                  <div className="footer-card">
                    <Button
                      block
                      variant="primary"
                      // onClick={() => this.setShow(true)}
                      onClick={
                        isStaging
                          ? () => this.handleCompound("showbnb", "compound1")
                          : () => this.setShow(true)
                      }
                    >
                      {this.state.loadingFor === "compound1" ? (
                        <ValueLoader />
                      ) : (
                        <FormattedMessage id={"compound"} />
                      )}
                    </Button>
                    <Button
                      block
                      variant="outline-primary"
                      // onClick={() => this.setShow(true)}
                      onClick={
                        isStaging
                          ? () => this.handleHarvest("showbnb", "harvest1")
                          : () => this.setShow(true)
                      }
                    >
                      {this.state.loadingFor === "harvest1" ? (
                        <ValueLoader />
                      ) : (
                        <FormattedMessage id={"harvest"} />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="card-item move-up poolUp">
                <div className="v2logo">
                  <img src={logoV2} className="three" alt="" />
                </div>
                <div className="card-item-details">
                  <div className="card-item-price">
                    <h6>
                      <FormattedMessage id={"SHOWPool"} />{" "}
                    </h6>
                    <div className="infodetailsUi">
                      <ul>
                        <li>
                          <span className="namev">APY</span>
                          <span className="border-ui"></span>
                          <span className="value">
                            {this.props.APY_SHOW ? (
                              insertComma(this.props.APY_SHOW.toFixed(2)) + "%"
                            ) : (
                              <ValueLoader />
                            )}
                          </span>
                        </li>
                        <li>
                          <span className="namev">APR</span>
                          <span className="border-ui"></span>
                          <span className="value">
                            {" "}
                            {this.props.APR_SHOW ? (
                              insertComma(this.props.APR_SHOW.toFixed(2)) + "%"
                            ) : (
                              <ValueLoader />
                            )}
                          </span>
                        </li>
                        <li>
                          <span className="namev">
                            {" "}
                            <FormattedMessage id={"daily"} />
                          </span>
                          <span className="border-ui"></span>
                          <span className="value">
                            {" "}
                            {this.props.APR_SHOW ? (
                              insertComma(
                                (this.props.APR_SHOW / 365).toFixed(4)
                              ) + "%"
                            ) : (
                              <ValueLoader />
                            )}{" "}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="border-top"></div>
                    <h5>
                      {" "}
                      <FormattedMessage id={"Earned"} />
                    </h5>
                    <h2>
                      {insertComma(
                        showActualValue(
                          this.state.showReward + this.state.stakeRewards,
                          2,
                          "string"
                        ),
                        true
                      )}
                    </h2>
                    <h3>
                      ~$
                      {insertComma(
                        (
                          this.props.bnbPriceDollar *
                          this.props.showBNBPriceDollar *
                          (this.state.showReward + this.state.stakeRewards)
                        ).toFixed(2),
                        true
                      )}
                    </h3>
                  </div>
                  <div className="footer-card">
                    <Button
                      block
                      variant="primary"
                      onClick={
                        isStaging
                          ? () => this.handleCompound("show", "compound2")
                          : () => this.setShow(true)
                      }
                    >
                      {this.state.loadingFor === "compound2" ? (
                        <ValueLoader />
                      ) : (
                        <FormattedMessage id={"compound"} />
                      )}
                    </Button>
                    <Button
                      block
                      variant="outline-primary"
                      onClick={
                        isStaging
                          ? () => this.handleHarvest("show", "harvest2")
                          : () => this.setShow(true)
                      }
                    >
                      {this.state.loadingFor === "harvest2" ? (
                        <ValueLoader />
                      ) : (
                        <FormattedMessage id={"harvest"} />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.showModel && (
          <Modal
            show={this.state.showModel}
            onHide={() => this.setShow(false)}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                <FormattedMessage id={"comingSoon"} />
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p></p>
            </Modal.Body>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

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
  setTransactionInProgress,
};

const mapStateToProps = (state, ownProps) => {
  return {
    metaMaskAddress: state.metaMaskReducer.metaMaskAddress,
    provider: state.metaMaskReducer.provider,
    contract: state.metaMaskReducer.contract,
    showBNBPriceDollar: state.metaMaskReducer.showBNBPriceDollar,
    bnbPriceDollar: state.metaMaskReducer.bnbPriceDollar,
    transactionInProgress: state.metaMaskReducer.transactionInProgress,

    totalFarms: state.metaMaskReducer.totalFarms,
    totalStakes: state.metaMaskReducer.totalStakes,

    noOfShow: state.metaMaskReducer.noOfShow,
    noOfBNB: state.metaMaskReducer.noOfBNB,
    circulatingSuppLp: state.metaMaskReducer.circulatingSuppLp,

    APR_SHOW: state.metaMaskReducer.APR_SHOW,
    APY_SHOW: state.metaMaskReducer.APY_SHOW,
    APY_LP: state.metaMaskReducer.APY_LP,
    APR_LP: state.metaMaskReducer.APR_LP,

    emissionRate: state.metaMaskReducer.emissionRate,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeChild);

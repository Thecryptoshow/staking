import React from "react";
import "./farm-cta.scss";
//import logoSHOW from "../../assets/images/show_token.png";

import { Button, Modal } from "react-bootstrap";

import { showNotification } from "../../component/Notifications/showNotification";
import { connect } from "react-redux";
import checkWalletConnection from "../../utils/checkWalletConnection";
import StakingContractAdd from "../../config/contractAddress/StakingContractAdd";

//import LoadingDialog from "../../component/loadingDialog/loadingDialog";
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

import validateInput from "./validateInputFunction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormattedMessage } from "react-intl";
import {
  getShowAllowance,
  getLpAllowance,
} from "../../contractCalls/allowance";

import { isStaging } from "../../config/stagingSetup";
import insertComma from "../../utils/insertComma";
import { showActualValue } from "../../utils/showActualValue";
import ValueLoader from "../../component/ValueLoader/valueLoader";
import "./farmpage.scss";
import Big from "big.js";
import StakingAbi from "../../config/abi/StakingAbi";
import LpAbi from "../../config/abi/LpAbi";
import LPTokenAdd from "../../config/contractAddress/LPTokenAdd";
import showTokenAdd from "../../config/contractAddress/showTokenAdd";
import ShowAbi from "../../config/abi/ShowAbi";

const Web3 = require("web3");

class Farm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      showDialog: false,
      showErrorMsg: false,

      loading: false,
      mainHeading: "",
      msg: "",
      subMsg: "",
      forLoading: false,
      forSuccess: false,

      balanceForLp: "", //value to be added for approval lp
      balanceForShow: "", //value to be added for approval for show

      stakingValueLp: "",
      unStakingValueLp: "",

      stakingValueShow: "",
      unStakingValueShow: "",

      maxBalanceToBeStakedLp: "",
      maxBalanceToBeStakedShow: "",

      totalFarms: 0,
      totalStakes: 0,
      farmOf: 0,
      stakeOf: 0,

      farmOfString: "0",
      stakeOfString: "0",

      balanceOfLp: "0",
      balanceOfShow: "0",

      lpReward: 0,
      showReward: 0,

      farmRewards: 0,
      stakeRewards: 0,

      allowanceForLp: "",
      allowanceForShow: "",

      count: 0,
      showModel: false,

      showBNBPriceDollar: 0,
      bnbPriceDollar: 0,

      tvlForLp: "0.00",
      tvlForShow: "0.00",
      transactionInProgress: false,

      APY_SHOW: 0,
      APY_LP: 0,
      loaderFor: "",
    };
  }
  setShow(value) {
    this.setState({ showModel: value });
  }

  setDecimalsAndApproval(contract, metaMaskAddress) {
    getLpAllowance(metaMaskAddress, contract, this.props.setApprovalForLp);
    getShowAllowance(metaMaskAddress, contract, this.props.setApprovalForShow);
  }

  hideDialog() {
    this.setState({ showDialog: false });
  }

  handleSuccessResponse(res) {
    // this.setState({
    //   loading: true,
    //   mainHeading: "Transaction Submitted",
    //   msg: "Your transaction has been completed",
    //   subMsg: "",
    //   forLoading: false,
    //   forSuccess: true,
    // });
    // showNotification(
    //   document.getElementById("success").innerHTML,
    //   document.getElementById("tansactionSuccessFull").innerHTML,
    //   "success",
    //   3000
    // );
  }

  handleErrorTransaction(err) {
    //console.log("err", err);
    this.closeDialog();
    showNotification(
      document.getElementById("error").innerHTML,
      document.getElementById("somethingWentWrong").innerHTML,
      "danger",
      3000
    );
  }

  handleErrorAccount(err) {
    //console.log(err);
    this.closeDialog();
    showNotification(
      document.getElementById("error").innerHTML,
      document.getElementById("errorWhileAccount").innerHTML,
      "danger",
      3000
    );
  }

  handleInProgressTransaction() {
    showNotification(
      document.getElementById("transactionInProgress").innerHTML,
      document.getElementById("transactiobInProcess").innerHTML,
      "info",
      3000
    );
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

  onHandleChange(e) {
    var re = /^\d*\.?\d*$/;
    if (re.test(e.target.value)) {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  handleStake(loaderType) {
    if (this.props.transactionInProgress) {
      this.handleInProgressTransaction();
      return;
    }
    if (this.props.selectedTab === "showbnb") {
      if (!validateInput(this.state.stakingValueLp)) {
        this.setState({ showErrorMsg: true });
        return;
      }
    }
    if (this.props.selectedTab === "show") {
      if (!validateInput(this.state.stakingValueShow)) {
        this.setState({ showErrorMsg: true });
        return;
      }
    }
    if (
      checkWalletConnection(this.props.contract, this.props.metaMaskAddress)
    ) {
      this.setState({ loaderFor: loaderType });

      // this.showConfirmationDialog();
      let web3 = new Web3(this.props.provider);
      let stakingContract = new web3.eth.Contract(
        StakingAbi,
        StakingContractAdd
      );
      web3.eth
        .getAccounts()
        .then((acc) => {
          if (this.props.selectedTab === "showbnb") {
            this.props.setTransactionInProgress(true);
            let inputVal = this.state.stakingValueLp;
            if (inputVal.startsWith(".")) {
              inputVal = "0" + inputVal;
            }
            stakingContract.methods
              .stake("1",web3.utils.toWei(inputVal, "ether"))
              .send({ from: acc[0] })
              .then((res) => {
                this.props.setTransactionInProgress(false);
                this.setState({ loaderFor: "" });

                //this.handleSuccessResponse(res);
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
                this.setState({ stakingValueLp: "" });
              })
              .catch((err) => {
                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
                this.setState({ loaderFor: "" });

                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
              });
          } else if (this.props.selectedTab === "show") {
            this.props.setTransactionInProgress(true);
            let inputVal = this.state.stakingValueShow;
            if (inputVal.startsWith(".")) {
              inputVal = "0" + inputVal;
            }
            stakingContract.methods
              .stake("0",web3.utils.toWei(inputVal, "ether"))
              .send({ from: acc[0] })
              .then((res) => {
                this.props.setTransactionInProgress(false);
                // this.handleSuccessResponse(res);
                this.setState({ loaderFor: "" });

                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
                this.setState({ stakingValueShow: "" });
              })
              .catch((err) => {
                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
                this.setState({ loaderFor: "" });
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
          this.setState({ loaderFor: "" });
          this.setDecimalsAndApproval(
            this.props.contract,
            this.props.metaMaskAddress
          );
        });
    }
  }

  handleUnStake(loaderType) {
    if (this.props.transactionInProgress) {
      this.handleInProgressTransaction();
      return;
    }
    if (this.props.selectedTab === "showbnb") {
      if (!validateInput(this.state.unStakingValueLp)) {
        this.setState({ showErrorMsg: true });
        return;
      }
    }

    if (this.props.selectedTab === "show") {
      if (!validateInput(this.state.unStakingValueShow)) {
        this.setState({ showErrorMsg: true });
        return;
      }
    }
    if (
      checkWalletConnection(this.props.contract, this.props.metaMaskAddress)
    ) {
      this.setState({ loaderFor: loaderType });
      // this.showConfirmationDialog();
      let web3 = new Web3(this.props.provider);
      let stakingContract = new web3.eth.Contract(
        StakingAbi,
        StakingContractAdd
      );
      web3.eth
        .getAccounts()
        .then((acc) => {
          if (this.props.selectedTab === "showbnb") {
            this.props.setTransactionInProgress(true);
            let inputVal = this.state.unStakingValueLp;
            if (inputVal.startsWith(".")) {
              inputVal = "0" + inputVal;
            }
            stakingContract.methods
              .unstake("1",web3.utils.toWei(inputVal, "ether"))
              .send({ from: acc[0] })
              .then((res) => {
                this.props.setTransactionInProgress(false);
                this.setState({ loaderFor: "" });
                //this.handleSuccessResponse(res);
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
                this.setState({ unStakingValueLp: "" });
              })
              .catch((err) => {
                this.setState({ loaderFor: "" });
                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
              });
          } else if (this.props.selectedTab === "show") {
            this.props.setTransactionInProgress(true);
            let inputVal = this.state.unStakingValueShow;
            if (inputVal.startsWith(".")) {
              inputVal = "0" + inputVal;
            }
            stakingContract.methods
              .unstake("0",web3.utils.toWei(inputVal, "ether"))
              .send({ from: acc[0] })
              .then((res) => {
                this.props.setTransactionInProgress(false);
                this.setState({ loaderFor: "" });
                // this.handleSuccessResponse(res);
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
                this.setState({ unStakingValueShow: "" });
              })
              .catch((err) => {
                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
                this.setState({ loaderFor: "" });
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
          this.setState({ loaderFor: "" });
          this.setDecimalsAndApproval(
            this.props.contract,
            this.props.metaMaskAddress
          );
        });
    }
  }

  handleCompound(loaderType) {
    if (this.props.transactionInProgress) {
      this.handleInProgressTransaction();
      return;
    }
    if (
      checkWalletConnection(this.props.contract, this.props.metaMaskAddress)
    ) {
      this.setState({ loaderFor: loaderType });
      // this.showConfirmationDialog();
      let web3 = new Web3(this.props.provider);
      let stakingContract = new web3.eth.Contract(
        StakingAbi,
        StakingContractAdd
      );
      web3.eth
        .getAccounts()
        .then((acc) => {
          if (this.props.selectedTab === "showbnb") {
            this.props.setTransactionInProgress(true);
            stakingContract.methods
              .compound("1")
              .send({ from: acc[0] })
              .then((res) => {
                this.props.setTransactionInProgress(false);
                // this.handleSuccessResponse(res);
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
                this.setState({ loaderFor: "" });
              })
              .catch((err) => {
                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
                this.setState({ loaderFor: "" });
              });
          } else if (this.props.selectedTab === "show") {
            this.props.setTransactionInProgress(true);
           stakingContract.methods
              .compound("0")
              .send({ from: acc[0] })
              .then((res) => {
                this.props.setTransactionInProgress(false);
                //this.handleSuccessResponse(res);
                this.setState({ loaderFor: "" });
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
              })
              .catch((err) => {
                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
                this.setState({ loaderFor: "" });

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
          this.setState({ loaderFor: "" });

          this.setDecimalsAndApproval(
            this.props.contract,
            this.props.metaMaskAddress
          );
        });
    }
  }

  handleHarvest(loaderType) {
    if (this.props.transactionInProgress) {
      this.handleInProgressTransaction();
      return;
    }

    if (
      checkWalletConnection(this.props.contract, this.props.metaMaskAddress)
    ) {
      this.setState({ loaderFor: loaderType });

      // this.showConfirmationDialog();
      let web3 = new Web3(this.props.provider);
      let stakingContract = new web3.eth.Contract(
        StakingAbi,
        StakingContractAdd
      );
      web3.eth
        .getAccounts()
        .then((acc) => {
          if (this.props.selectedTab === "showbnb") {
            this.props.setTransactionInProgress(true);
            stakingContract.methods
              .harvest("1")
              .send({ from: acc[0] })
              .then((res) => {
                // this.handleSuccessResponse(res);
                this.setState({ loaderFor: "" });

                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
                this.props.setTransactionInProgress(false);
              })
              .catch((err) => {
                this.setState({ loaderFor: "" });

                this.handleErrorTransaction(err);
                this.props.setTransactionInProgress(false);
              });
          } else if (this.props.selectedTab === "show") {
            this.props.setTransactionInProgress(true);
            stakingContract.methods
              .harvest("0")
              .send({ from: acc[0] })
              .then((res) => {
                this.setState({ loaderFor: "" });

                // this.handleSuccessResponse(res);
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
                this.props.setTransactionInProgress(false);
              })
              .catch((err) => {
                this.setState({ loaderFor: "" });

                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
              });
          }
        })
        .catch((err) => {
          this.props.setTransactionInProgress(false);
          this.setState({ loaderFor: "" });

          this.handleErrorAccount(err);
          this.setDecimalsAndApproval(
            this.props.contract,
            this.props.metaMaskAddress
          );
        });
    }
  }

  handleApprove(tokenType) {
    if (this.props.transactionInProgress) {
      this.handleInProgressTransaction();
      return;
    }

    if (this.props.selectedTab === "showbnb") {
      if (!validateInput(this.state.balanceForLp)) {
        this.setState({ showErrorMsg: true });
        return;
      }
    }
    if (this.props.selectedTab === "show") {
      if (!validateInput(this.state.balanceForShow)) {
        this.setState({ showErrorMsg: true });
        return;
      }
    }
    if (
      checkWalletConnection(this.props.contract, this.props.metaMaskAddress)
    ) {
      this.setState({ loaderFor: true });

      // this.showConfirmationDialog();
      let appprovalValue = 10000000;

      var web3 = new Web3(this.props.provider);
      web3.eth
        .getAccounts()
        .then((acc) => {
          if (tokenType === "Lp") {
            let lpContract = new web3.eth.Contract(LpAbi, LPTokenAdd);
            this.props.setTransactionInProgress(true);
            lpContract.methods
              .approve(
                StakingContractAdd,
                // web3.utils.toWei(this.state.balanceForLp, "ether")
                web3.utils.toWei(appprovalValue.toString(), "ether")
              )
              .send({ from: acc[0] })
              .then((res) => {
                //this.handleSuccessResponse(res);
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
                this.props.setTransactionInProgress(false);
                this.setState({
                  balanceForLp: "",
                });
              })
              .catch((err) => {
                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
              });
          } else {
            let showContract = new web3.eth.Contract(ShowAbi, showTokenAdd);
            this.props.setTransactionInProgress(true);
            showContract.methods
              .approve(
                StakingContractAdd,
                web3.utils.toWei(appprovalValue.toString(), "ether")
              )
              .send({ from: acc[0] })
              .then((res) => {
                //   this.handleSuccessResponse(res);
                this.setDecimalsAndApproval(
                  this.props.contract,
                  this.props.metaMaskAddress
                );
                this.props.setTransactionInProgress(false);
                this.setState({
                  balanceForShow: "",
                });
              })
              .catch((err) => {
                this.props.setTransactionInProgress(false);
                this.handleErrorTransaction(err);
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
          this.setDecimalsAndApproval(
            this.props.contract,
            this.props.metaMaskAddress
          );
        });
      this.setState({ loaderFor: false });
    }
  }

  componentDidMount() {
    // this.APR(0.4, 100, "LP");
    // this.APR(0.4, 100, "SHOW");
    if (this.props.contract && this.props.metaMaskAddress) {
      this.getStats();
    }

    this.intervalId = setInterval(this.timer.bind(this), 6000);
  }

  timer() {
    this.setState({ count: this.state.count + 1 });
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  getStats() {
    this.props.contract.stakingContract.methods
      .userInfo("1",this.props.metaMaskAddress)
      .call()
      .then((res) => {
        console.log("farmOf", typeof res, res.amount);
        this.setState({
          farmOf: parseInt(res.amount),
          farmOfString: res.amount,

          tvlForLp: (
            parseInt(res.amount) *
            this.props.showBNBPriceDollar *
            this.props.bnbPriceDollar
          ).toFixed(2),
        });
      })
      .catch((err) => {
        //console.log("err", err);
      });
    this.props.contract.lpContract.methods
    .balanceOf(StakingContractAdd)
      .call()
      .then((res) => {
        // console.log("totalFarms", typeof res, res);
        this.setState({ totalFarms: parseInt(res) });
      })
      .catch((err) => {
        //console.log("err", err);
      });
    this.props.contract.stakingContract.methods
      .totalStaked()
      .call()
      .then((res) => {
        // console.log("totalStakes", typeof res, res);
        this.setState({ totalStakes: parseInt(res) });
      })
      .catch((err) => {
        //console.log("err", err);
      });
    this.props.contract.stakingContract.methods
      .userInfo("0",this.props.metaMaskAddress)
      .call()
      .then((res) => {
        // console.log("stakeOf", typeof res, res);
        this.setState({
          stakeOf: parseInt(res.amount),
          stakeOfString: res.amount,
          tvlForShow: (
            parseInt(res.amount) *
            this.props.showBNBPriceDollar *
            this.props.bnbPriceDollar
          ).toFixed(2),
        });
      })
      .catch((err) => {
        //console.log("err", err);
      });
    this.props.contract.lpContract.methods
      .balanceOf(this.props.metaMaskAddress)
      .call()
      .then((res) => {
        // console.log("balanceOf LP", typeof res, res);
        this.setState({ balanceOfLp: res });
      })
      .catch((err) => {
        //console.log("err", err);
      });
    this.props.contract.showContract.methods
      .balanceOf(this.props.metaMaskAddress)
      .call()
      .then((res) => {
        // console.log("balanceOf Show", typeof res, res);
        this.setState({ balanceOfShow: res });
      })
      .catch((err) => {
        //console.log("err", err);
      });
    var web3 = new Web3(Web3.givenProvider);

    this.props.contract.stakingContract.methods
      .pendingShow("1",this.props.metaMaskAddress)
      .call()
      .then((res) => {
        console.log("lpStakeReward", typeof res, res);
        this.setState({
          lpReward: parseInt(res) / Math.pow(10, 18),
        });
        // this.setState({
        //   lpReward: web3.utils.fromWei(res),
        // });
      })
      .catch((err) => {
        //console.log("err", err);
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

    this.props.contract.stakingContract.methods
      .pendingShow("0",this.props.metaMaskAddress)
      .call()
      .then((res) => {
        // console.log("showStakeReward", typeof res, res);
        // this.setState({
        //   showReward: parseInt(res) / Math.pow(10, 18),
        // });
        this.setState({
          // showReward: web3.utils.fromWei(res),
          showReward: parseInt(res) / Math.pow(10, 18),
        });
      })
      .catch((err) => {
        //console.log("err", err);
      });

    this.props.contract.lpContract.methods
      .allowance(this.props.metaMaskAddress, StakingContractAdd)
      .call()
      .then((res) => {
        // console.log("allowance for lp", typeof res, res);
        this.setState({
          allowanceForLp: parseInt(res),
        });
      })
      .catch((err) => {
        //console.log("err", err);
        // showNotification("Error", err.message, "danger", 4000);
      });
    this.props.contract.showContract.methods
      .allowance(this.props.metaMaskAddress, StakingContractAdd)
      .call()
      .then((res) => {
        // console.log("allowance for show", typeof res, res);
        this.setState({
          allowanceForShow: parseInt(res),
        });
      })
      .catch((err) => {
        //console.log("err", err);
        // showNotification("Error", err.message, "danger", 4000);
      });

    this.props.contract.panCakeSwapContract.methods
      .getReserves()
      .call()
      .then((res) => {
        const bnbPriceDollar = parseInt(res[1]) / parseInt(res[0]);
        this.setState({
          bnbPriceDollar: bnbPriceDollar,
        });
      })
      .catch((err) => {
        //console.log("err bnb price", err);
      });

    this.props.contract.showBNBReserveContract.methods
      .getReserves()
      .call()
      .then((res) => {
        const showBNBPriceDollar = parseInt(res[0]) / parseInt(res[1]);
        this.setState({
          showBNBPriceDollar: showBNBPriceDollar,
        });
      })
      .catch((err) => {
        //console.log("err showBNBPriceDollar", err);
      });
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
    }

    if (
      this.props.metaMaskAddress === "" &&
      this.props.metaMaskAddress !== prevProps.metaMaskAddress
    ) {
      this.setState({
        token: "",
        showDialog: false,
        showErrorMsg: false,

        loading: false,
        mainHeading: "",
        msg: "",
        subMsg: "",
        forLoading: false,
        forSuccess: false,

        balanceForLp: "", //value to be added for approval lp
        balanceForShow: "", //value to be added for approval for show

        stakingValueLp: "",
        unStakingValueLp: "",

        stakingValueShow: "",
        unStakingValueShow: "",

        maxBalanceToBeStakedLp: "",
        maxBalanceToBeStakedShow: "",

        totalFarms: 0,
        totalStakes: 0,
        farmOf: 0,
        stakeOf: 0,

        farmOfString: "0",
        stakeOfString: "0",

        balanceOfLp: "0",
        balanceOfShow: "0",

        lpReward: 0,
        showReward: 0,

        farmRewards: 0,
        stakeRewards: 0,

        allowanceForLp: "",
        allowanceForShow: "",

        count: 0,
        showModel: false,

        showBNBPriceDollar: 0,
        bnbPriceDollar: 0,
      });
    }
  }

  handleMaxApprove(calledFor) {
    if (
      checkWalletConnection(this.props.contract, this.props.metaMaskAddress) &&
      this.props.metaMaskAddress
    ) {
      if (calledFor === "lp") {
        let number = this.divideNo(this.state.balanceOfLp);
        this.setState({
          balanceForLp: number,
        });
        // }
      } else if (calledFor === "show") {
        let number = this.divideNo(this.state.balanceOfShow);
        this.setState({
          balanceForShow: number,
        });
        // }
      }
    }
  }

  divideNo(res) {
    if (typeof res === "string" && res === "") {
      res = "0";
    }
    let bigNo = new Big(res);
    let bigNo1 = new Big(Math.pow(10, 18));
    let number = bigNo.div(bigNo1).toFixed(18);
    // console.log(number);
    return number;
  }

  findMaxBalance(type) {
    if (
      checkWalletConnection(this.props.contract, this.props.metaMaskAddress) &&
      this.props.metaMaskAddress
    ) {
      if (type === "Stake") {
        if (this.props.selectedTab === "showbnb") {
          this.props.contract.lpContract.methods
            .balanceOf(this.props.metaMaskAddress)
            .call()
            .then((res) => {
              let number = this.divideNo(res);
              this.setState({
                // stakingValueLp: showActualValue(no, 18, "string"),
                stakingValueLp: number,
              });
              // }
            })
            .catch((err) => {
              //console.log("err", err);
            });
        } else {
          this.props.contract.showContract.methods
            .balanceOf(this.props.metaMaskAddress)
            .call()
            .then((res) => {
              let number = this.divideNo(res);
              this.setState({
                stakingValueShow: number,
              });
              // }
            })
            .catch((err) => {
              //console.log("err", err);
            });
        }
      } else if (type === "Unstake") {
        if (this.props.selectedTab === "showbnb") {
          this.props.contract.stakingContract.methods
            .userInfo("1",this.props.metaMaskAddress)
            .call()
            .then((res) => {
              let number = this.divideNo(res.amount);
              this.setState({
                unStakingValueLp: number,
              });
              // }
            })
            .catch((err) => {
              //console.log("err", err);
            });
        } else {
          this.props.contract.stakingContract.methods
            .userInfo("0",this.props.metaMaskAddress)
            .call()
            .then((res) => {
              let number = this.divideNo(res.amount);
              this.setState({
                unStakingValueShow: number,
              });
              // }
            })
            .catch((err) => {
              //console.log("err", err);
            });
        }
      }
    }
  }

  calculateTvlForLp() {
    const showPrice = this.props.bnbPriceDollar * this.props.showBNBPriceDollar;
    const totalTvl =
      showPrice * this.props.noOfShow +
      this.props.bnbPriceDollar * this.props.noOfBNB;
    const lpPrice = totalTvl / this.props.circulatingSuppLp;
    const tvlLp = lpPrice * (this.props.totalFarms / Math.pow(10, 18));
    // console.log("lpPrice", lpPrice);
    // console.log("tvlLp", tvlLp);
    return tvlLp;
  }

  calculateEstimatedValuesForLp() {
    let poolPencentageForLp = (this.state.farmOf / this.state.totalFarms) * 100;
    let tvlForLp = this.calculateTvlForLp();
    let ForLp = (tvlForLp * poolPencentageForLp) / 100;
    return ForLp;
  }

  calculateEstimatedValuesForShow() {
    let poolPencentageForShow =
      (this.state.stakeOf / this.state.totalStakes) * 100;

    let tvlForShow =
      (this.props.totalStakes / Math.pow(10, 18)) *
      this.props.bnbPriceDollar *
      this.props.showBNBPriceDollar;
    let ForShow = (tvlForShow * poolPencentageForShow) / 100;
    return ForShow;
  }

  render() {
    console.log( "value" ,(this.state.farmOf / this.state.totalFarms)*100)
    if (this.state.showErrorMsg) {
      setTimeout(() => {
        this.setState({ showErrorMsg: false });
      }, 2000);
    }

    return (
      <React.Fragment>
        <p style={{ display: "none" }} id="error">
          {" "}
          <FormattedMessage id="error" />
        </p>
        <p style={{ display: "none" }} id="success">
          {" "}
          <FormattedMessage id="success" />
        </p>
        <p style={{ display: "none" }} id="tansactionSuccessFull">
          {" "}
          <FormattedMessage id="tansactionSuccessFull" />
        </p>
        <p style={{ display: "none" }} id="somethingWentWrong">
          {" "}
          <FormattedMessage id="somethingWentWrong" />
        </p>
        <p style={{ display: "none" }} id="errorWhileAccount">
          {" "}
          <FormattedMessage id="errorWhileAccount" />
        </p>
        <p style={{ display: "none" }} id="transactionInProgress">
          {" "}
          <FormattedMessage id="transactionInProgress" />
        </p>
        <p style={{ display: "none" }} id="transactiobInProcess">
          {" "}
          <FormattedMessage id="transactiobInProcess" />
        </p>
        <div className="ammount-chip">
          {this.props.selectedTab === "showbnb" ? (
            <div className="ammount-chip-item">
              <div className="block-chip-left">
                <h6>
                  <FormattedMessage id={"aprStake"} />
                </h6>
                <h2>{insertComma(this.props.APY_LP.toFixed(2))}%</h2>
              </div>
              <div className="block-chip-right">
                <ul>
                  <li>
                    <div className="label">APR</div>
                    <div className="label-value">
                      <span>
                        {this.props.APR_LP !== "" ? (
                          insertComma(this.props.APR_LP.toFixed(2)) + " %"
                        ) : (
                          <ValueLoader />
                        )}{" "}
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="label">DAILY</div>
                    <div className="label-value">
                      <span>
                        {this.props.APR_LP !== 0
                          ? insertComma((this.props.APR_LP / 365).toFixed(4)) +
                            " %"
                          : insertComma((this.props.APR_LP / 365).toFixed(2)) +
                            " %"}{" "}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="ammount-chip-item">
              <div className="block-chip-left">
                <h6>
                  <FormattedMessage id={"aprStake"} />
                </h6>
                <h2>{insertComma(this.props.APY_SHOW.toFixed(2))}%</h2>
              </div>
              <div className="block-chip-right">
                <ul>
                  <li>
                    <div className="label">APR</div>
                    <div className="label-value">
                      <span>
                        {this.props.APR_LP !== "" ? (
                          insertComma(this.props.APR_SHOW.toFixed(2)) + " %"
                        ) : (
                          <ValueLoader />
                        )}
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="label">DAILY</div>
                    <div className="label-value">
                      <span>
                        {" "}
                        {this.props.APR_SHOW !== 0
                          ? insertComma(
                              (this.props.APR_SHOW / 365).toFixed(4)
                            ) + " %"
                          : insertComma(
                              (this.props.APR_SHOW / 365).toFixed(2)
                            ) + " %"}{" "}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="farm-cta">
          <div className="chip-card-list">
            <div className="chip-card-item">
              <h6>
                <FormattedMessage id={"aprUnstable"} />
              </h6>
              <h2>
                {this.props.selectedTab === "showbnb"
                  ? insertComma(this.props.APY_LP.toFixed(2))
                  : insertComma(this.props.APY_SHOW.toFixed(2))}
                %
              </h2>
            </div>
            <div className="chip-card-item">
              <h6>
                <FormattedMessage id={"myPoolShare"} />
              </h6>
              <h2>
                {this.props.selectedTab === "showbnb"
                  ? isNaN(this.state.farmOf / this.state.totalFarms) ||
                    this.state.farmOf / this.state.totalFarms === 0
                    ? "0.00"
                    : (
                        (this.state.farmOf / this.state.totalFarms) *
                        100
                      ).toFixed(8)
                  : isNaN(this.state.stakeOf / this.state.totalStakes) ||
                    this.state.stakeOf / this.state.totalStakes === 0
                  ? "0.00"
                  : (
                      (this.state.stakeOf / this.state.totalStakes) *
                      100
                    ).toFixed(8)
                    }
                %
              </h2>
            </div>
            <div className="chip-card-item">
              <h6>
                <FormattedMessage id={"estimatedmyShare"} />
              </h6>
              <h2>
                $
                {this.props.selectedTab === "showbnb"
                  ? isNaN(this.calculateEstimatedValuesForLp())
                    ? "0"
                    : insertComma(
                        this.calculateEstimatedValuesForLp().toFixed(2)
                      )
                  : isNaN(this.calculateEstimatedValuesForShow())
                  ? "0"
                  : insertComma(
                      this.calculateEstimatedValuesForShow().toFixed(2)
                    )}
              </h2>
            </div>
          </div>

          <ul className="summery-card">
            <li>
              <div className="card-d1">
                <FormattedMessage
                  id={
                    this.props.selectedTab === "showbnb"
                      ? "LPBalance"
                      : "ShowBalance"
                  }
                />
              </div>

              <div className="border"></div>
              <div className="card-d2 card-size">
                {this.props.selectedTab === "showbnb"
                  ? isNaN(this.state.balanceOfLp / Math.pow(10, 18))
                    ? "0 SHOWBNB LP"
                    : insertComma(
                        showActualValue(
                          this.divideNo(this.state.balanceOfLp),
                          18,
                          "string"
                        ),
                        true
                      ) + ""
                  : isNaN(this.state.balanceOfShow / Math.pow(10, 18))
                  ? "0 SHOW"
                  : insertComma(
                      showActualValue(
                        this.divideNo(this.state.balanceOfShow),
                        18,
                        "string"
                      ),
                      true
                    ) + ""}{" "}
              </div>
            </li>
            <li>
              <div className="card-d1">
                <FormattedMessage
                  id={
                    this.props.selectedTab === "showbnb"
                      ? "LPStaked"
                      : "ShowStaked"
                  }
                />
              </div>
              <div className="border"></div>
              <div className="card-d2 card-size">
                {this.props.selectedTab === "showbnb"
                  ? isNaN(this.state.farmOf / Math.pow(10, 18))
                    ? "0 SHOWBNB LP"
                    : insertComma(
                        showActualValue(
                          this.divideNo(this.state.farmOfString),
                          18,
                          "string"
                        ),
                        true
                      ) + ""
                  : isNaN(this.state.stakeOf / Math.pow(10, 18))
                  ? "0 SHOW"
                  : insertComma(
                      showActualValue(
                        this.divideNo(this.state.stakeOfString),
                        18,
                        "string"
                      ),
                      true
                    ) + ""}{" "}
              </div>
            </li>
            <li>
              <div className="card-d1">
                <FormattedMessage id={"Totalvaluelocked"} />
              </div>
              <div className="border"></div>
              <div className="card-d2 card-size">
                {this.props.selectedTab === "showbnb"
                  ? isNaN(this.calculateTvlForLp())
                    ? "0.00 $"
                    : insertComma(
                        showActualValue(this.calculateTvlForLp(), 2, "string"),
                        true
                      ) + " $"
                  : isNaN(
                      this.props.totalStakes *
                        this.props.bnbPriceDollar *
                        this.props.showBNBPriceDollar
                    )
                  ? "0.00 $"
                  : insertComma(
                      showActualValue(
                        (this.props.totalStakes / Math.pow(10, 18)) *
                          this.props.bnbPriceDollar *
                          this.props.showBNBPriceDollar,
                        2,
                        "string"
                      ),
                      true
                    ) + " $"}{" "}
              </div>
            </li>

          </ul>

          {this.props.approvalForLp === true &&
          this.props.selectedTab === "showbnb" ? (
            <div className="form-input-group">
              <div className="form-item input-select">
                <input
                  type="text"
                  className="form-control"
                  name={"balanceForLp"}
                  onChange={(e) => this.onHandleChange(e)}
                  value={this.state.balanceForLp}
                />
                <span
                  style={{ cursor: "pointer" }}
                  onClick={
                    isStaging
                      ? () => this.handleMaxApprove("lp")
                      : () => this.setShow(true)
                  }
                >
                  <FormattedMessage id={"max"} />
                </span>
              </div>
              <div className="form-item input-select">
                <Button
                  block
                  variant="outline-primary"
                  onClick={
                    isStaging
                      ? () => this.handleApprove("Lp")
                      : () => this.setShow(true)
                  }
                  disabled={this.state.balanceForLp === "" ? true : false}
                >
                  {this.state.loaderFor ? (
                    <ValueLoader />
                  ) : (
                    <FormattedMessage id={"approval"} />
                  )}
                </Button>
              </div>
            </div>
          ) : this.props.approvalForShow === true &&
            this.props.selectedTab === "show" ? (
            <div className="form-input-group">
              <div className="form-item input-select">
                <input
                  type="text"
                  className="form-control"
                  name={"balanceForShow"}
                  onChange={(e) => this.onHandleChange(e)}
                  value={this.state.balanceForShow}
                />
                <span
                  style={{ cursor: "pointer" }}
                  onClick={
                    isStaging
                      ? () => this.handleMaxApprove("show")
                      : () => this.setShow(true)
                  }
                >
                  <FormattedMessage id={"max"} />
                </span>
              </div>
              <div className="form-item input-select">
                <Button
                  block
                  variant="outline-primary"
                  onClick={
                    isStaging
                      ? () => this.handleApprove("Show")
                      : () => this.setShow(true)
                  }
                  disabled={this.state.balanceForShow === "" ? true : false}
                >
                  <FormattedMessage id={"approval"} />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="form-input-group">
                <div className="form-item input-select">
                  <input
                    type="text"
                    className="form-control"
                    name={
                      this.props.selectedTab === "showbnb"
                        ? "stakingValueLp"
                        : "stakingValueShow"
                    }
                    onChange={(e) => this.onHandleChange(e)}
                    value={
                      this.props.selectedTab === "showbnb"
                        ? this.state.stakingValueLp
                        : this.state.stakingValueShow
                    }
                  />
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={
                      isStaging
                        ? () => this.findMaxBalance("Stake")
                        : () => this.setShow(true)
                    }
                  >
                    <FormattedMessage id={"max"} />
                  </span>
                </div>
                <div className="form-item input-select">
                  <Button
                    block
                    variant="primary"
                    onClick={
                      isStaging
                        ? () => this.handleStake("stack")
                        : () => this.setShow(true)
                    }
                  >
                    {this.state.loaderFor === "stack" ? (
                      <ValueLoader />
                    ) : (
                      <FormattedMessage id={"stake"} />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
          <div className="form-input-group">
            <div className="form-item input-select">
              <input
                type="text"
                className="form-control"
                name={
                  this.props.selectedTab === "showbnb"
                    ? "unStakingValueLp"
                    : "unStakingValueShow"
                }
                onChange={(e) => this.onHandleChange(e)}
                value={
                  this.props.selectedTab === "showbnb"
                    ? this.state.unStakingValueLp
                    : this.state.unStakingValueShow
                }
              />
              <span
                style={{ cursor: "pointer" }}
                onClick={
                  isStaging
                    ? () => this.findMaxBalance("Unstake")
                    : () => this.setShow(true)
                }
              >
                <FormattedMessage id={"max"} />
              </span>
            </div>
            <div className="form-item input-select">
              <Button
                block
                variant="outline-primary"
                onClick={
                  isStaging
                    ? () => this.handleUnStake("unStack")
                    : () => this.setShow(true)
                }
              >
                {this.state.loaderFor === "unStack" ? (
                  <ValueLoader />
                ) : (
                  <FormattedMessage id={"unStake"} />
                )}
              </Button>
            </div>
          </div>
          <div className="title-card-ui">
            <span
              style={{ cursor: "pointer" }}
              onClick={() =>
                window.open(
                  "https://exchange.pancakeswap.finance/#/add/BNB/"+showTokenAdd,
                  "_blank"
                )
              }
            >
              <FormattedMessage id={"addMoreLiquidity"} />
            </span>
          </div>
          <div className="title-card-ui-reward">
            <FormattedMessage id={"reward"} />
          </div>
          <div className="ala-to-harvest">
            <div className="tile1">
              <FormattedMessage id={"showToHarvest"} />
            </div>
            <div className="tile2">
              {this.props.selectedTab === "showbnb"
                ? insertComma(
                    showActualValue(
                      this.state.lpReward + this.state.farmRewards,
                      18,
                      "string"
                    ),
                    true
                  )
                : insertComma(
                    showActualValue(
                      this.state.showReward + this.state.stakeRewards,
                      18,
                      "string"
                    ),
                    true
                  )}
            </div>
          </div>

          <div className="footer-btn-ui">
            <Button
              block
              variant="primary"
              onClick={
                isStaging
                  ? () => this.handleCompound("compound")
                  : () => this.setShow(true)
              }
            >
              {this.state.loaderFor === "compound" ? (
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
                  ? () => this.handleHarvest("harvest")
                  : () => this.setShow(true)
              }
            >
              {this.state.loaderFor === "harvest" ? (
                <ValueLoader />
              ) : (
                <FormattedMessage id={"harvest"} />
              )}
            </Button>
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

        {this.state.showErrorMsg ? (
          <ToastContainer limit={1} style={{ top: "4rem" }} />
        ) : undefined}
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
  deleteApprovalForShow,
  deleteApprovalForLp,
  setDecimalsForShow,
  setDecimalsForLp,
  deleteDecimalsForShow,
  deleteDecimalsForLp,
  setTransactionInProgress,
};

const mapStateToProps = (state, ownProps) => {
  return {
    metaMaskAddress: state.metaMaskReducer.metaMaskAddress,
    provider: state.metaMaskReducer.provider,
    contract: state.metaMaskReducer.contract,
    decimalsForLp: state.metaMaskReducer.decimalsForLp,
    decimalsForShow: state.metaMaskReducer.decimalsForShow,
    approvalForLp: state.metaMaskReducer.approvalForLp,
    approvalForShow: state.metaMaskReducer.approvalForShow,

    totalFarms: state.metaMaskReducer.totalFarms,
    totalStakes: state.metaMaskReducer.totalStakes,

    showBNBPriceDollar: state.metaMaskReducer.showBNBPriceDollar,
    bnbPriceDollar: state.metaMaskReducer.bnbPriceDollar,
    noOfShow: state.metaMaskReducer.noOfShow,
    noOfBNB: state.metaMaskReducer.noOfBNB,
    circulatingSuppLp: state.metaMaskReducer.circulatingSuppLp,

    transactionInProgress: state.metaMaskReducer.transactionInProgress,

    APR_SHOW: state.metaMaskReducer.APR_SHOW,
    APY_SHOW: state.metaMaskReducer.APY_SHOW,
    APY_LP: state.metaMaskReducer.APY_LP,
    APR_LP: state.metaMaskReducer.APR_LP,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Farm);


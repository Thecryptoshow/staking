import React, { useEffect, useState } from "react";
import Farm from "./farm";
import "./tabs.scss";
import Header from "../../component/Header";
import ValueCard from "../../component/ValueCard";
import SideNav from "../../component/sideNav/sideNav";
import pandaPic from "../../assets/images/image-01.png";
import "./farmpage.scss";
import { Tabs, Tab } from "react-bootstrap";
import CountUp from "react-countup";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import insertComma from "../../utils/insertComma";
import ValueLoader from "../../component/ValueLoader/valueLoader";

function TabsBlock(props) {
  const [key, setKey] = useState(props.tabValue);

  useEffect(() => {
    if (props.data) {
      setKey(props.data);
    }
  }, []);

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
    >
      {props.tabValue === "showbnb" ? (
        <Tab
          eventKey="showbnb"
          title={<FormattedMessage id={"stakeShowbnbLp"} />}
        >
          <React.Fragment>
            <Farm selectedTab={key} />
          </React.Fragment>
        </Tab>
      ) : (
        <Tab eventKey="show" title={<FormattedMessage id={"stakeShow"} />}>
          <React.Fragment>
            <Farm selectedTab={key} />
          </React.Fragment>
        </Tab>
      )}
    </Tabs>
  );
}

class FarmHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "Form",

      count: 0,
      farmOf: 0,
      stakeOf: 0,
      totalStakes: 0,
      totalFarms: 0,

      APY_SHOW: 0,
      APY_LP: 0,

      APR_SHOW: 0,
      APR_LP: 0,
    };
  }

  componentDidMount() {
    // this.APR(5, 100, "LP");
    // this.APR(5, 100, "SHOW");
    // if (this.props.contract && this.props.metaMaskAddress) {
    //   this.getStats();
    // }

    this.intervalId = setInterval(this.timer.bind(this), 6000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  timer() {
    this.setState({ count: this.state.count + 1 });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.count !== prevState.count) {
      // this.APR(5, 100, "LP");
      // this.APR(5, 100, "SHOW");
    }

    // if (
    //   this.state.count !== prevState.count &&
    //   this.props.contract &&
    //   this.props.metaMaskAddress
    // ) {
    //   this.getStats();
    // }

    if (
      this.props.metaMaskAddress === "" &&
      this.props.metaMaskAddress !== prevProps.metaMaskAddress
    ) {
      this.setState({
        farmOf: 0,
        stakeOf: 0,
        totalStakes: 0,
        totalFarms: 0,

        APY_SHOW: 0,
        APY_LP: 0,
      });
    }
  }

  changeSelectedTab(key) {
    this.setState({ selectedTab: key });
  }

  render() {
    return (
      <React.Fragment>
        <div className="main-content">
          <div className="image-placeholder ">
            <img src={pandaPic} />
          </div>
        
          <div className="container-fluid pl-0 pr-0">
            <div className="row">
              <div className="col-md-6 pr-custom">
                <div className="tab_ui">
                  <TabsBlock
                    // data={
                    //   this.props.history.location.state
                    //     ? this.props.history.location.state.comingFor
                    //     : ""
                    // }
                    tabValue={"showbnb"}
                  />
                </div>
              </div>
              <div className="col-md-6 pl-custom">
                <div className="tab_ui">
                  <TabsBlock
                    // data={
                    //   this.props.history.location.state
                    //     ? this.props.history.location.state.comingFor
                    //     : ""
                    // }
                    tabValue={"show"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* <AddLiquidity /> */}
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {};

const mapStateToProps = (state, ownProps) => {
  return {
    metaMaskAddress: state.metaMaskReducer.metaMaskAddress,
    contract: state.metaMaskReducer.contract,
    decimalsForLp: state.metaMaskReducer.decimalsForLp,
    decimalsForShow: state.metaMaskReducer.decimalsForShow,
    approvalForLp: state.metaMaskReducer.approvalForLp,
    approvalForShow: state.metaMaskReducer.approvalForShow,

    bnbPriceDollar: state.metaMaskReducer.bnbPriceDollar,
    showBNBPriceDollar: state.metaMaskReducer.showBNBPriceDollar,
    noOfShow: state.metaMaskReducer.noOfShow,
    noOfBNB: state.metaMaskReducer.noOfBNB,

    circulatingSuppLp: state.metaMaskReducer.circulatingSuppLp,
    totalFarms: state.metaMaskReducer.totalFarms,
    totalStakes: state.metaMaskReducer.totalStakes,

    APR_SHOW: state.metaMaskReducer.APR_SHOW,
    APY_SHOW: state.metaMaskReducer.APY_SHOW,
    APY_LP: state.metaMaskReducer.APY_LP,
    APR_LP: state.metaMaskReducer.APR_LP,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FarmHome);

{/* <div className="ammount-chip">
<div className="ammount-chip-item">
  <div className="block-chip-left">
    <h6>
      <FormattedMessage id={"aprStake"} />
    </h6>
    <h2>
      {" "}
      {insertComma(this.props.APY_LP.toFixed(2))}
      %
    </h2>
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
            {this.props.APR_LP !== "" ? (
              insertComma((this.props.APR_LP / 365).toFixed(4)) +
              " %"
            ) : (
              <ValueLoader />
            )}{" "}
          </span>
        </div>
      </li>
    </ul>
  </div>
</div>

<div className="ammount-chip-item">
  <div className="block-chip-left">
    <h6>
      <FormattedMessage id={"stakeSHOWAPR"} />
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
            {this.props.APR_SHOW !== "" ? (
              insertComma((this.props.APR_SHOW / 365).toFixed(4)) +
              " %"
            ) : (
              <ValueLoader />
            )}{" "}
          </span>
        </div>
      </li>
    </ul>
  </div>
</div>
</div> */}

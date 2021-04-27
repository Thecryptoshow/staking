/**
 * HomePage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */
import React, { Component } from 'react';
import './HomePageInnerDashboard.scss';
import Header from "../../component/Header";
import SideNav from "../../component/sideNav/sideNav";
import "./HomePageInnerDashboard.scss";

import HomeChild from "../homeChild/HomeChild"
import { Route, Switch, Redirect } from 'react-router-dom';
import FarmHome from '../farmPage';
import CryptoShow from '../gamePage/gamePage';



export default class HomePageInnerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "Form",
    };
  }

  changeSelectedTab(key) {
    this.setState({ selectedTab: key });
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="content-layout">
          <SideNav changeSelectedTab={this.changeSelectedTab.bind(this)} />
          <Switch>
            <Route exact path="/" component={HomeChild} />
            <Route exact path="/farm" component={FarmHome} />
            <Route exact path="/game" component={CryptoShow} />
            <Redirect to="/" />
          </Switch>
        </div>

      </React.Fragment>
    );
  }
}



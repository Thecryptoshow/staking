import "./App.scss";
import "./mycss.scss";
import React, { useState, useEffect } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import HomePage from "./containers/HomePage/index";
import HomePageInnerDashboard from "./containers/HomePageInnerDashboard";
//import { Provider } from "react-redux";

import PageNotFound from "./component/PageNotFound/pageNotFound";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
//import configureStore from "./configureStore";
import sideNav from "./component/sideNav/sideNav";
//import history from "./utils/history";
import "./i18n";
import i18next from "i18next";
import axios from "axios";
import { connect } from "react-redux";

import { IntlProvider } from "react-intl";
import locale_en from "./translations/en.json";


import NotificationDialog from "./component/NotificationDialog/notificationDialog";
//const initialState = {};
//const store = configureStore(initialState, history);
const messages = {
  en: locale_en,
  
};

let show = false;
function App(props) {
  const [showDialog, setShowDialog] = useState(false);

  function setShowModal() {
    show = false;
    setShowDialog(true);
  }
//  const languageDefault = localStorage.getItem('lang')

  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");
  localStorage.setItem("lang", lang)

  useEffect(() => {

    axios.defaults.headers.common["Accept-Language"] = lang;
    i18next.changeLanguage(lang);
    setLanguage(props.language);
    setLang(props.language);
  }, [props.language]);

  // let currentDateTime =
  //   new Date().getTime() - localStorage.getItem("lastVisit");
  // let difference = currentDateTime / (1000 * 60 * 60);
  //let difference = currentDateTime / (1000 * 0 * 0);
  // console.log(difference);
  // if (!showDialog && difference >= 1.0) {
  //   show = true;
  // }

  return (
    <div className="App">
      <ReactNotification />
      <IntlProvider locale={language} messages={messages[language]}>
        {show ? (
          <NotificationDialog setShowDialog={setShowModal}></NotificationDialog>
        ) : (
          <HashRouter>
            <Switch>
              <Route exact path="/sideNav" component={sideNav} />
              <Route exact path="/landing_page" component={HomePage} />
              <Route path="/" component={HomePageInnerDashboard} />
              <Route path="*" component={PageNotFound} />
            </Switch>
          </HashRouter>
        )}
      </IntlProvider>

    </div>
  );
}
const mapDispatchToProps = {};

const mapStateToProps = (state) => {
  return {
    language: state.metaMaskReducer.language,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);


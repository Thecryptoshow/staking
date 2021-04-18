import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
// import { IntlProvider } from "react-intl";
// import { addLocaleData } from "react-intl";
// import locale_en from "./translations/en.json";
import { ConnectedRouter } from "connected-react-router";
import history from "./utils/history";
import reportWebVitals from "./reportWebVitals";
import configureStore from "./configureStore";
import { Provider } from "react-redux";
// import PacmanLoader from "react-spinners/PacmanLoader";
import "./i18n";
//import i18next from "i18next";
//import axios from "axios";
// const lang = localStorage.getItem("lang") || "en";
// console.log(lang)
// axios.defaults.headers.common["Accept-Language"] = lang;
// i18next.changeLanguage(lang);

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById("root");

// const language = lang; // language without region code
// console.log("language", language);
// const messages = {
//   en: locale_en,
//   ko: locale_de,
// };

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>

    </Provider>
  </React.StrictMode>,
  MOUNT_NODE
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

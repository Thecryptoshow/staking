/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import history from "./utils/history";
//import globalReducer from './reducer';
// import languageProviderReducer from 'containers/LanguageProvider/reducer';
/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
// import loginReducer from './_reducers/auth.reducer';
// import userProfileReducer from './_reducers/profile.reducer';
// import emailCampaignReducer from './_reducers/emailCampaign.reducer';
import metaMaskReducer from "./_reducers/metaMaskReducer";

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    //global: globalReducer,
    // language: languageProviderReducer,
    // loginDetail: loginReducer,
    // userInfo: userDetailsReducer,
    // userProfile: userProfileReducer,
    // emailReducer: emailCampaignReducer,
    metaMaskReducer,
    router: connectRouter(history),
    ...injectedReducers,
  });

  return rootReducer;
}

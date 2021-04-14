import { setAPYLp } from "../_actions/metaMaskActions";
import {
  SET_META_MASK_ADDRESS,
  SET_CONTRACT,
  DELETE_CONTRACT,
  DELETE_META_MASK_ADDRESS,
  SET_APPROVAL_FOR_LP,
  SET_DECIMALS_FOR_SHOW,
  SET_APPROVAL_FOR_SHOW,
  SET_DECIMALS_FOR_LP,
  DELETE_APPROVAL_FOR_SHOW,
  DELETE_APPROVAL_FOR_LP,
  DELETE_DECIMALS_FOR_SHOW,
  DELETE_DECIMALS_FOR_LP,
  SET_VALUES_FOR_SHOW_PRICE,
  SET_TRANSACTION_IN_PROGRESS,
  SET_LANGUAGE,
  SET_CIR_SUPP_FOR_LP,
  SET_TOTAL_STAKES,
  SET_TOTAL_FARMS,
  SET_APY_LP,
  SET_APY_SHOW,
  SET_PROVIDER,
} from "../_actions/types";

let initialState = {
  provider: "",
  metaMaskAddress: "",
  contract: "",

  decimalsForLp: "",
  decimalsForShow: "",

  approvalForLp: false,
  approvalForShow: false,

  bnbPriceDollar: "",
  showBNBPriceDollar: "",

  transactionInProgress: false,
  language: localStorage.getItem("lang") || "en",

  noOfShow: 0,
  noOfBNB: 0,

  circulatingSuppLp: 0,

  totalFarms: 0,
  totalStakes: 0,

  APY_SHOW: 0,
  APY_LP: 0,

  APR_SHOW: 0,
  APR_LP: 0,

  emissionRate: 0,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_PROVIDER:
      return {
        ...state,
        provider: {...payload},
      };

    case SET_META_MASK_ADDRESS:
      localStorage.setItem("userConnected", true);
      return {
        ...state,
        metaMaskAddress: payload,
      };
    case SET_CONTRACT:
      return {
        ...state,
        contract: payload,
      };
    case DELETE_META_MASK_ADDRESS:
      return {
        ...state,
        metaMaskAddress: "",
      };
    case DELETE_CONTRACT:
      return {
        ...state,
        contract: "",
      };

    //decimal and approvalRequired
    case SET_DECIMALS_FOR_LP:
      return {
        ...state,
        decimalsForLp: payload,
      };
    case SET_DECIMALS_FOR_SHOW:
      return {
        ...state,
        decimalsForShow: payload,
      };

    case SET_APPROVAL_FOR_LP:
      // sessionStorage.setItem("approvalForLp", payload);
      return {
        ...state,
        approvalForLp: payload,
      };

    case SET_APPROVAL_FOR_SHOW:
      return {
        ...state,
        approvalForShow: payload,
      };

    case DELETE_DECIMALS_FOR_LP:
      return {
        ...state,
        decimalsForLp: payload,
      };
    case DELETE_DECIMALS_FOR_SHOW:
      return {
        ...state,
        decimalsForShow: payload,
      };
    case DELETE_APPROVAL_FOR_LP:
      return {
        ...state,
        approvalForLp: payload,
      };
    case DELETE_APPROVAL_FOR_SHOW:
      return {
        ...state,
        approvalForShow: payload,
      };

    case SET_VALUES_FOR_SHOW_PRICE:
      return {
        ...state,
        showBNBPriceDollar: payload.showBNBPriceDollar,
        bnbPriceDollar: payload.bnbPriceDollar,
        noOfShow: payload.noOfShow,
        noOfBNB: payload.noOfBNB,
      };

    case SET_CIR_SUPP_FOR_LP:
      return {
        ...state,
        circulatingSuppLp: action.payload,
      };

    case SET_TOTAL_FARMS:
      return {
        ...state,
        totalFarms: action.payload,
      };
    case SET_TOTAL_STAKES:
      return {
        ...state,
        totalStakes: action.payload,
      };

    case SET_TRANSACTION_IN_PROGRESS:
      return {
        ...state,
        transactionInProgress: payload,
      };
    case SET_LANGUAGE:
      return {
        ...state,
        language: payload,
      };

    case SET_APY_LP:
      return {
        ...state,
        APY_LP: payload.APY_LP,
        APR_LP: payload.APR_LP,
        emissionRate: payload.emissionRate,
      };
    case SET_APY_SHOW:
      return {
        ...state,
        APY_SHOW: payload.APY_SHOW,
        APR_SHOW: payload.APR_SHOW,
        emissionRate: payload.emissionRate,
      };

    default:
      return state;
  }
}

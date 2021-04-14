// import { showNotification } from "../component/Notifications/showNotification";
export async function getLpDecimals(contract, setDecimalsForLp) {
  contract.lpContract.methods
    .decimals()
    .call()
    .then((res) => {
      // console.log("decimals for lp", typeof res, res);
      setDecimalsForLp(parseInt(res));
    })
    .catch((err) => {
      //console.log("err decimals for lp", err);
      // showNotification("Error", err.message, "danger", 4000);
      return false;
    });
}

export function getShowDecimals(contract, setDecimalsForShow) {
  contract.showContract.methods
    .decimals()
    .call()
    .then((res) => {
      // console.log("decimals for show", typeof res, res);
      setDecimalsForShow(parseInt(res));
    })
    .catch((err) => {
      console.log("err decimals for show", err);
      // showNotification("Error", err.message, "danger", 4000);
      return false;
    });
}

// import { showNotification } from "../component/Notifications/showNotification";
import StakingContractAdd from "../config/contractAddress/StakingContractAdd";

export function getLpAllowance(metaMaskAddress, contract, setApprovalForLp) {
  contract.lpContract.methods
    .allowance(metaMaskAddress, StakingContractAdd)
    .call()
    .then((res) => {
      // console.log("allowance for lp", typeof res, res);
      if (parseInt(res) === 0) {
        setApprovalForLp(true);
      } else if (parseInt(res) > 0) {
        setApprovalForLp(false);
      }
    })
    .catch((err) => {
      //console.log("err allowance in lp", err);
      //   showNotification("Error", err.message, "danger", 4000);
      return false;
    });
}

export function getShowAllowance(
  metaMaskAddress,
  contract,
  setApprovalForShow
) {
  contract.showContract.methods
    .allowance(metaMaskAddress, StakingContractAdd)
    .call()
    .then((res) => {
      // console.log("allowance for show", typeof res, res);
      if (parseInt(res) === 0) {
        setApprovalForShow(true);
      } else if (parseInt(res) > 0) {
        setApprovalForShow(false);
      }
    })
    .catch((err) => {
      //console.log("err allowance in show", err);
      //   showNotification("Error", err.message, "danger", 4000);
      return false;
    });
}

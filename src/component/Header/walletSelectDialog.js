import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Modal, Button } from "react-bootstrap";
import metmaskicon from "../../assets/images/metmask-icon.svg";
import binanceIcon from "../../assets/images/binance-icon.svg";
import WalletConnect from "../../assets/images/WalletConnect.svg";

function WalletSelectDialog(props) {
  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        dialogClassName="modal-connect-ui"
        centered
        show={true}
        onHide={() => props.hideShow()}
      >
        {/* <Modal.Header closeButton> 
        </Modal.Header> */}

        <Modal.Body> 

        <div className="wallet-connect-list">
        <div className="wallet-connect-item">
          <div className="cta-" onClick={()=> props.connectWithWallet("metamask")}>
          <img src={metmaskicon}/>
          <h5>Meta mask</h5>
          <p>Coonect to your MetaMask Wallet</p>
          </div>
        </div>
        <div className="wallet-connect-item second-child">
        <div className="cta-" onClick={()=> props.connectWithWallet("binanceSmartChain")}>
        <img src={binanceIcon}/>
          <h5 style={{cursor:'pointer'}} >Binance Chain Wallet</h5>
          <p>Binance chain wallet</p>
          </div>
        </div>
        <div className="wallet-connect-item" onClick={()=> props.connectWithWallet("walletConnect")}>
        <div className="cta-">
          <img src={WalletConnect}/>
           <h5 style={{cursor:'pointer'}} >Wallet Connect</h5>  
           <p>Wallet Connect for Binance Smart Chain</p>
           </div>
        </div>
          
        </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(WalletSelectDialog);

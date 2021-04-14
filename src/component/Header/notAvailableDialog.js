import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { Modal } from "react-bootstrap";
function LoadingDialog(props) {
  return (
    <>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={true}
        onHide={() => props.hideShow()}
      > 
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id={"mobileSupport"} /></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center mb-4">
          <FormattedMessage id={"mobileComingSoon"} />
            
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default React.memo(LoadingDialog);

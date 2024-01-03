import React, { useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { format, parseISO } from 'date-fns';

const StockTransferChallansCard = (props) => {
  const { selectedCompanyId, stockTransfer, stockTransferMutate } = props || {};

  const { id, customer, dispatchNo, dispatchDate, dispatchType } = stockTransfer;

  const { name } = customer || {};

  return (
    <Card className="card-box">
      <Card.Body>
        <Card.Text className="text"><span>Customer Name: </span>{name}</Card.Text>
        <Card.Text className="text"><span>Dispatch No: </span>{dispatchNo}</Card.Text>
        <Card.Text className="text"><span>Dispatch Date: </span>{dispatchDate ? format(parseISO(dispatchDate), "dd-MM-yyyy") : ""}</Card.Text>
        <Card.Text className="text"><span>Dispatch Type: </span>{dispatchType}</Card.Text>
      </Card.Body>
      <StockTransferModal selectedCompanyId={selectedCompanyId} stockTransferMutate={stockTransferMutate} dispatchId={id} dispatchNo={dispatchNo} />
    </Card>
  );
};

const StockTransferModal = ({ selectedCompanyId, stockTransferMutate, dispatchId, dispatchNo }) => {

  const { isSuccess } = stockTransferMutate;
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  }

  const handleTransfer = () => {
    const requestBody = {
      dispatchId: dispatchId,
      companyId: selectedCompanyId
    };
    stockTransferMutate(requestBody);
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess]);

  return (
    <div>
      <Button variant="link" className="form-btn confirm" onClick={() => setShowModal(true)} >Confirm Stock Transfer</Button>
      <Modal show={showModal} onHide={handleClose} centered className="dialog">
        <Modal.Header closeButton className="dialog-h">
          <Modal.Title className="dialog-t">
            Stock Tranfer:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to confirm a Stock Transfer: {dispatchNo} ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="form-btn save" variant="link"
            onClick={handleTransfer}
          >
            Transfer
          </Button>
          <Button
            className="form-btn cancel"
            variant="link"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StockTransferChallansCard;

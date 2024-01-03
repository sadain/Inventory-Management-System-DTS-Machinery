import React, { useState } from "react";
import { HiArrowLongLeft } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const Header = ({ category, title, backTo, recordList }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const goBack = () => {
    if (!backTo && !recordList) {
      navigate(-1);
    } else if (backTo && recordList.length > 0) {
      navigate(backTo);
    } else {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmBack = () => {
    navigate(backTo);
  };

  return (
    <div className="items-center">
      <div>
        <button onClick={goBack} className="back-button">
          <HiArrowLongLeft className="back-icon" />
          <h6 className="text-gray-500 header back-text">{category}</h6>
        </button>
      </div>
      <div className="mb-5">
        <h5 className="text-3xl font-bold text-slate-900 header">{title}</h5>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered className="dialog">
        <Modal.Header closeButton className="dialog-h">
          <Modal.Title className="dialog-t">Confirm Back:</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleConfirmBack}>
          <Modal.Body>
            This record is empty. Are you sure you want to go back?
          </Modal.Body>
          <Modal.Footer>
            <Button className="form-btn save" variant="link" type="submit">
              Confirm
            </Button>
            <Button className="form-btn cancel" variant="link" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Header;

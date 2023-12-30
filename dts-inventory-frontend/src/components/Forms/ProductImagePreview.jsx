import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsCardImage } from "react-icons/bs";
import { useImagePreview } from "api/useApi"

const { Group } = Form;

const ProductImagePreview = (props) => {
  const { productRow } = props || {};

  const { data: productsImageList } = useImagePreview({ productId: productRow.id });

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { picture } = productsImageList || {};

  const isImageAvailable = picture !== "-";

  return (
    <div>
      <Button
        onClick={() => setShow(true)}
        variant="link"
        className="form-btn"
        style={{ display: "flex", alignItems: "center" }}
        disabled={!isImageAvailable}
      >
        <BsCardImage className="text-lg mr-1.5" />
        <span>View</span>
      </Button>
      <Modal show={show} onHide={handleClose} centered className="dialog">
        <Modal.Header closeButton className="dialog-h">
          <Modal.Title className="dialog-t">
            Product Image : {productRow.name}
          </Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Group className="form-floating">
              {isImageAvailable ? (
                <img src={picture} alt={productRow.name} />
              ) : (
                <span>No image available</span>
              )}
            </Group>
          </Modal.Body>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductImagePreview;

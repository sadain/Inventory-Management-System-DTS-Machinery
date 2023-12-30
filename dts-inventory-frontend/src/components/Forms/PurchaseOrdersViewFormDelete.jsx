import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs'
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { usePurchaseOrdersViewDeleteMutation } from "api/useApi";

const { Group } = Form;

const PurchaseOrdersViewFormDelete = (props) => {
  const { type, queryClient, purchaseOrderRow } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: purchaseOrdersViewDeleteMutate } = usePurchaseOrdersViewDeleteMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allPurchaseOrdersData"],
      });
      toast.success("Purchase Order Record deleted successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const {
    handleSubmit,
  } = useForm({
    isDirty: true,
    defaultValues: {
      productId: purchaseOrderRow ? purchaseOrderRow.productId : "",
      supplierDescription: purchaseOrderRow ? purchaseOrderRow.supplierDescription : "",
      color: purchaseOrderRow ? purchaseOrderRow.color : "",
      unit: purchaseOrderRow ? purchaseOrderRow.unit : "",
      quantity: purchaseOrderRow ? purchaseOrderRow.quantity : "",
      unitPrice: purchaseOrderRow ? purchaseOrderRow.unitPrice : "",
      totalPrice: purchaseOrderRow ? purchaseOrderRow.totalPrice : "",
      purchaseOrderId: purchaseOrderRow ? purchaseOrderRow.purchaseOrderId : "",
    },
  });

  const onSubmit = () => {
    purchaseOrdersViewDeleteMutate(purchaseOrderRow);
  };

  return (
    <div>
      <Button onClick={() => setShow(true)} variant="link" className="form-btn" style={{ display: "flex", alignItems: "center" }}>
        <BsTrash className="text-lg mr-1.5" />
        <span>Delete</span>
      </Button>
      <Modal show={show} onHide={handleClose} centered className="dialog">
        <Modal.Header closeButton className="dialog-h">
          <Modal.Title className="dialog-t">
            {type === "delete" ? "Confirm Delete Record" : ""}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Group className="form-floating">
              <p>
                Are you sure you want to delete this PurchaseOrder ID:{" "}
                {purchaseOrderRow?.id} ?
              </p>
            </Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className="form-btn save" variant="link" type="submit">
              Delete
            </Button>
            <Button
              className="form-btn cancel"
              variant="link"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PurchaseOrdersViewFormDelete;

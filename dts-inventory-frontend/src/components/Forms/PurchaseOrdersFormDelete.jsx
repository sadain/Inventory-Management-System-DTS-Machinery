import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs';
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { usePurchaseOrdersDeleteMutation } from "api/useApi";

const { Group } = Form;

const PurchaseOrdersFormDelete = (props) => {
  const { type, queryClient, purchaseOrderRow } = props || {};

  const { invoiceNo } = purchaseOrderRow;

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: purchaseOrderDeleteMutate } = usePurchaseOrdersDeleteMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allPurchaseOrdersData"],
      });
      toast.success("Purchase Order deleted successfully!");
    },
    onError: (error) => {
      if (error.includes("REFERENCE constraint")) {
        toast.error("Can't delete this purchase order as it is used in another screen");
      } else {
        toast.error(error);
        toast.error(error.response.data);
      }
    },
  });

  const {
    handleSubmit,
  } = useForm({
    defaultValues: {
      supplierId: purchaseOrderRow ? purchaseOrderRow.supplierId : "",
      invoiceNo: purchaseOrderRow ? purchaseOrderRow.invoiceNo : "",
      invoiceDate: purchaseOrderRow ? purchaseOrderRow.invoiceDate : "",
    },
  });

  const onSubmit = () => {
    purchaseOrderDeleteMutate(purchaseOrderRow);
  };

  return (
    <div>
      <Button className="delete-btn" onClick={() => setShow(true)} variant="link" style={{ display: "flex", alignItems: "center" }}>
        <BsTrash className="text-lg mr-1" />
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
                Are you sure you want to delete record name: "{invoiceNo}"?
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

export default PurchaseOrdersFormDelete;

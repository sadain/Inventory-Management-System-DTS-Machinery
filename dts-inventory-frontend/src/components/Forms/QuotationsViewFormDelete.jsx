import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs'
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useQuotationsViewDeleteMutation } from "api/useApi";

const { Group } = Form;

const QuotationsViewFormDelete = (props) => {
  const { type, queryClient, quotationRow } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: quotationDeleteMutate } = useQuotationsViewDeleteMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allQuotationsData"],
      });
      toast.success("Quotation Record deleted successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const {
    handleSubmit,
  } = useForm({
    defaultValues: {
      productId: quotationRow ? quotationRow.productId : "",
      quantity: quotationRow ? quotationRow.quantity : "",
      unitPrice: quotationRow ? quotationRow.unitPrice : "",
      totalPrice: quotationRow ? quotationRow.totalPrice : "",
      quotationId: quotationRow ? quotationRow.quotationId : "",
    },
  });

  const onSubmit = () => {
    quotationDeleteMutate(quotationRow);
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
                Are you sure you want to delete this Quotation ID:{" "}
                {quotationRow?.id} ?
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

export default QuotationsViewFormDelete;

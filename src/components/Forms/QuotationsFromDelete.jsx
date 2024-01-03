import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs'
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useQuotationsDeleteMutation } from "api/useApi";

const { Group } = Form;

const QuotationsFormDelete = (props) => {
  const { type, queryClient, quotationRow } = props || {};

  const { id, quotationNo } = quotationRow;

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: quotationDeleteMutate } = useQuotationsDeleteMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allQuotationsData"],
      });
      toast.success("Quotation deleted successfully!");
    },
    onError: (error) => {
      if (error.includes("REFERENCE constraint")) {
        toast.error("Can't delete this quotation as it is used in another screen");
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
      customerId: quotationRow ? quotationRow.customerId : "",
      quotationNo: quotationRow ? quotationRow.quotationNo : "",
      quotationDate: quotationRow ? quotationRow.quotationDate : "",
      currency: quotationRow ? quotationRow.currency : "",
    },
  });

  const onSubmit = () => {
    quotationDeleteMutate(quotationRow);
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
        <Form onSubmit={handleSubmit((data) => onSubmit(data, id))}>
          <Modal.Body>
            <Group className="form-floating">
              <p>
                Are you sure you want to delete record name:
                "{quotationNo}"
                ?
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

export default QuotationsFormDelete;

import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs'
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useProformaInvoiceViewDeleteMutation } from "api/useApi";

const { Group } = Form;

const ProformaInvoiceViewFormDelete = (props) => {
  const { type, queryClient, proformaInvoiceRow } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: proformaInvoiceDeleteMutate } = useProformaInvoiceViewDeleteMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allProformaInvoiceData"],
      });
      toast.success("Proforma Invoice deleted successfully!");
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
      productId: proformaInvoiceRow ? proformaInvoiceRow.productId : "",
      quantity: proformaInvoiceRow ? proformaInvoiceRow.quantity : "",
      unitPrice: proformaInvoiceRow ? proformaInvoiceRow.unitPrice : "",
      totalPrice: proformaInvoiceRow ? proformaInvoiceRow.totalPrice : "",
      proformaInvoiceRecordId: proformaInvoiceRow ? proformaInvoiceRow.proformaInvoiceRecordId : "",
    },
  });

  const onSubmit = () => {
    proformaInvoiceDeleteMutate(proformaInvoiceRow);
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
          {/* <Form onSubmit={handleSubmit((data) => onSubmit(data, proformaInvoiceRow?.id))}> */}
          <Modal.Body>
            <Group className="form-floating">
              {/* <p> */}
              {/* Are you sure you want to delete this record? */}
              {/* "{proformaInvoiceRow}" */}
              {/* </p> */}
              <p>
                Are you sure you want to delete this Quotation ID:{" "}
                {proformaInvoiceRow?.id} ?
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

export default ProformaInvoiceViewFormDelete;

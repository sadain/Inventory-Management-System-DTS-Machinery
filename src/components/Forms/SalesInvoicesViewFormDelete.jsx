import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs'
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSalesInvoiceViewDeleteMutation } from "api/useApi"

const { Group } = Form;

const SalesInvoicesViewFormDelete = (props) => {
  const { type, queryClient, salesInvoiceRow } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: salesInvoiceViewDeleteMutate } = useSalesInvoiceViewDeleteMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allSalesInvoiceData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allProductsData"],
      });
      toast.success("Sales Invoice Record deleted successfully!");
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
      productId: salesInvoiceRow ? salesInvoiceRow : "",
      quantity: salesInvoiceRow ? salesInvoiceRow.quantity : "",
      rate: salesInvoiceRow ? salesInvoiceRow.rate : "",
      discount: salesInvoiceRow ? salesInvoiceRow.discount : "",
      cgstRate: salesInvoiceRow ? salesInvoiceRow.cgstRate : "",
      sgstRate: salesInvoiceRow ? salesInvoiceRow.sgstRate : "",
      igstRate: salesInvoiceRow ? salesInvoiceRow.igstRate : "",
    },
  });

  const onSubmit = () => {
    salesInvoiceViewDeleteMutate(salesInvoiceRow);
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
                Are you sure you want to delete this Sales Invoice ID:{" "}
                {salesInvoiceRow?.id} ?
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

export default SalesInvoicesViewFormDelete;

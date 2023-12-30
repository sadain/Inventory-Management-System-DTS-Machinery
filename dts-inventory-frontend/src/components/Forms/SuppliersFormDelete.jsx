import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs'
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSupplierDeleteMutation } from "api/useApi"

const { Group } = Form;

const SuppliersFormDelete = (props) => {
  const { type, queryClient, SupplierRow } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: supplierDeleteMutate } = useSupplierDeleteMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allSuppliersData"],
      });
      toast.success("Supplier deleted successfully!");
    },
    onError: (error) => {
      if (error.includes("REFERENCE constraint")) {
        toast.error("Can't delete this supplier as it is used in another screen");
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
      name: SupplierRow ? SupplierRow.name : "",
      address: SupplierRow ? SupplierRow.address : "",
      city: SupplierRow ? SupplierRow.city : "",
      phone: SupplierRow ? SupplierRow.phone : "",
      fax: SupplierRow ? SupplierRow.fax : "",
      postalCode: SupplierRow ? SupplierRow.postalCode : "",
      countryId: SupplierRow ? SupplierRow.countryId : "",
      stateId: SupplierRow ? SupplierRow.stateId : "",
    },
  });

  const onSubmit = () => {
    supplierDeleteMutate(SupplierRow);
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
        <Form onSubmit={handleSubmit((data) => onSubmit(data, SupplierRow?.id))}>
          <Modal.Body>
            <Group className="form-floating">
              <p>
                Are you sure you want to delete record name: "{SupplierRow.name}"
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

export default SuppliersFormDelete;

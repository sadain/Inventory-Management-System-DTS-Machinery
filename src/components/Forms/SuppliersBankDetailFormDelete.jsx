import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs'
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSupplierBankDetailDeleteMutation } from "api/useApi"

const { Group } = Form;

const SuppliersBankDetailFormDelete = (props) => {
  const { type, queryClient, suppliersBankDetailRow } = props || {};

  const { accountName } = suppliersBankDetailRow;

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const {mutate: supplierBankDetailDeleteMutate} = useSupplierBankDetailDeleteMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allSupplierBanksData"],
      });
      toast.success("Bank Details deleted successfully!");
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
        accountName: suppliersBankDetailRow ? suppliersBankDetailRow.accountName : "",
        bankName: suppliersBankDetailRow ? suppliersBankDetailRow.bankName : "",
        accountNumber: suppliersBankDetailRow ? suppliersBankDetailRow.accountNumber : "",
        ifscCode: suppliersBankDetailRow ? suppliersBankDetailRow.ifscCode : "",
        swiftCode: suppliersBankDetailRow ? suppliersBankDetailRow.swiftCode : "",
    },
  });

  const onSubmit = () => {
      supplierBankDetailDeleteMutate(suppliersBankDetailRow);
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
        <Form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <Modal.Body>
            <Group className="form-floating">
            <p>
                Are you sure you want to delete record name: 
                "{accountName}" 
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

export default SuppliersBankDetailFormDelete;

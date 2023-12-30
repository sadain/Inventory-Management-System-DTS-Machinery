import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs'
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useHsnConfigurationDeleteMutation } from "api/useApi"

const { Group } = Form;

const HsnConfigurationFormDelete = (props) => {
  const { type, queryClient, HsnConfigurationRow } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: hsnConfigurationDeleteMutate } = useHsnConfigurationDeleteMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allHsnConfigurationData"],
      });
      toast.success("HSN deleted successfully!");
    },
    onError: (error) => {
      if (error.includes("REFERENCE constraint")) {
        toast.error("Can't delete this HSN as it is used in another screen");
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
      hsn: HsnConfigurationRow ? HsnConfigurationRow.hsn : "",
      description: HsnConfigurationRow ? HsnConfigurationRow.description : "",
      cgst: HsnConfigurationRow ? HsnConfigurationRow.cgst : "",
      sgst: HsnConfigurationRow ? HsnConfigurationRow.sgst : "",
      igst: HsnConfigurationRow ? HsnConfigurationRow.igst : "",
    },
  });

  const onSubmit = () => {
    hsnConfigurationDeleteMutate(HsnConfigurationRow);
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
        <Form onSubmit={handleSubmit((data) => onSubmit(data, HsnConfigurationRow?.id))}>
          <Modal.Body>
            <Group className="form-floating">
              <p>
                Are you sure you want to delete HSN: "{HsnConfigurationRow.hsn}"
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

export default HsnConfigurationFormDelete;
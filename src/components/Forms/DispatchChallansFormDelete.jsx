import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs'
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatchChallansDeleteMutation } from "api/useApi";

const { Group } = Form;

const DispatchChallansFormDelete = (props) => {
  const { type, queryClient, DispatchChallanRow } = props || {};

  const { id, dispatchNo } = DispatchChallanRow;

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: dispatchChallanDeleteMutate } = useDispatchChallansDeleteMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allDispatchChallansData"],
      });
      toast.success("Dispatch Challan deleted successfully!");
    },
    onError: (error) => {
      if (error.includes("REFERENCE constraint")) {
        toast.error("Can't delete this dispatch challan as it is used in another screen");
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
      customerId: DispatchChallanRow ? DispatchChallanRow.customerId : "",
      dispatchNo: DispatchChallanRow ? DispatchChallanRow.dispatchNo : "",
      dispatchDate: DispatchChallanRow ? DispatchChallanRow.dispatchDate : "",
      dispatchType: DispatchChallanRow ? DispatchChallanRow.dispatchType : "",
    },
  });

  const onSubmit = () => {
    dispatchChallanDeleteMutate(DispatchChallanRow);
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
                "{dispatchNo}"
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

export default DispatchChallansFormDelete;
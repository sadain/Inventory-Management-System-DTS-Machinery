import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs'
import { useForm } from "react-hook-form";
import { useCompaniesDeleteMutation } from "api/useApi"
import { toast } from "react-toastify";

const { Group } = Form;

const CompaniesFormDelete = (props) => {
  const { type, queryClient, companiesRow } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: companiesDeleteMutate } = useCompaniesDeleteMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allCompaniesData"],
      });
      toast.success("Company deleted successfully!");
    },
    onError: (error) => {
      if (error.includes("REFERENCE constraint")) {
        toast.error("Can't delete this company as it is used in another screen");
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
      name: companiesRow ? companiesRow.name : "",
      address: companiesRow ? companiesRow.address : "",
      city: companiesRow ? companiesRow.city : "",
      phone: companiesRow ? companiesRow.phone : "",
      gstIn: companiesRow ? companiesRow.gstIn : "",
      iecNo: companiesRow ? companiesRow.iecNo : "",
      pan: companiesRow ? companiesRow.pan : "",
      cinNo: companiesRow ? companiesRow.cinNo : "",
      postalCode: companiesRow ? companiesRow.postalCode : "",
      countryId: companiesRow ? companiesRow.countryId : null,
      stateId: companiesRow ? companiesRow.stateId : null,
    },
  });

  const onSubmit = () => {
    companiesDeleteMutate(companiesRow);
  };

  return (
    <div className="">
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
        <Form onSubmit={handleSubmit((data) => onSubmit(data, companiesRow?.id))}>
          <Modal.Body>
            <Group className="form-floating">
              <p>
                Are you sure you want to delete record name: "{companiesRow.name}"
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

export default CompaniesFormDelete;

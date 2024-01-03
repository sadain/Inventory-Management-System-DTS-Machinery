import React, { useState } from "react";
import { Modal, Button, Form, Collapse } from "react-bootstrap";
import { BsBuildingCheck } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUserAssignCompaniesMutation } from "api/useApi";

const UserAssignCompaniesFormAction = (props) => {
  const { userRow, companiesList, queryClient } = props || {};
  const { id: userId } = userRow;

  const [show, setShow] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [selectedcompanies, setSelectedcompanies] = useState([]);

  const { mutate: userAssignMutateCompanies } = useUserAssignCompaniesMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allUsersData"],
      });
      toast.success("User assigned successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const toggleCollapse = () => {
    setOpenCollapse(!openCollapse);
  };

  const handlecompaniesSelection = (companiesName) => {
    if (selectedcompanies.includes(companiesName)) {
      setSelectedcompanies(selectedcompanies.filter((companies) => companies !== companiesName));
    } else {
      setSelectedcompanies([...selectedcompanies, companiesName]);
    }
  };

  const onSubmit = () => {
    const reqData = {
      userId,
      companyIds: selectedcompanies,
    };
    userAssignMutateCompanies(reqData);
    reset();
  };

  return (
    <div>
      <Button
        onClick={() => setShow(true)}
        variant="link"
        className="form-btn"
        style={{ display: "flex", alignItems: "center" }}
      >
        <BsBuildingCheck className="text-lg mr-1.5" />
        <span>Assign companies</span>
      </Button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        className="dialog"
      >
        <Modal.Header closeButton className="dialog-h">
          <Modal.Title className="dialog-t">Assign companies</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="permission-item">
              <Button
                onClick={toggleCollapse}
                aria-controls="companies-collapse"
                aria-expanded={openCollapse}
                variant="link"
                className="checkbox-button open"
              >
                <label>Select companies</label>
                <FiChevronDown className="dropdown-icon" />
              </Button>
              <Collapse className="checkbox-child" in={openCollapse}>
                <div id="companies-collapse">
                  {companiesList &&
                    companiesList.map((companies) => (
                      <Form.Check
                        key={companies.id}
                        type="checkbox"
                        label={companies.name}
                        onChange={() => handlecompaniesSelection(companies.id)}
                        checked={selectedcompanies.includes(companies.id)}
                      />
                    ))}
                </div>
              </Collapse>
            </div>
            {errors.companies && (
              <p className="text-red-500">{errors.companies.message}</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button className="form-btn save" variant="link" type="submit">
              Save
            </Button>
            <Button
              className="form-btn cancel"
              variant="link"
              onClick={() => setShow(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserAssignCompaniesFormAction;

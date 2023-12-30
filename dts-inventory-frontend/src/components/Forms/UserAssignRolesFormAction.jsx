import React, { useState } from "react";
import { Modal, Button, Form, Collapse } from "react-bootstrap";
import { MdOutlineAssignmentInd } from "react-icons/md";
import { FiChevronDown } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUserAssignRolesMutation } from "api/useApi";

const UserAssignRolesFormAction = (props) => {
  const { userRow, rolesList, queryClient } = props || {};
  const { id: userId } = userRow;

  const [show, setShow] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const { mutate: userAssignMutateRoles } = useUserAssignRolesMutation({
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

  const handleRoleSelection = (roleName) => {
    if (selectedRoles.includes(roleName)) {
      setSelectedRoles(selectedRoles.filter((role) => role !== roleName));
    } else {
      setSelectedRoles([...selectedRoles, roleName]);
    }
  };

  const onSubmit = () => {
    const reqData = {
      userId,
      roles: selectedRoles,
    };
    userAssignMutateRoles(reqData);
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
        <MdOutlineAssignmentInd className="text-lg mr-1.5" />
        <span>Assign Roles</span>
      </Button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        className="dialog"
      >
        <Modal.Header closeButton className="dialog-h">
          <Modal.Title className="dialog-t">Assign Roles</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="permission-item">
              <Button
                onClick={toggleCollapse}
                aria-controls="role-collapse"
                aria-expanded={openCollapse}
                variant="link"
                className="checkbox-button open"
              >
                <label>Select Roles</label>
                <FiChevronDown className="dropdown-icon" />
              </Button>
              <Collapse className="checkbox-child" in={openCollapse}>
                <div id="role-collapse">
                  {rolesList &&
                    rolesList.map((role) => (
                      <Form.Check
                        key={role.id}
                        type="checkbox"
                        label={role.name}
                        onChange={() => handleRoleSelection(role.name)}
                        checked={selectedRoles.includes(role.name)}
                      />
                    ))}
                </div>
              </Collapse>
            </div>
            {errors.roles && (
              <p className="text-red-500">{errors.roles.message}</p>
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

export default UserAssignRolesFormAction;

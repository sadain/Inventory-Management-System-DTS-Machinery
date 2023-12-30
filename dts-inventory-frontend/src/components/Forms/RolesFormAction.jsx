import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Collapse } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRoleMutation, usePermission } from "api/useApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "components/Loader";

const schema = z.object({
  roleName: z.string().min(3, "Role Name is required"),
});

const { Group, Control, Label } = Form;

const RolesFormAction = (props) => {
  const { type, queryClient, rolesRow } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  const { data: permissionList, isLoading: spinLoading } = usePermission();

  const [show, setShow] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [openItems, setOpenItems] = useState([]);

  function handleClose() {
    setShow(false);
  }

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const { mutate: roleMutate } = useRoleMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allRolesData"],
      });
      toast.success("Roles added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      roleName: rolesRow ? rolesRow.roleName : "",
      permissions: rolesRow ? rolesRow.permissions : "",
    },
  });

  const onSubmit = (data, id) => {
    const { roleName } = data;

    const reqData = {
      roleName,
      permissions: selectedPermissions,
    };

    roleMutate(reqData);
  };

  const handlePermissionChange = (e, permissionId) => {
    const isChecked = e.target.checked;

    const isParentPermission = !permissionList.some(
      (permission) =>
        permission.childPermissions.length > 0 &&
        permission.childPermissions.some(
          (childPermission) => childPermission.id === permissionId
        )
    );

    if (isParentPermission) {
      const childPermissionsIds = permissionList
        .find((permission) => permission.parentId === permissionId)
        .childPermissions.map((childPermission) => childPermission.id);

      if (isChecked) {
        setSelectedPermissions((prevPermissions) => [
          ...prevPermissions,
          permissionId,
          ...childPermissionsIds,
        ]);
      } else {
        setSelectedPermissions((prevPermissions) =>
          prevPermissions.filter(
            (permission) =>
              permission !== permissionId &&
              !childPermissionsIds.includes(permission)
          )
        );
      }
    } else {
      if (isChecked) {
        setSelectedPermissions((prevPermissions) => [
          ...prevPermissions,
          permissionId,
        ]);
      } else {
        setSelectedPermissions((prevPermissions) =>
          prevPermissions.filter((permission) => permission !== permissionId)
        );
      }
    }
  };

  if (!permissionList) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  const toggleItem = (itemId) => {
    const updatedOpenItems = [...openItems];
    const index = updatedOpenItems.indexOf(itemId);
    if (index !== -1) {
      updatedOpenItems.splice(index, 1);
    } else {
      updatedOpenItems.push(itemId);
    }
    setOpenItems(updatedOpenItems);
  };

  return (
    <div>
      <Button
        onClick={() => setShow(true)}
        variant={type === "add" ? "primary" : "link"}
        className={type === "add" ? "btn-toolbar" : "form-btn"}
        style={{ display: "flex", alignItems: "center" }}
      >
        {type === "add" ? (
          <AiOutlinePlus className="text-lg mr-1.5" />
        ) : (
          <BsPencilSquare className="text-lg mr-1.5" />
        )}
        <span>{type === "add" ? "Add" : "Edit"}</span>
      </Button>
      <Modal show={show} onHide={handleClose} centered className="dialog">
        <Modal.Header closeButton className="dialog-h">
          <Modal.Title className="dialog-t">
            {type === "add" ? "Add New Record" : "Edit Record"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit((data) => onSubmit(data, rolesRow?.id))}>
          <Modal.Body>
            <Group className="form-floating">
              <Control
                id="inputRoleName"
                className="form-control"
                type="text"
                {...register("roleName")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputRoleName">Role Name</Label>
              {errors.roleName?.message && (
                <p className="text-red-500">{errors.roleName?.message}</p>
              )}
            </Group>
            <p className="permissions-title">Assign Permissions</p>
            {permissionList.map((permission) => (
              <div key={permission.parentId} className="permission-item">
                <Button
                  onClick={() => toggleItem(permission.parentId)}
                  aria-controls={`btn-collapse-${permission.parentId}`}
                  aria-expanded={openItems.includes(permission.parentId)}
                  variant="link"
                  className={`checkbox-button ${openItems.includes(permission.parentId) ? "open" : ""
                    }`}
                >
                  <div className="button-content">
                    <Form.Check
                      type="checkbox"
                      id={`permission-${permission.parentId}`}
                      label={permission.parentPermission}
                      value={permission.parentId}
                      onChange={(e) =>
                        handlePermissionChange(e, permission.parentId)
                      }
                      checked={selectedPermissions.includes(permission.parentId)}
                    />
                  </div>
                  <FiChevronDown className="dropdown-icon" />
                </Button>
                <Collapse
                  className="checkbox-child"
                  in={openItems.includes(permission.parentId)}
                >
                  <div id={`btn-collapse-${permission.parentId}`}>
                    {permission.childPermissions.map((childPermission) => (
                      <Form.Check
                        key={childPermission.id}
                        type="checkbox"
                        id={`permission-${childPermission.id}`}
                        label={childPermission.description}
                        value={childPermission.id}
                        onChange={(e) =>
                          handlePermissionChange(e, childPermission.id)
                        }
                        checked={selectedPermissions.includes(childPermission.id)}
                      />
                    ))}
                  </div>
                </Collapse>
              </div>
            ))}
            {errors.permissions?.message && (
              <p className="text-red-500">{errors.permissions?.message}</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button className="form-btn save" variant="link" type="submit">
              Save
            </Button>
            <Button
              className="form-btn cancel"
              variant="link"
              onClick={handleClose}
            >
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default RolesFormAction;

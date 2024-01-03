import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from 'react-icons/ai';
import { BsPencilSquare } from 'react-icons/bs';
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUserMutation } from "api/useApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  userName: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(3, "Password is required"),
  firstName: z.string().min(3, "First Name is required"),
  lastName: z.string().min(3, "User Name is required"),
  companyId: z.string().min(1, "Company Name is required"),
});

const { Group, Control, Label, Select } = Form;

const UserFormAction = (props) => {
  const { type, queryClient, userRow, companiesList } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: userMutate } = useUserMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allUsersData"],
      });
      toast.success("User added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { companies } = userRow || {};

  const filterByCompaniesName = companiesList
    ? String(companiesList.find((item) => item.name === companies)?.id)
    : "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    isDirty: true,
    defaultValues: {
      userName: userRow ? userRow.userName : "",
      password: userRow ? userRow.password : "",
      firstName: userRow ? userRow.firstName : "",
      lastName: userRow ? userRow.lastName : "",
      companyId: userRow ? filterByCompaniesName : "",
    },
  });

  useEffect(() => {
    if (show && type === "edit") {
      if (companiesList) {
        reset({ companyId: userRow ? filterByCompaniesName : "" });
      }
    }
  }, [companiesList, show, type]);

  const onSubmit = (data, id) => {
    const { userName, password, firstName, lastName, companyId } = data;

    const reqData = { userName, password, firstName, lastName, companyId: Number(companyId) };

    userMutate(reqData);
    reset();
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
        <Form onSubmit={handleSubmit((data) => onSubmit(data, userRow?.id))}>
          <Modal.Body>
            <Group className="form-floating">
              <Control
                id="inputUserName"
                className="form-control"
                type="email"
                {...register("userName")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputUserName">Email</Label>
              {errors.userName?.message && <p className="text-red-500">{errors.userName?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputPassword"
                className="form-control"
                type="text"
                {...register("password")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputPassword">Password</Label>
              {errors.password?.message && <p className="text-red-500">{errors.password?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputFirstName"
                className="form-control"
                type="text"
                {...register("firstName")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputFirstName">First Name</Label>
              {errors.firstName?.message && <p className="text-red-500">{errors.firstName?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputLastName"
                className="form-control"
                type="text"
                {...register("lastName")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputLastName">Last Name</Label>
              {errors.lastName?.message && <p className="text-red-500">{errors.lastName?.message}</p>}
            </Group>
            {/*  */}
            <Group className="form-floating">
              <Select
                id="inputCompany"
                {...register("companyId")}
              >
                <option value="">Select company</option>
                {companiesList &&
                  companiesList.map((companies) => (
                    <option key={companies.id} value={String(companies.id)}>
                      {companies.name}
                    </option>
                  ))}
              </Select>
              <Label htmlFor="inputCompany">Company Name</Label>
              {errors.companyId?.message && <p className="text-red-500">{errors.companyId?.message}</p>}
            </Group>
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


export default UserFormAction;

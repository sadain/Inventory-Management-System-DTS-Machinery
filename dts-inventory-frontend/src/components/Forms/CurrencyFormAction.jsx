import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { useCurrencyMutation, useCurrencyEditMutation } from "api/useApi";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(3, "Name is required"),
});

const { Group, Control, Label } = Form;

const CurrencyFormAction = (props) => {
  const { type, queryClient, currencyRow } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: currencyMutate } = useCurrencyMutation({
    onSuccess: () => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allCurrencyData"],
      });
      toast.success("Currency added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: currencyEditMutate } = useCurrencyEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allCurrencyData"],
      });
      toast.success("Currency updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    isDirty: true,
    defaultValues: {
      name: currencyRow ? currencyRow.name : "",
    },
  });

  const onSubmit = (data, id) => {
    const { name } = data;

    const reqData = {
      name,
    };

    if (currencyRow?.id !== undefined) {
      currencyEditMutate({ id: currencyRow.id, ...reqData });
    } else {
      currencyMutate(reqData);
      reset();
    }
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
        <Form
          onSubmit={handleSubmit((data) => onSubmit(data, currencyRow?.id))}
        >
          <Modal.Body>
            <Group className="form-floating">
              <Control
                id="inputName"
                className="form-control"
                type="text"
                {...register("name")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputName">Currency Name</Label>
              {errors.name?.message && <p className="text-red-500">{errors.name?.message}</p>}
            </Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className="form-btn save" variant="link" type="submit">
              {type === "add" ? "Save" : "Update"}
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

export default CurrencyFormAction;

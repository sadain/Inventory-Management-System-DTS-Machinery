import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { useProductCategoryMutation, useProductCategoryEditMutation } from "api/useApi";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(3, "Category Name is required"),
});

const { Group, Control, Label } = Form;

const ProductCategoryFormAction = (props) => {
  const { type, queryClient, productCategoryRow } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: productCategoryMutate } = useProductCategoryMutation({
    onSuccess: () => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allProductCategoryData"],
      });
      toast.success("Product Category added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: productCategoryEditMutate } = useProductCategoryEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allProductCategoryData"],
      });
      toast.success("Product Category updated successfully!");
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
      name: productCategoryRow ? productCategoryRow.name : "",
    },
  });

  const onSubmit = (data, id) => {
    const { name } = data;

    const reqData = {
      name,
    };

    if (productCategoryRow?.id !== undefined) {
      productCategoryEditMutate({ id: productCategoryRow.id, ...reqData });
    } else {
      productCategoryMutate(reqData);
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
          onSubmit={handleSubmit((data) => onSubmit(data, productCategoryRow?.id))}
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
              <Label htmlFor="inputName">Product Category Name</Label>
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

export default ProductCategoryFormAction;

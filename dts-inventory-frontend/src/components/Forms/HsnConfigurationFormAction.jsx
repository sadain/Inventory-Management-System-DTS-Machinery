import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useHsnConfigurationMutation,
  useHsnConfigurationEditMutation,
} from "api/useApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  hsn: z.string().min(1, "HSN is required"),
  description: z.string().min(3, "Description is required"),
  cgst: z.string().min(1, "Cgst is required"),
  sgst: z.string().min(1, "Sgst is required"),
  igst: z.string().min(1, "Igst is required"),
});

const { Group, Control, Label } = Form;

const HsnConfigurationFormAction = (props) => {
  const { type, queryClient, HsnConfigurationRow, selectedCompanyId } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: hsnConfigurationMutate } = useHsnConfigurationMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allHsnConfigurationData"],
      });
      toast.success("Hsn added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: hsnConfigurationEditMutate } =
    useHsnConfigurationEditMutation({
      onSuccess: (data, variables, context) => {
        setShow(false);
        queryClient.invalidateQueries({
          queryKey: ["allHsnConfigurationData"],
        });
        toast.success("Hsn updated successfully!");
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
      hsn: HsnConfigurationRow ? HsnConfigurationRow.hsn : "",
      description: HsnConfigurationRow ? HsnConfigurationRow.description : "",
      cgst: HsnConfigurationRow ? HsnConfigurationRow.cgst : "0",
      sgst: HsnConfigurationRow ? HsnConfigurationRow.sgst : "0",
      igst: HsnConfigurationRow ? HsnConfigurationRow.igst : "0",
    },
  });

  const onSubmit = (data, id) => {
    const { hsn, description, cgst, sgst, igst } = data;

    const reqData = {
      hsn,
      description,
      cgst: Number(cgst),
      sgst: Number(sgst),
      igst: Number(igst),
      companyId: selectedCompanyId,
    };

    if (HsnConfigurationRow?.id !== undefined) {
      hsnConfigurationEditMutate({ id: HsnConfigurationRow.id, ...reqData });
    } else {
      hsnConfigurationMutate(reqData);
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
          onSubmit={handleSubmit((data) =>
            onSubmit(data, HsnConfigurationRow?.id)
          )}
        >
          <Modal.Body>
            <Group className="form-floating">
              <Control
                id="hsn"
                className="form-control"
                type="text"
                {...register("hsn")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="hsn">HSN</Label>
              {errors.hsn?.message && (
                <p className="text-red-500">{errors.hsn?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="description"
                className="form-control"
                type="text"
                {...register("description")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="description">Description</Label>
              {errors.description?.message && (
                <p className="text-red-500">{errors.description?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="cgst"
                className="form-control"
                type="text"
                {...register("cgst")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="cgst">CGST</Label>
              {errors.cgst?.message && (
                <p className="text-red-500">{errors.cgst?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="sgst"
                className="form-control"
                type="text"
                {...register("sgst")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="sgst">SGST</Label>
              {errors.sgst?.message && (
                <p className="text-red-500">{errors.sgst?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="igst"
                className="form-control"
                type="text"
                {...register("igst")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="igst">IGST</Label>
              {errors.igst?.message && (
                <p className="text-red-500">{errors.igst?.message}</p>
              )}
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

export default HsnConfigurationFormAction;

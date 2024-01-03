import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from "react-toastify";
import { useProducts, useQuotationsViewMutation, useQuotationsViewEditMutation } from "api/useApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  productId: z.string().min(1, "Product Name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  unitPrice: z.string().min(1, "Unit Price is required"),
  cgstRate: z.string().min(1, "CGST Rate is required"),
  sgstRate: z.string().min(1, "SGST Rate is required"),
  igstRate: z.string().min(1, "IGST Rate is required"),
  remarks: z.string().optional(),
});

const { Group, Control, Label } = Form;

const QuotationsViewFormAction = (props) => {
  const { type, queryClient, quotationRow, quotationId, selectedCompanyId } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  const { data: productsList, isLoading: spinLoading } = useProducts("", "", "", selectedCompanyId, "true");

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const { mutate: quotationMutate } = useQuotationsViewMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allQuotationsData"],
      });
      toast.success("Quotation Record added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: quotationEditMutate } = useQuotationsViewEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allQuotationsData"],
      });
      toast.success("Quotation Record updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { product } = quotationRow || {};

  const filterByProductsName = productsList?.items
    ? String(productsList?.items.find((item) => item.name === product?.name)?.id)
    : "";

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    isDirty: true,
    defaultValues: {
      productId: quotationRow ? filterByProductsName : "",
      quantity: quotationRow ? quotationRow.quantity : "0",
      unitPrice: quotationRow ? quotationRow.unitPrice : "0",
      totalPrice: quotationRow ? quotationRow.totalPrice : "",
      quotationId: quotationRow ? quotationRow.quotationId : "",
      cgstRate: quotationRow ? quotationRow.cgstRate : "0",
      sgstRate: quotationRow ? quotationRow.sgstRate : "0",
      igstRate: quotationRow ? quotationRow.igstRate : "0",
      remarks: quotationRow ? quotationRow.remarks : "",
    },
  });

  useEffect(() => {
    if (show && type === "edit") {
      if (productsList?.items) {
        reset({ productId: quotationRow ? filterByProductsName : "" });
      }
    }
  }, [productsList?.items, show, type]);

  const onSubmit = (data) => {
    const { productId, quantity, unitPrice, remarks, cgstRate, sgstRate, igstRate } = data;

    const totalPrice = Number(quantity) * Number(unitPrice);

    const reqData = {
      productId: Number(productId),
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      totalPrice,
      cgstRate: Number(cgstRate),
      sgstRate: Number(sgstRate),
      igstRate: Number(igstRate),
      remarks: remarks === "" ? "N/A" : remarks,
      ...(type === "add" && { quotationId: quotationId }),
    };

    if (type !== "add") {
      quotationEditMutate({ id: quotationRow?.id, ...reqData });
    } else {
      quotationMutate(reqData);
      reset();
    }
  };

  const handleDropDownChange = (selected) => {
    if (selected[0]) {
      setValue("productId", String(selected[0].id));
      setValue("cgstRate", String(selected[0].cgst) || "0");
      setValue("sgstRate", String(selected[0].sgst) || "0");
      setValue("igstRate", String(selected[0].igst) || "0");
    } else {
      setValue("productId", "");
      setValue("cgstRate", "0");
      setValue("sgstRate", "0");
      setValue("igstRate", "0");
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
          onSubmit={handleSubmit((data) => onSubmit(data))}
        >
          <Modal.Body>
            <Group className="form-floating mt-3">
              <Label className="dropdown-label">Products Name</Label>
              <div className="input-container">
                <Controller
                  name="productId"
                  control={control}
                  render={({ field }) => (
                    <>
                      {isLoading ? (<Control
                        className="form-control"
                        type="text"
                        placeholder="Products is Loading..."
                      />
                      ) : (
                        <>
                          <Typeahead
                            {...field}
                            id="inputProducts"
                            labelKey={(option) => `${option.name} - ${option.model}`}
                            options={productsList?.items}
                            placeholder="Select Products"
                            onChange={handleDropDownChange}
                            defaultSelected={quotationRow ? [product] : []}
                          />
                        </>
                      )}
                    </>
                  )}
                />
                <div className="dropdown-arrow">
                  <FiChevronDown />
                </div>
              </div>
              {errors.productId?.message && (
                <p className="text-red-500">{errors.productId?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputQuantity"
                className="form-control"
                type="text"
                {...register("quantity")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputQuantity">Quantity</Label>
              {errors.quantity?.message && (
                <p className="text-red-500">{errors.quantity?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputUnitPrice"
                className="form-control"
                type="text"
                {...register("unitPrice")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputUnitPrice">Unit Price</Label>
              {errors.unitPrice?.message && (
                <p className="text-red-500">{errors.unitPrice?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputCgstRate"
                className="form-control"
                type="text"
                {...register("cgstRate")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputCgstRate">CGST Rate</Label>
              {errors.cgstRate?.message && (
                <p className="text-red-500">{errors.cgstRate?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputSgstRate"
                className="form-control"
                type="text"
                {...register("sgstRate")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputSgstRate">SGST Rate</Label>
              {errors.sgstRate?.message && (
                <p className="text-red-500">{errors.sgstRate?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputIgstRate"
                className="form-control"
                type="text"
                {...register("igstRate")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputIgstRate">IGST Rate</Label>
              {errors.igstRate?.message && (
                <p className="text-red-500">{errors.igstRate?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputRemarks"
                className="form-control"
                as="textarea"
                {...register("remarks")}
                style={{ resize: "vertical", minHeight: "100px" }}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputRemarks">Remarks (optional)</Label>
              {errors.remarks?.message && (
                <p className="text-red-500">{errors.remarks?.message}</p>
              )}
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

export default QuotationsViewFormAction;

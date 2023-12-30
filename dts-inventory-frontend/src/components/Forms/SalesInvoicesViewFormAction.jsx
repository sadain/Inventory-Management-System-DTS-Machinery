import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from "react-toastify";
import { useProducts, useSalesInvoiceViewMutation, useSalesInvoiceViewEditMutation } from "api/useApi"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  productId: z.string().min(1, "Product Name is required"),
  serialNumber: z.string().optional(),
  quantity: z.string().min(1, "Quantity is required"),
  rate: z.string().min(1, "Rate is required"),
  discount: z.string().min(1, "Discount is required"),
  cgstRate: z.string().min(1, "CGST Rate is required"),
  sgstRate: z.string().min(1, "SGST Rate is required"),
  igstRate: z.string().min(1, "IGST Rate is required"),
});

const { Group, Control, Label, Select } = Form;

const SalesInvoicesViewFormAction = (props) => {
  const { type, queryClient, salesInvoiceRow, salesInvoiceId, productFilteredList, spinLoading1 } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  const [availableStock, setAvailableStock] = useState("");

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  useEffect(() => {
    setIsLoading(spinLoading1);
  }, [spinLoading1]);

  const { mutate: salesInvoiceViewMutate } = useSalesInvoiceViewMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allSalesInvoiceData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allProductsData"],
      });
      toast.success("Sales Invoice Record added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: salesInvoiceEditMutate } = useSalesInvoiceViewEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allSalesInvoiceData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allProductsData"],
      });
      toast.success("Sales Invoice Record updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { product } = salesInvoiceRow || {};

  const filterByProductsName = productFilteredList
    ? String(productFilteredList?.find((item) => item.name === product?.name)?.id)
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
      productId: salesInvoiceRow ? filterByProductsName : "",
      serialNumber: salesInvoiceRow ? salesInvoiceRow.serialNumber : "0",
      quantity: salesInvoiceRow ? salesInvoiceRow.quantity : "0",
      rate: salesInvoiceRow ? salesInvoiceRow.rate : "0",
      discount: salesInvoiceRow ? salesInvoiceRow.discount : "0",
      cgstRate: salesInvoiceRow ? salesInvoiceRow.cgstRate : "0",
      sgstRate: salesInvoiceRow ? salesInvoiceRow.sgstRate : "0",
      igstRate: salesInvoiceRow ? salesInvoiceRow.igstRate : "0",
    },
  });

  useEffect(() => {
    if (show && type === "edit") {
      if (productFilteredList) {
        reset({ productId: salesInvoiceRow ? filterByProductsName : "" });
      }
    }
  }, [productFilteredList, show, type]);

  const onSubmit = (data) => {
    const { productId, serialNumber, quantity, rate, discount, cgstRate, sgstRate, igstRate } = data;

    const reqData = {
      productId: Number(productId),
      serialNumber: Number(serialNumber),
      quantity: Number(quantity),
      rate: Number(rate),
      discount: Number(discount),
      cgstRate: Number(cgstRate),
      sgstRate: Number(sgstRate),
      igstRate: Number(igstRate),
      ...(type === "add" && { salesInvoiceId: salesInvoiceId }),
    };

    if (type !== "add") {
      salesInvoiceEditMutate({ id: salesInvoiceRow?.id, ...reqData });
    } else {
      salesInvoiceViewMutate(reqData);
      reset();
    }
    setAvailableStock("");
  };

  const handleDropDownChange = (selected) => {
    if (selected[0]) {
      setValue("productId", String(selected[0].id));
      setAvailableStock(selected[0].stock || "");
      setValue("cgstRate", String(selected[0].cgst) || "0");
      setValue("sgstRate", String(selected[0].sgst) || "0");
      setValue("igstRate", String(selected[0].igst) || "0");
    } else {
      setValue("productId", "");
      setAvailableStock("");
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
          onSubmit={handleSubmit((data) => onSubmit(data, salesInvoiceRow?.id))}
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
                            options={productFilteredList}
                            placeholder="Select Products"
                            onChange={handleDropDownChange}
                            defaultSelected={salesInvoiceRow ? [product] : []}
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
              {availableStock && (
                <p className="text-green-500 pl-4">Available Stock: {availableStock} </p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputSerialNumber"
                className="form-control"
                type="text"
                {...register("serialNumber")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputSerialNumber">Serial Number (optional)</Label>
              {errors.serialNumber?.message && (
                <p className="text-red-500">{errors.serialNumber?.message}</p>
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
                id="inputRate"
                className="form-control"
                type="text"
                {...register("rate")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputRate">Rate</Label>
              {errors.rate?.message && (
                <p className="text-red-500">{errors.rate?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputDiscount"
                className="form-control"
                type="text"
                {...register("discount")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputDiscount">Discount</Label>
              {errors.discount?.message && (
                <p className="text-red-500">{errors.discount?.message}</p>
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

export default SalesInvoicesViewFormAction;

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from "react-toastify";
import { useProducts, usePurchaseOrdersViewMutation, usePurchaseOrdersViewEditMutation } from "api/useApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  productId: z.string().min(1, "Product Name is required"),
  supplierDescription: z.string().optional(),
  // color: z.string().min(1, "Color is required"),
  unit: z.string().optional(),
  quantity: z.string().min(1, "Quantity is required"),
  unitPrice: z.string().min(1, "Unit Price is required"),
});

const { Group, Control, Label } = Form;

const PurchaseOrdersViewFormAction = (props) => {
  const { type, queryClient, purchaseOrderRow, purchaseOrderId, selectedCompanyId } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  const { data: productsList, isLoading: spinLoading } = useProducts("", "", "", selectedCompanyId, "true");

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const { mutate: purchaseOrdersViewMutate } = usePurchaseOrdersViewMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allPurchaseOrdersData"],
      });
      toast.success("Purchase Order Record added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: purchaseOrdersViewEditMutate } = usePurchaseOrdersViewEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allPurchaseOrdersData"],
      });
      toast.success("Purchase Order updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { product } = purchaseOrderRow || {};

  const filterByProductsName = productsList?.items
    ? String(productsList?.items.find((item) => item.name === product?.name)?.id)
    : "";

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    isDirty: true,
    defaultValues: {
      productId: purchaseOrderRow ? filterByProductsName : "",
      supplierDescription: purchaseOrderRow ? purchaseOrderRow.supplierDescription : "",
      // color: purchaseOrderRow ? purchaseOrderRow.color : "",
      unit: purchaseOrderRow ? purchaseOrderRow.unit : "",
      quantity: purchaseOrderRow ? purchaseOrderRow.quantity : "",
      unitPrice: purchaseOrderRow ? purchaseOrderRow.unitPrice : "",
      totalPrice: purchaseOrderRow ? purchaseOrderRow.totalPrice : "",
      purchaseOrderId: purchaseOrderRow ? purchaseOrderRow.purchaseOrderId : "",
    },
  });

  useEffect(() => {
    if (show && type === "edit") {
      if (productsList?.items) {
        reset({ productId: purchaseOrderRow ? filterByProductsName : "" });
      }
    }
  }, [productsList?.items, show, type]);

  const onSubmit = (data) => {
    const { productId, supplierDescription, unit, quantity, unitPrice } = data;

    const totalPrice = Number(quantity) * Number(unitPrice);

    const reqData = {
      productId: Number(productId),
      supplierDescription,
      unit,
      quantity,
      unitPrice,
      totalPrice,
      ...(type === "add" && { purchaseOrderId: purchaseOrderId }),
    };

    if (type !== "add") {
      purchaseOrdersViewEditMutate({ id: purchaseOrderRow.id, ...reqData });
    } else {
      purchaseOrdersViewMutate(reqData);
      reset();
    }
  };

  const handleDropDownChange = (selected) => {
    if (selected[0]) {
      setValue("productId", String([selected[0].id]));
    } else {
      setValue("productId", "");
    }
  };

  // console.log("purchaseOrderRow.id", purchaseOrderRow)

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
          onSubmit={handleSubmit((data) => onSubmit(data, purchaseOrderRow?.id))}
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
                            defaultSelected={purchaseOrderRow ? [product] : []}
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
                id="inputSupplierDescription"
                className="form-control"
                type="text"
                {...register("supplierDescription")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputSupplierDescription">Supplier Description (optional)</Label>
              {errors.supplierDescription?.message && (
                <p className="text-red-500">{errors.supplierDescription?.message}</p>
              )}
            </Group>
            {/* <Group className="form-floating">
                <Control
                  id="inputColor"
                  className="form-control"
                  type="text"
                  {...register("color")}
                  placeholder=" "
                />
                <span className="highlight"></span>
                <Label htmlFor="inputColor">Color</Label>
                {errors.color?.message && (
                  <p className="text-red-500">{errors.color?.message}</p>
                )}
              </Group> */}
            <Group className="form-floating">
              <Control
                id="inputUnit"
                className="form-control"
                type="text"
                {...register("unit")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputUnit">Unit (optional)</Label>
              {errors.unit?.message && (
                <p className="text-red-500">{errors.unit?.message}</p>
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

export default PurchaseOrdersViewFormAction;

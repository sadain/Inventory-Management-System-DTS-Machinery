import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from "react-toastify";
import { useProducts, useDispatchChallansViewMutation, useDispatchChallansViewEditMutation } from "api/useApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  productId: z.string().min(1, "Product Name is required"),
  // modelNo: z.string().min(1, "Model No is required"),
  quantity: z.string().min(1, "Quantity is required"),
  remarks: z.string().min(1, "Remarks is required"),
});

const { Group, Control, Label } = Form;

const DispatchChallanViewFormAction = (props) => {
  const { type, queryClient, dispatchChallanViewRow, dispatchId, productFilteredList, spinLoading1 } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  const [availableStock, setAvailableStock] = useState("");

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  useEffect(() => {
    setIsLoading(spinLoading1);
  }, [spinLoading1]);

  const { mutate: dispatchChallansViewMutate } = useDispatchChallansViewMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allDispatchChallanViewData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allProductsData"],
      });
      toast.success("Dispatch Challan Record added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: dispatchChallansEditMutate } = useDispatchChallansViewEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allDispatchChallanViewData"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allProductsData"],
      });
      toast.success("Dispatch Challan Record updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { product } = dispatchChallanViewRow || {};

  const filterByProductsName = productFilteredList
    ? String(productFilteredList.find((item) => item.name === product?.name)?.id)
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
      productId: dispatchChallanViewRow ? filterByProductsName : "",
      modelNo: dispatchChallanViewRow ? dispatchChallanViewRow.modelNo : "",
      quantity: dispatchChallanViewRow ? dispatchChallanViewRow.quantity : "",
      remarks: dispatchChallanViewRow ? dispatchChallanViewRow.remarks : "",
      dispatchId: dispatchChallanViewRow ? dispatchChallanViewRow.dispatchId : "",
    },
  });

  useEffect(() => {
    if (show && type === "edit") {
      if (productFilteredList) {
        reset({ productId: dispatchChallanViewRow ? filterByProductsName : "" });
      }
    }
  }, [productFilteredList, show, type]);

  const onSubmit = (data) => {
    const { productId, quantity, remarks } = data;

    const selectedProduct = productFilteredList.find((item) => String(item.id) === productId);

    const reqData = {
      productId: Number(productId),
      modelNo: selectedProduct ? selectedProduct.model : dispatchChallanViewRow?.modelNo,
      quantity,
      remarks,
      ...(type === "add" && { dispatchId: dispatchId }),
    };

    if (type !== "add") {
      dispatchChallansEditMutate({ id: dispatchChallanViewRow?.id, ...reqData });
    } else {
      dispatchChallansViewMutate(reqData);
      reset();
    }
    setAvailableStock("");
  };

  const handleDropDownChange = (selected) => {
    if (selected[0]) {
      setValue("productId", String([selected[0].id]));
      setAvailableStock(selected[0].stock || "");
    } else {
      setValue("productId", "");
      setAvailableStock("");
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
        <Form onSubmit={handleSubmit((data) => onSubmit(data, dispatchChallanViewRow?.id))}>
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
                            defaultSelected={dispatchChallanViewRow ? [product] : []}
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
            {/* <Group className="form-floating">
              <Control
                id="inputModelNo"
                className="form-control"
                type="text"
                {...register("modelNo")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputModelNo">Model No</Label>
              {errors.modelNo?.message && (
                <p className="text-red-500">{errors.modelNo?.message}</p>
              )}
            </Group> */}
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
                id="inputRemarks"
                className="form-control"
                as="textarea"
                {...register("remarks")}
                style={{ resize: "vertical", minHeight: "100px" }}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputRemarks">Remarks</Label>
              {errors.remarks?.message && (
                <p className="text-red-500">{errors.remarks?.message}</p>
              )}
            </Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className="form-btn save" variant="link" type="submit">
              Save
            </Button>
            <Button className="form-btn cancel" variant="link" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DispatchChallanViewFormAction;

import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useImagePreview, useProductMutation, useProductEditMutation } from "api/useApi";
import ProductCategoryFormAction from "components/Forms/ProductCategoryFormAction";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  productCategoryId: z.string().optional(),
  name: z.string().min(3, "Name is required"),
  model: z.string().min(3, "Model is required"),
  purpose: z.string().min(3, "Purpose is required"),
  hsn: z.string().min(3, "HSN is required"),
  picture: z.any(),
});

const { Group, Control, Label, Select } = Form;

const ProductFormAction = (props) => {
  const { type, queryClient, selectedCompanyId, productRow, productCategoryList } = props || {};

  const { id: productId } = productRow || {};

  const { data: productsImageList } = useImagePreview({ productId: productId });

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: productMutate } = useProductMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allProductsData"],
      });
      toast.success("Product added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: productEditMutate } = useProductEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allProductsData"],
      });
      toast.success("Product updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { productCategory } = productRow || {};

  const filterByproductCategoryName = productCategoryList
    ? String(productCategoryList.find((item) => item.name === productCategory)?.id)
    : "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      productCategoryId: productRow ? filterByproductCategoryName : "",
      name: productRow ? productRow.name : "",
      model: productRow ? productRow.model : "",
      purpose: productRow ? productRow.purpose : "",
      hsn: productRow ? productRow.hsn : "",
      picture: "",
    },
  });

  const onSubmit = (data, id) => {
    const { productCategoryId, name, model, purpose, hsn, picture } = data;
    const formData = new FormData();
    formData.append("ProductCategoryId", productCategoryId);
    formData.append("Name", name);
    formData.append("Model", model);
    formData.append("Purpose", purpose);
    formData.append("HSN", hsn);
    formData.append("File", picture[0]);
    formData.append("CompanyId", selectedCompanyId);

    if (id !== undefined) {
      productEditMutate({ formData, id });
    } else {
      productMutate(formData);
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
        <Form onSubmit={handleSubmit((data) => onSubmit(data, productRow?.id))}>
          <Modal.Body>
            <Group className="form-floating flex">
              <Select
                id="inputproductCategory"
                {...register("productCategoryId")}
              >
                <option value="">Select product Category</option>
                {productCategoryList &&
                  productCategoryList.map((productCategory) => (
                    <option key={productCategory.id} value={String(productCategory.id)}>
                      {productCategory.name}
                    </option>
                  ))}
              </Select>
              <Label htmlFor="inputproductCategory">Product Category</Label>
              {errors.productCategoryId?.message && <p className="text-red-500">{errors.productCategoryId?.message}</p>}
              <div className="addinline">
                <ProductCategoryFormAction
                  type="add"
                  queryClient={queryClient}
                />
              </div>
            </Group>
            <Group className="form-floating">
              <Control
                id="inputName"
                className="form-control"
                type="text"
                {...register("name")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputName">Name</Label>
              {errors.name?.message && (
                <p className="text-red-500">{errors.name?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputModel"
                className="form-control"
                type="text"
                {...register("model")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputModel">Model</Label>
              {errors.model?.message && (
                <p className="text-red-500">{errors.model?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputPurpose"
                className="form-control"
                type="text"
                {...register("purpose")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputPurpose">Purpose</Label>
              {errors.purpose?.message && (
                <p className="text-red-500">{errors.purpose?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputHsn"
                className="form-control"
                type="text"
                {...register("hsn")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputHsn">Hsn</Label>
              {errors.hsn?.message && (
                <p className="text-red-500">{errors.hsn?.message}</p>
              )}
            </Group>
            {productRow?.picture ? (
              <img src={productsImageList?.picture} style={{ padding: "10px 0px 0px 15px" }} width="150px" alt={productRow.picture} />
            ) : null}
            <Group className="form-floating">
              <Control
                id="inputPicture"
                className="form-control"
                type="file"
                {...register("picture")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputPicture">Picture</Label>
              {errors.picture?.message && <p className="text-red-500">{errors.picture?.message}</p>}
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

export default ProductFormAction;

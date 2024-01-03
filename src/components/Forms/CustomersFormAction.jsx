import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import {
  useStates,
  useCustomerMutation,
  useCustomerEditMutation,
} from "api/useApi";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(3, "Name is required"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(3, "City is required"),
  phone: z
    .string()
    .min(10, "Phone is required in 10 digit No")
    .max(10, "Phone is required in 10 digit No"),
  fax: z.string().min(3, "Fax is required"),
  gstNo: z.string().min(3, "GstNo is required"),
  postalCode: z.string().min(3, "Postal Code is required"),
  countryId: z.string().min(1, "Country Id is required"),
  stateId: z.string().min(1, "state Id is required"),
});

const { Group, Control, Label, Select } = Form;

const CustomersFormAction = (props) => {
  const { type, queryClient, selectedCompanyId, customerRow, countryList } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: customerMutate } = useCustomerMutation({
    onSuccess: () => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allCustomerData"],
      });
      toast.success("Customer added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: customerEditMutate } = useCustomerEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allCustomerData"],
      });
      toast.success("Customer updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { country, state } = customerRow || {};

  const filterByCountryName = countryList
    ? String(countryList.find((item) => item.name === country)?.id)
    : "";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    isDirty: true,
    defaultValues: {
      name: customerRow ? customerRow.name : "",
      address: customerRow ? customerRow.address : "",
      city: customerRow ? customerRow.city : "",
      phone: customerRow ? customerRow.phone : "",
      fax: customerRow ? customerRow.fax : "",
      gstNo: customerRow ? customerRow.gstNo : "",
      postalCode: customerRow ? customerRow.postalCode : "",
      countryId: customerRow ? filterByCountryName : "",
      stateId: "",
    },
  });

  const watchCountry = watch("countryId", customerRow ? filterByCountryName : "");

  const { data: stateList } = useStates({ selectedCountryId: watchCountry });

  const filterByStateName = stateList
    ? String(stateList.find((item) => item.name === state)?.id)
    : "";

  useEffect(() => {
    if (show && type === "edit") {
      if (countryList) {
        reset({ countryId: customerRow ? filterByCountryName : "" });
      }
    }
  }, [countryList, show, type]);

  useEffect(() => {
    if (show && type === "edit") {
      if (stateList) {
        reset({ stateId: customerRow ? filterByStateName : "" });
      }
    }
  }, [stateList, show, type]);

  const onSubmit = (data, id) => {
    const { name, address, city, phone, fax, gstNo, postalCode, countryId, stateId } = data;

    const reqData = {
      name,
      address,
      city,
      phone,
      fax,
      gstNo,
      postalCode,
      countryId: Number(countryId),
      stateId: Number(stateId),
      companyId: selectedCompanyId,
    };

    if (customerRow?.id !== undefined) {
      customerEditMutate({ id: customerRow.id, ...reqData });
    } else {
      customerMutate(reqData);
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
          onSubmit={handleSubmit((data) => onSubmit(data, customerRow?.id))}
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
              <Label htmlFor="inputName">Name</Label>
              {errors.name?.message && <p className="text-red-500">{errors.name?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputAddress"
                className="form-control"
                type="text"
                {...register("address")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputAddress">Address</Label>
              {errors.address?.message && <p className="text-red-500">{errors.address?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputCity"
                className="form-control"
                type="text"
                {...register("city")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputCity">City</Label>
              {errors.city?.message && <p className="text-red-500">{errors.city?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Select id="inputCountry" {...register("countryId")}>
                <option value="">Select Country</option>
                {countryList &&
                  countryList.map((country) => (
                    <option key={country.id} value={String(country.id)}>
                      {country.name}
                    </option>
                  ))}
              </Select>
              <Label htmlFor="inputCountry">Country</Label>
              {errors.countryId?.message && <p className="text-red-500">{errors.countryId?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Select id="inputState" {...register("stateId")}>
                <option value="">Select State</option>
                {stateList &&
                  stateList.map((state) => (
                    <option key={state.id} value={String(state.id)}>
                      {state.name}
                    </option>
                  ))}
              </Select>
              <Label htmlFor="inputState">State</Label>
              {errors.stateId?.message && <p className="text-red-500">{errors.stateId?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputPostalCode"
                className="form-control"
                type="text"
                {...register("postalCode")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputPostalCode">Postal Code</Label>
              {errors.postalCode?.message && (
                <p className="text-red-500">{errors.postalCode?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputGstNo"
                className="form-control"
                type="text"
                {...register("gstNo")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputGstNo">GST No</Label>
              {errors.gstNo?.message && <p className="text-red-500">{errors.gstNo?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputPhone"
                className="form-control"
                type="text"
                {...register("phone")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputPhone">Phone</Label>
              {errors.phone?.message && <p className="text-red-500">{errors.phone?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputFax"
                className="form-control"
                type="text"
                {...register("fax")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputFax">Fax</Label>
              {errors.fax?.message && <p className="text-red-500">{errors.fax?.message}</p>}
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

export default CustomersFormAction;

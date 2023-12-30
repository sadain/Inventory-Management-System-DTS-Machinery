import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useStates,
  useCompaniesMutation,
  useCompaniesEditMutation,
} from "api/useApi";
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
  gstIn: z.string().min(3, "GST In is required"),
  iecNo: z.string().min(3, "IEC No is required"),
  pan: z.string().min(3, "Pan is required"),
  cinNo: z.string().min(3, "cinNo is required"),
  postalCode: z.string().min(3, "Postal Code is required"),
  countryId: z.string().min(1, "Country is required"),
  stateId: z.string().min(1, "State is required"),
});

const { Group, Control, Label, Select } = Form;

const CompaniesFormAction = (props) => {
  const { type, queryClient, companiesRow, countryList } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: companiesMutate } = useCompaniesMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allCompaniesData"],
      });
      toast.success("Company added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: companiesEditMutate } = useCompaniesEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allCompaniesData"],
      });
      toast.success("Company updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
toast.error(error.response.data);
    },
  });

  const { country, state } = companiesRow || {};

  const filterByCountryName = countryList ? String(countryList.find((item) => item.name === country)?.id) : "";

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
      name: companiesRow ? companiesRow.name : "",
      address: companiesRow ? companiesRow.address : "",
      city: companiesRow ? companiesRow.city : "",
      phone: companiesRow ? companiesRow.phone : "",
      gstIn: companiesRow ? companiesRow.gstIn : "",
      iecNo: companiesRow ? companiesRow.iecNo : "",
      pan: companiesRow ? companiesRow.pan : "",
      cinNo: companiesRow ? companiesRow.cinNo : "",
      postalCode: companiesRow ? companiesRow.postalCode : "",
      countryId: companiesRow ? filterByCountryName : "",
      stateId: "",
    },
  });

  const watchCountry = watch("countryId", companiesRow ? filterByCountryName : "");

  const { data: stateList } = useStates({ selectedCountryId: watchCountry });

  const filterByStateName = stateList ? String(stateList.find((item) => item.name === state)?.id) : "";

  useEffect(() => {
    if (show && type === "edit") {
      if (countryList) {
        reset({ countryId: companiesRow ? filterByCountryName : "" });
      }
    }
  }, [countryList, show, type]);

  useEffect(() => {
    if (show && type === "edit") {
      if (stateList) {
        reset({ stateId: companiesRow ? filterByStateName : "" });
      }
    }
  }, [stateList, show, type]);

  const onSubmit = (data, id) => {
    const { name, address, city, phone, gstIn, cinNo, iecNo, pan, postalCode, countryId, stateId } = data;

    const reqData = { name, address, city, phone, gstIn, cinNo, iecNo, pan, postalCode, countryId: Number(countryId), stateId: Number(stateId) };

    if (companiesRow?.id !== undefined) {
      companiesEditMutate({ id: companiesRow.id, ...reqData });
    } else {
      companiesMutate(reqData);
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
          onSubmit={handleSubmit((data) => onSubmit(data, companiesRow?.id))}
        >
          <Modal.Body>
            <Group className="form-floating">
              <Control
                id="inputName"
                className={`form-control ${type === "edit" ? "disabled-input" : ""}`}
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
              {errors.postalCode?.message && <p className="text-red-500">{errors.postalCode?.message}</p>}
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
                id="inputGstIn"
                className="form-control"
                type="text"
                {...register("gstIn")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputGstIn">Gst In</Label>
              {errors.gstIn?.message && <p className="text-red-500">{errors.gstIn?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputCinNo"
                className="form-control"
                type="text"
                {...register("cinNo")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputCinNo">Cin No</Label>
              {errors.cinNo?.message && <p className="text-red-500">{errors.cinNo?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputIecNo"
                className="form-control"
                type="text"
                {...register("iecNo")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputIecNo">IecNo</Label>
              {errors.iecNo?.message && <p className="text-red-500">{errors.iecNo?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputPan"
                className="form-control"
                type="text"
                {...register("pan")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputPan">Pan</Label>
              {errors.pan?.message && <p className="text-red-500">{errors.pan?.message}</p>}
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

export default CompaniesFormAction;

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { useDispatchChallansMutation, useDispatchChallansEditMutation } from "api/useApi";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatchChallans } from "api/useApi";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  customerId: z.string().min(1, "Customer Name is required"),
  dispatchNo: z.string().min(1, "Dispatch Number is required"),
  dispatchDate: z.date({ message: "Please select a date" }),
  dispatchType: z.string().min(1, "Dispatch Type is required"),
  toCompanyId: z.string().optional(),
});

const { Group, Control, Label, Select } = Form;

const DispatchChallansFormAction = (props) => {
  const { type, queryClient, selectedCompanyId, DispatchChallanRow, customersList, companiesList } = props || {};
  const [show, setShow] = useState(false);

  const [nextDispatchNo, setNextDispatchNo] = useState("");

  const { data: dispatchChallanList } = useDispatchChallans("", "", "", "", "", "", "", selectedCompanyId, "true");

  function handleClose() {
    setShow(false);
  }

  const navigate = useNavigate();

  const { mutate: dispatchChallanMutate } = useDispatchChallansMutation({
    onSuccess: (data, variables, context) => {
      const { id } = data;
      setShow(false);
      navigate(`${id}/`, { replace: true });
      queryClient.invalidateQueries({
        queryKey: ["allDispatchChallansData"],
      });
      toast.success("Dispatch Challan added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: dispatchChallanEditMutate } = useDispatchChallansEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allDispatchChallansData"],
      });
      toast.success("Dispatch Challan updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const DefaultDispatchType = {
    Regular: 1,
    DemoPurpose: 2,
    StockTransfer: 3,
  };

  const { customer } = DispatchChallanRow || {};

  const filterByCustomersName = customersList
    ? String(customersList.find((item) => item.name === customer?.name)?.id)
    : "";

    const generateNextDispatchNo = (dispatchChallanList) => {
      const dispatchNumbers = dispatchChallanList?.items?.map((challan) => {
        const number = Number(challan.dispatchNo);
        return isNaN(number) ? 0 : number;
      });
  
      const latestDispatchNo = Math.max(...dispatchNumbers);
  
      const nextDispatchNoNumber =
        isNaN(latestDispatchNo) || !isFinite(latestDispatchNo) ? 1 : latestDispatchNo + 1;
  
      return `${String(nextDispatchNoNumber).padStart(3, "0")}`;
    };

    useEffect(() => {
      if (type === "add" && dispatchChallanList?.items) {
        const generatedDispatchNo = generateNextDispatchNo(dispatchChallanList);
        setNextDispatchNo(generatedDispatchNo);
        setValue("dispatchNo", generatedDispatchNo);
      } else if (type === "edit" && DispatchChallanRow) {
        setNextDispatchNo(DispatchChallanRow.dispatchNo);
        setValue("dispatchNo", DispatchChallanRow.dispatchNo);
      }
    }, [type, dispatchChallanList?.items, DispatchChallanRow]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    isDirty: true,
    defaultValues: {
      customerId: DispatchChallanRow ? filterByCustomersName : "",
      dispatchNo: DispatchChallanRow ? DispatchChallanRow.dispatchNo : nextDispatchNo,
      dispatchDate: DispatchChallanRow ? DispatchChallanRow.dispatchDate ? parseISO(DispatchChallanRow.dispatchDate) : null : new Date(),
      dispatchType: DispatchChallanRow ? DispatchChallanRow.dispatchType.toString() : "",
      toCompanyId: DispatchChallanRow ? DispatchChallanRow.toCompanyId : "",
    },
  });

  useEffect(() => {
    if (show && type === "edit") {
      if (customersList) {
        reset({ customerId: DispatchChallanRow ? filterByCustomersName : "" });
      }
    }
  }, [customersList, show, type]);

  const onSubmit = (data, id) => {
    const { customerId, dispatchNo, dispatchDate, dispatchType } = data;
    const companyId = selectedCompanyId;

    const toCompanyId = data.dispatchType === "StockTransfer" ? data.toCompanyId : 0;

    // let nextDispatchNo;

    // if (type === "add") {
    //   nextDispatchNo = generateNextDispatchNo(dispatchChallanList);
    // } else {
    //   nextDispatchNo = DispatchChallanRow?.dispatchNo || "";
    // }

    const reqData = {
      customerId: Number(customerId),
      dispatchNo,
      dispatchDate,
      dispatchType: DefaultDispatchType[dispatchType],
      companyId,
      toCompanyId,
    };

    if (DispatchChallanRow?.id !== undefined) {
      dispatchChallanEditMutate({ id: DispatchChallanRow.id, ...reqData });
    } else {
      dispatchChallanMutate(reqData);
      reset();
    }
  };

  const handleDropDownChange = (selected) => {
    if (selected[0]) {
      setValue("customerId", String([selected[0].id]));
    } else {
      setValue("customerId", []);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShow(true)}
        variant={type === "add" ? "link" : "link"}
        className={type === "add" ? "form-btn mb-3" : "edit-btn"}
        style={{ display: "flex", alignItems: "center" }}
      >
        {type === "add" ? (
          <AiOutlinePlus className="text-lg mr-1.5" />
        ) : (
          <BsPencilSquare className="text-lg mr-1" />
        )}
        <span>{type === "add" ? "Add New" : "Edit"}</span>
      </Button>
      <Modal show={show} onHide={handleClose} centered className="dialog">
        <Modal.Header closeButton className="dialog-h">
          <Modal.Title className="dialog-t">
            {type === "add" ? "Add New Record" : "Edit Record"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit((data) => onSubmit(data, DispatchChallanRow?.id))}>
          <Modal.Body>
            <Group className="form-floating mt-3">
              <Label className="dropdown-label">Customer Name</Label>
              <div className="input-container">
                <Controller
                  name="customerId"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Typeahead
                        {...field}
                        id="inputCustomer"
                        labelKey={(option) => option.name}
                        options={customersList}
                        placeholder="Select Customer"
                        onChange={handleDropDownChange}
                        defaultSelected={DispatchChallanRow ? [customer] : []}
                      />
                    </>
                  )}
                />
                <div className="dropdown-arrow">
                  <FiChevronDown />
                </div>
              </div>
              {errors.customerId?.message && (
                <p className="text-red-500">{errors.customerId?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputDispatchNo"
                className="form-control"
                type="text"
                {...register("dispatchNo")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputDispatchNo">Dispatch No</Label>
              {errors.dispatchNo?.message && (
                <p className="text-red-500">{errors.dispatchNo?.message}</p>
              )}
            </Group>
            <Group className="form-floating datePiker">
              <Controller
                render={({ field: { onChange, onBlur, value } }) => (
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    onChange={onChange}
                    onBlur={onBlur}
                    selected={value}
                    customInput={<Control id="inputDispatchDate" />}
                  />
                )}
                control={control}
                name="dispatchDate"
              />
              <span className="highlight"></span>
              <Label htmlFor="inputDispatchDate">Dispatch Date</Label>
              {errors.dispatchDate?.message && (
                <p className="text-red-500">{errors.dispatchDate?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Select id="inputDispatchType" {...register("dispatchType")}>
                <option value="">Select Dispatch Type</option>
                <option value="Regular">Regular</option>
                <option value="DemoPurpose">Demo Purpose</option>
                <option value="StockTransfer">Stock Transfer</option>
              </Select>
              <Label htmlFor="inputDispatchType">Dispatch Type</Label>
              {errors.dispatchType?.message && (
                <p className="text-red-500">{errors.dispatchType?.message}</p>
              )}
            </Group>

            {watch("dispatchType") === "StockTransfer" && (
              <Group className="form-floating">
                <Select id="inputCompany" {...register("toCompanyId")}>
                  <option value="">Select company</option>
                  {companiesList &&
                    companiesList.map((companies) => (
                      <option key={companies.id} value={companies.id}>
                        {companies.name}
                      </option>
                    ))}
                </Select>
                <Label htmlFor="inputCompany">Company Name</Label>
                {errors.toCompanyId?.message && (
                  <p className="text-red-500">{errors.toCompanyId?.message}</p>
                )}
              </Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button className="form-btn save" variant="link" type="submit">
              {type === "add" ? "Save" : "Update"}
            </Button>
            <Button className="form-btn cancel" variant="link" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default DispatchChallansFormAction;

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from "react-toastify";
import { useQuotationsMutation, useQuotationsEditMutation, useCurrency } from "api/useApi";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import { useQuotations } from "api/useApi";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  customerId: z.string().min(1, "Customer Name is required"),
  quotationNo: z.string().min(1, "Quotation Number is required"),
  quotationDate: z.date({ required_error: "Please select a date" }),
  currency: z.string().min(1, "Currency is required"),
  remarks: z.string().min(3, "Remarks is required"),
});

const { Group, Control, Label, Select } = Form;

const QuotationsFormAction = (props) => {
  const { type, queryClient, selectedCompanyId, quotationRow, customerList } = props || {};

  const [show, setShow] = useState(false);

  const [nextQuotationNo, setNextQuotationNo] = useState("");

  const { data: quotationList } = useQuotations("", "", "", "", "", "", selectedCompanyId, "true");

  function handleClose() {
    setShow(false);
  }

  const { data: currencyList } = useCurrency();

  const navigate = useNavigate();

  const { mutate: quotationMutate } = useQuotationsMutation({
    onSuccess: (data, variables, context) => {
      const { id } = data;
      setShow(false);
      navigate(`${id}/`, { replace: true });
      queryClient.invalidateQueries({
        queryKey: ["allQuotationsData"],
      });
      toast.success("Quotation added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: quotationEditMutate } = useQuotationsEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allQuotationsData"],
      });
      toast.success("Quotation updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { customer } = quotationRow || {};

  const filterByCustomerName = customerList
    ? String(customerList.find((item) => item.name === customer?.name)?.id)
    : "";

    const generateNextQuotationNo = (quotationList) => {
      const quotationNumbers = quotationList?.items?.map((quotation) => {
        const number = Number(quotation.quotationNo);
        return isNaN(number) ? 0 : number;
      });
  
      const latestQuotationNo = Math.max(...quotationNumbers);
  
      const nextQuotationNoNumber = isNaN(latestQuotationNo) || !isFinite(latestQuotationNo) ? 1 : latestQuotationNo + 1;
  
      return `${String(nextQuotationNoNumber).padStart(3, "0")}`;
    };

    useEffect(() => {
      if (type === "add" && quotationList?.items) {
        const generatedQuotationNo = generateNextQuotationNo(quotationList);
        setNextQuotationNo(generatedQuotationNo);
        setValue("quotationNo", generatedQuotationNo);
      } else if (type === "edit" && quotationRow) {
        setNextQuotationNo(quotationRow.quotationNo);
        setValue("quotationNo", quotationRow.quotationNo);
      }
    }, [type, quotationList?.items, quotationRow]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: quotationRow ? filterByCustomerName : "",
      quotationNo: quotationRow ? quotationRow.quotationNo : nextQuotationNo,
      quotationDate: quotationRow ? quotationRow.quotationDate ? parseISO(quotationRow.quotationDate) : null : new Date(),
      currency: quotationRow ? quotationRow.currency : "",
      remarks: quotationRow ? quotationRow.remarks : "",
    },
  });

  useEffect(() => {
    if (show && type === "edit") {
      if (customerList) {
        reset({ customerId: quotationRow ? filterByCustomerName : "" });
      }
    }
  }, [customerList, show, type]);

  const onSubmit = (data, id) => {
    const { customerId, quotationNo, quotationDate, currency, remarks } = data;

    // let nextQuotationNo;

    // if (type === "add") {
    //   nextQuotationNo = generateNextQuotationNo(quotationList);
    // } else {
    //   nextQuotationNo = quotationRow?.quotationNo || "";
    // }

    const reqData = {
      customerId: Number(customerId),
      quotationNo,
      quotationDate,
      currency,
      remarks,
      companyId: selectedCompanyId,
    };

    if (quotationRow?.id !== undefined) {
      quotationEditMutate({ id: quotationRow.id, ...reqData });
    } else {
      quotationMutate(reqData);
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
        <Form
          onSubmit={handleSubmit((data) => onSubmit(data, quotationRow?.id))}
        >
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
                        options={customerList}
                        placeholder="Select Customer"
                        onChange={handleDropDownChange}
                        defaultSelected={quotationRow ? [customer] : []}
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
                id="inputQuotationNo"
                className="form-control"
                type="text"
                {...register("quotationNo")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputQuotationNo">Quotation No</Label>
              {errors.quotationNo?.message && (
                <p className="text-red-500">{errors.quotationNo?.message}</p>
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
                    customInput={<Control id="inputQuotationDate"
                    />}
                  />
                )}
                control={control}
                name="quotationDate"
              />
              <span className="highlight"></span>
              <Label htmlFor="inputQuotationDate">Quotation Date</Label>
              {errors.quotationDate?.message && (
                <p className="text-red-500">{errors.quotationDate?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Select id="inputCurrency" {...register("currency")}>
                <option value="">Select Currency</option>
                {currencyList &&
                  currencyList.map((currency) => (
                    <option key={currency.id} value={currency.name}>
                      {currency.name}
                    </option>
                  ))}
              </Select>
              <Label htmlFor="inputCurrency">Currency</Label>
              {errors.currency?.message && <p className="text-red-500">{errors.currency?.message}</p>}
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
    </>
  );
};

export default QuotationsFormAction;

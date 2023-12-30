import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { BsPencilSquare } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from "react-toastify";
import { useProformaInvoiceEditMutation, useCurrency } from "api/useApi";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  customerId: z.string().min(1, "Customer Name is required"),
  quotationNo: z.string().min(3, "Quotation No is required"),
  quotationDate: z.date({ required_error: "Please select a date" }),
  currency: z.string().min(1, "Currency is required"),
  otherCharges: z.string().optional(),
  otherChargesDescription: z.string().optional(),
});

const { Group, Control, Label, Select } = Form;

const ProformaInvoiceFormAction = (props) => {
  const { type, queryClient, proformaInvoiceRow, customerList } = props || {};

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const { data: currencyList } = useCurrency();

  const { mutate: proformaInvoiceEditMutate } = useProformaInvoiceEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allProformaInvoiceData"],
      });
      toast.success("Proforma Invoice updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { customer } = proformaInvoiceRow || {};

  const filterByCustomerName = customerList
    ? String(customerList.find((item) => item.name === customer?.name)?.id)
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
    defaultValues: {
      customerId: proformaInvoiceRow ? filterByCustomerName : "",
      quotationNo: proformaInvoiceRow ? proformaInvoiceRow.quotationNo : "",
      quotationDate: proformaInvoiceRow ? proformaInvoiceRow.quotationDate ? parseISO(proformaInvoiceRow.quotationDate) : null : new Date(),
      currency: proformaInvoiceRow ? proformaInvoiceRow.currency : "",
      otherCharges: proformaInvoiceRow ? proformaInvoiceRow.otherCharges : "",
      otherChargesDescription: proformaInvoiceRow ? proformaInvoiceRow.otherChargesDescription : "",
    },
  });

  useEffect(() => {
    if (show && type === "edit") {
      if (customerList) {
        reset({ customerId: proformaInvoiceRow ? filterByCustomerName : "" });
      }
    }
  }, [customerList, show, type]);

  const onSubmit = (data, id) => {
    const {
      customerId,
      quotationNo,
      quotationDate,
      currency,
      otherCharges,
      otherChargesDescription,
    } = data;

    const proformaInvoiceNo = proformaInvoiceRow.proformaInvoiceNo;

    const reqData = {
      proformaInvoiceNo,
      customerId: Number(customerId),
      quotationNo,
      quotationDate,
      currency,
      otherCharges: otherCharges === "" ? 0 : Number(otherCharges),
      otherChargesDescription: otherChargesDescription === "" ? "Other Charges" : otherChargesDescription,
    };

    if (proformaInvoiceRow?.id !== undefined) {
      proformaInvoiceEditMutate({ id: proformaInvoiceRow.id, ...reqData });
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
        variant="link"
        className="edit-btn"
        style={{ display: "flex", alignItems: "center" }}
      >
        <BsPencilSquare className="text-lg mr-1" />
        <span>Edit</span>
      </Button>
      <Modal show={show} onHide={handleClose} centered className="dialog">
        <Modal.Header closeButton className="dialog-h">
          <Modal.Title className="dialog-t">
            {type === "add" ? "Add New Record" : "Edit Record"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit((data) => onSubmit(data, proformaInvoiceRow?.id))}>
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
                        defaultSelected={proformaInvoiceRow ? [customer] : []}
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
              <Label htmlFor="inputQuotationNo">quotation No</Label>
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
                    customInput={<Control id="inputQuotationDate" />}
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
              {errors.currency?.message && (
                <p className="text-red-500">{errors.currency?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputOtherCharges"
                className="form-control"
                type="text"
                {...register("otherCharges")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputOtherCharges">Other Charges (optional)</Label>
              {errors.otherCharges?.message && (
                <p className="text-red-500">{errors.otherCharges?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputOtherChargesDescription"
                className="form-control"
                type="text"
                {...register("otherChargesDescription")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputOtherChargesDescription">
                Other Charges Description (optional)
              </Label>
              {errors.otherChargesDescription?.message && (
                <p className="text-red-500">
                  {errors.otherChargesDescription?.message}
                </p>
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

export default ProformaInvoiceFormAction;

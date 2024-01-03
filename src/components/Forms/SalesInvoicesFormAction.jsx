import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import { useSalesInvoice, useSalesInvoiceMutation, useSalesInvoiceEditMutation, useCountries, useStates, useCustomer } from "api/useApi";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const { Group, Control, Label, Select } = Form;

const SalesInvoicesFormAction = (props) => {
  const { type, queryClient, selectedCompanyId, salesInvoicesRow } = props || {};

  const [show, setShow] = useState(false);
  const [selectedStateCode, setSelectedStateCode] = useState("");

  const [useSameBillAddress, setUseSameBillAddress] = useState(true);
  const [showAdditionalAddressFields, setShowAdditionalAddressFields] = useState(false);

  const [showGstField, setShowGstField] = useState(salesInvoicesRow?.gst > 0);
  // const [gstValue, setGstValue] = useState(18);

  const [useDeliveryAddressCountry, setDeliveryAddressCountry] = useState(
    salesInvoicesRow ? salesInvoicesRow.deliveryAddressCountry : ""
  );
  const [useDeliveryAddressState, setDeliveryAddressState] = useState(
    salesInvoicesRow ? salesInvoicesRow.deliveryAddressState : ""
  );

  const [nextInvoiceNo, setNextInvoiceNo] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState(salesInvoicesRow?.countryId || "");
  const [selectedStateId, setSelectedStateId] = useState(salesInvoicesRow?.stateId || "");

  const { data: salesInvoiceList } = useSalesInvoice("", "", "", "", "", "", selectedCompanyId, "true");

  const { data: countryList } = useCountries();
  const { data: deliveryCountryList } = useCountries();
  const { data: customerList, } = useCustomer("", "", "", "", selectedCompanyId, "true");
  const { data: deliveryCustomerList } = useCustomer("", "", "", "", selectedCompanyId, "true");

  function handleClose() {
    setShow(false);
  }

  const navigate = useNavigate();

  const schema = z.object({
    customerId: z.string().min(1, "Customer Name is required"),
    invoiceNo: z.string().min(1, "Invoice No is required"),
    invoiceDate: z.date({ required_error: "Please select a date" }),
    transportationMode: z.string().min(3, "Transportation Mode is required"),
    vehicleNo: z.string().min(1, "Vehicle No is required"),
    dateOfSupply: z.date({ required_error: "Please select a date" }),
    placeOfSupply: z.string().min(1, "Place Of Supply is required"),
    poNumber: z.string().optional(),
    otherCharges: z.string().optional(),
    otherChargesDescription: z.string().optional(),
    shipToCustomerId: z.string().optional(),
    deliveryAddress: z.string().optional(),
    deliveryAddressCity: z.string().optional(),
    deliveryAddressState: z.string().optional(),
    deliveryAddressCountry: z.string().optional(),
    deliveryAddressPostalCode: z.string().optional(),
    gst: showGstField
      ? z.string().min(1, "Other Chargers GST value is required")
      : z.string().optional(),
    ...(useSameBillAddress
      ? {}
      : {
        shipToCustomerId: z.string().min(1, "Ship To Customer is required"),
        deliveryAddress: z.string().min(1, "Delivery Address is required"),
        deliveryAddressCity: z.string().min(1, "Delivery City is required"),
        deliveryAddressState: z.string().min(1, "Delivery State is required"),
        deliveryAddressCountry: z.string().min(1, "Delivery Country is required"),
        deliveryAddressPostalCode: z.string().min(1, "Delivery Postal Code is required"),
      }),
  });

  const { mutate: salesInvoiceMutate } = useSalesInvoiceMutation({
    onSuccess: (data, variables, context) => {
      const { id } = data;
      setShow(false);
      navigate(`${id}/`, { replace: true });
      queryClient.invalidateQueries({
        queryKey: ["allSalesInvoiceData"],
      });
      toast.success("Sales Invoice added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: salesInvoiceEditMutate } = useSalesInvoiceEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allSalesInvoiceData"],
      });
      toast.success("Sales Invoice updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { customer, countryName, stateName } = salesInvoicesRow || {};

  const filterByCustomerName = customerList?.items
    ? String(customerList?.items.find((item) => item.name === customer?.name)?.id)
    : "";

  const filterByCountryName = countryList
    ? String(countryList.find((item) => item.name === countryName)?.id)
    : "";

  const { shipToCustomerId, deliveryAddressCountry, deliveryAddressState } = salesInvoicesRow || {};

  const filterByDeliveryCustomerId = deliveryCustomerList?.items
    ? String(deliveryCustomerList?.items.find((item) => item.id === shipToCustomerId)?.id)
    : "";

  const filterByDeliveryCustomer = shipToCustomerId
    ? deliveryCustomerList?.items
      ? deliveryCustomerList?.items.find((item) => item.id === shipToCustomerId)
      : ""
    : customer;

  const filterByDeliveryCountryName = deliveryCountryList
    ? deliveryCountryList.find((item) => item.name === deliveryAddressCountry)?.id
    : "";

  const selectedDeliveryCountryId = deliveryCountryList
    ? deliveryCountryList.find((country) => country.name === useDeliveryAddressCountry)?.id
    : "";

  const { data: deliveryStateList } = useStates({ selectedCountryId: selectedDeliveryCountryId });

  const filterByDeliveryStateName = deliveryStateList
    ? deliveryStateList.find((item) => item.name === deliveryAddressState)?.id
    : "";


  const generateNextInvoiceNo = (salesInvoiceList) => {

    const invoiceNumbers = salesInvoiceList?.items?.map((invoice) => {
      const number = Number(invoice?.invoiceNo?.substr(3));
      return isNaN(number) ? 0 : number;
    });

    const latestInvoiceNo = Math.max(...invoiceNumbers);

    const nextInvoiceNoNumber =
      isNaN(latestInvoiceNo) || !isFinite(latestInvoiceNo) ? 1 : latestInvoiceNo + 1;

    return `DTS${String(nextInvoiceNoNumber).padStart(3, "0")}`;
  };

  useEffect(() => {
    if (type === "add" && salesInvoiceList?.items) {
      const generatedInvoiceNo = generateNextInvoiceNo(salesInvoiceList);
      setNextInvoiceNo(generatedInvoiceNo);
      setValue("invoiceNo", generatedInvoiceNo);
    } else if (type === "edit" && salesInvoicesRow) {
      setNextInvoiceNo(salesInvoicesRow.invoiceNo);
      setValue("invoiceNo", salesInvoicesRow.invoiceNo);
    }
  }, [type, salesInvoiceList?.items, salesInvoicesRow]);

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
      customerId: salesInvoicesRow ? filterByCustomerName : "",
      invoiceNo: salesInvoicesRow ? salesInvoicesRow.invoiceNo : nextInvoiceNo,
      invoiceDate: salesInvoicesRow ? salesInvoicesRow.invoiceDate ? parseISO(salesInvoicesRow.invoiceDate) : null : new Date(),
      countryId: salesInvoicesRow ? filterByCountryName : "",
      stateId: salesInvoicesRow ? salesInvoicesRow.stateId : "",
      stateCode: salesInvoicesRow ? salesInvoicesRow.stateCode : "",
      transportationMode: salesInvoicesRow ? salesInvoicesRow.transportationMode : "",
      vehicleNo: salesInvoicesRow ? salesInvoicesRow.vehicleNo : "",
      dateOfSupply: salesInvoicesRow ? salesInvoicesRow.dateOfSupply ? parseISO(salesInvoicesRow.dateOfSupply) : null : new Date(),
      placeOfSupply: salesInvoicesRow ? salesInvoicesRow.placeOfSupply : "",
      poNumber: salesInvoicesRow ? salesInvoicesRow.poNumber : "",
      otherCharges: salesInvoicesRow ? salesInvoicesRow.otherCharges : "0",
      otherChargesDescription: salesInvoicesRow ? salesInvoicesRow.otherChargesDescription : "Other Charges",
      shipToCustomerId: salesInvoicesRow ? filterByDeliveryCustomerId.toString() : "",
      deliveryAddress: salesInvoicesRow ? salesInvoicesRow.deliveryAddress : "",
      deliveryAddressCity: salesInvoicesRow ? salesInvoicesRow.deliveryAddressCity : "",
      deliveryAddressCountry: salesInvoicesRow ? filterByDeliveryCountryName : "",
      deliveryAddressState: salesInvoicesRow ? filterByDeliveryStateName : "",
      deliveryAddressPostalCode: salesInvoicesRow ? salesInvoicesRow.deliveryAddressPostalCode : "",
      gst: salesInvoicesRow ? salesInvoicesRow.gst : "18",
    },
  });

  useEffect(() => {
    if (show && type === "edit") {
      if (customerList?.items) {
        reset({ customerId: salesInvoicesRow ? filterByCustomerName : "" });
      }
    }
  }, [customerList?.items, show, type]);

  const watchCountry = watch("countryId", salesInvoicesRow ? filterByCountryName : "");

  
  const { data: stateList } = useStates({ selectedCountryId: watchCountry });
  
  const filterByStateName = stateList
  ? String(stateList.find((item) => item.name === stateName)?.id)
  : "";
  
  const selectedCountry = selectedCustomer ? countryList ? countryList.find(country => country.name === selectedCustomer.country) : "" : "";
  const { data: stateListsData } = useStates({ selectedCountryId: selectedCountryId });
  const selectedState = stateListsData ? stateListsData.find(state => state.name === selectedCustomer.state) : "";
  
    useEffect(() => {
      if (selectedCustomer) {
        if (selectedCountry) {
          setValue("countryId", String(selectedCountry.id));
          setSelectedCountryId(selectedCountry.id);
        }
      }
    }, [selectedCustomer, countryList]);

    useEffect(() => {
      if (selectedCountryId) {
        if (selectedState) {
          setValue("stateId", String(selectedState.id));
          setSelectedStateId(selectedState.id);
        }
      }
    }, [selectedCustomer, stateListsData]);

    useEffect(() => {
      if (selectedStateId && stateListsData) {
        const selectedState = stateListsData.find((state) => state.id === selectedStateId);
        if (selectedState) {
          setSelectedStateCode(selectedState ? selectedState.stateCode : "");
        }
      }
    }, [selectedStateId, stateListsData]);

  useEffect(() => {
    if (show && type === "edit") {
      if (countryList) {
        reset({ countryId: salesInvoicesRow ? filterByCountryName : "" });
      }
    }
  }, [countryList, show, type]);

  useEffect(() => {
    if (show && type === "edit") {
      if (stateList) {
        reset({ stateId: salesInvoicesRow ? filterByStateName : "" });
      }
    }
  }, [stateList, show, type]);

  useEffect(() => {
    if (show && type === "edit") {
      if (deliveryCustomerList?.items) {
        reset({ shipToCustomerId: salesInvoicesRow ? filterByDeliveryCustomerId : "" });
      }
    }
  }, [deliveryCustomerList?.items, show, type]);

  useEffect(() => {
    if (show && type === "edit") {
      if (deliveryCountryList) {
        setDeliveryAddressCountry(
          salesInvoicesRow ? salesInvoicesRow.deliveryAddressCountry : ""
        );
      }
    }
  }, [deliveryCountryList, show, type, salesInvoicesRow]);

  useEffect(() => {
    if (show && type === "edit") {
      if (deliveryStateList) {
        setDeliveryAddressState(
          salesInvoicesRow ? salesInvoicesRow.deliveryAddressState : ""
        );
      }
    }
  }, [deliveryStateList, show, type, salesInvoicesRow]);

  useEffect(() => {
    if (show && type === "edit") {
      const hasAddressData =
        salesInvoicesRow?.deliveryAddress &&
        salesInvoicesRow?.deliveryAddressCity &&
        salesInvoicesRow?.deliveryAddressState &&
        salesInvoicesRow?.deliveryAddressCountry &&
        salesInvoicesRow?.deliveryAddressPostalCode;

      if (hasAddressData) {
        setUseSameBillAddress(false);
        setShowAdditionalAddressFields(true);
      } else {
        setUseSameBillAddress(true);
        setShowAdditionalAddressFields(false);
      }
    }
  }, [show, type, salesInvoicesRow]);

  const handleCheckboxChange = (e) => {
    setShowGstField(e.target.checked);
    if (!e.target.checked) {
      setValue("gst", "18");
    }
  };

  const handleAddressOptionChange = (e) => {
    const { value } = e.target;
    if (value === "sameAddress") {
      setUseSameBillAddress(true);
      setShowAdditionalAddressFields(false);
    } else if (value === "additionalAddress") {
      setUseSameBillAddress(false);
      setShowAdditionalAddressFields(true);
    }
  };

  const onSubmit = (data, id) => {
    const { customerId, invoiceNo, shipToCustomerId, invoiceDate, transportationMode, vehicleNo, dateOfSupply, placeOfSupply, poNumber, otherCharges, otherChargesDescription, deliveryAddress, deliveryAddressCity, deliveryAddressState, deliveryAddressCountry, deliveryAddressPostalCode, gst } = data;

    const reqData = {
      customerId: Number(customerId),
      invoiceNo,
      invoiceDate,
      stateId: selectedStateId ? selectedStateId : salesInvoicesRow.stateId,
      stateCode: selectedStateCode ? selectedStateCode : salesInvoicesRow?.stateCode,
      transportationMode,
      vehicleNo,
      dateOfSupply,
      placeOfSupply,
      poNumber,
      companyId: selectedCompanyId,
      otherCharges: otherCharges === "" ? 0 : Number(otherCharges),
      otherChargesDescription: otherChargesDescription === "" ? "Other Charges" : otherChargesDescription,
      gst: showGstField ? (gst === "" ? Number("0") : Number(gst)) : Number("0"),
      ...(useSameBillAddress
        ? {
          shipToCustomerId: Number(customerId),
        }
        : {
          shipToCustomerId: Number(shipToCustomerId),
          deliveryAddress: deliveryAddress,
          deliveryAddressCity: deliveryAddressCity,
          deliveryAddressState: deliveryAddressState,
          deliveryAddressCountry: deliveryAddressCountry,
          deliveryAddressPostalCode: deliveryAddressPostalCode,
        }),
    };

    if (salesInvoicesRow?.id !== undefined) {
      salesInvoiceEditMutate({ id: salesInvoicesRow.id, ...reqData });
    } else {
      salesInvoiceMutate(reqData);
      reset();
    }
  };

  const handleDropDownChange = (selected) => {
    if (selected[0]) {
      setValue("customerId", String([selected[0].id]));
      setSelectedCustomer(selected[0]);
    } else {
      setValue("customerId", []);
      setSelectedCustomer("");
    }
  };
  const handleDropDownChangedelivery = (selected) => {
    if (selected[0]) {
      setValue("shipToCustomerId", String([selected[0].id]));
    } else {
      setValue("shipToCustomerId", []);
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
      <Modal show={show} onHide={handleClose} centered className={showAdditionalAddressFields ? "sales-modal" : "dailog"}>
        <Modal.Header closeButton className="dialog-h">
          <Modal.Title className="dialog-t">
            {type === "add" ? "Add New Record" : "Edit Record"}
          </Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={handleSubmit((data) => onSubmit(data, salesInvoicesRow?.id))}
        >
          <Modal.Body>
            <Container>
              <Row>
                <Col>
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
                              options={customerList?.items}
                              placeholder="Select Customer"
                              onChange={handleDropDownChange}
                              defaultSelected={salesInvoicesRow ? [customer] : []}
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
                    id="inputInvoiceNo"
                    className="form-control"
                    type="text"
                    {...register("invoiceNo")}
                    placeholder=" "
                  />
                  <span className="highlight"></span>
                  <Label htmlFor="inputInvoiceNo">Invoice No</Label>
                  {errors.invoiceNo?.message && (
                    <p className="text-red-500">{errors.invoiceNo?.message}</p>
                  )}
                </Group>
                  <Group style={{ marginLeft: "10px", paddingBottom: "5px" }}>
                    <Label style={{ color: "#8d8d8d", fontSize: "14px" }}>Delivery Address:</Label>
                    <div className="radio-group">
                      <label className="filter-check">
                        <Form.Check
                          type="radio"
                          value="sameAddress"
                          checked={useSameBillAddress}
                          onChange={handleAddressOptionChange}
                        />
                        <span className="radio-label">Same Bill Address</span>
                      </label>
                      <label className="filter-check">
                        <Form.Check
                          type="radio"
                          value="additionalAddress"
                          checked={!useSameBillAddress}
                          onChange={handleAddressOptionChange}
                        />
                        <span className="radio-label">Add Bill Address</span>
                      </label>
                    </div>
                  </Group>
                  <Group className="form-floating datePiker">
                    <Controller
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DatePicker
                          dateFormat="dd/MM/yyyy"
                          onChange={onChange}
                          onBlur={onBlur}
                          selected={value}
                          customInput={<Control id="inputInvoiceDate"
                          />}
                        />
                      )}
                      control={control}
                      name="invoiceDate"
                    />
                    <span className="highlight"></span>
                    <Label htmlFor="inputInvoiceDate">Invoice Date</Label>
                    {errors.invoiceDate?.message && (
                      <p className="text-red-500">{errors.invoiceDate?.message}</p>
                    )}
                  </Group>
                  <Group className="form-floating">
                    <Control
                      id="inputTransportationMode"
                      className="form-control"
                      type="text"
                      {...register("transportationMode")}
                      placeholder=" "
                    />
                    <span className="highlight"></span>
                    <Label htmlFor="inputTransportationMode">Transportation Mode</Label>
                    {errors.transportationMode?.message && (
                      <p className="text-red-500">{errors.transportationMode?.message}</p>
                    )}
                  </Group>
                  <Group className="form-floating">
                    <Control
                      id="inputVehicleNo"
                      className="form-control"
                      type="text"
                      {...register("vehicleNo")}
                      placeholder=" "
                    />
                    <span className="highlight"></span>
                    <Label htmlFor="inputVehicleNo">Vehicle No</Label>
                    {errors.vehicleNo?.message && (
                      <p className="text-red-500">{errors.vehicleNo?.message}</p>
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
                          customInput={<Control id="inputDateOfSupply"
                          />}
                        />
                      )}
                      control={control}
                      name="dateOfSupply"
                    />
                    <span className="highlight"></span>
                    <Label htmlFor="inputDateOfSupply">Date Of Supply</Label>
                    {errors.dateOfSupply?.message && (
                      <p className="text-red-500">{errors.dateOfSupply?.message}</p>
                    )}
                  </Group>
                  <Group className="form-floating">
                    <Control
                      id="inputPlaceOfSupply"
                      className="form-control"
                      type="text"
                      {...register("placeOfSupply")}
                      placeholder=" "
                    />
                    <span className="highlight"></span>
                    <Label htmlFor="inputPlaceOfSupply">Place Of Supply</Label>
                    {errors.placeOfSupply?.message && (
                      <p className="text-red-500">{errors.placeOfSupply?.message}</p>
                    )}
                  </Group>
                  <Group className="form-floating">
                    <Control
                      id="inputPoNumber"
                      className="form-control"
                      type="text"
                      {...register("poNumber")}
                      placeholder=" "
                    />
                    <span className="highlight"></span>
                    <Label htmlFor="inputPoNumber">Purchase Order Number (optional)</Label>
                    {errors.poNumber?.message && (
                      <p className="text-red-500">{errors.poNumber?.message}</p>
                    )}
                  </Group>
                  <div className="flex otherChargesgst">
                    <Group className="form-floating" style={{ width: "300px" }}>
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
                    <Form.Check
                      type="checkbox"
                      style={{ margin: "auto" }}
                      label="Include GST"
                      checked={showGstField}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  {showGstField && (
                    <Group className="form-floating">
                      <Control
                        id="inputGst"
                        className="form-control"
                        type="text"
                        {...register("gst")}
                        placeholder=" "
                      />
                      <span className="highlight"></span>
                      <Label htmlFor="inputGst">Other Charges GST</Label>
                      {errors.gst?.message && (
                        <p className="text-red-500">{errors.gst?.message}</p>
                      )}
                    </Group>
                  )}
                  <Group className="form-floating">
                    <Control
                      id="inputOtherChargesDescription"
                      className="form-control"
                      type="text"
                      {...register("otherChargesDescription")}
                      placeholder=" "
                    />
                    <span className="highlight"></span>
                    <Label htmlFor="inputOtherChargesDescription">Other Charges Description (optional)</Label>
                    {errors.otherChargesDescription?.message && (
                      <p className="text-red-500">{errors.otherChargesDescription?.message}</p>
                    )}
                  </Group>
                </Col>
                <Col className={showAdditionalAddressFields ? "" : "deliveryShow"}>
                  <Label>Delivery Address:</Label>
                  <Group className="form-floating mt-3">
                    <Label className="dropdown-label">Ship To Customer Name</Label>
                    <div className="input-container">
                      <Controller
                        name="shipToCustomerId"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Typeahead
                              {...field}
                              id="shipToCustomerId"
                              labelKey={(option) => option.name}
                              options={deliveryCustomerList?.items}
                              placeholder="Select Ship To Customer"
                              onChange={handleDropDownChangedelivery}
                              defaultSelected={salesInvoicesRow ? [filterByDeliveryCustomer] : []}
                            />
                          </>
                        )}
                      />
                      <div className="dropdown-arrow">
                        <FiChevronDown />
                      </div>
                    </div>
                    {errors.shipToCustomerId?.message && (
                      <p className="text-red-500">{errors.shipToCustomerId?.message}</p>
                    )}
                  </Group>
                  <Group className="form-floating">
                    <Control
                      id="deliveryAddress"
                      className="form-control"
                      type="text"
                      {...register("deliveryAddress")}
                      placeholder=" "
                    />
                    <span className="highlight"></span>
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    {errors.deliveryAddress?.message && (
                      <p className="text-red-500">{errors.deliveryAddress?.message}</p>
                    )}
                  </Group>
                  <Group className="form-floating">
                    <Control
                      id="deliveryAddressCity"
                      className="form-control"
                      type="text"
                      {...register("deliveryAddressCity")}
                      placeholder=" "
                    />
                    <span className="highlight"></span>
                    <Label htmlFor="deliveryAddressCity">Delivery City</Label>
                    {errors.deliveryAddressCity?.message && (
                      <p className="text-red-500">{errors.deliveryAddressCity?.message}</p>
                    )}
                  </Group>
                  <Group className="form-floating">
                    <Select
                      id="deliveryAddressCountry"
                      {...register("deliveryAddressCountry")}
                      value={useDeliveryAddressCountry}
                      onChange={(e) => setDeliveryAddressCountry(e.target.value)}
                    >
                      <option value="">Select Delivery Country</option>
                      {deliveryCountryList &&
                        deliveryCountryList.map((country) => (
                          <option key={country.id} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                    </Select>
                    <Label htmlFor="deliveryAddressCountry">Delivery Country</Label>
                    {errors.deliveryAddressCountry?.message && <p className="text-red-500">{errors.deliveryAddressCountry?.message}</p>}
                  </Group>
                  <Group className="form-floating">
                    <Select id="deliveryAddressState" {...register("deliveryAddressState")}
                      value={useDeliveryAddressState}
                      onChange={(e) => setDeliveryAddressState(e.target.value)}
                    >
                      <option value="">Select State</option>
                      {deliveryStateList &&
                        deliveryStateList.map((state) => (
                          <option key={state.id} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                    </Select>
                    <Label htmlFor="deliveryAddressState">Delivery State</Label>
                    {errors.deliveryAddressState?.message && <p className="text-red-500">{errors.deliveryAddressState?.message}</p>}
                  </Group>
                  <Group className="form-floating">
                    <Control
                      id="deliveryAddressPostalCode"
                      className="form-control"
                      type="text"
                      {...register("deliveryAddressPostalCode")}
                      placeholder=" "
                    />
                    <span className="highlight"></span>
                    <Label htmlFor="deliveryAddressPostalCode">Delivery Postal Code</Label>
                    {errors.deliveryAddressPostalCode?.message && (
                      <p className="text-red-500">{errors.deliveryAddressPostalCode?.message}</p>
                    )}
                  </Group>
                </Col>
              </Row>
            </Container>
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

export default SalesInvoicesFormAction;

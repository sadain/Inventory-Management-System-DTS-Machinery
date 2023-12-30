import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { useForm, Controller } from "react-hook-form";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { toast } from "react-toastify";
import { usePurchaseOrdersMutation, usePurchaseOrdersEditMutation } from "api/useApi"
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import { usePurchaseOrders } from "api/useApi";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  supplierId: z.string().min(1, "Supplier Name is required"),
  invoiceNo: z.string().min(1, "Invoice No is required"),
  invoiceDate: z.date({ required_error: "Please select a date" }),
});

const { Group, Control, Label } = Form;

const PurchaseOrdersFormAction = (props) => {
  const { type, queryClient, selectedCompanyId, purchaseOrderRow, supplierList } = props || {};

  const [show, setShow] = useState(false);

  const [nextInvoiceNo, setNextInvoiceNo] = useState("");

  const { data: PurchaseOrderList } = usePurchaseOrders("", "", "", "", "", "", selectedCompanyId, "true");

  function handleClose() {
    setShow(false);
  }

  const navigate = useNavigate();

  const { mutate: purchaseOrderMutate } = usePurchaseOrdersMutation({
    onSuccess: (data, error, variables, context) => {
      const { id } = data;
      setShow(false);
      navigate(`${id}/`, { replace: true });
      queryClient.invalidateQueries({
        queryKey: ["allPurchaseOrdersData"],
      });
      toast.success("Purchase Order added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: purchaseOrderEditMutate } = usePurchaseOrdersEditMutation({
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

  const { supplier } = purchaseOrderRow || {};

  const filterBySupplierName = supplierList
    ? String(supplierList.find((item) => item.name === supplier?.name)?.id)
    : "";

  const generateNextInvoiceNo = (purchaseOrderList) => {
    const invoiceNumbers = purchaseOrderList?.items?.map((order) => {
      const number = Number(order.invoiceNo.substr(3));
      return isNaN(number) ? 0 : number;
    });

    const latestInvoiceNo = Math.max(...invoiceNumbers);

    const nextInvoiceNoNumber =
      isNaN(latestInvoiceNo) || !isFinite(latestInvoiceNo) ? 1 : latestInvoiceNo + 1;

    return `DTS${String(nextInvoiceNoNumber).padStart(4, "0")}`;
  };

  useEffect(() => {
    if (type === "add" && PurchaseOrderList?.items) {
      const generatedInvoiceNo = generateNextInvoiceNo(PurchaseOrderList);
      setNextInvoiceNo(generatedInvoiceNo);
      setValue("invoiceNo", generatedInvoiceNo);
    } else if (type === "edit" && purchaseOrderRow) {
      setNextInvoiceNo(purchaseOrderRow.invoiceNo);
      setValue("invoiceNo", purchaseOrderRow.invoiceNo);
    }
  }, [type, PurchaseOrderList?.items, purchaseOrderRow]);

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
      supplierId: purchaseOrderRow ? filterBySupplierName : "",
      invoiceNo: purchaseOrderRow ? purchaseOrderRow.invoiceNo : nextInvoiceNo,
      invoiceDate: purchaseOrderRow ? purchaseOrderRow.invoiceDate ? parseISO(purchaseOrderRow.invoiceDate) : null : new Date(),
    },
  });

  useEffect(() => {
    if (show && type === "edit") {
      if (supplierList) {
        reset({ supplierId: purchaseOrderRow ? filterBySupplierName : "" });
      }
    }
  }, [supplierList, show, type]);

  const onSubmit = (data, id) => {
    const { supplierId, invoiceNo, invoiceDate } = data;

    // let nextInvoiceNo;

    // if (type === "add") {
    //   nextInvoiceNo = generateNextInvoiceNo(PurchaseOrderList);
    // } else {
    //   nextInvoiceNo = purchaseOrderRow?.invoiceNo || "";
    // }

    const reqData = {
      supplierId: Number(supplierId),
      invoiceNo,
      invoiceDate,
      companyId: selectedCompanyId,
    };

    if (purchaseOrderRow?.id !== undefined) {
      purchaseOrderEditMutate({ id: purchaseOrderRow.id, ...reqData });
    } else {
      purchaseOrderMutate(reqData);
      reset();
    }
  };

  const handleDropDownChange = (selected) => {
    if (selected[0]) {
      setValue("supplierId", String([selected[0].id]));
    } else {
      setValue("supplierId", []);
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
          onSubmit={handleSubmit((data) =>
            onSubmit(data, purchaseOrderRow?.id)
          )}
        >
          <Modal.Body>
            <Group className="form-floating mt-3">
              <Label className="dropdown-label">Supplier Name</Label>
              <div className="input-container">
                <Controller
                  name="supplierId"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Typeahead
                        {...field}
                        id="inputSupplier"
                        labelKey={(option) => option.name}
                        options={supplierList}
                        placeholder="Select Supplier"
                        onChange={handleDropDownChange}
                        defaultSelected={purchaseOrderRow ? [supplier] : []}
                      />
                    </>
                  )}
                />
                <div className="dropdown-arrow">
                  <FiChevronDown />
                </div>
              </div>
              {errors.supplierId?.message && (
                <p className="text-red-500">{errors.supplierId?.message}</p>
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

export default PurchaseOrdersFormAction;

import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from 'react-icons/ai';
import { BsPencilSquare } from 'react-icons/bs';
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { usePaymentPurchaseMutation, useCurrency, useExchangeRateLatest } from "api/useApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  referenceId: z.string().min(1, "Select Purchase Invoice No"),
  amount: z.string().min(1, "Amount is required"),
  remark: z.string().min(3, "Remark is required"),
});

const { Group, Control, Label, Select } = Form;

const PaymentPurchaseFormAction = (props) => {
  const { type, queryClient, paymentPurchaseRow, purchaseOrderList } = props || {};

  const [PaymentMode, setpaymentMode] = useState("1");
  const [currencyId, setCurrencyId] = useState("");

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { data: currencyList } = useCurrency();

  const { data: exchangeRateLatestList } = useExchangeRateLatest(currencyId);

  const { mutate: paymentPurchaseMutate } = usePaymentPurchaseMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allPaymentPurchaceData"],
      });
      toast.success("Purchace Payment added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { referenceId } = paymentPurchaseRow || {};

  const filterBypaymentPurchaceName = purchaseOrderList
    ? String(purchaseOrderList.find((item) => item.invoiceNo === referenceId)?.id)
    : "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    isDirty: true,
    defaultValues: {
      referenceId: paymentPurchaseRow ? filterBypaymentPurchaceName : "",
      amount: paymentPurchaseRow ? paymentPurchaseRow.amount : "",
      remark: paymentPurchaseRow ? paymentPurchaseRow.remark : "",
      paymentMode: paymentPurchaseRow ? paymentPurchaseRow.paymentMode : "",
      exchangeRate: "",
    },
  });

  useEffect(() => {
    if (show && type === "edit") {
      if (purchaseOrderList) {
        reset({ referenceId: paymentPurchaseRow ? filterBypaymentPurchaceName : "" });
      }
    }
  }, [purchaseOrderList, show, type]);

  const onSubmit = (data) => {
    const { referenceId, amount, remark } = data;

    const reqData = {
      referenceId: Number(referenceId),
      amount,
      remark,
      paymentMode: Number(PaymentMode),
      exchangeRate: Number(exchangeRateLatestList),
    };

    paymentPurchaseMutate(reqData);
    reset();
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
          onSubmit={handleSubmit((data) => onSubmit(data, paymentPurchaseRow?.id))}
        >
          <Modal.Body>
            <Group className="form-floating">
              <Select id="inputReferenceId" {...register("referenceId")}>
                <option value="">Select Purchase Order Number</option>
                {purchaseOrderList &&
                  purchaseOrderList.map((purchaseOrder) => (
                    <option key={purchaseOrder.id} value={String(purchaseOrder.id)}>
                      {purchaseOrder.invoiceNo}
                    </option>
                  ))}
              </Select>
              <Label htmlFor="inputReferenceId">Purchase Order Number</Label>
              {errors.referenceId?.message && (
                <p className="text-red-500">{errors.referenceId?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputAmount"
                className="form-control"
                type="text"
                {...register("amount")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputamount">Amount</Label>
              {errors.amount?.message && <p className="text-red-500">{errors.amount?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Select id="inputPaymentMode" {...register("paymentMode")}
                onChange={(e) => setpaymentMode(e.target.value)}
              // value={PaymentMode}
              >
                <option value="">Select Payment Mode</option>
                <option value="1">Bank Transfer</option>
                <option value="2">Cash</option>
                <option value="3">Cheque</option>
              </Select>
              <Label htmlFor="inputPaymentMode">Payment Mode</Label>
              {errors.paymentMode?.message && (
                <p className="text-red-500">{errors.paymentMode?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Select id="inputCurrencyId"
                onChange={(e) => setCurrencyId(e.target.value)}
              >
                <option value="">Select Currency for Exchange Rate</option>
                {currencyList &&
                  currencyList.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.name}
                    </option>
                  ))}
              </Select>
              <Label htmlFor="inputCurrencyId">Currency</Label>
            </Group>
            <Group className="form-floating">
              <Control
                id="inputRemarks"
                className="form-control"
                as="textarea"
                {...register("remark")}
                style={{ resize: "vertical", minHeight: "100px" }}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputRemark">Remark</Label>
              {errors.remark?.message && (
                <p className="text-red-500">{errors.remark?.message}</p>
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
    </div>
  );
};

export default PaymentPurchaseFormAction;

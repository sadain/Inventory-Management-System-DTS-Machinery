import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from 'react-icons/ai';
import { BsPencilSquare } from 'react-icons/bs';
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import { useExpenseMutation, useExpenseEditMutation, useCurrency, useExchangeRateLatest } from "api/useApi";
import ExpenseTypeFormAction from "components/Forms/ExpenseTypeFormAction";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  expenseTypeId: z.string().min(1, "Expense Type is required"),
  invoiceNo: z.string().optional(),
  ledgerDate: z.date({ message: "Please select a date" }),
  particulars: z.string().min(3, "Particulars is required"),
  currencyId: z.string().min(1, "Currency is required"),
  amount: z.string().min(1, "Amount is required"),
});

const { Group, Control, Label, Select } = Form;

const ExpenseFormAction = (props) => {
  const { type, queryClient, selectedCompanyId, expenseRow, expenseTypeList } = props || {};

  const [currencyId, setCurrencyId] = useState("");

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { data: currencyList } = useCurrency();

  const { data: exchangeRateLatestList } = useExchangeRateLatest(currencyId);

  const { mutate: expenseMutate } = useExpenseMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allExpensesData"],
      });
      toast.success("Expense added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: expenseEditMutate } = useExpenseEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allExpensesData"],
      });
      toast.success("Expense updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { currency, expenseType } = expenseRow || {};

  const filterByexpenseType = expenseTypeList
    ? String(expenseTypeList.find((item) => item.name === expenseType)?.id)
    : "";

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    isDirty: true,
    defaultValues: {
      expenseTypeId: expenseRow ? filterByexpenseType : "",
      invoiceNo: expenseRow ? expenseRow.invoiceNo : "",
      ledgerDate: expenseRow ? parseISO(expenseRow.ledgerDate) : new Date(),
      particulars: expenseRow ? expenseRow.particulars : "",
      currencyId: expenseRow ? expenseRow.currencyId : "",
      amount: expenseRow ? expenseRow.amount : "",
      exchangeRate: "",
    },
  });

  useEffect(() => {
    if (show && type === "edit") {
      if (currencyList) {
        const selectedCurrency = currencyList.find((currency) => currency.id === Number(currencyId));
        if (selectedCurrency) {
          setValue("exchangeRate", selectedCurrency.exchangeRate || "");
          setValue("currencyId", String(selectedCurrency.id));
        }
      }
    }
  }, [currencyList, show, type, currencyId, setValue]);


  const filterByCurrencyName = currencyList
    ? String(currencyList.find((item) => item.name === currency)?.id)
    : "";

  useEffect(() => {
    if (show && type === "edit") {
      if (currencyList) {
        reset({ currencyId: expenseRow ? filterByCurrencyName : "" });
      }
    }
  }, [currencyList, show, type]);

  const onSubmit = (data, id) => {
    const { expenseTypeId, invoiceNo, ledgerDate, particulars, currencyId, amount } = data;

    const reqData = {
      expenseTypeId: Number(expenseTypeId),
      invoiceNo,
      ledgerDate,
      particulars,
      amount: Number(amount),
      exchangeRate: Number(exchangeRateLatestList),
      currencyId: Number(currencyId),
      companyId: selectedCompanyId
    };

    if (expenseRow?.id !== undefined) {
      expenseEditMutate({ id: expenseRow.id, ...reqData });
    } else {
      expenseMutate(reqData);
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
          onSubmit={handleSubmit((data) => onSubmit(data, expenseRow?.id))}
        >
          <Modal.Body>
            <Group className="form-floating flex">
              <Select
                id="inputExpenseType"
                {...register("expenseTypeId")}
              >
                <option value="">Select Expense Type</option>
                {expenseTypeList &&
                  expenseTypeList.map((expenseType) => (
                    <option key={expenseType.id} value={String(expenseType.id)}>
                      {expenseType.name}
                    </option>
                  ))}
              </Select>
              <Label htmlFor="inputExpenseType">Expense Type</Label>
              {errors.expenseType?.message && <p className="text-red-500">{errors.expenseType?.message}</p>}
              <div className="addinline">
                <ExpenseTypeFormAction
                  type="add"
                  queryClient={queryClient}
                />
              </div>
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
              <Label htmlFor="inputInvoiceNo">Invoice No (optional)</Label>
              {errors.invoiceNo?.message && <p className="text-red-500">{errors.invoiceNo?.message}</p>}
            </Group>
            <Group className="form-floating datePiker">
              <Controller
                render={({ field: { onChange, onBlur, value } }) => (
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    onChange={onChange}
                    onBlur={onBlur}
                    selected={value}
                    customInput={<Control id="inputLedgerDate"
                    />}
                  />
                )}
                control={control}
                name="ledgerDate"
              />
              <span className="highlight"></span>
              <Label htmlFor="inputLedgerDate">Invoice Date</Label>
              {errors.ledgerDate?.message && (
                <p className="text-red-500">{errors.ledgerDate?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputParticulars"
                className="form-control"
                type="text"
                {...register("particulars")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputParticulars">Particulars</Label>
              {errors.particulars?.message && <p className="text-red-500">{errors.particulars?.message}</p>}
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
              <Label htmlFor="inputAmount">Amount</Label>
              {errors.amount?.message && <p className="text-red-500">{errors.amount?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Select id="inputCurrencyId" {...register("currencyId")}
                onChange={(e) => setCurrencyId(e.target.value)}
              >
                <option value="">Select Currency</option>
                {currencyList &&
                  currencyList.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.name}
                    </option>
                  ))}
              </Select>
              <Label htmlFor="inputCurrencyId">Currency</Label>
              {errors.currencyId?.message && <p className="text-red-500">{errors.currencyId?.message}</p>}
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

export default ExpenseFormAction;

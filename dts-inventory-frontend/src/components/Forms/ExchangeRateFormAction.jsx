import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import {
  useExchangeRateMutation,
  useExchangeRateEditMutation,
} from "api/useApi";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  currencyId: z.string().min(1, "Currency is required"),
  rate: z.string().min(1, "Rate is required"),
});

const { Group, Control, Label, Select } = Form;

const ExchangeRateFormAction = (props) => {
  const { type, queryClient, exchangeRateRow, currencyList } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: exchangeRaterMutate } = useExchangeRateMutation({
    onSuccess: () => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allExchangeRateData"],
      });
      toast.success("Exchange Rate added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { mutate: exchangeRateEditMutate } = useExchangeRateEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allExchangeRateData"],
      });
      toast.success("Exchange Rate updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const { currencyName } = exchangeRateRow || {};

  const filterBycurrencyName = currencyList
    ? String(currencyList.find((item) => item.name === currencyName)?.id)
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
      currencyId: exchangeRateRow ? filterBycurrencyName : "",
      rate: exchangeRateRow ? exchangeRateRow.rate : "",
    },
  });

  const onSubmit = (data, id) => {
    const { currencyId, rate } = data;

    const reqData = {
      currencyId: Number(currencyId),
      rate,
    };

    if (exchangeRateRow?.id !== undefined) {
      exchangeRateEditMutate({ id: exchangeRateRow.id, ...reqData });
    } else {
      exchangeRaterMutate(reqData);
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
          onSubmit={handleSubmit((data) => onSubmit(data, exchangeRateRow?.id))}
        >
          <Modal.Body>
            <Group className="form-floating">
              <Select id="inputCurrencyId" {...register("currencyId")}>
                <option value="">Select Currency</option>
                {currencyList &&
                  currencyList.map((currency) => (
                    <option key={currency.id} value={String(currency.id)}>
                      {currency.name}
                    </option>
                  ))}
              </Select>
              <Label htmlFor="inputcurrency">Currency</Label>
              {errors.currencyId?.message && <p className="text-red-500">{errors.currencyId?.message}</p>}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputRate"
                className="form-control"
                type="text"
                {...register("rate")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputRate">Rate</Label>
              {errors.rate?.message && <p className="text-red-500">{errors.rate?.message}</p>}
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

export default ExchangeRateFormAction;

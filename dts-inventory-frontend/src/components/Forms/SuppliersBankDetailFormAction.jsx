import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSupplierBankDetailMutation, useSupplierBankDetailEditMutation } from "api/useApi"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  accountName: z.string().min(1, "Account Name is required"),
  bankName: z.string().min(1, "Bank Name is required"),
  bankBranch: z.string().min(1, "Bank Branch is required"),
  accountNumber: z.string().min(1, "Account Number is required"),
  ifscCode: z.string().min(1, "IFSC Code is required"),
  swiftCode: z.string().min(1, "Swift Code is required"),
});

const { Group, Control, Label } = Form;

const SuppliersBankDetailFormAction = (props) => {
  const { type, queryClient, suppliersBankDetailRow, suppliersBankDetailId } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: supplierBankDetailMutate } = useSupplierBankDetailMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allSupplierBanksData"],
      });
      toast.success("Bank Details added successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });
  const { mutate: supplierBankDetailEditMutate } = useSupplierBankDetailEditMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allSupplierBanksData"],
      });
      toast.success("Bank Details updated successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    isDirty: true,
    defaultValues: {
      accountName: suppliersBankDetailRow ? suppliersBankDetailRow.accountName : "",
      bankBranch: suppliersBankDetailRow ? suppliersBankDetailRow.bankBranch : "",
      bankName: suppliersBankDetailRow ? suppliersBankDetailRow.bankName : "",
      accountNumber: suppliersBankDetailRow ? suppliersBankDetailRow.accountNumber : "",
      ifscCode: suppliersBankDetailRow ? suppliersBankDetailRow.ifscCode : "",
      swiftCode: suppliersBankDetailRow ? suppliersBankDetailRow.swiftCode : "",
    },
  });

  const onSubmit = (data) => {
    const { accountName, bankName, bankBranch, accountNumber, ifscCode, swiftCode } = data;

    const reqData = {
      supplierId: suppliersBankDetailId,
      accountName,
      bankName,
      bankBranch,
      accountNumber,
      ifscCode,
      swiftCode
    };

    if (suppliersBankDetailRow?.id !== undefined) {
      supplierBankDetailEditMutate({ id: suppliersBankDetailRow.id, ...reqData });
    } else {
      supplierBankDetailMutate(reqData);
      reset();
    }
  };

  return (
    <div>
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
          onSubmit={handleSubmit((data) => onSubmit(data, suppliersBankDetailRow?.id))}
        >
          <Modal.Body>
            <Group className="form-floating">
              <Control
                id="inputAccountName"
                className="form-control"
                type="text"
                {...register("accountName")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputAccountName">Account Name</Label>
              {errors.accountName?.message && (
                <p className="text-red-500">{errors.accountName?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputBankBranch"
                className="form-control"
                type="text"
                {...register("bankBranch")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputBankBranch">Bank Branch</Label>
              {errors.bankBranch?.message && (
                <p className="text-red-500">{errors.bankBranch?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputBankName"
                className="form-control"
                type="text"
                {...register("bankName")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputBankName">Bank Name</Label>
              {errors.bankName?.message && (
                <p className="text-red-500">{errors.bankName?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputAccountNumber"
                className="form-control"
                type="text"
                {...register("accountNumber")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputAccountNumber">account Number</Label>
              {errors.accountNumber?.message && (
                <p className="text-red-500">{errors.accountNumber?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputIfscCode"
                className="form-control"
                type="text"
                {...register("ifscCode")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputIfscCode">IFSC Code</Label>
              {errors.ifscCode?.message && (
                <p className="text-red-500">{errors.ifscCode?.message}</p>
              )}
            </Group>
            <Group className="form-floating">
              <Control
                id="inputSwiftCode"
                className="form-control"
                type="text"
                {...register("swiftCode")}
                placeholder=" "
              />
              <span className="highlight"></span>
              <Label htmlFor="inputSwiftCode">Swift Code</Label>
              {errors.swiftCode?.message && (
                <p className="text-red-500">{errors.swiftCode?.message}</p>
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

export default SuppliersBankDetailFormAction;

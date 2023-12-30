import React, { useState } from "react";
import { Modal, Button, Form, Collapse } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FiChevronDown } from "react-icons/fi";
import { useProformaInvoiceMutation } from "api/useApi";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  otherCharges: z.string().optional(),
  otherChargesDescription: z.string().optional(),
});

const { Group, Control, Label } = Form;

const ConfirmInvoiceFormAction = (props) => {
  const { queryClient, quotationRow, quotationViewList } = props;
  const { quotationRecords, quotationNo } = quotationViewList;

  const [show, setShow] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [selectedQuotationRecord, setSelectedQuotationRecord] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [hasError, setHasError] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const { mutate: proformaInvoiceMutate } = useProformaInvoiceMutation({
    onSuccess: (data, variables, context) => {
      setShow(false);
      queryClient.invalidateQueries({
        queryKey: ["allProformaInvoiceData"],
      });
      toast.success("Proforma Invoice Confirmed!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      quotationRecordIds: [],
      otherCharges: "",
      otherChargesDescription: "",
    },
  });

  if (!quotationViewList) {
    return null;
  }

  const toggleCollapse = () => {
    setOpenCollapse(!openCollapse);
  };

  const handleQuotationRecordSelection = (recordId) => {
    if (selectedQuotationRecord.includes(recordId)) {
      setSelectedQuotationRecord(selectedQuotationRecord.filter((id) => id !== recordId));
    } else {
      setSelectedQuotationRecord([...selectedQuotationRecord, recordId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuotationRecord([]);
    } else {
      setSelectedQuotationRecord(quotationRecords.map((record) => record.id));
    }
    setSelectAll(!selectAll);
  };

  const onSubmit = (data, id) => {
    const { otherCharges, otherChargesDescription } = data;

    if (selectedQuotationRecord.length === 0) {
      setHasError(true);
      return;
    }

    const reqData = {
      quotationRecordIds: selectedQuotationRecord,
      otherCharges: otherCharges === "" ? 0 : Number(otherCharges),
      otherChargesDescription: otherChargesDescription === "" ? "Other Charges" : otherChargesDescription,
    };

    proformaInvoiceMutate({ id: quotationRow.id, ...reqData });
  };

  return (
    <>
      <Button variant="link" className="form-btn confirm" onClick={() => setShow(true)} >Confirm Quotaion</Button>
      <Modal show={show} onHide={handleClose} centered className="dialog">
        <Modal.Header closeButton className="dialog-h">
          <Modal.Title className="dialog-t">
            Confrim PI:
          </Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={handleSubmit((data) => onSubmit(data, quotationRow?.id))}
        >
          <Modal.Body>
            <p style={{ paddingBottom: "10px" }}>Are you sure you want to confirm PI : {quotationNo}?</p>
            <div className="permission-item">
              <label className="pb-3">Select products:</label>
              <Button
                onClick={toggleCollapse}
                aria-controls="quotation-records-collapse"
                aria-expanded={openCollapse}
                variant="link"
                className="checkbox-button open"
              >
                <Form.Check
                  type="checkbox"
                  label="Select All Products"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <FiChevronDown className="dropdown-icon" />
              </Button>
              <Collapse className="checkbox-child" in={openCollapse}>
                <div id="quotation-records-collapse">
                  {quotationRecords &&
                    quotationRecords.map((record) => (
                      <Form.Check
                        key={record.id}
                        type="checkbox"
                        label={record.product.name}
                        onChange={() => handleQuotationRecordSelection(record.id)}
                        checked={selectedQuotationRecord.includes(record.id)}
                      />
                    ))}
                </div>
              </Collapse>
              {hasError && (
                <p className="text-red-500">Select at least one product</p>
              )}
            </div>
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
              <Label htmlFor="inputOtherChargesDescription">Other Charges Description (optional)</Label>
              {errors.otherChargesDescription?.message && (
                <p className="text-red-500">{errors.otherChargesDescription?.message}</p>
              )}
            </Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className="form-btn save" variant="link" type="submit">
              Confirm
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

export default ConfirmInvoiceFormAction;

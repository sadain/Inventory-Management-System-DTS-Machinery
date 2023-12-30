import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { CiViewList } from 'react-icons/ci'
import { format, parseISO } from 'date-fns';

const { Group } = Form;

const SalesInvoiceReportDetail = (props) => {
  const { SalesInvoiceReportDetailRow } = props || {};

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  const formatCurrency = (value) => {
    if (value === null) {
      return "";
    }
    const formattedValue = value.toLocaleString("en-IN", {
      style: "decimal",
      maximumFractionDigits: 2,
    });
    return formattedValue.endsWith(".00") ? formattedValue.slice(0, -3) : formattedValue;
  };

  const { customer, invoiceNo, invoiceDate, state, transportationMode, vehicleNo, dateOfSupply, placeOfSupply, poNumber, product, quantity, rate, amount, discount, taxableValue, cgstRate, cgstValue, sgstRate, sgstValue, igstRate, igstValue, total } = SalesInvoiceReportDetailRow;

  return (
    <div className="">
      <Button onClick={() => setShow(true)} variant="link" className="form-btn" style={{ display: "flex", alignItems: "center" }}>
        <CiViewList className="text-lg mr-1.5" />
        <span>View</span>
      </Button>
      <Modal show={show} onHide={handleClose} centered className="si-modal">
        <Modal.Header closeButton className="dialog-h">
          <Modal.Title className="dialog-t">
            Sales Invoice Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Group>
            <div className="report-detail">
              <p className="text"><span>Customer Name : </span>{customer}</p>
              <p className="text"><span>Invoice No : </span>{invoiceNo}</p>
              <p className="text"><span>Invoice Date : </span>{invoiceDate ? format(parseISO(invoiceDate), "dd-MM-yyyy") : ""}</p>
              <p className="text"><span>State : </span>{state}</p>
              <p className="text"><span>Transportation Mode : </span>{transportationMode}</p>
              <p className="text"><span>Vehicle No : </span>{vehicleNo}</p>
              <p className="text"><span>Date Of Supply : </span>{dateOfSupply ? format(parseISO(dateOfSupply), "dd-MM-yyyy") : ""}</p>
              <p className="text"><span>Place Of Supply : </span>{placeOfSupply}</p>
              <p className="text"><span>Po Number : </span>{poNumber}</p>
            </div>
          </Group>
          {/* <Table table={table} /> */}
          <div style={{ height: "auto", overflowY: "auto" }}>
            <table className="table table-hover table-bordered table-responsive si-view-table">
              <thead style={{ textTransform: "capitalize" }}>
                <th>Product</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Discount</th>
                <th>Taxable Value</th>
                <th>CGST Rate</th>
                <th>CGST Value</th>
                <th>SGST Rate</th>
                <th>SGST Value</th>
                <th>IGST Rate</th>
                <th>IGST Value</th>
                <th>Total</th>
              </thead>
              <tbody>
                <tr>
                  <td>{product}</td>
                  <td>{quantity}</td>
                  <td>{formatCurrency(rate)}</td>
                  <td>{formatCurrency(amount)}</td>
                  <td>{discount}</td>
                  <td>{formatCurrency(taxableValue)}</td>
                  <td>{cgstRate}</td>
                  <td>{formatCurrency(cgstValue)}</td>
                  <td>{sgstRate}</td>
                  <td>{formatCurrency(sgstValue)}</td>
                  <td>{igstRate}</td>
                  <td>{formatCurrency(igstValue)}</td>
                  <td>{formatCurrency(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="form-btn cancel" variant="link" onClick={handleClose} >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SalesInvoiceReportDetail;

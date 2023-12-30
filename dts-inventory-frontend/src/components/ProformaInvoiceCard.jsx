import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { MdOutlinePictureAsPdf } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import ProformaInvoiceFormAction from "../components/Forms/ProformaInvoiceFormAction";
import ProformaInvoiceFormDelete from "../components/Forms/ProformaInvoiceFormDelete";
import { format, parseISO } from 'date-fns';
import { Link } from "react-router-dom";

const ProformaInvoiceCard = (props) => {
  const { queryClient, selectedCompanyId, proformaInvoice, customerList } = props;

  const { id, proformaInvoiceNo, quotationNo, quotationDate, customer, currency } = proformaInvoice;

  const { name } = customer;

  const [showActions, setShowActions] = useState(false);

  const handleThreeDotClick = () => {
    setShowActions(!showActions);
  };

  return (
    <Card className="card-box">
      <Link to={`${id}/`} className="proformaInvoicePages">
        <Card.Body>
          <Card.Text className="text"><span>Proforma Invoice No: </span>{proformaInvoiceNo}</Card.Text>
          <Card.Text className="text"><span>Quotation No: </span>{quotationNo}</Card.Text>
          <Card.Text className="text"><span>Quotation Date: </span>{quotationDate ? format(parseISO(quotationDate), "dd-MM-yyyy") : ""}</Card.Text>
          <Card.Text className="text"><span>Customer Name: </span>{name}</Card.Text>
          <Card.Text className="text"><span>Currency: </span>{currency}</Card.Text>
        </Card.Body>
      </Link>
      <Button onClick={handleThreeDotClick} variant="link" className="three-dot-icon">
        <BsThreeDotsVertical />
      </Button>
      {showActions && (
        <div className="drop-btn">
          <ProformaInvoiceFormAction type="edit" queryClient={queryClient} selectedCompanyId={selectedCompanyId} proformaInvoiceRow={proformaInvoice} customerList={customerList} />
          <ProformaInvoiceFormDelete type="delete" queryClient={queryClient} proformaInvoiceRow={proformaInvoice} />
          <Link to={`pdf/${id}/`} className="DispatchChallanPages">
            <Button variant="link" className="pdf-btn" style={{ display: "flex", alignItems: "center" }}>
              <MdOutlinePictureAsPdf className="text-l mr-1" />
              <span>Export</span>
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default ProformaInvoiceCard;

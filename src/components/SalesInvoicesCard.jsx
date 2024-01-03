import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { MdOutlinePictureAsPdf } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { format, parseISO } from 'date-fns';
import SalesInvoicesFormAction from "./Forms/SalesInvoicesFormAction";
import SalesInvoicesFormDelete from "./Forms/SalesInvoicesFormDelete";
import { Link } from "react-router-dom";
import usePermission from "contexts/usePermission";
import { PERMISSIONS } from "utils/Permissions";

const SalesInvoicesCard = (props) => {
  const { salesInvoices, queryClient, selectedCompanyId, purchaseOrderList } = props;

  const { id, customer, shipToCustomerId, invoiceNo, invoiceDate, stateId, stateCode, transportationMode, vehicleNo, dateOfSupply, placeOfSupply, poNumber } = salesInvoices;

  const { name } = customer;

  const { hasPermission } = usePermission();

  const {
    CAN_USER_UPDATE_SALESINVOICE,
    CAN_USER_DELETE_SALESINVOICE,
  } = PERMISSIONS;

  const [showActions, setShowActions] = useState(false);

  const handleThreeDotClick = () => {
    setShowActions(!showActions);
  };

  return (
    <Card className="card-box">
      <Link to={`${id}/`} className="salesInvoicesPages">
        <Card.Body>
          <Card.Text className="text"><span>Customer Name: </span>{name}</Card.Text>
          <Card.Text className="text"><span>Ship To Customer ID: </span>{shipToCustomerId}</Card.Text>
          <Card.Text className="text"><span>Invoice No: </span>{invoiceNo}</Card.Text>
          <Card.Text className="text"><span>Invoice Date: </span>{invoiceDate ? format(parseISO(invoiceDate), "dd-MM-yyyy") : ""}</Card.Text>
          <Card.Text className="text"><span>State ID: </span>{stateId}</Card.Text>
          <Card.Text className="text"><span>State Code: </span>{stateCode}</Card.Text>
          <Card.Text className="text"><span>Transportation Mode: </span>{transportationMode}</Card.Text>
          <Card.Text className="text"><span>Vehicle No: </span>{vehicleNo}</Card.Text>
          <Card.Text className="text"><span>Date Of Supply: </span>{dateOfSupply ? format(parseISO(dateOfSupply), "dd-MM-yyyy") : ""}</Card.Text>
          <Card.Text className="text"><span>Place Of Supply: </span>{placeOfSupply}</Card.Text>
          <Card.Text className="text"><span>Purchase Order Number: </span>{poNumber}</Card.Text>
        </Card.Body>
      </Link>
      <Button onClick={handleThreeDotClick} variant="link" className="three-dot-icon">
        <BsThreeDotsVertical />
      </Button>
      {showActions && (
        <div className="drop-btn">
          {hasPermission(CAN_USER_UPDATE_SALESINVOICE) ? (
            <SalesInvoicesFormAction type="edit" queryClient={queryClient} selectedCompanyId={selectedCompanyId} salesInvoicesRow={salesInvoices} purchaseOrderList={purchaseOrderList} />
          ) : null}
          {hasPermission(CAN_USER_DELETE_SALESINVOICE) ? (
            <SalesInvoicesFormDelete type="delete" queryClient={queryClient} salesInvoicesRow={salesInvoices} />
          ) : null}
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

export default SalesInvoicesCard;

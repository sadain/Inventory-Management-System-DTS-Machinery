import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { MdOutlinePictureAsPdf } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { format, parseISO } from 'date-fns';
import PurchaseOrdersFormAction from './Forms/PurchaseOrdersFormAction';
import PurchaseOrdersFormDelete from './Forms/PurchaseOrdersFormDelete';
import { Link } from "react-router-dom";
import usePermission from "contexts/usePermission";
import { PERMISSIONS } from "utils/Permissions";

const PurchaseOrdersCard = (props) => {
  const { purchaseOrder, queryClient, selectedCompanyId, supplierList } = props;

  const { id, supplier, invoiceNo, invoiceDate } = purchaseOrder;

  const { name } = supplier;

  const { hasPermission } = usePermission();

  const {
    CAN_USER_UPDATE_PURCHASEORDER,
    CAN_USER_DELETE_PURCHASEORDER
  } = PERMISSIONS;

  const [showActions, setShowActions] = useState(false);

  const handleThreeDotClick = () => {
    setShowActions(!showActions);
  };

  return (
    <Card className="card-box dc-card">
      <Link to={`${id}/`} className="PurchaseOrderPages">
        <Card.Body>
          <Card.Text className="text"><span>Supplier Name: </span>{name}</Card.Text>
          <Card.Text className="text"><span>Invoice No: </span>{invoiceNo}</Card.Text>
          <Card.Text className="text"><span>Invoice Date: </span>{invoiceDate ? format(parseISO(invoiceDate), "dd-MM-yyyy") : ""}</Card.Text>
        </Card.Body>
      </Link>
      <Button onClick={handleThreeDotClick} variant="link" className="three-dot-icon">
        <BsThreeDotsVertical />
      </Button>
      {showActions && (
        <div className="drop-btn">
          {hasPermission(CAN_USER_UPDATE_PURCHASEORDER) ? (
            <PurchaseOrdersFormAction type="edit" queryClient={queryClient} selectedCompanyId={selectedCompanyId} purchaseOrderRow={purchaseOrder} supplierList={supplierList} />
          ) : null}
          {hasPermission(CAN_USER_DELETE_PURCHASEORDER) ? (
            <PurchaseOrdersFormDelete type="delete" queryClient={queryClient} purchaseOrderRow={purchaseOrder} />
          ) : null}
          <Link to={`pdf/${id}/`} className="PurchaseOrderPages">
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

export default PurchaseOrdersCard;

import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { MdOutlinePictureAsPdf } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { format, parseISO } from 'date-fns';
import QuotationsFormDelete from "components/Forms/QuotationsFromDelete";
import QuotationsFormAction from "components/Forms/QuotationsFormAction";
import ConfirmInvoiceFormAction from "components/Forms/ConfirmInvoiceFormAction";
import { useQuotationsView } from "api/useApi";
import { Link } from "react-router-dom";
import usePermission from "contexts/usePermission";
import { PERMISSIONS } from "utils/Permissions";

const QuotationCard = (props) => {
  const { quotation, queryClient, selectedCompanyId, customerList, proformaInvoiceList } = props;

  const { id, customer, quotationNo, quotationDate, currency } = quotation;

  const { name } = customer;

  const { data: quotationViewList } = useQuotationsView(id);

  const proformaInvoiceItem = proformaInvoiceList?.items.find(invoice => invoice.quotationId === id);

  const [showActions, setShowActions] = useState(false);

  const { hasPermission } = usePermission();

  const {
    CAN_USER_UPDATE_QUOTATION,
    CAN_USER_DELETE_QUOTATION,
  } = PERMISSIONS;

  const handleThreeDotClick = () => {
    setShowActions(!showActions);
  };

  return (
    <Card className="card-box" style={{ display: "flex", justifyContent: "space-between" }}>
      <Link to={`${id}/`} className="quotationPages" >
        <Card.Body>
          <Card.Text className="text"><span>Customer Name: </span>{name}</Card.Text>
          <Card.Text className="text"><span>Quotation No: </span>{quotationNo}</Card.Text>
          <Card.Text className="text"><span>Quotation Date: </span>{quotationDate ? format(parseISO(quotationDate), "dd-MM-yyyy") : ""}</Card.Text>
          <Card.Text className="text"><span>Currency: </span>{currency}</Card.Text>
        </Card.Body>
      </Link>
      <Button onClick={handleThreeDotClick} variant="link" className="three-dot-icon">
        <BsThreeDotsVertical />
      </Button>
      {showActions && (
        <div className="drop-btn">
          {hasPermission(CAN_USER_UPDATE_QUOTATION) ? (
            <QuotationsFormAction type="edit" queryClient={queryClient} selectedCompanyId={selectedCompanyId} quotationRow={quotation} customerList={customerList} />
          ) : null}
          {hasPermission(CAN_USER_DELETE_QUOTATION) ? (
            <>
              {proformaInvoiceList?.items.length && proformaInvoiceItem?.quotationId === id ? (<></>) : (
                <QuotationsFormDelete type="delete" queryClient={queryClient} quotationRow={quotation} />
              )}
            </>
          ) : null}
          <Link to={`pdf/${id}/`} className="quotationPages">
            <Button variant="link" className="pdf-btn" style={{ display: "flex", alignItems: "center" }}>
              <MdOutlinePictureAsPdf className="text-l mr-1" />
              <span>Export</span>
            </Button>
          </Link>
        </div>
      )}
      {proformaInvoiceList?.items.length && proformaInvoiceItem?.quotationId === id ? (
        <h6 className="confirmed-Message">PI Confirmed</h6>
      ) : (
        quotationViewList && (
          <ConfirmInvoiceFormAction
            queryClient={queryClient}
            quotationRow={quotation}
            quotationViewList={quotationViewList}
          />
        )
      )}
    </Card>
  );
};

export default QuotationCard;

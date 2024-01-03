import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { BsThreeDotsVertical } from 'react-icons/bs';
import CompanyBankDetailFormDelete from "../components/Forms/CompanyBankDetailFormDelete";
import CompanyBankDetailFormAction from "../components/Forms/CompanyBankDetailFormAction";
import usePermission from "contexts/usePermission";
import { PERMISSIONS } from "utils/Permissions";

const CompanyBankDetailCard = (props) => {
  const { companyBankDetail, queryClient } = props;
  const { company, accountName, bankName, bankBranch, accountNumber, ifscCode, swiftCode } = companyBankDetail;

  const { hasPermission } = usePermission();

  const {
    CAN_USER_UPDATE_COMPANY_BANK_DETAILS,
    CAN_USER_DELETE_COMPANY_BANK_DETAILS,
  } = PERMISSIONS;

  const [showActions, setShowActions] = useState(false);

  const handleThreeDotClick = () => {
    setShowActions(!showActions);
  };

  return (
    <Card className="card-box">
      <Card.Body>
        <Card.Text className="text"><span>Company Name: </span>{company.name}</Card.Text>
        <Card.Text className="text"><span>Account Name: </span>{accountName}</Card.Text>
        <Card.Text className="text"><span>Bank Name: </span>{bankName}</Card.Text>
        <Card.Text className="text"><span>Bank Branch: </span>{bankBranch}</Card.Text>
        <Card.Text className="text"><span>Account Number: </span>{accountNumber}</Card.Text>
        <Card.Text className="text"><span>IFSC Code: </span>{ifscCode}</Card.Text>
        <Card.Text className="text"><span>Swift Code: </span>{swiftCode}</Card.Text>
      </Card.Body>
      <Button onClick={handleThreeDotClick} variant="link" className="three-dot-icon">
        <BsThreeDotsVertical />
      </Button>
      {showActions && (
        <div className="drop-btn">
          {hasPermission(CAN_USER_UPDATE_COMPANY_BANK_DETAILS) ? (
            <CompanyBankDetailFormAction type="edit" queryClient={queryClient} companyBankDetailRow={companyBankDetail} />
          ) : null}
          {hasPermission(CAN_USER_DELETE_COMPANY_BANK_DETAILS) ? (
            <CompanyBankDetailFormDelete type="delete" queryClient={queryClient} companyBankDetailRow={companyBankDetail} />
          ) : null}
        </div>
      )}
    </Card>
  );
};

export default CompanyBankDetailCard;

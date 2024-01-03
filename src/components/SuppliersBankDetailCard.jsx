import React, {useState} from "react";
import { Card, Button } from "react-bootstrap";
import { BsThreeDotsVertical } from 'react-icons/bs';
import SuppliersBankDetailFormDelete from "../components/Forms/SuppliersBankDetailFormDelete";
import SuppliersBankDetailFormAction from "../components/Forms/SuppliersBankDetailFormAction";

const SuppliersBankDetailCard = (props) => {
  const { suppliersBankDetail, queryClient } = props;
  const { supplier, accountName, bankName, bankBranch, accountNumber, ifscCode, swiftCode } = suppliersBankDetail;

  const [showActions, setShowActions] = useState(false);

  const handleThreeDotClick = () => {
    setShowActions(!showActions);
  };

  return (
    <Card className="card-box">
      <Card.Body>
        <Card.Text className="text"><span>Suppliers Name: </span>{supplier.name}</Card.Text>
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
          <SuppliersBankDetailFormAction type="edit" queryClient={queryClient} suppliersBankDetailRow={suppliersBankDetail} />
          <SuppliersBankDetailFormDelete type="delete" queryClient={queryClient} suppliersBankDetailRow={suppliersBankDetail} />
        </div>
      )}
    </Card>
  );
};

export default SuppliersBankDetailCard;

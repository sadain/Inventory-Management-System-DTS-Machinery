import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { MdOutlinePictureAsPdf } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { format, parseISO } from 'date-fns';
import DispatchChallansFormAction from './Forms/DispatchChallansFormAction';
import DispatchChallansFormDelete from './Forms/DispatchChallansFormDelete';
import { Link } from "react-router-dom";

const DispatchChallansCard = (props) => {
  const { Dispatch, queryClient, selectedCompanyId, customersList, companiesList } = props;

  const { id, customer, dispatchNo, dispatchDate, dispatchType } = Dispatch;

  const { name } = customer;

  const [showActions, setShowActions] = useState(false);

  const handleThreeDotClick = () => {
    setShowActions(!showActions);
  };

  return (
    <Card className="card-box">
      <Link to={`${id}/`} className="DispatchChallanPages">
        <Card.Body>
          <Card.Text className="text"><span>Customer Name: </span>{name}</Card.Text>
          <Card.Text className="text"><span>Dispatch No: </span>{dispatchNo}</Card.Text>
          <Card.Text className="text"><span>Dispatch Date: </span>{dispatchDate ? format(parseISO(dispatchDate), "dd-MM-yyyy") : ""}</Card.Text>
          <Card.Text className="text"><span>Dispatch Type: </span>{dispatchType}</Card.Text>
        </Card.Body>
      </Link>
      <Button onClick={handleThreeDotClick} variant="link" className="three-dot-icon">
        <BsThreeDotsVertical />
      </Button>
      {showActions && (
        <div className="drop-btn">
          <DispatchChallansFormAction type="edit" queryClient={queryClient} selectedCompanyId={selectedCompanyId} DispatchChallanRow={Dispatch} customersList={customersList} companiesList={companiesList} />
          <DispatchChallansFormDelete type="delete" queryClient={queryClient} DispatchChallanRow={Dispatch} />
          <Link to={`pdf/${id}/`} className="DispatchChallanPages">
            <Button variant="link" className="pdf-btn" style={{ display: "flex", alignItems: "center" }}>
              <MdOutlinePictureAsPdf className="text-l mr-1" />
              <span>Export</span>
            </Button>
          </Link>
        </div>
      )}
    </Card>
  )
}

export default DispatchChallansCard;

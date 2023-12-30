import React from "react";
import { Form, Button } from "react-bootstrap";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";

const { Group, Select } = Form;

const Pagination = (props) => {
    const { type, pageNumber, pageSize, setPageNumber, setPageSize, totalSize } = props || {};
  return (
    <div className="pagination">
      {type === "inBox" ? (
        <>
          {/* <Group className="checkbox-child" style={{marginLeft: "0px", paddingRight: "5px"}}>
            <Form.Check
              type="checkbox"
              id="noPage"
              checked={noPage}
              label="No Pagination"
              onChange={(e) => setNoPage(e.target.checked)}
            />
          </Group> */}
          <Group className="pageSize" style={{ paddingRight: "5px"}}>
            <Select  id="pageSize"
            onChange={(e) => setPageSize(e.target.value)}
            value={pageSize}
              >
              {/* <option value="">{pageSize}</option> */}
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
          </Group>
        </>
      ) : ""}
        <Button
          className="pagination-btn"
          onClick={() => setPageNumber((prevState) => prevState - 1)}
          disabled={pageNumber === 1}
        >
          <TfiAngleLeft />
        </Button>
        <span className="pagination-number">{pageNumber}</span>
        <Button
          className="pagination-btn"
          onClick={() => setPageNumber((prevState) => prevState + 1)}
          disabled={pageNumber === Math.ceil(totalSize / pageSize)}
        >
          <TfiAngleRight />
        </Button>
      </div>
  );
};

export default Pagination;

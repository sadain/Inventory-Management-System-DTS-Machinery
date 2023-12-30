import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { Form, Button } from "react-bootstrap";
import { RiFilterLine, RiFilterOffLine } from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "components/Loader";
import DispatchChallansFormAction from "components/Forms/DispatchChallansFormAction";
import { useCustomer, useDispatchChallans, useCompanies } from "api/useApi";
import DispatchChallansCard from "components/DispatchChallansCard";
import Pagination from "components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";

const { Group, Label, Select } = Form;

const DispatchChallan = (props) => {
  const { queryClient, selectedCompanyId } = props;
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [customer, setCustomer] = useState("");
  const [dispatchNo, setDispatchNo] = useState("");
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [dispatchType, setDispatchType] = useState("");
  const [productName, setProductName] = useState("");
  const [productModel, setProductModel] = useState("");
  // const [companyId, setCompanyId] = useState(1);
  const [noPage, setNoPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dbCustomer = useDebounce(customer, 600);
  const dbDispatchNo = useDebounce(dispatchNo, 600);
  const dbDateStart = useDebounce(dateStart, 600);
  const dbDateEnd = useDebounce(dateEnd, 600);
  const dbDispatchType = useDebounce(dispatchType, 600);
  const dbProductName = useDebounce(productName, 600);
  const dbProductModel = useDebounce(productModel, 600);
  const dbNoPage = useDebounce(noPage, 600);
  const dbPageNumber = useDebounce(pageNumber, 600);
  const dbPageSize = useDebounce(pageSize, 600);

  const { data: companiesList } = useCompanies();
  const { data: customersList } = useCustomer("", "", "", "", selectedCompanyId, "true");
  const { data: DispatchChallanList, isLoading: spinLoading } = useDispatchChallans(dbCustomer, dbDispatchNo, dbDateStart, dbDateEnd, dbDispatchType, dbProductName, dbProductModel, selectedCompanyId, dbNoPage, dbPageNumber, dbPageSize);

  const { totalSize } = DispatchChallanList || {};

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Transaction" title="Dispatch Challan" />
      <div className="card-header ch-flex">
        <DispatchChallansFormAction
          type="add"
          queryClient={queryClient}
          selectedCompanyId={selectedCompanyId}
          customersList={customersList?.items}
          companiesList={companiesList}
        />
        <div className="card-filter-page">
          <Button
            className="filter-btn form-btn mb-3"
            variant="link"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? (
              <RiFilterOffLine className="text-lg mr-1.5" />
            ) : (
              <RiFilterLine className="text-lg mr-1.5" />
            )}
            <span>{showFilters ? "Hide Filter" : "Show Filter"}</span>
          </Button>
          <Pagination type="inBox" pageNumber={pageNumber} pageSize={pageSize} noPage={noPage} setPageNumber={setPageNumber} setPageSize={setPageSize} setNoPage={setNoPage} totalSize={totalSize} />
        </div>
      </div>
      {showFilters && (
        <div className="container mb-5">
          <div className="row" style={{ alignItems: "center" }}>
            <Group className="col-sm-6 col-md-2 form-floating">
              <input
                type="text"
                id="customer"
                className="form-control"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="customer">Customer:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating">
              <input
                type="text"
                id="dispatchNo"
                className="form-control"
                value={dispatchNo}
                onChange={(e) => setDispatchNo(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="dispatchNo">Dispatch No:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating">
              <input
                type="text"
                id="productName"
                className="form-control"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="productName">Product Name:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating">
              <input
                type="text"
                id="productModel"
                className="form-control"
                value={productModel}
                onChange={(e) => setProductModel(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="productModel">Product Model:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating datePiker">
              <DatePicker
                id="startDate"
                selected={dateStart}
                onChange={(date) => setDateStart(date)}
                className="form-control"
                dateFormat="dd-MM-yyyy"
              />
              <span className="highlight"></span>
              <Label htmlFor="startDate">Start Date:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating datePiker">
              <DatePicker
                id="endDate"
                selected={dateEnd}
                onChange={(date) => setDateEnd(date)}
                className="form-control"
                dateFormat="dd-MM-yyyy"
              />
              <span className="highlight"></span>
              <Label htmlFor="endDate">End Date:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating">
              <Select
                id="dispatchType"
                onChange={(e) => setDispatchType(e.target.value)}
                value={dispatchType}
              >
                <option value="">All Type</option>
                <option value={1}>Regular</option>
                <option value={2}>Demo Purpose</option>
                <option value={3}>Stock Transfer</option>
              </Select>
              <Label className="filter-label" htmlFor="dispatchType">
                Dispatch Type:
              </Label>
            </Group>
          </div>
        </div>
      )}
      {isLoading ? (<Loader />) : (
        <>
          {DispatchChallanList?.items.length === 0 ? (
            <div style={{ marginLeft: "12px" }}>No Data Found</div>
          ) : (
            <div className="card-container">
              {DispatchChallanList?.items &&
                DispatchChallanList?.items.length &&
                DispatchChallanList?.items.map((Dispatch, index) => (
                  <DispatchChallansCard key={index} queryClient={queryClient} selectedCompanyId={selectedCompanyId} Dispatch={Dispatch} customersList={customersList?.items} companiesList={companiesList} />
                ))}
            </div>
          )}
        </>
      )}
      <Pagination pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} totalSize={totalSize} />
    </div>
  );
};

export default DispatchChallan;

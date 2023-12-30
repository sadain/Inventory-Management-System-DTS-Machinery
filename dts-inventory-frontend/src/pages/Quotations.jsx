import React, { useState, useEffect } from "react";

import { Header } from "../components";
import { Form, Button } from "react-bootstrap";
import { RiFilterLine, RiFilterOffLine } from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import QuotationsFormAction from "components/Forms/QuotationsFormAction";
import Loader from "components/Loader";
import { useCustomer, useProformaInvoice, useQuotations } from "api/useApi";
import QuotationCard from "components/QuotationCard";
import Pagination from "components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";
import usePermission from "contexts/usePermission";
import { PERMISSIONS } from "utils/Permissions";

const { Group, Label } = Form;

const Quotations = (props) => {
  const { queryClient, selectedCompanyId } = props;
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [customer, setCustomer] = useState("");
  const [quotationNo, setQuotationNo] = useState("");
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [productName, setProductName] = useState("");
  const [productModel, setProductModel] = useState("");
  // const [companyId, setCompanyId] = useState(1);
  const [noPage, setNoPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dbCustomer = useDebounce(customer, 600);
  const dbQuotationNo = useDebounce(quotationNo, 600);
  const dbDateStart = useDebounce(dateStart, 600);
  const dbDateEnd = useDebounce(dateEnd, 600);
  const dbProductName = useDebounce(productName, 600);
  const dbProductModel = useDebounce(productModel, 600);
  const dbNoPage = useDebounce(noPage, 600);
  const dbPageNumber = useDebounce(pageNumber, 600);
  const dbPageSize = useDebounce(pageSize, 600);

  const { data: customerList } = useCustomer("", "", "", "", selectedCompanyId, "true");
  const { data: proformaInvoiceList } = useProformaInvoice("", "", "", "", "", "", "", selectedCompanyId, "true");
  const { data: quotationList, isLoading: spinLoading } = useQuotations(dbCustomer, dbQuotationNo, dbDateStart, dbDateEnd, dbProductName, dbProductModel, selectedCompanyId, dbNoPage, dbPageNumber, dbPageSize);

  const { totalSize } = quotationList || {};

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const { hasPermission } = usePermission();

  const {
    CAN_USER_CREATE_QUOTATION,
  } = PERMISSIONS;

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Transaction" title="Quotations" />
      <div className="card-header ch-flex">
        {hasPermission(CAN_USER_CREATE_QUOTATION) ? (
          <QuotationsFormAction
            type="add"
            queryClient={queryClient}
            selectedCompanyId={selectedCompanyId}
            customerList={customerList?.items}
          />
        ) : null}
        <div className="card-filter-page">
          <Button className="filter-btn form-btn mb-3"
            variant="link"
            onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? (<RiFilterOffLine className="text-lg mr-1.5" />) : (<RiFilterLine className="text-lg mr-1.5" />)}
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
                id="quotationNo"
                className="form-control"
                value={quotationNo}
                onChange={(e) => setQuotationNo(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="quotationNo">Quotation No:</Label>
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
          </div>
        </div>
      )}
      {isLoading ? (<Loader />) : (
        <>
          {quotationList?.items.length === 0 ? (
            <div style={{ marginLeft: "12px" }}>No Data Found</div>
          ) : (
            <div className="card-container">
              {quotationList?.items && proformaInvoiceList?.items &&
                quotationList?.items.length &&
                quotationList?.items.map((quotation, index) => (
                  <QuotationCard key={index} quotation={quotation} customerList={customerList?.items} proformaInvoiceList={proformaInvoiceList} queryClient={queryClient} selectedCompanyId={selectedCompanyId} />
                ))}
            </div>
          )}
        </>
      )}
      <Pagination pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} totalSize={totalSize} />
    </div>
  );
};

export default Quotations;

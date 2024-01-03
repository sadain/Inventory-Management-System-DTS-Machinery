import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { Form, Button } from "react-bootstrap";
import { RiFilterLine, RiFilterOffLine } from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PurchaseOrdersFormAction from 'components/Forms/PurchaseOrdersFormAction';
import { useSupplier, usePurchaseOrders } from "api/useApi";
import Loader from "components/Loader";
import PurchaseOrdersCard from 'components/PurchaseOrdersCard';
import Pagination from "components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";
import usePermission from "contexts/usePermission";
import { PERMISSIONS } from "utils/Permissions";

const { Group, Label } = Form;

const PurchaseOrders = (props) => {
  const { queryClient, selectedCompanyId } = props;
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [supplier, setSupplier] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [productName, setProductName] = useState("");
  const [productModel, setProductModel] = useState("");
  // const [companyId, setCompanyId] = useState("");
  const [noPage, setNoPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dbSupplier = useDebounce(supplier, 600);
  const dbInvoiceNo = useDebounce(invoiceNo, 600);
  const dbDateStart = useDebounce(dateStart, 600);
  const dbDateEnd = useDebounce(dateEnd, 600);
  const dbProductName = useDebounce(productName, 600);
  const dbProductModel = useDebounce(productModel, 600);
  const dbNoPage = useDebounce(noPage, 600);
  const dbPageNumber = useDebounce(pageNumber, 600);
  const dbPageSize = useDebounce(pageSize, 600);

  const { data: supplierList } = useSupplier("", "", "", "", selectedCompanyId, "true");

  const { data: purchaseOrderList, isLoading: spinLoading } = usePurchaseOrders(dbSupplier, dbInvoiceNo, dbDateStart, dbDateEnd, dbProductName, dbProductModel, selectedCompanyId, dbNoPage, dbPageNumber, dbPageSize);

  const { totalSize } = purchaseOrderList || {};

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const { hasPermission } = usePermission();

  const {
    CAN_USER_CREATE_PURCHASEORDER,
  } = PERMISSIONS;

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Transaction" title="Import Orders" />
      <div className="card-header ch-flex">
        {hasPermission(CAN_USER_CREATE_PURCHASEORDER) ? (
          <PurchaseOrdersFormAction
            type="add"
            queryClient={queryClient}
            selectedCompanyId={selectedCompanyId}
            supplierList={supplierList?.items}
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
                id="supplier"
                className="form-control"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="supplier">Supplier:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating">
              <input
                type="text"
                id="invoiceNo"
                className="form-control"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="invoiceNo">Invoice No:</Label>
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
        { purchaseOrderList?.items.length === 0 ? (
          <div style={{ marginLeft: "12px" }}>No Data Found</div>
        ) : (
          <div className="card-container">
            {purchaseOrderList?.items &&
              purchaseOrderList?.items.length &&
              purchaseOrderList?.items.map((purchaseOrder, index) => (
                <PurchaseOrdersCard key={index} queryClient={queryClient} selectedCompanyId={selectedCompanyId} purchaseOrder={purchaseOrder} supplierList={supplierList?.items} />
              ))}
          </div>
        )}
      </>
      )}
      <Pagination pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} totalSize={totalSize} />
    </div>
  );
};

export default PurchaseOrders;

import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { Button, Form, Tabs, Tab } from "react-bootstrap";
import { RiFilterLine, RiFilterOffLine } from "react-icons/ri";
import PaymentPurchase from "../components/PaymentPurchase";
import PaymentSales from "../components/PaymentSales";
import Loader from "components/Loader";
import { useDebounce } from "@uidotdev/usehooks";
import { usePurchaseOrders, usePaymentPurchace, useSalesInvoice, usePaymentSales } from "api/useApi";

const { Group, Label, Select } = Form;

const Payment = (props) => {
  const { queryClient, selectedCompanyId } = props;
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const [salesInvoiceId, setSalesInvoiceId] = useState("");

  const dbPurchaseOrderId = useDebounce(purchaseOrderId, 600);
  const dbSalesInvoiceId = useDebounce(salesInvoiceId, 600);

  const { data: purchaseOrderList } = usePurchaseOrders("", "", "", "", "", "", selectedCompanyId, "true");
  const { data: paymentPurchaceList, isLoading: spinLoading } = usePaymentPurchace(dbPurchaseOrderId);

  const { data: salesInvoiceList } = useSalesInvoice("", "", "", "", "", "", selectedCompanyId, "true");
  const { data: paymentSalesList, isLoading: spinLoading1 } = usePaymentSales(dbSalesInvoiceId);

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  useEffect(() => {
    setIsLoading(spinLoading1);
  }, [spinLoading1]);

  // if (isLoading) {
  //   return <Loader />;
  // }

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Transaction" />
      <Tabs
        defaultActiveKey="purchase"
        id="justify-tab-example"
        className="mb-3"
        justify
      >
        <Tab className="tab" eventKey="purchase" title="Purchase Payment">
          <div className="mb-5">
            <div className="card-header">
              <h5 className="text-3xl font-bold text-slate-900 header">
                Purchase Payment
              </h5>
              <Button className="form-btn"
                variant="link"
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? (<RiFilterOffLine className="text-lg mr-1.5" />) : (<RiFilterLine className="text-lg mr-1.5" />)}
                <span>{showFilters ? "Hide Filter" : "Show Filter"}</span>
              </Button>
            </div>
          </div>
          {showFilters && (
            <div className="container mb-5">
              <div className="row" style={{ alignItems: "center" }}>
                <Group className="col-sm-6 col-md-4 form-floating">
                  <Select id="purchaseOrderId"
                    onChange={(e) => setPurchaseOrderId(e.target.value)}
                    value={purchaseOrderId}
                  >
                    <option value="">Select PO Invoice No</option>
                    {purchaseOrderList?.items &&
                      purchaseOrderList?.items.map((purchaseOrder) => (
                        <option key={purchaseOrder.id} value={purchaseOrder.id}>
                          {purchaseOrder.invoiceNo}
                        </option>
                      ))}
                  </Select>
                  <Label className="filter-label" htmlFor="purchaseOrderId">Filter By PO Invoice No:</Label>
                </Group>
              </div>
            </div>
          )}
          <PaymentPurchase queryClient={queryClient} isLoading={isLoading} purchaseOrderList={purchaseOrderList} paymentPurchaceList={paymentPurchaceList} />
        </Tab>
        <Tab className="tab" eventKey="sales" title="Sales">
          <div className="mb-5">
            <div className="card-header">
              <h5 className="text-3xl font-bold text-slate-900 header">
                Sales Payments
              </h5>
              <Button className="form-btn"
                variant="link"
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? (<RiFilterOffLine className="text-lg mr-1.5" />) : (<RiFilterLine className="text-lg mr-1.5" />)}
                <span>{showFilters ? "Hide Filter" : "Show Filter"}</span>
              </Button>
            </div>
          </div>
          {showFilters && (
            <div className="container mb-5">
              <div className="row" style={{ alignItems: "center" }}>
                <Group className="col-sm-6 col-md-4 form-floating">
                  <Select id="SalesInvoiceId"
                    onChange={(e) => setSalesInvoiceId(e.target.value)}
                    value={salesInvoiceId}
                  >
                    <option value="">Select Sales Invoice No</option>
                    {salesInvoiceList?.items &&
                      salesInvoiceList?.items.map((salesInvoice) => (
                        <option key={salesInvoice.id} value={salesInvoice.id}>
                          {salesInvoice.invoiceNo}
                        </option>
                      ))}
                  </Select>
                  <Label className="filter-label" htmlFor="SalesInvoiceId">Filter By Sales Invoice No:</Label>
                </Group>
              </div>
            </div>
          )}
          <PaymentSales queryClient={queryClient} isLoading={isLoading} salesInvoiceList={salesInvoiceList} paymentSalesList={paymentSalesList} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Payment;

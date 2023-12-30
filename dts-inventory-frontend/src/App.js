import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages";
import { ToastContainer } from "react-toastify";
import MainRouter from "pages/MainRouter";
import { ProtectedRoute } from "contexts/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthProvider";
import {
  Dashboard,
  DispatchChallan,
  DispatchChallanReportGenerate,
  DispatchChallanView,
  Companies,
  CompanyBankDetail,
  Currency,
  Customers,
  ExchangeRate,
  Expense,
  ExpenseSummaryReport,
  ExpenseType,
  HsnConfiguration,
  OutwardRemittanceReport,
  Payment,
  PaymentOutstandingReport,
  PoReport,
  PoReportView,
  ProductCategory,
  Products,
  ProformaInvoice,
  ProformaReportGenerate,
  ProformaInvoiceView,
  PurchaseOrders,
  PurchaseOrdersReportGenerate,
  PurchaseOrdersView,
  QuotationReportGenerate,
  Quotations,
  QuotationsView,
  Roles,
  SalesInvoiceReport,
  SalesInvoices,
  SalesInvoiceReportView,
  SalesInvoicesReportGenerate,
  SalesInvoicesView,
  StockReport,
  StockTransfer,
  Suppliers,
  SuppliersBankDetail,
  Users,
} from "pages";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import "./styles/style.scss";
import "react-toastify/dist/ReactToastify.css";

const App = (props) => {
  const { queryClient } = props;

  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/*<Route path="/" element={<Navigate to="/dashboard" replace />} />*/}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainRouter queryClient={queryClient} selectedCompanyId={selectedCompanyId} setSelectedCompanyId={setSelectedCompanyId} />}>
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
              <Route path="dashboard" index element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />

              {/* Master Pages */}
              <Route path="roles" element={<ProtectedRoute> <Roles queryClient={queryClient} /> </ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute> <Users queryClient={queryClient} /> </ProtectedRoute>} />
              <Route path="companies" element={<ProtectedRoute> <Companies queryClient={queryClient} /> </ProtectedRoute>} />
              <Route path="companies/:id" element={<ProtectedRoute> <CompanyBankDetail queryClient={queryClient} /> </ProtectedRoute>} />
              <Route path="products" element={<ProtectedRoute> <Products queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="product-category" element={<ProtectedRoute> <ProductCategory queryClient={queryClient} /> </ProtectedRoute>} />
              <Route path="hsn-configuration" element={<ProtectedRoute> <HsnConfiguration queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="suppliers" element={<ProtectedRoute> <Suppliers queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="suppliers/:id" element={<ProtectedRoute> <SuppliersBankDetail queryClient={queryClient} /> </ProtectedRoute>} />
              <Route path="customers" element={<ProtectedRoute> <Customers queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="currency" element={<ProtectedRoute> <Currency queryClient={queryClient} /> </ProtectedRoute>} />
              <Route path="exchange-rate" element={<ProtectedRoute> <ExchangeRate queryClient={queryClient} /> </ProtectedRoute>} />
              <Route path="expense-type" element={<ProtectedRoute> <ExpenseType queryClient={queryClient} /> </ProtectedRoute>} />

              {/* Transactions Pages */}
              <Route path="import-orders" element={<ProtectedRoute> <PurchaseOrders queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="import-orders/:id" element={<ProtectedRoute> <PurchaseOrdersView queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="import-orders/pdf/:id" element={<ProtectedRoute> <PurchaseOrdersReportGenerate queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="stock-transfer/" element={<ProtectedRoute> <StockTransfer queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="quotations" element={<ProtectedRoute> <Quotations queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="quotations/:id" element={<ProtectedRoute> <QuotationsView queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="quotations/pdf/:id" element={<ProtectedRoute> <QuotationReportGenerate queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="proforma-invoice" element={<ProtectedRoute> <ProformaInvoice queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="proforma-invoice/:id" element={<ProtectedRoute> <ProformaInvoiceView queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="proforma-invoice/pdf/:id" element={<ProtectedRoute> <ProformaReportGenerate queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="sales-invoices" element={<ProtectedRoute> <SalesInvoices queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="sales-invoices/:id" element={<ProtectedRoute> <SalesInvoicesView queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="sales-invoices/pdf/:id" element={<ProtectedRoute> <SalesInvoicesReportGenerate queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="dispatch-challan" element={<ProtectedRoute> <DispatchChallan queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="dispatch-challan/:id" element={<ProtectedRoute> <DispatchChallanView queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="dispatch-challan/pdf/:id" element={<ProtectedRoute> <DispatchChallanReportGenerate queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="payment/" element={<ProtectedRoute> <Payment queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="expense/" element={<ProtectedRoute> <Expense queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              {/* Reports Pages */}
              <Route path="stock-report/" element={<ProtectedRoute> <StockReport queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="io-report/" element={<ProtectedRoute> <PoReport queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="io-report/:id" element={<ProtectedRoute> <PoReportView queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="sales-invoice-report/" element={<ProtectedRoute> <SalesInvoiceReport queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="sales-invoice-report/:id" element={<ProtectedRoute> <SalesInvoiceReportView queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="payment-outstanding-report/" element={<ProtectedRoute> <PaymentOutstandingReport queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="expense-summary-report/" element={<ProtectedRoute> <ExpenseSummaryReport queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              <Route path="outward-remittance-report/" element={<ProtectedRoute> <OutwardRemittanceReport queryClient={queryClient} selectedCompanyId={selectedCompanyId} /> </ProtectedRoute>} />
              {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </div>
  );
};

export default App;

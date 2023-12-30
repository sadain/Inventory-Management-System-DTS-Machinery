import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { Form, Button } from "react-bootstrap";
import { RiFilterLine, RiFilterOffLine } from "react-icons/ri";
import { RxCodesandboxLogo } from "react-icons/rx";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiChevronDown } from "react-icons/fi";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import Loader from "components/Loader";
import Table from "components/Table";
import { Link } from "react-router-dom";
import { useSalesInvoiceReport, useSalesInvoiceReportExport, useProducts, useCustomer } from "api/useApi";
import Pagination from "components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";
import { SiMicrosoftexcel } from "react-icons/si";
import { saveAs } from 'file-saver';
import { Oval } from 'react-loader-spinner';

const { Group, Label, Select } = Form;

const SalesInvoiceReport = (props) => {
  const { selectedCompanyId } = props;
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [spinLoadingExport, setSpinLoadingExport] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  // const [companyId, setcompanyId] = useState("");
  const [noPage, setNoPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dbStartDate = useDebounce(startDate, 600);
  const dbEndDate = useDebounce(endDate, 600);
  const dbCustomerId = useDebounce(customerId, 600);
  const dbProductId = useDebounce(productId, 600);
  const dbNoPage = useDebounce(noPage, 600);
  const dbPageNumber = useDebounce(pageNumber, 600);
  const dbPageSize = useDebounce(pageSize, 600);

  const { data: customerList } = useCustomer("", "", "", "", selectedCompanyId, "true");
  const { data: productsList } = useProducts("", "", "", selectedCompanyId, "true");
  const { data: salesInvoiceReportsList, isLoading: spinLoading } = useSalesInvoiceReport(dbStartDate, dbEndDate, dbCustomerId, dbProductId, selectedCompanyId, dbNoPage, dbPageNumber, dbPageSize);

  const { totalSize } = salesInvoiceReportsList || {};

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const formatCurrency = (value) => {
    if (value === null) {
      return "";
    }
    const formattedValue = value.toLocaleString("en-IN", {
      style: "decimal",
      maximumFractionDigits: 2,
    });
    return formattedValue.endsWith(".00") ? formattedValue.slice(0, -3) : formattedValue;
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("customer", {
      header: "Customer",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("invoiceNo", {
      header: "Invoice No",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("invoiceDate", {
      header: "Invoice Date",
      cell: (info) => format(parseISO(info.getValue()), "dd-MM-yyyy"),
    }),
    columnHelper.accessor("dateOfSupply", {
      header: "Date Of Supply",
      cell: (info) => format(parseISO(info.getValue()), "dd-MM-yyyy"),
    }),
    columnHelper.accessor("placeOfSupply", {
      header: "Place Of Supply",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("poNumber", {
      header: "Po Number",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("totalQuantity", {
      header: "Total Quantity",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("totalValue", {
      header: "Total Value",
      cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "0",
    }),
    columnHelper.accessor("id", {
      header: () => "Action",
      width: 200,
      cell: (info) => (
        <div className="actionEditDelete">
          <Link to={`${info.row.original.id}/`}>
            <Button
              variant="link"
              className="form-btn"
              style={{ display: "flex", alignItems: "center" }}
            >
              <RxCodesandboxLogo className="text-lg mr-1.5" />
              <span>View product</span>
            </Button>
          </Link>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: salesInvoiceReportsList?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // const calculateTotal = () => {
  //   let total = 0;
  //   salesInvoiceReportsList?.items.forEach((record) => {
  //     total += record.total;
  //   });
  //   return formatCurrency(Math.ceil(total));
  // };

  const handleDropDownProductChange = (selected) => {
    if (selected[0]) {
      setProductId(selected[0].id);
    } else {
      setProductId("");
    }
  };

  const handleDropDownCustomerChange = (selected) => {
    if (selected[0]) {
      setCustomerId(selected[0].id);
    } else {
      setCustomerId("");
    }
  };

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <div className="card-header">
        <Header category="Report" title="Sales Invoice Report" />
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
        </div>
      </div>
      {showFilters && (
        <div className="container mb-5">
          <div className="row">
            <Group className="col-sm-6 col-md-2 form-floating datePiker">
              <DatePicker
                id="startDate"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="form-control"
                dateFormat="dd-MM-yyyy"
              />
              <span className="highlight"></span>
              <Label htmlFor="startDate">Start Date:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating datePiker">
              <DatePicker
                id="endDate"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="form-control"
                dateFormat="dd-MM-yyyy"
              />
              <span className="highlight"></span>
              <Label htmlFor="endDate">End Date:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating mt-3" style={{marginTop: "auto"}}>
              <Label className="dropdown-label">Customer Name</Label>
              <div className="input-container">
                <Typeahead
                  id="inputCustomer"
                  labelKey={(option) => option.name}
                  options={customerList?.items}
                  placeholder="Select Customer"
                  onChange={handleDropDownCustomerChange}
                />
                <div className="dropdown-arrow">
                  <FiChevronDown />
                </div>
              </div>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating mt-3" style={{marginTop: "auto"}}>
              <Label className="dropdown-label">Product Name</Label>
              <div className="input-container">
                <Typeahead
                  id="inputProducts"
                  labelKey={(option) => `${option.name} - ${option.model}`}
                  options={productsList?.items}
                  placeholder="Select Products"
                  onChange={handleDropDownProductChange}
                />
                <div className="dropdown-arrow">
                  <FiChevronDown />
                </div>
              </div>
            </Group>
          </div>
        </div>
      )}
      <div className="toolbar">
        <Button
          variant="link"
          className="btn-toolbar"
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => setIsExporting(true)}
          disabled={spinLoadingExport}
        >
          {spinLoadingExport ? (
            <>
              <Oval color="#e3165b" height={20} width={20} />
              Exporting...
            </>
          ) : (
            <>
              <SiMicrosoftexcel className="text-l mr-1" />
              Export
            </>
          )}
        </Button>
        {isExporting ?
          <ExportData
            dbStartDate={dbStartDate}
            dbEndDate={dbEndDate}
            dbCustomerId={dbCustomerId}
            dbProductId={dbProductId}
            selectedCompanyId={selectedCompanyId}
            setSpinLoadingExport={setSpinLoadingExport}
            setIsExporting={setIsExporting}
          />
          : null
        }
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Pagination type="inBox" pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} setPageSize={setPageSize} setNoPage={setNoPage} totalSize={totalSize} />
        </div>
      </div>
      <Table table={table} isLoading={isLoading} />
      <Pagination pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} totalSize={totalSize} />
    </div>
  );
};

export const ExportData = ({ dbStartDate, dbEndDate, dbCustomerId, dbProductId, selectedCompanyId, setSpinLoadingExport, setIsExporting }) => {
  const [isLoadingExport, setIsLoadingExport] = useState(true);
  const { data: salesInvoiceReportExportList, isLoading: spinLoadingExport } = useSalesInvoiceReportExport(dbStartDate, dbEndDate, dbCustomerId, dbProductId, selectedCompanyId, "true");

  setSpinLoadingExport(spinLoadingExport);

  useEffect(() => {
    async function downloadCSV() {

      try {
        setIsLoadingExport(true);
        const blob = new Blob([salesInvoiceReportExportList], { type: 'application/octet-stream' });
        const currentDate = format(new Date(), 'dd-MM-yyyy');
        const filename = `Sales-Invoice-Report-${currentDate}.csv`;
        saveAs(blob, filename);
      } catch (error) {
        console.error('Error exporting data:', error);
      } finally {
        setIsLoadingExport(false);
        setSpinLoadingExport(false);
      }
    }

    if (!spinLoadingExport) {
      downloadCSV();
      setSpinLoadingExport(false);
      setIsExporting(false);
    }
  }, [salesInvoiceReportExportList]);

  return;
}

export default SalesInvoiceReport;

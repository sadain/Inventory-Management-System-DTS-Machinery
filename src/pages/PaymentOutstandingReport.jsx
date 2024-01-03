import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { Form, Button } from "react-bootstrap";
import { RiFilterLine, RiFilterOffLine } from "react-icons/ri";
import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import Table from "components/Table";
import { format, parseISO } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePaymentOutstandingReport, usePaymentOutstandingReportExport, useCustomer } from "api/useApi";
import Pagination from "components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";
import Select from "react-select";
import { SiMicrosoftexcel } from "react-icons/si";
import { saveAs } from 'file-saver';
import { Oval } from 'react-loader-spinner';

const { Group, Label } = Form;

const PaymentOutstandingReport = (props) => {
    const { selectedCompanyId } = props;
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [spinLoadingExport, setSpinLoadingExport] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    // const [customerId, setCustomerId] = useState("");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [remarks, setRemarks] = useState("");
    // const [companyId, setCompanyId] = useState("");
    const [noPage, setNoPage] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const selectedCustomerIds = selectedCustomers.map((customer) => customer.id).join(',');

    const dbStartDate = useDebounce(startDate, 600);
    const dbEndDate = useDebounce(endDate, 600);
    const dbCustomerId = useDebounce(selectedCustomerIds, 600);
    const dbInvoiceNo = useDebounce(invoiceNo, 600);
    const dbRemarks = useDebounce(remarks, 600);
    const dbNoPage = useDebounce(noPage, 600);
    const dbPageNumber = useDebounce(pageNumber, 600);
    const dbPageSize = useDebounce(pageSize, 600);

    const { data: customerList } = useCustomer("", "", "", "", selectedCompanyId, "true");
    const { data: paymentOutstandingReportsList, isLoading: spinLoading } = usePaymentOutstandingReport(dbStartDate, dbEndDate, dbCustomerId, dbInvoiceNo, dbRemarks, selectedCompanyId, dbNoPage, dbPageNumber, dbPageSize);

    const { totalSize } = paymentOutstandingReportsList || {};

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
    
    // const customRoundValue = (value) => {
    //     const decimalPart = value - Math.floor(value);
    //     const roundedValue = decimalPart >= 0.5 ? Math.ceil(value) : Math.floor(value);
    //     return roundedValue;
    //   };

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
            // cell: (info) => format(parseISO(info.getValue()), "dd-MM-yyyy"),
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("invoiceValue", {
            header: "Invoice Value",
            cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
        }),
        columnHelper.accessor("totalPaid", {
            header: "Total Paid",
            cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
        }),
        columnHelper.accessor("outstanding", {
            header: "Outstanding",
            cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
        }),
        columnHelper.accessor("paymentMode", {
            header: "Payment Mode",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("lastPaymentReceived", {
            header: "Last Payment Received",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("paymentStatus", {
            header: "Payment Status",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("dueDays", {
            header: "Due Days",
            cell: (info) => info.getValue(),
        }),
    ];

    const table = useReactTable({
        data: paymentOutstandingReportsList?.items || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
            <div className="card-header">
                <Header category="Report" title="Payment Outstanding Report" />
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
                                value={startDate}
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
                                value={endDate}
                            />
                            <span className="highlight"></span>
                            <Label htmlFor="endDate">End Date:</Label>
                        </Group>
                        <Group className="col-sm-6 col-md-4 form-floating">
                            <p className="multiselect-lable">
                                Customer Name
                            </p>
                            <Select
                                id="inputCustomer"
                                className={`multiselect ${isLoading ? 'loading-dropdown' : ''}`}
                                options={customerList?.items || []}
                                value={selectedCustomers}
                                onChange={setSelectedCustomers}
                                closeMenuOnSelect={false}
                                getOptionValue={(option) => option.id}
                                getOptionLabel={(option) => option.name}
                                isMulti
                                placeholder="Select customers..."
                            />
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
                                id="remarks"
                                className="form-control"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                            <span className="highlight"></span>
                            <Label htmlFor="remarks">Remarks:</Label>
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
                        startDate={startDate}
                        endDate={endDate}
                        dbCustomerId={dbCustomerId}
                        dbInvoiceNo={dbInvoiceNo}
                        dbRemarks={dbRemarks}
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

export const ExportData = ({ startDate, endDate, dbCustomerId, dbInvoiceNo, dbRemarks, selectedCompanyId, setSpinLoadingExport, setIsExporting }) => {
    const [isLoadingExport, setIsLoadingExport] = useState(true);
    const { data: paymentOutstandingReportsExportList, isLoading: spinLoadingExport } = usePaymentOutstandingReportExport(startDate, endDate, dbCustomerId, dbInvoiceNo, dbRemarks, selectedCompanyId, "true");
  
    setSpinLoadingExport(spinLoadingExport);
  
    useEffect(() => {
      async function downloadCSV() {
  
        try {
          setIsLoadingExport(true);
          const blob = new Blob([paymentOutstandingReportsExportList], { type: 'application/octet-stream' });
          const currentDate = format(new Date(), 'dd-MM-yyyy');
          const filename = `Payment-Outstanding-Report-${currentDate}.csv`;
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
    }, [paymentOutstandingReportsExportList]);
  
    return;
  }

export default PaymentOutstandingReport;
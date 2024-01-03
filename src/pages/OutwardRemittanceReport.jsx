import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { Form, Button } from "react-bootstrap";
import { RiFilterLine, RiFilterOffLine } from "react-icons/ri";
import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";
import Table from "components/Table";
import { format, parseISO } from "date-fns";
import Loader from "components/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useOutwardRemittanceReport, useOutwardRemittanceReportExport } from "api/useApi";
import Pagination from "components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";
import { SiMicrosoftexcel } from "react-icons/si";
import { saveAs } from 'file-saver';
import { Oval } from 'react-loader-spinner';

const { Group, Label } = Form;

const OutwardRemittanceReport = (props) => {
    const { selectedCompanyId } = props;
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [spinLoadingExport, setSpinLoadingExport] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [invoiceNo, setInvoiceNo] = useState("");
    // const [companyId, setCompanyId] = useState("");
    // const [noPage, setNoPage] = useState(false);
    // const [pageNumber, setPageNumber] = useState(1);
    // const [pageSize, setPageSize] = useState(10);

    const dbStartDate = useDebounce(startDate, 600);
    const dbEndDate = useDebounce(endDate, 600);
    const dbInvoiceNo = useDebounce(invoiceNo, 600);
    // const dbNoPage = useDebounce(noPage, 600);
    // const dbPageNumber = useDebounce(pageNumber, 600);
    // const dbPageSize = useDebounce(pageSize, 600);

    const { data: outwardRemittanceReportList, isLoading: spinLoading } = useOutwardRemittanceReport(selectedCompanyId, dbStartDate, dbEndDate, dbInvoiceNo);

    const { totalUSD, totalINR, totalBankCharges } = outwardRemittanceReportList || {};

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
        columnHelper.accessor("transferDate", {
            header: "Transfer Date",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("invoice", {
            header: "Invoice",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("invoiceValue", {
            header: "Invoice Value",
            cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
        }),
        columnHelper.accessor("usd", {
            header: "USD",
            cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
        }),
        columnHelper.accessor("rate", {
            header: "Rate",
            cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
        }),
        columnHelper.accessor("inr", {
            header: "INR",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("bankCharges", {
            header: "Bank Charges",
            cell: (info) => info.getValue(),
        }),
    ];

    const table = useReactTable({
        data: outwardRemittanceReportList?.details || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const rows = table.getRowModel().rows;
    const headers = table.getHeaderGroups()[0].headers;

    return (
        <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
            <div className="card-header">
                <Header category="Report" title="Outward Remittance Report" />
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
                        selectedCompanyId={selectedCompanyId}
                        startDate={startDate}
                        endDate={endDate}
                        dbInvoiceNo={dbInvoiceNo}
                        setSpinLoadingExport={setSpinLoadingExport}
                        setIsExporting={setIsExporting}
                    />
                    : null
                }
                {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Pagination type="inBox" pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} setPageSize={setPageSize} setNoPage={setNoPage} totalSize={totalSize} />
                </div> */}
            </div>
            {/* <Table table={table} isLoading={isLoading} /> */}
            <div style={{ height: "auto", overflowY: "auto" }}>
                <table className="table table-hover table-bordered table-responsive">
                    <thead style={{ textTransform: "capitalize" }}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} style={{ width: header.width }}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={headers.length}
                                    style={{
                                        textAlign: "center",
                                        backgroundColor: "#f6f6f6",
                                    }}
                                >
                                    <Loader />
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={headers.length}
                                    style={{ textAlign: "center", backgroundColor: "#f6f6f6" }}
                                >
                                    This Record is Empty
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} style={{ width: cell.column.width }}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                        <tr>
                            <td colSpan="3" style={{ textAlign: "center" }}>
                                Total:
                            </td>
                            <td>{totalUSD ? formatCurrency(totalUSD) : ""}</td>
                            <td></td>
                            <td>{totalINR ? formatCurrency(totalINR) : ""}</td>
                            <td>{totalBankCharges ? formatCurrency(totalBankCharges) : ""}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* <Pagination pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} totalSize={totalSize} /> */}
        </div>
    );
};

export const ExportData = ({ selectedCompanyId, startDate, endDate, dbInvoiceNo, setSpinLoadingExport, setIsExporting }) => {
    const [isLoadingExport, setIsLoadingExport] = useState(true);
    const { data: outwardRemittanceReportExportList, isLoading: spinLoadingExport } = useOutwardRemittanceReportExport(selectedCompanyId, startDate, endDate, dbInvoiceNo);

    setSpinLoadingExport(spinLoadingExport);

    useEffect(() => {
        async function downloadCSV() {

            try {
                setIsLoadingExport(true);
                const blob = new Blob([outwardRemittanceReportExportList], { type: 'application/octet-stream' });
                const currentDate = format(new Date(), 'dd-MM-yyyy');
                const filename = `Outward-Remittance-Report-${currentDate}.csv`;
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
    }, [outwardRemittanceReportExportList]);

    return;
}

export default OutwardRemittanceReport;
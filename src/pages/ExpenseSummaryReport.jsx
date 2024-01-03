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
import { useExpenseSummaryReport, useExpenseSummaryReportExport, useExpenseType } from "api/useApi";
import Pagination from "components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";
import Select from "react-select";
import { SiMicrosoftexcel } from "react-icons/si";
import { saveAs } from 'file-saver';
import { Oval } from 'react-loader-spinner';

const { Group, Label } = Form;

const ExpenseSummaryReport = (props) => {
    const { selectedCompanyId } = props;
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [spinLoadingExport, setSpinLoadingExport] = useState(false);

    const currentDate = new Date();
    const defaultMonth = currentDate.getMonth() + 1;
    const defaultYear = currentDate.getFullYear();
    const months = [...Array(12)].map((_, index) => ({
        value: index + 1,
        label: format(new Date(0, index), "MMMM"),
    }));
    const years = [...Array(10)].map((_, index) => defaultYear - index);

    const [month, setMonth] = useState(defaultMonth);
    const [year, setYear] = useState(defaultYear);
    // const [ledgerTypes, setLedgerTypes] = useState("");
    const [selectedLedgerTypes, setSelectedLedgerTypes] = useState([]);
    const selectedLedgerTypesIds = selectedLedgerTypes.map((LedgerTypes) => LedgerTypes.id).join(',');

    const dbMonth = useDebounce(month, 600);
    const dbYear = useDebounce(year, 600);
    const dbLedgerTypes = useDebounce(selectedLedgerTypesIds, 600);

    const { data: ledgerTypesList } = useExpenseType();
    const { data: expenseSummaryReportList, isLoading: spinLoading } = useExpenseSummaryReport(selectedCompanyId, dbMonth, dbYear, dbLedgerTypes);
    // const { data: expenseSummaryReportExportList, isLoading: spinLoadingExport } = useExpenseSummaryReportExport(selectedCompanyId, dbMonth, dbYear, dbLedgerTypes);

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

    const customRoundValue = (value) => {
        const decimalPart = value - Math.floor(value);
        const roundedValue = decimalPart >= 0.5 ? Math.ceil(value) : Math.floor(value);
        return roundedValue;
      };

    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor("date", {
            header: "Date",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("particulars", {
            header: "Particulars",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("cashInUSD", {
            header: "Cash In USD",
            cell: (info) => info.getValue() ? formatCurrency(customRoundValue(info.getValue())) : "",
        }),
        columnHelper.accessor("cashInExchangeRate", {
            header: "Cash In Exchange Rate",
            cell: (info) => info.getValue() ? formatCurrency(customRoundValue(info.getValue())) : "",
        }),
        columnHelper.accessor("cashInINR", {
            header: "Cash In INR",
            cell: (info) => info.getValue() ? formatCurrency(customRoundValue(info.getValue())) : "",
        }),
        columnHelper.accessor("cashOutUSD", {
            header: "Cash Out USD",
            cell: (info) => info.getValue() ? formatCurrency(customRoundValue(info.getValue())) : "",
        }),
        columnHelper.accessor("cashOutExchangeRate", {
            header: "Cash Out Exchange Rate",
            cell: (info) => info.getValue() ? formatCurrency(customRoundValue(info.getValue())) : "",
        }),
        columnHelper.accessor("cashOutINR", {
            header: "Cash Out INR",
            cell: (info) => info.getValue() ? formatCurrency(customRoundValue(info.getValue())) : "",
        }),
        columnHelper.accessor("balanceUSD", {
            header: "Balance USD",
            cell: (info) => info.getValue() ? formatCurrency(customRoundValue(info.getValue())) : "",
        }),
        columnHelper.accessor("balanceINR", {
            header: "Balance INR",
            cell: (info) => info.getValue() ? formatCurrency(customRoundValue(info.getValue())) : "",
        }),
    ];

    const table = useReactTable({
        data: expenseSummaryReportList || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
            <div className="card-header">
                <Header category="Report" title="Expense Summary Report" />
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
                        <Group className="col-sm-6 col-md-2 form-floating">
                            <p className="multiselect-lable">Month</p>
                            <Select
                                options={months}
                                value={months.find((m) => m.value === month)}
                                onChange={(selectedOption) => setMonth(selectedOption.value)}
                            />
                        </Group>
                        <Group className="col-sm-6 col-md-2 form-floating">
                            <select
                                id="inputYear"
                                className="form-control"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                            >
                                {years.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                            <Label htmlFor="inputYear">Year</Label>
                        </Group>

                        <Group className="col-sm-6 col-md-4 form-floating">
                            <p className="multiselect-lable">
                                Ledger Type
                            </p>
                            <Select
                                id="inputCustomer"
                                className={`multiselect ${isLoading ? 'loading-dropdown' : ''}`}
                                options={ledgerTypesList || []}
                                value={selectedLedgerTypes}
                                onChange={setSelectedLedgerTypes}
                                closeMenuOnSelect={false}
                                getOptionValue={(option) => option.id}
                                getOptionLabel={(option) => option.name}
                                isMulti
                                placeholder="Select Leadger Types..."
                            />
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
                        dbMonth={dbMonth}
                        dbYear={dbYear}
                        dbLedgerTypes={dbLedgerTypes}
                        selectedCompanyId={selectedCompanyId}
                        setSpinLoadingExport={setSpinLoadingExport}
                        setIsExporting={setIsExporting}
                    />
                    : null
                }
            </div>
            <Table table={table} isLoading={isLoading} />
        </div>
    );
};

export const ExportData = ({ selectedCompanyId, dbMonth, dbYear, dbLedgerTypes, setSpinLoadingExport, setIsExporting }) => {
    const [isLoadingExport, setIsLoadingExport] = useState(true);
    const { data: expenseSummaryReportExportList, isLoading: spinLoadingExport } = useExpenseSummaryReportExport(selectedCompanyId, dbMonth, dbYear, dbLedgerTypes);
  
    setSpinLoadingExport(spinLoadingExport);
  
    useEffect(() => {
      async function downloadCSV() {
  
        try {
          setIsLoadingExport(true);
          const blob = new Blob([expenseSummaryReportExportList], { type: 'application/octet-stream' });
          const currentDate = format(new Date(), 'dd-MM-yyyy');
          const filename = `Expense-Summary-Report-${currentDate}.csv`;
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
    }, [expenseSummaryReportExportList]);
  
    return;
  }

export default ExpenseSummaryReport
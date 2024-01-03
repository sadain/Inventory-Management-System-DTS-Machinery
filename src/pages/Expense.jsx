import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { Form, Button } from "react-bootstrap";
import { RiFilterLine, RiFilterOffLine } from "react-icons/ri";
import { SiMicrosoftexcel } from "react-icons/si";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { format, parseISO } from 'date-fns';
import Table from "components/Table";
import Loader from "components/Loader";
import ExpenseFormAction from "components/Forms/ExpenseFormAction";
import ExpenseFormDelete from "components/Forms/ExpenseFormDelete";
import { useExpense, useExpenseType } from "api/useApi";
import Pagination from "components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";
// import { CSVLink } from "react-csv";

const { Group, Label } = Form;

const Expense = (props) => {
  const { queryClient, selectedCompanyId } = props;
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [amountRangeFrom, setAmountRangeFrom] = useState("");
  const [amountRangeTo, setAmountRangeTo] = useState("");
  // const [companyId, setCompanyId] = useState("");
  const [noPage, setNoPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dbKeyword = useDebounce(keyword, 600);
  const dbDateStart = useDebounce(dateStart, 600);
  const dbDateEnd = useDebounce(dateEnd, 600);
  const dbAmountRangeFrom = useDebounce(amountRangeFrom, 600);
  const dbAmountRangeTo = useDebounce(amountRangeTo, 600);
  const dbNoPage = useDebounce(noPage, 600);
  const dbPageNumber = useDebounce(pageNumber, 600);
  const dbPageSize = useDebounce(pageSize, 600);

  const { data: expenseTypeList } = useExpenseType();
  const { data: expenseList, isLoading: spinLoading } = useExpense(dbKeyword, dbDateStart, dbDateEnd, dbAmountRangeFrom, dbAmountRangeTo, selectedCompanyId, dbNoPage, dbPageNumber, dbPageSize);

  const { totalSize } = expenseList || {};

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
    columnHelper.accessor("expenseType", {
      header: () => "Expense Type",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("invoiceNo", {
      header: () => "Invoice No",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("ledgerDate", {
      header: () => "Ledger Date",
      cell: (info) => info.getValue() ? format(parseISO(info.getValue()), "dd-MM-yyyy") : "",
    }),
    columnHelper.accessor("particulars", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("currency", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("amount", {
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("exchangeRate", {
      header: () => "Exchange Rate",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("totalAmount", {
      header: () => "Total Amount",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("id", {
      header: () => "Action",
      width: 200,
      cell: (info) => (
        <div className="actionEditDelete">
          <ExpenseFormAction
            type="edit"
            queryClient={queryClient}
            selectedCompanyId={selectedCompanyId}
            expenseRow={info.row.original}
            expenseTypeList={expenseTypeList}
          />
          <ExpenseFormDelete
            type="delete"
            queryClient={queryClient}
            expenseRow={info.row.original}
          />
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: expenseList?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  const headers = table.getHeaderGroups()[0].headers;

  const calculateAmount = () => {
    let amount = 0;
    expenseList?.items?.forEach((record) => {
      amount += record.amount;
    });
    return amount;
  };
  const calculatetotalAmount = () => {
    let totalAmount = 0;
    expenseList?.items?.forEach((record) => {
      totalAmount += record.totalAmount;
    });
    return totalAmount;
  };

  // const parsedDate = parseISO("2023-08-07T12:05:02");

  // const handleExportCSV = () => {
  //   if (!expenseList?.items || expenseList.items.length === 0) {
  //     return {
  //       data: [],
  //       filename: `expense_data-${format(new Date(), 'dd-MM-yyyy')}.csv`,
  //     };
  //   }

  //   const currentDate = format(new Date(), 'dd-MM-yyyy');
  //   const filename = `expense_data-${currentDate}.csv`;

  //   const csvData = expenseList.items.map((item) => ({
  //     expenseType: item.expenseType,
  //     invoiceNo: item.invoiceNo,
  //     ledgerDate: format(parseISO(item.ledgerDate), 'dd-MM-yyyy'),
  //     particulars: item.particulars,
  //     currency: item.currency,
  //     amount: item.amount,
  //     exchangeRate: item.exchangeRate,
  //     totalAmount: item.totalAmount,
  //   }));

  //   return { data: csvData, filename };
  // };

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <div className="card-header">
        <Header category="Transaction" title="Expense" />
        <div className="card-filter-page">
          <Button className="filter-btn form-btn mb-3"
            variant="link"
            onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? (<RiFilterOffLine className="text-lg mr-1.5" />) : (<RiFilterLine className="text-lg mr-1.5" />)}
            <span>{showFilters ? "Hide Filter" : "Show Filter"}</span>
          </Button>
        </div>
      </div>
      {showFilters && (
        <div className="container mb-5">
          <div className="row filter-row">
            <Group className="col-sm-6 col-md-2 form-floating">
              <input
                type="text"
                id="keyword"
                className="form-control"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="keyword">Keyword:</Label>
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
              <input
                type="text"
                id="amountRangeFrom"
                className="form-control"
                value={amountRangeFrom}
                onChange={(e) => setAmountRangeFrom(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="amountRangeFrom">Amount Range From:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating">
              <input
                type="text"
                id="amountRangeTo"
                className="form-control"
                value={amountRangeTo}
                onChange={(e) => setAmountRangeTo(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="amountRangeTo">Amount Range To:</Label>
            </Group>
          </div>
        </div>
      )}
      <div className="toolbar">
        <ExpenseFormAction
          type="add"
          queryClient={queryClient}
          selectedCompanyId={selectedCompanyId}
          expenseTypeList={expenseTypeList}
        />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Pagination type="inBox" pageNumber={pageNumber} pageSize={pageSize} noPage={noPage} setPageNumber={setPageNumber} setPageSize={setPageSize} setNoPage={setNoPage} totalSize={totalSize} />
          {/* <CSVLink
            data={handleExportCSV().data}
            filename={handleExportCSV().filename}
            className="export-btn btn-toolbar"
            style={{ display: "flex", alignItems: "center" }}
          >
            <SiMicrosoftexcel className="text-l mr-1" />
            Export
          </CSVLink> */}
        </div>
      </div>
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
              <td colSpan="5" style={{ width: "100%", textAlign: "center" }}>
                Total:
              </td>
              <td style={{ width: "100%" }}>{formatCurrency(calculateAmount())}</td>
              <td></td>
              <td style={{ width: "100%" }}>{formatCurrency(calculatetotalAmount())}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* <Table table={table} isLoading={isLoading} /> */}
      <Pagination pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} totalSize={totalSize} />
    </div>
  );
};

export default Expense;

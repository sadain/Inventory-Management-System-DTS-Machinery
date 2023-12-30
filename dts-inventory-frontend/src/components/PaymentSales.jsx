import React from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { format, parseISO } from 'date-fns';
import Table from "components/Table";
import Loader from "components/Loader";
import PaymentSalesFormAction from "./Forms/PaymentSalesFormAction";
import PaymentSalesFormDelete from "./Forms/PaymentSalesFormDelete";

const PaymentSales = (props) => {
  const { queryClient, isLoading, salesInvoiceList, paymentSalesList } = props;

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
    columnHelper.accessor("customerName", {
      header: () => "Customer_Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("invoiceNo", {
      header: () => "Invoice_No",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("paymentMode", {
      header: () => "Payment_Mode",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("paidOn", {
      header: () => "Paid_On",
      cell: (info) =>
        format(parseISO(info.getValue()), "dd-MM-yyyy"),
    }),
    columnHelper.accessor("amount", {
      cell: (info) => info.getValue() ? formatCurrency(customRoundValue(info.getValue())) : "",
    }),
    columnHelper.accessor("billValue", {
      header: () => "Bill_Value",
      cell: (info) => info.getValue() ? formatCurrency(customRoundValue(info.getValue())) : "",
    }),
    columnHelper.accessor("remarks", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: () => "Action",
      width: 200,
      cell: (info) => (
        <div className="actionEditDelete">
          <PaymentSalesFormDelete
            type="delete"
            queryClient={queryClient}
            paymentSalesRow={info.row.original}
          />
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: paymentSalesList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  const headers = table.getHeaderGroups()[0].headers;

  const calculateAmount = () => {
    let amount = 0;
    paymentSalesList?.forEach((record) => {
      amount += record.amount;
    });
    return amount;
  };
  const calculateBillValue = () => {
    let billValue = 0;
    paymentSalesList?.forEach((record) => {
      billValue += record.billValue;
    });
    return billValue;
  };

  return (
    <div>
      <div className="flex toolbar">
        <PaymentSalesFormAction
          type="add"
          queryClient={queryClient}
          salesInvoiceList={salesInvoiceList?.items}
        />
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
              <td colSpan="4" style={{ width: "100%", textAlign: "center" }}>
                Total:
              </td>
              <td style={{ width: "100%" }}>{formatCurrency(calculateAmount())}</td>
              <td style={{ width: "100%" }}>{formatCurrency(calculateBillValue())}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* <Table table={table} isLoading={isLoading} /> */}
    </div>
  );
};

export default PaymentSales;

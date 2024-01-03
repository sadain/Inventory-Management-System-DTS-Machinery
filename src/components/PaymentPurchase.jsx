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

import PaymentPurchaseFormAction from "./Forms/PaymentPurchaseFormAction";
import PaymentPurchaseFormDelete from "./Forms/PaymentPurchaseFormDelete";

const PaymentPurchase = (props) => {
  const { queryClient, isLoading, purchaseOrderList, paymentPurchaceList } = props;

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
    columnHelper.accessor("supplierName", {
      header: () => "Supplier Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("invoiceNo", {
      header: () => "Invoice No",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("paymentMode", {
      header: () => "Payment Mode",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("paidOn", {
      header: () => "Paid On",
      cell: (info) =>
        format(parseISO(info.getValue()), "dd-MM-yyyy"),
    }),
    columnHelper.accessor("amount", {
      cell: (info) => info.getValue() ? formatCurrency(customRoundValue(info.getValue())) : "",
    }),
    columnHelper.accessor("billValue", {
      header: () => "Bill Value",
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
          <PaymentPurchaseFormDelete
            type="delete"
            queryClient={queryClient}
            paymentPurchaseRow={info.row.original}
          />
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: paymentPurchaceList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // if (!paymentPurchaceList) {
  //   return <div className="loader" >Some data is not available.</div>;
  // }

  const rows = table.getRowModel().rows;
  const headers = table.getHeaderGroups()[0].headers;

  const calculateAmount = () => {
    let amount = 0;
    paymentPurchaceList?.forEach((record) => {
      amount += record.amount;
    });
    return amount;
  };
  const calculateBillValue = () => {
    let billValue = 0;
    paymentPurchaceList?.forEach((record) => {
      billValue += record.billValue;
    });
    return billValue;
  };

  return (
    <div>
      <div className="flex toolbar">
        <PaymentPurchaseFormAction
          type="add"
          queryClient={queryClient}
          purchaseOrderList={purchaseOrderList?.items}
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

export default PaymentPurchase;

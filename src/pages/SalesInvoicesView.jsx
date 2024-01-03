import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table from "components/Table";
import Loader from "components/Loader";
import SalesInvoicesViewFormAction from "components/Forms/SalesInvoicesViewFormAction";
import SalesInvoicesViewFormDelete from "components/Forms/SalesInvoicesViewFormDelete";
import { useSalesInvoiceView, useProducts } from "api/useApi";
import { useParams } from "react-router-dom";

const SalesInvoicesView = (props) => {
  const { queryClient, selectedCompanyId } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  let params = useParams();

  const { data: salesInvoiceList, isLoading: spinLoading } = useSalesInvoiceView(params.id);

  const { data: productsList, isLoading: spinLoading1 } = useProducts("", "", "", selectedCompanyId, "true");

  const productFilteredList = productsList?.items?.filter((product) => product?.stock > 0) || [];

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
    columnHelper.accessor("product.name", {
      header: () => "Product Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("serialNumber", {
      header: () => "Serial Number",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("quantity", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("rate", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("amount", {
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("discount", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("cgstRate", {
      header: () => "CGST Rate",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("cgstValue", {
      header: () => "CGST Value",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("sgstRate", {
      header: () => "SGST Rate",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("sgstValue", {
      header: () => "SGST Value",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("igstRate", {
      header: () => "IGST Rate",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("igstValue", {
      header: () => "IGST Value",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("total", {
      cell: (info) => info.getValue() ? formatCurrency(customRoundValue(info.getValue())) : "",
    }),
    columnHelper.accessor("id", {
      header: "Action",
      width: 200,
      cell: (info) => {
        return (
          <div className="actionEditDelete">
            <SalesInvoicesViewFormAction
              type="edit"
              queryClient={queryClient}
              salesInvoiceRow={info.row.original}
              spinLoading1={spinLoading1}
              productFilteredList={productFilteredList}
            />
            <SalesInvoicesViewFormDelete
              type="delete"
              queryClient={queryClient}
              salesInvoiceRow={info.row.original}
            />
          </div>
        )
      }
    }),
  ];

  const table = useReactTable({
    data: salesInvoiceList?.salesInvoiceRecords || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Transaction" title="Sales Invoice Record" backTo="/sales-invoices" recordList={salesInvoiceList?.salesInvoiceRecords || []} />
      <div className="flex toolbar">
        <SalesInvoicesViewFormAction
          type="add"
          queryClient={queryClient}
          selectedCompanyId={selectedCompanyId}
          salesInvoiceId={params.id}
          spinLoading1={spinLoading1}
          productFilteredList={productFilteredList}
        />
      </div>
      <Table table={table} isLoading={isLoading} />
    </div>
  );
};

export default SalesInvoicesView;

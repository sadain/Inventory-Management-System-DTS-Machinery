import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table from "components/Table";
import Loader from "components/Loader";
import ProformaInvoiceViewFormAction from "components/Forms/ProformaInvoiceViewFormAction";
import ProformaInvoiceViewFormDelete from "components/Forms/ProformaInvoiceViewFormDelete";
import { useProformaInvoiceView } from "api/useApi"
import { useParams } from "react-router-dom";

const ProformaInvoiceView = (props) => {
  const { queryClient, selectedCompanyId } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  let params = useParams();

  const { data: proformaInvoiceList, isLoading: spinLoading } = useProformaInvoiceView(params.id);

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
    columnHelper.accessor("product.name", {
      header: "Product Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("quantity", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("unitPrice", {
      header: "Unit Price",
        cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("totalPrice", {
      header: "Total Price",
        cell: (info) => formatCurrency(info.getValue()),
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
      header: "Total",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    // columnHelper.accessor("remarks", {
    //   header: "Remarks",
    //   cell: (info) => info.getValue(),
    // }),
    columnHelper.accessor("id", {
      header: "Action",
      width: 200,
      cell: (info) => {
        return (
          <div className="actionEditDelete">
            <ProformaInvoiceViewFormAction
              type="edit"
              queryClient={queryClient}
              proformaInvoiceRow={info.row.original}
              selectedCompanyId={selectedCompanyId}
            />
            <ProformaInvoiceViewFormDelete
              type="delete"
              queryClient={queryClient}
              proformaInvoiceRow={info.row.original}
            />
          </div>
        )
      }
    }),
  ];

  const table = useReactTable({
    data: proformaInvoiceList?.proformaInvoiceRecords || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Transaction" title="Proforma Invoice Record" />
      <Table table={table} isLoading={isLoading} />
    </div>
  );
};

export default ProformaInvoiceView;

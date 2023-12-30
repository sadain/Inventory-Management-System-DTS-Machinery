import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table from "components/Table";
import Loader from "components/Loader";
import { usePurchaseOrdersView } from "api/useApi";
import { useParams } from "react-router-dom";

const PoReportView = (props) => {
  const { queryClient, selectedCompanyId } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  let params = useParams();

  const { data: purchaseOrderList, isLoading: spinLoading } = usePurchaseOrdersView(params.id);

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
    columnHelper.accessor("supplierDescription", {
      header: "Supplier Description",
      cell: (info) => info.getValue(),
    }),
    // columnHelper.accessor("color", {
    //   cell: (info) => info.getValue(),
    // }),
    columnHelper.accessor("unit", {
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
  ];

  const table = useReactTable({
    data: purchaseOrderList?.purchaseOrderRecords || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Transaction" title="Import Order Record"/>
      <Table table={table} isLoading={isLoading} />
    </div>
  );
};

export default PoReportView;

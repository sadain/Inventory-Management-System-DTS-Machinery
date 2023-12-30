import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table from "components/Table";
import { useCurrency } from "api/useApi";
import CurrencyFormAction from "components/Forms/CurrencyFormAction";
import Loader from "components/Loader";

const Currency = (props) => {
  const { queryClient } = props;
  const [isLoading, setIsLoading] = useState(true);

  const { data: currencyList, isLoading: spinLoading } = useCurrency();

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("name", {
      header: "Currency",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: () => "Action",
      width: 200,
      cell: (info) => (
        <div className="actionEditDelete">
          <CurrencyFormAction
            type="edit"
            queryClient={queryClient}
            currencyRow={info.row.original}
          />
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: currencyList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Master" title="Currency" />
      <div className="flex toolbar">
        <CurrencyFormAction type="add" queryClient={queryClient} />
      </div>
      <Table table={table} isLoading={isLoading} />
    </div>
  );
};

export default Currency;

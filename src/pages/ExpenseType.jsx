import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table from "components/Table";
import { useExpenseType } from "api/useApi";
import ExpenseTypeFormAction from "components/Forms/ExpenseTypeFormAction";
import ExpenseTypeFormDelete from "components/Forms/ExpenseTypeFormDelete";
import Loader from "components/Loader";

const ExpenseType = (props) => {
    const { queryClient } = props;
    const [isLoading, setIsLoading] = useState(true);

    const { data: expenseTypeList, isLoading: spinLoading } = useExpenseType();

    useEffect(() => {
        setIsLoading(spinLoading);
      }, [spinLoading]);
    
      const columnHelper = createColumnHelper();
    
      const columns = [
        columnHelper.accessor("name", {
          header: "Expense Type",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("id", {
          header: () => "Action",
          width: 200,
          cell: (info) => (
            <div className="actionEditDelete">
              <ExpenseTypeFormAction
                type="edit"
                queryClient={queryClient}
                expenseTypeRow={info.row.original}
              />
              <ExpenseTypeFormDelete
                type="delete"
                queryClient={queryClient}
                expenseTypeRow={info.row.original}
              />
            </div>
          ),
        }),
      ];
    
      const table = useReactTable({
        data: expenseTypeList || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
      });

      return (
        <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
          <Header category="Master" title="Expense Type" />
          <div className="flex toolbar">
            <ExpenseTypeFormAction
              type="add"
              queryClient={queryClient}
            />
          </div>
          <Table table={table} isLoading={isLoading} />
        </div>
      )
    }

export default ExpenseType
import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table from "components/Table";
import Loader from "components/Loader";
import DispatchChallanViewFormAction from "components/Forms/DispatchChallanViewFormAction";
import DispatchChallanViewFormDelete from "components/Forms/DispatchChallanViewFormDelete";
import { useDispatchChallansView, useProducts } from "api/useApi";
import { useParams } from "react-router-dom";

const DispatchChallanView = (props) => {
  const { queryClient, selectedCompanyId } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  let params = useParams();

  const { data: dispatchChallanViewList, isLoading: spinLoading } = useDispatchChallansView(params.id);

  const { data: productsList, isLoading: spinLoading1 } = useProducts("", "", "", selectedCompanyId, "true");

  const productFilteredList = productsList?.items?.filter((product) => product?.stock > 0) || [];

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("product.name", {
      header: () => "Product Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("modelNo", {
      header: () => "Model No",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("quantity", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("remarks", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: "Action",
      width: 200,
      cell: (info) => {
        return (
          <div className="actionEditDelete">
            <DispatchChallanViewFormAction
              type="edit"
              queryClient={queryClient}
              dispatchChallanViewRow={info.row.original}
              spinLoading1={spinLoading1}
              productFilteredList={productFilteredList}
            />
            <DispatchChallanViewFormDelete
              type="delete"
              queryClient={queryClient}
              dispatchChallanViewRow={info.row.original}
            />
          </div>
        )
      }
    }),
  ];

  const table = useReactTable({
    data: dispatchChallanViewList?.dispatchRecords || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Transaction" title="Dispatch Challan Record" backTo="/dispatch-challan" recordList={dispatchChallanViewList?.dispatchRecords || []} />
      <div className="flex toolbar">
        <DispatchChallanViewFormAction
          type="add"
          queryClient={queryClient}
          dispatchId={params.id}
          selectedCompanyId={selectedCompanyId}
          spinLoading1={spinLoading1}
          productFilteredList={productFilteredList}
        />
      </div>
      <Table table={table} isLoading={isLoading} />
    </div>
  );
};

export default DispatchChallanView;

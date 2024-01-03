import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table from "components/Table";
import { useProductCategory } from "api/useApi";
import ProductCategoryFormAction from "components/Forms/ProductCategoryFormAction";
import ProductCategoryFormDelete from "components/Forms/ProductCategoryFormDelete";
import Loader from "components/Loader";

const ProductCategory = (props) => {
  const { queryClient } = props;
  const [isLoading, setIsLoading] = useState(true);

  const { data: productCategoryList, isLoading: spinLoading } = useProductCategory();

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("name", {
      header: "Product Category Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: () => "Action",
      width: 200,
      cell: (info) => (
        <div className="actionEditDelete">
          <ProductCategoryFormAction
            type="edit"
            queryClient={queryClient}
            productCategoryRow={info.row.original}
          />
          <ProductCategoryFormDelete
            type="delete"
            queryClient={queryClient}
            productCategoryRow={info.row.original}
          />
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: productCategoryList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Master" title="Product Category" />
      <div className="flex toolbar">
        <ProductCategoryFormAction
          type="add"
          queryClient={queryClient}
        />
      </div>
      <Table table={table} isLoading={isLoading} />
    </div>
  )
}

export default ProductCategory;
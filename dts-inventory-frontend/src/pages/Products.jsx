import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { Form, Button } from "react-bootstrap";
import { RiFilterLine, RiFilterOffLine } from "react-icons/ri";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table from "components/Table";
import Loader from "components/Loader";
import { useProducts, useProductCategory } from "api/useApi";
import ProductFormAction from "components/Forms/ProductFormAction";
import ProductFormDelete from "components/Forms/ProductFormDelete";
import ProductImagePreview from "components/Forms/ProductImagePreview";
import Pagination from "components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";
import usePermission from "contexts/usePermission";
import { PERMISSIONS } from "utils/Permissions";

const { Group, Label } = Form;

const Products = (props) => {
  const { queryClient, selectedCompanyId } = props;
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [purpose, setPurpose] = useState("");
  // const [companyId, setCompanyId] = useState("");
  const [noPage, setNoPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dbName = useDebounce(name, 600);
  const dbModel = useDebounce(model, 600);
  const dbPurpose = useDebounce(purpose, 600);
  const dbNoPage = useDebounce(noPage, 600);
  const dbPageNumber = useDebounce(pageNumber, 600);
  const dbPageSize = useDebounce(pageSize, 600);

  const { data: productCategoryList } = useProductCategory();
  const { data: productsList, isLoading: spinLoading } = useProducts(dbName, dbModel, dbPurpose, selectedCompanyId, dbNoPage, dbPageNumber, dbPageSize);

  const { totalSize } = productsList || {};

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const { hasPermission } = usePermission();

  const {
    CAN_USER_CREATE_PRODUCT,
    CAN_USER_UPDATE_PRODUCT,
    CAN_USER_DELETE_PRODUCT,
  } = PERMISSIONS;

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("productCategory", {
      header: () => 'Category',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("model", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("purpose", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("hsn", {
      header: () => 'HSN',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("picture.id", {
      header: () => "Picture",
      width: 200,
      cell: (info) => (
        <div className="actionEditDelete">
          <ProductImagePreview
            queryClient={queryClient}
            productRow={info.row.original}
          />
        </div>
      ),
    }),
    columnHelper.accessor("id", {
      header: () => "Action",
      width: 200,
      cell: (info) => (
        <div className="actionEditDelete">
          {hasPermission(CAN_USER_UPDATE_PRODUCT) ? (
            <ProductFormAction
              type="edit"
              queryClient={queryClient}
              selectedCompanyId={selectedCompanyId}
              productRow={info.row.original}
              productCategoryList={productCategoryList}
            />
          ) : null}
          {hasPermission(CAN_USER_DELETE_PRODUCT) ? (
            <ProductFormDelete
              type="delete"
              queryClient={queryClient}
              productRow={info.row.original}
            />
          ) : null}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: productsList?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <div className="card-header">
        <Header category="Master" title="Products" />
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
          <div className="row" style={{ alignItems: "center" }}>
            <Group className="col-sm-6 col-md-2 form-floating">
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="name">Name:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating">
              <input
                type="text"
                id="model"
                className="form-control"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="model">Model:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating">
              <input
                type="text"
                id="purpose"
                className="form-control"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="purpose">Purpose:</Label>
            </Group>
          </div>
        </div>
      )}
      <div className="flex toolbar">
        {hasPermission(CAN_USER_CREATE_PRODUCT) ? (
          <ProductFormAction type="add" queryClient={queryClient} selectedCompanyId={selectedCompanyId} productCategoryList={productCategoryList} />
        ) : null}
        <Pagination type="inBox" pageNumber={pageNumber} pageSize={pageSize} noPage={noPage} setPageNumber={setPageNumber} setPageSize={setPageSize} setNoPage={setNoPage} totalSize={totalSize} />
      </div>
      <Table table={table} isLoading={isLoading} />
      <Pagination pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} totalSize={totalSize} />
    </div>
  );
};

export default Products;

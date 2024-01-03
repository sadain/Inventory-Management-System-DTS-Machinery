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
import { useHsnConfiguration } from "api/useApi";
import Pagination from "components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";
import HsnConfigurationFormAction from "components/Forms/HsnConfigurationFormAction";
import HsnConfigurationFormDelete from "components/Forms/HsnConfigurationFormDelete";

const { Group, Label } = Form;

const HsnConfiguration = (props) => {
  const { queryClient, selectedCompanyId } = props;
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [hsn, setHsn] = useState("");
  // const [companyId, setCompanyId] = useState("");
  const [noPage, setNoPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dbHsn = useDebounce(hsn, 600);
  const dbNoPage = useDebounce(noPage, 600);
  const dbPageNumber = useDebounce(pageNumber, 600);
  const dbPageSize = useDebounce(pageSize, 600);

  const { data: HsnConfigurationList, isLoading: spinLoading } = useHsnConfiguration(dbHsn, selectedCompanyId, dbNoPage, dbPageNumber, dbPageSize);

  const { totalSize } = HsnConfigurationList || {};

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("hsn", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("cgst", {
      header: () => "CGST",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("sgst", {
      header: () => "SGST",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("igst", {
      header: () => "IGST",
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("id", {
      header: () => "Action",
      width: 200,
      cell: (info) => (
        <div className="actionEditDelete">
          <HsnConfigurationFormAction
            type="edit"
            queryClient={queryClient}
            HsnConfigurationRow={info.row.original}
          />
          <HsnConfigurationFormDelete
            type="delete"
            queryClient={queryClient}
            HsnConfigurationRow={info.row.original}
          />
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: HsnConfigurationList?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <div className="card-header">
        <Header category="Master" title="Hsn Configuration" />
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
                id="hsn"
                className="form-control"
                value={hsn}
                onChange={(e) => setHsn(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="hsn">HSN:</Label>
            </Group>
          </div>
        </div>
      )}
      <div className="flex toolbar">
        <HsnConfigurationFormAction
          type="add"
          queryClient={queryClient}
        />
        <Pagination type="inBox" pageNumber={pageNumber} pageSize={pageSize} noPage={noPage} setPageNumber={setPageNumber} setPageSize={setPageSize} setNoPage={setNoPage} totalSize={totalSize} />
      </div>
      <Table table={table} isLoading={isLoading} />
      <Pagination pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} totalSize={totalSize} />
    </div>
  )
}

export default HsnConfiguration;
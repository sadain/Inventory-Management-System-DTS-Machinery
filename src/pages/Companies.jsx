import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "react-bootstrap";
import { AiOutlineBank } from "react-icons/ai";
import { Link } from "react-router-dom";
import Table from "components/Table";
import Loader from "components/Loader";
import CompaniesFormAction from "components/Forms/CompaniesFormAction";
import CompaniesFormDelete from "components/Forms/CompaniesFormDelete";
import { useCountries, useCompanies } from "api/useApi";
import usePermission from "contexts/usePermission";
import { PERMISSIONS } from "utils/Permissions";

const Companies = (props) => {
  const { queryClient } = props;
  const [isLoading, setIsLoading] = useState(true);

  const { data: countryList } = useCountries();
  const { data: companiesList, isLoading: spinLoading } = useCompanies();

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const { hasPermission } = usePermission();

  const {
    CAN_USER_CREATE_COMPANY,
    CAN_USER_UPDATE_COMPANY,
    CAN_USER_DELETE_COMPANY,
    CAN_USER_VIEW_COMPANY_BANK_DETAILS,
  } = PERMISSIONS;

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("address", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("city", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("state", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("country", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("postalCode", {
      header: () => "Postal Code",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("phone", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("gstIn", {
      header: () => "GST IN",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("cinNo", {
      header: () => "CIN NO",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("iecNo", {
      header: () => "IEC No",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("pan", {
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("id", {
      header: () => "Action",
      cell: (info) => (
        <div className="actionEditDelete">
          {hasPermission(CAN_USER_UPDATE_COMPANY) ? (
            <CompaniesFormAction
              type="edit"
              queryClient={queryClient}
              companiesRow={info.row.original}
              countryList={countryList}
            />
          ) : null}
          {hasPermission(CAN_USER_DELETE_COMPANY) ? (
            <CompaniesFormDelete
              type="delete"
              queryClient={queryClient}
              companiesRow={info.row.original}
            />
          ) : null}
          {hasPermission(CAN_USER_VIEW_COMPANY_BANK_DETAILS) ? (
            <Link to={`${info.row.original.id}/`}>
              <Button
                variant="link"
                className="form-btn"
                style={{ display: "flex", alignItems: "center" }}
              >
                <AiOutlineBank className="text-lg mr-1.5" />
                <span>Bank</span>
              </Button>
            </Link>
          ) : null}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: companiesList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Master" title="Companies" />
      <div className="flex toolbar">
        {hasPermission(CAN_USER_CREATE_COMPANY) ? (
          <CompaniesFormAction
            type="add"
            queryClient={queryClient}
            countryList={countryList}
          />
        ) : null}
      </div>

      <Table table={table} isLoading={isLoading} />
    </div>
  );
};

export default Companies;

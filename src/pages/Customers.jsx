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
import CustomersFormAction from "components/Forms/CustomersFormAction";
import CustomersFormDelete from "components/Forms/CustomersFormDelete";
import { useCountries, useStates, useCustomer } from "api/useApi";
import Pagination from "components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";
import usePermission from "contexts/usePermission";
import { PERMISSIONS } from "utils/Permissions";

const { Group, Label, Select } = Form;

const Customers = (props) => {
  const { queryClient, selectedCompanyId } = props;
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  // const [companyId, setCompanyId] = useState("");
  const [noPage, setNoPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dbName = useDebounce(name, 600);
  const dbCity = useDebounce(city, 600);
  const dbCountryId = useDebounce(countryId, 600);
  const dbStateId = useDebounce(stateId, 600);
  const dbNoPage = useDebounce(noPage, 600);
  const dbPageNumber = useDebounce(pageNumber, 600);
  const dbPageSize = useDebounce(pageSize, 600);

  const { data: countryList } = useCountries();
  const { data: statesList } = useStates({ selectedCountryId: dbCountryId });
  const { data: customersList, isLoading: spinLoading } = useCustomer(dbName, dbCity, dbCountryId, dbStateId, selectedCompanyId, dbNoPage, dbPageNumber, dbPageSize);

  const { totalSize } = customersList || {};

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const { hasPermission } = usePermission();

  const {
    CAN_USER_CREATE_CUSTOMER,
    CAN_USER_UPDATE_CUSTOMER,
    CAN_USER_DELETE_CUSTOMER,
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
    columnHelper.accessor("gstNo", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("phone", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("fax", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: () => "Action",
      width: 200,
      cell: (info) => (
        <div className="actionEditDelete">
          {hasPermission(CAN_USER_UPDATE_CUSTOMER) ? (
            <CustomersFormAction
              type="edit"
              queryClient={queryClient}
              selectedCompanyId={selectedCompanyId}
              customerRow={info.row.original}
              countryList={countryList}
            />
          ) : null}
          {hasPermission(CAN_USER_DELETE_CUSTOMER) ? (
            <CustomersFormDelete
              type="delete"
              queryClient={queryClient}
              customerRow={info.row.original}
            />
          ) : null}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: customersList?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <div className="card-header">
        <Header category="Master" title="Customers" />
        <div className="card-filter-page">
          <Button
            className="filter-btn form-btn mb-3"
            variant="link"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? (
              <RiFilterOffLine className="text-lg mr-1.5" />
            ) : (
              <RiFilterLine className="text-lg mr-1.5" />
            )}
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
                // style={{width: "50%"}}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="name">Name:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating">
              <input
                type="text"
                id="city"
                className="form-control"
                // style={{width: "50%"}}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="city">City:</Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating">
              <Select
                id="countryId"
                onChange={(e) => setCountryId(e.target.value)}
                value={countryId}
              >
                <option value="">Select Country</option>
                {countryList &&
                  countryList.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
              </Select>
              <Label className="filter-label" htmlFor="countryId">
                Country Name:
              </Label>
            </Group>
            <Group className="col-sm-6 col-md-2 form-floating">
              <Select id="stateId" onChange={(e) => setStateId(e.target.value)}
              value={stateId}
              >
                <option value="">Select State</option>
                {statesList &&
                  statesList.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
              </Select>
              <Label className="filter-label" htmlFor="stateId">
                State Name:
              </Label>
            </Group>
          </div>
        </div>
      )}
      <div className="flex toolbar">
        {hasPermission(CAN_USER_CREATE_CUSTOMER) ? (
          <CustomersFormAction
            type="add"
            queryClient={queryClient}
            selectedCompanyId={selectedCompanyId}
            countryList={countryList}
          />
        ) : null}
        <Pagination type="inBox" pageNumber={pageNumber} pageSize={pageSize} noPage={noPage} setPageNumber={setPageNumber} setPageSize={setPageSize} setNoPage={setNoPage} totalSize={totalSize} />
      </div>
      <Table table={table} isLoading={isLoading} />
      <Pagination pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} totalSize={totalSize} />
    </div>
  );
};

export default Customers;

import React, { useState, useEffect } from "react";
import { Header } from "../components";
import { Form } from "react-bootstrap";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table from "components/Table";
import Loader from "components/Loader";
import ExchangeRateFormAction from "components/Forms/ExchangeRateFormAction";
import ExchangeRateFormDelete from "components/Forms/ExchangeRateFormDelete";
import { useExchangeRate, useCurrency } from "api/useApi";
import { useDebounce } from "@uidotdev/usehooks";

const { Group, Select } = Form;

const ExchangeRate = (props) => {
  const { queryClient } = props;
  const [isLoading, setIsLoading] = useState(true);

  const [currencyId, setCurrencyId] = useState("");
  const dbCurrencyId = useDebounce(currencyId, 600);

  const { data: currencyList } = useCurrency();
  const { data: exchangeRateList, isLoading: spinLoading } = useExchangeRate(dbCurrencyId);

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("currencyName", {
      header: "Currency Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("rate", {
      //   header: "Currency Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: () => "Action",
      width: 200,
      cell: (info) => (
        <div className="actionEditDelete">
          <ExchangeRateFormAction
            type="edit"
            queryClient={queryClient}
            exchangeRateRow={info.row.original}
            currencyList={currencyList}
          />
          <ExchangeRateFormDelete
            type="delete"
            queryClient={queryClient}
            exchangeRateRow={info.row.original}
          />
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: exchangeRateList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Master" title="Exchange Rate" />
      <div className="toolbar">
        <ExchangeRateFormAction
          type="add"
          queryClient={queryClient}
          currencyList={currencyList}
        />
        <Group className="pageSize" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "10px" }}>
          <p className="font-semibold" style={{ paddingRight: "5px" }} >Currency: </p>
          <Select
            id="currencyId"
            onChange={(e) => setCurrencyId(e.target.value)}
            value={currencyId}
            style={{ paddingLeft: "10px" }}
          >
            <option value="">All</option>
            {currencyList &&
              currencyList.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.name}
                </option>
              ))}
          </Select>
          {/* <Label className="filter-label" htmlFor="currencyId">Currency Name:</Label> */}
        </Group>
      </div>
      <Table table={table} isLoading={isLoading} />
    </div>
  );
};

export default ExchangeRate;

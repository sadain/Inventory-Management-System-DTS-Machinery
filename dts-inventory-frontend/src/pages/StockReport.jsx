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
import { FiChevronDown } from "react-icons/fi";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { format, parseISO } from "date-fns";
import { useStockReport, useStockReportExport, useProducts } from "api/useApi";
import Pagination from "components/Pagination";
import { useDebounce } from "@uidotdev/usehooks";
import { SiMicrosoftexcel } from "react-icons/si";
import { saveAs } from 'file-saver';
import { Oval } from 'react-loader-spinner';

const { Group, Label, Select } = Form;

const StockReport = (props) => {
  const { selectedCompanyId } = props;
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [spinLoadingExport, setSpinLoadingExport] = useState(false);

  const [product, setProduct] = useState("");
  // const [companyId, setCompanyId] = useState("");
  const [noPage, setNoPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dbProduct = useDebounce(product, 600);
  const dbNoPage = useDebounce(noPage, 600);
  const dbPageNumber = useDebounce(pageNumber, 600);
  const dbPageSize = useDebounce(pageSize, 600);

  const { data: productsList } = useProducts("", "", "", selectedCompanyId, "true");
  const { data: stockReportsList, isLoading: spinLoading } = useStockReport(dbProduct, selectedCompanyId, dbNoPage, dbPageNumber, dbPageSize);

  const { totalSize } = stockReportsList || {};

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
    columnHelper.accessor("product", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("productModel", {
      header: "Product Model",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("productHSN", {
      header: "Product HSN",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("productPurpose", {
      header: "Product Purpose",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("purchaseQty", {
      header: "Purchase Quantity",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("salesQty", {
      header: "Sales Quantity",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("dispatchQty", {
      header: "Dispatch Quantity",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("stock", {
      header: "stock",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("unitPrice", {
      header: "Unit Price",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("stockValue", {
      header: "Stock Value",
      cell: (info) => formatCurrency(info.getValue()),
    }),
  ];

  const table = useReactTable({
    data: stockReportsList?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // const handleDropDownProductChange = (selected) => {
  //   if (selected[0]) {
  //     setProduct(selected[0].id);
  //   } else {
  //     setProduct("");
  //   }
  // };

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <div className="card-header">
        <Header category="Report" title="Stock Report" />
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
          <div className="row">
            <Group className="col-sm-6 col-md-4 form-floating">
              <input
                type="text"
                id="inputProducts"
                className="form-control"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
              <span className="highlight"></span>
              <Label htmlFor="inputProducts">Product</Label>
            </Group>
          </div>
        </div>
      )}
      <div className="toolbar">
        <Button
          variant="link"
          className="btn-toolbar"
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => setIsExporting(true)}
          disabled={spinLoadingExport}
        >
          {spinLoadingExport ? (
            <>
              <Oval color="#e3165b" height={20} width={20} />
              Exporting...
            </>
          ) : (
            <>
              <SiMicrosoftexcel className="text-l mr-1" />
              Export
            </>
          )}
        </Button>
        {isExporting ?
          <ExportData
            product={dbProduct}
            companyId={selectedCompanyId}
            setSpinLoadingExport={setSpinLoadingExport}
            setIsExporting={setIsExporting}
          />
          : null
        }
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Pagination type="inBox" pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} setPageSize={setPageSize} setNoPage={setNoPage} totalSize={totalSize} />
        </div>
      </div>
      <Table table={table} isLoading={isLoading} />
      <Pagination pageNumber={pageNumber} pageSize={pageSize} setPageNumber={setPageNumber} totalSize={totalSize} />
    </div>
  );
};

export const ExportData = ({ product, companyId, setSpinLoadingExport, setIsExporting }) => {
  const [isLoadingExport, setIsLoadingExport] = useState(true);
  const { data: stockReportExportList, isLoading: spinLoadingExport } = useStockReportExport(product, companyId, "true");

  setSpinLoadingExport(spinLoadingExport);

  useEffect(() => {
    async function downloadCSV() {
      try {
        setIsLoadingExport(true);
        const blob = new Blob([stockReportExportList], { type: 'application/octet-stream' });
        const currentDate = format(new Date(), 'dd-MM-yyyy');
        const filename = `Stock-Report-${currentDate}.csv`;
        saveAs(blob, filename);
      } catch (error) {
        console.error('Error exporting data:', error);
      } finally {
        setIsLoadingExport(false);
        setSpinLoadingExport(false);
      }
    }

    if (!spinLoadingExport) {
      downloadCSV();
      setSpinLoadingExport(false);
      setIsExporting(false);
    }
  }, [stockReportExportList]);

  return;
}

export default StockReport;

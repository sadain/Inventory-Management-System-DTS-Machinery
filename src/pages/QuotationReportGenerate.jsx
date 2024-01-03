import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import Loader from "components/Loader";
import { format, parseISO } from 'date-fns';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { MdOutlinePictureAsPdf } from 'react-icons/md';
import { useCompanyView, useQuotationsView } from "api/useApi";
import { useParams } from "react-router-dom";
import logo from "../data/dtslogo.png";

const QuotationReportGenerate = (props) => {
  const { selectedCompanyId } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  let params = useParams();

  const { data: quotationList, isLoading: spinLoading } = useQuotationsView(params.id);

  const hasCGSTRate = quotationList?.quotationRecords.every(
    (record) => record.cgstRate === 0 || record.cgstRate === null
  );

  const hasSGSTRate = quotationList?.quotationRecords.every(
    (record) => record.sgstRate === 0 || record.sgstRate === null
  );

  const hasIGSTRate = quotationList?.quotationRecords.every(
    (record) => record.igstRate === 0 || record.igstRate === null
  );

  const { data: companyList } = useCompanyView(selectedCompanyId);

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

  const cgstConditions = !hasCGSTRate;
  const sgstConditions = !hasSGSTRate;
  const igstConditions = !hasIGSTRate;

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("serialNumber", {
      header: "Serial No",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("product.name", {
      header: "Product Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("product.model", {
      header: "Product Model",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("product.picture", {
      header: "Product Picture",
      cell: (info) => (
        <div className="product-picture-cell">
          <img src={info.getValue() ? info.getValue() : ""} alt="Product" className="report-Picture" />
        </div>
      ),
    }),
    columnHelper.accessor("quantity", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("unitPrice", {
      header: "Unit Price",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("totalPrice", {
      header: "Total Price",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    //   ...(cgstConditions
    //     ? [
    //       columnHelper.accessor("cgstRate", {
    //         header: () => "CGST Rate",
    //         cell: (info) => info.getValue(),
    //       }),
    //       columnHelper.accessor("cgstValue", {
    //         header: () => "CGST Value",
    //         cell: (info) => formatCurrency(info.getValue()),
    //       }),
    //     ]
    //     : []),
    //   ...(sgstConditions
    //     ? [
    //       columnHelper.accessor("sgstRate", {
    //         header: () => "SGST Rate",
    //         cell: (info) => info.getValue(),
    //       }),
    //       columnHelper.accessor("sgstValue", {
    //         header: () => "SGST Value",
    //         cell: (info) => formatCurrency(info.getValue()),
    //       }),
    //     ]
    //     : []),
    //   ...(igstConditions
    //     ? [
    //       columnHelper.accessor("igstRate", {
    //         header: () => "IGST Rate",
    //         cell: (info) => info.getValue(),
    //       }),
    //       columnHelper.accessor("igstValue", {
    //         header: () => "IGST Value",
    //         cell: (info) => formatCurrency(info.getValue()),
    //       }),
    //     ]
    //     : []),
    //   ...(cgstConditions || sgstConditions || igstConditions
    //     ? [
    //       columnHelper.accessor("total", {
    //         header: "Total",
    //         cell: (info) => formatCurrency(info.getValue()),
    //       }),
    //     ]
    //     : []),
  ];

  const tableData = quotationList?.quotationRecords.map((record, index) => ({
    ...record,
    serialNumber: index + 1,
  }));

  const table = useReactTable({
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!quotationList || !companyList) {
    return <div className="loader" >Some data is not available.</div>;
  }

  const { customer, quotationNo, quotationDate, currency, quotationRecords, remarks } = quotationList;

  const calculateCGSTValue = () => {
    let cgstValue = 0;
    quotationList.quotationRecords.forEach((record) => {
      cgstValue += record.cgstValue;
    });
    return cgstValue;
  };
  const calculateSGSTValue = () => {
    let sgstValue = 0;
    quotationList.quotationRecords.forEach((record) => {
      sgstValue += record.sgstValue;
    });
    return sgstValue;
  };
  const calculateIGSTValue = () => {
    let igstValue = 0;
    quotationList.quotationRecords.forEach((record) => {
      igstValue += record.igstValue;
    });
    return igstValue;
  };
  const calculateTotal = () => {
    let total = 0;
    quotationList.quotationRecords.forEach((record) => {
      total += record.totalPrice;
    });
    return total;
  };
  const calculateOveralTotal = () => {
    let total = 0;
    quotationList.quotationRecords.forEach((record) => {
      total += record.total;
    });
    return total;
  };

  let distinctCGSTRates = new Set();
  let distinctSGSTRates = new Set();
  let distinctIGSTRates = new Set();

  quotationList?.quotationRecords.forEach((record) => {
    if (record.cgstRate) distinctCGSTRates.add(record.cgstRate);
    if (record.sgstRate) distinctSGSTRates.add(record.sgstRate);
    if (record.igstRate) distinctIGSTRates.add(record.igstRate);
  });

  const SimilarCGSTRate = distinctCGSTRates.size === 1 ? [...distinctCGSTRates][0] : null;
  const SimilarSGSTRate = distinctSGSTRates.size === 1 ? [...distinctSGSTRates][0] : null;
  const SimilarIGSTRate = distinctIGSTRates.size === 1 ? [...distinctIGSTRates][0] : null;

  // const showSGST = sgstConditions && sgstConditions.length > 0;
  // const showCGST = cgstConditions && cgstConditions.length > 0;
  // const showIGST = igstConditions && igstConditions.length > 0;
  // const colSpanValue = 7 + (showSGST ? 2 : 0) + (showCGST ? 2 : 0) + (showIGST ? 2 : 0);

  const handlePrint = () => {
    document.body.classList.add("print-only");
    const printContents = document.getElementById("pdf-content").innerHTML;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = printContents;

    document.body.appendChild(tempDiv);
    window.print();

    document.body.removeChild(tempDiv);
    document.body.classList.remove("print-only");
  };

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Header category="Transaction" title="Quotation Report" />
        <Button onClick={handlePrint} variant="link" className="form-btn" style={{ display: "flex", alignItems: "center", }}>
          <MdOutlinePictureAsPdf className="text-lg mr-1.5" />
          <span>Print</span>
        </Button>
      </div>
      <div id="pdf-content" className="report-body"
      // style={{ fontSize: "12px" }}
      >
        <div style={{height: "auto", overflowY: "auto" }}>
          <table className="table table-bordered table-responsive" style={{ border: "1px #eaecef", textAlign: "center" }} >
            <tbody>
              <tr>
                <td colSpan="7">
                  <div>
                  <img src={logo} alt="DTS" style={{ width: "10%", height: "fit-content", display: "inline", marginBottom: "20px" }} />
                    <h1 className="report-title" ><span>{companyList.name}</span></h1>
                    <p className="report-head-content">{companyList.address}</p>
                    <p className="report-head-content">GST IN: {companyList.gstIn} IEC Number: {companyList.iecNo}</p>
                    <p className="report-head-content">Mobile: {companyList.phone}</p>
                  </div>
                </td>
              </tr>
              <tr><td colSpan="7">
                <div className="report-center" >
                  <h1 className="report-title"><span>QUOTATION</span></h1>
                </div>
              </td></tr>
              <tr><td colSpan="4">
                <div className="report-detail">
                  <p className="text"><span>Customer Name: </span>{customer.name}</p>
                  <p className="text"><span>Phone No: </span>{customer.phone}</p>
                </div>
              </td><td colSpan="3">
                  <div className="report-detail">
                    <p className="text"><span>Quotation No: </span>{quotationNo}</p>
                    <p className="text"><span>Quotation Date: </span>{quotationDate ? format(parseISO(quotationDate), "dd-MM-yyyy") : ""}</p>
                    <p className="text"><span>Currency: </span>{currency}</p>
                  </div>
                </td></tr>
            </tbody>

            <tbody style={{ textTransform: "capitalize", border: "1px #eaecef" }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} style={{ textTransform: "capitalize", border: "1px #eaecef" }}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} style={{ width: header.width }} >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </tbody>
            <tbody style={{ border: "1px #eaecef"}}>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ width: cell.column.width }} className="quotation-td">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan="4" rowSpan="5"></td>
                <td colSpan="2">Total:</td>
                <td>{formatCurrency(calculateTotal())}</td>
                {/* <td colSpan="0"></td> */}
                {/* {cgstConditions || sgstConditions || igstConditions ? (<td colSpan={colSpanValue} style={{ width: "100%", textAlign: "right" }}>{formatCurrency(calculateOveralTotal())}</td>) : ("")} */}
              </tr>
              {cgstConditions ? (
                <tr>
                  <td>ADD: CGST</td>
                  <td>{SimilarCGSTRate ? (`${SimilarCGSTRate}%`) : ("")}</td>
                  <td>{formatCurrency(calculateCGSTValue())}</td>
                </tr>
              ) : ("")}
              {sgstConditions ? (
                <tr>
                  <td>ADD: SGST</td>
                  <td>{SimilarSGSTRate ? (`${SimilarSGSTRate}%`) : ("")}</td>
                  <td>{formatCurrency(calculateSGSTValue())}</td>
                </tr>
              ) : ("")}
              {igstConditions ? (
                <tr>
                  <td>ADD: IGST</td>
                  <td>{SimilarIGSTRate ? (`${SimilarIGSTRate}%`) : ("")}</td>
                  <td>{formatCurrency(calculateIGSTValue())}</td>
                </tr>
              ) : ("")}
              <tr>
                <td colSpan="2">Grand Total:</td>
                <td>{formatCurrency(calculateOveralTotal())}</td>
              </tr>
            </tbody>
            <tbody>
              {/* <div className="report-detail"> */}
                <tr>
                  {remarks ? (
                    <td colSpan="7" style={{ textAlign: "left" }}>
                      <>
                        <h1 className="report-title" ><span>Remarks:</span></h1>
                        {remarks.split('\n').map((remark, index) => (
                          <p className="text" key={index}>{remark}</p>
                        ))}
                      </> 
                    </td>
                  ) : ""}
                </tr>
                <tr><td colSpan="7" style={{ textAlign: "left " }}>
                  <h1 className="report-title"><span>Customer's confirmation (Please sign back):</span></h1>
                </td></tr>
              {/* </div> */}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
};

export default QuotationReportGenerate;

import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import Loader from "components/Loader";
import { format, parseISO } from "date-fns";
import { Container, Row, Col, Button } from "react-bootstrap";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import { useProformaInvoiceView, useCompanyView, useCompanyBanks } from "api/useApi"
import { useParams } from "react-router-dom";

const ProformaReportGenerate = (props) => {
  const { selectedCompanyId } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  let params = useParams();

  const { data: proformaInvoiceList, isLoading: spinLoading } = useProformaInvoiceView(params.id);

  const hasCGSTRate = proformaInvoiceList?.proformaInvoiceRecords.every(
    (record) => record.cgstRate === 0 || record.cgstRate === null
  );

  const hasSGSTRate = proformaInvoiceList?.proformaInvoiceRecords.every(
    (record) => record.sgstRate === 0 || record.sgstRate === null
  );

  const hasIGSTRate = proformaInvoiceList?.proformaInvoiceRecords.every(
    (record) => record.igstRate === 0 || record.igstRate === null
  );

  const { data: companyList } = useCompanyView(selectedCompanyId);
  const { data: companyBankList } = useCompanyBanks(selectedCompanyId);

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
      header: "Serial Number",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("product.name", {
      header: "Product Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("quantity", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("unitPrice", {
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("totalPrice", {
      cell: (info) => formatCurrency(info.getValue()),
    }),
    // ...(cgstConditions
    //   ? [
    //     columnHelper.accessor("cgstRate", {
    //       header: () => "CGST Rate",
    //       cell: (info) => info.getValue(),
    //     }),
    //     columnHelper.accessor("cgstValue", {
    //       header: () => "CGST Value",
    //       cell: (info) => formatCurrency(info.getValue()),
    //     }),
    //   ]
    //   : []),
    // ...(sgstConditions
    //   ? [
    //     columnHelper.accessor("sgstRate", {
    //       header: () => "SGST Rate",
    //       cell: (info) => info.getValue(),
    //     }),
    //     columnHelper.accessor("sgstValue", {
    //       header: () => "SGST Value",
    //       cell: (info) => formatCurrency(info.getValue()),
    //     }),
    //   ]
    //   : []),
    // ...(igstConditions
    //   ? [
    //     columnHelper.accessor("igstRate", {
    //       header: () => "IGST Rate",
    //       cell: (info) => info.getValue(),
    //     }),
    //     columnHelper.accessor("igstValue", {
    //       header: () => "IGST Value",
    //       cell: (info) => formatCurrency(info.getValue()),
    //     }),
    //   ]
    //   : []),
    // ...(cgstConditions || sgstConditions || igstConditions
    //   ? [
    //     columnHelper.accessor("total", {
    //       header: "Total",
    //       cell: (info) => formatCurrency(info.getValue()),
    //     }),
    //   ]
    //   : []),
  ];

  const tableData = proformaInvoiceList?.proformaInvoiceRecords.map(
    (record, index) => ({
      ...record,
      serialNumber: index + 1,
    })
  );

  const table = useReactTable({
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <Loader />;
  }

  const { proformaInvoiceNo, customer, quotationDate, otherCharges, otherChargesDescription } = proformaInvoiceList;

  // if (!proformaInvoiceList || !companyList || !companyBankList || companyBankList.length === 0) {
  //   return <div className="loader" >Some data is not available.</div>;
  // }

  // const companyBank = companyBankList[0];

  const calculateCGSTValue = () => {
    let cgstValue = 0;
    proformaInvoiceList?.proformaInvoiceRecords.forEach((record) => {
      cgstValue += record.cgstValue;
    });
    return cgstValue;
  };
  const calculateSGSTValue = () => {
    let sgstValue = 0;
    proformaInvoiceList?.proformaInvoiceRecords.forEach((record) => {
      sgstValue += record.sgstValue;
    });
    return sgstValue;
  };
  const calculateIGSTValue = () => {
    let igstValue = 0;
    proformaInvoiceList?.proformaInvoiceRecords.forEach((record) => {
      igstValue += record.igstValue;
    });
    return igstValue;
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    proformaInvoiceList?.proformaInvoiceRecords.forEach((record) => {
      totalPrice += record.totalPrice;
    });
    return totalPrice;
  };
  const calculateTotal = () => {
    let total = 0;
    proformaInvoiceList?.proformaInvoiceRecords.forEach((record) => {
      total += record.total;
    });
    return total;
  };

  // const calculateGST = () => {
  //   const total = calculateTotal();
  //   const gst = (total * 18) / 100;
  //   return gst;
  // };

  let distinctCGSTRates = new Set();
  let distinctSGSTRates = new Set();
  let distinctIGSTRates = new Set();

  proformaInvoiceList?.proformaInvoiceRecords.forEach((record) => {
    if (record.cgstRate) distinctCGSTRates.add(record.cgstRate);
    if (record.sgstRate) distinctSGSTRates.add(record.sgstRate);
    if (record.igstRate) distinctIGSTRates.add(record.igstRate);
  });

  const SimilarCGSTRate = distinctCGSTRates.size === 1 ? [...distinctCGSTRates][0] : null;
  const SimilarSGSTRate = distinctSGSTRates.size === 1 ? [...distinctSGSTRates][0] : null;
  const SimilarIGSTRate = distinctIGSTRates.size === 1 ? [...distinctIGSTRates][0] : null;

  const showSGST = sgstConditions;
  const showCGST = cgstConditions;
  const showIGST = igstConditions;
  const rowSpanValue = 3 + (showSGST ? 1 : 0) + (showCGST ? 1 : 0) + (showIGST ? 1 : 0);

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

  const grandTotal = calculateTotal() + otherCharges;

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}
      >
        <Header category="Transaction" title="Proforma Invoice Report" />
        <Button onClick={handlePrint} variant="link" className="form-btn" style={{ display: "flex", alignItems: "center" }}
        >
          <MdOutlinePictureAsPdf className="text-lg mr-1.5" />
          <span>Print</span>
        </Button>
      </div>
      <div id="pdf-content" className="report-body"
      // style={{ fontSize: "12px" }}
      >
        <div style={{
          // fontSize: "9px", 
          height: "auto", overflowY: "auto"
        }}>
          <table className="table table-bordered table-responsive" style={{ border: "1px #eaecef", textAlign: "center" }} >
            <tbody>
              <tr>
                <td colSpan="5">
                  <h1 className="report-title" ><span>PROFORMA INVOICE</span></h1>
                </td>
              </tr>
              <tr><td colSpan="3">
                <div className="report-detail">
                  <p className="report-title"><span>Seller Details: </span></p>
                  <p className="text"><span>Name: </span>{companyList?.name}</p>
                  <p className="text"><span>Address: </span>{companyList?.address}</p>
                  <p className="text"><span>GST IN: </span>{companyList?.gstIn}</p>
                  <p className="text"><span>IEC Number: </span>{companyList?.iecNo}</p>
                  <p className="text"><span>Mobile: </span>{companyList?.phone}</p>
                </div>
              </td>
                <td colSpan="2">
                  <div className="report-detail">
                    <p className="report-title"><span>Buyer (Bill to):</span></p>
                    <p className="text"><span>Customer Name: </span>{customer.name}</p>
                    <p className="text"><span>Address: </span>{customer.address}, {customer.city} - {customer.postalCode}, {customer.state}, {customer.country} </p>
                    <p className="text"><span>Phone No: </span>{customer.phone}</p>
                    <p className="text"><span>Fax No: </span>{customer.fax}</p>
                  </div>
                </td>
              </tr>
              <tr><td colSpan="5">
                <div className="report-detail">
                  <p className="text"><span>Proforma Invoice No: </span>{proformaInvoiceNo}</p>
                  <p className="text"><span>Proforma Invoice Date: </span>{quotationDate ? format(parseISO(quotationDate), "dd-MM-yyyy") : ""}</p>
                </div>
              </td></tr>
            </tbody>
            <tbody style={{ textTransform: "capitalize", border: "1px #eaecef" }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
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
            <tbody style={{ border: "1px #eaecef" }}>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ width: cell.column.width }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td colSpan="2" rowSpan={rowSpanValue}></td>
                <td colSpan="2">Total:</td>
                <td>{formatCurrency(calculateTotalPrice())}</td>
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
              {/* <tr>
                <td colSpan="2">GST 18%:</td>
                <td>{formatCurrency(calculateGST())}</td>
              </tr> */}
              <tr>
                <td colSpan="2">{otherChargesDescription ? otherChargesDescription : "Other Charges"}:</td>
                <td>{formatCurrency(otherCharges)}</td>
              </tr>
              <tr>
                <td colSpan="2">Grand Total:</td>
                <td>{formatCurrency(grandTotal)}</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
              {companyBankList && companyBankList.length > 0 ? (
                  <td colSpan="3">
                    <div className="report-detail">
                      <h1 className="report-title"><span>Bank Details For Payment:</span></h1>
                      <p className="text"><span>Account Name: </span>{companyBankList[0]?.accountName}</p>
                      <p className="text"><span>Bank Name: </span>{companyBankList[0]?.bankName}</p>
                      <p className="text"><span>Bank Branch: </span>{companyBankList[0]?.bankBranch}</p>
                      <p className="text"><span>Account Number: </span>{companyBankList[0]?.accountNumber}</p>
                      <p className="text"><span>Ifsc Code: </span>{companyBankList[0]?.ifscCode}</p>
                      <p className="text"><span>Swift Code: </span>{companyBankList[0]?.swiftCode}</p>
                    </div>
                  </td>
                ) : ("")}
                <td colSpan="2">
                  <div className="report-detail">
                    <h1 className="report-title"><span>Remark:</span></h1>
                    <p className="text">1. The warranty period for new machines is one year.</p>
                    <p className="text">2. Payment Terms:  T/T payment 100% advance</p>
                    <p className="text">3. Delivery Terms: Exworks Ambur</p>
                  </div>
                </td>
              </tr>
              <tr><td colSpan="5">
                <div className="report-detail">
                  <h1 className="report-title"><span>Customer's confirmation (Please sign back):</span></h1>
                </div>
              </td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProformaReportGenerate;

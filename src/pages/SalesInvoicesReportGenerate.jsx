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
import { useCompanyView, useCompanyBanks, useSalesInvoiceView, usePurchaseOrders, usePurchaseOrdersView, useCustomerView, useCustomer } from "api/useApi";
import { useParams } from "react-router-dom";
import dtsSign from "../data/dtsSign.png"
import dtsStamp from "../data/dtsStamp.png"

const SalesInvoicesReportGenerate = (props) => {
  const { selectedCompanyId } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  let params = useParams();

  const { data: salesInvoiceList, isLoading: spinLoading } = useSalesInvoiceView(params.id);
  const { data: companyList } = useCompanyView(selectedCompanyId);
  const { data: companyBankList } = useCompanyBanks(selectedCompanyId);
  const { data: purchaseOrderList } = usePurchaseOrders("", "", "", "", "", "", selectedCompanyId, "true");
  const { data: customerList } = useCustomer("", "", "", "", selectedCompanyId, "true");
  const { poNumber } = salesInvoiceList || {};

  const filterByPurchaseOrderId = purchaseOrderList
    ? purchaseOrderList?.items.find((item) => item.id === poNumber)?.id
    : "";

  const { data: purchaseOrderViewList } = usePurchaseOrdersView(filterByPurchaseOrderId);

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  // useEffect(() => {
  //   setIsLoading(spinLoading1);
  // }, [spinLoading1]);

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

  const customRoundValue = (value) => {
    const decimalPart = value - Math.floor(value);
    const roundedValue = decimalPart >= 0.5 ? Math.ceil(value) : Math.floor(value);
    return roundedValue;
  };

  const hasCGSTRate = salesInvoiceList?.salesInvoiceRecords.every(
    (record) => record.cgstRate === 0 || record.cgstRate === null
  );

  const hasSGSTRate = salesInvoiceList?.salesInvoiceRecords.every(
    (record) => record.sgstRate === 0 || record.sgstRate === null
  );

  const hasIGSTRate = salesInvoiceList?.salesInvoiceRecords.every(
    (record) => record.igstRate === 0 || record.igstRate === null
  );

  const cgstConditions = !hasCGSTRate;
  const sgstConditions = !hasSGSTRate;
  const igstConditions = !hasIGSTRate;

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("serialNumber", {
      header: "No.",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("product.name", {
      header: "Name of Product",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("product.model", {
      header: "Model",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("product.hsn", {
      header: "HSN",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("quantity", {
      header: "Qty",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("rate", {
      cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
    }),
    columnHelper.accessor("amount", {
      cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
    }),
    columnHelper.accessor("discount", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("taxableValue", {
      header: "Taxable Value",
      cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
    }),
    // columnHelper.accessor("cgstRate", {
    //   header: "CGST Rate",
    //   cell: (info) => info.getValue(),
    // }),
    // columnHelper.accessor("cgstValue", {
    //   header: "CGST Value",
    //   cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
    // }),
    // columnHelper.accessor("sgstRate", {
    //   header: "SGST Rate",
    //   cell: (info) => info.getValue(),
    // }),
    // columnHelper.accessor("sgstValue", {
    //   header: "SGST Value",
    //   cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
    // }),
    // columnHelper.accessor("igstRate", {
    //   header: "IGST Rate",
    //   cell: (info) => info.getValue(),
    // }),
    // columnHelper.accessor("igstValue", {
    //   header: "IGST Value",
    //   cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
    // }),
    // columnHelper.accessor("total", {
    //   cell: (info) => info.getValue() ? formatCurrency(info.getValue()) : "",
    // })
  ];

  const tableData = salesInvoiceList?.salesInvoiceRecords.map(
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

  // if (!salesInvoiceList || !companyList || !customerList?.items) {
  //   return <div className="loader">Some data is not available.</div>;
  // }

  // if (!companyBankList || companyBankList.length === 0) {
  //   return;
  // }

  // const companyBank = companyBankList[0];

  const { customer, shipToCustomerId, invoiceNo, invoiceDate, stateName, stateCode, transportationMode, vehicleNo, dateOfSupply, placeOfSupply, otherCharges, otherChargesDescription, deliveryAddress, deliveryAddressCity, deliveryAddressState, deliveryAddressCountry, deliveryAddressPostalCode } = salesInvoiceList || {};

  const selectedShiptoCustomerList = customerList?.items?.find((customer) => customer.id === shipToCustomerId);

  const getDeliveryAddress = () => {
    if (deliveryAddress && deliveryAddressCity && deliveryAddressState && deliveryAddressCountry && deliveryAddressPostalCode) {
      return {
        address: deliveryAddress,
        city: deliveryAddressCity,
        state: deliveryAddressState,
        country: deliveryAddressCountry,
        postalCode: deliveryAddressPostalCode,
      };
    } else {
      return {
        address: customer.address,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        postalCode: customer.postalCode,
      };
    }
  };

  const deliveryAddressDetails = getDeliveryAddress();

  const calculateQuantity = () => {
    let totalQuantity = 0;
    salesInvoiceList?.salesInvoiceRecords.forEach((record) => {
      totalQuantity += record.quantity;
    });
    return totalQuantity;
  };
  const calculateRate = () => {
    let totalRate = 0;
    salesInvoiceList?.salesInvoiceRecords.forEach((record) => {
      totalRate += record.rate;
    });
    return totalRate;
  };
  const calculateAmount = () => {
    let totalAmount = 0;
    salesInvoiceList?.salesInvoiceRecords.forEach((record) => {
      totalAmount += record.amount;
    });
    return totalAmount;
  };
  const calculateDiscount = () => {
    let totalDiscount = 0;
    salesInvoiceList?.salesInvoiceRecords.forEach((record) => {
      totalDiscount += record.discount;
    });
    return totalDiscount;
  };
  const calculateTaxableValue = () => {
    let totalTaxableValue = 0;
    salesInvoiceList?.salesInvoiceRecords.forEach((record) => {
      totalTaxableValue += record.taxableValue;
    });
    return totalTaxableValue;
  };
  const calculateCGSTValue = () => {
    let totalCgstValue = 0;
    salesInvoiceList?.salesInvoiceRecords.forEach((record) => {
      totalCgstValue += record.cgstValue;
    });
    return totalCgstValue;
  };
  const calculateSGSTValue = () => {
    let totalSgstValue = 0;
    salesInvoiceList?.salesInvoiceRecords.forEach((record) => {
      totalSgstValue += record.sgstValue;
    });
    return totalSgstValue;
  };
  const calculateIGSTValue = () => {
    let totalIgstValue = 0;
    salesInvoiceList?.salesInvoiceRecords.forEach((record) => {
      totalIgstValue += record.igstValue;
    });
    return totalIgstValue;
  };

  const calculateTotal = () => {
    let total = 0;
    salesInvoiceList?.salesInvoiceRecords.forEach((record) => {
      total += parseFloat(record.total);
    });
    return total;
  };

  // const otherChargesGSt = otherCharges + (gst ? otherCharges * (gst / 100) : 0);

  // const grandTotal = parseFloat(calculateTotal()) + parseFloat(otherCharges);

  const grandTotal = calculateTotal() + otherCharges;

  let distinctCGSTRates = new Set();
  let distinctSGSTRates = new Set();
  let distinctIGSTRates = new Set();

  salesInvoiceList?.salesInvoiceRecords.forEach((record) => {
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
  const rowSpanValue = 1 + (showSGST ? 1 : 0) + (showCGST ? 1 : 0) + (showIGST ? 1 : 0);

  // const rawTotal = calculateTotal();
  // const grandTotal = parseFloat(rawTotal) + otherCharges;

  // const grandTotal = parseFloat(calculateTotal()) + otherCharges;

  // const convertNumberToWords = (num) => {
  //   if (num === 0) return 'Zero';

  //   const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  //   const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  //   const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  //   if (num < 10) {
  //     return units[num];
  //   } else if (num < 20) {
  //     return teens[num - 10];
  //   } else if (num < 100) {
  //     return tens[Math.floor(num / 10)] + ' ' + units[num % 10];
  //   } else if (num < 1000) {
  //     return units[Math.floor(num / 100)] + ' Hundred ' + convertNumberToWords(num % 100);
  //   } else if (num < 100000) {
  //     return convertNumberToWords(Math.floor(num / 1000)) + ' Thousand ' + convertNumberToWords(num % 1000);
  //   } else if (num < 10000000) {
  //     return convertNumberToWords(Math.floor(num / 100000)) + ' Lakh ' + convertNumberToWords(num % 100000);
  //   } else {
  //     return convertNumberToWords(Math.floor(num / 10000000)) + ' Crore ' + convertNumberToWords(num % 10000000);
  //   }
  // };

  const convertNumberToWords = (num) => {
    if (num === 0) return 'Zero';

    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    let result = '';

    if (num < 10) {
      result = units[num];
    } else if (num < 20) {
      result = teens[num - 10];
    } else if (num < 100) {
      result = tens[Math.floor(num / 10)] + ' ' + units[num % 10];
    } else if (num < 1000) {
      result = units[Math.floor(num / 100)] + ' Hundred';
      if (num % 100 !== 0) {
        result += ' and ' + convertNumberToWords(num % 100);
      }
    } else if (num < 100000) {
      result = convertNumberToWords(Math.floor(num / 1000)) + ' Thousand ' + convertNumberToWords(num % 1000);
    } else if (num < 10000000) {
      result = convertNumberToWords(Math.floor(num / 100000)) + ' Lakh ' + convertNumberToWords(num % 100000);
    } else {
      result = convertNumberToWords(Math.floor(num / 10000000)) + ' Crore ' + convertNumberToWords(num % 10000000);
    }

    return result.trim();
  };

  const grandTotalInWords = convertNumberToWords(Math.floor(grandTotal));

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
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}
      >
        <Header category="Transaction" title="Sales Invoice Report" />
        <Button onClick={handlePrint} variant="link" className="form-btn" style={{ display: "flex", alignItems: "center" }}
        >
          <MdOutlinePictureAsPdf className="text-lg mr-1.5" />
          <span>Print</span>
        </Button>
      </div>
      <div id="pdf-content" className="report-body"
      // style={{ fontSize: "14px" }}
      >
        <div style={{ height: "auto", overflowY: "auto" }}>
          <table className="table table-bordered table-responsive" style={{ border: "1px #eaecef", textAlign: "center" }}>
            <tbody>
              <tr>
                <td colSpan="9">
                  <h1 className="report-title"><span>TAX INVOICE</span></h1>
                </td>
              </tr>
              <tr>
                <td colSpan="5">
                  <div className="report-detail">
                    <h1 className="report-title"><span>From</span></h1>
                    <p className="text"><span>Name: </span>{companyList?.name}</p>
                    <p className="text"><span>Address: </span>{companyList?.address}</p>
                  </div>
                </td>
                <td colSpan="4">
                  <div className="report-detail">
                    <p className="text"><span>GST IN: </span>{companyList?.gstIn}</p>
                    <p className="text"><span>IEC Number: </span>{companyList?.iecNo}</p>
                    <p className="text"><span>Pan: </span>{companyList?.pan}</p>
                    <p className="text"><span>Mobile: </span>{companyList?.phone}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="5">
                  <div className="report-detail">
                    <h1 className="report-title" style={{ paddingTop: "5px" }}><span>Details of Receiver / Billed To</span></h1>
                    <p className="text"><span>Name : </span>{customer.name}</p>
                    <p className="text"><span>Address : </span>{customer.address}, {customer.city} - {customer.postalCode}, {customer.state}</p>
                    <p className="text"><span>State : </span>{customer.state}</p>
                    <p className="text"><span>GST NO : </span>{customer.gstNo}</p>
                  </div>
                </td>
                <td colSpan="4">
                  <div className="report-detail">
                    <h1 className="report-title" style={{ paddingTop: "5px" }}><span>Details of Consignee / Shipped To</span></h1>
                    {selectedShiptoCustomerList ? (
                      <>
                        <p className="text"><span>Name : </span>{selectedShiptoCustomerList.name}</p>
                        <p className="text"><span>Address : </span>{deliveryAddressDetails.address}, {deliveryAddressDetails.city}, {deliveryAddressDetails.state} - {deliveryAddressDetails.postalCode}</p>
                        <p className="text"><span>State : </span>{deliveryAddressDetails.state}</p>
                        <p className="text"><span>Gst No : </span>{selectedShiptoCustomerList.gstNo}</p>
                      </>
                    ) : (
                      <>
                        <p className="text"><span>Name : </span></p>
                        <p className="text"><span>Address : </span></p>
                        <p className="text"><span>State : </span></p>
                        <p className="text"><span>Gst No : </span></p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="5">
                  <div className="report-detail">
                    <p className="text"><span>Invoice No  : </span>{invoiceNo}</p>
                    <p className="text"><span>Invoice Date: </span>{invoiceDate ? format(parseISO(invoiceDate), "dd-MM-yyyy") : ""}</p>
                    <p className="text"><span>State       : </span>{stateName}</p>
                    <p className="text"><span>State Code  : </span>{stateCode}</p>
                  </div>
                </td>
                <td colSpan="4">
                  <div className="report-detail">
                    <p className="text"><span>Transportation Mode   : </span>{transportationMode}</p>
                    <p className="text"><span>Vehicle No            : </span>{vehicleNo}</p>
                    <p className="text"><span>Date of Supply        : </span>{dateOfSupply ? format(parseISO(dateOfSupply), "dd-MM-yyyy") : ""}</p>
                    <p className="text"><span>Place of Supply       : </span>{placeOfSupply}</p>
                    {purchaseOrderViewList ? (
                      <p className="text"><span>Purchase Order Number : </span> {purchaseOrderViewList.invoiceNo} /{" "} {purchaseOrderViewList.invoiceDate ? format(parseISO(purchaseOrderViewList.invoiceDate), "dd-MM-yyyy") : ""} </p>
                    ) : null}
                  </div>
                </td>
              </tr>
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
                <td colSpan="4">Total:</td>
                <td>{formatCurrency(calculateQuantity())}</td>
                <td>{formatCurrency(calculateRate())}</td>
                <td>{formatCurrency(calculateAmount())}</td>
                <td>{formatCurrency(calculateDiscount())}</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan="6" rowSpan={rowSpanValue}></td>
                <td colSpan="2">Total Amount before tax</td>
                <td>{formatCurrency(calculateTaxableValue())}</td>
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
                <td colSpan="6" style={{ fontWeight: "bold" }}>Total Amount in Words:  </td>
                <td colSpan="2">{otherChargesDescription ? otherChargesDescription : "Other Charges"}</td>
                <td>{formatCurrency(otherCharges)}</td>
              </tr>
              <tr>
                <td colSpan="6" style={{ textTransform: "capitalize" }}>Rupees {grandTotalInWords} Only</td>
                <td colSpan="2">Total Amount</td>
                <td>{formatCurrency(grandTotal)}</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                {companyBankList && companyBankList.length > 0 ? (
                <td colSpan="5">
                    <div className="report-detail">
                      <h1 className="report-title" ><span>Bank Details:</span></h1>
                      <p className="text"><span>Account Name: </span>{companyBankList[0]?.accountName}</p>
                      <p className="text"><span>Bank Name: </span>{companyBankList[0]?.bankName}</p>
                      <p className="text"><span>Bank Branch: </span>{companyBankList[0]?.bankBranch}</p>
                      <p className="text"><span>Account Number: </span>{companyBankList[0]?.accountNumber}</p>
                      <p className="text"><span>Ifsc Code: </span>{companyBankList[0]?.ifscCode}</p>
                      <p className="text"><span>Swift Code: </span>{companyBankList[0]?.swiftCode}</p>
                    </div>
                  </td>
                ) : ("")}
                <td colSpan="4" rowSpan="2">
                  <div className="report-detail" style={{ paddingTop: "20px" }}>
                    <h1 className="report-title" style={{ paddingTop: "5px", textAlign: "center" }}>Certified that the paticulars given above are true and correct</h1>
                    <h1 className="report-title" style={{ paddingTop: "5px", textAlign: "center" }}>For DTS MACHINERY AND TRADING PRIVATE LIMITED</h1>
                    <div className="stamp-container">
                      <img src={dtsStamp} alt="DTS Stamp" className="stamp-img" />
                      <img src={dtsSign} alt="DTS Sign" className="sign-img" />
                    </div>
                    <p className="text" style={{ paddingTop: "5px", textAlign: "center" }}>Authorised Signatory</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="5">
                  <h1 className="report-title" style={{ paddingTop: "5px" }}><span>Terms and Conditions</span></h1>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
};

export default SalesInvoicesReportGenerate;

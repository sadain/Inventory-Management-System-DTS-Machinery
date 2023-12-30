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
import { usePurchaseOrdersView, useCompanyView, useSupplierBanks } from "api/useApi";
import { useParams } from "react-router-dom";

const PurchaseOrdersReportGenerate = (props) => {
  const { selectedCompanyId } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  let params = useParams();

  const { data: purchaseOrderList, isLoading: spinLoading } = usePurchaseOrdersView(params.id);

  const { supplier, invoiceNo, invoiceDate } = purchaseOrderList || {};

  const { id } = supplier || {};
  
  const { data: supplierBankList } = useSupplierBanks(id);

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

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("serialNumber", {
      header: "No.",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("product.name", {
      header: "Material",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("product.model", {
      header: "Model",
      cell: (info) => info.getValue(),
    }),
    // columnHelper.accessor("color", {
    //   cell: (info) => info.getValue(),
    // }),
    columnHelper.accessor("product.hsn", {
      header: "HSN Code",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("unit", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("quantity", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("unitPrice", {
      header: "Uint Price",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("totalPrice", {
      header: "Total Amount",
      cell: (info) => formatCurrency(info.getValue()),
    }),
  ];

  const tableData = purchaseOrderList?.purchaseOrderRecords.map(
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



  // if (!purchaseOrderList || !companyList) {
  //   return <div className="loader" >Some data is not available.</div>;
  // }

  const calculateTotal = () => {
    let total = 0;
    purchaseOrderList?.purchaseOrderRecords.forEach((record) => {
      total += record.totalPrice;
    });
    return formatCurrency(total);
  };
  const calculateQuantity = () => {
    let totalQuantity = 0;
    purchaseOrderList?.purchaseOrderRecords.forEach((record) => {
      totalQuantity += record.quantity;
    });
    return totalQuantity;
  };

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
        <Header category="Transaction" title="Purchase Order Report" />
        <Button onClick={handlePrint} variant="link" className="form-btn" style={{ display: "flex", alignItems: "center" }}
        >
          <MdOutlinePictureAsPdf className="text-lg mr-1.5" />
          <span>Print</span>
        </Button>
      </div>
      <div id="pdf-content" className="report-body"
      // style={{ fontSize: "12px" }}
      >
        {/* <div>
          <h1 className="report-title" ><span>{supplier.name}</span></h1>
          <p className="report-head-content">{supplier.address}, {supplier.city} - {supplier.postalCode}, {supplier.state}, {supplier.country}</p>
          <p className="report-head-content">Phone No: {supplier.phone} Fax No: {supplier.fax} </p>
          <h1 className="report-title" style={{ paddingTop: "20px" }}><span>INVOICE</span></h1>
        </div>
        <Container>
          <Row>
            <Col>
              <div className="report-detail">
                <p className="text"><span>APPLICANT/IMPORTER: </span></p>
                <p className="text"><span>Name: </span>{companyList.name}</p>
                <p className="text"><span>Address: </span>{companyList.address}</p>
                {/* <p className="text">Thuthipet, Ambur - 635811, TN, India.</p> */}
        {/* <p className="text"><span>GST IN: </span>{companyList.gstIn}</p>
                <p className="text"><span>IEC Number: </span>{companyList.iecNo}</p>
                <p className="text"><span>Mobile: </span>{companyList.phone}</p> */}
        {/* <p className="text"><span>Tel: </span>+91 4174 242333</p> */}
        {/* </div>
            </Col>
            <Col> */}
        {/* <div className="report-detail">
                <p className="text"><span>Invoice No: </span>{invoiceNo}</p>
                <p className="text"><span>Invoice Date: </span>{invoiceDate ? format(parseISO(invoiceDate), "dd-MM-yyyy") : ""}</p>
              </div>
            </Col>
          </Row>
        </Container> */}
        <div style={{
          // fontSize: "9px", 
          height: "auto", overflowY: "auto"
        }}>
          <table className="table table-bordered table-responsive" style={{ border: "1px #eaecef", textAlign: "center" }}>
            <tbody>
              <tr><td colSpan="9">
                <div>
                  <h1 className="report-title" ><span>{supplier.name}</span></h1>
                  <p className="report-head-content">{supplier.address}, {supplier.city} - {supplier.postalCode}, {supplier.state}, {supplier.country}</p>
                  <p className="report-head-content">Phone No: {supplier.phone} Fax No: {supplier.fax} </p>
                </div>
              </td></tr>
              <tr><td colSpan="9">
                <h1 className="report-title"><span>INVOICE</span></h1>
              </td></tr>
              <tr>
                <td colSpan="5">
                  <div className="report-detail">
                    <p className="text"><span>APPLICANT / IMPORTER: </span></p>
                    <p className="text"><span>Name: </span>{companyList?.name}</p>
                    <p className="text"><span>Address: </span>{companyList?.address}</p>
                    {/* <p className="text">Thuthipet, Ambur - 635811, TN, India.</p> */}
                    <p className="text"><span>GST IN: </span>{companyList?.gstIn}</p>
                    <p className="text"><span>IEC Number: </span>{companyList?.iecNo}</p>
                    <p className="text"><span>Mobile: </span>{companyList?.phone}</p>
                    {/* <p className="text"><span>Tel: </span>+91 4174 242333</p> */}
                  </div>
                </td>
                <td colSpan="4">
                  <div className="report-detail">
                    <p className="text"><span>Invoice No: </span>{invoiceNo}</p>
                    <p className="text"><span>Invoice Date: </span>{invoiceDate ? format(parseISO(invoiceDate), "dd-MM-yyyy") : ""}</p>
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
                <td colSpan="5" style={{ width: "100%", textAlign: "center" }}>Total:</td>
                <td style={{ width: "100%", textAlign: "center" }}>{calculateQuantity()}</td>
                <td></td>
                <td style={{ width: "100%", textAlign: "center" }}>{calculateTotal()}</td>
              </tr>
            </tbody>
            {supplierBankList && supplierBankList.length > 0 ? (
              <tbody>
                <tr><td colSpan="9">
                  <div className="report-detail">
                    <h1 className="report-title"><span>Bank Details: </span></h1>
                    <p className="text"><span>Account Name: </span>{supplierBankList[0]?.accountName}</p>
                    <p className="text"><span>Bank Name: </span>{supplierBankList[0]?.bankName}</p>
                    <p className="text"><span>Bank Branch: </span>{supplierBankList[0]?.bankBranch}</p>
                    <p className="text"><span>Account Number: </span>{supplierBankList[0]?.accountNumber}</p>
                    <p className="text"><span>Ifsc Code: </span>{supplierBankList[0]?.ifscCode}</p>
                    <p className="text"><span>Swift Code: </span>{supplierBankList[0]?.swiftCode}</p>
                  </div>
                  {/* <SuppliersDetailsComponent supplier={supplier} /> */}
                </td></tr>
              </tbody>
            ) : ("")}
          </table>
        </div>
        {/* <Container>
          <Row>
            <Col>
            </Col>
            <Col></Col>
          </Row>
        </Container> */}
      </div>
    </div>
  )
}

export default PurchaseOrdersReportGenerate;

// export const SuppliersDetailsComponent = ({ supplier }) => {
//   const { id } = supplier;
//   const { data: supplierBankList } = useSupplierBanks(id);

//   // if (!supplierBankList || supplierBankList.length === 0) {
//   //   return <div></div>;
//   // }

//   // const supplierBank = supplierBankList[0];

//   return (
//     <>
//       {supplierBankList && supplierBankList.length > 0 ? (
//         <div className="report-detail">
//           <h1 className="report-title"><span>Bank Details: </span></h1>
//           <p className="text"><span>Account Name: </span>{supplierBankList[0]?.accountName}</p>
//           <p className="text"><span>Bank Name: </span>{supplierBankList[0]?.bankName}</p>
//           <p className="text"><span>Bank Branch: </span>{supplierBankList[0]?.bankBranch}</p>
//           <p className="text"><span>Account Number: </span>{supplierBankList[0]?.accountNumber}</p>
//           <p className="text"><span>Ifsc Code: </span>{supplierBankList[0]?.ifscCode}</p>
//           <p className="text"><span>Swift Code: </span>{supplierBankList[0]?.swiftCode}</p>
//         </div>
//       ) : ("")}
//     </>
//   );
// };

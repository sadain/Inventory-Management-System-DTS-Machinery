import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import Table from "components/Table";
import Loader from "components/Loader";
import { format, parseISO } from "date-fns";
import { Container, Row, Col, Button } from "react-bootstrap";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import { useDispatchChallansView, useCompanyView } from "api/useApi";
import { useParams } from "react-router-dom";

const DispatchChallanReportGenerate = (props) => {
  const { selectedCompanyId } = props || {};
  const [isLoading, setIsLoading] = useState(true);

  let params = useParams();

  const { data: dispatchChallanViewList, isLoading: spinLoading } = useDispatchChallansView(params.id);
  const { data: companyList } = useCompanyView(selectedCompanyId);

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

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
    columnHelper.accessor("modelNo", {
      header: "Model No",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("quantity", {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("remarks", {
      cell: (info) => info.getValue(),
    }),
  ];

  const tableData = dispatchChallanViewList?.dispatchRecords.map(
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

  // if (!dispatchChallanViewList || !companyList) {
  //   return <div className="loader" >Some data is not available.</div>;
  // }

  const { customer, dispatchNo, dispatchDate } = dispatchChallanViewList || {};

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
        <Header category="Transaction" title="Dispatch Challan Report" />
        <Button onClick={handlePrint} variant="link" className="form-btn" style={{ display: "flex", alignItems: "center" }}
        >
          <MdOutlinePictureAsPdf className="text-lg mr-1.5" />
          <span>Print</span>
        </Button>
      </div>
      <div id="pdf-content" className="report-body"
      // style={{ fontSize: "12px" }}
      >
        <div style={{ height: "auto", overflowY: "auto" }}>
          <table className="table table-bordered table-responsive" style={{ border: "1px #eaecef", textAlign: "center" }} >
            <tbody>
              <tr>
                <td colSpan="5">
                  <div className="flex-container" style={{display: "flex", justifyContent: "space-between"}}>
                      <p className="text" style={{textAlign: "left"}}><span>GSTIN: </span>{companyList?.gstIn}</p>
                      <p className="text" style={{textAlign: "right"}}><span>CIN: </span>{companyList?.cinNo}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="5">
                    <p className="report-title" style={{textAlign: "center"}}><span>DELIVERY CHALLAN</span></p>
                </td>
              </tr>
              <tr>
                <td colSpan="5">
                  <h1 className="report-title" ><span>{companyList?.name}</span></h1>
                  <p className="report-head-content">{companyList?.address}</p>
                  <p className="report-head-content"><span>Mobile: </span>{companyList?.phone}</p>
                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  <div className="report-detail">
                    <p className="text"><span>Customer Name: </span>{customer.name}</p>
                    <p className="text"><span>Address: </span>{customer.address}, {customer.city}, {customer.city} </p>
                    <p className="text"><span>Phone No: </span>{customer.phone}</p>
                    <p className="text"><span>Fax No: </span>{customer.fax}</p>
                  </div>
                </td>
                <td colSpan="2">
                  <div className="report-detail">
                    <p className="text"><span>Dispatch No: </span>{dispatchNo}</p>
                    <p className="text"><span>Dispatch Date: </span>{dispatchDate ? format(parseISO(dispatchDate), "dd-MM-yyyy") : ""}</p>
                  </div>
                </td>
              </tr>
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
            <tbody style={{ border: "1px #eaecef" }}>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ width: cell.column.width }} className="quotation-td">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tbody>
              <tr>
                <td colSpan="2">
                  <div className="report-detail">
                    <p className="text">Received the above in good condition</p>
                  </div>
                </td>
                <td colSpan="3">
                  <div className="report-detail">
                    <p className="text">For <span>{companyList?.name}</span></p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DispatchChallanReportGenerate;

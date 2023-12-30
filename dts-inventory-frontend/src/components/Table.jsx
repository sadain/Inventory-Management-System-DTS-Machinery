import React from "react";
import { flexRender } from "@tanstack/react-table";
import Loader from "components/Loader";

const Table = ({ table, isLoading }) => {
  const rows = table.getRowModel().rows;
  const headers = table.getHeaderGroups()[0].headers;

  return (
    <div style={{ height: "auto", overflowY: "auto" }}>
      <table className="table table-hover table-bordered table-responsive">
        <thead style={{ textTransform: "capitalize" }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ width: header.width }}>
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
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={headers.length}
                style={{
                  textAlign: "center",
                  backgroundColor: "#f6f6f6",
                }}
              >
                <Loader />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                style={{
                  textAlign: "center",
                  backgroundColor: "#f6f6f6",
                }}
              >
                This Record is Empty
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.width }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;


// import React from "react";
// import { flexRender } from "@tanstack/react-table";
// import Loader from "components/Loader";

// const Table = ({ table, isLoading }) => {
//   const rows = table.getRowModel().rows;
//   const headers = table.getHeaderGroups()[0].headers;

//   if (isLoading) {
//     return <Loader />;
//   }

//   return (
//     <div style={{ height: "auto", overflowY: "auto" }}>
//       <table className="table table-hover table-bordered table-responsive">
//         <thead style={{ textTransform: "capitalize" }}>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th key={header.id} style={{ width: header.width }}>
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {rows.length === 0 ? (
//             <tr>
//               <td colSpan={headers.length} style={{ textAlign: "center", backgroundColor: "#f6f6f6" }}>This Record is Empty</td>
//             </tr>
//           ) : (
//             table.getRowModel().rows.map((row) => (
//               <tr key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <td key={cell.id} style={{ width: cell.column.width }}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;

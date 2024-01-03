import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table from "components/Table";
import { useRoles } from "api/useApi";
import RolesFormAction from "components/Forms/RolesFormAction"
import Loader from "components/Loader";
import usePermission from "contexts/usePermission";
import { PERMISSIONS } from "utils/Permissions";

const Roles = (props) => {
  const { queryClient } = props;
  const [isLoading, setIsLoading] = useState(true);

  const { data: rolesList, isLoading: spinLoading } = useRoles();

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const { hasPermission } = usePermission();

  const {
    CAN_USER_CREATE_ROLE,
  } = PERMISSIONS;

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("name", {
      header: "Role Name",
      cell: (info) => info.getValue(),
    }),
  ];

  const table = useReactTable({
    data: rolesList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Master" title="Roles" />
      <div className="flex toolbar">
        {hasPermission(CAN_USER_CREATE_ROLE) ? (
          <RolesFormAction
            type="add"
            queryClient={queryClient}
          />
        ) : null}
      </div>
      <Table table={table} isLoading={isLoading} />
    </div>
  );
};

export default Roles;

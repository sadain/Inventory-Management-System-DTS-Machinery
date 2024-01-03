import React, { useState, useEffect } from "react";
import { Header } from "../components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Table from "components/Table";
import Loader from "components/Loader";
import UserFormAction from "components/Forms/UserFormAction";
import UserAssignRolesFormAction from "components/Forms/UserAssignRolesFormAction";
import UserAssignCompaniesFormAction from "components/Forms/UserAssignCompaniesFormAction";
import { useUsers, useCompanies, useRoles } from "api/useApi";
import usePermission from "contexts/usePermission";
import { PERMISSIONS } from "utils/Permissions";

const Users = (props) => {
  const { queryClient } = props;
  const [isLoading, setIsLoading] = useState(true);

  const { data: userList, isLoading: spinLoading } = useUsers();
  const { data: companiesList } = useCompanies();
  const { data: rolesList } = useRoles();

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const { hasPermission } = usePermission();

  const {
    CAN_USER_CREATE_USER,
    CAN_USER_UPDATE_USER,
    CAN_USER_DELETE_USER,
  } = PERMISSIONS;

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("firstName", {
      header: () => "First Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("lastName", {
      header: () => "Last Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("userName", {
      header: () => "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: () => "Action",
      width: 200,
      cell: (info) => (
        <div className="actionEditDelete">
          {userList &&
            userList.length &&
            userList.map((user) => (
              info.row.original.id === user.id && (
                <React.Fragment key={user.id}>
                  {hasPermission(CAN_USER_UPDATE_USER) ? (
                    <UserAssignRolesFormAction
                      userRow={user}
                      rolesList={rolesList}
                      queryClient={queryClient}
                    />
                  ) : null}
                  {hasPermission(CAN_USER_DELETE_USER) ? (
                    <UserAssignCompaniesFormAction
                      userRow={user}
                      companiesList={companiesList}
                      queryClient={queryClient}
                    />
                  ) : null}
                </React.Fragment>
              )
            ))}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: userList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Master" title="User" />
      <div className="flex toolbar">
        {hasPermission(CAN_USER_CREATE_USER) ? (
          <UserFormAction
            type="add"
            queryClient={queryClient}
            companiesList={companiesList}
          />
        ) : null}
      </div>
      <Table table={table} isLoading={isLoading} />
    </div>
  );
};

export default Users;

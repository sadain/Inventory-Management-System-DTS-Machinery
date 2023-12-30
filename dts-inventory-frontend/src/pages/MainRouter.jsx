import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { Navbar, Sidebar, } from "components";
import { useAuth } from "../contexts/AuthProvider";

import { useStateContext } from "contexts/ContextProvider";

const MainRouter = (props) => {

    const { selectedCompanyId, setSelectedCompanyId } = props;

    const { activeMenu } = useStateContext();

    const { accessToken } = useAuth();

    if (!accessToken) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="hide-on-print">
            <div className="flex relative">
                {activeMenu ? (
                    <div className="w-72 fixed sidebar bg-white "><Sidebar /></div>
                ) : (
                    <div className="w-0"><Sidebar /></div>
                )}
                <div className={activeMenu ? "bg-main-bg min-h-screen md:ml-72 w-full " : "bg-main-bg w-full min-h-screen flex-2 "} >
                    <div className="md:static bg-main-bg navbar w-full ">
                        <Navbar selectedCompanyId={selectedCompanyId} setSelectedCompanyId={setSelectedCompanyId} />
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default MainRouter;
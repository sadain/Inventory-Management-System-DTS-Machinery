import React, { useState, useEffect } from "react";
import { Header } from "../components";
import CompanyBankDetailCard from "../components/CompanyBankDetailCard";
import CompanyBankDetailFormAction from "../components/Forms/CompanyBankDetailFormAction";
import Loader from "components/Loader";
import { useParams } from "react-router-dom";
import { useCompanyBanks } from "../api/useApi";
import usePermission from "contexts/usePermission";
import { PERMISSIONS } from "utils/Permissions";

const CompanyBankDetail = (props) => {
  const { queryClient } = props;
  const [isLoading, setIsLoading] = useState(true);

  let params = useParams();
  const { data: companyBankDetailList, isLoading: spinLoading } =
    useCompanyBanks(params.id);

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  const { hasPermission } = usePermission();

  const { CAN_USER_CREATE_COMPANY_BANK_DETAILS } = PERMISSIONS;

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Transaction" title="Company Bank Details" />
      <div>
        {hasPermission(CAN_USER_CREATE_COMPANY_BANK_DETAILS) ? (
          <CompanyBankDetailFormAction
            type="add"
            queryClient={queryClient}
            companyBankDetailId={params.id}
          />
        ) : null}
      </div>
      {isLoading ? (<Loader />) : (
        <>
          {companyBankDetailList.length === 0 ? (
            <div style={{ marginLeft: "12px" }}>No Data Found</div>
          ) : (
            <div className="card-container">
              {companyBankDetailList &&
                companyBankDetailList.length > 0 &&
                companyBankDetailList.map((companyBankDetail, index) => (
                  <CompanyBankDetailCard
                    key={index}
                    companyBankDetail={companyBankDetail}
                    companyBankDetailId={params.id}
                    queryClient={queryClient}
                  />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompanyBankDetail;

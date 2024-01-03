import React, { useState, useEffect } from "react";
import { Header } from "../components";
import Loader from "components/Loader";
import SuppliersBankDetailCard from "../components/SuppliersBankDetailCard";
import SupplierBankDetailFormAction from "../components/Forms/SuppliersBankDetailFormAction"
import { useParams } from "react-router-dom";
import { useSupplierBanks } from "../api/useApi";

const SuppliersBankDetail = (props) => {
  const { queryClient } = props;
  const [isLoading, setIsLoading] = useState(true);

  let params = useParams();
  const { data: supplierBankDetailList, isLoading: spinLoading } = useSupplierBanks(params.id);

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Transaction" title="Suppliers Bank Details" />
      <div>
        <SupplierBankDetailFormAction
          type="add"
          queryClient={queryClient}
          suppliersBankDetailId={params.id}
        />
      </div>
      {isLoading ? (<Loader />) : (
        <>
          {supplierBankDetailList.length === 0 ? (
            <div style={{ marginLeft: "12px" }}>No Data Found</div>
          ) : (
            <div className="card-container">
              {supplierBankDetailList &&
                supplierBankDetailList.length > 0 &&
                supplierBankDetailList.map((suppliersBankDetail, index) => (
                  <SuppliersBankDetailCard
                    key={index}
                    suppliersBankDetail={suppliersBankDetail}
                    suppliersBankDetailId={params.id}
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

export default SuppliersBankDetail;

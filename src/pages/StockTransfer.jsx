import React, { useState, useEffect } from "react";
import { Header } from "../components";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import { useStockTransfer, useStockTransferMutation } from "api/useApi";
import StockTransferChallansCard from "components/StockTransferChallansCard";

const StockTransfer = (props) => {
  const { queryClient, selectedCompanyId } = props;
  const [isLoading, setIsLoading] = useState(true);

  // const [companyId, setCompanyId] = useState("");

  const { data: stockTransferList, isLoading: spinLoading } = useStockTransfer(selectedCompanyId);

  const { mutate: stockTransferMutate, isLoading: spinLoading1 } = useStockTransferMutation({
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["allStockTransferData"],
      });
      toast.success("Stock is Transferred Successfully!");
    },
    onError: (error) => {
      toast.error(error);
      toast.error(error.response.data);
    },
  });

  useEffect(() => {
    setIsLoading(spinLoading);
  }, [spinLoading]);

  useEffect(() => {
    setIsLoading(spinLoading1);
  }, [spinLoading1]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mt-2 m-2 md:m-2 md:mt-0 p-2 md:p-10 md:pt-0">
      <Header category="Transaction" title="Stock Transfer" />
      {!stockTransferList ? (
        <div style={{ marginLeft: "12px" }}><Loader /></div>
      ) : stockTransferList.length === 0 ? (
        <div style={{ marginLeft: "12px" }}>No Data Found</div>
      ) : (
        <div className="card-container">
          {stockTransferList.map((stockTransfer, index) => (
            <StockTransferChallansCard
              key={stockTransfer.id}
              queryClient={queryClient}
              selectedCompanyId={selectedCompanyId}
              stockTransfer={stockTransfer}
              stockTransferMutate={stockTransferMutate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StockTransfer;

import React from "react";
// import { BsCurrencyRupee } from "react-icons/bs";

import { earningData } from "../data/dataElements";

const Dashboard = () => {
  return (
    <div className="mt-2 m-2 md:m-10 md:mt-0 p-2 md:p-10 rounded-3xl">
      <div
        className="flex flex-wrap lg:flex-nowrap justify-center"
        style={{ textAlign: "center" }}
      >
        <div
          className="bg-gray-bg h-44 rounded-xl lg:w-80 p-8 pl-12 pr pt-14 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center hover:drop-shadow-xl"
          style={{ padding: "60px" }}
        >
          <div className="flex justify-between items-center">
            <div style={{ textAlign: "justify" }}>
              <p className="font-bold">Earnings</p>
              <p className="text-2xl">₹63,448.78</p>
            </div>
            {/* <button
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4"
            >
              <BsCurrencyRupee />
            </button> */}
          </div>
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          {earningData.map((item) => (
            <div
              key={item.key}
              className="bg-gray-bg h-44 md:w-56 p-4 pt-9 rounded-2xl hover:drop-shadow-xl"
            >
              <button
                type="button"
                style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{item.amount}</span>
                <span className={`text-sm text-${item.pcColor} ml-2`}>
                  {item.percentage}
                </span>
              </p>
              <p className="text-sm text-gray-400 mt-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

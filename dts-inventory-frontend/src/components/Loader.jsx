import React from 'react';
import { Oval } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className="loader">
      <Oval
        height={50}
        width={50}
        color="#e3165b"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#f8abc4"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default Loader;

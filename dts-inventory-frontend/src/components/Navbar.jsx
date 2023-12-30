import React, { useState, useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Form } from "react-bootstrap";
import { useAuth } from "contexts/AuthProvider";
import { useStateContext } from "../contexts/ContextProvider";
import { UserProfile } from "../components";
import avatar from "../data/avatar-1.jpeg";
import { useCompanies } from "api/useApi";

const { Group, Select } = Form;

const Navbar = ({ selectedCompanyId, setSelectedCompanyId }) => {
  const { setActiveMenu, screenSize, setScreenSize } = useStateContext();
  const { decodedToken } = useAuth();
  const decodedTokenObj = decodedToken ? JSON.parse(decodedToken) : null;

  const [showProfile, setshowProfile] = useState(false);

  const { data: companiesList } = useCompanies();

  const { displayname, Companies } = decodedTokenObj;

  const handleCompanyChange = (event) => {
    const companyId = event.target.value;
    setSelectedCompanyId(companyId);
    localStorage.setItem("selectedCompanyId", companyId);
  };

  const filterByCompaniesId = Companies ? Companies : [];

  const filteredCompanies = companiesList
    ? companiesList.filter((company) => filterByCompaniesId.includes(String(company.id)))
    : [];

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("selectedCompanyId");
    if (storedCompanyId) {
      setSelectedCompanyId(storedCompanyId);
    } else if (filteredCompanies.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(filteredCompanies[0].id);
    }
  }, [filteredCompanies, selectedCompanyId, setSelectedCompanyId]);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  return (
    <div className="flex w-full p-2 pt-0 md:mx-6 relative">
      <div className="grow-1 mr-auto">
        <button
          onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
          style={{ color: "#e3165b" }}
          className="relative text-xl rounded-full p-3 hover:bg-light-gray"
          icon={<AiOutlineMenu />}
        >
          <span
            className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
          ></span>
          <AiOutlineMenu />
        </button>
      </div>
      {filteredCompanies.length > 0 && (
        <div className="flex pr-4 company-select-out">
          <Group className="pageSize" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "10px" }}>
            {/* <p className="font-semibold" style={{paddingRight: "5px"}} >Company: </p> */}
            <Select id="inputCompany" onChange={handleCompanyChange} value={selectedCompanyId}>
              {filteredCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
          </Group>
        </div>
      )}
      <div
        className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
        onClick={() => setshowProfile(!showProfile)}
        style={{ height: "fit-content" }}
      >
        <img className="rounded-full w-8 h-8" src={avatar} alt="user-profile" />
        <p>
          <span className="text-gray-400 text-14">Hi,</span>{" "}
          <span className="text-gray-400 font-bold ml-1 text-14" style={{ textTransform: "capitalize" }}>
            {displayname}
          </span>
        </p>
        <MdKeyboardArrowDown className="text-gray-400 text-14" />
      </div>
      {showProfile && (
        <UserProfile
          showProfile={showProfile}
          setshowProfile={setshowProfile}
          selectedCompanyId={selectedCompanyId}
          setSelectedCompanyId={setSelectedCompanyId}
        />
      )}
    </div>
  );
};

export default Navbar;


// import React, { useState, useEffect } from "react";
// import { AiOutlineMenu } from "react-icons/ai";
// import { MdKeyboardArrowDown } from "react-icons/md";
// import { Form } from "react-bootstrap";
// import { useAuth } from "contexts/AuthProvider";
// import { useStateContext } from "../contexts/ContextProvider";
// import { UserProfile } from "../components";
// import avatar from "../data/avatar-1.jpeg";
// import { useCompanies } from "api/useApi";

// const { Group, Select } = Form;

// const Navbar = ({ selectedCompanyId, setSelectedCompanyId }) => {
//   const { setActiveMenu, screenSize, setScreenSize } = useStateContext();
//   const { decodedToken } = useAuth();
//   const decodedTokenObj = decodedToken ? JSON.parse(decodedToken) : null;

//   const [showProfile, setshowProfile] = useState(false);

//   const { data: companiesList } = useCompanies();

//   const { displayname, Companies } = decodedTokenObj;

//   const handleCompanyChange = (event) => {
//     const companyId = event.target.value;
//     setSelectedCompanyId(companyId);
//     localStorage.setItem("selectedCompanyId", companyId);
//   };

//   const filterByCompaniesId = Companies ? Companies : [];

//   const filteredCompanies = companiesList
//     ? companiesList.filter((company) => filterByCompaniesId.includes(String(company.id)))
//     : [];

//   useEffect(() => {
//     const storedCompanyId = localStorage.getItem("selectedCompanyId");
//     if (storedCompanyId) {
//       setSelectedCompanyId(storedCompanyId);
//     } else if (filteredCompanies.length > 0 && !selectedCompanyId) {
//       setSelectedCompanyId(filteredCompanies[0].id);
//     }
//   }, [filteredCompanies, selectedCompanyId, setSelectedCompanyId]);

//   useEffect(() => {
//     const handleResize = () => setScreenSize(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (screenSize <= 900) {
//       setActiveMenu(false);
//     } else {
//       setActiveMenu(true);
//     }
//   }, [screenSize]);

//   return (
//     <div className="flex w-full p-2 pt-0 md:mx-6 relative">
//       <div className="grow-1 mr-auto">
//         <button
//           onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
//           style={{ color: "#e3165b" }}
//           className="relative text-xl rounded-full p-3 hover:bg-light-gray"
//           icon={<AiOutlineMenu />}
//         >
//           <span
//             className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
//           ></span>
//           <AiOutlineMenu />
//         </button>
//       </div>
//       {filteredCompanies.length > 0 && (
//         <div className="flex pr-4 company-select-out">
//           <Group className="pageSize" style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "10px" }}>
//             {/* <p className="font-semibold" style={{paddingRight: "5px"}} >Company: </p> */}
//             <Select id="inputCompany" onChange={handleCompanyChange} value={selectedCompanyId}>
//               {filteredCompanies.map((company) => (
//                 <option key={company.id} value={company.id}>
//                   {company.name}
//                 </option>
//               ))}
//             </Select>
//           </Group>
//         </div>
//       )}
//       <div
//         className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
//         onClick={() => setshowProfile(!showProfile)}
//         style={{ height: "fit-content" }}
//       >
//         <img className="rounded-full w-8 h-8" src={avatar} alt="user-profile" />
//         <p>
//           <span className="text-gray-400 text-14">Hi,</span>{" "}
//           <span className="text-gray-400 font-bold ml-1 text-14" style={{ textTransform: "capitalize" }}>
//             {displayname}
//           </span>
//         </p>
//         <MdKeyboardArrowDown className="text-gray-400 text-14" />
//       </div>
//       {showProfile && (
//         <UserProfile
//           showProfile={showProfile}
//           setshowProfile={setshowProfile}
//           selectedCompanyId={selectedCompanyId}
//           setSelectedCompanyId={setSelectedCompanyId}
//         />
//       )}
//     </div>
//   );
// };

// export default Navbar;

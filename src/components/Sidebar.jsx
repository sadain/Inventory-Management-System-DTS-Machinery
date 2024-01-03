import React from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import logo from "../data/dtslogo.png";
import { Disclosure } from "@headlessui/react";
import { links, links1, links2, links3 } from "../data/dataElements";
import { useStateContext } from "../contexts/ContextProvider";
import usePermission from "contexts/usePermission";

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize } =
    useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const { hasPermission } = usePermission();

  const activeLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2 no-underline hover:text-[#ffffff]";
  const normalLink = "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2 no-underline hover:text-[#e3165b]";

  return (
    <div
      key="sidebar"
      className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10"
    >
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/dashboard"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900 no-underline hover:text-[#e3165b]"
            >
              <img
                src={logo}
                alt="DTS"
                style={{ width: "70px", height: "30px" }}
              />
              <span>Machinery</span>
            </Link>
            <button
              type="button"
              onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
              className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
            >
              <MdOutlineCancel />
            </button>
          </div>

          <div className="mt-10">
            {links.map((item) => (
              <div key={item.title}>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.id}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "#e3165b" : "",
                    })}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="capitalize">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}

            {links1.map((item) => {
              const hasPermissionInSection = item.links1.some(
                (link) => !link.permission || hasPermission(link.permission)
              );

              return (
                hasPermissionInSection && (
                  <Disclosure key={item.title}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-800 bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                          {item.title}
                          <span className="ml-2">
                            {open ? (
                              <AiOutlineMinusSquare />
                            ) : (
                              <AiOutlinePlusSquare />
                            )}
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          {item.links1.map((link) => {
                            if (
                              link.permission &&
                              !hasPermission(link.permission)
                            ) {
                              return null;
                            }

                            return (
                              <NavLink
                                key={link.id}
                                to={`/${link.name}`}
                                onClick={handleCloseSideBar}
                                style={({ isActive }) => ({
                                  backgroundColor: isActive ? "#e3165b" : "",
                                })}
                                className={({ isActive }) =>
                                  isActive ? activeLink : normalLink
                                }
                              >
                                <span className="mr-2 ml-6">{link.icon}</span>
                                <span className="capitalize">{link.name}</span>
                              </NavLink>
                            );
                          })}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                )
              );
            })}

            {links2.map((item) => {
              const hasPermissionInSection = item.links2.some(
                (link) => !link.permission || hasPermission(link.permission)
              );

              return (
                hasPermissionInSection && (
                  <Disclosure key={item.title}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-800 bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                          {item.title}
                          <span className="ml-2">
                            {open ? (
                              <AiOutlineMinusSquare />
                            ) : (
                              <AiOutlinePlusSquare />
                            )}
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          {item.links2.map((link) => {
                            if (
                              link.permission &&
                              !hasPermission(link.permission)
                            ) {
                              return null;
                            }

                            return (
                              <NavLink
                                key={link.id}
                                to={`/${link.name}`}
                                onClick={handleCloseSideBar}
                                style={({ isActive }) => ({
                                  backgroundColor: isActive ? "#e3165b" : "",
                                })}
                                className={({ isActive }) =>
                                  isActive ? activeLink : normalLink
                                }
                              >
                                <span className="mr-2 ml-6">{link.icon}</span>
                                <span className="capitalize">{link.name}</span>
                              </NavLink>
                            );
                          })}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                )
              );
            })}

            {links3.map((item) => {
              const hasPermissionInSection = item.links3.some(
                (link) => !link.permission || hasPermission(link.permission)
              );

              return (
                hasPermissionInSection && (
                  <Disclosure key={item.title}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-800 bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                          {item.title}
                          <span className="ml-2">
                            {open ? (
                              <AiOutlineMinusSquare />
                            ) : (
                              <AiOutlinePlusSquare />
                            )}
                          </span>
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          {item.links3.map((link) => {
                            if (
                              link.permission &&
                              !hasPermission(link.permission)
                            ) {
                              return null;
                            }

                            return (
                              <NavLink
                                key={link.id}
                                to={`/${link.name}`}
                                onClick={handleCloseSideBar}
                                style={({ isActive }) => ({
                                  backgroundColor: isActive ? "#e3165b" : "",
                                })}
                                className={({ isActive }) =>
                                  isActive ? activeLink : normalLink
                                }
                              >
                                <span className="mr-2 ml-6">{link.icon}</span>
                                <span className="capitalize">{link.name}</span>
                              </NavLink>
                            );
                          })}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                )
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;

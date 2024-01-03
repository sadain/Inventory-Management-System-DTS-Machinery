import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { useAuth } from "contexts/AuthProvider";
import avatar from "../data/avatar-1.jpeg";
import { useCompanies } from "api/useApi";

const { Group, Select, Label } = Form;

const UserProfile = ({ setshowProfile, showProfile, selectedCompanyId, setSelectedCompanyId }) => {

  const { logout, decodedToken } = useAuth();
  const decodedTokenObj = decodedToken ? JSON.parse(decodedToken) : null;

  const { data: companiesList } = useCompanies();

  const {
    displayname,
    username,
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": roles,
    Companies,
  } = decodedTokenObj;

  const handleCompanyChange = (event) => {
    const companyId = event.target.value;
    setSelectedCompanyId(companyId);
    localStorage.setItem("selectedCompanyId", companyId);
  };

  const role = Array.isArray(roles) ? roles.join(", ") : roles;

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

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }

  return (
    <div
      className="nav-item absolute right-1 top-16 p-8 rounded-lg hover:drop-shadow-xl"
      style={{ backgroundColor: "#f6f6f6" }}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg">User Profile</p>
        <button
          className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
          style={{ color: "rgb(153, 171, 180)", borderRadius: "50%" }}
          onClick={() => setshowProfile(!showProfile)}
        >
          <MdOutlineCancel />
        </button>
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl" style={{ textTransform: "capitalize" }} >
            {" "}{displayname}{" "}
          </p>
          <p className="text-gray-500 text-sm"> {role} </p>
          <p className="text-gray-500 text-sm font-semibold"> {username} </p>
        </div>
      </div>
      {filteredCompanies.length > 0 && (
        <div className="company-select-in flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray">
          <Group className="form-floating" style={{ width: "100%" }}>
            <Select id="inputCompany" onChange={handleCompanyChange} value={selectedCompanyId}>
              {filteredCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
            <Label htmlFor="inputCompany">Company Name</Label>
          </Group>
        </div>
      )}
      <div className="mt-5">
        <div className="logout-container"
        >
          <button
            className="logout-btn p-3 w-full hover:drop-shadow-xl"
            onClick={() => setShow(true)}
          >
            <AiOutlineLogout className="text-lg mr-1.5" />
            Logout
          </button>
          <Modal show={show} onHide={handleClose} centered className="dialog">
            <Modal.Header closeButton className="dialog-h">
              <Modal.Title className="dialog-t">Confirm Logout:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Group className="form-floating">
                <p>Are you sure you want to Logout?</p>
              </Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="form-btn save"
                variant="link"
                onClick={() => logout()}
              >
                Logout
              </Button>
              <Button
                className="form-btn cancel"
                variant="link"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

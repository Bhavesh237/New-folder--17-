import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import API_BASE_URL from "./apiconfig";
import { Link } from "react-router-dom";
import Headergive from "./Headergive";

export const Manages_organization = () => {
  const [formData, setFormData] = useState({
    Org_Name: "",
    Org_Id: "",
    Dept_Name: "",
    Dept_Id: "",
    Dept_Req: "",
  });
  const OrgAdminPer = localStorage.getItem("OrgAdminPer");
  const parsedOrgAdminPer = OrgAdminPer ? JSON.parse(OrgAdminPer) : [];
  const [selectedOrg, setSelectedOrg] = useState(parsedOrgAdminPer[0] || {});
  const [orgId, setSelectedOrg1] = useState(parsedOrgAdminPer[0] || null);
  const handleOrganizationSwitch = (org) => {
    setFormData({
      ...formData,
      Org_Name: org.Org_Name,
      Org_Id: org.Org_Id,
    });
  };
  
  const handleSelectOrganization = (org) => {
    setSelectedOrg1(org);
  };

  const [SearchResultsorgname, setSearchorgname] = useState([]);
  const [SearchResultsdepname, setSearchdepname] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [requestStatus, setRequestStatus] = useState(0);

  const [orgPersons, setOrgPersons] = useState([]);

  useEffect(() => {
    const fetchOrgPersons = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error(
          "No token found in local storage. You should handle authentication."
        );
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/OrgPersons/ListByMe?orpPersonListByMe.request_Status=${requestStatus}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrgPersons(response.data);
      } catch (error) {
        console.error("API Error (ListByMe):", error);
      }
    };

    fetchOrgPersons();
  }, [requestStatus]);

  const handleChangeorg = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    searchorgName(e.target.value);
  };
  const handleOrgSelect = (selectedOrg) => {
    setFormData({
      ...formData,
      Dept_Id: selectedOrg.Dept_Id,
      Org_Id: selectedOrg.Org_Id,
      Org_Name: selectedOrg.Org_Name,
      Dept_Name: selectedOrg.Dept_Name,
      Dept_Req: selectedOrg.Dept_Req,
    });
    setSearchorgname([]);
    searchDepName(selectedOrg.Org_Id);
  };
  const handleChangedep = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      Dept_Id: value,
    });
    setSelectedDeptId(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/OrgPersons/Create`,
        {
          Org_Id: formData.Org_Id,
          Dept_Id: selectedDeptId || undefined,
          Dept_Req: selectedDeptId ? undefined : formData.Dept_Req,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

    
      const updatedResponse = await axios.get(
        `${API_BASE_URL}/api/OrgPersons/ListByMe?orpPersonListByMe.request_Status=${requestStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     
      setOrgPersons(updatedResponse.data);

      
      setFormData({
        Org_Name: "",
        Org_Id: "",
        Dept_Name: "",
        Dept_Id: "",
        Parent_dept_Name: "",
        Dept_Req: "string",
      });
    } catch (error) {
     
    }
  };

  const searchorgName = async (searchTerm) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }
    if (searchTerm.length >= 2) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Orgs/AutoCompleteOrgs?search_str=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSearchorgname(response.data);
      } catch (error) {
        console.error("API Error (Search):", error);
      }
    } else {
      setSearchorgname([]);
    }
  };
  const searchDepName = async (orgId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Departments/ByOrgId?getDepartmentByOrgId_.org_Id=${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSearchdepname(response.data);
    } catch (error) {
      console.error("API Error (Search):", error);
    }
  };
  const handleCancelRequest = async (orgId, personId) => {
    const token = localStorage.getItem("token");

    try {
    
      await axios.delete(
        `${API_BASE_URL}/api/OrgPersons/Delete?orgPersonDelete_.org_Id=${orgId}&orgPersonDelete_.person_Id=${personId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    
      const updatedResponse = await axios.get(
        `${API_BASE_URL}/api/OrgPersons/ListByMe?orpPersonListByMe.request_Status=${requestStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

  
      setOrgPersons(updatedResponse.data);
    } catch (error) {
      console.error("API Error (Cancel Request):", error);
    }
  };

 
  const handleLeaveRequest = async (orgId, personId) => {
    const token = localStorage.getItem("token");

    try {
     
      await axios.delete(
        `${API_BASE_URL}/api/OrgPersons/Delete?orgPersonDelete_.org_Id=${orgId}&orgPersonDelete_.person_Id=${personId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedResponse = await axios.get(
        `${API_BASE_URL}/api/OrgPersons/ListByMe?orpPersonListByMe.request_Status=${requestStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrgPersons(updatedResponse.data);
    } catch (error) {
      console.error("API Error (Leave Request):", error);
    }
  };


  return (
    <div>
    <body>
    <Header
    updateOrganizationData={handleOrganizationSwitch}
    onSelectOrganization={handleSelectOrganization}
  />
      <main id="main" className="main">
        <section className="section profile">
          <div className="row">
            <div className="col-12 d-flex justify-content-center">
            <Link className="button or_se_heading_text" >
           Join Organization{" "}
            <button className=" btn btn-primary mr_right_10" data-bs-toggle="modal" data-bs-target="#basicModal" >Join</button>
          </Link>
                
              
              <div class="modal fade" id="basicModal" tabindex="-1">
              <div class="modal-dialog d-flex justify-content-center">
                <div class="modal-content2 pe-auto">
                  <div class="modal-header">
                    <h5 class="modal-title">organization Join</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body modal-dialog_11">
                  <div className="">
                  <div className="popup1 user-select-auto">
                  <form onSubmit={handleSubmit}>
                  <div className="mt_org_ mt_org_9">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Organization_name"
                    name="Org_Name"
                    value={formData.Org_Name}
                    onChange={handleChangeorg}
                  />
                  {SearchResultsorgname.length > 0 && (
                    <ul className="autocomplete-list">
                      {SearchResultsorgname.map((org) => (
                        <li
                          key={org.Org_Id}
                          className="auto"
                          onClick={() => handleOrgSelect(org)}
                        >
                          {org.Org_Name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt_org_10">
                <select
                  className="form-control"
                  id="sel1"
                  onChange={(e) => handleChangedep(e)}
                  value={selectedDeptId}
                >
                  <option value="">Select Department</option>
                  {SearchResultsdepname.map((department) => (
                    <option
                      key={department.Dept_Id}
                      value={department.Dept_Id}
                    >
                      {department.Dept_Name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-center">Or</div>
              <div className="mt_org_10">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Request New Department_name"
                  name="Dept_Req"
                  value={formData.Dept_Req}
                  onChange={handleChangeorg}
                />
              </div>
              <button className="btn btn-primary" data-bs-dismiss="modal">
                Request to Join
              </button>
            </form>
                
                  </div>
                </div>
                  </div>
                  
                </div>
              </div>
            </div>
            </div>
          </div>
          <div className="card-body pt-4">
            <ul className="nav nav-tabs nav-tabs-bordered" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  data-bs-toggle="tab"
                  data-bs-target="#organization-Organization"
                  aria-selected="true"
                  role="tab"
                  className={`nav-link  ${
                    requestStatus === 0 ? "active" : ""
                  }`}
                  onClick={() => setRequestStatus(0)}
                >
                  Requested
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  data-bs-toggle="tab"
                  data-bs-target="#organization-Department"
                  aria-selected="false"
                  role="tab"
                  tabIndex={-1}
                  className={`nav-link ${
                    requestStatus === 1 ? "active" : ""
                  }`}
                  onClick={() => setRequestStatus(1)}
                >
                  Approved
                </button>
              </li>
            </ul>
            <div className="tab-content pt-4">
              <div
                className="tab-pane fade profile-overview active  show"
                id="organization-Organization"
                role="tabpanel"
              >
                <div className="row">
                <div
                  className="col-md-6 col-lg-3 mb-3 wow bounceInUp aos-init aos-animate"
                  data-aos="zoom-in"
                  data-aos-delay={100}
                >
                  <div className="box" style={{ 
                    backgroundImage: `url("/assets/img/dateBg.png")` 
                  }}>
                    <div className="icon" style={{ background: "#fceef3" }}>
                      <i className="bi bi-briefcase" style={{ color: "#ff689b" }} />
                    </div>
                    <h4 className="title">
                      <a href="">Your Request to Join Ksquarez</a>
                    </h4>
                    <p className="description">Dept Name: HR
                    </p>
                    <button type="button" class="btn btn-primary">Leave</button>
                  </div>
                </div>
                </div>
              </div>
              <div
                className="tab-pane fade profile-edit   show"
                id="organization-Department"
                role="tabpanel"
              >
                
                <div className="row">
                <div
                  className="col-md-6 col-lg-3 mb-3 wow bounceInUp aos-init aos-animate"
                  data-aos="zoom-in"
                  data-aos-delay={100}
                >
                  <div className="box" style={{ 
                    backgroundImage: `url("/assets/img/dateBg.png")` 
                  }}>
                    <div className="icon" style={{ background: "#fceef3" }}>
                      <i className="bi bi-briefcase" style={{ color: "#ff689b" }} />
                    </div>
                    <h4 className="title">
                      <a href="">Your Request to Join Ksquarez</a>
                    </h4>
                    <p className="description">Dept Name: HR
                    </p>
                    <button type="button" class="btn btn-primary">Leave</button>
                  </div>
                </div>
                <div
                  className="col-md-6 col-lg-3 mb-3 aos-init aos-animate"
                  data-aos="zoom-in"
                  data-aos-delay={200}
                >
                  <div className="box" style={{ 
                    backgroundImage: `url("/assets/img/dateBg.png")` 
                  }}>
                    <div className="icon" style={{ background: "#fff0da" }}>
                      <i className="bi bi-check-square" style={{ color: "#e98e06" }} />
                    </div>
                    <h4 className="title">
                      <a href="">Your Request to Join Ksquarez</a>
                    </h4>
                    <p className="description">Dept Name: It
                    </p>
                    <button type="button" class="btn btn-primary">Leave</button>
                  </div>
                </div>
                <div
                  className="col-md-6 col-lg-3 mb-3 aos-init aos-animate"
                  data-aos="zoom-in"
                  data-aos-delay={200}
                >
                  <div className="box" style={{ 
                    backgroundImage: `url("/assets/img/dateBg.png")` 
                  }}>
                    <div className="icon" style={{ background: "#e6fdfc" }}>
                      <i className="bi bi-card-checklist" style={{ color: "#3fcdc7" }} />
                    </div>
                    <h4 className="title">
                      <a href="">Your Request to Join Ksquarez</a>
                    </h4>
                    <p className="description">Dept Name: It
                    </p>
                    <button type="button" class="btn btn-primary">Leave</button>
                  </div>
                </div>
                <div
                  className="col-md-6 col-lg-3 mb-3 aos-init aos-animate"
                  data-aos="zoom-in"
                  data-aos-delay={200}
                >
                  <div className="box" style={{ 
                    backgroundImage: `url("/assets/img/dateBg.png")` 
                  }}>
                    <div className="icon" style={{ background: "#fff0da" }}>
                      <i className="bi bi-card-checklist" style={{ color: "#e98e06" }} />
                    </div>
                    <h4 className="title">
                      <a href="">Your Request to Join Ksquarez</a>
                    </h4>
                    <p className="description">Dept Name: It
                    </p>
                    <button type="button" class="btn btn-primary ">Leave</button>
                  </div>
                </div>
              </div>
                
              </div>
            </div>
          </div>
        </section>
      </main>
    </body>
  </div>
  );
};

export default Manages_organization;

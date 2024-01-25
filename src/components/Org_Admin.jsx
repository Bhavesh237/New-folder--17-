import { useState, useEffect } from "react";
import React from "react";
import Header from "./Header";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./apiconfig";

export const Org_Admin = () => {
  const [formDataOrg_O, setFormDataOrg_O] = useState({
    Org_Id: "",
    Org_Name: "",
    About_org: "",
    City: "",
    Country: "",
    Contact_email: "",
    Contact_number: "",
  });

  const [user, Setuser] = useState();

  const [userData, SetuserData] = useState();
  const OrgAdminPer = localStorage.getItem("OrgAdminPer");
  const parsedOrgAdminPer = OrgAdminPer ? JSON.parse(OrgAdminPer) : [];
  const [selectedOrg, setSelectedOrg] = useState(parsedOrgAdminPer[0] || {});
  const [orgId, setSelectedOrg1] = useState(parsedOrgAdminPer[0] || null);

  const handleSelectOrganization = (org) => {
    setSelectedOrg1(org);
  };
  const someLogicToGetOrgId = (orgName) => {
    const organization = userData.find((org) => org.Org_Name === orgName);
    return organization ? organization.Org_Id : null;
  };

  const handleInputChangeOrg_O = (e) => {
    const { name, value } = e.target;

    if (name === "Org_Name") {
      const orgId = someLogicToGetOrgId(value);

      setFormDataOrg_O({
        ...formDataOrg_O,
        Org_Id: orgId,
        [name]: value,
      });
      checkOrganizationExists(orgId)
      featchOrgInfo(orgId);
    } else {
      setFormDataOrg_O({
        ...formDataOrg_O,
        [name]: value,
      });
    }
  };

  const handleOrganizationSwitch = (org) => {
    setFormDataOrg_O({
      ...formDataOrg_O,
      Org_Name: org.Org_Name,
      Org_Id: org.Org_Id,
    });
    handleCancelRequest(org.Org_Id)
    featchOrgInfo(org.Org_Id);
  };

  useEffect(() => {
    if (selectedOrg && selectedOrg.Org_Id) {
      featchOrgInfo(selectedOrg.Org_Id);
    }
  }, [selectedOrg]);

  useEffect(() => {
    if (orgId && orgId.Org_Id) {
      fetchData(orgId.Org_Id);
    }
  }, [orgId]);


  const featchOrgInfo = (orgId) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/api/OrgInfo/ById?id=${orgId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const userData = response.data;
        setFormDataOrg_O({
          Org_Id: orgId.Org_Id,
          Org_Name: userData.Org_Name,
          About_org: userData.About_org,
          City: userData.City,
          Country: userData.Country,
          Contact_email: userData.Contact_email,
          Contact_number: userData.Contact_number,
        });
      })
      .catch((error) => {
        setFormDataOrg_O({
          Org_Id: "",
          Org_Name: "",
          About_org: "",
          City: "",
          Country: "",
          Contact_email: "",
          Contact_number: "",
        });

        console.error("Error fetching user data:", error);
      });
  };

  // const checkOrganizationExists = async () => {
  //   const org = orgId.Org_Id;
  //   const token = localStorage.getItem("token");
  //   try {
  //     const response = await axios.get(
  //       `${API_BASE_URL}/api/OrgInfo/ById?id=${org}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }

  //     );

  //     if (response.status === 400) {
  //       createOrganization();

  //     } else {
  //       updateOrganization();
  //     }
  //   } catch (error) {
  //     console.error("Error checking organization existence:", error);
  //   }
  // };
  const checkOrganizationExists = async () => {
    const org = orgId.Org_Id;
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/OrgInfo/ById?id=${org}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        updateOrganization();
      } else if (response.status === 404) {
        createOrganization();
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error checking organization existence:", error);
    }
  };

  const createOrganization = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/OrgInfo/Create`,
        {
          Org_Id: orgId.Org_Id,
          Org_Name: formDataOrg_O.Org_Name,
          About_org: formDataOrg_O.About_org,
          City: formDataOrg_O.City,
          Country: formDataOrg_O.Country,
          Contact_email: formDataOrg_O.Contact_email,
          Contact_number: formDataOrg_O.Contact_number,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );
      console.log(response);

    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  const updateOrganization = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/OrgInfo/Update`,
        {
          Org_Id: orgId.Org_Id,
          Org_Name: selectedOrg.Org_Name,
          About_org: formDataOrg_O.About_org,
          City: formDataOrg_O.City,
          Country: formDataOrg_O.Country,
          Contact_email: formDataOrg_O.Contact_email,
          Contact_number: formDataOrg_O.Contact_number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log("Organization updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  const handleSubmitOrg_O = async (e) => {
    e.preventDefault();

    // Check if the organization exists and then perform create or update
    checkOrganizationExists();

    // Fetch data based on the updated Org_Id
    fetchData();
  };


  //Roles
  const [dataRoles, setDataRoles] = useState([]);
  const [updateIdRoles, setUpdateIdRoles] = useState(null);
  const [formDataRoles, setFormDataRoles] = useState({
    Role_Id: orgId.Org_Id,
    Role_Name: "",
    Org_Id: "",
  });

  const handleChangeRoles = (e) => {
    const { name, value } = e.target;
    setFormDataRoles({
      ...formDataRoles,
      [name]: value,
    });
  };

  const handleSubmitRoles = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (updateIdRoles) {
      const updatedDataRoles = {
        Org_Id: orgId.Org_Id,
        Role_Id: updateIdRoles,
        Role_Name: formDataRoles.Role_Name,
      };

      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/OrgRoles/Update`,
          updatedDataRoles,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Your Role updated successfully");
        setFormDataRoles({
          Role_Name: "",
        });

        setUpdateIdRoles(null);

        fetchRoles();
      } catch (error) {
        console.error("API Error:(Update)", error);
      }
    } else {
      const newRoles = {
        Role_Name: formDataRoles.Role_Name,
        Org_Id: orgId.Org_Id,
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/OrgRoles/Create`,
          newRoles,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Your Role Added successfully");
        setFormDataRoles({
          Role_Name: "",
        });

        fetchRoles();
      } catch (error) {
        console.error("API Error:", error);
      }
    }
  };

  // update-role

  const fetchRoles = () => {
    const token = localStorage.getItem("token");
    const orgId1 = orgId.Org_Id

    axios

      .get(`${API_BASE_URL}/api/OrgRoles/ByOrgId?Org_id=${orgId1}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDataRoles(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    fetchRoles(orgId.Org_Id);
  }, [orgId]);
  const handleUpdateRoles = (Role) => {
    setFormDataRoles({
      Role_Name: Role.Role_Name,
    });
    setUpdateIdRoles(Role.Role_Id);
  };

  const handleRemoveRoles = (Role_Id) => {
    const token = localStorage.getItem("token");
    const orgId1 = orgId.Org_Id
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }
    const axiosConfig = {
      params: {
        Org_Id: orgId.Org_Id,
        Role_Id: Role_Id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .delete(
        `${API_BASE_URL}/api/OrgRoles/Delete?orgId=${orgId1}&roleId=${Role_Id}`,

        axiosConfig
      )
      .then((response) => {
        setDataRoles(dataRoles.filter((item) => item.Role_Id !== Role_Id));
        console.error("Response:", response.data);
        alert("Your Role has been removed.");
      })
      .catch((error) => {
        console.error("Error removing Role:", error);
      });
  };

  // deparment
  const [formDeparment, setFormDeparment] = useState({
    // Org_Name: "",
    Org_Id: orgId.Org_Id,
    Dept_Name: "",
    Dept_Id: "",
    // Dept_Req: "",
  });
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [data, setData] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDeparment({
      ...formDeparment,
      [name]: value,
    });
  };
  const handleUpdateClick = (department) => {
    setSelectedDepartment(department);
    // Assuming you want to prefill the form fields with the selected department data
    setFormDeparment({
      Org_Id: orgId.Org_Id,
      Dept_Id: department.Dept_Id,
      Dept_Name: department.Dept_Name,
      Parent_dept_Id: department.Parent_dept_Id,
    });
  };
  const handleSubmitDeparment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }

    try {
      if (selectedDepartment) {
        const response = await axios.put(
          `${API_BASE_URL}/api/Departments/Update`,
          {
            Dept_Id: selectedDepartment.Dept_Id,
            Org_Id: orgId.Org_Id,
            Dept_Name: formDeparment.Dept_Name,
            Parent_dept_Id: formDeparment.Parent_dept_Id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/api/Departments/Create`,
          {
            Org_Id: orgId.Org_Id,
            Dept_Name: formDeparment.Dept_Name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }


      setFormDeparment({
        Org_Id: userData,
        Dept_Name: "",
        Parent_dept_Name: "",
      });

      // Clear selected department
      setSelectedDepartment(null);

      // Fetch updated data
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchData = () => {
    const token = localStorage.getItem("token");
    const orgId1 = orgId.Org_Id

    axios
      .get(
        `${API_BASE_URL}/api/Departments/ByOrgId?org_Id=${orgId1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData(orgId.Org_Id);
  }, [orgId]);


  useEffect(() => {
    fetchData(orgId.Org_Id);
  }, [orgId]);


  const handleCancelRequest = async (DeptId, personId,) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${API_BASE_URL}/api/Departments/Delete?deleteDepartment_.dept_Id=${DeptId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const orgId1 = orgId.Org_Id

      const updatedResponse = await axios.get(
        `${API_BASE_URL}/api/Departments/ByOrgId?getDepartmentByOrgId_.org_Id=${orgId1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(updatedResponse.data);
    } catch (error) {
      console.error("API Error (Cancel Request):", error);
    }
  };
  // manage org.person

  const [requestedData, setRequestedData] = useState([]);

  // console.log("req",requestedData.);
  const [approvedData, setApprovedData] = useState([]);
  console.log("appo", approvedData);
  const [SearchResultsdepname, setSearchdepname] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState("");

  const [formData, setFormData] = useState({
    Dept_Name: "",
    Dept_Id: "",
  });
  const fetchRequestedData = async () => {
    const token = localStorage.getItem("token");
    const Name = orgId.Org_Name

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/OrgPersons/ListByOrg?org_Name=${Name}&request_Status=0`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequestedData(response.data);
    } catch (error) {
      console.error("Error fetching requested data:", error);
    }
  };
  useEffect(() => {
    if (orgId && orgId.Org_Name) {
      fetchRequestedData(orgId.Org_Named);
    }
  }, [orgId]);

  const fetchApprovedData = async () => {
    const token = localStorage.getItem("token");
    const Name = orgId.Org_Name
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/OrgPersons/ListByOrg?orpPersonListByOrg.org_Name=${Name}&orpPersonListByOrg.request_Status=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApprovedData(response.data);
    } catch (error) {
      console.error("Error fetching approved data:", error);
    }
  };

  useEffect(() => {
    if (orgId && orgId.Org_Name) {
      fetchApprovedData(orgId.Org_Name);
    }
  }, [orgId]);

  const handleCancelRequest1 = async (personId) => {
    const token = localStorage.getItem("token");
    const orgId1 = orgId.Org_Id
    try {
      await axios.delete(
        `${API_BASE_URL}/api/OrgPersons/Delete?orgPersonDelete_.org_Id=${orgId1}&orgPersonDelete_.person_Id=${personId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRequestedData();
      fetchApprovedData();
    } catch (error) {
      console.error("API Error (Cancel Request):", error);
    }
  };

  const handleAssignDepartment = async (personId, deptId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/OrgPersons/Request/Update`,
        {
          Org_Id: orgId.Org_Id,
          Perosn_Id: personId,
          Dept_Id: deptId,
          Request_Status: 1,
          Dept_Req: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRequestedData();
      fetchApprovedData();
    } catch (error) {
      console.error("API Error (Assign Department):", error);
    }
  };
  const handleFormSubmit = async () => {

    const selectedPersonId = requestedData.Person_Id;
    const selectedDepartmentId = requestedData.Dept_Id;
    if (selectedPersonId && selectedDepartmentId) {
      await handleAssignDepartment(selectedPersonId, selectedDepartmentId);
    }
  };
  return (
    <div>
      <body>
        <Header updateOrganizationData={handleOrganizationSwitch} onSelectOrganization={handleSelectOrganization}></Header>
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>Orgnization</h1>

            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">Users</li>
                <li className="breadcrumb-item active">Organization</li>
              </ol>
            </nav>
          </div>

          <section className="section organization">
            <div className="row">
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-body pt-4 ">
                    <ul
                      className="nav nav-tabs nav-tabs-bordered"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#organization-Organization"
                          aria-selected="true"
                          role="tab"
                        >
                          Organization
                        </button>
                      </li>

                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#organization-Department"
                          aria-selected="false"
                          role="tab"
                          tabIndex="-1"
                        >
                          Department
                        </button>
                      </li>

                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#organization-Roles"
                          aria-selected="false"
                          role="tab"
                          tabIndex="-1"
                        >
                          Roles
                        </button>
                      </li>

                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#organization-User"
                          aria-selected="false"
                          role="tab"
                          tabIndex="-1"
                        >
                          Manage Org.Person
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content pt-4">
                      <div
                        className="tab-pane fade profile-overview active show"
                        id="organization-Organization"
                        role="tabpanel"
                      >
                        <form
                          id="Organization-Create"
                          onSubmit={handleSubmitOrg_O}
                        >
                          <div className="row mb-3">
                            <label
                              htmlFor="Org_Name"
                              className="col-md-3 col-lg-4 col-form-label"
                            >
                              Organization Name 
                            </label>
                            <div className="col-md-8 col-lg-8">
                              <input
                                type="text"
                                className="form-control "
                                id="Org_Name"
                                name="Org_Name"
                                placeholder="Enter your Organization Name"
                                value={formDataOrg_O.Org_Name}
                                onChange={handleInputChangeOrg_O}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label
                              htmlFor="About_org"
                              className="col-md-3 col-lg-4 col-form-label"
                            >
                              About
                            </label>
                            <div className="col-md-8 col-lg-8">
                              <input
                                type="text"
                                className="form-control valid"
                                id="About_org"
                                name="About_org"
                                placeholder="About Yout Organization"
                                value={formDataOrg_O.About_org}
                                onChange={handleInputChangeOrg_O}
                                required
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <label className="col-md-3 col-lg-4 col-form-label">
                              City
                            </label>
                            <div htmlFor="City" className="col-md-8 col-lg-8">
                              <input
                                type="text"
                                className="form-control valid"
                                id="City"
                                name="City"
                                placeholder="Enter Your City"
                                value={formDataOrg_O.City}
                                onChange={handleInputChangeOrg_O}
                                required
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label
                              htmlFor="Country"
                              className="col-md-3 col-lg-4 col-form-label"
                            >
                              Country
                            </label>
                            <div className="col-md-8 col-lg-8">
                              <input
                                type="text"
                                className="form-control valid"
                                id="Country"
                                name="Country"
                                placeholder="Enter Your Country"
                                value={formDataOrg_O.Country}
                                onChange={handleInputChangeOrg_O}
                                required
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label
                              htmlFor="Contact_email"
                              className="col-md-3 col-lg-4 col-form-label"
                            >
                              Email
                            </label>
                            <div className="col-md-8 col-lg-8">
                              <input
                                type="email"
                                className="form-control valid"
                                id="Contact_email"
                                name="Contact_email"
                                placeholder="@mail.com"
                                value={formDataOrg_O.Contact_email}
                                onChange={handleInputChangeOrg_O}
                                required
                              />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <label
                              htmlFor="Contact_number"
                              className="col-md-3 col-lg-4 col-form-label"
                            >
                              Phone Number
                            </label>
                            <div className="col-md-8 col-lg-8">
                              <input
                                type="number"
                                className="form-control valid"
                                id="Contact_number"
                                name="Contact_number"
                                placeholder="+91"
                                value={formDataOrg_O.Contact_number}
                                onChange={handleInputChangeOrg_O}
                                required
                              />
                            </div>
                          </div>
                          <div className="">
                            <button type="submit" className="btn btn-primary">
                              Update{" "}
                            </button>
                          </div>
                        </form>
                      </div>

                      <div
                        className="tab-pane fade profile-edit pt-3"
                        id="organization-Department"
                        role="tabpanel"
                      >
                        <div className="card-body pt-4 org">
                          <ul
                            className="nav nav-tabs nav-tabs-bordered"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link active"
                                data-bs-toggle="tab"
                                data-bs-target="#department-Createddepartment"
                                aria-selected="true"
                                role="tab"
                              >
                                Create_Department
                              </button>
                            </li>

                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link"
                                data-bs-toggle="tab"
                                data-bs-target="#department-Alldepartment"
                                aria-selected="false"
                                role="tab"
                                tabIndex="-1"
                              >
                                All_Department
                              </button>
                            </li>
                          </ul>
                          <div className="tab-content pt-4">
                            <div
                              className="tab-pane fade profile-overview active show"
                              id="department-Createddepartment"
                              role="tabpanel"
                            >
                              <div className="col-md-5 col-xl-5">
                                <form onSubmit={handleSubmitDeparment}>
                                  <div className="row mb-3">
                                    <label className="col-md-3 col-lg-4 col-form-label">
                                      Department
                                    </label>
                                    <div className="col-md-7 col-lg-7">
                                      <input
                                        type="text"
                                        className="form-control valid"
                                        id="departmentName"
                                        name="Dept_Name"
                                        placeholder="Enter your Department"
                                        aria-describedby="departmentName-error"
                                        aria-invalid="false"
                                        value={formDeparment.Dept_Name}
                                        onChange={handleChange}
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div className="row mb-3">
                                    <label className="col-md-3 col-lg-4 col-form-label">
                                      Parent Department
                                    </label>
                                    <div className="col-md-7 col-lg-7">
                                      <input
                                        type="text"
                                        className="form-control valid"
                                        id="parentDepartment"
                                        name="parentDepartment"
                                        placeholder="Enter Parent Department"
                                        aria-describedby="parentDepartment-error"
                                        aria-invalid="false"
                                      />
                                    </div>
                                  </div>
                                  <div className="">
                                    <button
                                      type="submit"
                                      className="btn btn-primary"
                                      id="addDepartmentBtn"
                                    >
                                      Add Department
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>

                            <div
                              className="tab-pane fade profile-edit pt-3"
                              id="department-Alldepartment"
                              role="tabpanel"
                            >
                              <div className="col-md-7 col-xl-7">
                                <div className="card list_tabel_bo">
                                  <div className="card-body">
                                    <h5 className="card-title">Department</h5>
                                  <div className="table-container">
                                    <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                      <div className="datatable-dropdown">
                                        {/* */}
                                        {/* 
                                          <label>
                                            <select className="datatable-selector">
                                              <option value="5">5</option>
                                              <option value="10" selected="">
                                                10
                                              </option>
                                              <option value="15">15</option>
                                              <option value="20">20</option>
                                              <option value="25">25</option>
                                            </select>{" "}
                                            entries per page
                                          </label>
                                          */}
                                      </div>
                                      {/* */}{" "}
                                      {/* 
                                        <div className="datatable-search">
                                          <input
                                            className="datatable-input"
                                            placeholder="Search..."
                                            type="search"
                                            title="Search within table"
                                          />
                                        </div>
                                        */}
                                      <div className="datatable-container">
                                        <table className="table datatable datatable-table">
                                          <thead>
                                            <tr>
                                              <th
                                                data-sortable="true"
                                                style={{
                                                  width: "12.996422182468695%",
                                                }}
                                              >
                                                <a
                                                  href="#"
                                                  className="datatable-sorter"
                                                >
                                                  Department
                                                </a>
                                              </th>
                                              {/* */}{" "}
                                              {/* 
                                              <th
                                                data-sortable="true"
                                                style={{
                                                  width: "12.83542039355993%",
                                                }}
                                              >
                                                <a
                                                  href="#"
                                                  className="datatable-sorter"
                                                >
                                                  Parent_Department
                                                </a>
                                              </th>
                                              */}
                                              <th
                                                data-sortable="true"
                                                style={{
                                                  width: "9.212880143112702%",
                                                }}
                                              >
                                                <a href="#" className="">
                                                  Actions
                                                </a>
                                              </th>
                                              
                                            </tr>
                                          </thead>
                                          <tbody id="departmentTableBody">
                                            {data.map((item, index) => (
                                              <tr key={index}>
                                                <td>{item.Dept_Name}</td>

                                                <td>
                                                  <button className="btn_table_1  bi bi-pencil-square"
                                                    onClick={() =>
                                                      handleUpdateClick(item)
                                                    }
                                                  >
                                                  </button>

                                                  <button
                                                    className="removee btn_delete_t1 bi bi-trash"
                                                    onClick={() =>
                                                      handleCancelRequest(
                                                        item.Dept_Id
                                                      )
                                                    }
                                                  >
                                                  </button>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                      <div className="datatable-bottom">
                                        <nav className="datatable-pagination">
                                          <ul className="datatable-pagination-list"></ul>
                                        </nav>
                                      </div>
                                    </div>
                                  </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade pt-3"
                        id="organization-Roles"
                        role="tabpanel"
                      >
                        <div className="card">
                          <div className="card-body pt-4">
                            <ul
                              className="nav nav-tabs nav-tabs-bordered"
                              role="tablist"
                            >
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link active"
                                  data-bs-toggle="tab"
                                  data-bs-target="#role-Allrole"
                                  aria-selected="false"
                                  role="tab"
                                  tabIndex="-1"
                                >
                                  All_Roles
                                </button>
                              </li>

                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link"
                                  data-bs-toggle="tab"
                                  data-bs-target="#role-Rolecreated"
                                  aria-selected="true"
                                  role="tab"
                                >
                                  Role_Created
                                </button>
                              </li>
                            </ul>
                            <div className="tab-content pt-4">
                              <div
                                className="tab-pane fade profile-overview"
                                id="role-Allrole"
                                role="tabpanel"
                              >
                                <div className="row">
                                  <div className="col-md-5 col-xl-5">
                                    <div className="container">
                                      <div
                                        className="qq"
                                        style={{ display: "block" }}
                                      >
                                        <form
                                          id="roleForm"
                                          onSubmit={handleSubmitRoles}
                                        >
                                          <h5 className="card-title">Roles</h5>
                                          <div className="row mb-3">
                                            <label
                                              htmlFor="Role_Name"
                                              className="col-md-3 col-lg-4 col-form-label"
                                            >
                                              Roles
                                            </label>
                                            <div className="col-md-7 col-lg-7">
                                              <input
                                                type="text"
                                                className="form-control valid"
                                                id="Role_Name"
                                                name="Role_Name"
                                                value={formDataRoles.Role_Name}
                                                placeholder="Enter Role Name"
                                                aria-describedby="FirstName-error"
                                                aria-invalid="false"
                                                required
                                                onChange={handleChangeRoles}
                                              />
                                            </div>
                                          </div>
                                          <div className="">
                                            <button
                                              type="submit"
                                              className="btn btn-primary"
                                            >
                                              {updateIdRoles
                                                ? "Update "
                                                : "Add "}
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="tab-pane fade profile-edit pt-3 active show"
                                id="role-Rolecreated"
                                role="tabpanel"
                              >
                                <div className="col-md-7 col-xl-7">
                                  <div className="card list_tabel_bo">
                                    <div className="card-body">
                                      <h5 className="card-title">Roles</h5>
                                      <div className="table-container">
                                      <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                        <div className="datatable-container">
                                          <table className="table">
                                            <thead>
                                              <tr>
                                                <th>Roles</th>
                                                <th>Action</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {dataRoles.map((item, index) => (
                                                <tr key={index}>
                                                  <td>{item.Role_Name}</td>
                                                  <td>
                                                    <button className="btn_table_1  bi bi-pencil-square"
                                                      onClick={() =>
                                                        handleUpdateRoles(item)
                                                      }
                                                    >
                                                    </button>
                                                    <button className="removee btn_delete_t1 bi bi-trash"
                                                      onClick={() =>
                                                        handleRemoveRoles(
                                                          item.Role_Id,
                                                          item.Org_Id
                                                        )
                                                      }
                                                    >
                                                    </button>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                        <div className="datatable-bottom">
                                          <nav className="datatable-pagination">
                                            <ul className="datatable-pagination-list"></ul>
                                          </nav>
                                        </div>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="tab-pane fade pt-3"
                      id="organization-User"
                      role="tabpanel"
                    >
                      <div className="card">
                        <div className="card-body pt-4">
                          <ul
                            className="nav nav-tabs nav-tabs-bordered"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link active"
                                data-bs-toggle="tab"
                                data-bs-target="#user-Alluser"
                                aria-selected="true"
                                role="tab"
                              >
                                Requested
                              </button>
                            </li>

                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link"
                                data-bs-toggle="tab"
                                data-bs-target="#user-Userrequest"
                                aria-selected="false"
                                role="tab"
                                tabIndex="-1"
                              >
                                Approved
                              </button>
                            </li>
                          </ul>
                          <div className="tab-content pt-4">
                            <div
                              className="tab-pane fade profile-overview active show"
                              id="user-Alluser"
                              role="tabpanel"
                            >
                              <div className="row">
                              {requestedData.map((item) => (
                                <div className="col-md-6  col-lg-4 col-xl-4 col-xxl-3">
                                  <div class="co">
                                    <div class="card_list text-center">
                                    
                                      <div key="">
                                        <h5 class="card-title">
                                          {item.FirstName} {item.LastName} is
                                          Request to Join {item.Dept_Name}
                                          <span className="org"></span>
                                        </h5>
                                        <h6 class="card-subtitle mb-2 text-muted"></h6>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-primary"
                                          onClick={() =>
                                            handleCancelRequest1(
                                              item.Person_Id
                                            )
                                          }
                                        >
                                          Reject
                                        </button>

                                        <button
                                          type="button"
                                          className="btn btn-sm btn-primary mr_right_10"
                                          data-bs-toggle="modal"
                                          data-bs-target="#basicModal"
                                        >
                                          Assign
                                        </button>
                                        
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              </div>
                              <div
                                class="modal fade"
                                id="basicModal"
                                tabindex="-1"
                              >
                                <div class="modal-dialog d-flex justify-content-center managesreappro" >
                                  <div class="modal-contentassignde">
                                    <div class="modal-header">
                                      <h5 class="modal-title">
                                        Assign Department
                                      </h5>
                                      <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <div class="modal-body">
                                      <div className="">
                                        <div className="popup1">
                                          <form onSubmit={handleFormSubmit}>
                                            <div className="mt_org_1">
                                              <select
                                                className="form-control"
                                                id="sel1"
                                                required
                                              >
                                                <option value="">
                                                  Select Department
                                                </option>
                                                {data.map(
                                                  (department) => (
                                                    <option
                                                      key={department.Dept_Id}
                                                      value={department.Dept_Id}
                                                    >
                                                      {department.Dept_Name}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </div>

                                            {requestedData.map((department1) => (
                                              <button
                                                type="button"
                                                className="btn btn-primary"
                                                data-bs-dismiss="modal"
                                                onClick={() =>
                                                  handleAssignDepartment(
                                                    department1.Person_Id,
                                                    department1.Dept_Id
                                                  )
                                                }
                                              >
                                                Submit
                                              </button>
                                            ))}
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className="tab-pane fade profile-edit pt-3"
                              id="user-Userrequest"
                              role="tabpanel"
                            >
                              <div className="row">
                              {approvedData.map((item) => (
                                <div className="col-md-6  col-lg-4 col-xl-4 col-xxl-3">
                                  <div class="co">
                                    <div class="card_list text-center">
                                      <div key="">
                                        <h5 class="card-title">
                                          {item.FirstName} {item.LastName} is
                                          Joined {item.Dept_Name}
                                          <span className="org"></span>
                                        </h5>
                                        <h6 class="card-subtitle mb-2 text-muted"></h6>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-primary"
                                          onClick={() =>
                                            handleCancelRequest1(
                                              // item.Org_Id,
                                              item.Person_Id
                                            )
                                          }
                                        >
                                          Reject
                                        </button>

                                        <button
                                          type="button"
                                          className="btn btn-sm btn-primary mr_right_10"
                                          data-bs-toggle="modal"
                                          data-bs-target="#basicModalASS"
                                        >
                                          Edit
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              </div>
                              <div
                                class="modal fade"
                                id="basicModalASS"
                                tabindex="-1"
                              >
                                <div class="modal-dialog d-flex justify-content-center managesreappro">
                                  <div class="modal-contentassignde">
                                    <div class="modal-header">
                                      <h5 class="modal-title">
                                        Assign Department
                                      </h5>
                                      <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      ></button>
                                    </div>
                                    <div class="modal-body">
                                      <div className="">
                                        <div className="popup1">
                                          <form onSubmit={handleFormSubmit}>
                                            <div className="mt_org_1">
                                              <select
                                                className="form-control"
                                                id="sel1"
                                                required
                                              >
                                                <option value="">
                                                  Select Department
                                                </option>
                                                {approvedData.map(
                                                  (department) => (
                                                    <option
                                                      key={department.Dept_Id}
                                                      value={department.Dept_Id}
                                                    >
                                                      {department.Dept_Name}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </div>
                                            {approvedData.map((department111a) => (
                                              <button
                                                key={department111a.Person_Id}
                                                type="button"
                                                className="btn btn-primary"
                                                data-bs-dismiss="modal"
                                                onClick={() =>
                                                  handleAssignDepartment(
                                                    department111a.Person_Id,
                                                    department111a.Dept_Id
                                                  )
                                                }
                                              >
                                                Submit
                                              </button>
                                            ))}
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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

export default Org_Admin;

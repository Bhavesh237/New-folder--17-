import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import API_BASE_URL from "./apiconfig";
import moment from "moment";
import { Link } from "react-router-dom";

const Project = () => {
  const [formVisible1, setFormVisible1] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState(null);
  const [isApproved, setApproved1] = useState(false);
  const showForm1 = () => {
    setFormVisible1(true);
  };

  const hideForm1 = () => {
    setFormVisible1(false);
  };

  const [formVisible2, setFormVisible2] = useState(false);

  const showForm2 = () => {
    setFormVisible2(true);
  };

  const hideForm2 = () => {
    setFormVisible2(false);
  };

  const [formVisible3, setFormVisible3] = useState(false);

  const showForm3 = () => {
    setFormVisible3(true);
  };

  const hideForm3 = () => {
    setFormVisible3(false);
  };

  const [formVisible4, setFormVisible4] = useState(false);

  const showForm4 = () => {
    setFormVisible4(true);
  };

  const hideForm4 = () => {
    setFormVisible4(false);
  };

  const [formData, setFormData] = useState({
    Org_Id: "",
    Org_Name: "",
    Project_Name: "",
    Start_Date: "",
    End_Date: "",
    Progress: "",
  });

  const OrgAdminPer = localStorage.getItem("OrgAdminPer");
  const parsedOrgAdminPer = OrgAdminPer ? JSON.parse(OrgAdminPer) : [];
  const [selectedOrg, setSelectedOrg] = useState(parsedOrgAdminPer[0] || {});
  const [orgId, setSelectedOrg1] = useState(parsedOrgAdminPer[0] || null);
  console.log("org", orgId);
  useEffect(() => {
    const selectedOrg = localStorage.getItem("selectedOrg1");
    setSelectedOrg1(selectedOrg);
    console.log("selctorg", selectedOrg);
  }, []);
  const handleOrganizationSwitch = (org) => {
    setFormData({
      ...formData,
      Org_Name: org.Org_Name,
      Org_Id: org.Org_Id,
    });
  };
  useEffect(() => {
    const selectedOrgFromLocalStorage = localStorage.getItem("selectedOrg1");
    setSelectedOrg1(selectedOrgFromLocalStorage);
    console.log("selctorg", selectedOrgFromLocalStorage);
  }, []);
  const handleSelectOrganization = (org) => {
    setSelectedOrg1(org);
  };
  const handleChangeTraining = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      const formattedStartDate = moment(formData.Start_Date).format(
        "YYYY-MM-DD"
      );
      const formattedEndDate = moment(formData.End_Date).format("YYYY-MM-DD");

      const response = await axios.post(
        `${API_BASE_URL}/api/Projects/Create`,
        {
          Org_Id: orgId.Org_Id,
          Project_Name: formData.Project_Name,
          Start_Date: formattedStartDate,
          End_Date: formattedEndDate,
          Progress: formData.Progress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      setFormData({
        Org_Id: "",
        Progress: "",
        Project_Name: "",
        Start_Date: "",
        End_Date: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // fetch project
  const [Projectlist, setProjectlist] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const org = orgId.Org_Id;
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Projects/OrgProjectsList?OrgId=${org}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjectlist(response.data);
      for (const training of response.data) {
        await fetchTrainingPersons(training.Project_Id);
      }
      for (const training of response.data) {
        await fetchTrainingappo(training.Project_Id);
      }
    } catch (error) {
      console.error("Error fetching training list:", error);
    }
  };
  // fetchData();
  useEffect(() => {
    fetchData(orgId.Org_Id);
  }, [orgId]);
  const handleRequestButtonClick = (Project_Id) => {
    setSelectedTrainingId(Project_Id);
    fetchTrainingPersons(Project_Id);
    fetchTrainingappo(Project_Id);
  };

  const [requestedMap, setRequestedMap] = useState([]);
  const [ApprovedMap, setApproved] = useState([]);
  const fetchTrainingPersons = async (Project_Id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/ProjectUsers/GetUsersByProject?Project_Id=${Project_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequestedMap((prevRequestedMap) => ({
        ...prevRequestedMap,
        [Project_Id]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching training persons data:", error);
    }
  };
  useEffect(() => {
    for (const training of Projectlist) {
      fetchTrainingPersons(training.Project_Id);
    }
  }, [Projectlist]);

  const fetchTrainingappo = async (Project_Id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/ProjectUsers/GetUsersByProject?Project_Id=${Project_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApproved((prevRequestedMap) => ({
        ...prevRequestedMap,
        [Project_Id]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching training persons data:", error);
    }
  };
  useEffect(() => {
    for (const training of Projectlist) {
      fetchTrainingappo(training.Project_Id);
    }
  }, [Projectlist]);

  //update project
  const [editFormData, setEditFormData] = useState({
    Project_Id: "",
    Org_Id: "",
    Org_Name: "",
    Project_Name: "",
    Start_Date: "",
    End_Date: "",
    Progress: "",
  });
  const handleEditClick = (ProjectId) => {
    const selectedTraining = Projectlist.find(
      (training) => training.Project_Id === ProjectId
    );
    setEditFormData({
      Org_Id: selectedTraining.Org_Id,
      Project_Id: selectedTraining.Project_Id,
      Project_Name: selectedTraining.Project_Name,
      Start_Date: moment(selectedTraining.Start_Date).format("YYYY-MM-DD"),
      End_Date: moment(selectedTraining.End_Date).format("YYYY-MM-DD"),
      Progress: selectedTraining.Progress,
    });

    setEditFormData(selectedTraining);
    // setSelectedTrainingId(trainingId);
  };

  const handleUpdateClick = async () => {
    const personId = localStorage.getItem("Person_Id");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error(
          "No token found in local storage. You should handle authentication."
        );
        return;
      }

      const formattedStartDate = moment(editFormData.Start_Date).format(
        "YYYY-MM-DD"
      );
      const formattedEndDate = moment(editFormData.End_Date).format(
        "YYYY-MM-DD"
      );

      const response = await axios.put(
        `${API_BASE_URL}/api/Projects/Update`,
        {
          Person_Id: personId,
          Project_Id: editFormData.Project_Id,
          Org_Id: orgId.Org_Id,
          Project_Name: editFormData.Project_Name,
          Start_Date: formattedStartDate,
          End_Date: formattedEndDate,
          Progress: editFormData.Progress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Training updated successfully:", response.data);

      setEditFormData({
        Org_Id: "",
        Org_Name: "",
        Project_Name: "",
        Start_Date: "",
        End_Date: "",
        Progress: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error updating training:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // D project
  const handleDeleteClick = async (ProjectId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${API_BASE_URL}/api/Projects/Delete?id=${ProjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTrainingList = Projectlist.filter(
        (training) => training.Project_Id !== ProjectId
      );
      setProjectlist(updatedTrainingList);
    } catch (error) {
      console.error("Error deleting training:", error);
    }
  };

  // Take project
  const [DataTake, setDataTake] = useState([]);
  const fetchDataTake = async () => {
    const org = orgId.Org_Id;
    const token = localStorage.getItem("token");
    const personId = localStorage.getItem("Person_Id");
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Projects/OrgProjectsList?OrgId=${org}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDataTake(response.data);
    } catch (error) {
      console.error("Error fetching training list:", error);
    }
  };
  useEffect(() => {
    fetchDataTake(orgId.Org_Id);
  }, [orgId]);
  //user req project
  const [Trainingout6, setTrainingout6] = useState([]);
  const fetchData2 = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/ProjectUsers/User/Projects?isApproved=flase`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrainingout6(response.data);
    } catch (error) {
      console.error("Error fetching training list:", error);
    }
  };
  useEffect(() => {
    fetchData2();
  }, []);

  //delete
  const handleLeaveClick2 = async (Id, Project_Id) => {
    const token = localStorage.getItem("token");
    const personId = localStorage.getItem("Person_Id");
    try {
      await axios.delete(
        `${API_BASE_URL}api/ProjectUsers/Delete?id=${Id}&project_Id=${Project_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrainingout6((prevList) =>
        prevList.filter((training) => training.Id !== Id)
      );
      setTrainingout6((prevList) =>
        prevList.filter((training) => training.Project_Id !== Project_Id)
      );
    } catch (error) {
      console.error("Error leaving training:", error);
    }
  };
  //joined
  const [trainingList1, setTrainingList1] = useState([]);

  const fetchData1 = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/ProjectUsers/User/Projects?isApproved=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrainingList1(response.data);
      // for (const training of response.data) {
      //   await fetchTrainingCriteria(training.Training_Id);
      // }
    } catch (error) {
      console.error("Error fetching training list:", error);
    }
  };
  useEffect(() => {
    fetchData1();
  }, []);
  // Approved
  const handleApprove = async (Person_Id, Project_Id, Id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/ProjectUsers/Update`,
        {
          Id: Id,
          Person_Id: Person_Id,
          Project_Id: Project_Id,
          IsApproved: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApproved(true);
      await fetchTrainingPersons(Project_Id, false);
      await fetchTrainingPersons(Project_Id, true);
      alert("Training joined successfully");
      console.log("Training joined successfully:", response.data);
    } catch (error) {
      console.error("Error approving training:", error);
    }
  };
  // leave
  const handleLeaveClick1 = async (Id, Project_Id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${API_BASE_URL}/api/ProjectUsers/Delete?id=${Id}&project_Id=${Project_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchTrainingappo(Project_Id);
      await fetchTrainingPersons(Project_Id);
    } catch (error) {
      console.error("Error leaving training:", error);
    }
  };




  return (
    <div>
      <Header
        updateOrganizationData={handleOrganizationSwitch}
        onSelectOrganization={handleSelectOrganization}
      />
      <main id="main" className="main">
        <div className="d-flex justify-content-between align-items-center">
          <div className="pagetitle ">
            <h1>Project</h1>
            <nav>
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a href="index.html">Home</a>
                </li>
                <li class="breadcrumb-item">Users</li>
                <li class="breadcrumb-item active">Project</li>
              </ol>
            </nav>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#CreateTrainingModal"
            >
              Create Project
            </button>
          </div>

          <div class="modal fade" id="CreateTrainingModal" tabindex="-1">
            <div class="modal-dialog">
              <div
                class="modal-content1"
                style={{
                  width: "50%",
                  borderRadius: "5px",
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">Create Project</h5>
                  <button
                    type="button"
                    class="btn-training bi bi-x-square-fill"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body1">

                  <form onSubmit={handleSubmit}>
                    <div className="row justify-content-center mb-3">
                      <label
                        htmlFor="CreateProject"
                        className="col-md-2 col-lg-2 col-form-label"
                      >
                        Project_Name
                      </label>
                      <div className="col-md-10 col-lg-6">
                        <input
                          type="text"
                          className="form-control valid"
                          id="Project_Name"
                          name="Project_Name"
                          value={formData.Project_Name}
                          onChange={handleChangeTraining}
                          placeholder="Enter your Project Name"
                          aria-describedby="Training Name-error"
                          aria-invalid="false"
                          defaultValue=""
                        />
                      </div>
                    </div>

                    <div className="row justify-content-center mb-3">
                      <label
                        htmlFor="currentPassword"
                        className="col-md-2 col-lg-2 col-form-label"
                      >
                        Start_Date
                      </label>
                      <div className="col-md-10 col-lg-6">
                        <input
                          type="date"
                          className="form-control valid"
                          id="Start_Date"
                          name="Start_Date"
                          value={formData.Start_Date}
                          onChange={handleChangeTraining}
                          placeholder="Enter your Start_Date.."
                          aria-describedby="Start_Date-error"
                          aria-invalid="false"
                          defaultValue=""
                        />
                      </div>
                    </div>
                    <div className="row justify-content-center mb-3">
                      <label
                        htmlFor="currentPassword"
                        className="col-md-2 col-lg-2 col-form-label"
                      >
                        End_Date
                      </label>
                      <div className="col-md-10 col-lg-6">
                        <input
                          type="date"
                          className="form-control valid"
                          id="End_Date"
                          name="End_Date"
                          value={formData.End_Date}
                          onChange={handleChangeTraining}
                          placeholder="Enter your End_Date.."
                          aria-describedby="End_Date-error"
                          aria-invalid="false"
                          defaultValue=""
                        />
                      </div>
                    </div>
                    <div className="row justify-content-center mb-3">
                      <label
                        htmlFor="Progress"
                        className="col-md-2 col-lg-2 col-form-label"
                      >
                        Progress
                      </label>
                      <div className="col-md-10 col-lg-6">
                        <input
                          type="number"
                          className="form-control valid"
                          id="Progress"
                          name="Progress"
                          value={formData.Progress}
                          onChange={handleChangeTraining}
                          placeholder="Enter Project Progress"
                          aria-describedby="Grade-error"
                          aria-invalid="false"
                          defaultValue=""
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-center ml_10_">
                      <button type="submit" className="btn btn-primary">
                        Create
                      </button>
                    </div>
                  </form>


                </div>
              </div>
            </div>
          </div>
        </div>


        <section className="section profile">
          <div
            className="product-container grid-view"
            style={{ display: "block" }}
          >
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body pt-3">
                  <div className="row">
                    <div className="col-12 col-sm-7 col-md-9 col-lg-9">
                      <ul className="nav nav-tabs nav-tabs-bordered" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link active"
                            data-bs-toggle="tab"
                            data-bs-target="#profile-skill"
                            aria-selected="true"
                            role="tab"
                          >
                            Join Project
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            className="nav-link "
                            data-bs-toggle="tab"
                            data-bs-target="#Training_list"
                            aria-selected="false"
                            role="tab"
                            tabIndex={-1}
                          >
                            My Projects
                          </button>
                        </li>


                      </ul>
                    </div>

                    <div className="col-12 col-sm-5 col-md-3 col-lg-3">
                      <div id="example_filter" className="dataTables_filter text-end">
                        <label>
                          Search:
                          <input
                            type="search"
                            className="Serachfiltertraining"
                            placeholder=""
                            aria-controls="example"
                          />
                        </label>
                      </div>
                    </div>


                  </div>
                  <div className="tab-content pt-2">
                    <div
                      className="tab-pane fade profile-edit active pt-3  show"
                      id="profile-skill"
                      role="tabpanel"
                    >
                      <section className="section profile">
                        <div className="row">
                          {DataTake.map((training) => (
                            <div className=" col-md-6  col-lg-4 col-xl-4 col-xxl-3 mb-3">
                              <div className="box text-center"
                                style={{
                                  backgroundImage: `url(/assets/img/dateBg.png)`,
                                }}
                              >
                                <div
                                  className="icon"
                                  style={{ background: "#fceef3" }}
                                >
                                  <i
                                    className="bi bi-briefcase"
                                    style={{ color: "#ff689b" }}
                                  />
                                </div>
                                <h3>{training.Project_Name}</h3>
                                <div className="font_size1">
                                  {moment(training.Start_Date).format(
                                    "MMMM Do, YYYY"
                                  )}{" "}
                                  -{" "}
                                  {moment(training.End_Date).format(
                                    "MMMM Do, YYYY"
                                  )}
                                </div>

                                <div className="font_size1">
                                  Progress : {training.Progress}
                                </div>
                                <div className="text-center mt-2">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#JoinprojectjoinedDetailsmodel"
                                  >
                                    Details
                                  </button>
                                  <div
                                    className="modal fade"
                                    id="JoinprojectjoinedDetailsmodel"
                                    tabIndex={-1}
                                    aria-labelledby="exampleModalLabel"
                                    aria-hidden="true"
                                  >
                                    <div className="modal-dialog">
                                      <div className="modal-contentTakeTrainingDetails">

                                        <div className="modal-header justify-content-center">
                                          <h5 className="modal-title">Must Needed Criteria</h5>
                                          <button
                                            type="button"
                                            className="btn-training bi bi-x-circle-fill"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                          />
                                          <div className="box-container-11">
                                            <div className="box-111">
                                              <div className="mandatory-box-11" />
                                              <div className="label-11">Mandatory</div>
                                            </div>
                                            <div className="box-11">
                                              <div className="nonmandatory-box-111" />
                                              <div className="label-11">Non-Mandatory</div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="modal-body_1">
                                          <div className="card-body Trennign_box_pd">
                                            <h4 className="card-title  text-start p-0">Hobby</h4>
                                            <div
                                              className="  alert-dismissible fade show"
                                              role="alert"
                                              style={{ padding: 0 }}
                                            >
                                              <div className="d-flex flex-wrap">
                                                <button
                                                  type="button"
                                                  className="color-btn btn btn-secondary me-3 mb-1"
                                                >
                                                  Coding
                                                </button>
                                                <button
                                                  type="button"
                                                  className="color-btn1 btn btn-secondary me-3 mb-1"
                                                >
                                                  Frelancing
                                                </button>
                                                <button
                                                  type="button"
                                                  className="color-btn btn btn-secondary me-3 mb-1"
                                                >
                                                  Cricket
                                                </button>
                                                <button
                                                  type="button"
                                                  className="color-btn1 btn btn-secondary me-3 mb-1"
                                                >
                                                  Chess
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="card-body Trennign_box_pd">
                                            <h4 className="card-title  text-start p-0">Education</h4>
                                            <div
                                              className="alert-dismissible fade show text-start"
                                              role="alert"
                                              style={{ padding: 0 }}
                                            >
                                              <form>
                                                <div className="">
                                                  <button
                                                    type="button"
                                                    className="color-btn1 btn btn-secondary me-3 mb-1"
                                                  >
                                                    MBA
                                                  </button>
                                                  <button
                                                    type="button"
                                                    className="color-btn btn btn-secondary me-3 mb-1"
                                                  >
                                                    Figma
                                                  </button>
                                                  <button
                                                    type="button"
                                                    className="color-btn btn btn-secondary me-3 mb-1"
                                                  >
                                                    Photoshop
                                                  </button>
                                                </div>
                                              </form>
                                            </div>
                                          </div>
                                          <div className="card-body Trennign_box_pd">
                                            <h4 className="card-title  text-start p-0">Skills</h4>
                                            <div
                                              className="alert-dismissible fade show"
                                              role="alert"
                                              style={{ padding: 0 }}
                                            >
                                              <div className="row">
                                                <div className="col-sm-3 mb-2">
                                                  <div className="card-body card_list p-3">
                                                    <div className="text-start">
                                                      <div className="f_size_15">HTML</div>
                                                      <div>
                                                        <div className="Tre_join_list_all">20 Months</div>
                                                      </div>
                                                    </div>
                                                    <div />
                                                  </div>
                                                </div>
                                                <div className="col-sm-3 mb-2">
                                                  <div className="card-body card_list p-3">
                                                    <div className="text-start">
                                                      <div className="f_size_15">javaScript</div>
                                                      <div>
                                                        <div className="Tre_join_list_all">6 Months</div>
                                                      </div>
                                                    </div>
                                                    <div />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="card-body Trennign_box_pd">
                                            <h4 className="card-title  text-start p-0">Experience</h4>
                                            <div
                                              className="alert-dismissible fade show"
                                              role="alert"
                                              style={{ padding: 0 }}
                                            >
                                              <div className="row">
                                                <div className="col-sm-3 mb-2">
                                                  <div className="card-body card_list p-3">
                                                    <div className="text-start">
                                                      <div className="f_size_15">Graphic Designer</div>
                                                      <div className="Tre_join_list_all">VersaTribe</div>
                                                      <div className="Tre_join_list_all">2 Months</div>
                                                    </div>
                                                    <div />
                                                  </div>
                                                </div>
                                                <div className="col-sm-3 mb-2">
                                                  <div className="card-body card_list p-3">
                                                    <div className="text-start">
                                                      <div className="f_size_15">Web designer</div>
                                                      <div className="Tre_join_list_all">Ksquarez</div>
                                                      <div className="Tre_join_list_all">2 Months</div>
                                                    </div>
                                                    <div />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="ml_10_ d-flex justify-content-center">
                                            <button type="submit" className="color-btn btn btn-secondary me-3 mb-1 ">
                                              Join
                                            </button>
                                          </div>
                                        </div>

                                      </div>
                                    </div>
                                  </div>


                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                  <div className="tab-content pt-2">
                    <div
                      className="tab-pane fade profile-edit pt-3  show"
                      id="Training_list"
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
                                Created
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link"
                                data-bs-toggle="tab"
                                data-bs-target="#user-Userrequest34"
                                aria-selected="false"
                                role="tab"
                                tabIndex={-1}
                              >
                                Joined
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link "
                                data-bs-toggle="tab"
                                data-bs-target="#user-Alluser_1"
                                aria-selected="true"
                                role="tab"
                              >
                                Requested
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

                                <div className=" col-md-6  col-lg-4 col-xl-4 col-xxl-3">
                                  <div className="co ">
                                    <div className="card_list text-center">
                                      <div className="grid_section">
                                        <div>
                                          <h3>Html</h3>
                                          <div className="font_size1">

                                          </div>
                                          <div className="font_size1">
                                            {" "}
                                            Team Members - 7{" "}
                                          </div>
                                          <div className="font_size1">
                                            {" "}
                                            Progress :
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-center mt-2">
                                        <button
                                          type="submit"
                                          className="btn btn-sm btn-primary"
                                          data-bs-toggle="modal"
                                          data-bs-target="#basicModal"

                                        >
                                          Edit
                                        </button>
                                        <div
                                          className="modal fade"
                                          id="basicModal"
                                          tabIndex={-1}
                                        >
                                          <div className="modal-dialog">
                                            <div
                                              class="modal-content1"
                                              style={{
                                                width: "50%",
                                                borderRadius: "5px",
                                              }}
                                            >
                                              <div className="modal-header">
                                                <h5 className="modal-title">
                                                  Edit Your Project
                                                </h5>
                                                <button
                                                  type="button"
                                                  class="btn-training bi bi-x-square-fill"
                                                  data-bs-dismiss="modal"
                                                  aria-label="Close"
                                                ></button>
                                              </div>
                                              <div className="modal-body1">
                                                <form
                                                  onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleUpdateClick();
                                                  }}
                                                >
                                                  <div className="row justify-content-center mb-3">
                                                    <label
                                                      htmlFor="currentPassword"
                                                      className="col-md-2 col-lg-2 col-form-label"
                                                    >
                                                      Project Name
                                                    </label>
                                                    <div className="col-md-10 col-lg-6">
                                                      <input
                                                        type="text"
                                                        className="form-control valid"
                                                        id="Project_Name"
                                                        name="Project_Name"
                                                        placeholder="Enter Your Training Name.."
                                                        aria-describedby="Training Name-error"
                                                        defaultValue=""
                                                        value={
                                                          editFormData.Project_Name
                                                        }
                                                        onChange={(e) =>
                                                          setEditFormData({
                                                            ...editFormData,
                                                            Project_Name:
                                                              e.target.value,
                                                          })
                                                        }
                                                      />
                                                    </div>
                                                  </div>

                                                  <div className="row justify-content-center mb-3">
                                                    <label
                                                      htmlFor="currentPassword"
                                                      className="col-md-2 col-lg-2 col-form-label"
                                                    >
                                                      Start_Date
                                                    </label>
                                                    <div className="col-md-10 col-lg-6">
                                                      <input
                                                        type="date"
                                                        className="form-control valid"
                                                        id="Start_Date"
                                                        name="Start_Date"
                                                        placeholder="Enter your Start_Date.."
                                                        aria-describedby="Start_Date-error"
                                                        aria-invalid="false"
                                                        defaultValue=""
                                                        min={
                                                          new Date()
                                                            .toISOString()
                                                            .split("T")[0]
                                                        }
                                                        value={moment(
                                                          editFormData.Start_Date
                                                        ).format(
                                                          "YYYY-MM-DD"
                                                        )}
                                                        onChange={(e) =>
                                                          setEditFormData({
                                                            ...editFormData,
                                                            Start_Date:
                                                              e.target.value,
                                                          })
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="row justify-content-center mb-3">
                                                    <label
                                                      htmlFor="currentPassword"
                                                      className="col-md-2 col-lg-2 col-form-label"
                                                    >
                                                      End_Date
                                                    </label>
                                                    <div className="col-md-10 col-lg-6">
                                                      <input
                                                        type="date"
                                                        className="form-control valid"
                                                        id="End_Date"
                                                        name="End_Date"
                                                        placeholder="Enter your End_Date.."
                                                        aria-describedby="End_Date-error"
                                                        aria-invalid="false"
                                                        defaultValue=""
                                                        value={moment(
                                                          editFormData.End_Date
                                                        ).format(
                                                          "YYYY-MM-DD"
                                                        )}
                                                        onChange={(e) =>
                                                          setEditFormData({
                                                            ...editFormData,
                                                            End_Date:
                                                              e.target.value,
                                                          })
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="row justify-content-center mb-3">
                                                    <label
                                                      htmlFor="Grade"
                                                      className="col-md-2 col-lg-2 col-form-label"
                                                    >
                                                      Progress
                                                    </label>
                                                    <div className="col-md-10 col-lg-6">
                                                      <input
                                                        type="number"
                                                        className="form-control valid"
                                                        id="Progress"
                                                        name="Progress"
                                                        placeholder="Enter Person limit"
                                                        aria-describedby="Grade-error"
                                                        aria-invalid="false"
                                                        defaultValue=""
                                                        value={
                                                          editFormData.Progress
                                                        }
                                                        onChange={(e) =>
                                                          setEditFormData({
                                                            ...editFormData,
                                                            Progress:
                                                              e.target.value,
                                                          })
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="d-flex justify-content-center ml_10_">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-primary"
                                                      data-bs-dismiss="modal"
                                                    >
                                                      Update
                                                    </button>
                                                  </div>
                                                </form>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          className="btn btn-sm btn-primary"
                                          type="button"
                                          data-bs-toggle="offcanvas"
                                          data-bs-target="#offcanvasRight3"
                                        >
                                          Manage
                                        </button>
                                        <div
                                          className="offcanvas offcanvas-end offcanvas-width3"
                                          tabIndex={-1}
                                          id="offcanvasRight3"
                                          aria-labelledby="offcanvasRightLabel"
                                          aria-modal="true"
                                          role="dialog"
                                        >
                                          <div className="offcanvas-header">
                                            <h5 id="offcanvasRightLabel">
                                              Manage-Criteria
                                            </h5>
                                            <button
                                              type="button"
                                              className="bi bi-x-lg text-reset"
                                              data-bs-dismiss="offcanvas"
                                              aria-label="Close"
                                            />
                                          </div>
                                          <div className="offcanvas-body ">
                                            <div
                                              id="perseus-app"
                                              className="seller_onboarding_perseus"
                                            >
                                              <div className="row">
                                                <div className="col-sm-6 col-lg-6 col-xxl-6 onboarding-introduction">
                                                  <div className="wizard-steps seller-onboarding">
                                                    <div
                                                      id="professional_info"
                                                      title="Professional Info"
                                                      className="step"
                                                    >
                                                      <div className="onboarding-step professional-info">
                                                        <div
                                                          id="skills"
                                                          className="onboarding-field is-required"
                                                        >
                                                          <div className="d-block tb_pdb">
                                                            <h3 className="font-accent">
                                                              <span>
                                                                Hobby
                                                              </span>
                                                            </h3>
                                                          </div>
                                                          <div className="field-content">
                                                            <div className="inner-row skills">
                                                              <div
                                                                className="form-wrapper"
                                                                style={{
                                                                  display:
                                                                    formVisible1
                                                                      ? "block"
                                                                      : "none",
                                                                }}
                                                              >
                                                                <div className="d-flex">
                                                                  <div className="skill-name">
                                                                    <div className="orca-combo-box-container">
                                                                      <span
                                                                        aria-live="polite"
                                                                        aria-atomic="false"
                                                                        aria-relevant="additions text"
                                                                      ></span>
                                                                      <input
                                                                        type="email"
                                                                        className="form-control"
                                                                        id="exampleInputEmail1"
                                                                        aria-describedby="emailHelp"
                                                                        placeholder="Enter Hobby"
                                                                      />
                                                                    </div>
                                                                  </div>

                                                                  <span className="buttons-wrapper">
                                                                    <button
                                                                      className="btn cancel_btn"
                                                                      onClick={
                                                                        hideForm1
                                                                      }
                                                                    >
                                                                      Cancel
                                                                    </button>
                                                                    <button
                                                                      className="btn_add"
                                                                      disabled=""
                                                                    >
                                                                      Add
                                                                    </button>
                                                                  </span>
                                                                </div>
                                                                <div className="form-check mt_check">
                                                                  <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id="exampleCheck1"
                                                                  />
                                                                  <label
                                                                    className="form-check-label"
                                                                    htmlFor="exampleCheck1"
                                                                  >
                                                                    Check me
                                                                    out
                                                                  </label>
                                                                </div>
                                                              </div>
                                                              <table>
                                                                <thead>
                                                                  <tr>
                                                                    <th className="main">
                                                                      Hobby
                                                                    </th>
                                                                    <th className="manage addbtn_with1">
                                                                      <button
                                                                        className="addnew"
                                                                        onClick={
                                                                          showForm1
                                                                        }
                                                                      >
                                                                        Add
                                                                        New
                                                                      </button>
                                                                    </th>
                                                                  </tr>
                                                                </thead>
                                                                <tbody>
                                                                  <tr>
                                                                    <td>
                                                                      <span className="no-capitalization">
                                                                        Coding
                                                                      </span>
                                                                    </td>
                                                                    <td className="manage addbtn_with1">
                                                                      <div className="animate">
                                                                        <span
                                                                          className="hint--top"
                                                                          data-hint="Edit"
                                                                        >
                                                                          <button
                                                                            className="edit"
                                                                            onClick={
                                                                              showForm1
                                                                            }
                                                                          >
                                                                            Edit
                                                                            <svg
                                                                              width={
                                                                                15
                                                                              }
                                                                              height={
                                                                                15
                                                                              }
                                                                              viewBox="0 0 16 16"
                                                                            >
                                                                              <g fill="#B2B2B2">
                                                                                <path d="M2.198 9.948l7.686-7.536 3.655 3.583-7.687 7.536zM5.318 13.894L1.826 10.47l-.636 1.688-1.17 3.105a.311.311 0 0 0 .074.331.325.325 0 0 0 .337.073l3.135-1.137 1.752-.636zM15.555 1.754L14.211.436c-.638-.626-1.733-.568-2.44.126l-1.434 1.405L13.99 5.55l1.433-1.405c.709-.694.767-1.768.131-2.391" />
                                                                              </g>
                                                                            </svg>
                                                                          </button>
                                                                        </span>
                                                                        <span
                                                                          className="hint--top"
                                                                          data-hint="Delete"
                                                                        >
                                                                          <button className="remove">
                                                                            Delete
                                                                            <svg
                                                                              width={
                                                                                16
                                                                              }
                                                                              height={
                                                                                16
                                                                              }
                                                                            >
                                                                              <path d="M10.7 2.2c0 .1.1.2.3.2h2.2c.4 0 .7.3.7.7 0 .3-.2.6-.5.7L13 14.2c0 .8-.7 1.5-1.6 1.5H4.6c-.8 0-1.5-.7-1.6-1.5L2.7 3.8c-.3 0-.6-.3-.6-.6 0-.4.3-.7.7-.7H5c.1 0 .2-.1.3-.2l.2-.6C5.7.9 6.4.4 7.2.4h1.6c.8 0 1.5.6 1.7 1.3l.2.5zM7.5 5.7v7c0 .3.2.5.5.5s.5-.2.5-.5v-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zm-2.4 0l.2 7c0 .3.2.5.5.5s.5-.2.5-.5l-.2-7c0-.3-.2-.5-.5-.5s-.5.3-.5.5zm4.8 0l-.2 7c0 .3.2.5.5.5s.5-.2.5-.5l.2-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zM6.8 2.4h2.3c.1 0 .1 0 .1-.1L9.1 2c0-.1-.2-.3-.3-.3H7.2c-.1 0-.3.1-.3.3l-.1.4c-.1 0 0 0 0 0z" />
                                                                            </svg>
                                                                          </button>
                                                                        </span>
                                                                      </div>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <aside className="butter-toast-tray top-center">
                                                        <div className="wrapper" />
                                                      </aside>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-sm-6 col-lg-6 col-xxl-6 onboarding-introduction">
                                                  <div className="wizard-steps seller-onboarding">
                                                    <div
                                                      id="professional_info"
                                                      title="Professional Info"
                                                      className="step"
                                                    >
                                                      <div className="onboarding-step professional-info">
                                                        <div
                                                          id="skills"
                                                          className="onboarding-field is-required"
                                                        >
                                                          <aside>
                                                            <h3 className="font-accent">
                                                              <span>
                                                                Qualification
                                                              </span>
                                                            </h3>
                                                          </aside>
                                                          <div className="field-content">
                                                            <div className="inner-row skills">
                                                              <div
                                                                className="form-wrapper"
                                                                style={{
                                                                  display:
                                                                    formVisible3
                                                                      ? "block"
                                                                      : "none",
                                                                }}
                                                              >
                                                                <div className="d-flex">
                                                                  <div className="skill-name">
                                                                    <div className="orca-combo-box-container">
                                                                      <span
                                                                        aria-live="polite"
                                                                        aria-atomic="false"
                                                                        aria-relevant="additions text"
                                                                      ></span>
                                                                      <input
                                                                        type="skill"
                                                                        className="form-control"
                                                                        id="exampleInputEmail1"
                                                                        aria-describedby="emailHelp"
                                                                        placeholder="Enter Qualification"
                                                                      ></input>
                                                                    </div>
                                                                  </div>

                                                                  <span className="buttons-wrapper">
                                                                    <button
                                                                      className="btn cancel_btn"
                                                                      onClick={
                                                                        hideForm3
                                                                      }
                                                                    >
                                                                      Cancel
                                                                    </button>
                                                                    <button
                                                                      className="btn_add"
                                                                      disabled=""
                                                                    >
                                                                      Add
                                                                    </button>
                                                                  </span>
                                                                </div>
                                                                <div className="form-check mt_check">
                                                                  <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id="exampleCheck1"
                                                                  />
                                                                  <label
                                                                    className="form-check-label"
                                                                    htmlFor="exampleCheck1"
                                                                  >
                                                                    Mandatory
                                                                    or Not
                                                                  </label>
                                                                </div>
                                                              </div>
                                                              <table>
                                                                <thead>
                                                                  <tr>
                                                                    <th className="main">
                                                                      Education
                                                                    </th>
                                                                    <th className="manage addbtn_with1">
                                                                      <button
                                                                        className="addnew"
                                                                        onClick={
                                                                          showForm3
                                                                        }
                                                                      >
                                                                        Add
                                                                        New
                                                                      </button>
                                                                    </th>
                                                                  </tr>
                                                                </thead>
                                                                <tbody>
                                                                  <tr>
                                                                    <td>
                                                                      <span className="no-capitalization">
                                                                        BCA
                                                                      </span>
                                                                    </td>
                                                                    <td className="manage addbtn_with1">
                                                                      <div className="animate">
                                                                        <span
                                                                          className="hint--top"
                                                                          data-hint="Edit"
                                                                        >
                                                                          <button
                                                                            className="edit"
                                                                            onClick={
                                                                              showForm3
                                                                            }
                                                                          >
                                                                            Edit
                                                                            <svg
                                                                              width={
                                                                                15
                                                                              }
                                                                              height={
                                                                                15
                                                                              }
                                                                              viewBox="0 0 16 16"
                                                                            >
                                                                              <g fill="#B2B2B2">
                                                                                <path d="M2.198 9.948l7.686-7.536 3.655 3.583-7.687 7.536zM5.318 13.894L1.826 10.47l-.636 1.688-1.17 3.105a.311.311 0 0 0 .074.331.325.325 0 0 0 .337.073l3.135-1.137 1.752-.636zM15.555 1.754L14.211.436c-.638-.626-1.733-.568-2.44.126l-1.434 1.405L13.99 5.55l1.433-1.405c.709-.694.767-1.768.131-2.391" />
                                                                              </g>
                                                                            </svg>
                                                                          </button>
                                                                        </span>
                                                                        <span
                                                                          className="hint--top"
                                                                          data-hint="Delete"
                                                                        >
                                                                          <button className="remove">
                                                                            Delete
                                                                            <svg
                                                                              width={
                                                                                16
                                                                              }
                                                                              height={
                                                                                16
                                                                              }
                                                                            >
                                                                              <path d="M10.7 2.2c0 .1.1.2.3.2h2.2c.4 0 .7.3.7.7 0 .3-.2.6-.5.7L13 14.2c0 .8-.7 1.5-1.6 1.5H4.6c-.8 0-1.5-.7-1.6-1.5L2.7 3.8c-.3 0-.6-.3-.6-.6 0-.4.3-.7.7-.7H5c.1 0 .2-.1.3-.2l.2-.6C5.7.9 6.4.4 7.2.4h1.6c.8 0 1.5.6 1.7 1.3l.2.5zM7.5 5.7v7c0 .3.2.5.5.5s.5-.2.5-.5v-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zm-2.4 0l.2 7c0 .3.2.5.5.5s.5-.2.5-.5l-.2-7c0-.3-.2-.5-.5-.5s-.5.3-.5.5zm4.8 0l-.2 7c0 .3.2.5.5.5s.5-.2.5-.5l.2-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zM6.8 2.4h2.3c.1 0 .1 0 .1-.1L9.1 2c0-.1-.2-.3-.3-.3H7.2c-.1 0-.3.1-.3.3l-.1.4c-.1 0 0 0 0 0z" />
                                                                            </svg>
                                                                          </button>
                                                                        </span>
                                                                      </div>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <aside className="butter-toast-tray top-center">
                                                        <div className="wrapper" />
                                                      </aside>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-sm-8 col-lg-8 col-xxl-8 onboarding-introduction">
                                                  <div className="wizard-steps seller-onboarding">
                                                    <div
                                                      id="professional_info"
                                                      title="Professional Info"
                                                      className="step"
                                                    >
                                                      <div className="onboarding-step professional-info">
                                                        <div
                                                          id="skills"
                                                          className="onboarding-field is-required"
                                                        >
                                                          <aside>
                                                            <h3 className="font-accent">
                                                              <span>
                                                                Skills
                                                              </span>
                                                            </h3>
                                                          </aside>
                                                          <div className="field-content">
                                                            <div className="inner-row skills">
                                                              <div
                                                                className="form-wrapper"
                                                                style={{
                                                                  display:
                                                                    formVisible2
                                                                      ? "block"
                                                                      : "none",
                                                                }}
                                                              >
                                                                <div className="d-flex">
                                                                  <div className="skill-name">
                                                                    <div className="orca-combo-box-container">
                                                                      <span
                                                                        aria-live="polite"
                                                                        aria-atomic="false"
                                                                        aria-relevant="additions text"
                                                                      ></span>
                                                                      <input
                                                                        type="skill"
                                                                        className="form-control"
                                                                        id="exampleInputEmail1"
                                                                        aria-describedby="emailHelp"
                                                                        placeholder="Enter skill"
                                                                      ></input>
                                                                    </div>
                                                                  </div>
                                                                  <div className="experience">
                                                                    <div className="orca-combo-box-container">
                                                                      <span
                                                                        aria-live="polite"
                                                                        aria-atomic="false"
                                                                        aria-relevant="additions text"
                                                                      ></span>
                                                                      <input
                                                                        type="skill"
                                                                        className="form-control"
                                                                        id="exampleInputEmail1"
                                                                        aria-describedby="emailHelp"
                                                                        placeholder="Enter experience"
                                                                      ></input>
                                                                    </div>
                                                                  </div>
                                                                  <span className="buttons-wrapper">
                                                                    <button
                                                                      className="btn cancel_btn"
                                                                      onClick={
                                                                        hideForm2
                                                                      }
                                                                    >
                                                                      Cancel
                                                                    </button>
                                                                    <button
                                                                      className="btn_add"
                                                                      disabled=""
                                                                    >
                                                                      Add
                                                                    </button>
                                                                  </span>
                                                                </div>
                                                                <div className="form-check mt_check">
                                                                  <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id="exampleCheck1"
                                                                  />
                                                                  <label
                                                                    className="form-check-label"
                                                                    htmlFor="exampleCheck1"
                                                                  >
                                                                    Mandatory
                                                                    or Not
                                                                  </label>
                                                                </div>
                                                              </div>
                                                              <table>
                                                                <thead>
                                                                  <tr>
                                                                    <th className="main">
                                                                      Skill
                                                                    </th>
                                                                    <th className="secondary">
                                                                      Experience
                                                                    </th>
                                                                    <th className="manage addbtn_with1">
                                                                      <button
                                                                        className="addnew"
                                                                        onClick={
                                                                          showForm2
                                                                        }
                                                                      >
                                                                        Add
                                                                        New
                                                                      </button>
                                                                    </th>
                                                                  </tr>
                                                                </thead>
                                                                <tbody>
                                                                  <tr>
                                                                    <td>
                                                                      <span className="no-capitalization">
                                                                        HTML5
                                                                      </span>
                                                                    </td>
                                                                    <td className="language-level">
                                                                      18
                                                                      Months
                                                                    </td>
                                                                    <td className="manage">
                                                                      <div className="animate">
                                                                        <span
                                                                          className="hint--top"
                                                                          data-hint="Edit"
                                                                        >
                                                                          <button
                                                                            className="edit"
                                                                            onClick={
                                                                              showForm2
                                                                            }
                                                                          >
                                                                            Edit
                                                                            <svg
                                                                              width={
                                                                                15
                                                                              }
                                                                              height={
                                                                                15
                                                                              }
                                                                              viewBox="0 0 16 16"
                                                                            >
                                                                              <g fill="#B2B2B2">
                                                                                <path d="M2.198 9.948l7.686-7.536 3.655 3.583-7.687 7.536zM5.318 13.894L1.826 10.47l-.636 1.688-1.17 3.105a.311.311 0 0 0 .074.331.325.325 0 0 0 .337.073l3.135-1.137 1.752-.636zM15.555 1.754L14.211.436c-.638-.626-1.733-.568-2.44.126l-1.434 1.405L13.99 5.55l1.433-1.405c.709-.694.767-1.768.131-2.391" />
                                                                              </g>
                                                                            </svg>
                                                                          </button>
                                                                        </span>
                                                                        <span
                                                                          className="hint--top"
                                                                          data-hint="Delete"
                                                                        >
                                                                          <button className="remove">
                                                                            Delete
                                                                            <svg
                                                                              width={
                                                                                16
                                                                              }
                                                                              height={
                                                                                16
                                                                              }
                                                                            >
                                                                              <path d="M10.7 2.2c0 .1.1.2.3.2h2.2c.4 0 .7.3.7.7 0 .3-.2.6-.5.7L13 14.2c0 .8-.7 1.5-1.6 1.5H4.6c-.8 0-1.5-.7-1.6-1.5L2.7 3.8c-.3 0-.6-.3-.6-.6 0-.4.3-.7.7-.7H5c.1 0 .2-.1.3-.2l.2-.6C5.7.9 6.4.4 7.2.4h1.6c.8 0 1.5.6 1.7 1.3l.2.5zM7.5 5.7v7c0 .3.2.5.5.5s.5-.2.5-.5v-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zm-2.4 0l.2 7c0 .3.2.5.5.5s.5-.2.5-.5l-.2-7c0-.3-.2-.5-.5-.5s-.5.3-.5.5zm4.8 0l-.2 7c0 .3.2.5.5.5s.5-.2.5-.5l.2-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zM6.8 2.4h2.3c.1 0 .1 0 .1-.1L9.1 2c0-.1-.2-.3-.3-.3H7.2c-.1 0-.3.1-.3.3l-.1.4c-.1 0 0 0 0 0z" />
                                                                            </svg>
                                                                          </button>
                                                                        </span>
                                                                      </div>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <aside className="butter-toast-tray top-center">
                                                        <div className="wrapper" />
                                                      </aside>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-sm-12 col-lg-12 col-xxl-12 onboarding-introduction">
                                                  <div className="wizard-steps seller-onboarding">
                                                    <div
                                                      id="professional_info"
                                                      title="Professional Info"
                                                      className="step"
                                                    >
                                                      <div className="onboarding-step professional-info">
                                                        <div
                                                          id="skills"
                                                          className="onboarding-field is-required"
                                                        >
                                                          <aside>
                                                            <h3 className="font-accent">
                                                              <span>
                                                                Experience
                                                              </span>
                                                            </h3>
                                                          </aside>
                                                          <div className="field-content">
                                                            <div className="inner-row skills">
                                                              <div
                                                                className="form-wrapper"

                                                              >
                                                                <div className="d-flex">
                                                                  <div className="skill-name">
                                                                    <div className="orca-combo-box-container">
                                                                      <span
                                                                        aria-live="polite"
                                                                        aria-atomic="false"
                                                                        aria-relevant="additions text"
                                                                      ></span>
                                                                      <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="exampleInputEmail1"
                                                                        aria-describedby="emailHelp"
                                                                        placeholder="Enter Company_Name"
                                                                      ></input>
                                                                    </div>
                                                                  </div>
                                                                  <div className="experience">
                                                                    <div className="orca-combo-box-container">
                                                                      <span
                                                                        aria-live="polite"
                                                                        aria-atomic="false"
                                                                        aria-relevant="additions text"
                                                                      ></span>
                                                                      <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="exampleInputEmail1"
                                                                        aria-describedby="emailHelp"
                                                                        placeholder="Enter Industry"
                                                                      ></input>
                                                                    </div>
                                                                  </div>
                                                                  <div className="experience">
                                                                    <div className="orca-combo-box-container">
                                                                      <span
                                                                        aria-live="polite"
                                                                        aria-atomic="false"
                                                                        aria-relevant="additions text"
                                                                      ></span>
                                                                      <input
                                                                        type="date"
                                                                        className="form-control"
                                                                        id="exampleInputEmail1"
                                                                        aria-describedby="emailHelp"
                                                                        placeholder="Enter Industry"
                                                                      ></input>
                                                                    </div>
                                                                  </div>
                                                                  <div className="experience">
                                                                    <div className="orca-combo-box-container">
                                                                      <span
                                                                        aria-live="polite"
                                                                        aria-atomic="false"
                                                                        aria-relevant="additions text"
                                                                      ></span>
                                                                      <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="exampleInputEmail1"
                                                                        aria-describedby="emailHelp"
                                                                        placeholder="Enter Job_Title"
                                                                      ></input>
                                                                    </div>
                                                                  </div>
                                                                  <span className="buttons-wrapper">
                                                                    <button
                                                                      className="btn cancel_btn"
                                                                      onClick={
                                                                        hideForm4
                                                                      }
                                                                    >
                                                                      Cancel
                                                                    </button>
                                                                    <button
                                                                      className="btn_add"
                                                                      disabled=""
                                                                    >
                                                                      Add
                                                                    </button>
                                                                  </span>
                                                                </div>
                                                                <div className="form-check mt_check">
                                                                  <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id="exampleCheck1"
                                                                  />
                                                                  <label
                                                                    className="form-check-label"
                                                                    htmlFor="exampleCheck1"
                                                                  >
                                                                    Mandatory
                                                                    or Not
                                                                  </label>
                                                                </div>
                                                              </div>
                                                              <table>
                                                                <thead>
                                                                  <tr>
                                                                    <th className="main">
                                                                      Company_Name
                                                                    </th>
                                                                    <th className="secondary">
                                                                      Industry
                                                                    </th>
                                                                    <th className="secondary">
                                                                      Experience
                                                                    </th>
                                                                    <th className="secondary">
                                                                      Job Post
                                                                    </th>
                                                                    <th className="manage addbtn_with">
                                                                      <button
                                                                        className="addnew"
                                                                        onClick={
                                                                          showForm4
                                                                        }
                                                                      >
                                                                        Add
                                                                        New
                                                                      </button>
                                                                    </th>
                                                                  </tr>
                                                                </thead>
                                                                <tbody>
                                                                  <tr>
                                                                    <td>
                                                                      <span className="no-capitalization">
                                                                        Ksquarez
                                                                      </span>
                                                                    </td>
                                                                    <td className="language-level">
                                                                      ---
                                                                    </td>
                                                                    <td className="language-level">
                                                                      12
                                                                      Months
                                                                    </td>
                                                                    <td className="language-level">
                                                                      Designer
                                                                    </td>
                                                                    <td className="manage">
                                                                      <div className="animate">
                                                                        <span
                                                                          className="hint--top"
                                                                          data-hint="Edit"
                                                                        >
                                                                          <button
                                                                            className="edit"
                                                                            onClick={
                                                                              showForm4
                                                                            }
                                                                          >
                                                                            Edit
                                                                            <svg
                                                                              width={
                                                                                15
                                                                              }
                                                                              height={
                                                                                15
                                                                              }
                                                                              viewBox="0 0 16 16"
                                                                            >
                                                                              <g fill="#B2B2B2">
                                                                                <path d="M2.198 9.948l7.686-7.536 3.655 3.583-7.687 7.536zM5.318 13.894L1.826 10.47l-.636 1.688-1.17 3.105a.311.311 0 0 0 .074.331.325.325 0 0 0 .337.073l3.135-1.137 1.752-.636zM15.555 1.754L14.211.436c-.638-.626-1.733-.568-2.44.126l-1.434 1.405L13.99 5.55l1.433-1.405c.709-.694.767-1.768.131-2.391" />
                                                                              </g>
                                                                            </svg>
                                                                          </button>
                                                                        </span>
                                                                        <span
                                                                          className="hint--top"
                                                                          data-hint="Delete"
                                                                        >
                                                                          <button className="remove">
                                                                            Delete
                                                                            <svg
                                                                              width={
                                                                                16
                                                                              }
                                                                              height={
                                                                                16
                                                                              }
                                                                            >
                                                                              <path d="M10.7 2.2c0 .1.1.2.3.2h2.2c.4 0 .7.3.7.7 0 .3-.2.6-.5.7L13 14.2c0 .8-.7 1.5-1.6 1.5H4.6c-.8 0-1.5-.7-1.6-1.5L2.7 3.8c-.3 0-.6-.3-.6-.6 0-.4.3-.7.7-.7H5c.1 0 .2-.1.3-.2l.2-.6C5.7.9 6.4.4 7.2.4h1.6c.8 0 1.5.6 1.7 1.3l.2.5zM7.5 5.7v7c0 .3.2.5.5.5s.5-.2.5-.5v-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zm-2.4 0l.2 7c0 .3.2.5.5.5s.5-.2.5-.5l-.2-7c0-.3-.2-.5-.5-.5s-.5.3-.5.5zm4.8 0l-.2 7c0 .3.2.5.5.5s.5-.2.5-.5l.2-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zM6.8 2.4h2.3c.1 0 .1 0 .1-.1L9.1 2c0-.1-.2-.3-.3-.3H7.2c-.1 0-.3.1-.3.3l-.1.4c-.1 0 0 0 0 0z" />
                                                                            </svg>
                                                                          </button>
                                                                        </span>
                                                                      </div>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <aside className="butter-toast-tray top-center">
                                                        <div className="wrapper" />
                                                      </aside>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <button
                                          type="submit"
                                          className="btn btn-sm btn-primary"

                                        >
                                          Delete
                                        </button>
                                        <button
                                          className="btn btn-sm btn-primary"
                                          type="button"
                                          data-bs-toggle="offcanvas"
                                          data-bs-target="#offcanvasRight11a"
                                          onClick={() =>
                                            handleRequestButtonClick(
                                              training.Project_Id
                                            )
                                          }
                                        >
                                          Requests
                                        </button>

                                        <div
                                          className="offcanvas offcanvas-end offcanvas-width1"
                                          tabIndex={-1}
                                          id="offcanvasRight11a"
                                          aria-labelledby="offcanvasRightLabel"
                                        >
                                          <div className="offcanvas-header">
                                            <button
                                              type="button"
                                              className="btn-close text-reset"
                                              data-bs-dismiss="offcanvas"
                                              aria-label="Close"
                                            />
                                          </div>
                                          <div className="offcanvas-body ">
                                            <div className="card">
                                              <div className="card-body pt-4">
                                                <ul
                                                  className="nav nav-tabs nav-tabs-bordered"
                                                  role="tablist"
                                                >
                                                  <li
                                                    className="nav-item"
                                                    role="presentation"
                                                  >
                                                    <button
                                                      className="nav-link active"
                                                      data-bs-toggle="tab"
                                                      data-bs-target="#user-Alluser1_8"
                                                      aria-selected="true"
                                                      role="tab"
                                                    >
                                                      Requested
                                                    </button>
                                                  </li>
                                                  <li
                                                    className="nav-item"
                                                    role="presentation"
                                                  ></li>
                                                </ul>
                                                <div className="tab-content pt-4">
                                                  <div
                                                    className="tab-pane fade profile-overview active show"
                                                    id="user-Alluser1_8"
                                                    role="tabpanel"
                                                  >
                                                    <form>
                                                      <div className="row">
                                                        <div className="col-xl-12">
                                                          <div className="card">
                                                            <div className="card-body pt-4">
                                                              <div className="tab-content pt-4">
                                                                <div
                                                                  className="tab-pane fade profile-overview active show"
                                                                  id="user-Alluser"
                                                                  role="tabpanel"
                                                                >
                                                                  <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                                    <div className="datatable-top">
                                                                      <div className="datatable-dropdown" />
                                                                    </div>
                                                                    <div className="datatable-container">
                                                                      <table className="table datatable datatable-table">
                                                                        <thead>
                                                                          <tr>
                                                                            <th
                                                                              data-sortable="true"
                                                                              style={{
                                                                                width:
                                                                                  "1.63506%",
                                                                              }}
                                                                            >
                                                                              <a
                                                                                href="#"
                                                                                className="datatable-sorter"
                                                                              >
                                                                                Applicant_Name
                                                                              </a>
                                                                            </th>
                                                                            <th
                                                                              data-sortable="true"
                                                                              style={{
                                                                                width:
                                                                                  "1.9964%",
                                                                              }}
                                                                            >
                                                                              <a
                                                                                href="#"
                                                                                className="datatable-sorter"
                                                                              >
                                                                                Training_Name
                                                                              </a>
                                                                            </th>
                                                                            <th
                                                                              data-sortable="true"
                                                                              style={{
                                                                                width:
                                                                                  "3.21288%",
                                                                              }}
                                                                            >
                                                                              <a
                                                                                href="#"
                                                                                className=""
                                                                              >
                                                                                Actions
                                                                              </a>
                                                                            </th>
                                                                          </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                          {requestedMap[
                                                                            selectedTrainingId
                                                                          ] &&
                                                                            requestedMap[
                                                                              selectedTrainingId
                                                                            ].map(
                                                                              (
                                                                                trainingPerson
                                                                              ) => (
                                                                                <tr
                                                                                  key={
                                                                                    trainingPerson.Person_Id
                                                                                  }
                                                                                >
                                                                                  <td>
                                                                                    {
                                                                                      trainingPerson.FirstName
                                                                                    }{" "}
                                                                                    {
                                                                                      trainingPerson.LastName
                                                                                    }
                                                                                  </td>
                                                                                  <td>
                                                                                    {
                                                                                      trainingPerson.Project_Name
                                                                                    }
                                                                                  </td>
                                                                                  <td>
                                                                                    <div className="mt-2">
                                                                                      {trainingPerson.IsApproved ? (
                                                                                        <p>
                                                                                          Approved{" "}
                                                                                        </p>
                                                                                      ) : (
                                                                                        <>
                                                                                          <button
                                                                                            type="button"
                                                                                            className="btn btn-sm btn-primary"
                                                                                            onClick={() => {
                                                                                              handleApprove(
                                                                                                trainingPerson.Person_Id,
                                                                                                trainingPerson.Project_Id,
                                                                                                trainingPerson.Id,
                                                                                                setApproved // Assuming you have a state-setting function
                                                                                              );
                                                                                            }}
                                                                                          >
                                                                                            Approve
                                                                                          </button>
                                                                                        </>
                                                                                      )}

                                                                                      <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-primary"
                                                                                        onClick={() =>
                                                                                          handleLeaveClick1(
                                                                                            trainingPerson.Id,
                                                                                            trainingPerson.Project_Id
                                                                                          )
                                                                                        }
                                                                                      >
                                                                                        Reject
                                                                                      </button>
                                                                                    </div>
                                                                                  </td>
                                                                                </tr>
                                                                              )
                                                                            )}
                                                                        </tbody>
                                                                      </table>
                                                                    </div>
                                                                    <div className="datatable-bottom">
                                                                      <nav className="datatable-pagination">
                                                                        <ul className="datatable-pagination-list" />
                                                                      </nav>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                                <div
                                                                  className="tab-pane fade profile-edit pt-3"
                                                                  id="user-Userrequest"
                                                                  role="tabpanel"
                                                                >
                                                                  <div className="row">
                                                                    <div className="col-md-12 col-xl-12">
                                                                      <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                                        <div className="datatable-top">
                                                                          <div className="datatable-dropdown">
                                                                            <label>
                                                                              <select className="datatable-selector">
                                                                                <option
                                                                                  value={
                                                                                    5
                                                                                  }
                                                                                >
                                                                                  5
                                                                                </option>
                                                                                <option
                                                                                  value={
                                                                                    10
                                                                                  }
                                                                                >
                                                                                  10
                                                                                </option>
                                                                                <option
                                                                                  value={
                                                                                    15
                                                                                  }
                                                                                >
                                                                                  15
                                                                                </option>
                                                                                <option
                                                                                  value={
                                                                                    20
                                                                                  }
                                                                                >
                                                                                  20
                                                                                </option>
                                                                                <option
                                                                                  value={
                                                                                    25
                                                                                  }
                                                                                >
                                                                                  25
                                                                                </option>
                                                                              </select>{" "}
                                                                              entries
                                                                              per
                                                                              page
                                                                            </label>
                                                                          </div>
                                                                          <div className="datatable-search">
                                                                            <input
                                                                              className="datatable-input"
                                                                              placeholder="Search..."
                                                                              type="search"
                                                                              title="Search within table"
                                                                            />
                                                                          </div>
                                                                        </div>
                                                                        <div className="datatable-container">
                                                                          <table className="table datatable datatable-table">
                                                                            <thead>
                                                                              <tr>
                                                                                <th
                                                                                  data-sortable="true"
                                                                                  style={{
                                                                                    width:
                                                                                      "5.63506%",
                                                                                  }}
                                                                                >
                                                                                  <a
                                                                                    href="#"
                                                                                    className="datatable-sorter"
                                                                                  >
                                                                                    #
                                                                                  </a>
                                                                                </th>
                                                                                <th data-sortable="true">
                                                                                  <a
                                                                                    href="#"
                                                                                    className="datatable-sorter"
                                                                                  >
                                                                                    User_Name
                                                                                  </a>
                                                                                </th>
                                                                                <th
                                                                                  data-sortable="true"
                                                                                  style={{
                                                                                    width:
                                                                                      "12.8354%",
                                                                                  }}
                                                                                >
                                                                                  <a
                                                                                    href="#"
                                                                                    className="datatable-sorter"
                                                                                  >
                                                                                    Department
                                                                                  </a>
                                                                                </th>
                                                                                <th
                                                                                  data-sortable="true"
                                                                                  style={{
                                                                                    width:
                                                                                      "0.21288%",
                                                                                  }}
                                                                                />
                                                                                <th
                                                                                  data-sortable="true"
                                                                                  style={{
                                                                                    width:
                                                                                      "15.3202%",
                                                                                  }}
                                                                                >
                                                                                  <a
                                                                                    href="#"
                                                                                    className="datatable-sorter"
                                                                                  >
                                                                                    Date
                                                                                  </a>
                                                                                </th>
                                                                                <th
                                                                                  data-sortable="true"
                                                                                  style={{
                                                                                    width:
                                                                                      "15.3202%",
                                                                                  }}
                                                                                >
                                                                                  <a
                                                                                    href="#"
                                                                                    className="datatable-sorter"
                                                                                  >
                                                                                    Action
                                                                                  </a>
                                                                                </th>
                                                                              </tr>
                                                                            </thead>
                                                                          </table>
                                                                        </div>
                                                                        <div className="datatable-bottom">
                                                                          <div className="datatable-info">
                                                                            Showing
                                                                            1
                                                                            to
                                                                            5
                                                                            of
                                                                            5
                                                                            entries
                                                                          </div>
                                                                          <nav className="datatable-pagination">
                                                                            <ul className="datatable-pagination-list" />
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
                                                        <div className="col-xl-2" />
                                                      </div>
                                                    </form>
                                                  </div>
                                                  <div
                                                    className="tab-pane fade profile-edit pt-3"
                                                    id="user-Userrequest2_8"
                                                    role="tabpanel"
                                                  >
                                                    <form>
                                                      <div className="row">
                                                        <div className="col-xl-12">
                                                          <div className="card">
                                                            <div className="card-body pt-4">
                                                              <div className="tab-content pt-4">
                                                                <div
                                                                  className="tab-pane fade profile-overview active show"
                                                                  id="user-Alluser"
                                                                  role="tabpanel"
                                                                >
                                                                  <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                                    <div className="datatable-top">
                                                                      <div className="datatable-dropdown" />
                                                                    </div>
                                                                    <div className="datatable-container">
                                                                      <table className="table datatable datatable-table">
                                                                        <thead>
                                                                          <tr>
                                                                            <th
                                                                              data-sortable="true"
                                                                              style={{
                                                                                width:
                                                                                  "1.63506%",
                                                                              }}
                                                                            >
                                                                              <a
                                                                                href="#"
                                                                                className="datatable-sorter"
                                                                              >
                                                                                Applicant_Name
                                                                              </a>
                                                                            </th>
                                                                            <th
                                                                              data-sortable="true"
                                                                              style={{
                                                                                width:
                                                                                  "1.9964%",
                                                                              }}
                                                                            >
                                                                              <a
                                                                                href="#"
                                                                                className="datatable-sorter"
                                                                              >
                                                                                Training_Name
                                                                              </a>
                                                                            </th>
                                                                            <th
                                                                              data-sortable="true"
                                                                              style={{
                                                                                width:
                                                                                  "3.21288%",
                                                                              }}
                                                                            >
                                                                              <a
                                                                                href="#"
                                                                                className=""
                                                                              >
                                                                                Actions
                                                                              </a>
                                                                            </th>
                                                                          </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                          {ApprovedMap[
                                                                            selectedTrainingId
                                                                          ] &&
                                                                            ApprovedMap[
                                                                              selectedTrainingId
                                                                            ].map(
                                                                              (
                                                                                trainingPerson
                                                                              ) => (
                                                                                <tr
                                                                                  key={
                                                                                    trainingPerson.Person_Id
                                                                                  }
                                                                                >
                                                                                  {/* Your existing code for rendering table data */}
                                                                                  <td>
                                                                                    {
                                                                                      trainingPerson.FirstName
                                                                                    }{" "}
                                                                                    {
                                                                                      trainingPerson.LastName
                                                                                    }
                                                                                  </td>
                                                                                  <td>
                                                                                    {
                                                                                      trainingPerson.Training_Name
                                                                                    }
                                                                                  </td>
                                                                                  <td>
                                                                                    <div className="mt-2">
                                                                                      <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-primary"
                                                                                        onClick={() =>
                                                                                          handleLeaveClick1(
                                                                                            trainingPerson.Id,
                                                                                            trainingPerson.Project_Id
                                                                                          )
                                                                                        }
                                                                                      >
                                                                                        Reject
                                                                                      </button>
                                                                                    </div>
                                                                                  </td>
                                                                                </tr>
                                                                              )
                                                                            )}
                                                                        </tbody>
                                                                      </table>
                                                                    </div>
                                                                    <div className="datatable-bottom">
                                                                      <nav className="datatable-pagination">
                                                                        <ul className="datatable-pagination-list" />
                                                                      </nav>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                                <div
                                                                  className="tab-pane fade profile-edit pt-3"
                                                                  id="user-Userrequest"
                                                                  role="tabpanel"
                                                                >
                                                                  <div className="row">
                                                                    <div className="col-md-12 col-xl-12">
                                                                      <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                                        <div className="datatable-top">
                                                                          <div className="datatable-dropdown">
                                                                            <label>
                                                                              <select className="datatable-selector">
                                                                                <option
                                                                                  value={
                                                                                    5
                                                                                  }
                                                                                >
                                                                                  5
                                                                                </option>
                                                                                <option
                                                                                  value={
                                                                                    10
                                                                                  }
                                                                                >
                                                                                  10
                                                                                </option>
                                                                                <option
                                                                                  value={
                                                                                    15
                                                                                  }
                                                                                >
                                                                                  15
                                                                                </option>
                                                                                <option
                                                                                  value={
                                                                                    20
                                                                                  }
                                                                                >
                                                                                  20
                                                                                </option>
                                                                                <option
                                                                                  value={
                                                                                    25
                                                                                  }
                                                                                >
                                                                                  25
                                                                                </option>
                                                                              </select>{" "}
                                                                              entries
                                                                              per
                                                                              page
                                                                            </label>
                                                                          </div>
                                                                          <div className="datatable-search">
                                                                            <input
                                                                              className="datatable-input"
                                                                              placeholder="Search..."
                                                                              type="search"
                                                                              title="Search within table"
                                                                            />
                                                                          </div>
                                                                        </div>
                                                                        <div className="datatable-container">
                                                                          <table className="table datatable datatable-table">
                                                                            <thead>
                                                                              <tr>
                                                                                <th
                                                                                  data-sortable="true"
                                                                                  style={{
                                                                                    width:
                                                                                      "5.63506%",
                                                                                  }}
                                                                                >
                                                                                  <a
                                                                                    href="#"
                                                                                    className="datatable-sorter"
                                                                                  >
                                                                                    #
                                                                                  </a>
                                                                                </th>
                                                                                <th data-sortable="true">
                                                                                  <a
                                                                                    href="#"
                                                                                    className="datatable-sorter"
                                                                                  >
                                                                                    User_Name
                                                                                  </a>
                                                                                </th>
                                                                                <th
                                                                                  data-sortable="true"
                                                                                  style={{
                                                                                    width:
                                                                                      "12.8354%",
                                                                                  }}
                                                                                >
                                                                                  <a
                                                                                    href="#"
                                                                                    className="datatable-sorter"
                                                                                  >
                                                                                    Department
                                                                                  </a>
                                                                                </th>
                                                                                <th
                                                                                  data-sortable="true"
                                                                                  style={{
                                                                                    width:
                                                                                      "0.21288%",
                                                                                  }}
                                                                                />
                                                                                <th
                                                                                  data-sortable="true"
                                                                                  style={{
                                                                                    width:
                                                                                      "15.3202%",
                                                                                  }}
                                                                                >
                                                                                  <a
                                                                                    href="#"
                                                                                    className="datatable-sorter"
                                                                                  >
                                                                                    Date
                                                                                  </a>
                                                                                </th>
                                                                                <th
                                                                                  data-sortable="true"
                                                                                  style={{
                                                                                    width:
                                                                                      "15.3202%",
                                                                                  }}
                                                                                >
                                                                                  <a
                                                                                    href="#"
                                                                                    className="datatable-sorter"
                                                                                  >
                                                                                    Action
                                                                                  </a>
                                                                                </th>
                                                                              </tr>
                                                                            </thead>
                                                                          </table>
                                                                        </div>
                                                                        <div className="datatable-bottom">
                                                                          <div className="datatable-info">
                                                                            Showing
                                                                            1
                                                                            to
                                                                            5
                                                                            of
                                                                            5
                                                                            entries
                                                                          </div>
                                                                          <nav className="datatable-pagination">
                                                                            <ul className="datatable-pagination-list" />
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
                                                        <div className="col-xl-2" />
                                                      </div>
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
                            <div
                              className="tab-pane fade profile-edit pt-3"
                              id="user-Userrequest34"
                              role="tabpanel"
                            >
                              <section className="section profile">
                                <div className="row">

                                  <div className=" col-md-6  col-lg-4 col-xl-4 col-xxl-3 mb-3">
                                    <div className="card_list text-center">
                                      <h3> html</h3>
                                      {/* */}
                                      {/* 
                                  <div className="font_size1">
                                    01 sep,2023 - 01 otc, 2023
                                  </div>
                                  <div className="font_size1">
                                    bhaveshjoshi@gmail.com
                                  </div>
                                  <div className="font_size1">
                                    20 seats *99 aoolicant
                                  </div>
                                  */}

                                      <div className="text-center mt-2">
                                        {/* 
                                      <button
                                        // type="submit"
                                        className="btn btn-sm btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#joinModal"
                                        onClick={() =>
                                          handleDetailsClick(
                                            training.Training_Id
                                          )
                                        }
                                      >
                                        Details
                                      </button>
                                      */}
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-primary"
                                          data-bs-toggle="modal"
                                          data-bs-target="#MyprojectjoinedDetailsmodel"
                                        >
                                          Details
                                        </button>

                                        <button
                                          type="submit"
                                          className="btn btn-sm btn-primary"
                                        // onClick={() => handleLeaveClick(training.Training_Id)}
                                        >
                                          Leave
                                        </button>
                                        <div
                                          className="modal fade"
                                          id="MyprojectjoinedDetailsmodel"
                                          tabIndex={-1}
                                          aria-labelledby="exampleModalLabel"
                                          aria-hidden="true"
                                        >
                                          <div className="modal-dialog">
                                            <div className="modal-contentTakeTrainingDetails">

                                              <div className="modal-header justify-content-center">
                                                <h5 className="modal-title">Must Needed Criteria</h5>
                                                <button
                                                  type="button"
                                                  className="btn-training bi bi-x-circle-fill"
                                                  data-bs-dismiss="modal"
                                                  aria-label="Close"
                                                />
                                                <div className="box-container-11">
                                                  <div className="box-111">
                                                    <div className="mandatory-box-11" />
                                                    <div className="label-11">Mandatory</div>
                                                  </div>
                                                  <div className="box-11">
                                                    <div className="nonmandatory-box-111" />
                                                    <div className="label-11">Non-Mandatory</div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="modal-body_1">
                                                <div className="card-body Trennign_box_pd">
                                                  <h4 className="card-title  text-start p-0">Hobby</h4>
                                                  <div
                                                    className="  alert-dismissible fade show"
                                                    role="alert"
                                                    style={{ padding: 0 }}
                                                  >
                                                    <div className="d-flex flex-wrap">
                                                      <button
                                                        type="button"
                                                        className="color-btn btn btn-secondary me-3 mb-1"
                                                      >
                                                        Coding
                                                      </button>
                                                      <button
                                                        type="button"
                                                        className="color-btn1 btn btn-secondary me-3 mb-1"
                                                      >
                                                        Frelancing
                                                      </button>
                                                      <button
                                                        type="button"
                                                        className="color-btn btn btn-secondary me-3 mb-1"
                                                      >
                                                        Cricket
                                                      </button>
                                                      <button
                                                        type="button"
                                                        className="color-btn1 btn btn-secondary me-3 mb-1"
                                                      >
                                                        Chess
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="card-body Trennign_box_pd">
                                                  <h4 className="card-title  text-start p-0">Education</h4>
                                                  <div
                                                    className="alert-dismissible fade show text-start"
                                                    role="alert"
                                                    style={{ padding: 0 }}
                                                  >
                                                    <form>
                                                      <div className="">
                                                        <button
                                                          type="button"
                                                          className="color-btn1 btn btn-secondary me-3 mb-1"
                                                        >
                                                          MBA
                                                        </button>
                                                        <button
                                                          type="button"
                                                          className="color-btn btn btn-secondary me-3 mb-1"
                                                        >
                                                          Figma
                                                        </button>
                                                        <button
                                                          type="button"
                                                          className="color-btn btn btn-secondary me-3 mb-1"
                                                        >
                                                          Photoshop
                                                        </button>
                                                      </div>
                                                    </form>
                                                  </div>
                                                </div>
                                                <div className="card-body Trennign_box_pd">
                                                  <h4 className="card-title  text-start p-0">Skills</h4>
                                                  <div
                                                    className="alert-dismissible fade show"
                                                    role="alert"
                                                    style={{ padding: 0 }}
                                                  >
                                                    <div className="row">
                                                      <div className="col-sm-3 mb-2">
                                                        <div className="card-body card_list p-3">
                                                          <div className="text-start">
                                                            <div className="f_size_15">HTML</div>
                                                            <div>
                                                              <div className="Tre_join_list_all">20 Months</div>
                                                            </div>
                                                          </div>
                                                          <div />
                                                        </div>
                                                      </div>
                                                      <div className="col-sm-3 mb-2">
                                                        <div className="card-body card_list p-3">
                                                          <div className="text-start">
                                                            <div className="f_size_15">javaScript</div>
                                                            <div>
                                                              <div className="Tre_join_list_all">6 Months</div>
                                                            </div>
                                                          </div>
                                                          <div />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="card-body Trennign_box_pd">
                                                  <h4 className="card-title  text-start p-0">Experience</h4>
                                                  <div
                                                    className="alert-dismissible fade show"
                                                    role="alert"
                                                    style={{ padding: 0 }}
                                                  >
                                                    <div className="row">
                                                      <div className="col-sm-3 mb-2">
                                                        <div className="card-body card_list p-3">
                                                          <div className="text-start">
                                                            <div className="f_size_15">Graphic Designer</div>
                                                            <div className="Tre_join_list_all">VersaTribe</div>
                                                            <div className="Tre_join_list_all">2 Months</div>
                                                          </div>
                                                          <div />
                                                        </div>
                                                      </div>
                                                      <div className="col-sm-3 mb-2">
                                                        <div className="card-body card_list p-3">
                                                          <div className="text-start">
                                                            <div className="f_size_15">Web designer</div>
                                                            <div className="Tre_join_list_all">Ksquarez</div>
                                                            <div className="Tre_join_list_all">2 Months</div>
                                                          </div>
                                                          <div />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="ml_10_ d-flex justify-content-center">
                                                  <button type="submit" className="color-btn btn btn-secondary me-3 mb-1 ">
                                                    Join
                                                  </button>
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
                            </div>
                            <div
                              className="tab-pane fade profile-overview "
                              id="user-Alluser_1"
                              role="tabpanel"
                            >
                              <form>
                                <div className="row">
                                  <div className="col-xl-12">
                                    <div className="card list_tabel_bo">
                                      <div className="card-body pt-4">
                                        <div className="tab-content">
                                          <div
                                            className="tab-pane fade profile-overview active show"
                                            id="user-Alluser"
                                            role="tabpanel"
                                          >
                                            <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                              <div className="datatable-top">
                                                <div className="datatable-dropdown" />
                                              </div>
                                              <div className="datatable-container">
                                                <table className="table datatable datatable-table">
                                                  <thead>
                                                    <tr>
                                                      <th
                                                        data-sortable="true"
                                                        style={{
                                                          width: "4.63506%",
                                                        }}
                                                      >
                                                        <a
                                                          href="#"
                                                          className="datatable-sorter"
                                                        >
                                                          Number
                                                        </a>
                                                      </th>
                                                      <th
                                                        data-sortable="true"
                                                        style={{
                                                          width: "8.9964%",
                                                        }}
                                                      >
                                                        <a
                                                          href="#"
                                                          className="datatable-sorter"
                                                        >
                                                          Project Name
                                                        </a>
                                                      </th>
                                                      <th
                                                        data-sortable="true"
                                                        style={{
                                                          width: "9.21288%",
                                                        }}
                                                      >
                                                        <a
                                                          href="#"
                                                          className=""
                                                        >
                                                          Actions
                                                        </a>
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {Trainingout6.map(
                                                      (training, index) => (
                                                        <tr>
                                                          <td>{index + 1}</td>
                                                          <td>
                                                            {
                                                              training.Project_Name
                                                            }
                                                          </td>
                                                          <td>
                                                            <div className=" mt-2">
                                                              <div
                                                                className="modal fade"
                                                                id="basicModal"
                                                                tabIndex={-1}
                                                              >
                                                                <div className="modal-dialog">
                                                                  <div className="modal-content">
                                                                    <div className="modal-header">
                                                                      <h5 className="modal-title">
                                                                        Edit
                                                                        Your
                                                                        Training
                                                                      </h5>
                                                                      <button
                                                                        type="button"
                                                                        className="btn-training bi bi-x-square-fill"
                                                                        data-bs-dismiss="modal"
                                                                        aria-label="Close"
                                                                      />
                                                                    </div>
                                                                    <div className="modal-body1">
                                                                      <div className="row justify-content-center mb-3">
                                                                        <label
                                                                          htmlFor="currentPassword"
                                                                          className="col-md-2 col-lg-2 col-form-label"
                                                                        >
                                                                          Training_Name
                                                                        </label>
                                                                        <div className="col-md-10 col-lg-6">
                                                                          <input
                                                                            type="text"
                                                                            className="form-control valid"
                                                                            id="TrainingName"
                                                                            name="Training_Name"
                                                                            placeholder="Enter Your Training Name.."
                                                                            aria-describedby="Training Name-error"
                                                                            defaultValue=""
                                                                          />
                                                                        </div>
                                                                      </div>
                                                                      <div className="row justify-content-center mb-3">
                                                                        <label
                                                                          htmlFor="inputPassword"
                                                                          className="col-sm-2 col-form-label"
                                                                        >
                                                                          Description
                                                                        </label>
                                                                        <div className="col-md-10 col-lg-6">
                                                                          <textarea
                                                                            className="form-control"
                                                                            id="Description"
                                                                            name="Description"
                                                                            style={{
                                                                              height: 100,
                                                                            }}
                                                                            defaultValue={
                                                                              ""
                                                                            }
                                                                          />
                                                                        </div>
                                                                      </div>
                                                                      <div className="row justify-content-center mb-3">
                                                                        <label
                                                                          htmlFor="currentPassword"
                                                                          className="col-md-2 col-lg-2 col-form-label"
                                                                        >
                                                                          Start_Date
                                                                        </label>
                                                                        <div className="col-md-10 col-lg-6">
                                                                          <input
                                                                            type="date"
                                                                            className="form-control valid"
                                                                            id="Start_Date"
                                                                            name="Start_Date"
                                                                            placeholder="Enter your Start_Date.."
                                                                            aria-describedby="Start_Date-error"
                                                                            aria-invalid="false"
                                                                            defaultValue=""
                                                                          />
                                                                        </div>
                                                                      </div>
                                                                      <div className="row justify-content-center mb-3">
                                                                        <label
                                                                          htmlFor="currentPassword"
                                                                          className="col-md-2 col-lg-2 col-form-label"
                                                                        >
                                                                          End_Date
                                                                        </label>
                                                                        <div className="col-md-10 col-lg-6">
                                                                          <input
                                                                            type="date"
                                                                            className="form-control valid"
                                                                            id="End_Date"
                                                                            name="End_Date"
                                                                            placeholder="Enter your End_Date.."
                                                                            aria-describedby="End_Date-error"
                                                                            aria-invalid="false"
                                                                            defaultValue=""
                                                                          />
                                                                        </div>
                                                                      </div>
                                                                      <div className="row justify-content-center mb-3">
                                                                        <label
                                                                          htmlFor="Grade"
                                                                          className="col-md-2 col-lg-2 col-form-label"
                                                                        >
                                                                          Person
                                                                          limit
                                                                        </label>
                                                                        <div className="col-md-10 col-lg-6">
                                                                          <input
                                                                            type="number"
                                                                            className="form-control valid"
                                                                            id="PersonLimit"
                                                                            name="PersonLimit"
                                                                            placeholder="Enter Person limit"
                                                                            aria-describedby="Grade-error"
                                                                            aria-invalid="false"
                                                                            defaultValue=""
                                                                          />
                                                                        </div>
                                                                      </div>
                                                                      <div className="d-flex justify-content-center ml_10_">
                                                                        <button
                                                                          type="submit"
                                                                          className="btn btn-primary"
                                                                          data-bs-dismiss="modal"
                                                                        >
                                                                          Update
                                                                        </button>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                              <div
                                                                className="modal fade"
                                                                id="exampleModal1"
                                                                tabIndex={-1}
                                                                aria-labelledby="exampleModalLabel1"
                                                                aria-hidden="true"
                                                              >
                                                                <div className="modal-dialog mo_mr_0 mo_wi_100">
                                                                  <div className="modal-content rlm_50">
                                                                    <div className="closebtnf">
                                                                      <button
                                                                        type="button"
                                                                        className="btn-close btn-close1"
                                                                        data-bs-dismiss="modal"
                                                                        aria-label="Close"
                                                                      />
                                                                    </div>
                                                                    <div className="row mb-3">
                                                                      <label
                                                                        htmlFor="currentPassword"
                                                                        className="col-md-2 col-lg-2 col-form-label"
                                                                      >
                                                                        Training_Name
                                                                      </label>
                                                                      <div className="col-md-10 col-lg-6">
                                                                        <input
                                                                          type="text"
                                                                          className="form-control valid"
                                                                          id="Training Name"
                                                                          name="Training Name"
                                                                          placeholder="Enter your Training Name.."
                                                                          aria-describedby="Training Name-error"
                                                                          aria-invalid="false"
                                                                        />
                                                                      </div>
                                                                    </div>
                                                                    <div className="row mb-3">
                                                                      <label
                                                                        htmlFor="inputPassword"
                                                                        className="col-sm-2 col-form-label"
                                                                      >
                                                                        Textarea
                                                                      </label>
                                                                      <div className="col-md-10 col-lg-6">
                                                                        <textarea
                                                                          className="form-control"
                                                                          style={{
                                                                            height: 100,
                                                                          }}
                                                                          defaultValue={
                                                                            ""
                                                                          }
                                                                        />
                                                                      </div>
                                                                    </div>
                                                                    <div className="row mb-3">
                                                                      <label
                                                                        htmlFor="currentPassword"
                                                                        className="col-md-2 col-lg-2 col-form-label"
                                                                      >
                                                                        Start_Date
                                                                      </label>
                                                                      <div className="col-md-10 col-lg-6">
                                                                        <input
                                                                          type="date"
                                                                          className="form-control valid"
                                                                          id="Start_Date"
                                                                          name="Start_Date"
                                                                          placeholder="Enter your Start_Date.."
                                                                          aria-describedby="Start_Date-error"
                                                                          aria-invalid="false"
                                                                        />
                                                                      </div>
                                                                    </div>
                                                                    <div className="row mb-3">
                                                                      <label
                                                                        htmlFor="currentPassword"
                                                                        className="col-md-2 col-lg-2 col-form-label"
                                                                      >
                                                                        End_Date
                                                                      </label>
                                                                      <div className="col-md-10 col-lg-6">
                                                                        <input
                                                                          type="date"
                                                                          className="form-control valid"
                                                                          id="End_Date"
                                                                          name="End_Date"
                                                                          placeholder="Enter your End_Date.."
                                                                          aria-describedby="End_Date-error"
                                                                          aria-invalid="false"
                                                                        />
                                                                      </div>
                                                                    </div>
                                                                    <div className="row mb-3">
                                                                      <label
                                                                        htmlFor="Grade"
                                                                        className="col-md-2 col-lg-2 col-form-label"
                                                                      >
                                                                        Person
                                                                        limit
                                                                      </label>
                                                                      <div className="col-md-10 col-lg-6">
                                                                        <input
                                                                          type="number"
                                                                          className="form-control valid"
                                                                          id="Grade"
                                                                          name="Grade"
                                                                          placeholder="Enter Person limit"
                                                                          aria-describedby="Grade-error"
                                                                          aria-invalid="false"
                                                                          defaultValue=""
                                                                        />
                                                                      </div>
                                                                    </div>
                                                                    <div className="">
                                                                      <button
                                                                        type="submit"
                                                                        className="btn btn-primary"
                                                                      >
                                                                        Update
                                                                      </button>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                              <button
                                                                type="button"
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() =>
                                                                  handleLeaveClick2(
                                                                    training.Id,
                                                                    training.Project_Id
                                                                  )
                                                                }
                                                              >
                                                                Reject
                                                              </button>

                                                              <div
                                                                className="modal fade"
                                                                id="joinModal3"
                                                                tabIndex={-1}
                                                                aria-modal="true"
                                                                role="dialog"
                                                              >
                                                                <div className="modal-dialog">
                                                                  <div className="modal-content">
                                                                    <div className="modal-body1">
                                                                      <div className="card">
                                                                        <div className="card-body pt-4">
                                                                          <ul
                                                                            className="nav nav-tabs nav-tabs-bordered"
                                                                            role="tablist"
                                                                          >
                                                                            <li
                                                                              className="nav-item"
                                                                              role="presentation"
                                                                            >
                                                                              <button
                                                                                className="nav-link active"
                                                                                data-bs-toggle="tab"
                                                                                data-bs-target="#Requests3"
                                                                                aria-selected="true"
                                                                                role="tab"
                                                                              >
                                                                                Requested
                                                                              </button>
                                                                            </li>
                                                                            <li
                                                                              className="nav-item"
                                                                              role="presentation"
                                                                            >
                                                                              <button
                                                                                className="nav-link"
                                                                                data-bs-toggle="tab"
                                                                                data-bs-target="#Approved3"
                                                                                aria-selected="false"
                                                                                role="tab"
                                                                                tabIndex={
                                                                                  -1
                                                                                }
                                                                              >
                                                                                Approved
                                                                              </button>
                                                                            </li>
                                                                          </ul>
                                                                          <div className="tab-content pt-4">
                                                                            <div
                                                                              className="tab-pane fade profile-overview active show"
                                                                              id="Requests3"
                                                                              role="tabpanel"
                                                                            />
                                                                            <div
                                                                              className="tab-pane fade profile-edit pt-3"
                                                                              id="Approved3"
                                                                              role="tabpanel"
                                                                            >
                                                                              <div>
                                                                                {" "}
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
                                                          </td>
                                                        </tr>
                                                      )
                                                    )}
                                                  </tbody>
                                                </table>
                                              </div>
                                              <div className="datatable-bottom">
                                                <nav className="datatable-pagination">
                                                  <ul className="datatable-pagination-list" />
                                                </nav>
                                              </div>
                                            </div>
                                          </div>
                                          <div
                                            className="tab-pane fade profile-edit pt-3"
                                            id="user-Userrequest"
                                            role="tabpanel"
                                          >
                                            <div className="row">
                                              <div className="col-md-12 col-xl-12">
                                                <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                  <div className="datatable-top">
                                                    <div className="datatable-dropdown">
                                                      <label>
                                                        <select className="datatable-selector">
                                                          <option value={5}>
                                                            5
                                                          </option>
                                                          <option value={10}>
                                                            10
                                                          </option>
                                                          <option value={15}>
                                                            15
                                                          </option>
                                                          <option value={20}>
                                                            20
                                                          </option>
                                                          <option value={25}>
                                                            25
                                                          </option>
                                                        </select>{" "}
                                                        entries per page
                                                      </label>
                                                    </div>
                                                    <div className="datatable-search">
                                                      <input
                                                        className="datatable-input"
                                                        placeholder="Search..."
                                                        type="search"
                                                        title="Search within table"
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="datatable-container">
                                                    <table className="table datatable datatable-table">
                                                      <thead>
                                                        <tr>
                                                          <th
                                                            data-sortable="true"
                                                            style={{
                                                              width: "5.63506%",
                                                            }}
                                                          >
                                                            <a
                                                              href="#"
                                                              className="datatable-sorter"
                                                            >
                                                              #
                                                            </a>
                                                          </th>
                                                          <th data-sortable="true">
                                                            <a
                                                              href="#"
                                                              className="datatable-sorter"
                                                            >
                                                              User_Name
                                                            </a>
                                                          </th>
                                                          <th
                                                            data-sortable="true"
                                                            style={{
                                                              width: "12.8354%",
                                                            }}
                                                          >
                                                            <a
                                                              href="#"
                                                              className="datatable-sorter"
                                                            >
                                                              Department
                                                            </a>
                                                          </th>
                                                          <th
                                                            data-sortable="true"
                                                            style={{
                                                              width: "0.21288%",
                                                            }}
                                                          />
                                                          <th
                                                            data-sortable="true"
                                                            style={{
                                                              width: "15.3202%",
                                                            }}
                                                          >
                                                            <a
                                                              href="#"
                                                              className="datatable-sorter"
                                                            >
                                                              Date
                                                            </a>
                                                          </th>
                                                          <th
                                                            data-sortable="true"
                                                            style={{
                                                              width: "15.3202%",
                                                            }}
                                                          >
                                                            <a
                                                              href="#"
                                                              className="datatable-sorter"
                                                            >
                                                              Action
                                                            </a>
                                                          </th>
                                                        </tr>
                                                      </thead>
                                                    </table>
                                                  </div>
                                                  <div className="datatable-bottom">
                                                    <div className="datatable-info">
                                                      Showing 1 to 5 of 5
                                                      entries
                                                    </div>
                                                    <nav className="datatable-pagination">
                                                      <ul className="datatable-pagination-list" />
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
                                  <div className="col-xl-2" />
                                </div>
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
        </section>
      </main>
    </div>
  );
};

export default Project;
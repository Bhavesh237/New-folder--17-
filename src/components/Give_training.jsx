import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "./apiconfig";
import moment from "moment";
import Headergive from "./Headergive";
import Training_Criteria from "./Training_Criteria";
import { Link } from "react-router-dom";
import Header from "./Header";

function Give_training() {

  const [formVisible1, setFormVisible1] = useState(false);

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
    Training_Id: "",
    Trainer_Id: "",
    Training_Name: "",
    Description: "",
    Start_Date: "",
    End_Date: "",
    PersonLimit: "",
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
        `${API_BASE_URL}/api/Training/Create`,
        {
          Org_Id: orgId.Org_Id,
          Training_Name: formData.Training_Name,
          Description: formData.Description,
          Start_Date: formattedStartDate,
          End_Date: formattedEndDate,
          PersonLimit: formData.PersonLimit,
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
        Org_Name: "",
        Training_Id: "",
        Trainer_Id: "",
        Training_Name: "",
        Description: "",
        Start_Date: "",
        End_Date: "",
        PersonLimit: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  //fetch api
  const [trainingList, setTrainingList] = useState([]);
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Training/User/GetList`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrainingList(response.data);

      for (const training of response.data) {
        await fetchTrainingPersons(training.Training_Id);
      }
      for (const training of response.data) {
        await fetchTrainingappo(training.Training_Id);
      }
    } catch (error) {
      console.error("Error fetching training list:", error);
    }
  };
  // fetchData();
  useEffect(() => {
    fetchData();
  }, []);


  const handleRequestButtonClick = (trainingId) => {
    setSelectedTrainingId(trainingId);
    fetchTrainingPersons(trainingId);
    fetchTrainingappo(trainingId)
  };

  const fetchTrainingPersons = async (trainingId) => {

    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Training_Join/Training/Persons?training_Id=${trainingId}&is_Join=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequestedMap((prevRequestedMap) => ({
        ...prevRequestedMap,
        [trainingId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching training persons data:", error);
    }
  };
  useEffect(() => {
    fetchTrainingPersons();
  }, []);

  const fetchTrainingappo = async (trainingId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Training_Join/Training/Persons?training_Id=${trainingId}&is_Join=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApproved((prevRequestedMap) => ({
        ...prevRequestedMap,
        [trainingId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching training persons data:", error);
    }
  };
  useEffect(() => {
    fetchTrainingappo();
  }, []);



  const [editFormData, setEditFormData] = useState({
    Org_Id: "",
    Training_Id: "",
    Training_Name: "",
    Description: "",
    Start_Date: "",
    End_Date: "",
    PersonLimit: "",
  });
  const handleEditClick = (trainingId) => {
    const selectedTraining = trainingList.find(
      (training) => training.Training_Id === trainingId
    );
    setEditFormData({
      Org_Id: selectedTraining.Org_Id,
      Training_Id: selectedTraining.Trainer_Id,
      Training_Name: selectedTraining.Training_Name,
      Description: selectedTraining.Description,
      Start_Date: moment(selectedTraining.Start_Date).format("YYYY-MM-DD"),
      End_Date: moment(selectedTraining.End_Date).format("YYYY-MM-DD"),
      PersonLimit: selectedTraining.PersonLimit,
    });

    setEditFormData(selectedTraining);

  };

  const handleUpdateClick = async () => {
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
        `${API_BASE_URL}/api/Training/Update`,
        {
          Org_Id: orgId.Org_Id,
          Training_Id: editFormData.Training_Id,
          Training_Name: editFormData.Training_Name,
          Description: editFormData.Description,
          Start_Date: formattedStartDate,
          End_Date: formattedEndDate,
          PersonLimit: editFormData.PersonLimit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Training updated successfully:", response.data);

      setEditFormData({
        Training_Id: "",
        Org_Id: "",
        Training_Name: "",
        Description: "",
        Start_Date: "",
        End_Date: "",
        PersonLimit: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error updating training:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = async (trainingId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${API_BASE_URL}/api/Training/Delete?id=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTrainingList = trainingList.filter(
        (training) => training.Training_Id !== trainingId
      );
      setTrainingList(updatedTrainingList);
    } catch (error) {
      console.error("Error deleting training:", error);
    }
  };
  //joined
  const [trainingList1, setTrainingList1] = useState([]);
  const [Trainingout6, setTrainingout6] = useState([]);
  const [trainingout1, setTrainingout1] = useState([]);
  const [trainingCriteria, setTrainingCriteria] = useState([]);
  const [expCriteria, setExpCriteria] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [DataTake, setDataTake] = useState([]);
  const [DataTake1, setDataTake1] = useState([]);
  const [selectedTrainingId, setSelectedTrainingId] = useState(null);
  const [requestedMap, setRequestedMap] = useState([]);
  console.log("rmapt", requestedMap);
  const [ApprovedMap, setApproved] = useState([]);
  console.log("appo", ApprovedMap);
  const fetchData1 = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Training_Join/User/Trainings?trainingJoinUserTrainings_.is_Join=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrainingList1(response.data);
      for (const training of response.data) {
        await fetchTrainingCriteria(training.Training_Id);
      }
    } catch (error) {
      console.error("Error fetching training list:", error);
    }
  };
  // request trining
  const fetchData2 = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Training_Join/User/Trainings?is_Join=flase`,
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
  // const fetchData4 = async () => {
  //   const token = localStorage.getItem("token");

  //   try {
  //     const response = await axios.get(
  //       `${API_BASE_URL}/api/Training_Join/User/Trainings?is_Join=true`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setTrainingout3(response.data);
  //   } catch (error) {
  //     console.error("Error fetching training list:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchData4();
  // }, []);

  const fetchData3 = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Training_Join/User/Trainings?is_Join=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrainingout1(response.data);
    } catch (error) {
      console.error("Error fetching training list:", error);
    }
  };
  useEffect(() => {
    fetchData3();
  }, []);

  const fetchTrainingCriteria = async (trainingId) => {
    const token = localStorage.getItem("token");

    //Getting Hobby
    try {
      const criteriaResponse = await axios.get(
        `${API_BASE_URL}/api/Training_Criteria/Hobby/GetByTrainingId?trainingId=${trainingId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrainingCriteria((prevCriteria) => [
        ...prevCriteria,
        ...criteriaResponse.data,
      ]);
    } catch (error) {
      console.error("Error in fetching training hobby criteria:", error);
    }

    //Getting Skill
    try {
      const hobbyCriteriaResponse = await axios.get(
        `${API_BASE_URL}/api/Training_Criteria/GetSkillsByTrainingId?trainingId=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSkills((prevCriteria) => [
        ...prevCriteria,
        ...hobbyCriteriaResponse.data,
      ]);
    } catch (error) {
      console.error("Error in fetching training skill criteria:", error);
    }

    //Getting Qualification
    try {
      const qualificationsResponse = await axios.get(
        `${API_BASE_URL}/api/Training_Criteria/GetQualifications?trainingId=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQualifications((prevCriteria) => [
        ...prevCriteria,
        ...qualificationsResponse.data,
      ]);
    } catch (error) {
      console.error(
        "Error in fetching training qualification criteria:",
        error
      );
    }

    //Getting Experience
    try {
      const expCriteriaResponse = await axios.get(
        `${API_BASE_URL}/api/Training_Criteria/GetExpCriteria?trainingId=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExpCriteria((prevCriteria) => [
        ...prevCriteria,
        ...expCriteriaResponse.data,
      ]);
    } catch (error) {
      console.log("Error in fetching training experience criteria", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  fetchData();
  useEffect(() => {
    fetchData1();
  }, []);

  const [selectedTraining, setSelectedTraining] = useState(null);

  const handleLeaveClick = async (trainingId) => {
    const token = localStorage.getItem("token");
    const personId = localStorage.getItem("Person_Id");
    try {
      await axios.delete(
        `${API_BASE_URL}/api/Training_Join/Delete?training_Id=${trainingId}&person_Id=${personId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrainingList1((prevList) =>
        prevList.filter((training) => training.Training_Id !== trainingId)
      );
    } catch (error) {
      console.error("Error leaving training:", error);
    }
  };

  const handleLeaveClick1 = async (trainingId, personId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${API_BASE_URL}/api/Training_Join/Delete?training_Id=${trainingId}&person_Id=${personId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchTrainingappo(trainingId);
      await fetchTrainingPersons(trainingId,);

    } catch (error) {
      console.error("Error leaving training:", error);
    }
  };

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
        `${API_BASE_URL}/api/Training/Org/GetList?trainingByOrg_.org_Id=${org}`,
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
  //  fetchData();
  useEffect(() => {
    fetchDataTake(orgId.Org_Id);
  }, [orgId]);

  const handleApprove = async (trainingId, personId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/Training_Join/Update`,
        {
          Training_Id: trainingId,
          Person_Id: personId,
          Is_Join: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchTrainingPersons(trainingId, false);
      await fetchTrainingPersons(trainingId, true);
      console.log("Training joined successfully:", response.data);
    } catch (error) {
      console.error("Error approving training:", error);
    }
  };
  const handleLeaveClick2 = async (trainingId) => {
    const token = localStorage.getItem("token");
    const personId = localStorage.getItem("Person_Id");
    try {
      await axios.delete(
        `${API_BASE_URL}/api/Training_Join/Delete?training_Id=${trainingId}&person_Id=${personId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrainingout1((prevList) =>
        prevList.filter((training) => training.Training_Id !== trainingId)
      );
    } catch (error) {
      console.error("Error leaving training:", error);
    }
  };
  const handleRequestsClick = async (trainingId) => {
    setSelectedTraining(trainingId);
    await fetchTrainingPersons(trainingId);
  };
  const currentDate = moment().format("YYYY-MM-DD");

  // const [modalClass, setModalClass] = useState('');
  // const [isModalActive, setIsModalActive] = useState(false);

  // const [effect, setEffect] = useState('');
  // const [showModal, setShowModal] = useState(false);

  // const effects = [

  //   'elastic-flip',

  // ];

  // const handleModalClick = () => {
  //   setShowModal(false);
  //   setTimeout(() => {
  //     setEffect('');
  //   }, 250);
  // };

  // const handleToggleModal = (e, selectedEffect) => {
  //   e.stopPropagation();
  //   e.preventDefault();

  //   setEffect(selectedEffect);
  //   setShowModal(true);
  // };

  // useEffect(() => {
  //   if (effect) {
  //     document.body.classList.add(`modal-open`);
  //     document.body.classList.add(`modal-${effect}`);

  //     const modalDialog = document.querySelector('.modal-dialog_training_1');
  //     if (modalDialog) {
  //       const h = modalDialog.offsetHeight;
  //       modalDialog.style.marginTop = `-${h / 2}px`;
  //     }
  //   } else {
  //     document.body.classList.remove(`modal-open`);
  //     document.body.classList.remove(`modal-${effect}`);
  //   }
  // }, [effect]);

  return (
    <div>
      <Header
        updateOrganizationData={handleOrganizationSwitch}
        onSelectOrganization={handleSelectOrganization}
      />
      <div className="selectr">
        <Training_Criteria trainingId={formData.Training_Id} />
      </div>
      <main id="main" className="main">
        <div className="d-flex justify-content-between align-items-center">
          <div className="pagetitle">
            <h1>Trainings</h1>
            <nav>
              <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                <li class="breadcrumb-item">Users</li>
                <li class="breadcrumb-item active">Trainings</li>
              </ol>
            </nav>
          </div>
          <div>
            <button type="button" className="btn btn-primary btn-sm" data-bs-toggle="modal"
              data-bs-target="#CreateTrainingModal" >Create Training</button>
          </div>

          <div
            class="modal fade"
            id="CreateTrainingModal"
            tabindex="-1"
          >
            <div class="modal-dialog">
              <div class="modal-content1" >
                <div className="modal-header">
                  <h5 className="modal-title">
                    Edit Your Training
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
                          value={
                            editFormData.Training_Name
                          }
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              Training_Name:
                                e.target.value,
                            })
                          }
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
                          style={{
                            height: 100,
                          }}
                          id="Description"
                          name="Description"
                          defaultValue={""}
                          value={
                            editFormData.Description
                          }
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              Description:
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
                          // value={
                          //   editFormData.Start_Date
                          // }
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
                          // value={
                          //   editFormData.End_Date
                          // }
                          // min={new Date().toISOString().split('T')[0]}
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
                        Person limit
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
                          value={
                            editFormData.PersonLimit
                          }
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              PersonLimit:
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
        </div>
        <div
          className="product-container grid-view"
          style={{ display: "block" }}
        >
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body pt-3">
                <div className="row">
                  <div className="col-12 col-sm-7 col-md-8 col-lg-9">
                    <ul className="nav nav-tabs nav-tabs-bordered" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#profile-skill"
                          aria-selected="true"
                          role="tab"
                        >
                          Take Trainning
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link "
                          data-bs-toggle="tab"
                          data-bs-target="#Training_list"
                          aria-selected="true"
                          role="tab"
                        >
                          My Trainings
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="col-12  col-sm-5 col-md-4 col-lg-3">
                    <div id="example_filter" className="dataTables_filter text-end">
                      <label>
                        Search:
                        <input type="search" className="Serachfiltertraining mw-100" placeholder="" aria-controls="example" />
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
                        
                          <div className=" col-md-6  col-lg-4 col-xl-4 col-xxl-3 mb-3">
                            <div className="box text-center" style={{
                              backgroundImage: `url("/assets/img/dateBg.png")`
                            }}>
                              <div className="icon" style={{ background: "#fceef3" }}>
                                <i className="bi bi-briefcase" style={{ color: "#ff689b" }} />
                              </div>
                              <h3>html</h3>
                              <div className="font_size1">
                                
                              </div>

                              <div className="font_size1">
                                
                              </div>
                              <div className="font_size1">
                               
                                Applicant - 102
                              </div>
                              <div className="text-center mt-2">
                              <button
                              type="button"
                              className="btn btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target="#TakeTrainingDetailsmodel"
                            >
                              Details
                            </button>
                            <div
                            className="modal fade"
                            id="TakeTrainingDetailsmodel"
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
                              data-bs-target="#user-Alluser1_9"
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
                              data-bs-target="#user-Userrequest2_9"
                              aria-selected="false"
                              role="tab"
                              tabIndex={-1}
                            >
                              Joined
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link"
                              data-bs-toggle="tab"
                              data-bs-target="#user-requestsall"
                              aria-selected="false"
                              role="tab"
                              tabIndex={-1}
                            >
                              Requests
                            </button>
                          </li>
                        </ul>
                        <div className="tab-content pt-4">
                          <div
                            className="tab-pane fade profile-overview active show"
                            id="user-Alluser1_9"
                            role="tabpanel"
                          >
                            <section className="section profile">
                              <div className="row">
                              
                                  <div className=" col-md-6  col-lg-4 col-xl-4 col-xxl-3 mb-3">
                                    <div className="co ">
                                      <div className="card_list text-center">
                                        <div className="grid_section">
                                          <div>
                                            <h3>hhh</h3>
                                            <div className="font_size1">
                                            
                                            </div>
                                            {/*
                                              <div className="font_size1">
                                                {" "}
                                                Description :{" "}
                                                {training.Description}{" "}
                                              </div>
                                               */}
                                            <div className="font_size1">
                                              {" "}
                                              seats{" "}
                                            </div>
                                            <div className="font_size1">
                                              {" "}
                                              Applicant - 102
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
                                            class="modal fade"
                                            id="basicModal"
                                            tabindex="-1"
                                          >
                                            <div class="modal-dialog">
                                              <div class="modal-content1" style={{
                                                "width": "50%", "borderRadius": "5px"
                                              }}>
                                                <div className="modal-header">
                                                  <h5 className="modal-title">
                                                    Edit Your Training
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
                                                          value={
                                                            editFormData.Training_Name
                                                          }
                                                          onChange={(e) =>
                                                            setEditFormData({
                                                              ...editFormData,
                                                              Training_Name:
                                                                e.target.value,
                                                            })
                                                          }
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
                                                          style={{
                                                            height: 100,
                                                          }}
                                                          id="Description"
                                                          name="Description"
                                                          defaultValue={""}
                                                          value={
                                                            editFormData.Description
                                                          }
                                                          onChange={(e) =>
                                                            setEditFormData({
                                                              ...editFormData,
                                                              Description:
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
                                                          // value={
                                                          //   editFormData.Start_Date
                                                          // }
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
                                                          // value={
                                                          //   editFormData.End_Date
                                                          // }
                                                          // min={new Date().toISOString().split('T')[0]}
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
                                                        Person limit
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
                                                          value={
                                                            editFormData.PersonLimit
                                                          }
                                                          onChange={(e) =>
                                                            setEditFormData({
                                                              ...editFormData,
                                                              PersonLimit:
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
                                                                          Add New
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
                                                                  style={{
                                                                    display:
                                                                      formVisible4
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
                                                                        Job
                                                                        Post
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
                                            type="button"
                                            className="btn btn-sm btn-primary"
                                            onClick={() =>
                                              handleDeleteClick(
                                                training.Training_Id
                                              )
                                            }
                                          >
                                            Delete
                                          </button>

                                          <button
                                            className="btn btn-sm btn-primary"
                                            type="button"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasRight"
                                            onClick={() => handleRequestButtonClick(training.Training_Id)}
                                          >
                                            Requests
                                          </button>
                                          {selectedTrainingId && (
                                            <div
                                              className="offcanvas offcanvas-end offcanvas-width1"
                                              tabIndex={-1}
                                              id="offcanvasRight"
                                              aria-labelledby="offcanvasRightLabel"
                                            >
                                              <div className="offcanvas-header">
                                                <h5 id="offcanvasRightLabel">
                                                  HTML
                                                </h5>
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
                                                      >
                                                        <button
                                                          className="nav-link"
                                                          data-bs-toggle="tab"
                                                          data-bs-target="#user-Userrequest2_8"
                                                          aria-selected="false"
                                                          role="tab"
                                                          tabIndex={-1}
                                                        >
                                                          Approved
                                                        </button>
                                                      </li>
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
                                                                              {requestedMap[selectedTrainingId] &&
                                                                                requestedMap[selectedTrainingId].map((trainingPerson) => (
                                                                                  <tr key={trainingPerson.Person_Id}>
                                                                                    <td>{trainingPerson.FirstName} {trainingPerson.LastName}</td>
                                                                                    <td>{trainingPerson.Training_Name}</td>
                                                                                    <td>
                                                                                      <div className="mt-2">
                                                                                        <button
                                                                                          type="button"
                                                                                          className="btn btn-sm btn-primary"
                                                                                          onClick={() =>
                                                                                            handleApprove(
                                                                                              trainingPerson.Training_Id,
                                                                                              trainingPerson.Person_Id
                                                                                            )
                                                                                          }
                                                                                        >
                                                                                          Approve
                                                                                        </button>
                                                                                        <button
                                                                                          type="button"
                                                                                          className="btn btn-sm btn-primary"
                                                                                          onClick={() =>
                                                                                            handleLeaveClick1(
                                                                                              trainingPerson.Training_Id,
                                                                                              trainingPerson.Person_Id
                                                                                            )
                                                                                          }
                                                                                        >
                                                                                          Reject
                                                                                        </button>
                                                                                      </div>
                                                                                    </td>
                                                                                  </tr>
                                                                                ))}
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
                                                                              {ApprovedMap[selectedTrainingId] &&
                                                                                ApprovedMap[selectedTrainingId].map((trainingPerson) => (
                                                                                  <tr key={trainingPerson.Person_Id}>
                                                                                    {/* Your existing code for rendering table data */}
                                                                                    <td>{trainingPerson.FirstName} {trainingPerson.LastName}</td>
                                                                                    <td>{trainingPerson.Training_Name}</td>
                                                                                    <td>
                                                                                      <div className="mt-2">
                                                                                        <button
                                                                                          type="button"
                                                                                          className="btn btn-sm btn-primary"
                                                                                          onClick={() =>
                                                                                            handleLeaveClick1(
                                                                                              trainingPerson.Training_Id,
                                                                                              trainingPerson.Person_Id
                                                                                            )
                                                                                          }
                                                                                        >
                                                                                          Reject
                                                                                        </button>
                                                                                      </div>
                                                                                    </td>
                                                                                  </tr>
                                                                                ))}
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
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                               
                              </div>
                            </section>
                          </div>
                          <div
                            className="tab-pane fade profile-edit pt-3"
                            id="user-Userrequest2_9"
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
                                    data-bs-target="#MyTrainingDetailsmodel"
                                  >
                                    Details
                                  </button>
                                        <button
                                          type="submit"
                                          className="btn btn-sm btn-primary"
                                         
                                        >
                                          Leave
                                        </button>
                                       
 <div
 className="modal fade"
 id="MyTrainingDetailsmodel"
 tabIndex={-1}
 aria-labelledby="exampleModalLabel"
 aria-hidden="true"
>
 <div className="modal-dialog">
   <div className="modal-contentMyTrainingDetailsmodel">
   
   <div className="modal-header justify-content-center">
    <div className="d-flex">
    <h5 className="modal-title">Must Needed Criteria</h5>
     <button
       type="button"
       className="btn-training bi bi-x-circle-fill"
       data-bs-dismiss="modal"
       aria-label="Close"
     /></div>
     
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
           <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3 mb-2">
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
           <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3 mb-2">
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
           <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3 mb-2">
             <div className="card-body card_list p-3">
               <div className="text-start">
                 <div className="f_size_15">Graphic Designer</div>
                 <div className="Tre_join_list_all">VersaTribe</div>
                 <div className="Tre_join_list_all">2 Months</div>
               </div>
               <div />
             </div>
           </div>
           <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3 mb-2">
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
                            className="tab-pane fade profile-overview  show"
                            id="user-requestsall"
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
                                      <th data-sortable="true" style={{ width: "4.63506%" }}>
                                        <a href="#" className="datatable-sorter">
                                          Number
                                        </a>
                                      </th>
                                      <th data-sortable="true" style={{ width: "8.9964%" }}>
                                        <a href="#" className="datatable-sorter">
                                          Applicant_Name
                                        </a>
                                      </th>
                                      <th data-sortable="true" style={{ width: "9.21288%" }}>
                                        <a href="#" className="">
                                          Actions
                                        </a>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>Artificial Intelligence And Machine Learning Certi</td>
                                      <td>
                                        <div className=" mt-2">
                                          <div className="modal fade" id="basicModal" tabIndex={-1}>
                                            <div className="modal-dialog">
                                              <div className="modal-content">
                                                <div className="modal-header">
                                                  <h5 className="modal-title">Edit Your Training</h5>
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
                                                        style={{ height: 100 }}
                                                        defaultValue={""}
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
                                                      Person limit
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
                                                      style={{ height: 100 }}
                                                      defaultValue={""}
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
                                                    Person limit
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
                                                  <button type="submit" className="btn btn-primary">
                                                    Update
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <button type="submit" className="btn btn-sm btn-primary">
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
                                                        <li className="nav-item" role="presentation">
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
                                                        <li className="nav-item" role="presentation">
                                                          <button
                                                            className="nav-link"
                                                            data-bs-toggle="tab"
                                                            data-bs-target="#Approved3"
                                                            aria-selected="false"
                                                            role="tab"
                                                            tabIndex={-1}
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
                                                          <div> </div>
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
                                    <tr>
                                      <td>2</td>
                                      <td>CSS</td>
                                      <td>
                                        <div className=" mt-2">
                                          <div className="modal fade" id="basicModal" tabIndex={-1}>
                                            <div className="modal-dialog">
                                              <div className="modal-content">
                                                <div className="modal-header">
                                                  <h5 className="modal-title">Edit Your Training</h5>
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
                                                        style={{ height: 100 }}
                                                        defaultValue={""}
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
                                                      Person limit
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
                                                      style={{ height: 100 }}
                                                      defaultValue={""}
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
                                                    Person limit
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
                                                  <button type="submit" className="btn btn-primary">
                                                    Update
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <button type="submit" className="btn btn-sm btn-primary">
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
                                                        <li className="nav-item" role="presentation">
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
                                                        <li className="nav-item" role="presentation">
                                                          <button
                                                            className="nav-link"
                                                            data-bs-toggle="tab"
                                                            data-bs-target="#Approved3"
                                                            aria-selected="false"
                                                            role="tab"
                                                            tabIndex={-1}
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
                                                          <div> </div>
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

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Give_training;

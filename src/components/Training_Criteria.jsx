import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import { useParams } from "react-router-dom";
import API_BASE_URL from "./apiconfig";
import Headergive from "./Headergive";
import Give_training from "./Give_training";
const Training_Criteria = () => {

  const [formVisible1, setFormVisible1] = useState(false);
  const showForm1 = () => {
    setFormVisible1(true);
    setMandatory(false);
  };

  const hideForm1 = () => {
    setFormVisible1(false);
    setHobby("");
  };

  const [formVisible2, setFormVisible2] = useState(false);

  const showForm2 = () => {
    setFormVisible2(true);
  };

  const hideForm2 = () => {
    setFormVisible2(false);
    // Clear the form fields
    setSkill_Name("");
    setExperience("");
    setMandatory(false);
    setSkills_Criteria_Id(null);
  };
  const [formVisible5, setFormVisible5] = useState(false);

  const showForm5 = () => {
    setFormVisible5(true);
  };

  const hideForm5 = () => {
    setFormVisible5(false);
    // Clear the form fields
    setSkill_Name("");
    setExperience("");
    setMandatory(false);
  };

  const [formVisible3, setFormVisible3] = useState(false);

  const showForm3 = () => {
    setFormVisible3(true);
  };

  const hideForm3 = () => {
    setFormVisible3(false);
    setCou_Name("");
    setMandatory(false);
    setSkills_Criteria_Id(null);
  };

  const [formVisible4, setFormVisible4] = useState(false);

  const showForm4 = () => {
    setFormVisible4(true);
  };

  const hideForm4 = () => {
    setFormVisible4(false);
    setCompany_Name("");
    setIndustry_Field_Name("")
    setExp_months("")
    setJob_Title()
  };

  // hobby create
  
  const { trainingId } = useParams();
  
  const [Training_Id, setTraining_Id] = useState(trainingId);
  const [errorMessages44, setErrorMessages44] = useState({});
  const [Hobby_Name, setHobby] = useState("");
  const [TrainingData, setTrainingData] = useState([]);
  const [Mandatory, setMandatory] = useState(false);
  const [SearchResultsHobbyName, setSearchHobbyName] = useState([]);

  const handleHobbySelectionHobbyName = (selectedhobby) => {
    setHobby(selectedhobby.Name);
    setSearchHobbyName([]);
  };

  const searchHobbyName = async (searchTerm) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }
    if (searchTerm.length >= 2) {
      const axiosConfig = {
        params: {
          search_str: searchTerm,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Hobbies/AutoCompleteHobbies`,
          axiosConfig
        );

        setSearchHobbyName(response.data);
      } catch (error) {
        console.error("API Error (Search):", error);
      }
    } else {
      setSearchHobbyName([]);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setHobby(inputValue);
    searchHobbyName(inputValue);
  };

  const handleCheckboxChange = (e) => {
    setMandatory(e.target.checked);
  };

  const handleAddButtonClick = () => {
    const token = localStorage.getItem("token");
    const errors = {};
    if (!Hobby_Name) {
      errors.Hobby_Name = "The Hobby_Name field is required.";
    }

    setErrorMessages44(errors);

    const data = {
      Hobby_Name,
      Mandatory,
      Training_Id,
    };

    axios
      .post(`${API_BASE_URL}/api/Training_Criteria/Hobby/Create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((response) => {
        console.log("Data added successfully:", response.data);
        // Refresh data after adding a new item
        fetchData();
        hideForm1();
      })

      .catch((error) => {
        console.error("Error adding data:", error);
      });
  };
  //fetch api for hobby
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Training_Criteria/Hobby/GetByTrainingId?trainingId=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrainingData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [trainingId]);

  const handleDeleteClick = async (trainingId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${API_BASE_URL}/api/Training_Criteria/Hobby/Delete?id=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTrainingList = TrainingData.filter(
        (training) => training.Hobby_Criteria_Id !== trainingId
      );
      setTrainingData(updatedTrainingList);
    } catch (error) {
      console.error("Error deleting training:", error);
    }
  };
  // skill create
  const [Skill_Name, setSkill_Name] = useState("");
  const [Experience, setExperience] = useState();
  const [TrainingSkill, setTrainingSkill] = useState([]);
  const [Skills_Criteria_Id, setSkills_Criteria_Id] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const handleSkillSelection = (selectedSkill) => {
    setSkill_Name(selectedSkill.Skill_Name);
    setSearchResults([]);
  };

  const searchSkills = async (searchTerm) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }
    if (searchTerm.length >= 2) {
      const axiosConfig = {
        params: {
          search_str: searchTerm,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Skills/AutoCompleteSkills`,
          axiosConfig
        );

        setSearchResults(response.data);
      } catch (error) {
        console.error("API Error (Search):", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleInputChangeSkill_Name = (e) => {
    const inputValue = e.target.value;
    setSkill_Name(inputValue);
    searchSkills(inputValue);
  };

  const handleInputChangeExperience = (e) => {
    setExperience(e.target.value);
  };
  const handleAddButtonClick1 = () => {
    const token = localStorage.getItem("token");
    const errors = {};
    if (!Skill_Name) {
      errors.Skill_Name = "The Skill_Name field is required.";
    }
    if (!Experience) {
      errors.Experience = "The Experience field is required.";
    }
    setErrorMessages44(errors);

    const data = {
      Id: Skills_Criteria_Id,
      Training_Id: trainingId,
      Skill_Name,
      Experience,
      Mandatory,
    };

    if (Skills_Criteria_Id) {
      handleUpdateButtonClick(data);
    } else {
      axios
        .post(`${API_BASE_URL}/api/Training_Criteria/AddSkills`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Data added successfully:", response.data);
          fetchData1();
          hideForm2();
        })
        .catch((error) => {
          console.error("Error adding data:", error);
        });
    }
  };

  const fetchData1 = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Training_Criteria/GetSkillsByTrainingId?trainingId=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrainingSkill(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleUpdateButtonClick = (data) => {
    const token = localStorage.getItem("token");

    axios
      .put(`${API_BASE_URL}/api/Training_Criteria/UpdateSkills`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Data updated successfully:", response.data);
        fetchData1();
        hideForm2();
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  useEffect(() => {
    fetchData1();
  }, [trainingId]);

  const handleDeleteSkill = async (trainingId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${API_BASE_URL}/api/Training_Criteria/DeleteSkills?id=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTrainingList = TrainingSkill.filter(
        (training) => training.Skills_Criteria_Id !== trainingId
      );
      setTrainingSkill(updatedTrainingList);
    } catch (error) {
      console.error("Error deleting training:", error);
    }
  };
  const handleEditButtonClick = (data1) => {
    setSkill_Name(data1.Skill_Name);
    setExperience(data1.Experience);
    setMandatory(data1.Mandatory);
    setSkills_Criteria_Id(data1.Skills_Criteria_Id);
    showForm2();
  };

  useEffect(() => {
    fetchData1();
  }, [trainingId]);

  // Qualification

  const [Cou_Name, setCou_Name] = useState();
  const [TrainingQualification, setTrainingQualification] = useState([]);
  const [Qualification_Criteria_Id, setQualification_Criteria_Id] = useState();
  const [
    SearchResultsQualificationCourseName,
    setSearchResultsQualificationCourseName,
  ] = useState([]);
  const handleEditButtonClick1 = (data2) => {
    setCou_Name(data2.Cou_Name);
    setMandatory(data2.Mandatory);
    setQualification_Criteria_Id(data2.Qualification_Criteria_Id);
    showForm3();
  };

  const handleInputChangesetCou_Name = (e) => {
    setCou_Name(e.target.value);
    searchQualificationCourseName(e.target.value);
  };

  const handleAddButtonQualification = () => {
    const token = localStorage.getItem("token");
    const errors = {};
    if (!Skill_Name) {
      errors.Skill_Name = "The Skill_Name field is required.";
    }
    if (!Experience) {
      errors.Experience = "The Experience field is required.";
    }
    setErrorMessages44(errors);

    const data = {
      Id: Qualification_Criteria_Id,
      Training_Id: trainingId,
      Cou_Name,
      Mandatory,
    };

    if (Qualification_Criteria_Id) {
      handleUpdateButtonClick1(data);
    } else {
      axios
        .post(`${API_BASE_URL}/api/Training_Criteria/AddQual/Create`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Data added successfully:", response.data);
          fetchData2();
          hideForm3();
        })
        .catch((error) => {
          console.error("Error adding data:", error);
        });
    }
  };
  const handleUpdateButtonClick1 = (data) => {
    const token = localStorage.getItem("token");

    axios
      .put(`${API_BASE_URL}/api/Training_Criteria/UpdateQual/Update`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Data updated successfully:", response.data);
        fetchData2();
        hideForm3();
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  useEffect(() => {
    fetchData2();
  }, [trainingId]);

  const fetchData2 = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Training_Criteria/GetQualifications?trainingId=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrainingQualification(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData2();
  }, [trainingId]);
  const handleSkillSelectionQualificationCourseName = (
    selectedQualification
  ) => {
    setCou_Name(selectedQualification.Cou_Name);
    setSearchResultsQualificationCourseName([]);
  };

  const searchQualificationCourseName = async (searchTerm1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }
    if (searchTerm1.length >= 2) {
      const axiosConfig = {
        params: {
          search_str: searchTerm1,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Courses/AutoCompleteCourse`,
          axiosConfig
        );

        setSearchResultsQualificationCourseName(response.data);
      } catch (error) {
        console.error("API Error (Search):", error);
      }
    } else {
      setSearchResultsQualificationCourseName([]);
    }
  };

  const handleDeleteQualification = async (trainingId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${API_BASE_URL}/api/Training_Criteria/DeleteQual?id=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTrainingList = TrainingQualification.filter(
        (training) => training.Qualification_Criteria_Id !== trainingId
      );
      setTrainingQualification(updatedTrainingList);
    } catch (error) {
      console.error("Error deleting training:", error);
    }
  };

  //Experience
  const [Company_Name, setCompany_Name] = useState(null);
  const [Industry_Field_Name, setIndustry_Field_Name] = useState(null);
  const [companyNameSuggestions, setCompanyNameSuggestions] = useState([]);
  const [industryNameSuggestions, setIndustryNameSuggestions] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedIndustryName, setSelectedIndustryName] = useState("");
  const [Exp_months, setExp_months] = useState("");
  const [Job_Title, setJob_Title] = useState("");
  const [TrainingExperience, setTrainingExperience] = useState([]);
  const [Experience_Criteria_Id, setExperience_Criteria_Id] = useState(null);
  const [showCompanyInput, setShowCompanyInput] = useState(true);
  const [showIndustryInput, setShowIndustryInput] = useState(true);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  const handleDeleteExperience = async (trainingId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${API_BASE_URL}/api/Training_Criteria/DeleteExp?id=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTrainingList = TrainingExperience.filter(
        (training) => training.Experience_Criteria_Id !== trainingId
      );
      setTrainingExperience(updatedTrainingList);
    } catch (error) {
      console.error("Error deleting training:", error);
    }
  };
  const handleCompanyNameInputChange = (event) => {
    const value = event.target.value;
    setCompany_Name(value);
    if (value) {
      setShowCompanyInput(true);
      setShowIndustryInput(false);
    } else {
      setShowCompanyInput(true);
      setShowIndustryInput(true);
    }
    const token = localStorage.getItem("token");

    axios
      .get(
        `${API_BASE_URL}/api/Experience/AutoCompleteCompanyNames?search_str=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setCompanyNameSuggestions(response.data);
        setShowCompanySuggestions(true); 
      })
      .catch((error) => console.error(error));
  };

  const handleIndustryNameInputChange = (event) => {
    const value = event.target.value;
    setIndustry_Field_Name(value);
    const token = localStorage.getItem("token");
    if (value) {
      setShowIndustryInput(true);
      setShowCompanyInput(false);
    } else {
      setShowIndustryInput(true);
      setShowCompanyInput(true);
    }
    axios
      .get(
        `${API_BASE_URL}/api/Experience/AutoCompleteIndustryNames?search_str=${value}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => setIndustryNameSuggestions(response.data))
      .catch((error) => console.error(error));
  };
  const handleExpMonthsInputChange = (e) => {
    setExp_months(e.target.value);
  };

  const handleJobTitleInputChange = (e) => {
    setJob_Title(e.target.value);
  };
  const handleCompanyNameSelection = (selectedValue) => {
    setSelectedCompanyName(selectedValue);
    setCompany_Name(selectedValue);
    setShowCompanySuggestions(false);
    setCompanyNameSuggestions([]);

    setShowIndustryInput(selectedValue !== "hide");
  };

  const handleIndustryNameSelection = (selectedValue) => {
    setSelectedIndustryName(selectedValue);
    setIndustry_Field_Name(selectedValue);
    setIndustryNameSuggestions([]);
    setCompany_Name(selectedValue === "hide" ? null : Company_Name);
  };
  
  const handleEditButtonClick3 = (data3) => {
    setCompany_Name(data3.Company_Name);
    setMandatory(data3.Mandatory);
    setIndustry_Field_Name(data3.Industry_Field_Name);
    setExp_months(data3.Exp_months);
    setJob_Title(data3.Job_Title);
    setExperience_Criteria_Id(data3.Experience_Criteria_Id);
    showForm4();
  };
  const handleFormSubmit = () => {
    const token = localStorage.getItem("token");
    const errors = {};
    if (!Company_Name) {
      errors.Company_Name = "The Company_Name field is required.";
    }
    if (!Industry_Field_Name) {
      errors.Industry_Field_Name = "The Industry_Field_Name field is required.";
    }
    if (!Exp_months) {
      errors.Exp_months = "The Exp_months field is required.";
    }
    if (!Job_Title) {
      errors.Job_Title = "The Experience Job_Title is required.";
    }
    setErrorMessages44(errors);

    const data = {
      Id: Experience_Criteria_Id,
      Training_Id: trainingId,
      Company_Name,
      Exp_months,
      Industry_Field_Name,
      Mandatory,
      Job_Title,
    };

    if (Experience_Criteria_Id) {
      handleUpdateButtonClick2()
    } else {
      axios
        .post(`${API_BASE_URL}/api/Training_Criteria/AddExp/Create`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Data added successfully:", response.data);
           fetchData3();
          hideForm4();
        })
        .catch((error) => {
          console.error("Error adding data:", error);
          alert("only one input fill add Company_Name either Industry")
        });
    }
  };
  const fetchData3 = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Training_Criteria/GetExpCriteria?trainingId=${trainingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrainingExperience(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData3();
  }, [trainingId]);
  const handleUpdateButtonClick2 = () => {
    const token = localStorage.getItem("token");
    const data = {
      Id: Experience_Criteria_Id,
      Training_Id: trainingId,
      Company_Name,
      Exp_months,
      Industry_Field_Name,
      Mandatory,
      Job_Title,
    };
    axios
      .put(`${API_BASE_URL}/api/Training_Criteria/UpdateExp/Update`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Data updated successfully:", response.data);
        fetchData3();
        hideForm4();
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  useEffect(() => {
    fetchData3();
  }, [trainingId]);

  

  return (
    <div>
      <Headergive />
      <div className="hide">
    
      </div>
      <div id="perseus-app" className="seller_onboarding_perseus">
        <div className="onboarding-introduction">
          <div className="wizard-steps seller-onboarding">
            <div
              id="professional_info"
              title="Professional Info"
              className="step"
            >
              <div className="onboarding-step professional-info">
                <div id="skills" className="onboarding-field is-required">
                  <div className="d-block tb_pdb">
                    <h3 className="font-accent">
                      <span>Hobby</span>
                    </h3>
                  </div>
                  <div className="field-content">
                    <div className="inner-row skills">
                      <div
                        className="form-wrapper"
                        style={{ display: formVisible1 ? "block" : "none" }}
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
                                value={Hobby_Name}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Enter hobby"
                                required
                              />
                              {SearchResultsHobbyName.length > 0 && (
                                <ul className="autocomplete-list">
                                  {SearchResultsHobbyName.map((Hobby) => (
                                    <li
                                      key={Hobby.Id}
                                      onClick={() =>
                                        handleHobbySelectionHobbyName(Hobby)
                                      }
                                    >
                                      {Hobby.Name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                          <div className="experience"></div>
                          <span className="buttons-wrapper">
                            <button
                              className="btn cancel_btn"
                              onClick={hideForm1}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_add"
                              onClick={handleAddButtonClick}
                              disabled={!Hobby_Name}
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
                            checked={Mandatory}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="exampleCheck1"
                          >
                            Mandatory or Not
                          </label>
                        </div>
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th className="main">Hobby</th>
                            <th className="manage">
                              <button className="addnew" onClick={showForm1}>
                                Add New
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {TrainingData.map((data) => (
                            <tr>
                              <td>
                                <span className="no-capitalization">
                                  {data.HobbyName}
                                </span>
                              </td>
                              <td className="manage">
                                <div className="animate">
                                  <span className="hint--top" data-hint="Edit">
                                    {/* 
                                  <button className="edit" >
                                    Edit
                                    <svg
                                      width={15}
                                      height={15}
                                      viewBox="0 0 16 16"
                                      onClick={showForm1}
                                    >
                                      <g fill="#B2B2B2">
                                        <path d="M2.198 9.948l7.686-7.536 3.655 3.583-7.687 7.536zM5.318 13.894L1.826 10.47l-.636 1.688-1.17 3.105a.311.311 0 0 0 .074.331.325.325 0 0 0 .337.073l3.135-1.137 1.752-.636zM15.555 1.754L14.211.436c-.638-.626-1.733-.568-2.44.126l-1.434 1.405L13.99 5.55l1.433-1.405c.709-.694.767-1.768.131-2.391" />
                                      </g>
                                    </svg>
                                  </button>
                                  */}
                                  </span>
                                  <span
                                    className="hint--top"
                                    data-hint="Delete"
                                  >
                                    <button
                                      className="remove"
                                      onClick={() =>
                                        handleDeleteClick(
                                          data.Hobby_Criteria_Id
                                        )
                                      }
                                    >
                                      Delete
                                      <svg width={16} height={16}>
                                        <path d="M10.7 2.2c0 .1.1.2.3.2h2.2c.4 0 .7.3.7.7 0 .3-.2.6-.5.7L13 14.2c0 .8-.7 1.5-1.6 1.5H4.6c-.8 0-1.5-.7-1.6-1.5L2.7 3.8c-.3 0-.6-.3-.6-.6 0-.4.3-.7.7-.7H5c.1 0 .2-.1.3-.2l.2-.6C5.7.9 6.4.4 7.2.4h1.6c.8 0 1.5.6 1.7 1.3l.2.5zM7.5 5.7v7c0 .3.2.5.5.5s.5-.2.5-.5v-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zm-2.4 0l.2 7c0 .3.2.5.5.5s.5-.2.5-.5l-.2-7c0-.3-.2-.5-.5-.5s-.5.3-.5.5zm4.8 0l-.2 7c0 .3.2.5.5.5s.5-.2.5-.5l.2-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zM6.8 2.4h2.3c.1 0 .1 0 .1-.1L9.1 2c0-.1-.2-.3-.3-.3H7.2c-.1 0-.3.1-.3.3l-.1.4c-.1 0 0 0 0 0z" />
                                      </svg>
                                    </button>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
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
        <div className="onboarding-introduction">
          <div className="wizard-steps seller-onboarding">
            <div
              id="professional_info"
              title="Professional Info"
              className="step"
            >
              <div className="onboarding-step professional-info">
                <div id="skills" className="onboarding-field is-required">
                  <aside>
                    <h3 className="font-accent">
                      <span>Skills</span>
                    </h3>
                  </aside>
                  <div className="field-content">
                    <div className="inner-row skills">
                      <div
                        className="form-wrapper"
                        style={{ display: formVisible2 ? "block" : "none" }}
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
                                id="Skill_Name"
                                value={Skill_Name}
                                onChange={handleInputChangeSkill_Name}
                                aria-describedby="emailHelp"
                                placeholder="Enter skill"
                              ></input>
                              {searchResults.length > 0 && (
                                <ul className="autocomplete-list">
                                  {searchResults.map((skill) => (
                                    <li
                                      key={skill.Id}
                                      onClick={() =>
                                        handleSkillSelection(skill)
                                      }
                                    >
                                      {skill.Skill_Name}
                                    </li>
                                  ))}
                                </ul>
                              )}
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
                                id="Experience"
                                aria-describedby="emailHelp"
                                value={Experience}
                                onChange={handleInputChangeExperience}
                                placeholder="Enter experience"
                              ></input>
                            </div>
                          </div>
                          <span className="buttons-wrapper">
                            <button
                              className="btn cancel_btn"
                              onClick={hideForm2}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_add"
                              disabled={Skills_Criteria_Id ? false : ""}
                              onClick={handleAddButtonClick1}
                            >
                              {Skills_Criteria_Id ? "Update" : "Add"}
                            </button>
                          </span>
                        </div>
                        <div className="form-check mt_check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="exampleCheck1"
                            checked={Mandatory}
                            onChange={handleCheckboxChange}
                          ></input>
                          <label
                            className="form-check-label"
                            htmlFor="exampleCheck1"
                          >
                            Mandatory or Not
                          </label>
                        </div>
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th className="main">Skill</th>
                            <th className="secondary">Experience</th>
                            <th className="manage">
                              <button className="addnew" onClick={showForm2}>
                                Add New
                              </button>
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {TrainingSkill.map((data1) => (
                            <tr>
                              <td>
                                <span className="no-capitalization">
                                  {data1.Skill_Name}
                                </span>
                              </td>
                              <td className="language-level">
                                {data1.Experience}
                              </td>
                              <td className="manage">
                                <div className="animate">
                                  <span className="hint--top" data-hint="Edit">
                                    <button
                                      className="edit"
                                      onClick={() => {
                                        showForm2();
                                        handleEditButtonClick(data1);
                                      }}
                                    >
                                      Edit
                                      <svg
                                        width={15}
                                        height={15}
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
                                    <button
                                      className="remove"
                                      onClick={() =>
                                        handleDeleteSkill(
                                          data1.Skills_Criteria_Id
                                        )
                                      }
                                    >
                                      Delete
                                      <svg width={16} height={16}>
                                        <path d="M10.7 2.2c0 .1.1.2.3.2h2.2c.4 0 .7.3.7.7 0 .3-.2.6-.5.7L13 14.2c0 .8-.7 1.5-1.6 1.5H4.6c-.8 0-1.5-.7-1.6-1.5L2.7 3.8c-.3 0-.6-.3-.6-.6 0-.4.3-.7.7-.7H5c.1 0 .2-.1.3-.2l.2-.6C5.7.9 6.4.4 7.2.4h1.6c.8 0 1.5.6 1.7 1.3l.2.5zM7.5 5.7v7c0 .3.2.5.5.5s.5-.2.5-.5v-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zm-2.4 0l.2 7c0 .3.2.5.5.5s.5-.2.5-.5l-.2-7c0-.3-.2-.5-.5-.5s-.5.3-.5.5zm4.8 0l-.2 7c0 .3.2.5.5.5s.5-.2.5-.5l.2-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zM6.8 2.4h2.3c.1 0 .1 0 .1-.1L9.1 2c0-.1-.2-.3-.3-.3H7.2c-.1 0-.3.1-.3.3l-.1.4c-.1 0 0 0 0 0z" />
                                      </svg>
                                    </button>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
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
        <div className="onboarding-introduction">
          <div className="wizard-steps seller-onboarding">
            <div
              id="professional_info"
              title="Professional Info"
              className="step"
            >
              <div className="onboarding-step professional-info">
                <div id="skills" className="onboarding-field is-required">
                  <aside>
                    <h3 className="font-accent">
                      <span>Qualification</span>
                    </h3>
                  </aside>
                  <div className="field-content">
                    <div className="inner-row skills">
                      <div
                        className="form-wrapper"
                        style={{ display: formVisible3 ? "block" : "none" }}
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
                                value={Cou_Name}
                                id="exampleInputEmail1"
                                onChange={handleInputChangesetCou_Name}
                                aria-describedby="emailHelp"
                                placeholder="Enter Course Name"
                              ></input>
                              {SearchResultsQualificationCourseName.length >
                                0 && (
                                <ul className="autocomplete-list">
                                  {SearchResultsQualificationCourseName.map(
                                    (qualification) => (
                                      <li
                                        onClick={() =>
                                          handleSkillSelectionQualificationCourseName(
                                            qualification
                                          )
                                        }
                                      >
                                        {qualification.Cou_Name}
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            </div>
                          </div>
                          <div className="experience"></div>
                          <span className="buttons-wrapper">
                            <button
                              className="btn cancel_btn"
                              onClick={hideForm3}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn_add"
                              disabled=""
                              onClick={handleAddButtonQualification}
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
                            checked={Mandatory}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="exampleCheck1"
                          >
                            Mandatory or Not
                          </label>
                        </div>
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th className="main">Education</th>
                            <th className="manage">
                              <button className="addnew" onClick={showForm3}>
                                Add New
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {TrainingQualification.map((data2) => (
                            <tr>
                              <td>
                                <span className="no-capitalization">
                                  {data2.Cou_Name}
                                </span>
                              </td>
                              <td className="manage">
                                <div className="animate">
                                  <span className="hint--top" data-hint="Edit">
                                    <button
                                      className="edit"
                                      onClick={() => {
                                        showForm3();
                                        handleEditButtonClick1(data2);
                                      }}
                                    >
                                      Edit
                                      <svg
                                        width={15}
                                        height={15}
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
                                    <button
                                      className="remove"
                                      onClick={() =>
                                        handleDeleteQualification(
                                          data2.Qualification_Criteria_Id
                                        )
                                      }
                                    >
                                      Delete
                                      <svg width={16} height={16}>
                                        <path d="M10.7 2.2c0 .1.1.2.3.2h2.2c.4 0 .7.3.7.7 0 .3-.2.6-.5.7L13 14.2c0 .8-.7 1.5-1.6 1.5H4.6c-.8 0-1.5-.7-1.6-1.5L2.7 3.8c-.3 0-.6-.3-.6-.6 0-.4.3-.7.7-.7H5c.1 0 .2-.1.3-.2l.2-.6C5.7.9 6.4.4 7.2.4h1.6c.8 0 1.5.6 1.7 1.3l.2.5zM7.5 5.7v7c0 .3.2.5.5.5s.5-.2.5-.5v-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zm-2.4 0l.2 7c0 .3.2.5.5.5s.5-.2.5-.5l-.2-7c0-.3-.2-.5-.5-.5s-.5.3-.5.5zm4.8 0l-.2 7c0 .3.2.5.5.5s.5-.2.5-.5l.2-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zM6.8 2.4h2.3c.1 0 .1 0 .1-.1L9.1 2c0-.1-.2-.3-.3-.3H7.2c-.1 0-.3.1-.3.3l-.1.4c-.1 0 0 0 0 0z" />
                                      </svg>
                                    </button>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
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
        <div className="onboarding-introduction">
          <div className="wizard-steps seller-onboarding">
            <div
              id="professional_info"
              title="Professional Info"
              className="step"
            >
              <div className="onboarding-step professional-info">
                <div id="skills" className="onboarding-field is-required">
                  <aside>
                    <h3 className="font-accent">
                      <span>Experience</span>
                    </h3>
                  </aside>
                  <div className="field-content">
                    <div className="inner-row skills">
                      <div
                        className="form-wrapper"
                        style={{ display: formVisible4 ? "block" : "none" }}
                      >
                        <div className="d-flex">
                        {showCompanyInput && (
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
                                value={Company_Name}
                                onChange={handleCompanyNameInputChange}
                                placeholder="Enter Company_Name"
                                onBlur={() => setShowCompanySuggestions(false)}
                              ></input>
                              {companyNameSuggestions.length > 0 && (
                                <ul className="autocomplete-list">
                                  {companyNameSuggestions.map((suggestion) => (
                                    <li
                                      onClick={() =>
                                        handleCompanyNameSelection(
                                          suggestion.Company_Name
                                        )
                                      }
                                    >
                                      {suggestion.Company_Name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                           )}
                          {showIndustryInput && (
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
                                value={Industry_Field_Name}
                                onChange={handleIndustryNameInputChange}
                              >
                              </input>
                              {industryNameSuggestions.length > 0 && (
                                <ul className="autocomplete-list">
                                  {industryNameSuggestions.map((suggestion) => (
                                    <li
                                      onClick={() =>
                                        handleIndustryNameSelection(
                                          suggestion.Industry_Field_Name
                                        )
                                      }
                                    >
                                      {suggestion.Industry_Field_Name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                          )}
                          <div className="experience">
                            <div className="orca-combo-box-container">
                              <span
                                aria-live="polite"
                                aria-atomic="false"
                                aria-relevant="additions text"
                              ></span>
                              <input
                                type="number"
                                className="form-control"
                                id="exampleInputEmail1"
                                value={Exp_months}
                                onChange={handleExpMonthsInputChange}
                                aria-describedby="emailHelp"
                                placeholder="Enter Experience months"
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
                                value={Job_Title}
                                onChange={handleJobTitleInputChange}
                                aria-describedby="emailHelp"
                                placeholder="Enter Job_Title"
                              ></input>
                            </div>
                          </div>
                          <span className="buttons-wrapper">
                            <button className="btn cancel" onClick={hideForm4}>
                              Cancel
                            </button>
                            <button className="btn_add" disabled="" onClick={handleFormSubmit}>
                              Add
                            </button>
                          </span>
                        </div>
                        <div className="form-check mt_check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="exampleCheck1"
                            checked={Mandatory}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="exampleCheck1"
                          >
                            Mandatory or Not
                          </label>
                        </div>
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th className="main">Company_Name</th>
                            <th className="secondary">Industry</th>
                            <th className="secondary">Month & year</th>
                            <th className="secondary">job</th>
                            <th className="manage">
                              <button className="addnew" onClick={showForm4}>
                                Add New
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                        {TrainingExperience.map((data41) => (
                          <tr>
                            <td>
                              <span className="no-capitalization">
                               {data41.Company_Name}
                              </span>
                            </td>
                            <td className="language-level">{data41.Industry_Field_Name}</td>
                            <td className="language-level">{data41.Exp_months}</td>
                            <td className="language-level">{data41.Job_Title}</td>
                            <td className="manage">
                              <div className="animate">
                                <span className="hint--top" data-hint="Edit">
                                  <button className="edit" onClick={() => {
                                    showForm4();
                                    handleEditButtonClick3(data41);
                                  }} >
                                    Edit
                                    <svg
                                      width={15}
                                      height={15}
                                      viewBox="0 0 16 16"
                                    >
                                      <g fill="#B2B2B2">
                                        <path d="M2.198 9.948l7.686-7.536 3.655 3.583-7.687 7.536zM5.318 13.894L1.826 10.47l-.636 1.688-1.17 3.105a.311.311 0 0 0 .074.331.325.325 0 0 0 .337.073l3.135-1.137 1.752-.636zM15.555 1.754L14.211.436c-.638-.626-1.733-.568-2.44.126l-1.434 1.405L13.99 5.55l1.433-1.405c.709-.694.767-1.768.131-2.391" />
                                      </g>
                                    </svg>
                                  </button>
                                </span>
                                <span className="hint--top" data-hint="Delete">
                                  <button className="remove" onClick={() =>
                                    handleDeleteExperience(
                                      data41.Experience_Criteria_Id
                                    )
                                  }>
                                    Delete
                                    <svg width={16} height={16}>
                                      <path d="M10.7 2.2c0 .1.1.2.3.2h2.2c.4 0 .7.3.7.7 0 .3-.2.6-.5.7L13 14.2c0 .8-.7 1.5-1.6 1.5H4.6c-.8 0-1.5-.7-1.6-1.5L2.7 3.8c-.3 0-.6-.3-.6-.6 0-.4.3-.7.7-.7H5c.1 0 .2-.1.3-.2l.2-.6C5.7.9 6.4.4 7.2.4h1.6c.8 0 1.5.6 1.7 1.3l.2.5zM7.5 5.7v7c0 .3.2.5.5.5s.5-.2.5-.5v-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zm-2.4 0l.2 7c0 .3.2.5.5.5s.5-.2.5-.5l-.2-7c0-.3-.2-.5-.5-.5s-.5.3-.5.5zm4.8 0l-.2 7c0 .3.2.5.5.5s.5-.2.5-.5l.2-7c0-.3-.2-.5-.5-.5s-.5.2-.5.5zM6.8 2.4h2.3c.1 0 .1 0 .1-.1L9.1 2c0-.1-.2-.3-.3-.3H7.2c-.1 0-.3.1-.3.3l-.1.4c-.1 0 0 0 0 0z" />
                                    </svg>
                                  </button>
                                </span>
                              </div>
                            </td>
                          </tr>
                          ))}
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
  );
 
};

export default Training_Criteria;

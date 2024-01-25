import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "./apiconfig";
import moment from "moment";
import Headergive from "./Headergive";
import Header from "./Header";
const Home = () => {
  const OrgAdminPer = localStorage.getItem("OrgAdminPer");
  const parsedOrgAdminPer = OrgAdminPer ? JSON.parse(OrgAdminPer) : [];
  const [selectedOrg, setSelectedOrg] = useState(parsedOrgAdminPer[1] || {});
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


  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Gender: "Male",
    City: "",
    Country: "",
    DOB: "",
  });
  const [error1, setError1] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const profileExist = localStorage.getItem("profile_exist");
  const [updateId, setUpdateId] = useState(null);
  const [buttonText, setButtonText] = useState(
    profileExist === "True" ? "Update profile" : "Create profile"
  );
  const [formData1, setFormData1] = useState({
    Skill_Name: "",
    Experience: "",
  });
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const personId = "YOUR_PERSON_ID";
    if (token) {
      axios
        .get(`${API_BASE_URL}/api/Person/MyProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userData = response.data;
          const formattedDOB = moment(userData.DOB).format("YYYY-MM-DD");
          setFormData({
            FirstName: userData.FirstName,
            LastName: userData.LastName,
            Gender: userData.Gender,
            City: userData.City,
            Country: userData.Country,
            DOB: formattedDOB,
          });
          localStorage.setItem("username", response.data.FirstName);
          localStorage.setItem("Person_Id", response.data.Person_Id)
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "DOB") {
      const formattedDate = moment(value).format("YYYY-MM-DD");

      setFormData({
        ...formData,
        [name]: formattedDate,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const date = new Date(formData.DOB);
      const formattedDOB = moment(date).format("YYYY-MM-DD");

      if (profileExist === "False") {
        const response = await axios.post(
          `${API_BASE_URL}/api/Person/Create`,
          {
            ...formData,
            DOB: formattedDOB,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Profile created successfully");
      } else if (profileExist === "True") {
        const response = await axios.put(
          `${API_BASE_URL}/api/Person/Update`,
          {
            ...formData,
            DOB: formattedDOB,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Profile updated successfully");
      } else {
        console.error("Invalid value for profile_exist in local storage");
      }
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.ModelState);
      } else {
        console.error("Error:", error);
      }
    }
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (updateId) {
      const updatedData = {
        PerSk_Id: updateId,
        Experience: formData1.Experience,
        Skill_Name: formData1.Skill_Name,
      };

      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/PersonSkills/Update`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const shouldUpdate = window.confirm("Are you sure you want to update?");

        if (!shouldUpdate) {
          return;
        }
        // console.log("API Response (Update):", response.data);

        setFormData1({
          Skill_Name: "",
          Experience: "",
        });
        setUpdateId(null);

        fetchData();
      } catch (error) {
        console.error("API Error (Update):", error);
      }
    } else {
      const newSkill = {
        Experience: formData1.Experience,
        Skill_Name: formData1.Skill_Name,
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/PersonSkills/Create`,
          newSkill,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("your skill create");
        // console.log("API Response (Create):", response.data);

        setFormData1({
          Skill_Name: "",
          Experience: "",
        });

        fetchData();
      } catch (error) {
        console.error("API Error (Create):", error);
      }
    }
  };

  const fetchData = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/api/PersonSkills/GetSkillsByUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = (skill) => {
    setFormData1({
      Skill_Name: skill.Skill_Name,
      Experience: skill.Experience,
    });
    setUpdateId(skill.PerSk_Id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData1({
      ...formData1,
      [name]: value,
    });
    // searchSkills(e.target.value);
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setFormData1({
      ...formData1,
      [name]: value,
    });
    searchSkills(e.target.value);
  };

  const handleRemove = (PerSk_Id) => {
    const token = localStorage.getItem("token");
    const shouldRemove = window.confirm(
      "Are you sure you want to remove this skill?"
    );

    if (!shouldRemove) {
      return;
    }

    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }
    const axiosConfig = {
      params: { Id: PerSk_Id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .delete(`${API_BASE_URL}/api/PersonSkills/Delete`, axiosConfig)
      .then((response) => {
        setData(data.filter((item) => item.PerSk_Id !== PerSk_Id));
      });

    // a.catch((error) => { //
    //   console.error("Error removing skill:", error);
    // });
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

  const handleSkillSelection = (selectedSkill) => {
    setFormData1({
      ...formData1,
      Skill_Name: selectedSkill.Skill_Name,
    });
    setSearchResults([]);
  };
  // form 3 exprience submit code
  const [formData3, setFormData3] = useState({
    Exp_months: "",
    PerExp_Id: null,
    Job_Title: "",
    Start_date: "",
    End_Date: "",
    Company_Name: "",
    Industry_Field_Name: "",
  });
  // console.log(formData3);

  const [radioValue, setRadioValue] = useState("Chk_Company");
  const [errorMessages, setErrorMessages] = useState({});
  const token = localStorage.getItem("token");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [companySuggestions, setCompanySuggestions] = useState([]);

  const [companySuggestionsins, setCompanySuggestionsins] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  //  console.log("select", selectedItem);
  const handleRadioChange = (e) => {
    fetchDataAndDisplayTable();
    setRadioValue(e.target.value);
  };

  const handleInputChange3 = (e) => {
    const { name, value } = e.target;
    fetchDataAndDisplayTable();

    if (name.startsWith("Experience.")) {
      setFormData3({
        ...formData3,
        ...formData3.Experience,
        [name.split(".")[1]]: value,
      });
    } else {
      setFormData3({
        ...formData3,
        [name]: value,
      });

      if (name === "Company_Name") {

        fetchCompanySuggestions(e.target.value);
      }
    }
  };


  const fetchCompanySuggestions = async (searchStr) => {
    setLoadingSuggestions(true);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Experience/AutoCompleteCompanyNames?search_str=a`
      );

      setCompanySuggestions(response.data);
      console.log("res", response.data);
      setLoadingSuggestions(false);
    } catch (error) {
      console.error("Error fetching company suggestions:", error);
      setLoadingSuggestions(false);
    }
  };


  const handleUpdate1 = async () => {

    try {
      const updatedItem = {
        PerExp_Id: formData3.PerExp_Id,
        Exp_months: formData3.Exp_months,
        Job_Title: formData3.Job_Title,
        Start_date: formData3.Start_date,
        End_Date: formData3.End_Date,
        Company_Name: formData3.Company_Name,
        Industry_Field_Name: formData3.Industry_Field_Name,
      };

      const response = await axios.put(
        `${API_BASE_URL}/api/PersonExperiences/Update`,
        updatedItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("API Update Response:", response.data);

      setFormData3({
        PerExp_Id: null,
        Exp_months: "",
        Job_Title: "",
        Start_date: "",
        End_Date: "",
        Company_Name: "",
        Industry_Field_Name: "",
      });
      setSelectedItem(null);

      fetchDataAndDisplayTable();
    } catch (error) {
      console.error("API Update Error:", error);
    }
  };

  const handleSubmit3 = async (e) => {
    if (!e) {
      console.error("Event object is undefined.");
      return;
    }
    e.preventDefault();

    const errors = {};

    if (!formData3.Exp_months) {
      errors.Exp_months = "The Exp_months field is required.";
    }

    if (!formData3.Job_Title) {
      errors.Job_Title = "The Job_Title field is required.";
    }

    if (radioValue === "Chk_Company") {
      if (!formData3.Company_Name) {
        errors.Company_Name = "Company_Name is required.";
      }
    } else if (radioValue === "Chk_Industry") {
      if (!formData3.Industry_Field_Name) {
        errors.Industry_Field_Name = "Industry_Field_Name is required.";
      }
    }

    setErrorMessages(errors);

    if (Object.keys(errors).length === 0) {
      if (formData3.PerExp_Id) {
        handleUpdate1();
      } else {
        try {
          const postData = {
            Exp_months: formData3.Exp_months,
            Job_Title: formData3.Job_Title,
            Start_date: formData3.Start_date,
            End_Date: formData3.End_Date,
            Company_Name: formData3.Company_Name,
            Industry_Field_Name: formData3.Industry_Field_Name,
          };

          if (radioValue === "Chk_Company") {
            postData.Company_Name = formData3.Company_Name;
          } else {
            postData.Industry_Field_Name = formData3.Industry_Field_Name;
          }

          const response = await axios.post(
            `${API_BASE_URL}/api/PersonExperiences/Create`,
            postData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // console.log("API Create Response:", response.data);

          setFormData3({
            PerExp_Id: null,
            Exp_months: "",
            Job_Title: "",
            Start_date: "",
            End_Date: "",
            Company_Name: "",
            Industry_Field_Name: "",
          });

          fetchDataAndDisplayTable();
        } catch (error) {
          console.error("API Create Error:", error);
        }
      }
    }
  };

  const handleEdit = (item) => {

    // console.log("df", item);
    setFormData3({
      PerExp_Id: item.PerExp_Id,
      Exp_months: item.Exp_months,
      Job_Title: item.Job_Title,
      Start_date: item.Start_date,
      End_Date: item.End_Date,
      Company_Name: item.Company_Name,
      Industry_Field_Name: item.Industry_Field_Name,
    });
    setSelectedItem(item.PerExp_Id);
    if (item.Company_Name) {
      setRadioValue("Chk_Company");
    } else if (item.Industry_Field_Name) {
      setRadioValue("Chk_Industry");
    }

    setIsEditMode(true);
  };
  // console.log(formData3);

  const handleAddExperience = () => {
    if (isEditMode) {
      handleUpdate1();
    } else {
      handleSubmit3();
    }
    setIsEditMode(false); // Exit edit mode
  };

  const fetchDataAndDisplayTable = async () => {
    const token = localStorage.getItem("token");

    try {
      axios
        .get(`${API_BASE_URL}/api/PersonExperiences/MyList`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTableData(response.data);
          // console.log(response.data);

          const allTableData = response.data;
          if (radioValue === "Chk_Company") {
            const companyData = allTableData.filter(
              (item) => item.Company_Name
            );
            setTableData(companyData);
          } else if (radioValue === "Chk_Industry") {
            const industryData = allTableData.filter(
              (item) => item.Industry_Field_Name
            );
            setTableData(industryData);
          }
        });
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  useEffect(() => {
    fetchDataAndDisplayTable();
  }, [radioValue]);

  const handleRemove1 = (PerExp_Id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }
    const axiosConfig = {
      params: { Id: PerExp_Id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .delete(`${API_BASE_URL}/api/PersonExperiences/Delete`, axiosConfig)
      .then((response) => {
        setTableData((prevTableData) =>
          prevTableData.filter((item) => item.PerExp_Id !== PerExp_Id)
        );
      })
      .catch((error) => {
        console.error("Error removing experience:", error);
      });
  };

  // form hobby form submit code
  const [data44, setData44] = useState([]);
  const [formData44, setFormData44] = useState({
    Hobby_Name: "",
  });
  const [SearchResultsHobbyName, setSearchHobbyName] = useState([]);
  const [errorMessages44, setErrorMessages44] = useState({});

  // const handleChange44 = (e) => {
  //   const { name, value } = e.target;
  //   setFormData44({
  //     ...formData44,
  //     [name]: value,
  //   });
  //   searchHobbyName(e.target.value);
  // };
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
      }

      catch (error) {
        console.error("API Error (Search):", error);
      }
    } else {
      setSearchHobbyName([])

    }
  };

  const handleHobbySelectionHobbyName = (selectedhobby) => {
    setFormData44({
      ...formData44,
      Hobby_Name: selectedhobby.Name,
    });
    setSearchHobbyName([]);
  };

  const handleChange44 = (e) => {
    const { name, value } = e.target;
    setFormData44({
      ...formData44,
      [name]: value,
    });
    searchHobbyName(e.target.value);
  };
  const handleSubmit44 = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData44.Hobby_Name) {
      errors.Hobby_Name = "The Hobby_Name field is required.";
    }

    setErrorMessages44(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const postData = {
          Hobby: {
            Name: formData44.Hobby_Name,
          },
        };

        const response = await axios.post(
          `${API_BASE_URL}/api/PersonHobbies/PerHobCreate`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);
        setFormData44({
          Hobby_Name: "",
        });
        fetchHobbies();
      } catch (error) {
        console.error("API Error:", error);
      }
    }
  };

  // get-hobby

  const fetchHobbies = () => {
    axios
      .get(`${API_BASE_URL}/api/PersonHobbies/MyHobbies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData44(response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    fetchHobbies();
  }, []);

  // remove-hobby

  const handleRemove44 = (Hobby_Id, Person_Id) => {
    // console.log(Hobby_Id, Person_Id);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .delete(
        `${API_BASE_URL}/api/PersonHobbies/Delete?personId=${Person_Id}&hobbyId=${Hobby_Id}`,
        axiosConfig
      )
      .then((response) => {
        setData44(data44.filter((item) => item.Hobby_Id !== Hobby_Id));
        console.error("Response:", response.data);
        alert("Your Hobbies has been removed.");
      })
      .catch((error) => {
        console.error("Error removing skill:", error);
      });
  };

  const handleSelectSuggestion = (suggestion) => {
    if (radioValue === "Chk_Company") {
      setFormData3({
        ...formData3,
        Company_Name: suggestion.Company_Name,
      });
    } else if (radioValue === "Chk_Industry") {
      setFormData3({
        ...formData3,
        Industry_Field_Name: suggestion.Industry_Field_Name,
      });
    }

    // Clear suggestions and reset loading state
    setCompanySuggestions([]);
    setCompanySuggestionsins([]);
    setLoadingSuggestions(false);
  };

  // qulification
  const [formData4, setFormData4] = useState({
    Cou_Name: "",
    Inst_Name: "",
    QCity: "",
    YOP: "",
    Grade: "",
  });
  // const [updateIdQualification, setUpdateIdQualification] = useState([]);
  const [dataQualification, setDataQualification] = useState([]);
  // const [SearchResultsQualificationCourseName, setSearchResultsQualificationCourseName] = useState([]);
  // const [searchResultsQualification, setSearchResultsQualification] = useState([]);
  const [updateIdQualification, setUpdateIdQualification] = useState(null);
  const [searchResultsQualification, setSearchResultsQualification] = useState(
    []
  );
  // console.log("quli", searchResultsQualification);
  const [
    SearchResultsQualificationCourseName,
    setSearchResultsQualificationCourseName,
  ] = useState([]);
  // console.log("course", SearchResultsQualificationCourseName);
  const handleSubmit4 = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (updateIdQualification) {
      const updatedDataQualification = {
        PQ_Id: updateIdQualification,
        Cou_Name: formData4.Cou_Name,
        Inst_Name: formData4.Inst_Name,
        City: formData4.QCity,
        YOP: formData4.YOP,
        Grade: formData4.Grade,
      };

      try {
        const response = await axios.put(
          `${API_BASE_URL}/api/PersonQualifications/Update`,
          updatedDataQualification,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("your Qualification update");
        console.log("API Response (Update):", response.data);

        setFormData4({
          Cou_Name: "",
          Inst_Name: "",
          QCity: "",
          YOP: "",
          Grade: "",
        });
        setUpdateIdQualification(null);

        fetchQualifications();
      } catch (error) {
        console.error("API Error (Update):", error);
      }
    } else {
      const newQualification = {
        Cou_Name: formData4.Cou_Name,
        Inst_Name: formData4.Inst_Name,
        City: formData4.QCity,
        YOP: formData4.YOP,
        Grade: formData4.Grade,
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/PersonQualifications/Create`,
          newQualification,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("your Qualification Added");
        console.log("API Response (Create):", response.data);

        setFormData4({
          YOP: "",
          Grade: "",
          Cou_Name: "",
          Inst_Name: "",
          QCity: "",
        });

        fetchQualifications();
      } catch (error) {
        console.error("API Error:", error);
      }
    }
  };

  const fetchQualifications = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/api/GetUserPerQual`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDataQualification(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchQualifications();
  }, []);

  const handleUpdateQualification = (qualification) => {
    setFormData4({
      Cou_Name: qualification.Cou_Name,
      Inst_Name: qualification.Inst_Name,
      QCity: qualification.QCity,
      YOP: qualification.YOP,
      Grade: qualification.Grade,
    });
    setUpdateIdQualification(qualification.PQ_Id);
  };

  const handleChange4 = (e) => {
    const { name, value } = e.target;
    setFormData4({
      ...formData4,
      [name]: value,
    });
    // searchQualification(e.target.value);
    searchQualificationCourseName(e.target.value);
  };

  const handleChange5 = (e) => {
    const { name, value } = e.target;
    setFormData4({
      ...formData4,
      [name]: value,
    });
    searchQualification(e.target.value);
    // searchQualificationCourseName(e.target.value);
  };

  const handleRemoveQualification = (PQ_Id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "No token found in local storage. You should handle authentication."
      );
      return;
    }
    const axiosConfig = {
      params: { Id: PQ_Id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .delete(`${API_BASE_URL}/api/PersonQualifications/Delete`, axiosConfig)
      .then((response) => {
        setDataQualification(
          dataQualification.filter((item) => item.PQ_Id !== PQ_Id)
        );
        alert("Your Qualification has been removed.");
      })
      .catch((error) => {
        console.error("Error removing Qualification:", error);
      });
  };


  const searchQualification = async (searchTerm) => {
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
          `${API_BASE_URL}/api/Institutes/AutoCompleteInstitute`,
          axiosConfig
        );

        setSearchResultsQualification(response.data);
      } catch (error) {
        console.error("API Error (Search):", error);
      }
    } else {
      setSearchResultsQualification([]);
    }
  };

  const handleSkillSelectionQualification = (selectedQualification) => {
    setFormData4({
      ...formData4,
      Inst_Name: selectedQualification.Inst_Name,
    });
    setSearchResultsQualification([]);
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

  const handleSkillSelectionQualificationCourseName = (
    selectedQualification
  ) => {
    setFormData4({
      ...formData4,
      Cou_Name: selectedQualification.Cou_Name,
    });
    setSearchResultsQualificationCourseName([]);
  };
  // hobby autocomplate

  return (
    <div>
      <Header
        updateOrganizationData={handleOrganizationSwitch}
        onSelectOrganization={handleSelectOrganization}
      />
      <main id="main" className="main">
        <div class="pagetitle">
          <h1>Profile</h1>
          <nav>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="index.html">Home</a></li>
              <li class="breadcrumb-item">Users</li>
              <li class="breadcrumb-item active">Profile</li>
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="profile-back">
              <img src="/assets/img/profile1.jpg" alt="" />
            </div>
            <div className="profile-pic d-flex">
              <img src="/assets/img/pic1.jpg" alt="" />
              <div
                className="upload-link"
                title=""
                data-bs-toggle="tooltip"
                data-placement="right"
                data-original-title="update"
              >
                <input type="file" className="update-flie" />
                <i class="bi bi-camera"></i>
              </div>

              <div className="profile-info2">
                <h2 className="mb-0">Bhavesh Vardangar</h2>
                <h4>UI / UX Designer</h4>
                <span className="d-block">
                  bhavesh123@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>
        <section class="section profile mt-3">
          <div class="row">
            <div class="col-xl-12">
              <div class="card cardrmt">
                <div class="card-body pt-3">
                  <ul class="nav nav-tabs nav-tabs-bordered" role="tablist">
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link active"
                        data-bs-toggle="tab"
                        data-bs-target="#profile-edit"
                        aria-selected="true"
                        role="tab"
                      >
                        Profile
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link"
                        data-bs-toggle="tab"
                        data-bs-target="#person-skills"
                        aria-selected="true"
                        role="tab"
                      >
                        Skills
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link"
                        data-bs-toggle="tab"
                        data-bs-target="#person-experience"
                        aria-selected="true"
                        role="tab"
                      >
                        Experience
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link"
                        data-bs-toggle="tab"
                        data-bs-target="#person-qualification"
                        aria-selected="true"
                        role="tab"
                      >
                        Qualification
                      </button>
                    </li>
                    <li class="nav-item" role="presentation">
                      <button
                        class="nav-link"
                        data-bs-toggle="tab"
                        data-bs-target="#person-hobby"
                        aria-selected="true"
                        role="tab"
                      >
                        Hobby
                      </button>
                    </li>
                  </ul>
                  <div class="tab-content pt-2">
                    <div
                      class="tab-pane fade profile-edit pt-3 active show"
                      id="profile-edit"
                      role="tabpanel"
                    >
                      <form id="Profile-Create" onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <label
                            htmlFor="FirstName"
                            className="col-md-2 col-lg-2 col-form-label"
                          >
                            FirstName
                          </label>
                          <div className="col-md-5 col-lg-4">
                            <input
                              type="text"
                              className="form-control"
                              id="FirstName"
                              name="FirstName"
                              placeholder="Enter your firstname.."
                              value={formData.FirstName}
                              onChange={handleInputChange}
                              required
                            />
                            {errors && errors["person.FirstName"] && (
                              <div className="error">
                                {errors["person.FirstName"][0]}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="row mb-3">
                          <label
                            htmlFor="LastName"
                            className="col-md-2 col-lg-2 col-form-label"
                          >
                            LastName
                          </label>
                          <div className="col-md-5 col-lg-4">
                            <input
                              type="text"
                              className="form-control"
                              id="LastName"
                              name="LastName"
                              placeholder="Enter your Lastname"
                              value={formData.LastName}
                              onChange={handleInputChange}
                              required
                            />
                            {errors && errors["person.LastName"] && (
                              <div className="error">
                                {errors["person.LastName"]}
                              </div>
                            )}
                          </div>
                        </div>

                        <fieldset className="row mb-3">
                          <legend className="col-form-label col-sm-2 pt-0">
                            Gender
                          </legend>
                          <div className="col-sm-4 d-flex">
                            <div className="form-check pe-3">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Gender"
                                id="Gender-Male"
                                value="Male"
                                onChange={handleInputChange}
                                checked={formData.Gender === "Male"}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Gender-Male"
                              >
                                Male
                              </label>
                            </div>
                            <div className="form-check pe-3">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="Gender"
                                id="Gender-Female"
                                value="Female"
                                onChange={handleInputChange}
                                checked={formData.Gender === "Female"}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Gender-Female"
                              >
                                Female
                              </label>
                            </div>
                          </div>
                        </fieldset>

                        <div className="row mb-3">
                          <label
                            htmlFor="City"
                            className="col-md-2 col-lg-2 col-form-label"
                          >
                            City
                          </label>
                          <div className="col-md-5 col-lg-4">
                            <input
                              type="text"
                              className="form-control"
                              id="City"
                              name="City"
                              placeholder="Enter your City"
                              value={formData.City}
                              onChange={handleInputChange}
                              required
                            />
                            {errors && errors["person.City"] && (
                              <div className="error">
                                {errors["person.City"]}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="row mb-3">
                          <label
                            htmlFor="Country"
                            className="col-md-2 col-lg-2 col-form-label"
                          >
                            Country
                          </label>
                          <div className="col-md-5 col-lg-4">
                            <input
                              type="text"
                              className="form-control"
                              id="Country"
                              name="Country"
                              placeholder="Enter your Country"
                              value={formData.Country}
                              onChange={handleInputChange}
                              required
                            />
                            {errors && errors["person.Country"] && (
                              <div className="error">
                                {errors["person.Country"]}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="row mb-3">
                          <label
                            htmlFor="DOB"
                            className="col-md-2 col-lg-2 col-form-label"
                          >
                            Date of Birth
                          </label>
                          <div className="col-md-5 col-lg-4">
                            <input
                              type="date"
                              className="form-control"
                              id="DOB"
                              name="DOB"
                              placeholder="Enter your birthdate.."
                              value={formData.DOB}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <button type="submit" className="btn btn-primary">
                            {buttonText}
                          </button>
                        </div>
                      </form>
                    </div>
                    <div
                      class="tab-pane fade person-skills pt-3"
                      id="person-skills"
                      role="tabpanel"
                    >
                      <div class="row">
                        <div class="col-md-6">
                          <form id="PersonSkill" onSubmit={handleSubmit1}>
                            <div className="row mb-3">
                              <label
                                htmlFor="Skill_Name"
                                className="col-md-3 col-lg-4 col-form-label"
                              >
                                Skill
                              </label>
                              <div className="col-md-8 col-lg-8">
                                <input
                                  type="text"
                                  className="form-control valid"
                                  id="Skill_Name"
                                  name="Skill_Name"
                                  placeholder="Enter Your Skill"
                                  value={formData1.Skill_Name}
                                  onChange={handleChange1}
                                  aria-describedby="Skill_Name-error"
                                  aria-invalid="false"
                                  required
                                />
                                {searchResults.length > 0 && (
                                  <ul className="autocomplete-list">
                                    {searchResults.map((skill) => (
                                      <li
                                        className="auto"
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
                            <div className="row mb-3">
                              <label
                                htmlFor="Experience"
                                className="col-md-3 col-lg-4 col-form-label"
                              >
                                Experience (Months)
                              </label>
                              <div className="col-md-8 col-lg-8">
                                <input
                                  type="number"
                                  className="form-control valid"
                                  id="Experience"
                                  name="Experience"
                                  placeholder="Enter your Experience"
                                  value={formData1.Experience}
                                  onChange={handleChange}
                                  aria-describedby="Experience-error"
                                  aria-invalid="false"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <button type="submit" className="btn btn-primary">
                                {updateId ? "Update" : "Submit"}
                              </button>
                            </div>
                          </form>
                        </div>
                        <div class="col-md-6">
                          <div class="card list_tabel_bo mtresponsive-4
                          
                          ">
                            <div class="card-body">
                              <h5 class="card-title">My Skills</h5>
                             <div className="table-container">
                              <table
                                className="table datatable table-striped table-bordered"
                                id="TblPersonSkill"
                              >
                                <thead>
                                  <tr>
                                    <th scope="col">Skill</th>
                                    <th scope="col">Experience</th>
                                    <th scope="col">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.map((item, index) => (
                                    <tr key={index}>
                                      <td>{item.Skill_Name}</td>
                                      <td>{item.Experience}</td>
                                      <td>
                                        <button className="btn_table_1  bi bi-pencil-square"

                                          onClick={() => handleUpdate(item)}
                                        >
                                        </button>
                                        <button
                                          className="removee btn_delete_t1 bi bi-trash"
                                          onClick={() =>
                                            handleRemove(item.PerSk_Id)
                                          }
                                        >
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                             </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="tab-pane fade person-experience pt-3"
                      id="person-experience"
                      role="tabpanel"
                    >
                      <div class="row">
                        <div class="col-md-6">
                          <form id="PersonExperience" onSubmit={handleSubmit3}>
                            <fieldset class="row mb-3">
                              <legend class="col-form-label col-sm-4 pt-0">
                                Experience Type{" "}
                              </legend>
                              <div class="col-sm-8 d-flex">
                                <div class="form-check pe-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="ExpRadios"
                                    id="gridRadios1"
                                    value="Chk_Company"
                                    required
                                    checked={radioValue === "Chk_Company"}
                                    onChange={handleRadioChange}
                                  />
                                  <label
                                    class="form-check-label"
                                    for="gridRadios1"
                                  >
                                    Company
                                  </label>
                                </div>
                                <div class="form-check pe-3">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="ExpRadios"
                                    id="gridRadios2"
                                    value="Chk_Industry"
                                    required
                                    checked={radioValue === "Chk_Industry"}
                                    onChange={handleRadioChange}
                                  />
                                  <label
                                    class="form-check-label"
                                    for="gridRadios2"
                                  >
                                    Industry
                                  </label>
                                </div>
                              </div>
                            </fieldset>
                            {radioValue === "Chk_Company" ? (
                              <div className="row mb-3" id="company-div">
                                <label
                                  htmlFor="Company_Name"
                                  className="col-md-3 col-lg-4 col-form-label"
                                >
                                  Company Name
                                </label>
                                <div className="col-md-8 col-lg-8">
                                  <input
                                    type="text"
                                    className="form-control valid"
                                    id="Company_Name"
                                    name="Experience.Company_Name"
                                    placeholder="Enter your company name.."
                                    aria-describedby="Company_Name-error"
                                    aria-invalid="false"
                                    value={formData3.Company_Name}
                                    required
                                    onChange={handleInputChange3}
                                  />
                                  {loadingSuggestions && (
                                    <p>Loading suggestions...</p>
                                  )}
                                  {!loadingSuggestions &&
                                    companySuggestions.length > 0 && (
                                      <ul>
                                        {companySuggestions.map((suggestion) => (
                                          <li key={suggestion.id} onClick={() => handleSelectSuggestion(suggestion)}>
                                            {suggestion.name}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                </div>
                              </div>
                            ) : (
                              <div className="row mb-3" id="industry-div">
                                <label
                                  htmlFor="Industry_Field_Name"
                                  className="col-md-3 col-lg-4 col-form-label"
                                >
                                  Industry Name
                                </label>
                                <div className="col-md-8 col-lg-8">
                                  <input
                                    type="text"
                                    className="form-control valid"
                                    id="Industry_Field_Name"
                                    name="Experience.Industry_Field_Name"
                                    placeholder="Enter your Industry name.."
                                    value={formData3.Industry_Field_Name}
                                    aria-describedby="Industry_Field_Name-error"
                                    aria-invalid="false"
                                    required
                                    onChange={handleInputChange3}
                                  />
                                </div>
                              </div>
                            )}
                            <div class="row mb-3">
                              <label
                                for="Job_Title"
                                class="col-md-3 col-lg-4 col-form-label"
                              >
                                Job Title
                              </label>
                              <div class="col-md-8 col-lg-8">
                                <input
                                  type="text"
                                  class="form-control valid"
                                  id="Job_Title"
                                  name="Job_Title"
                                  value={formData3.Job_Title}
                                  placeholder="Enter your job title.."
                                  aria-describedby="Job_Title-error"
                                  aria-invalid="false"
                                  onChange={handleInputChange3}
                                  required
                                />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label
                                for="Exp_months"
                                class="col-md-3 col-lg-4 col-form-label"
                              >
                                Months
                              </label>
                              <div class="col-md-8 col-lg-8">
                                <input
                                  type="number"
                                  class="form-control valid"
                                  id="Exp_months"
                                  value={formData3.Exp_months}
                                  name="Exp_months"
                                  placeholder="Enter your experience of months.."
                                  aria-describedby="Exp_months-error"
                                  aria-invalid="false"
                                  onChange={handleInputChange3}
                                  required
                                />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label
                                for="Start_date"
                                class="col-md-3 col-lg-4 col-form-label"
                              >
                                Start Date
                              </label>
                              <div class="col-md-8 col-lg-8">
                                <input
                                  type="date"
                                  class="form-control valid"
                                  id="Start_date"
                                  name="Start_date"
                                  value={moment(formData3.Start_date).format("YYYY-MM-DD")}
                                  placeholder="Enter your start date"
                                  aria-describedby="Start_date-error"
                                  aria-invalid="false"
                                  onChange={handleInputChange3}
                                  required
                                />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label
                                for="End_Date"
                                class="col-md-3 col-lg-4 col-form-label"
                              >
                                End Date
                              </label>
                              <div class="col-md-8 col-lg-8">
                                <input
                                  type="date"
                                  class="form-control valid"
                                  id="End_Date"
                                  value={moment(formData3.End_Date).format("YYYY-MM-DD")}
                                  name="End_Date"
                                  placeholder="Enter your end date"
                                  aria-describedby="End_Date-error"
                                  aria-invalid="false"
                                  onChange={handleInputChange3}
                                  required
                                />
                              </div>
                            </div>
                            <div class="">
                              {errorMessages.Exp_months && (
                                <div className="alert alert-danger">
                                  {errorMessages.Exp_months}
                                </div>
                              )}
                              {errorMessages.Job_Title && (
                                <div className="alert alert-danger">
                                  {errorMessages.Job_Title}
                                </div>
                              )}
                              {errorMessages.Experience && (
                                <div className="alert alert-danger">
                                  {errorMessages.Experience}
                                </div>
                              )}
                              <button
                                type="submit"
                                class="btn btn-primary"
                                onClick={handleAddExperience}
                              >
                                {isEditMode
                                  ? "Update Experience"
                                  : "Add Experience"}
                              </button>
                            </div>
                          </form>
                        </div>
                        <div class="col-md-6">
                          <div class="card list_tabel_bo mtresponsive-4">
                            <div class="card-body">
                              <h5 class="card-title">My Experience</h5>
                              <div className="table-container">
                              <table
                                className="table datatable"
                                id="TblPersonExperience"
                              >
                                <thead>
                                  <tr>
                                    {radioValue === "Chk_Company" && (
                                      <th scope="col">Company Name</th>
                                    )}
                                    {radioValue === "Chk_Industry" && (
                                      <th scope="col">Industry Name</th>
                                    )}
                                    <th scope="col">Job_Title</th>
                                    <th scope="col">Months</th>
                                    <th scope="col">Start_Date</th>
                                    <th scope="col">End_date</th>
                                    <th scope="col">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {tableData.map((item, index) => (
                                    <tr key={index}>
                                      {radioValue === "Chk_Company" && (
                                        <td>{item.Company_Name}</td>
                                      )}
                                      {radioValue === "Chk_Industry" && (
                                        <td>{item.Industry_Field_Name}</td>
                                      )}
                                      <td>{item.Job_Title}</td>
                                      <td>{item.Exp_months}</td>
                                      <td>
                                        {moment(item.Start_date).format(
                                          "YYYY-MM-DD"
                                        )}
                                      </td>
                                      <td>
                                        {moment(item.End_Date).format(
                                          "YYYY-MM-DD"
                                        )}
                                      </td>
                                      <td>
                                        <button className="btn_table_1  bi bi-pencil-square"
                                          onClick={() => handleEdit(item)}
                                        >
                                        </button>
                                        <button
                                          className="removee btn_delete_t1 bi bi-trash"
                                          onClick={() =>
                                            handleRemove1(item.PerExp_Id)
                                          }
                                        >
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="tab-pane fade person-qualification pt-3"
                      id="person-qualification"
                      role="tabpanel"
                    >
                      <div class="row">
                        <div class="col-md-6">
                          <form
                            id="PersonQualification"
                            onSubmit={handleSubmit4}
                          >
                            <div className="row mb-3">
                              <label
                                htmlFor="Cou_Name"
                                className="col-md-3 col-lg-4 col-form-label"
                              >
                                Course Name
                              </label>
                              <div className="col-md-8 col-lg-8">
                                <input
                                  type="text"
                                  className="form-control valid"
                                  id="Cou_Name"
                                  name="Cou_Name"
                                  value={formData4.Cou_Name}
                                  onChange={handleChange4}
                                  placeholder="Enter your course name"
                                  aria-describedby="Cou_Name-error"
                                  aria-invalid="false"
                                  required
                                />

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
                            <div className="row mb-3">
                              <label
                                htmlFor="Inst_Name"
                                className="col-md-3 col-lg-4 col-form-label"
                              >
                                Institute Name{" "}
                              </label>
                              <div className="col-md-8 col-lg-8">
                                <input
                                  type="text"
                                  className="form-control valid"
                                  id="Inst_Name"
                                  name="Inst_Name"
                                  value={formData4.Inst_Name}
                                  onChange={handleChange5}
                                  placeholder="Enter your institute name.."
                                  aria-describedby="Inst_Name-error"
                                  aria-invalid="false"
                                  required
                                />
                                {searchResultsQualification.length > 0 && (
                                  <ul className="autocomplete-list">
                                    {searchResultsQualification.map(
                                      (qualification1) => (
                                        <li
                                          onClick={() =>
                                            handleSkillSelectionQualification(
                                              qualification1
                                            )
                                          }
                                        >
                                          {qualification1.Inst_Name}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                              </div>
                            </div>
                            {/* 
                        <div className="row mb-3">
                          <label
                            htmlFor="QCity"
                            className="col-md-3 col-lg-4 col-form-label"
                          >
                            QCity
                          </label>
                          <div className="col-md-8 col-lg-8">
                            <input
                              type="text"
                              className="form-control valid"
                              id="QCity"
                              name="QCity"
                              value={formData4.QCity}
                              onChange={handleChange4}
                              placeholder="Enter your Qcity.."
                              aria-describedby="QCity-error"
                              aria-invalid="false"
                            />
                          </div>
                        </div>
                        */}
                            <div className="row mb-3">
                              <label
                                htmlFor="YOP"
                                className="col-md-3 col-lg-4 col-form-label"
                              >
                                Year Of Passing
                              </label>
                              <div className="col-md-8 col-lg-8">
                                <input
                                  type="date"
                                  className="form-control valid"
                                  id="YOP"
                                  // value={formData4.YOP}
                                  onChange={handleChange4}
                                  value={moment(formData4.YOP).format("YYYY-MM-DD")}
                                  // value={formData4.YOP}
                                  name="YOP"
                                  aria-describedby="YOP-error"
                                  aria-invalid="false"
                                />
                              </div>
                            </div>
                            <div className="row mb-3">
                              <label
                                htmlFor="Grade"
                                className="col-md-3 col-lg-4 col-form-label"
                              >
                                Grade
                              </label>
                              <div className="col-md-8 col-lg-8">
                                <input
                                  type="text"
                                  className="form-control valid"
                                  id="Grade"
                                  name="Grade"
                                  value={formData4.Grade}
                                  onChange={handleChange4}
                                  placeholder="Enter your grade.."
                                  aria-describedby="Grade-error"
                                  aria-invalid="false"
                                />
                              </div>
                            </div>
                            <div className="">
                              <button type="submit" className="btn btn-primary">
                                {updateIdQualification
                                  ? "Update Qualification"
                                  : "Add Qualification"}
                              </button>
                            </div>
                          </form>
                        </div>
                        <div class="col-md-6">
                          <div class="card list_tabel_bo mtresponsive-4">
                            <div class="card-body">
                              <h5 class="card-title">My Qualifications</h5>
                            <div className="table-container">  
                              <table
                                className="table datatable"
                                id="TblPersonQualification"
                              >
                                <thead>
                                  <tr>
                                    <th scope="col">Course Name</th>
                                    <th scope="col">Institute Name</th>
                                    {/* 
                                  <th scope="col">City</th>
                                  */}
                                    <th scope="col">Year Of Passing</th>
                                    <th scope="col">Grade</th>
                                    <th scope="col">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {dataQualification.map(
                                    (qualification, index) => (
                                      <tr key={index}>
                                        <td>{qualification.Cou_Name}</td>
                                        <td>{qualification.Inst_Name}</td>
                                        {/*
                                      <td>{qualification.QCity}</td>
                                       */}
                                        <td>
                                          {moment(qualification.YOP).format(
                                            "YYYY-MM-DD"
                                          )}
                                        </td>
                                        <td>{qualification.Grade}</td>
                                        <td>
                                          <button className="btn_table_1  bi bi-pencil-square"
                                            onClick={() =>
                                              handleUpdateQualification(
                                                qualification
                                              )
                                            }
                                          >
                                          </button>

                                          <button className="removee btn_delete_t1 bi bi-trash"
                                            onClick={() =>
                                              handleRemoveQualification(
                                                qualification.PQ_Id
                                              )
                                            }
                                          >
                                          </button>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="tab-pane fade person-hobby pt-3"
                      id="person-hobby"
                      role="tabpanel"
                    >
                      <div class="row">
                        <div class="col-md-6">
                          <form id="PersonHobby" onSubmit={handleSubmit44}>
                            <div className="row mb-3">
                              <label
                                htmlFor="Hobby_Name"
                                className="col-md-3 col-lg-4 col-form-label"
                              >
                                Hobby Name
                              </label>
                              <div className="col-md-8 col-lg-8">
                                <input
                                  type="text"
                                  className="form-control valid"
                                  id="Hobby_Name"
                                  name="Hobby_Name"
                                  value={formData44.Hobby_Name}
                                  placeholder="Enter your hobby"
                                  aria-describedby="Hobby_Name-error"
                                  aria-invalid="false"
                                  required
                                  onChange={handleChange44}
                                />
                                {SearchResultsHobbyName.length > 0 && (
                                  <ul className="autocomplete-list">
                                    {SearchResultsHobbyName.map((Hobby) => (
                                      <li
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
                            <div className="">
                              {errorMessages.Hobby_Name && (
                                <div className="alert alert-danger">
                                  {errorMessages.Hobby_Name}
                                </div>
                              )}

                              <button type="submit" className="btn btn-primary">
                                Add Hobby
                              </button>
                            </div>
                          </form>
                        </div>
                        <div class="col-md-6">
                          <div class="card list_tabel_bo mtresponsive-4">
                            <div class="card-body">
                              <h5 class="card-title">My Hobby</h5>
                            <div className="table-container">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>Hobby</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data44.map((item, index) => (
                                    <tr key={index}>
                                      <td>{item.Name}</td>
                                      <td>
                                        <button className="removee btn_delete_t1 bi bi-trash"
                                          onClick={() =>
                                            handleRemove44(
                                              item.Hobby_Id,
                                              item.Person_Id
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
export default Home;

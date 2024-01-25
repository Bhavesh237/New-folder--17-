import React,{useState,useEffect} from 'react'
import Header from './Header'
import axios from "axios";
import API_BASE_URL from "./apiconfig";
import moment from "moment";
import { Link } from 'react-router-dom';
const Header1 = () => {
    const OrgAdminPer = localStorage.getItem("OrgAdminPer");
    // const parsedOrgAdminPer = OrgAdminPer ? JSON.parse(OrgAdminPer) : [];
    // const [selectedOrg, setSelectedOrg] = useState(parsedOrgAdminPer[0] || {});
    // const [orgId, setSelectedOrg1] = useState(parsedOrgAdminPer[0] || null);
    const handleOrganizationSwitch = (org) => {
    //   setFormData({
        // ...formData,
        // Org_Name: org.Org_Name,
        // Org_Id: org.Org_Id,
    //   });
    };
    
    const handleSelectOrganization = (org) => {
      // setSelectedOrg1(org);
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
      const profileExistValue = localStorage.getItem('profile_exist');
  
      if (profileExistValue === 'False') {
        setIsModalOpen(true);
      }
    }, []);
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
  
        let response;
  
        if (profileExist === "False") {
          response = await axios.post(
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
          console.log(response);
        } else if (profileExist === "True") {
          response = await axios.put(
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
          return;
        }
  
        if (response && response.data) {
          const newProfileExistValue = response.data ? "True" : "False";
          localStorage.setItem("profile_exist", newProfileExistValue);
          setIsModalOpen(false);
        }
      } catch (error) {
        if (error.response) {
          setErrors(error.response.data.ModelState);
        } else {
          console.error("Error:", error);
        }
      }
    };
    

  return (
    <div>
    <Header
    updateOrganizationData={handleOrganizationSwitch}
    onSelectOrganization={handleSelectOrganization}
  />
  
  <div className={`modal fade ${isModalOpen ? 'show' : ''}`} id="basicModal" tabIndex="-1" style={{ display: isModalOpen ? 'block' : 'none' }}>
 <div class="modal-dialog d-flex justify-content-center">
   <div class="modal-content2 pe-auto">
     <div class="modal-header">
       <h5 class="modal-title">Create profile</h5>
       {/* 
       <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       */}
     </div>
     <div class="modal-body modal-dialog_123">
     <div className="">
     <div className="popup1 user-select-auto">
     <form id="Profile-header" onSubmit={handleSubmit}>
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
             required
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
             required
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
   </div>
     </div>
     
   </div>
 </div>
</div>
{isModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  )
}

export default Header1

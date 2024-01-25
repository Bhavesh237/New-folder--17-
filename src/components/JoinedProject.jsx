import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./apiconfig";
import Header from "./Header";
const JoinedProject = () => {
    const {ProjectId} = useParams();
    const [Project_Id, setProject_Id] = useState(ProjectId);
    const personId =localStorage.getItem("Person_Id")
    const [trainingCriteria, setTrainingCriteria] = useState([]);
    const [expCriteria, setExpCriteria] = useState([]);
    const [qualifications, setQualifications] = useState([]);
    const [skills, setSkills] = useState([]);
    useEffect(() => {
        const fetchTrainingCriteria = async () => {
          const token = localStorage.getItem("token");
    
          // Getting Hobby
          try {
            const criteriaResponse = await axios.get(
              `${API_BASE_URL}/api/Project_Criteria/Hobby/GetByProjectId?ProjectId=${Project_Id}`,
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
    
          // Getting Skill
          try {
            const hobbyCriteriaResponse = await axios.get(
              `${API_BASE_URL}/api/Project_Criteria/GetSkillsByProjectId?ProjectId=${Project_Id}`,
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
    
          // Getting Qualification
          try {
            const qualificationsResponse = await axios.get(
              `${API_BASE_URL}/api/Project_Criteria/GetQualifications?projectId=${Project_Id}`,
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
    
          // Getting Experience
          try {
            const expCriteriaResponse = await axios.get(
              `${API_BASE_URL}/api/Project_Criteria/Get_Proj_ExpCriteria?projectId=${ProjectId}`,
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
        fetchTrainingCriteria();
      }, [Project_Id]);
  return (
    <div>
    <div>
    <Header></Header>
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
                    <div className="form-wrapper">
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
                              placeholder="Enter hobby"
                            />
                          </div>
                        </div>
                        <div className="experience"></div>
                        <span className="buttons-wrapper">
                          <button className="btn cancel_btn">Cancel</button>
                          <button className="btn_add" disabled="">
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
                          Check me out
                        </label>
                      </div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th className="main">Hobby</th>
                          <th className="manage"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {trainingCriteria.map((data) => (
                          <tr>
                            <td>
                              <span
                                className={`no-capitalization ${
                                  data.Mandatory
                                    ? "mandatory-btn"
                                    : "non-mandatory-btn"
                                }`}
                              >
                                {data.HobbyName}
                              </span>
                            </td>
                            <td className="manage">
                              <div className="animate">
                                <span
                                  className="hint--top"
                                  data-hint="Edit"
                                >
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
                    <div className="form-wrapper">
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
                          <button className="btn cancel_btn">Cancel</button>
                          <button className="btn_add" disabled="">
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
                          Mandatory or Not
                        </label>
                      </div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th className="main">Skill</th>
                          <th className="secondary">Experience</th>
                          <th className="manage"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {skills.map((data) => (
                          <tr>
                            <td>
                              <span
                                className={`no-capitalization ${
                                  data.Mandatory
                                    ? "mandatory-btn"
                                    : "non-mandatory-btn"
                                }`}
                              >
                                {data.Skill_Name}
                              </span>
                            </td>
                            <td
                              className={`no-capitalization ${
                                data.Mandatory
                                  ? "mandatory-btn"
                                  : "non-mandatory-btn"
                              }`}
                            >
                              <span
                                className={`no-capitalization ${
                                  data.Mandatory
                                    ? "mandatory-btn"
                                    : "non-mandatory-btn"
                                }`}
                              >
                                {data.Experience}
                              </span>
                            </td>
                            <td className="manage">
                              <div className="animate">
                                <span
                                  className="hint--top"
                                  data-hint="Edit"
                                ></span>
                                <span
                                  className="hint--top"
                                  data-hint="Delete"
                                ></span>
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
                    <div className="form-wrapper">
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
                        <div className="experience"></div>
                        <span className="buttons-wrapper">
                          <button className="btn cancel_btn">Cancel</button>
                          <button className="btn_add" disabled="">
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
                          Mandatory or Not
                        </label>
                      </div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th className="main">Education</th>
                          <th className="manage"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {qualifications.map((data) => (
                          <tr>
                            <td>
                              <span
                                className={`no-capitalization ${
                                  data.Mandatory
                                    ? "mandatory-btn"
                                    : "non-mandatory-btn"
                                }`}
                              >
                                {data.Cou_Name}
                              </span>
                            </td>
                            <td className="manage">
                              <div className="animate">
                                <span
                                  className="hint--top"
                                  data-hint="Edit"
                                ></span>
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
                    <div className="form-wrapper">
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
                          <button className="btn cancel">Cancel</button>
                          <button className="btn_add" disabled="">
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
                          <th className="manage"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {expCriteria.map((data) => (
                          <tr>
                            <td>
                              <span
                                className={`no-capitalization ${
                                  data.Mandatory
                                    ? "mandatory-btn"
                                    : "non-mandatory-btn"
                                }`}
                              >
                                {data.Company_Name}
                              </span>
                            </td>
                            <td
                              className={`no-capitalization ${
                                data.Mandatory
                                  ? "mandatory-btn"
                                  : "non-mandatory-btn"
                              }`}
                            >
                              <span>{data.Industry_Field_Name}</span>
                            </td>
                            <td
                              className={`no-capitalization ${
                                data.Mandatory
                                  ? "mandatory-btn"
                                  : "non-mandatory-btn"
                              }`}
                            >
                              <span>{data.Exp_months}</span>
                            </td>
                            <td
                              className={`no-capitalization ${
                                data.Mandatory
                                  ? "mandatory-btn"
                                  : "non-mandatory-btn"
                              }`}
                            >
                              <span>{data.Job_Title}</span>
                            </td>
                            <td className="manage">
                              <div className="animate">
                                <span
                                  className="hint--top"
                                  data-hint="Edit"
                                ></span>
                                <span
                                  className="hint--top"
                                  data-hint="Delete"
                                ></span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                   
                  </div>
                  <div class="ml_10_ d-flex justify-content-center">
                
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
  )
}

export default JoinedProject

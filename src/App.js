import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Forgot from "./components/Forgot";
import Home from "./components/Home";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Manages_organization from "./components/Manages_organization";
import Org_Admin from "./components/Org_Admin";
import Header from "./components/Header";
import Give_training from "./components/Give_training";
import Training_Criteria from "./components/Training_Criteria";
import Details from "./components/Details";
import Details1 from "./components/Details1";
import Project from "./components/Project";
import Project_Criteria from "./components/Project_Criteria";
import Project_Details from "./Project_Details";
import JoinedProject from "./components/JoinedProject";
import Header1 from "./components/Header1";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Headerr/>} />
      <Route path="/profile" element={<PrivateRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/manages_organization" element={<PrivateRouteOrganization />}></Route>
      <Route path="/Org_Admin" element={<PrivateRouteOrgAdmin />}></Route>
      <Route path="/Givetraining" element={<Givetraining />}></Route>
      <Route path="/Training_Criteria/:trainingId" element={<TrainingCriteria />}/>
      <Route path="/Details/:trainingId" element={<Details />}/>
      <Route path="/Details1/:trainingId" element={<Details1 />}/>
      <Route path="/ProjectDetails/:ProjectId" element={<Project_Details />}/>
      <Route path="/Project" element={<Projectt/>}></Route>
      <Route path="/Joined_Project_Details/:ProjectId" element={<JoinedProject/>}></Route>
      <Route path="/Project_Criteria/:ProjectId" element={<ProjectCriteria/>}></Route>
    </Routes>
  );
}

function PrivateRoute() {
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Home /> : null;
}

function ProjectCriteria() {
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Project_Criteria /> : null;
}
function Headerr() {
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Header1 /> : null;
}
function Projectt() {
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Project /> : null;
}
function TrainingCriteria() {
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Training_Criteria /> : null;
}
function Givetraining() {
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Give_training /> : null;
}
function PrivateRouteOrganization() {
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Manages_organization /> : null;
}

function PrivateRouteOrgAdmin() {
  const isAuthenticated = !!localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Org_Admin /> : null;
}

export default App;

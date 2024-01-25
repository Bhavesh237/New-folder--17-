import React from 'react'
import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
const Headergive = () => {
    const username = localStorage.getItem("username");
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [currentOrg, setCurrentOrg] = useState({});
    const navigate = useNavigate();
  
    const handleSignOut = () => {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      navigate("/login");
    };
    const roles = localStorage.getItem("roles");
    const hasOrgAdminRole = roles && roles.includes("OrgAdmin");   
  return (
    <div>
    <header id="header" className="header ">
      <div className=""></div>
      <div className="row">
        <div className="col-6 col-xl-9">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
              <Link to="/" className="navbar-brand">
                Ksquarez
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse justify-content-center"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav  mb-2 mb-lg-0"></ul>
              </div>
            </div>
          </nav>
        </div>
        <div className="col-6 col-xl-3">
          <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center float-end ">
              <li className="nav-item d-block d-lg-none">
                <a className="nav-link nav-icon search-bar-toggle " href="#">
                  <i className="bi bi-search"></i>
                </a>
              </li>

              <li className="nav-item dropdown pe-3">
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                  <li className="dropdown-header">
                    <h6>{username}</h6>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center"
                      to="/home"
                    >
                      <span>My Profile</span>
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center"
                      to="/manages_organization"
                    >
                      <span>manages organization1</span>
                    </Link>
                  </li>
                  
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  {/* 
              <li>
                <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                  <i className="bi bi-question-circle"></i>
                  <span>Need Help?</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider"/>
              </li>
*/}
                  {isAuthenticated ? (
                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center"
                        onClick={handleSignOut}
                      >
                        <span>Sign Out</span>
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link nav-icon"
                  href="#"
                  data-bs-toggle="dropdown"
                ></a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages"></ul>
              </li>
              <li className="nav-item dropdown pe-3">
                <a
                  className="nav-link nav-profile d-flex align-items-center pe-0"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  <img
                    src="assets/img/profile-img.jpg"
                    alt="Profile"
                    className="rounded-circle"
                  />
                  <span className="d-none d-md-block dropdown-toggle ps-2">
                    {username}
                  </span>
                </a>

                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                  <li className="dropdown-header">
                    <h6>{username}</h6>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center"
                      to="/"
                    >
                      <span>My Profile</span>
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center"
                      to="/manages_organization"
                    >
                      <span>manages organization</span>
                    </Link>
                  </li>
                  <li>
                  <hr className="dropdown-divider" />
                </li>
                
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/Givetraining"
                  >
                    <span>Givetraining</span>
                  </Link>
                </li>
                <hr className="dropdown-divider" />
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/Project"
                  >
                    <span>Project</span>
                  </Link>
                </li>
                  {hasOrgAdminRole && (
                    <li>
                    <hr className="dropdown-divider" />
                  </li>
                  )}
                  
                <li>
                {hasOrgAdminRole && (
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/Org_Admin"
                  >
                    <span>Org Admin</span>
                  </Link>
                )}
              </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  {/* 
              <li>
                <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                  <i className="bi bi-question-circle"></i>
                  <span>Need Help?</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider"/>
              </li>
*/}
                  {isAuthenticated ? (
                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center"
                        onClick={handleSignOut}
                      >
                        <span>Sign Out</span>
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  </div>
  )
}

export default Headergive

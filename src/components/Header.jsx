import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ updateOrganizationData, onSelectOrganization }) => {
  const select = localStorage.getItem("selectedOrg")
  const [select1, setselect1] = useState(select)
  const user = localStorage.getItem("user");
  const switchOrganization = (org) => {
    setSelectedOrg(org);
    setCurrentOrg(org);
    updateOrganizationData(org);
    onSelectOrganization(org);
    setselect1(org.Org_Name);
    const orgArray = Object.values(org);
    localStorage.setItem("org", JSON.stringify(orgArray));
    localStorage.setItem("selectedOrg", org.Org_Name,);
    localStorage.setItem("selectedOrg1", org.Org_Id);
  };

  const username = localStorage.getItem("username");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentOrg, setCurrentOrg] = useState({});
  const navigate = useNavigate();
  const parsedOrgAdminPer = JSON.parse(localStorage.getItem("OrgAdminPer")) || [];
  const [selectedOrg, setSelectedOrg] = useState(parsedOrgAdminPer[0] || {});
  useEffect(() => {
    const storedOrgName = localStorage.getItem("selectedOrg") || "Select Organization";
    setselect1(storedOrgName);

  }, []);


  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const roles = localStorage.getItem("roles");
  const hasOrgAdminRole = roles && roles.includes("OrgAdmin");

  const handleSidebarToggle = () => {
    const body = document.querySelector('body');
    body.classList.toggle('toggle-sidebar');
  };

  // Attach the click event listener to the button
  const onToggleButtonClick = () => {
    handleSidebarToggle();
  };

  return (
    <div>

      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center">
            <img src="/assets/img/ksquarez-logo-vector-(3) (1).png" alt="" />
            <span className="d-none d-lg-block">VersaTribe</span>
          </a>
          <i className="bi bi-list toggle-sidebar-btn" onClick={onToggleButtonClick} />
        </div>
        {/* End Logo */}
        <div className="search-bar">
          <form
            className="search-form d-flex align-items-center"
            method="POST"
            action="#"
          >
            <input
              type="text"
              name="query"
              placeholder="Search"
              title="Enter search keyword"
            />
            <button type="submit" title="Search">
              <i className="bi bi-search" />
            </button>
          </form>
        </div>
        {/* End Search Bar */}
        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center float-end ">
            <li className="nav-item d-block d-lg-none">
              <a className="nav-link nav-icon search-bar-toggle " href="#">
                <i className="bi bi-search"></i>
              </a>
            </li>

            <li className="nav-item dropdown pe-3">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="orgDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {select1}
              </a>

              <ul className="dropdown-menu" aria-labelledby="orgDropdown">
                {parsedOrgAdminPer.map((org, Org_Id) => (
                  <li key={Org_Id}>
                    <Link
                      className="dropdown-item"
                      onClick={() => switchOrganization(org)}
                    >
                      {org.Org_Name}
                    </Link>
                  </li>
                ))}
              </ul>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>{username}</h6>
                  <span>{user}</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/profile"
                  >
                    <i className="bi bi-person" />
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
                    <span>Manages Organization1</span>
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
                  <span>{user}</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/profile"
                  >
                    <i className="bi bi-person" />
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
                    <i className="bi bi-building" />
                    <span>Manages Organization</span>
                  </Link>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/Givetraining"
                  >
                    <i className="bi bi-diagram-3" />
                    <span>Training</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/Project"
                  >
                    <i className="bi bi-database" />

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
                      <i className="bi bi-person-lines-fill" />

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
                      <i className="bi bi-box-arrow-right" />
                      <span>Sign Out</span>
                    </Link>
                  </li>
                ) : null}
              </ul>
            </li>
          </ul>
        </nav>
        {/* End Icons Navigation */}
      </header>
      {/* End Header */}
      {/* ======= Sidebar ======= */}
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">         
          <li className="nav-heading">Pages</li>
          <li className="nav-item collapsed">

            <Link
              className="dropdown-item d-flex align-items-center "
              to="/profile"
            >
              <i className="bi bi-person" />
              <span>Profile</span>
              {/*<i className="bi bi-chevron-down ms-auto">*/}
            </Link>

          </li>
          {/* End Profile Page Nav */}
          <li className="nav-item">
            <Link
              className="dropdown-item d-flex align-items-center"
              to="/manages_organization"
            >
              <i className="bi bi-building" />
              <span>manages_organization</span>
              {/*<i className="bi bi-chevron-down ms-auto" />*/}
            </Link>


          </li>
          {/* End F.A.Q Page Nav */}
          <li className="nav-item">
            <Link
              className="dropdown-item d-flex align-items-center"
              to="/Givetraining"
            >
              <i className="bi bi-diagram-3" />
              <span>Trainings</span>
            </Link>
          </li>
          {/* End Contact Page Nav */}
          <li className="nav-item">
            <Link
              className="dropdown-item d-flex align-items-center "
              to="/Project"
            >
              <i className="bi bi-database" />
              <span>Project</span>
            </Link>
          </li>
          {/* End Register Page Nav */}
          <li className="nav-item">
            <Link
              className="dropdown-item d-flex align-items-center "
              to="/Org_Admin"
            >
              <i className="bi bi-person-lines-fill" />
              <span>Org_Admin</span>
            </Link>
          </li>
          {/* End Login Page Nav */}
        </ul>
      </aside>


    </div>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./apiconfig";

const Registration = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegistration = async (e) => {
    e.preventDefault();
  
    if (formData.email.trim() === "" || formData.password.trim() === "") {
      setErrorMessage("Email and password are required.");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password and confirm password do not match.");
      return;
    }
  
    const passwordRegex = /^(?=.*[^a-zA-Z0-9])/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMessage("Password must have at least one non-letter or digit character.");
      return;
    }
  
    try {

      setLoading(true);
  
      const response = await axios.post(`${API_BASE_URL}/api/Account/Register`, {
        email: formData.email,
        Password: formData.password,
        ConfirmPassword: formData.confirmPassword,
      });
  
     
      alert("Check your email and confirm your account, you must be confirmed before you can log in.");
      console.log("Registration success:", response.data);
  
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrorMessage("");
      navigate("/login");
      setLoading(false);
    } catch (error) {
     
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  
  const Loader = () => (
    <div className="full-screen-spinner-overlay">
      <div className="spinner" />
    </div>
  );
  return (
    <div>
    {loading && <Loader />}
      <div class="login_pages_bady">
        <div class="login_pages_left ">
          <div class="left-inner">
            <div class="sign-in-form active">
              <h1>Registration in to Your Brand</h1>

              <form name="myForm" id="myForm" onSubmit={handleRegistration}>
                <div className="form-group1">
                  <label className="label_1_1" htmlFor="email1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    className="form_in_bg"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group1">
                  <label className="label_1_1" htmlFor="password1">
                    Password
                  </label>
                  <input
                  type={showPassword ? "text" : "password"}
                    className="form_in_bg"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                  />
                  <button
                  type="button"
                  className="password-toggle-btn bi-eye1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                
                  {showPassword ? <i className="bi bi-eye"></i>: <i className="bi bi-eye-slash"></i>}
                </button>
                </div>
                <div className="form-group1">
                  <label htmlFor="password2">Confirm Password</label>
                  <input
                    id="password2"
                    type={showPassword ? "text" : "password"}
                    className="form_in_bg"
                    placeholder="Enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <button
                  type="button"
                  className="password-toggle-btn bi-eye1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                
                  {showPassword ? <i className="bi bi-eye"></i>: <i className="bi bi-eye-slash"></i>}
                </button>
                </div>
                <div className="form-group remember-forgot">{errorMessage}</div>
                <button className="btn_login_pages" type="submit">
                  SIGN UP
                </button>
                <div className="create-aacount">
                  Already have an account?{" "}
                  <Link to="/" className="text-underline sign-up-form-btn">
                    Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="login_pages_right">
          <div class="right-inner"></div>
        </div>
      </div>
    </div>
  );
};

export default Registration;

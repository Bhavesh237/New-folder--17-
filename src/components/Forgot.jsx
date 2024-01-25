import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./apiconfig";
const Forgot = () => {
  const [email, setEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/Account/ForgotPassword`, {
        email: email,
      });
      if (response.data.success) {
        setResetMessage("Password reset email sent successfully.");
      } else {
        setResetMessage(response.data);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setResetMessage("An error occurred while resetting the password.");
    }
  };
  return (
    <div class="login_pages_bady">
      <div class="login_pages_left ">
        <div class="left-inner">
          <div class="sign-in-form active">
          <h1>Forgot Password?</h1>
          <form>
          <div className="form-group1">
            <label className="label_1_1" htmlFor="email1">
              E-mail
            </label>
            <input
              id="email1"
              
              className="form_in_bg" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}

              placeholder="Enter your email"
            />
          </div>              
          <p id="resetMessage">{resetMessage}</p>
          <button
            type="button"
            className="btn_login_pages"
            onClick={handleResetPassword}
          >
            RESET PASSWORD
          </button>

          <div className="create-aacount">
            <Link to="/" className="text-underline sign-up-form-btn">
              Go Back
            </Link>
          </div>
        </form>
          </div>

          <div class="forgot-pass-form ">
            <h1>Forgot Password?</h1>

            <form action="">
              <div class="form-group1">
                <label className="label_1_1" for="">
                  E-mail
                </label>
                <input
                  type="email1"
                  class="form_in_bg"
                  placeholder="@mail.com"
                />
              </div>
              <div class="form-group1">
                <button className="btn_login_pages">RESET PASSWORD</button>
              </div>
              <div class="create-aacount">
                <a href="javascript:;" class="go-to-sign-in">
                  Go Back
                </a>
              </div>
            </form>
          </div>
        </div>

        <div class="sign-up-form">
          <h1>Sign up to Your Brand</h1>

          <div class="social-buttons">
            <a href="javascript:;" title="Sign up via Google">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z"
                  fill="#FF3D00"
                />
                <path
                  d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39904 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11354 22 12 22Z"
                  fill="#4CAF50"
                />
                <path
                  d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                  fill="#1976D2"
                />
              </svg>
            </a>

            <a href="javascript:;" title="Sign up via Facebook">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M13.397 20.997V12.801H16.162L16.573 9.59199H13.397V7.54799C13.397 6.62199 13.655 5.98799 14.984 5.98799H16.668V3.12699C15.8487 3.03918 15.0251 2.99678 14.201 2.99999C11.757 2.99999 10.079 4.49199 10.079 7.23099V9.58599H7.33203V12.795H10.085V20.997H13.397Z"
                  fill="#3C5895"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="login_pages_right">
        <div class="right-inner"></div>
      </div>
    </div>
  );
};

export default Forgot;

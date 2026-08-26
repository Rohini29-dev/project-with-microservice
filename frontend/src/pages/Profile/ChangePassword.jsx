import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { changePassword } from "../../services/auth.service";
import "./ChangePassword.css";

function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  // ================= TOGGLE PASSWORD =================

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };


  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");


    // Current password
    if (!formData.currentPassword) {
      setError("Please enter your current password.");
      return;
    }


    // New password
    if (!formData.newPassword) {
      setError("Please enter a new password.");
      return;
    }


    // Password length
    if (formData.newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }


    // Confirm password
    if (!formData.confirmPassword) {
      setError("Please confirm your new password.");
      return;
    }


    // Password match
    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }


    // Same password
    if (
      formData.currentPassword ===
      formData.newPassword
    ) {
      setError(
        "New password must be different from current password."
      );
      return;
    }


    try {
      setLoading(true);


      const response = await changePassword({
        currentPassword:
          formData.currentPassword,

        newPassword:
          formData.newPassword,
      });


      setSuccess(
        response.message ||
          "Password changed successfully."
      );


      // Clear form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });


      // Redirect after success
      setTimeout(() => {
        navigate("/profile");
      }, 1500);


    } catch (error) {
      console.log(
        "Change password error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to change password."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="change-password-page">

      <div className="change-password-container">


        {/* ================= HEADER ================= */}

        <div className="change-password-header">

          <Link
            to="/profile"
            className="change-password-back"
          >
            ← Back to Profile
          </Link>

          <h1>
            Change Password
          </h1>

          <p>
            Keep your account secure by using a strong password.
          </p>

        </div>


        {/* ================= CARD ================= */}

        <div className="change-password-card">

          <div className="password-card-icon">
            🔒
          </div>

          <h2>
            Update your password
          </h2>

          <p className="password-card-description">
            Enter your current password and choose a new
            password for your account.
          </p>


          {/* ================= MESSAGES ================= */}

          {error && (
            <div className="password-message password-error">
              {error}
            </div>
          )}

          {success && (
            <div className="password-message password-success">
              {success}
            </div>
          )}


          {/* ================= FORM ================= */}

          <form onSubmit={handleSubmit}>


            {/* CURRENT PASSWORD */}

            <div className="password-form-group">

              <label htmlFor="currentPassword">
                Current Password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="currentPassword"
                  type={
                    showPassword.current
                      ? "text"
                      : "password"
                  }
                  name="currentPassword"
                  value={
                    formData.currentPassword
                  }
                  onChange={handleChange}
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    togglePassword("current")
                  }
                >
                  {showPassword.current
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>


            {/* NEW PASSWORD */}

            <div className="password-form-group">

              <label htmlFor="newPassword">
                New Password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="newPassword"
                  type={
                    showPassword.new
                      ? "text"
                      : "password"
                  }
                  name="newPassword"
                  value={
                    formData.newPassword
                  }
                  onChange={handleChange}
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    togglePassword("new")
                  }
                >
                  {showPassword.new
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

              <span className="password-hint">
                Password must be at least 6 characters.
              </span>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="password-form-group">

              <label htmlFor="confirmPassword">
                Confirm New Password
              </label>

              <div className="password-input-wrapper">

                <input
                  id="confirmPassword"
                  type={
                    showPassword.confirm
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    togglePassword("confirm")
                  }
                >
                  {showPassword.confirm
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>


            {/* ================= ACTIONS ================= */}

            <div className="change-password-actions">

              <Link
                to="/profile"
                className="cancel-password-btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="save-password-btn"
                disabled={loading}
              >
                {loading
                  ? "Updating..."
                  : "Change Password"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ChangePassword;
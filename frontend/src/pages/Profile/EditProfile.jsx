import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  updateCurrentUser,
} from "../../services/auth.service";
import "./EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ================= FETCH USER =================

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const response = await getCurrentUser();

        const user = response.user;

        setFormData({
          username: user.username || "",
          email: user.email || "",
          firstName:
            user.fullName?.firstName || "",
          lastName:
            user.fullName?.lastName || "",
        });

      } catch (error) {

        console.log(
          "Fetch user error:",
          error
        );

        setError(
          "Unable to load your profile."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchUser();

  }, []);


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


  // ================= SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    if (!formData.username.trim()) {

      setError(
        "Username is required."
      );

      return;
    }


    if (!formData.email.trim()) {

      setError(
        "Email is required."
      );

      return;
    }


    try {

      setSaving(true);


      const payload = {

        username:
          formData.username.trim(),

        email:
          formData.email.trim(),

        fullName: {

          firstName:
            formData.firstName.trim(),

          lastName:
            formData.lastName.trim(),

        },

      };


      const response =
        await updateCurrentUser(payload);


      setSuccess(
        response.message ||
          "Profile updated successfully."
      );


      setTimeout(() => {

        navigate("/profile");

      }, 1000);

    } catch (error) {

      console.log(
        "Update profile error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update profile."
      );

    } finally {

      setSaving(false);

    }

  };


  // ================= LOADING =================

  if (loading) {

    return (
      <div className="edit-profile-loading">

        <div className="edit-profile-spinner"></div>

        <p>
          Loading profile...
        </p>

      </div>
    );

  }


  return (
    <div className="edit-profile-page">

      <div className="edit-profile-container">


        {/* HEADER */}

        <div className="edit-profile-top">

          <Link
            to="/profile"
            className="edit-back-btn"
          >
            ← Back to Profile
          </Link>

          <h1>
            Edit Profile
          </h1>

          <p>
            Update your personal information
          </p>

        </div>


        {/* FORM */}

        <div className="edit-profile-card">


          {/* ERROR */}

          {error && (
            <div className="edit-message error-message">
              {error}
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="edit-message success-message">
              {success}
            </div>
          )}


          <form onSubmit={handleSubmit}>


            {/* USERNAME */}

            <div className="edit-form-group">

              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
              />

            </div>


            {/* EMAIL */}

            <div className="edit-form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />

            </div>


            {/* FIRST NAME */}

            <div className="edit-form-group">

              <label htmlFor="firstName">
                First Name
              </label>

              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />

            </div>


            {/* LAST NAME */}

            <div className="edit-form-group">

              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />

            </div>


            {/* BUTTONS */}

            <div className="edit-form-actions">

              <Link
                to="/profile"
                className="cancel-edit-btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="save-profile-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditProfile;

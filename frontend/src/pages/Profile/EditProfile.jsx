import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./EditProfile.css";

import { useDispatch, useSelector } from "react-redux";

import {
  asyncCurrentUser,
  asyncUpdateUser,
} from "../../store/actions/authActions";

function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ================= GET USER FROM REDUX =================

  const user = useSelector(
    (state) => state.authReducer.auth?.user
  );

  // ================= FORM STATE =================

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

  // ================= FETCH CURRENT USER =================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching current user...");

        await dispatch(asyncCurrentUser());
      } catch (error) {
        console.log("Fetch user error =>", error);

        setError("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    // Agar Redux me user already available hai
    // to API call ki zarurat nahi hai

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [dispatch, user]);

  // ================= SET USER DATA IN FORM =================

  useEffect(() => {
    if (user) {
      console.log("User from Redux =>", user);

      setFormData({
        username: user.username || "",
        email: user.email || "",
        firstName: user.fullName?.firstName || "",
        lastName: user.fullName?.lastName || "",
      });

      setLoading(false);
    }
  }, [user]);

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

    // ================= VALIDATION =================

    if (!formData.username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!formData.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    try {
      setSaving(true);

      // ================= UPDATE PAYLOAD =================

      const payload = {
        username: formData.username.trim(),

        email: formData.email.trim(),

        fullName: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        },
      };

      console.log("UPDATE PAYLOAD =>", payload);

      // ================= UPDATE USER USING REDUX =================

      const response = await dispatch(
        asyncUpdateUser(payload)
      );

      console.log("UPDATE RESPONSE =>", response);

      // ================= CHECK ERROR =================

      if (response?.error) {
        throw new Error(
          response?.error?.message ||
            "Unable to update profile."
        );
      }

      // ================= SUCCESS =================

      setSuccess(
        response?.message ||
          response?.payload?.message ||
          "Profile updated successfully."
      );

      /*
        IMPORTANT:

        Yahan asyncCurrentUser() call MAT karna.

        Kyunki asyncUpdateUser ke andar updated user
        Redux me already save ho raha hai.

        Agar yahan asyncCurrentUser() call kiya,
        to old JWT user Redux ko overwrite kar sakta hai.
      */

      // ================= NAVIGATE =================

      setTimeout(() => {
        navigate("/profile");
      }, 800);

    } catch (error) {
      console.log("UPDATE PROFILE ERROR =>", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
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

        <p>Loading profile...</p>
      </div>
    );
  }

  // ================= USER NOT FOUND =================

  if (!user) {
    return (
      <div className="edit-profile-loading">
        <h2>Please login to edit your profile</h2>

        <Link to="/login">
          Go to Login
        </Link>
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="edit-profile-page">

      <div className="edit-profile-container">

        {/* ================= HEADER ================= */}

        <div className="edit-profile-top">

          <Link
            to="/profile"
            className="edit-back-btn"
          >
            ← Back to Profile
          </Link>

          <h1>Edit Profile</h1>

          <p>
            Update your personal information
          </p>

        </div>

        {/* ================= FORM CARD ================= */}

        <div className="edit-profile-card">

          {/* ================= ERROR ================= */}

          {error && (
            <div className="edit-message error-message">
              {error}
            </div>
          )}

          {/* ================= SUCCESS ================= */}

          {success && (
            <div className="edit-message success-message">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ================= USERNAME ================= */}

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

            {/* ================= EMAIL ================= */}

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

            {/* ================= FIRST NAME ================= */}

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

            {/* ================= LAST NAME ================= */}

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

            {/* ================= BUTTONS ================= */}

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
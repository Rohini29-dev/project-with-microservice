import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import {  asyncCurrentUser } from "../../store/actions/authActions";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector((state) => state.authReducer.auth?.user);

  // console.log('aAuth reduser',user);
  

  

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUser = async () => {
    try {
      if (!user) {
        await dispatch(asyncCurrentUser());
      }
    } catch (error) {
      console.log("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [dispatch, user]);


  // Loading
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>

        <p>
          Loading profile...
        </p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="profile-error">

        <h2>
          Please login to view your profile
        </h2>

        <Link
          to="/login"
          className="profile-login-btn"
        >
          Go to Login
        </Link>

      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* ================= PROFILE HEADER ================= */}

        <div className="profile-header">

          <div className="profile-avatar">
            {user.username
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-header-info">

            <h1>
              {user.username}
            </h1>

            <p>
              {user.email}
            </p>

            <span className="profile-role">
              {user.role}
            </span>

          </div>

        </div>


        {/* ================= PERSONAL INFORMATION ================= */}

        <div className="profile-card">

          <div className="card-header">

            <div>
              <h2>
                Personal Information
              </h2>

              <p>
                Your account information
              </p>
            </div>

            <button
              className="edit-btn"
              onClick={() =>
                navigate("/profile/edit")
              }
            >
              Edit Profile
            </button>

          </div>


          <div className="profile-info-grid">

            <div className="info-item">

              <span className="info-label">
                Username
              </span>

              <span className="info-value">
                {user.username}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                Email
              </span>

              <span className="info-value">
                {user.email}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                Account Type
              </span>

              <span className="info-value">
                {user.role}
              </span>

            </div>


            <div className="info-item">

              <span className="info-label">
                Account Status
              </span>

              <span className="status-active">
                Active
              </span>

            </div>

          </div>

        </div>


        {/* ================= ACCOUNT SETTINGS ================= */}

        <div className="profile-card">

          <div className="card-header">

            <div>
              <h2>
                Account Settings
              </h2>

              <p>
                Manage your account
              </p>
            </div>

          </div>


          <div className="settings-list">

            {/* USER ORDERS */}

            {user.role === "user" && (
              <Link
                to="/orders"
                className="setting-item"
              >

                <div className="setting-icon">
                  📦
                </div>

                <div className="setting-content">

                  <h3>
                    My Orders
                  </h3>

                  <p>
                    View and manage your orders
                  </p>

                </div>

                <span className="setting-arrow">
                  →
                </span>

              </Link>
            )}


            {/* SELLER DASHBOARD */}

            {user.role === "seller" && (
              <Link
                to="/seller/dashboard"
                className="setting-item"
              >

                <div className="setting-icon">
                  📊
                </div>

                <div className="setting-content">

                  <h3>
                    Seller Dashboard
                  </h3>

                  <p>
                    Manage your seller account
                  </p>

                </div>

                <span className="setting-arrow">
                  →
                </span>

              </Link>
            )}


            {/* CHANGE PASSWORD */}

            <Link
  to="/profile/change-password"
  className="setting-item"
>
  <div className="setting-icon">
    🔒
  </div>

  <div className="setting-content">
    <h3>
      Change Password
    </h3>

    <p>
      Update your account password
    </p>
  </div>

  <span className="setting-arrow">
    →
  </span>
</Link>


            {/* ADDRESS */}

            <Link
              to="/profile/addresses"
              className="setting-item"
            >

              <div className="setting-icon">
                📍
              </div>

              <div className="setting-content">

                <h3>
                  My Address
                </h3>

                <p>
                  Manage your delivery addresses
                </p>

              </div>

              <span className="setting-arrow">
                →
              </span>

            </Link>

          </div>

        </div>


        {/* ================= BACK HOME ================= */}

        <Link
          to="/"
          className="back-home-btn"
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default Profile;
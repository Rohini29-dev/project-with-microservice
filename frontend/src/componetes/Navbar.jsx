import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

import { useDispatch, useSelector } from "react-redux";

import {
  asyncauthLogout,
  asyncCurrentUser,
} from "../store/actions/authActions";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ================= USER FROM REDUX =================

  const user = useSelector(
    (state) => state.authReducer.auth?.user
  );

  // ================= CART FROM REDUX =================

  const cartData = useSelector(
    (state) => state.cartReducer.carts
  );

  // ================= LOCAL STATES =================

  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // =====================================================
  // CART COUNT
  // =====================================================


  const cartCount =
    cartData?.totalQuantity ??
    cartData?.cart?.totalQuantity ??
    0;

  // ================= FETCH CURRENT USER =================

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        await dispatch(asyncCurrentUser());
      } catch (error) {
        console.log("Current user error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  // ================= LOGOUT =================

  const handleLogout = async () => {
    try {
      await dispatch(asyncauthLogout());

      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  // ================= CLOSE MENUS =================

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* ================= LOGO ================= */}

        <Link
          to="/"
          className="logo"
          onClick={closeMenus}
        >
          PWS<span>.</span>
        </Link>

        {/* ================= NAVIGATION ================= */}

        <nav
          className={`nav-menu ${
            menuOpen ? "nav-open" : ""
          }`}
        >

          {/* ================= HOME ================= */}

          <Link
            to="/"
            onClick={closeMenus}
          >
            Home
          </Link>

          {/* ================= AI BUDDY ================= */}

          {user && (
            <Link
              to="/ai-buddy"
              onClick={closeMenus}
            >
              ✨ AI Buddy
            </Link>
          )}

          {/* ================= USER ================= */}

          {user?.role === "user" && (
            <Link
              to="/orders"
              onClick={closeMenus}
            >
              Orders
            </Link>
          )}

          {/* ================= SELLER ================= */}

          {user?.role === "seller" && (
            <>
              <Link
                to="/products/create"
                onClick={closeMenus}
              >
                Create Product
              </Link>

              <Link
                to="/seller/products"
                onClick={closeMenus}
              >
                My Products
              </Link>

              <Link
                to="/seller/dashboard"
                onClick={closeMenus}
              >
                Seller Dashboard
              </Link>

              <Link
                to="/seller/orders"
                onClick={closeMenus}
              >
                Seller Orders
              </Link>
            </>
          )}
        </nav>

        {/* ================= RIGHT SIDE ================= */}

        <div className="navbar-right">

          {/* =================================================
              CART
          ================================================= */}

          {user?.role === "user" && (
            <Link
              to="/cart"
              className="cart-btn"
              onClick={closeMenus}
            >

              {/* CART ICON */}

              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />

                <circle
                  cx="10"
                  cy="20"
                  r="1"
                />

                <circle
                  cx="18"
                  cy="20"
                  r="1"
                />
              </svg>

              {/* CART COUNT */}

              <span className="cart-count">
                {cartCount}
              </span>
            </Link>
          )}

          {/* =================================================
              LOGGED OUT
          ================================================= */}

          {!loading && !user && (
            <div className="auth-buttons">

              <Link
                to="/login"
                className="login-btn"
                onClick={closeMenus}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-btn"
                onClick={closeMenus}
              >
                Register
              </Link>

            </div>
          )}

          {/* =================================================
              LOGGED IN
          ================================================= */}

          {!loading && user && (
            <div className="profile-menu-wrapper">

              {/* PROFILE BUTTON */}

              <button
                className="profile-menu-btn"
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
              >

                <div className="user-avatar">
                  {user.username
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <span className="user-name">
                  {user.username}
                </span>

                <span
                  className={`profile-chevron ${
                    profileOpen
                      ? "chevron-open"
                      : ""
                  }`}
                >
                  ▼
                </span>

              </button>

              {/* =================================================
                  PROFILE DROPDOWN
              ================================================= */}

              {profileOpen && (
                <div className="profile-dropdown">

                  {/* ================= PROFILE ================= */}

                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={closeMenus}
                  >

                    <span className="dropdown-icon">
                      👤
                    </span>

                    <span>
                      <strong>
                        Profile
                      </strong>

                      <small>
                        View your profile
                      </small>
                    </span>

                  </Link>

                  {/* ================= USER ORDERS ================= */}

                  {user.role === "user" && (
                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={closeMenus}
                    >

                      <span className="dropdown-icon">
                        📦
                      </span>

                      <span>
                        <strong>
                          My Orders
                        </strong>

                        <small>
                          View your orders
                        </small>
                      </span>

                    </Link>
                  )}

                  {/* ================= SELLER PRODUCTS ================= */}

                  {user.role === "seller" && (
                    <Link
                      to="/seller/products"
                      className="dropdown-item"
                      onClick={closeMenus}
                    >

                      <span className="dropdown-icon">
                        🛍️
                      </span>

                      <span>
                        <strong>
                          My Products
                        </strong>

                        <small>
                          Manage your products
                        </small>
                      </span>

                    </Link>
                  )}

                  {/* ================= SELLER DASHBOARD ================= */}

                  {user.role === "seller" && (
                    <Link
                      to="/seller/dashboard"
                      className="dropdown-item"
                      onClick={closeMenus}
                    >

                      <span className="dropdown-icon">
                        📊
                      </span>

                      <span>
                        <strong>
                          Dashboard
                        </strong>

                        <small>
                          Manage your store
                        </small>
                      </span>

                    </Link>
                  )}

                  {/* ================= DIVIDER ================= */}

                  <div className="dropdown-divider"></div>

                  {/* ================= LOGOUT ================= */}

                  <button
                    className="dropdown-logout"
                    onClick={handleLogout}
                  >

                    <span className="dropdown-icon">
                      🚪
                    </span>

                    <span>
                      Logout
                    </span>

                  </button>

                </div>
              )}

            </div>
          )}

          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <button
            className="menu-toggle"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
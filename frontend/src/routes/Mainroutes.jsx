import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// =========================================
// LAZY LOADED PAGES
// =========================================

const AIBuddy = lazy(() =>
  import("../pages/AIBuddy/AIBuddy")
);

const Home = lazy(() =>
  import("../pages/Home/Home")
);

const Register = lazy(() =>
  import("../pages/Register")
);

const Login = lazy(() =>
  import("../pages/Login")
);

const Profile = lazy(() =>
  import("../pages/Profile/Profile")
);

const EditProfile = lazy(() =>
  import("../pages/Profile/EditProfile")
);

const Addresses = lazy(() =>
  import("../pages/Profile/Addresses")
);

const ChangePassword = lazy(() =>
  import("../pages/Profile/ChangePassword")
);

const CreateProduct = lazy(() =>
  import("../pages/CreateProduct/CreateProduct")
);

const ProductDetails = lazy(() =>
  import("../pages/ProductDetails/ProductDetails")
);

const SellerProducts = lazy(() =>
  import("../pages/SellerProducts/SellerProducts")
);

const EditProduct = lazy(() =>
  import("../pages/EditProduct/EditProduct")
);

const Cart = lazy(() =>
  import("../pages/Cart/Cart")
);

const Checkout = lazy(() =>
  import("../pages/Checkout/Checkout")
);

const Orders = lazy(() =>
  import("../pages/Orders/Orders")
);

const OrderDetails = lazy(() =>
  import("../pages/OrderDetails/OrderDetails")
);

const SellerDashboard = lazy(() =>
  import("../pages/SellerDashboard/SellerDashboard")
);

const SellerOrders = lazy(() =>
  import("../pages/SellerOrders/SellerOrders")
);


// =========================================
// NORMAL IMPORTS
// =========================================

import ProtectedRoute from "../componetes/ProtectedRoute";


// =========================================
// LAZY LOADED SELLER ROUTE
// =========================================

const SellerRoute = lazy(() =>
  import("../componetes/SellerRoute")
);


// =========================================
// LOADING COMPONENT
// =========================================

const PageLoader = () => {

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "10px",
      }}
    >

      <div className="loading-spinner"></div>

      <h3>
        Loading page...
      </h3>

    </div>
  );
};


// =========================================
// MAIN ROUTES
// =========================================

const Mainroutes = () => {

  return (

    <Suspense fallback={<PageLoader />}>

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Product Details */}

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />


        {/* ================= PROTECTED ROUTES ================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/profile/addresses"
            element={<Addresses />}
          />

          <Route
            path="/profile/change-password"
            element={<ChangePassword />}
          />

          <Route
            path="/profile/edit"
            element={<EditProfile />}
          />

          {/* Cart */}

          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* Checkout */}

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          {/* Orders */}

          <Route
            path="/orders"
            element={<Orders />}
          />

          {/* Order Details */}

          <Route
            path="/orders/:id"
            element={<OrderDetails />}
          />

          {/* AI Buddy */}

          <Route
            path="/ai-buddy"
            element={<AIBuddy />}
          />

        </Route>


        {/* ================= SELLER ROUTES ================= */}

        <Route element={<SellerRoute />}>

          {/* Create Product */}

          <Route
            path="/products/create"
            element={<CreateProduct />}
          />

          {/* Edit Product */}

          <Route
            path="/products/:id/edit"
            element={<EditProduct />}
          />

          {/* Seller Dashboard */}

          <Route
            path="/seller/dashboard"
            element={<SellerDashboard />}
          />

          {/* Seller Orders */}

          <Route
            path="/seller/orders"
            element={<SellerOrders />}
          />

          {/* Seller Products */}

          <Route
            path="/seller/products"
            element={<SellerProducts />}
          />

        </Route>

      </Routes>

    </Suspense>

  );
};


export default Mainroutes;
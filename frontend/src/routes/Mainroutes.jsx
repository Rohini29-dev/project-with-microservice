import React from "react";
import { Routes, Route } from "react-router-dom";

import AIBuddy from "../pages/AIBuddy/AIBuddy";

import Home from "../pages/Home/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";
import Addresses from "../pages/Profile/Addresses";
import ChangePassword from "../pages/Profile/ChangePassword";

import CreateProduct from "../pages/CreateProduct/CreateProduct";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
// import Products from "../pages/Products/Products";

import SellerProducts from "../pages/SellerProducts/SellerProducts";
import EditProduct from "../pages/EditProduct/EditProduct";

import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";

import Orders from "../pages/Orders/Orders";
import OrderDetails from "../pages/OrderDetails/OrderDetails";

import SellerDashboard from "../pages/SellerDashboard/SellerDashboard";
import SellerOrders from "../pages/SellerOrders/SellerOrders";

import ProtectedRoute from "../componetes/ProtectedRoute";
import SellerRoute from "../componetes/SellerRoute";


const Mainroutes = () => {

  return (

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

      {/* Product details */}
      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />


      {/* ================= PROTECTED ROUTES ================= */}

      <Route element={<ProtectedRoute />}>

      <Route path="/profile" element={<Profile />} />
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

        {/* Seller Products */}
       

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
  );
};

export default Mainroutes;
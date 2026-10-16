import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from './store/store'
import { Provider } from 'react-redux'

import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>

      <ToastContainer/>
    </BrowserRouter>
);
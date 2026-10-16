import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Mainroutes from "./routes/Mainroutes";
import Navbar from "./componetes/Navbar";

import { asyncCurrentUser } from "./store/actions/authActions";

function App() {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.authReducer.auth
  );

  // =========================================
  // CURRENT USER
  // =========================================

  useEffect(() => {
    if (!user) {
      dispatch(asyncCurrentUser());
    }
  }, [dispatch, user]);

  // =========================================
  // APP UI
  // =========================================

  return (
    <>
      <Navbar />

      <Mainroutes />

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}

export default App;
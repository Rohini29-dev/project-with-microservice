import { ToastContainer } from "react-toastify";
import Mainroutes from "./routes/Mainroutes";

import Navbar from "./componetes/Navbar";



function App() {
  return (
    <>
      <Navbar />
      <Mainroutes/>
   
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
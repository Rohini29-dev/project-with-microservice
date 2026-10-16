import { createPayment, verifyPayment } from "../../services/payment.service";
import { loadpayment } from "../reducers/paymentSlice";

export const asynccreatePayment =
  (id) => async (dispatch) => {
    try {
      const res = await createPayment(id);


      if (res.data?.payment) {
        dispatch(loadpayment(res.data.payment));
      }

      return res;
    } catch (error) {
      console.log("CREATE PAYMENT ERROR =>", error);
      throw error;
    }
  };
export const asyncvarifyPayment =
  (payload) => async (dispatch) => {
    try {
      const res = await verifyPayment(payload);

     
      dispatch(loadpayment(res?.data?.payment));

      
      return res;
    } catch (error) {
      console.log("❌ VERIFY PAYMENT ERROR =>", error);
      console.log("❌ ERROR RESPONSE =>", error?.response?.data);
      throw error;
    }
  };
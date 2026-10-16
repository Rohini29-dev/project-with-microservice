import loadRazorpay from "../../utils/loadRazorpay";
import "./Checkout.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { asynccreatePayment, asyncvarifyPayment } from "../../store/actions/paymentAction";
import { asyncloadCart } from "../../store/actions/cartAction";
import { asyncCreateOrder } from "../../store/actions/orderAction";



function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const cartRes = await dispatch(asyncloadCart());

      const items = cartRes.data.cart.items;

      const finalItems = [];
      let subtotal = 0;

      for (const item of items) {
        const productRes = await axios.get(
          `http://localhost:3001/api/products/${item.productId}`,
          {
            withCredentials: true,
          }
        );

        const product = productRes.data.data;

        subtotal +=
          product.price.amount * item.quantity;

        finalItems.push({
          quantity: item.quantity,
          product,
        });
      }

      setCartItems(finalItems);
      setTotal(subtotal);

    } catch (error) {
      console.log("FETCH CART ERROR 👉", error);
    } finally {
      setLoading(false);
    }
  }

 async function onSubmit(data) {
  try {
    // 1. Create Order
    const orderResponse = await dispatch(asyncCreateOrder(data));

    console.log("ORDER RESPONSE 👉", orderResponse.data);

    const order = orderResponse.data.order;

    if (!order?._id) {
      throw new Error("Order ID not received");
    }

    // 2. Load Razorpay
    const isRazorpayLoaded = await loadRazorpay();

    if (!isRazorpayLoaded) {
      alert("Razorpay failed to load");
      return;
    }

    // 3. Create Payment
    const paymentResponse = await dispatch(asynccreatePayment(order._id));

    console.log(
      "PAYMENT RESPONSE 👉",
      paymentResponse.data
    );

    const razorpayData = paymentResponse.data.razorpay;

    // 4. Open Razorpay Checkout
    const options = {
      key: razorpayData.key,

      amount: razorpayData.amount,

      currency: razorpayData.currency,

      name: "PWS",

      description: "Purchase Payment",

      order_id: razorpayData.orderId,

      handler: async function (response) {
        try {
          console.log(
            "RAZORPAY RESPONSE 👉",
            response
          );

          // 5. Verify Payment
          const verifyResponse = await dispatch(asyncvarifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }));

          console.log(
            "VERIFY RESPONSE 👉",
            verifyResponse.data
          );

          alert("Payment successful!");

          navigate("/orders");

        } catch (error) {
          console.log(
            "PAYMENT VERIFY ERROR 👉",
            error
          );

          alert(
            error.response?.data?.message ||
              "Payment verification failed"
          );
        }
      },

      prefill: {
        name: data.fullName,
      },

      theme: {
        color: "#2563eb",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

  } catch (error) {
  console.log("PLACE ORDER ERROR 👉", error);

  console.log(
    "BACKEND RESPONSE 👉",
    error.response?.data
  );

  console.log(
    "VALIDATION ERRORS 👉",
    error.response?.data?.errors
  );

  alert(
    error.response?.data?.errors?.[0]?.msg ||
    error.response?.data?.message ||
    "Unable to place order."
  );
}
}

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
  <section className="checkout-page">
    <div className="checkout-container">

      {/* LEFT - CHECKOUT FORM */}
      <div className="checkout-left">

        <div className="checkout-heading">
          <h1>Checkout</h1>
          <p>Complete your shipping details to place your order.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="form-section">
            <h2>Shipping Information</h2>

            {/* FULL NAME + PHONE */}
            <div className="form-row">

              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register("fullName", {
                    required: "Full Name is required",
                  })}
                />

                {errors.fullName && (
                  <p className="error">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Phone Number</label>

                <input
                  type="text"
                  placeholder="Enter 10 digit phone number"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter valid phone number",
                    },
                  })}
                />

                {errors.phone && (
                  <p className="error">
                    {errors.phone.message}
                  </p>
                )}
              </div>

            </div>

            {/* STREET */}
            <div className="form-group">
              <label>Street Address</label>

              <textarea
                rows="4"
                placeholder="Enter your complete street address"
                {...register("street", {
                  required: "Street is required",
                })}
              />

              {errors.street && (
                <p className="error">
                  {errors.street.message}
                </p>
              )}
            </div>

            {/* COUNTRY + CITY */}
            <div className="form-row">

              <div className="form-group">
                <label>Country</label>

                <input
                  type="text"
                  placeholder="Country"
                  defaultValue="India"
                  {...register("country", {
                    required: "Country is required",
                  })}
                />

                {errors.country && (
                  <p className="error">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>City</label>

                <input
                  type="text"
                  placeholder="Enter city"
                  {...register("city", {
                    required: "City is required",
                  })}
                />

                {errors.city && (
                  <p className="error">
                    {errors.city.message}
                  </p>
                )}
              </div>

            </div>

            {/* STATE + PINCODE */}
            <div className="form-row">

              <div className="form-group">
                <label>State</label>

                <input
                  type="text"
                  placeholder="Enter state"
                  {...register("state", {
                    required: "State is required",
                  })}
                />

                {errors.state && (
                  <p className="error">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label>Pincode</label>

                <input
                  type="text"
                  placeholder="Enter 6 digit pincode"
                  {...register("pincode", {
                    required: "Pincode is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Enter valid pincode",
                    },
                  })}
                />

                {errors.pincode && (
                  <p className="error">
                    {errors.pincode.message}
                  </p>
                )}
              </div>

            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="place-order-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing Payment..."
              : "Place Order & Pay"}
          </button>

        </form>

      </div>


      {/* RIGHT - ORDER SUMMARY */}
      <div className="checkout-right">

        <div className="summary-card">

          <div className="summary-heading">
            <h2>Order Summary</h2>
            <span>{cartItems.length} items</span>
          </div>

          <div className="summary-products">

            {cartItems.map((item) => (
              <div
                className="summary-product"
                key={item.product._id}
              >

                <div className="product-info">

                  <p className="product-title">
                    {item.product.title}
                  </p>

                  <span>
                    Qty: {item.quantity}
                  </span>

                </div>

                <strong>
                  ₹
                  {item.product.price.amount *
                    item.quantity}
                </strong>

              </div>
            ))}

          </div>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>

            <span className="free">
              FREE
            </span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="secure-payment">
            <span>🔒</span>
            <p>Secure payment powered by Razorpay</p>
          </div>

        </div>

      </div>

    </div>
  </section>
);
}

export default Checkout;
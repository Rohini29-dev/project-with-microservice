import "./OrderDetails.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { asyncgetorderById } from "../../store/actions/orderAction";



function OrderDetails() {
const dispatch = useDispatch();

  const [order, setOrder] = useState(null);


  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  async function fetchOrder() {
    try {
      setLoading(true);

     const response = await dispatch(asyncgetorderById(id));


setOrder(response.order);
    } catch (error) {
      console.log("GET ORDER DETAILS ERROR 👉", error);
    } finally {
      setLoading(false);
    }
  }

  function getPaymentStatus(status) {
    if (status === "CANCELLED") {
      return "CANCELLED";
    }

    if (status === "CONFIRMED") {
      return "PAID";
    }

    return "PENDING";
  }

  function getStatusClass(status) {
    return status?.toLowerCase() || "pending";
  }

  if (loading) {
    return (
      <section className="order-details-page">
        <div className="details-loading">

          <div className="loading-spinner"></div>

          <h2>Loading Order...</h2>

          <p>
            Please wait while we fetch your order details.
          </p>

        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="order-details-page">

        <div className="order-not-found">

          <div className="not-found-icon">
            📦
          </div>

          <h2>Order Not Found</h2>

          <p>
            We couldn't find the order you're looking for.
          </p>

          <button
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </button>

        </div>

      </section>
    );
  }

  const paymentStatus = getPaymentStatus(
    order.status
  );

  return (
    <section className="order-details-page">

      <div className="order-details-container">

        {/* Back */}
        <button
          className="back-btn"
          onClick={() => navigate("/orders")}
        >
          ← Back to Orders
        </button>

        {/* Header */}
        <div className="order-header">

          <div>

            <p className="details-label">
              ORDER DETAILS
            </p>

            <h1>
              Order #{order._id.slice(-8)}
            </h1>

            <div className="header-status">

              <span
                className={`status-badge ${getStatusClass(
                  order.status
                )}`}
              >
                <span className="status-dot"></span>
                {order.status}
              </span>

              <span className="header-separator">
                •
              </span>

              <span
                className={`payment-badge ${paymentStatus.toLowerCase()}`}
              >
                {paymentStatus === "PAID" && "✓ "}
                Payment {paymentStatus}
              </span>

            </div>

          </div>

          <div className="header-total">

            <span>Total Amount</span>

            <strong>
              ₹{order.price?.amount || 0}
            </strong>

          </div>

        </div>

        {/* Payment success message */}
        {paymentStatus === "PAID" && (
          <div className="payment-success-banner">

            <div className="success-icon">
              ✓
            </div>

            <div>
              <h3>Payment Successful</h3>

              <p>
                Your payment has been verified and
                your order has been confirmed.
              </p>
            </div>

          </div>
        )}

        {/* Main Grid */}
        <div className="details-grid">

          {/* LEFT */}
          <div className="details-left">

            {/* Products */}
            <div className="details-card">

              <div className="card-heading">

                <div>
                  <h3>Products</h3>

                  <p>
                    {order.items?.length || 0}{" "}
                    {order.items?.length === 1
                      ? "item"
                      : "items"}{" "}
                    in this order
                  </p>
                </div>

              </div>

              <div className="products-list">

                {order.items?.map(
                  (item, index) => (

                    <div
                      className="detail-product"
                      key={index}
                    >

                      <img
                        src={
                          item.product?.images?.[0]
                            ?.url ||
                          "https://placehold.co/100x100?text=Product"
                        }
                        alt={
                          item.product?.title ||
                          "Product"
                        }
                      />

                      <div className="product-info">

                        <h4>
                          {item.product?.title ||
                            "Product"}
                        </h4>

                        <p>
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        <span>
                          ₹
                          {item.product?.price
                            ?.amount ||
                            order.price?.amount ||
                            0}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* Shipping */}
            <div className="details-card">

              <div className="card-heading">

                <div>
                  <h3>Shipping Address</h3>

                  <p>
                    Your delivery information
                  </p>
                </div>

                <span className="address-icon">
                  📍
                </span>

              </div>

              <div className="address-content">

                <h4>
                  {order.shippingAddress?.fullName}
                </h4>

                <p>
                  {order.shippingAddress?.street}
                </p>

                <p>
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state}
                </p>

                <p>
                  {order.shippingAddress?.pincode}
                </p>

                <p>
                  {order.shippingAddress?.country}
                </p>

                {order.shippingAddress?.phone && (
                  <p className="phone">
                    📞{" "}
                    {order.shippingAddress.phone}
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="details-right">

            {/* Payment */}
            <div className="details-card payment-card">

              <h3>Payment Summary</h3>

              <div className="payment-method">

                <div className="payment-method-icon">
                  ✓
                </div>

                <div>
                  <span>Payment Method</span>

                  <strong>
                    Razorpay
                  </strong>
                </div>

                <span
                  className={`payment-badge ${paymentStatus.toLowerCase()}`}
                >
                  {paymentStatus}
                </span>

              </div>

              <div className="summary-row">

                <span>Subtotal</span>

                <span>
                  ₹{order.price?.amount || 0}
                </span>

              </div>

              <div className="summary-row">

                <span>Delivery</span>

                <span className="free">
                  FREE
                </span>

              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total-row">

                <span>Total</span>

                <strong>
                  ₹{order.price?.amount || 0}
                </strong>

              </div>

            </div>

            {/* Order status */}
            <div className="details-card status-card">

              <h3>Order Status</h3>

              <div className="timeline">

                <div className="timeline-item active">

                  <div className="timeline-icon">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Order Placed
                    </strong>

                    <span>
                      Your order has been created
                    </span>
                  </div>

                </div>

                <div
                  className={`timeline-item ${
                    order.status !== "PENDING" &&
                    order.status !== "CANCELLED"
                      ? "active"
                      : ""
                  }`}
                >

                  <div className="timeline-icon">
                    {order.status ===
                    "CANCELLED"
                      ? "!"
                      : "✓"}
                  </div>

                  <div>
                    <strong>
                      {order.status ===
                      "CANCELLED"
                        ? "Order Cancelled"
                        : "Order Confirmed"}
                    </strong>

                    <span>
                      {order.status ===
                      "CANCELLED"
                        ? "This order has been cancelled"
                        : "Payment verified successfully"}
                    </span>
                  </div>

                </div>

              </div>

            </div>

            {/* Actions */}
            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/")}
            >
              Continue Shopping
              <span>→</span>
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default OrderDetails;
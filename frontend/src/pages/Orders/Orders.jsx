import "./Orders.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";

import {
  asyncCancelOrder,
  asyncGetOrder,
} from "../../store/actions/orderAction";

function Orders() {
  const dispatch = useDispatch();

  const orders = useSelector(
    (state) => state.orderReducer.orders || []
  );

  console.log("orderReducer-------->", orders);

  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  /* ================= GET ORDERS ================= */

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);

      await dispatch(asyncGetOrder());

    } catch (error) {
      console.log("GET ORDERS ERROR 👉", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to fetch orders."
      );

    } finally {
      setLoading(false);
    }
  }

  /* ================= CANCEL ORDER ================= */

  async function handleCancel(id) {
    const ok = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!ok) return;

    try {
      setCancellingId(id);

      const response = await dispatch(
        asyncCancelOrder(id)
      );

      console.log(
        "CANCEL ORDER RESPONSE =>",
        response
      );

      toast.success(
        response?.message ||
          "Order cancelled successfully!"
      );

      await fetchOrders();

    } catch (error) {
      console.log(
        "CANCEL ORDER ERROR 👉",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to cancel order."
      );

    } finally {
      setCancellingId(null);
    }
  }

  /* ================= STATUS CLASS ================= */

  function getStatusClass(status) {
    return status?.toLowerCase() || "pending";
  }

  /* ================= ORDER MESSAGE ================= */

  function getOrderMessage(status) {
    switch (status) {
      case "CONFIRMED":
        return "Order placed successfully";

      case "PENDING":
        return "Order is being processed";

      case "CANCELLED":
        return "Order has been cancelled";

      case "SHIPPED":
        return "Order has been shipped";

      case "DELIVERED":
        return "Order delivered successfully";

      default:
        return "Order placed";
    }
  }

  /* ================= PAYMENT STATUS ================= */

  function getPaymentStatus(status) {
    if (status === "CANCELLED") {
      return "CANCELLED";
    }

    if (status === "CONFIRMED") {
      return "PAID";
    }

    if (status === "SHIPPED") {
      return "PAID";
    }

    if (status === "DELIVERED") {
      return "PAID";
    }

    return "PENDING";
  }

  function getPaymentClass(status) {
    const paymentStatus =
      getPaymentStatus(status);

    return paymentStatus.toLowerCase();
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="orders-page">
        <div className="orders-loading">

          <div className="loading-spinner"></div>

          <h2>Loading Orders...</h2>

          <p>
            Please wait while we fetch your orders.
          </p>

        </div>
      </section>
    );
  }

  return (
    <section className="orders-page">

      <div className="orders-container">

        {/* ================= HEADER ================= */}

        <div className="orders-heading">

          <div>

            <p className="orders-subtitle">
              YOUR PURCHASES
            </p>

            <h1>My Orders</h1>

            <p className="orders-description">
              Track and manage all your orders in one place.
            </p>

          </div>

          {orders.length > 0 && (
            <div className="orders-count">

              <span>
                {orders.length}
              </span>

              <small>
                {orders.length === 1
                  ? "Order"
                  : "Orders"}
              </small>

            </div>
          )}

        </div>

        {/* ================= EMPTY ORDERS ================= */}

        {orders.length === 0 ? (

          <div className="empty-orders">

            <div className="empty-icon">
              🛍️
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
              Start shopping and your orders will
              appear here.
            </p>

            <Link
              to="/"
              className="shop-now-btn"
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          <div className="orders-list">

            {orders.map((order) => {
console.log("FULL ORDER 👉", order);
              const paymentStatus =
                getPaymentStatus(order.status);

              const statusClass =
                getStatusClass(order.status);

              return (
                <article
                  className="order-card"
                  key={order._id}
                >

                  {/* ================= CARD HEADER ================= */}

                  <div className="order-card-header">

                    <div className="order-info">

                      <p className="order-label">
                        ORDER ID
                      </p>

                      <h3>
                        #{order._id.slice(-8)}
                      </h3>

                      <p
                        className={`order-date ${statusClass}`}
                      >
                        {getOrderMessage(
                          order.status
                        )}
                      </p>

                    </div>

                    <div className="order-price">

                      <span>
                        Total Amount
                      </span>

                      <strong>
                        ₹{order.price?.amount || 0}
                      </strong>

                    </div>

                  </div>

                  {/* ================= STATUS ================= */}

                  <div className="order-status-section">

                    <div className="status-item">

                      <span className="status-label">
                        Order Status
                      </span>

                      <span
                        className={`status-badge ${statusClass}`}
                      >

                        <span className="status-dot"></span>

                        {order.status}

                      </span>

                    </div>

                    <div className="status-divider"></div>

                    <div className="status-item">

                      <span className="status-label">
                        Payment
                      </span>

                      <span
                        className={`payment-badge ${getPaymentClass(
                          order.status
                        )}`}
                      >

                        {paymentStatus === "PAID" &&
                          "✓ "}

                        {paymentStatus}

                      </span>

                    </div>

                  </div>

                  {/* ================= ORDER ITEMS ================= */}

                  <div className="order-items">

                    <h4>

                      {order.items?.length || 0}{" "}

                      {order.items?.length === 1
                        ? "Item"
                        : "Items"}

                    </h4>

                    <div className="items-preview">

                      {order.items
                        ?.slice(0, 3)
                        .map((item, index) => (

                          <div
                            className="item-preview"
                            key={index}
                          >

                            <img
                              src={
                                item.product?.images?.[0]
                                  ?.url ||
                                "https://placehold.co/70x70?text=Product"
                              }
                              alt={
                                item.product?.title ||
                                "Product"
                              }
                            />

                            <div>

                              <p>
                                {item.product?.title ||
                                  "Product"}
                              </p>

                              <span>
                                Qty: {item.quantity}
                              </span>

                            </div>

                          </div>

                        ))}

                    </div>

                    {order.items?.length > 3 && (

                      <p className="more-items">

                        +{order.items.length - 3} more
                        items

                      </p>

                    )}

                  </div>

                  {/* ================= SHIPPING ================= */}

                  <div className="shipping-section">

                    <div className="shipping-icon">
                      📍
                    </div>

                    <div>

                      <h4>
                        Shipping Address
                      </h4>

                      <p>
                        {order.shippingAddress?.street}
                      </p>

                      <p>
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}
                        {" - "}
                        {order.shippingAddress?.pincode}
                      </p>

                      <p>
                        {order.shippingAddress?.country}
                      </p>

                    </div>

                  </div>

                  {/* ================= ACTIONS ================= */}

                  <div className="order-actions">

                    <Link
                      to={`/orders/${order._id}`}
                      className="view-btn"
                    >

                      <span>
                        View Details
                      </span>

                      <span className="arrow">
                        →
                      </span>

                    </Link>

                    {order.status !== "CANCELLED" &&
                      order.status !== "DELIVERED" && (

                        <button
                          className="cancel-btn"
                          onClick={() =>
                            handleCancel(order._id)
                          }
                          disabled={
                            cancellingId === order._id
                          }
                        >

                          {cancellingId === order._id
                            ? "Cancelling..."
                            : "Cancel Order"}

                        </button>

                      )}

                  </div>

                </article>
              );
            })}

          </div>

        )}

      </div>

    </section>
  );
}

export default Orders;
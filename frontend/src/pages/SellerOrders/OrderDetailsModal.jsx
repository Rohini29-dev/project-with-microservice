import { useState } from "react";
import "./OrderDetailsModal.css";

import { updateOrderStatus } from "../../services/seller.service";
import { toast } from "react-toastify";

function OrderDetailsModal({
  order,
  onClose,
  onStatusUpdated,
}) {
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);

  async function handleUpdateStatus() {
    try {
      setLoading(true);

      await updateOrderStatus(order._id, status);

      onStatusUpdated(status);

      toast.success("Order status updated successfully.");
    } catch (error) {
      console.log(error);

      toast.error("Failed to update order status.");
    } finally {
      setLoading(false);
    }
  }

  if (!order) return null;

  return (
    <div className="modal-overlay">

      <div className="order-modal">

        {/* ================= HEADER ================= */}

        <div className="modal-header">

          <div>
            <span className="modal-eyebrow">
              ORDER
            </span>

            <h2>Order Details</h2>

            <p className="modal-order-id">
              #{order._id}
            </p>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>

        </div>


        {/* ================= BODY ================= */}

        <div className="modal-body">

          {/* ================= PRODUCTS ================= */}

          <section className="modal-section">

            <div className="section-heading">
              <div>
                <h3>Products</h3>
                <p>
                  Items included in this order
                </p>
              </div>

              <span className="item-count">
                {order.items.length}{" "}
                {order.items.length === 1
                  ? "Item"
                  : "Items"}
              </span>
            </div>


            <div className="products-list">

              {order.items.map((item) => (

                <div
                  className="product-item"
                  key={item.productId}
                >

                  {/* Product Image */}

                  <div className="product-image">

                    {item.product.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.title}
                      />
                    ) : (
                      <div className="image-placeholder">
                        🛍️
                      </div>
                    )}

                  </div>


                  {/* Product Details */}

                  <div className="product-info">

                    <h4>
                      {item.product.title}
                    </h4>

                    <p>
                      {item.product.description ||
                        "No description available."}
                    </p>

                    <div className="product-meta">

                      <span>
                        Qty:{" "}
                        <strong>
                          {item.quantity}
                        </strong>
                      </span>

                      <span>
                        ₹
                        {item.product.price.amount}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>


          {/* ================= SHIPPING ================= */}

          <section className="modal-section">

            <div className="section-heading">
              <div>
                <h3>Shipping Address</h3>
                <p>
                  Delivery information
                </p>
              </div>
            </div>


            <div className="address-box">

              <div className="address-icon">
                📍
              </div>

              <div className="address-details">

                <p>
                  {order.shippingAddress.street}
                </p>

                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}
                </p>

                <p>
                  {order.shippingAddress.country}
                </p>

                <span>
                  PIN:{" "}
                  {order.shippingAddress.pincode}
                </span>

              </div>

            </div>

          </section>


          {/* ================= STATUS ================= */}

          <section className="modal-section">

            <div className="section-heading">
              <div>
                <h3>Order Status</h3>
                <p>
                  Update the current order status
                </p>
              </div>

              <span
                className={`status ${status.toLowerCase()}`}
              >
                {status}
              </span>

            </div>


            <div className="status-update">

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                disabled={loading}
              >

                <option value="PENDING">
                  PENDING
                </option>

                <option value="CONFIRMED">
                  CONFIRMED
                </option>

                <option value="SHIPPED">
                  SHIPPED
                </option>

                <option value="DELIVERED">
                  DELIVERED
                </option>

                <option value="CANCELLED">
                  CANCELLED
                </option>

              </select>


              <button
                type="button"
                className="update-btn"
                onClick={handleUpdateStatus}
                disabled={loading}
              >
                {loading
                  ? "Updating..."
                  : "Update Status"}
              </button>

            </div>

          </section>


          {/* ================= SUMMARY ================= */}

          <section className="order-summary">

            <div className="summary-label">
              <span>Total Amount</span>

              <p>
                {order.items.length}{" "}
                {order.items.length === 1
                  ? "product"
                  : "products"}
              </p>
            </div>

            <strong>
              ₹{order.price.amount}
            </strong>

          </section>

        </div>

      </div>

    </div>
  );
}

export default OrderDetailsModal;
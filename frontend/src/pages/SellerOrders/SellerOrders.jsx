import { useEffect, useMemo, useState } from "react";
import "./SellerOrders.css";

import OrderDetailsModal from "../SellerOrders/OrderDetailsModal";

import { useDispatch } from "react-redux";

import {
  asyncGetOrder,
  asyncgetOrderById,
} from "../../store/actions/sellerAction";

function SellerOrders() {
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  // Fetch orders whenever page changes
  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  async function fetchOrders(page = 1) {
    try {
      setLoading(true);

      const response = await dispatch(asyncGetOrder(page));

      console.log("SELLER ORDERS RESPONSE =>", response);

      // IMPORTANT:
      // asyncGetOrder directly returns data
      setOrders(response.orders || []);

      setPagination(
        response.pagination || {
          page: 1,
          totalPages: 1,
        }
      );
    } catch (err) {
      console.log("FETCH SELLER ORDERS ERROR =>", err);

      setOrders([]);

      setPagination({
        page: 1,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  }

  // View single order
  async function handleViewOrder(id) {
    try {
      const response = await dispatch(asyncgetOrderById(id));

      console.log("SELLER ORDER DETAILS RESPONSE =>", response);

      // asyncgetOrderById directly returns data
      setSelectedOrder(response);
    } catch (err) {
      console.log("GET SELLER ORDER DETAILS ERROR =>", err);
    }
  }

  // Update order status inside list + modal
  function handleStatusUpdated(updatedStatus) {
    if (!selectedOrder) return;

    setSelectedOrder((prev) => ({
      ...prev,
      status: updatedStatus,
    }));

    setOrders((prev) =>
      prev.map((order) =>
        order._id === selectedOrder._id
          ? {
              ...order,
              status: updatedStatus,
            }
          : order
      )
    );
  }

  // Search orders
  const filteredOrders = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return orders;
    }

    return orders.filter((order) =>
      order._id?.toLowerCase().includes(searchValue)
    );
  }, [orders, search]);

  // Loading
  if (loading) {
    return (
      <section className="seller-orders-page">
        <div className="empty-orders">
          <h2>Loading Orders...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="seller-orders-page">

      {/* Header */}
      <div className="orders-header">
        <div>
          <h1>Seller Orders</h1>
          <p>Manage all customer orders.</p>
        </div>

        <input
          type="text"
          placeholder="Search Order ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <h2>No Orders Found</h2>
          <p>
            {search
              ? "No order matches your search."
              : "There are no orders available."}
          </p>
        </div>
      ) : (
        <div className="orders-grid">

          {filteredOrders.map((order) => (
            <div
              className="order-card"
              key={order._id}
            >

              {/* Top */}
              <div className="order-top">

                <div>
                  <h3>{order._id}</h3>

                  <span
                    className={`status ${
                      order.status?.toLowerCase() || ""
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <button
                  className="view-btn"
                  onClick={() => handleViewOrder(order._id)}
                >
                  View Details
                </button>

              </div>

              {/* Order Info */}
              <div className="order-info">

                <p>
                  <strong>Amount</strong>
                  <br />
                  ₹{order.price?.amount ?? 0}
                </p>

                <p>
                  <strong>Items</strong>
                  <br />
                  {order.items?.length ?? 0}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={
              currentPage === pagination.totalPages
            }
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
          >
            Next
          </button>

        </div>
      )}

    </section>
  );
}

export default SellerOrders;
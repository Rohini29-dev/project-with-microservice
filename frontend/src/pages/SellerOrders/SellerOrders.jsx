import { useEffect, useMemo, useState } from "react";
import "./SellerOrders.css";

import OrderDetailsModal from "../SellerOrders/OrderDetailsModal";

import {
  getOrders,
  getOrderById,
} from "../../services/seller.service";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

const [pagination, setPagination] = useState({
  page: 1,
  totalPages: 1,
});

 useEffect(() => {
  fetchOrders(currentPage);
}, [currentPage]);

  async function fetchOrders(page = 1) {
  try {
    const response = await getOrders(page);

    setOrders(response.data.orders);

    setPagination(response.data.pagination);

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
}

  async function handleViewOrder(id) {
    try {
      const response = await getOrderById(id);
      setSelectedOrder(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  function handleStatusUpdated(updatedStatus) {

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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order._id.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  if (loading) {
    return (
      <section className="seller-orders-page">
        <h2>Loading Orders...</h2>
      </section>
    );
  }

  return (
    <section className="seller-orders-page">

      <div className="orders-header">
        <div>
          <h1>Seller Orders</h1>
          <p>Manage all customer orders.</p>
        </div>

        <input
          type="text"
          placeholder="Search Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <h2>No Orders Found</h2>
        </div>
      ) : (
        <div className="orders-grid">

          {filteredOrders.map((order) => (

            <div
              className="order-card"
              key={order._id}
            >

              <div className="order-top">

                <div>

                  <h3>{order._id}</h3>

                  <span
                    className={`status ${order.status.toLowerCase()}`}
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

              <div className="order-info">

                <p>
                  <strong>Amount</strong>
                  <br />
                  ₹{order.price.amount}
                </p>

                <p>
                  <strong>Items</strong>
                  <br />
                  {order.items.length}
                </p>

              </div>

            </div>

          ))}

        </div>
      )}

      {selectedOrder && (
      <OrderDetailsModal
  order={selectedOrder}
  onClose={() => setSelectedOrder(null)}
  onStatusUpdated={handleStatusUpdated}
/>
      )}

  {pagination.totalPages > 1 && (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
    >
      Previous
    </button>

    <span>
      Page {pagination.page} of {pagination.totalPages}
    </span>

    <button
      disabled={currentPage === pagination.totalPages}
      onClick={() => setCurrentPage((prev) => prev + 1)}
    >
      Next
    </button>
  </div>
)}

    </section>
  );
}

export default SellerOrders;
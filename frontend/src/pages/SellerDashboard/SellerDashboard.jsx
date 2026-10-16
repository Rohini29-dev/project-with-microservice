import { useEffect, useState } from "react";
import "./SellerDashboard.css";
import { useDispatch } from "react-redux";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  asyncGetMetrics,
  asyncGetOrder,
  asyncGetProduct,
} from "../../store/actions/sellerAction";

function SellerDashboard() {
  const dispatch = useDispatch();

  // =========================
  // STATE
  // =========================

  const [metrics, setMetrics] = useState({
    revenue: 0,
    sales: 0,
    orders: 0,
    products: 0,
    topProducts: [],
  });

  const [orders, setOrders] = useState([]);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  // =========================
  // REVENUE DATA
  // =========================

  const revenueData = [
    {
      month: "Jan",
      revenue: 1200,
    },
    {
      month: "Feb",
      revenue: 1800,
    },
    {
      month: "Mar",
      revenue: 900,
    },
    {
      month: "Apr",
      revenue: 2200,
    },
    {
      month: "May",
      revenue: 1700,
    },
    {
      month: "Jun",
      revenue: metrics.revenue || 0,
    },
  ];

  // =========================
  // ORDER STATUS DATA
  // =========================

  const statusData = [
    {
      name: "Pending",
      value: orders.filter(
        (order) => order.status === "PENDING"
      ).length,
    },
    {
      name: "Confirmed",
      value: orders.filter(
        (order) => order.status === "CONFIRMED"
      ).length,
    },
    {
      name: "Shipped",
      value: orders.filter(
        (order) => order.status === "SHIPPED"
      ).length,
    },
    {
      name: "Delivered",
      value: orders.filter(
        (order) => order.status === "DELIVERED"
      ).length,
    },
  ];

  const COLORS = [
    "#F59E0B",
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
  ];

  // =========================
  // FETCH DASHBOARD
  // =========================

  useEffect(() => {
    fetchDashboard(1);
  }, []);

  async function fetchDashboard(page = 1) {
    try {
      setLoading(true);

      const [
        metricsRes,
        ordersRes,
        productsRes,
      ] = await Promise.all([
        dispatch(asyncGetMetrics()),
        dispatch(asyncGetOrder(page)),
        dispatch(asyncGetProduct()),
      ]);

      console.log(
        "DASHBOARD METRICS =>",
        metricsRes
      );

      console.log(
        "DASHBOARD ORDERS =>",
        ordersRes
      );

      console.log(
        "DASHBOARD PRODUCTS =>",
        productsRes
      );

      // =========================
      // METRICS
      // =========================

      setMetrics(
        metricsRes || {
          revenue: 0,
          sales: 0,
          orders: 0,
          products: 0,
          topProducts: [],
        }
      );

      // =========================
      // ORDERS
      // =========================

      setOrders(
        ordersRes?.orders || []
      );

      // =========================
      // PAGINATION
      // =========================

      setPagination(
        ordersRes?.pagination || {
          page: 1,
          totalPages: 1,
        }
      );

      // =========================
      // PRODUCTS
      // =========================

      setProducts(
        productsRes || []
      );

    } catch (err) {
      console.log(
        "DASHBOARD ERROR =>",
        err
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // PAGE CHANGE
  // =========================

  function handlePageChange(page) {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.page
    ) {
      return;
    }

    fetchDashboard(page);
  }

  // =========================
  // STATUS CLASS
  // =========================

  function getStatusClass(status) {
    return status?.toLowerCase() || "";
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section className="seller-dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>

          <p>
            Loading dashboard...
          </p>
        </div>
      </section>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <section className="seller-dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">
        <div>
          <h1>
            Seller Dashboard
          </h1>

          <p>
            Manage your store and monitor your sales.
          </p>
        </div>
      </div>

      {/* ================= METRICS ================= */}

      <div className="metrics-grid">

        <div className="metric-card">
          <span>
            Total Revenue
          </span>

          <h2>
            ₹{metrics.revenue || 0}
          </h2>
        </div>

        <div className="metric-card">
          <span>
            Total Orders
          </span>

          <h2>
            {metrics.orders || 0}
          </h2>
        </div>

        <div className="metric-card">
          <span>
            Items Sold
          </span>

          <h2>
            {metrics.sales || 0}
          </h2>
        </div>

        <div className="metric-card">
          <span>
            Total Products
          </span>

          <h2>
            {metrics.products || 0}
          </h2>
        </div>

      </div>

      {/* ================= CHARTS ================= */}

      <div className="charts-grid">

        {/* REVENUE */}

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <h2>
                Revenue Trend
              </h2>

              <p>
                Your revenue performance
              </p>
            </div>

          </div>

          <div className="chart-wrapper">

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <LineChart
                data={revenueData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fill:
                      "var(--text-secondary)",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill:
                      "var(--text-secondary)",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* ORDER STATUS */}

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <h2>
                Orders Status
              </h2>

              <p>
                Current order distribution
              </p>
            </div>

          </div>

          <div className="chart-wrapper">

            {orders.length === 0 ? (

              <div className="chart-empty">
                No order data available
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={55}
                    paddingAngle={3}
                    label
                  >

                    {statusData.map(
                      (entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>

      </div>

      {/* ================= RECENT ORDERS ================= */}

      <div className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>
              Recent Orders
            </h2>

            <p>
              Latest orders from your store
            </p>
          </div>

        </div>

        {orders.length === 0 ? (

          <div className="empty-state">

            <h3>
              No Orders Yet
            </h3>

            <p>
              Your recent orders will appear here.
            </p>

          </div>

        ) : (

          <div className="orders-list">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order._id}
              >

                <div className="order-top">

                  <div>

                    <span className="order-label">
                      Order ID
                    </span>

                    <h4>
                      #{order._id}
                    </h4>

                  </div>

                  <span
                    className={`status-badge ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </div>

                <div className="order-details">

                  <div>

                    <span>
                      Amount
                    </span>

                    <strong>
                      ₹
                      {order.price?.amount ||
                        0}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Items
                    </span>

                    <strong>
                      {order.items?.length ||
                        0}
                    </strong>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* ================= PAGINATION ================= */}

        {pagination.totalPages > 1 && (

          <div className="pagination">

            <button
              disabled={
                pagination.page === 1
              }
              onClick={() =>
                handlePageChange(
                  pagination.page - 1
                )
              }
            >
              ← Previous
            </button>

            <div className="page-numbers">

              {Array.from(
                {
                  length:
                    pagination.totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (

                <button
                  key={page}
                  className={
                    pagination.page === page
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handlePageChange(page)
                  }
                >
                  {page}
                </button>

              ))}

            </div>

            <button
              disabled={
                pagination.page ===
                pagination.totalPages
              }
              onClick={() =>
                handlePageChange(
                  pagination.page + 1
                )
              }
            >
              Next →
            </button>

          </div>

        )}

      </div>

      {/* ================= TOP PRODUCTS ================= */}

      <div className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>
              Top Products
            </h2>

            <p>
              Your best performing products
            </p>
          </div>

        </div>

        {metrics.topProducts?.length === 0 ? (

          <div className="empty-state">

            <h3>
              No Products Yet
            </h3>

            <p>
              Your top products will appear here.
            </p>

          </div>

        ) : (

          <div className="top-products-grid">

            {metrics.topProducts.map(
              (product, index) => (

                <div
                  className="top-product-card"
                  key={
                    product.id ||
                    product._id ||
                    index
                  }
                >

                  <div className="product-rank">
                    #{index + 1}
                  </div>

                  <div className="top-product-info">

                    <h3>
                      {product.title}
                    </h3>

                    <p>
                      Product performance
                    </p>

                  </div>

                  <div className="sold-info">

                    <span>
                      Sold
                    </span>

                    <strong>
                      {product.sold || 0}
                    </strong>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </section>
  );
}

export default SellerDashboard;
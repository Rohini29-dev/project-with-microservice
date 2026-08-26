import { useEffect, useState } from "react";
import "./Home.css";

import ProductCard from "../../componetes/ProductCard/ProductCard";
import { getProducts } from "../../services/product.service";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);

      const response = await getProducts();

      setProducts(response.data.data || []);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="home-page">
        <section className="home-container">

          <div className="home-loading">
            <div className="loading-spinner"></div>

            <h2>Loading products...</h2>

            <p>
              Please wait while we fetch the latest products.
            </p>
          </div>

        </section>
      </main>
    );
  }


  /* ================= ERROR ================= */

  if (error) {
    return (
      <main className="home-page">
        <section className="home-container">

          <div className="home-error">

            <div className="error-icon">
              !
            </div>

            <h2>
              Something went wrong
            </h2>

            <p>
              {error}
            </p>

            <button
              className="retry-btn"
              onClick={fetchProducts}
            >
              Try Again
            </button>

          </div>

        </section>
      </main>
    );
  }


  return (
    <main className="home-page">

      <section className="home-container">


        {/* ================= HERO ================= */}

        <div className="home-hero">

          <div className="hero-content">

            <span className="hero-label">
              ✨ Explore our collection
            </span>

            <h1>
              Find something
              <span> you'll love.</span>
            </h1>

            <p>
              Discover quality products from our trusted
              sellers and find the perfect choice for you.
            </p>

          </div>

        </div>


        {/* ================= PRODUCTS HEADER ================= */}

        <div className="home-header">

          <div className="home-title">

            <h2>
              All Products
            </h2>

            <p>
              Explore our latest products
            </p>

          </div>

          <div className="product-count">
            {products.length}{" "}
            {products.length === 1
              ? "Product"
              : "Products"}
          </div>

        </div>


        {/* ================= PRODUCTS ================= */}

        {products.length === 0 ? (

          <div className="empty-products">

            <div className="empty-icon">
              🛍️
            </div>

            <h3>
              No products available
            </h3>

            <p>
              There are no products available
              right now. Please check back later.
            </p>

          </div>

        ) : (

          <div className="product-grid">

            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Home;
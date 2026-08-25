import "./SellerProducts.css";
import { useEffect, useMemo, useState } from "react";
import { getProducts, deleteProduct } from "../../services/seller.service";
import { useNavigate } from "react-router-dom";

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.log("GET PRODUCTS ERROR =>", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!ok) return;

    try {
      await deleteProduct(id);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.log("DELETE PRODUCT ERROR =>", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  }

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return products;
    }

    return products.filter((product) =>
      product.title?.toLowerCase().includes(searchValue)
    );
  }, [products, search]);

  if (loading) {
    return (
      <section className="seller-products-page">
        <div className="products-loading">
          <div className="loading-spinner"></div>

          <h2>Loading Products...</h2>

          <p>Please wait while we fetch your products.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="seller-products-page">

      {/* Header */}

      <div className="products-header">

        <div className="products-header-content">

          <span className="products-eyebrow">
            SELLER PANEL
          </span>

          <h1>My Products</h1>

          <p>
            Manage your products, prices and inventory
            from one place.
          </p>

        </div>

        <div className="products-search">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>

      </div>


      {/* Summary */}

      <div className="products-summary">

        <div>
          Showing{" "}
          <strong>{filteredProducts.length}</strong>{" "}
          of{" "}
          <strong>{products.length}</strong>{" "}
          products
        </div>

        {search && (
          <p>
            Search results for{" "}
            <strong>"{search}"</strong>
          </p>
        )}

      </div>


      {/* Products */}

      {filteredProducts.length === 0 ? (

        <div className="empty-products">

          <div className="empty-icon">
            📦
          </div>

          <h2>
            {search
              ? "No Products Found"
              : "No Products Yet"}
          </h2>

          <p>
            {search
              ? "Try searching with a different product name."
              : "Your products will appear here once you add them."}
          </p>

          {search && (
            <button
              type="button"
              className="clear-filter-btn"
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>
          )}

        </div>

      ) : (

        <div className="products-grid">

          {filteredProducts.map((product) => {

            const stock = Number(product.stock) || 0;

            return (
              <article
                className="product-card"
                key={product._id}
              >

                {/* Image */}

                <div className="product-image">

                  <img
                    src={
                      product.images?.[0]?.url ||
                      "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={product.title}
                    loading="lazy"
                  />

                  <span
                    className={`stock-badge ${
                      stock > 0
                        ? "in-stock"
                        : "out-stock"
                    }`}
                  >
                    <span className="stock-dot"></span>

                    {stock > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </span>

                </div>


                {/* Content */}

                <div className="product-content">

                  <div className="product-heading">

                    <h2>
                      {product.title}
                    </h2>

                  </div>


                  <p className="description">
                    {product.description ||
                      "No description available."}
                  </p>


                  {/* Product Info */}

                  <div className="product-info">

                    <div className="info-box">

                      <span>
                        Price
                      </span>

                      <strong>
                        ₹
                        {product.price?.amount ||
                          0}
                      </strong>

                    </div>


                    <div className="info-box">

                      <span>
                        Stock
                      </span>

                      <strong
                        className={`stock-number ${
                          stock <= 0
                            ? "out"
                            : ""
                        }`}
                      >
                        {stock}
                      </strong>

                    </div>

                  </div>


                  {/* Actions */}

                  <div className="product-footer">

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() =>
                        navigate(
                          `/products/${product._id}/edit`
                        )
                      }
                    >
                      <span>✎</span>
                      Edit
                    </button>


                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(product._id)
                      }
                    >
                      <span>🗑</span>
                      Delete
                    </button>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      )}

    </section>
  );
}

export default SellerProducts;
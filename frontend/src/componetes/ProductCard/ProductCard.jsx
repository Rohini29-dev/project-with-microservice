import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  return (
    <article className="product-card">

      {/* ================= IMAGE ================= */}

      <Link
        to={`/products/${product._id}`}
        className="product-image-link"
      >
        <div className="product-image">

          {product.images?.length ? (
            <img
              src={product.images[0].url}
              alt={product.title}
              loading="lazy"
            />
          ) : (
            <div className="image-placeholder">
              <span>🛍️</span>
              <p>No Image</p>
            </div>
          )}

          
        </div>
      </Link>


      {/* ================= CONTENT ================= */}

      <div className="product-content">

        {/* Title */}

        <Link
          to={`/products/${product._id}`}
          className="product-title"
        >
          {product.title}
        </Link>


        {/* Description */}

        <p className="description">
          {product.description ||
            "No description available."}
        </p>


        {/* Bottom section */}

        <div className="product-bottom">

          <div className="price-section">

            <span className="price-label">
              Price
            </span>

            <h2 className="price">
              ₹{product.price?.amount}
            </h2>

          </div>


          <Link
            to={`/products/${product._id}`}
            className="details-btn"
          >
            View Details
            <span>→</span>
          </Link>

        </div>

      </div>

    </article>
  );
}

export default ProductCard;
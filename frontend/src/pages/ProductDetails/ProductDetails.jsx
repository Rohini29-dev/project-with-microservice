import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToCart } from "../../services/cart.service";
import { getProductById } from "../../services/product.service";

import "./ProductDetails.css";
import { toast } from "react-toastify";


function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    try {
      setLoading(true);

      const response = await getProductById(id);

      const productData = response.data.data;

      setProduct(productData);

      if (productData.images?.length) {
        setSelectedImage(productData.images[0].url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
  try {
    const response = await addToCart(product._id, 1);

    toast.success(
      response.data.message || "Product added to cart!"
    );

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
        "Unable to add product."
    );
  }
}

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-loading">
          <div className="details-spinner"></div>

          <h2>Loading product...</h2>

          <p>Please wait while we fetch the product details.</p>
        </div>
      </main>
    );
  }

  /* ================= NOT FOUND ================= */

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <div className="not-found-icon">🛍️</div>

          <h2>Product not found</h2>

          <p>
            The product you're looking for may have
            been removed or is unavailable.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="product-details-page">

      <section className="product-details">

        {/* ================= GALLERY ================= */}

        <div className="gallery">

          <div className="main-image">

            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.title}
              />
            ) : (
              <div className="image-placeholder">
                <span>🛍️</span>
                <p>No Image</p>
              </div>
            )}

          </div>


          {/* Thumbnails */}

          {product.images?.length > 0 && (
            <div className="thumbnail-container">

              {product.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={`thumbnail ${
                    selectedImage === image.url
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedImage(image.url)
                  }
                >
                  <img
                    src={image.url}
                    alt={`${product.title} ${index + 1}`}
                  />
                </button>
              ))}

            </div>
          )}

        </div>


        {/* ================= PRODUCT INFO ================= */}

        <div className="product-info">

          <span className="product-label">
            Product Details
          </span>


          <h1>
            {product.title}
          </h1>


          <div className="price-section">

            <span className="price-label">
              Price
            </span>

            <h2>
              ₹{product.price?.amount}
            </h2>

          </div>


          <div className="description-section">

            <h3>
              Description
            </h3>

            <p>
              {product.description ||
                "No description available."}
            </p>

          </div>


          {/* Seller */}

          <div className="seller-box">

            <div className="seller-icon">
              👤
            </div>

            <div className="seller-info">

              <span>
                Sold by
              </span>

              <strong>
                {product.seller || "Seller"}
              </strong>

            </div>

          </div>


          {/* Add to cart */}

          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
          >
            <span>🛒</span>
            Add to Cart
          </button>

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;
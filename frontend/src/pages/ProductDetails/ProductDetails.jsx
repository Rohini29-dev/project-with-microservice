import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import {
  asyncdeleteproduct,
  asyncgetProductById,
} from "../../store/actions/productAction";

import { asyncAddCart } from "../../store/actions/cartAction";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =========================================
  // REDUX
  // =========================================

  const product = useSelector(
    (state) => state.productReducer.singleProduct
  );

  const user = useSelector(
    (state) => state.authReducer.auth?.user
  );


  console.log("SINGLE PRODUCT FROM REDUX =>", product);

  // =========================================
  // STATE
  // =========================================

  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // =========================================
  // FETCH PRODUCT
  // =========================================

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  async function fetchProduct() {
    try {
      setLoading(true);

      const response = await dispatch(
        asyncgetProductById(id)
      );

      const productData = response;

      if (productData?.images?.length > 0) {
        setSelectedImage(
          productData.images[0]?.url || ""
        );
      } else {
        setSelectedImage("");
      }
    } catch (error) {
      console.error(
        "Product fetch error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load product."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // CHECK PRODUCT OWNER
  // =========================================

  const productSellerId =
    typeof product?.seller === "object"
      ? product?.seller?._id
      : product?.seller;

  const currentUserId =
    user?._id || user?.id;

  const isSeller =
    user?.role === "seller";

  const isProductOwner =
    isSeller &&
    productSellerId &&
    currentUserId &&
    String(productSellerId) ===
      String(currentUserId);

  // =========================================
  // ADD TO CART
  // =========================================

  async function handleAddToCart() {
    try {
      if (!product?._id) {
        toast.error("Product not found.");
        return;
      }

      const response = await dispatch(
        asyncAddCart(product._id, 1)
      );

      toast.success(
        response?.data?.message ||
          "Product added to cart!"
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to add product."
      );
    }
  }

  // =========================================
  // DELETE PRODUCT
  // =========================================

  async function handleDeleteProduct() {
    if (!product?._id) {
      toast.error("Product not found.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await dispatch(
        asyncdeleteproduct(product._id)
      );

      toast.success(
        response?.data?.message ||
          "Product deleted successfully!"
      );

      navigate("/seller/products");
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to delete product."
      );
    } finally {
      setDeleting(false);
    }
  }

  // =========================================
  // EDIT PRODUCT
  // =========================================

  function handleEditProduct() {
    if (!product?._id) {
      toast.error("Product not found.");
      return;
    }

    navigate(
      `/products/${product._id}/edit`
    );
  }

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-loading">
          <div className="details-spinner"></div>

          <h2>
            Loading product...
          </h2>

          <p>
            Please wait while we fetch
            the product details.
          </p>
        </div>
      </main>
    );
  }

  // =========================================
  // PRODUCT NOT FOUND
  // =========================================

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <div className="not-found-icon">
            🛍️
          </div>

          <h2>
            Product not found
          </h2>

          <p>
            The product you're looking for
            may have been removed or is
            unavailable.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  // =========================================
  // STOCK
  // =========================================

  const stockQuantity =
    Number(product.stock ?? 0);

  const isOutOfStock =
    stockQuantity <= 0;

  // =========================================
  // JSX
  // =========================================

  return (
    <main className="product-details-page">
      <section className="product-details">

        {/* =====================================
            PRODUCT GALLERY
        ===================================== */}

        <div className="gallery">

          {/* Main Image */}

          <div className="main-image">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.title}
              />
            ) : (
              <div className="image-placeholder">
                <span>🛍️</span>

                <p>
                  No Image
                </p>
              </div>
            )}
          </div>

          {/* Thumbnails */}

          {product.images?.length > 0 && (
            <div className="thumbnail-container">
              {product.images.map(
                (image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    className={`thumbnail ${
                      selectedImage === image.url
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedImage(
                        image.url
                      )
                    }
                  >
                    <img
                      src={image.url}
                      alt={`${product.title} ${
                        index + 1
                      }`}
                    />
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* =====================================
            PRODUCT INFORMATION
        ===================================== */}

        <div className="product-info">

          {/* Top Row */}

          <div className="details-top-row">
            <span className="product-label">
              Product Details
            </span>

            {isProductOwner && (
              <span className="owner-badge">
                Your Product
              </span>
            )}
          </div>

          {/* Product Title */}

          <h1>
            {product.title}
          </h1>

          {/* Price */}

          <div className="price-section">
            <span className="price-label">
              Price
            </span>

            <h2>
              {product.price?.currency === "USD"
                ? "$"
                : "₹"}

              {product.price?.amount}
            </h2>
          </div>

          {/* Stock */}

          <div className="stock-section">
            <div className="stock-icon">
              {isOutOfStock
                ? "!"
                : "✓"}
            </div>

            <div className="stock-info">
              <span>
                Availability
              </span>

              <strong
                className={
                  isOutOfStock
                    ? "out-of-stock"
                    : "in-stock"
                }
              >
                {isOutOfStock
                  ? "Out of stock"
                  : `${stockQuantity} available`}
              </strong>
            </div>
          </div>

          {/* Description */}

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
                {typeof product.seller ===
                "object"
                  ? product.seller?.username ||
                    product.seller?.fullName ||
                    "Seller"
                  : "Seller"}
              </strong>
            </div>
          </div>

          {/* =====================================
              SELLER OWNER ACTIONS
          ===================================== */}

          {isProductOwner && (
            <div className="seller-actions">

              {/* Edit */}

              <button
                type="button"
                className="edit-product-btn"
                onClick={handleEditProduct}
                disabled={deleting}
              >
                <span>
                  ✎
                </span>

                Edit Product
              </button>

              {/* Delete */}

              <button
                type="button"
                className="delete-product-btn"
                onClick={handleDeleteProduct}
                disabled={deleting}
              >
                <span>
                  🗑
                </span>

                {deleting
                  ? "Deleting..."
                  : "Delete Product"}
              </button>
            </div>
          )}

          {/* =====================================
              NORMAL USER - ADD TO CART
          ===================================== */}

          {user?.role === "user" && (
            <button
              type="button"
              className="add-cart-btn"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <span>
                🛒
              </span>

              {isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
          )}

          {/* =====================================
              SELLER VIEWING OTHER SELLER PRODUCT
          ===================================== */}

          {isSeller &&
            !isProductOwner && (
              <div className="seller-view-message">
                <span>
                  ℹ
                </span>

                <p>
                  You are viewing another
                  seller's product.
                </p>
              </div>
            )}
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
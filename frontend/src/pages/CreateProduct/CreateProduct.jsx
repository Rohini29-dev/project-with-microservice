import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./CreateProduct.css";
import { createProduct } from "../../services/product.service";

function CreateProduct() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      priceCurrency: "INR",
      stock: 0,
    },
  });

  const title = watch("title");
  const description = watch("description");
  const priceAmount = watch("priceAmount");
  const stock = watch("stock");

  function handleImageChange(e) {
    const files = Array.from(e.target.files || []);

    setImages(files);
  }

  async function submitHandler(data) {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("priceAmount", data.priceAmount);
      formData.append("priceCurrency", data.priceCurrency);
      formData.append("stock", data.stock);

      images.forEach((image) => {
        formData.append("images", image);
      });

      await createProduct(formData);

      toast.success("Product created successfully!");

      navigate("/products/seller");
    } catch (error) {
      console.log("CREATE PRODUCT ERROR =>", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create product."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="create-product-page">
      <div className="create-product-container">

        {/* Header */}
        <div className="create-page-header">

          <div>
            <span className="create-eyebrow">
              SELLER PANEL
            </span>

            <h1>Create Product</h1>

            <p>
              Add a new product to your store and start
              selling it to customers.
            </p>
          </div>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/products/seller")}
          >
            ← Back to Products
          </button>

        </div>

        {/* Main Layout */}
        <div className="create-product-layout">

          {/* Form */}
          <div className="create-form-card">

            <form onSubmit={handleSubmit(submitHandler)}>

              {/* Basic Information */}
              <div className="form-section">

                <div className="section-heading">
                  <div className="section-icon">
                    ✦
                  </div>

                  <div>
                    <h2>Basic Information</h2>
                    <p>
                      Enter the basic details of your product.
                    </p>
                  </div>
                </div>

                {/* Title */}
                <div className="form-group">

                  <label>
                    Product Title
                    <span>*</span>
                  </label>

                  <input
                    className={`form-input ${
                      errors.title ? "error" : ""
                    }`}
                    type="text"
                    placeholder="e.g. Premium Cotton T-Shirt"
                    {...register("title", {
                      required: "Product title is required",
                      minLength: {
                        value: 3,
                        message:
                          "Title must be at least 3 characters",
                      },
                    })}
                  />

                  {errors.title && (
                    <span className="error-message">
                      {errors.title.message}
                    </span>
                  )}

                </div>

                {/* Description */}
                <div className="form-group">

                  <div className="label-row">
                    <label>Description</label>

                    <small>
                      Optional
                    </small>
                  </div>

                  <textarea
                    className="form-input description-input"
                    rows={6}
                    placeholder="Describe your product, its features and benefits..."
                    {...register("description")}
                  />

                </div>

              </div>

              <div className="form-divider" />

              {/* Pricing */}
              <div className="form-section">

                <div className="section-heading">
                  <div className="section-icon">
                    ₹
                  </div>

                  <div>
                    <h2>Pricing & Inventory</h2>
                    <p>
                      Set your product price and available stock.
                    </p>
                  </div>
                </div>

                <div className="pricing-grid">

                  {/* Price */}
                  <div className="form-group">

                    <label>
                      Price
                      <span>*</span>
                    </label>

                    <div
                      className={`price-input ${
                        errors.priceAmount ? "error" : ""
                      }`}
                    >
                      <span>₹</span>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...register("priceAmount", {
                          required: "Price is required",
                          min: {
                            value: 0,
                            message:
                              "Price cannot be negative",
                          },
                        })}
                      />
                    </div>

                    {errors.priceAmount && (
                      <span className="error-message">
                        {errors.priceAmount.message}
                      </span>
                    )}

                  </div>

                  {/* Currency */}
                  <div className="form-group">

                    <label>
                      Currency
                    </label>

                    <select
                      className="form-input"
                      {...register("priceCurrency")}
                    >
                      <option value="INR">
                        INR — Indian Rupee
                      </option>

                      <option value="USD">
                        USD — US Dollar
                      </option>
                    </select>

                  </div>

                </div>

                {/* Stock */}
                <div className="form-group stock-group">

                  <label>
                    Available Stock
                    <span>*</span>
                  </label>

                  <input
                    className={`form-input ${
                      errors.stock ? "error" : ""
                    }`}
                    type="number"
                    min="0"
                    placeholder="Enter available quantity"
                    {...register("stock", {
                      required: "Stock is required",
                      min: {
                        value: 0,
                        message:
                          "Stock cannot be negative",
                      },
                    })}
                  />

                  {errors.stock && (
                    <span className="error-message">
                      {errors.stock.message}
                    </span>
                  )}

                </div>

              </div>

              <div className="form-divider" />

              {/* Images */}
              <div className="form-section">

                <div className="section-heading">
                  <div className="section-icon">
                    🖼
                  </div>

                  <div>
                    <h2>Product Images</h2>

                    <p>
                      Upload clear images of your product.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="product-images"
                  className="image-upload"
                >

                  <div className="upload-icon">
                    ↑
                  </div>

                  <strong>
                    Choose product images
                  </strong>

                  <span>
                    PNG, JPG or WEBP
                  </span>

                  <input
                    id="product-images"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={handleImageChange}
                  />

                </label>

                {images.length > 0 && (
                  <div className="selected-images">

                    {images.map((image, index) => (
                      <div
                        className="selected-image"
                        key={`${image.name}-${index}`}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Product ${index + 1}`}
                        />

                        <span>
                          {index + 1}
                        </span>
                      </div>
                    ))}

                  </div>
                )}

              </div>

              {/* Actions */}
              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    navigate("/products/seller")
                  }
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="create-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="button-spinner" />
                      Creating...
                    </>
                  ) : (
                    <>
                      + Create Product
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

          {/* Preview */}
          <aside className="product-preview">

            <div className="preview-header">

              <div>
                <span>LIVE PREVIEW</span>
                <h2>Your Product</h2>
              </div>

              <div className="preview-icon">
                ✓
              </div>

            </div>

            <div className="preview-content">

              <div className="preview-image">

                {images.length > 0 ? (
                  <img
                    src={URL.createObjectURL(images[0])}
                    alt="Product preview"
                  />
                ) : (
                  <div className="preview-placeholder">
                    <span>🛍</span>
                    <p>Product image</p>
                  </div>
                )}

              </div>

              <div className="preview-details">

                <span className="preview-label">
                  PRODUCT
                </span>

                <h3>
                  {title || "Your product title"}
                </h3>

                <p>
                  {description ||
                    "Your product description will appear here."}
                </p>

              </div>

              <div className="preview-bottom">

                <div>
                  <span>PRICE</span>

                  <strong>
                    ₹{priceAmount || "0"}
                  </strong>
                </div>

                <div className="preview-stock">
                  <span>STOCK</span>

                  <strong>
                    {stock || 0}
                  </strong>
                </div>

              </div>

            </div>

            <div className="preview-footer">
              Your product information will be visible
              to customers after publishing.
            </div>

          </aside>

        </div>

      </div>
    </section>
  );
}

export default CreateProduct;
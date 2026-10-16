import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";


import "./CreateProduct.css";
import { asynccreateProduct } from "../../store/actions/productAction";

function CreateProduct() {
  const navigate = useNavigate();
    const dispatch = useDispatch();


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
  const priceCurrency = watch("priceCurrency");

  /*
   * Create preview URLs only when images change.
   * This avoids creating new object URLs on every render.
   */
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const previews = images.map((image) => ({
      file: image,
      url: URL.createObjectURL(image),
    }));

    setImagePreviews(previews);

    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [images]);

  /*
   * Handle image selection
   */
  function handleImageChange(e) {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setImages((prevImages) => {
      const existingKeys = new Set(
        prevImages.map(
          (image) => `${image.name}-${image.size}-${image.lastModified}`
        )
      );

      const newImages = files.filter(
        (image) =>
          !existingKeys.has(
            `${image.name}-${image.size}-${image.lastModified}`
          )
      );

      return [...prevImages, ...newImages];
    });

    // Allows selecting the same file again after removing it.
    e.target.value = "";
  }

  /*
   * Remove one image
   */
  function removeImage(indexToRemove) {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  }

  /*
   * Submit product
   */
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

    // Check FormData
    console.log("FORM DATA:");

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Wait for Redux thunk
    await dispatch(asynccreateProduct(formData));

toast.success("Product created successfully!");
navigate("/seller/products");

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
                    step="1"
                    placeholder="Enter available quantity"
                    {...register("stock", {
                      required: "Stock is required",
                      min: {
                        value: 0,
                        message:
                          "Stock cannot be negative",
                      },
                      valueAsNumber: true,
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
                    PNG, JPG or WEBP • You can select multiple images
                  </span>

                  <input
                    id="product-images"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={handleImageChange}
                  />

                </label>

                {/* Selected Images */}
                {imagePreviews.length > 0 && (
                  <div className="selected-images">

                    {imagePreviews.map((preview, index) => (
                      <div
                        className="selected-image"
                        key={`${preview.file.name}-${preview.file.size}-${preview.file.lastModified}`}
                      >

                        <img
                          src={preview.url}
                          alt={`Product ${index + 1}`}
                        />

                        {/* Image number */}
                        <span className="image-number">
                          {index + 1}
                        </span>

                        {/* Remove button */}
                        <button
                          type="button"
                          className="remove-image-button"
                          onClick={() => removeImage(index)}
                          aria-label={`Remove image ${index + 1}`}
                          title="Remove image"
                        >
                          ×
                        </button>

                        {/* Main image badge */}
                        {index === 0 && (
                          <span className="main-image-badge">
                            Main
                          </span>
                        )}

                      </div>
                    ))}

                  </div>
                )}

                {images.length > 0 && (
                  <p className="image-count">
                    {images.length}{" "}
                    {images.length === 1 ? "image" : "images"} selected
                  </p>
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

              {/* Preview Image */}
              <div className="preview-image">

                {imagePreviews.length > 0 ? (
                  <img
                    src={imagePreviews[0].url}
                    alt="Product preview"
                  />
                ) : (
                  <div className="preview-placeholder">
                    <span>🛍</span>
                    <p>Product image</p>
                  </div>
                )}

              </div>

              {/* Preview Details */}
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

              {/* Preview Bottom */}
              <div className="preview-bottom">

                <div>
                  <span>PRICE</span>

                  <strong>
                    {priceCurrency === "USD" ? "$" : "₹"}
                    {priceAmount || "0"}
                  </strong>
                </div>

                <div className="preview-stock">

                  <span>STOCK</span>

                  <strong>
                    {stock ?? 0}
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

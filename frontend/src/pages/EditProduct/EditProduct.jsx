import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import "./EditProduct.css";
import { useDispatch } from "react-redux";
import { asyncgetProductById, asyncupdateproduct } from "../../store/actions/productAction";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [product, setProduct] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const title = watch("title");
  const description = watch("description");
  const priceAmount = watch("priceAmount");
  const priceCurrency = watch("priceCurrency");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    try {
      setLoading(true);

      const response = await dispatch(asyncgetProductById(id));
      const data = response.data.data;

      setProduct(data);

      reset({
        title: data.title || "",
        description: data.description || "",
        priceAmount: data.price?.amount || "",
        priceCurrency: data.price?.currency || "INR",
      });
    } catch (error) {
      console.error("GET PRODUCT ERROR =>", error);

      alert(
        error.response?.data?.message ||
          "Unable to load product"
      );

      navigate("/products/seller");
    } finally {
      setLoading(false);
    }
  }

  async function submitHandler(data) {
    try {
      setUpdating(true);

      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        priceAmount: Number(data.priceAmount),
        priceCurrency: data.priceCurrency,
      };

      await dispatch(asyncupdateproduct(id, payload));

      alert("Product updated successfully");

      navigate("/products/seller");
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR =>", error);

      alert(
        error.response?.data?.message ||
          "Unable to update product"
      );
    } finally {
      setUpdating(false);
    }
  }

  function handleCancel() {
  navigate("/products/seller");
}

  if (loading) {
    return (
      <section className="edit-product-page">
        <div className="edit-loading">
          <div className="loading-spinner"></div>
          <h2>Loading product...</h2>
          <p>Please wait while we load the product details.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="edit-product-page">

      <div className="edit-product-container">

        {/* Back */}

        <button
          type="button"
          className="back-button"
          onClick={handleCancel}
        >
          <span>←</span>
          Back to products
        </button>


        {/* Header */}

        <header className="edit-page-header">

          <div>
            <span className="edit-eyebrow">
              PRODUCT MANAGEMENT
            </span>

            <h1>Edit Product</h1>

            <p>
              Update your product information and pricing
              before saving your changes.
            </p>
          </div>

          <div className="edit-header-badge">
            <span className="badge-dot"></span>
            Editing
          </div>

        </header>


        {/* Content */}

        <div className="edit-layout">

          {/* ================= FORM ================= */}

          <div className="edit-form-card">

            <form
              onSubmit={handleSubmit(submitHandler)}
            >

              {/* Basic Information */}

              <div className="form-section">

                <div className="section-heading">

                  <div className="section-icon">
                    01
                  </div>

                  <div>
                    <h2>Basic information</h2>

                    <p>
                      Keep your product details clear and
                      easy to understand.
                    </p>
                  </div>

                </div>


                {/* Title */}

                <div className="form-group">

                  <label htmlFor="title">
                    Product title
                    <span>*</span>
                  </label>

                  <input
                    id="title"
                    type="text"
                    className={`form-input ${
                      errors.title ? "error" : ""
                    }`}
                    placeholder="Enter product title"
                    {...register("title", {
                      required:
                        "Product title is required",
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

                  <label htmlFor="description">
                    Description
                  </label>

                  <textarea
                    id="description"
                    className="form-input"
                    placeholder="Write a short description about your product..."
                    {...register("description")}
                  />

                </div>

              </div>


              {/* Divider */}

              <div className="form-divider"></div>


              {/* Pricing */}

              <div className="form-section">

                <div className="section-heading">

                  <div className="section-icon">
                    02
                  </div>

                  <div>
                    <h2>Pricing</h2>

                    <p>
                      Set the current selling price for
                      this product.
                    </p>
                  </div>

                </div>


                <div className="pricing-fields">

                  {/* Price */}

                  <div className="form-group">

                    <label htmlFor="priceAmount">
                      Price
                      <span>*</span>
                    </label>

                    <div className="price-field">

                      <span>
                        {priceCurrency === "USD"
                          ? "$"
                          : "₹"}
                      </span>

                      <input
                        id="priceAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        className={
                          errors.priceAmount
                            ? "error"
                            : ""
                        }
                        placeholder="0.00"
                        {...register("priceAmount", {
                          required:
                            "Price is required",
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

                    <label htmlFor="priceCurrency">
                      Currency
                    </label>

                    <select
                      id="priceCurrency"
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

              </div>


              {/* Actions */}

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={updating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="update-button"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <span className="button-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>

              </div>

            </form>

          </div>


          {/* ================= PREVIEW ================= */}

          <aside className="product-preview">

            <div className="preview-header">

              <div>
                <span>PREVIEW</span>
                <h2>Product card</h2>
              </div>

              <div className="preview-icon">
                ✓
              </div>

            </div>


            <div className="preview-content">

              <div className="preview-image">

                {product?.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={title || product.title}
                  />
                ) : (
                  <div className="preview-image-placeholder">
                    <span>📦</span>
                  </div>
                )}

              </div>


              <div className="preview-details">

                <span className="preview-label">
                  PRODUCT
                </span>

                <h3>
                  {title || "Product title"}
                </h3>

                <p>
                  {description ||
                    "Your product description will appear here."}
                </p>

              </div>


              <div className="preview-price">

                <div>
                  <span>PRICE</span>

                  <strong>
                    {priceCurrency === "USD"
                      ? "$"
                      : "₹"}
                    {priceAmount || "0"}
                  </strong>
                </div>

                <span className="preview-status">
                  Active
                </span>

              </div>

            </div>


            <div className="preview-footer">
              Changes are reflected here while you edit
              the product.
            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}

export default EditProduct;
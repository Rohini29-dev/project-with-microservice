import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../../services/cart.service";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH CART
  // =========================================

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      setLoading(true);

      const cartResponse = await getCart();

      const items = cartResponse.data.cart.items;

      const finalItems = [];

      for (const item of items) {
        try {
          const productResponse = await axios.get(
            `http://localhost:3001/api/products/${item.productId}`,
            {
              withCredentials: true,
            }
          );

          finalItems.push({
            quantity: item.quantity,
            product: productResponse.data.data,
          });
        } catch (err) {
          console.log("Product not found", err);
        }
      }

      setCartItems(finalItems);
    } catch (err) {
      console.log("Cart error:", err);
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // CHANGE QUANTITY
  // =========================================

  async function changeQty(productId, qty) {
    try {
      await updateCartItem(productId, qty);

      setCartItems((prev) =>
        prev
          .map((item) => {
            if (item.product._id !== productId) {
              return item;
            }

            return {
              ...item,
              quantity: item.quantity + qty,
            };
          })
          .filter((item) => item.quantity > 0)
      );
    } catch (err) {
      console.log("Quantity update error:", err);
    }
  }

  // =========================================
  // REMOVE ITEM
  // =========================================

  async function handleRemove(productId) {
    try {
      await removeCartItem(productId);

      setCartItems((prev) =>
        prev.filter(
          (item) => item.product._id !== productId
        )
      );
    } catch (err) {
      console.log("Remove item error:", err);
    }
  }

  // =========================================
  // SUBTOTAL
  // =========================================

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        item.product.price.amount * item.quantity,
      0
    );
  }, [cartItems]);

  // =========================================
  // TOTAL QUANTITY
  // =========================================

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cartItems]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <section className="cart-page">
        <h2 className="loading">
          Loading Cart...
        </h2>
      </section>
    );
  }

  // =========================================
  // JSX
  // =========================================

  return (
    <section className="cart-page">

      <div className="cart-container">

        {/* =====================================
            LEFT SECTION
        ===================================== */}

        <div className="cart-left">

          {/* Header */}

          <div className="cart-header">

            <p className="eyebrow">
              Your Shopping Bag
            </p>

            <h1>
              Shopping Cart
            </h1>

            <p className="cart-subtitle">
              Review your items before proceeding
              to checkout.
            </p>

            {cartItems.length > 0 && (
              <span className="cart-items-count">
                {totalItems}{" "}
                {totalItems === 1
                  ? "Item"
                  : "Items"}
              </span>
            )}

          </div>


          {/* =====================================
              EMPTY CART
          ===================================== */}

          {cartItems.length === 0 ? (

            <div className="empty-cart">

              <div className="empty-icon">
                🛒
              </div>

              <h2>
                Your Cart is Empty
              </h2>

              <p>
                Looks like you haven't added
                any products yet.
              </p>

              <button
                className="continue-btn"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </button>

            </div>

          ) : (

            <>

              {/* =================================
                  CART ITEMS
              ================================= */}

              {cartItems.map((item) => (

                <div
                  className="cart-card"
                  key={item.product._id}
                >

                  {/* Product Image */}

                  {item.product.images?.[0]?.url ? (

                    <img
                      src={item.product.images[0].url}
                      alt={item.product.title}
                    />

                  ) : (

                    <div className="cart-image-placeholder">
                      No Image
                    </div>

                  )}


                  {/* Product Information */}

                  <div className="cart-info">

                    <h2>
                      {item.product.title}
                    </h2>

                    <p className="price">
                      ₹
                      {item.product.price.amount.toLocaleString()}
                    </p>

                    <button
                      className="remove-btn"
                      onClick={() =>
                        handleRemove(
                          item.product._id
                        )
                      }
                    >
                      🗑 Remove
                    </button>

                  </div>


                  {/* Quantity */}

                  <div className="quantity-box">

                    <button
                      onClick={() =>
                        changeQty(
                          item.product._id,
                          -1
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        changeQty(
                          item.product._id,
                          1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

              ))}


              {/* =================================
                  CONTINUE SHOPPING
              ================================= */}

              <button
                className="continue-shopping"
                onClick={() => navigate("/")}
              >
                ← Continue Shopping
              </button>

            </>

          )}

        </div>


        {/* =====================================
            ORDER SUMMARY
        ===================================== */}

        {cartItems.length > 0 && (

          <aside className="cart-summary">

            <h2>
              Order Summary
            </h2>


            {/* Items */}

            <div className="summary-row">

              <span>
                Items
              </span>

              <span>
                {totalItems}
              </span>

            </div>


            {/* Subtotal */}

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{subtotal.toLocaleString()}
              </span>

            </div>


            {/* Delivery */}

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span className="free">
                Free
              </span>

            </div>


            <hr />


            {/* Total */}

            <div className="summary-row total">

              <span>
                Total
              </span>

              <span>
                ₹{subtotal.toLocaleString()}
              </span>

            </div>


            {/* Checkout */}

            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed To Checkout
            </button>


            {/* Secure Checkout */}

            <div className="secure-checkout">

              <span className="secure-icon">
                🔒
              </span>

              <div>

                <strong>
                  Secure Checkout
                </strong>

                <p>
                  Your payment information
                  is protected.
                </p>

              </div>

            </div>

          </aside>

        )}

      </div>

    </section>
  );
}

export default Cart;
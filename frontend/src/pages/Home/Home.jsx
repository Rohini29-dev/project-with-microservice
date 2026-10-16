import { lazy, Suspense, useEffect, useState } from "react";
import "./Home.css";

import { useDispatch, useSelector } from "react-redux";

import { asyncloadproduct } from "../../store/actions/productAction";

import InfiniteScroll from "react-infinite-scroll-component";


// =========================================
// LAZY LOAD PRODUCT CARD
// =========================================

const ProductCard = lazy(() =>
  import("../../componetes/ProductCard/ProductCard")
);


// =========================================
// PRODUCT CARD LOADING
// =========================================

const ProductCardLoader = () => {
  return (
    <div className="infinite-loader">
      <h4>
        Loading product...
      </h4>
    </div>
  );
};


function Home() {
  

  const dispatch = useDispatch();

  const products = useSelector(
    (state) => state.productReducer.products
  );


  // =========================================
  // STATES
  // =========================================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Backend se next products kis position se lene hain
  const [skip, setSkip] = useState(0);

  // Backend batayega aur products available hain ya nahi
  const [hasMore, setHasMore] = useState(true);


  // =========================================
  // FIRST LOAD
  // =========================================

  useEffect(() => {

    fetchProducts();

  }, []);


  // =========================================
  // FETCH FIRST 6 PRODUCTS
  // =========================================

  async function fetchProducts() {

    try {

      setLoading(true);

      setError("");


      const response = await dispatch(
        asyncloadproduct(0, true)
      );


      console.log(
        "FIRST PRODUCTS RESPONSE =>",
        response
      );


      // First 6 products load ho gaye
      setSkip(6);


      // Backend se hasMore milega
      setHasMore(
        response?.hasMore ?? false
      );


    } catch (err) {

      console.error(
        "FETCH PRODUCTS ERROR =>",
        err
      );

      setError(
        "Failed to load products."
      );

    } finally {

      setLoading(false);

    }

  }


  // =========================================
  // LOAD NEXT 6 PRODUCTS
  // =========================================

  const loadMoreProducts = async () => {

    try {

      console.log(
        "LOADING MORE PRODUCTS..."
      );

      console.log(
        "CURRENT SKIP =>",
        skip
      );


      const response = await dispatch(
        asyncloadproduct(skip)
      );


      console.log(
        "NEXT PRODUCTS RESPONSE =>",
        response
      );


      // Next request ke liye skip
      setSkip(
        (prev) => prev + 6
      );


      // Backend decide karega aur products hain ya nahi
      setHasMore(
        response?.hasMore ?? false
      );


    } catch (error) {

      console.error(
        "LOAD MORE PRODUCTS ERROR =>",
        error
      );

    }

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <main className="home-page">

        <section className="home-container">

          <div className="home-loading">

            <div className="loading-spinner"></div>

            <h2>
              Loading products...
            </h2>

            <p>
              Please wait while we fetch
              the latest products.
            </p>

          </div>

        </section>

      </main>

    );

  }


  // =========================================
  // ERROR
  // =========================================

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


  // =========================================
  // HOME
  // =========================================

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

              <span>
                {" "}you'll love.
              </span>

            </h1>

            <p>

              Discover quality products from
              our trusted sellers and find the
              perfect choice for you.

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

          <InfiniteScroll

            dataLength={
              products.length
            }

            next={
              loadMoreProducts
            }

            hasMore={
              hasMore
            }

            loader={

              <div className="infinite-loader">

                <h4>
                  Loading more products...
                </h4>

              </div>

            }

            endMessage={

              <p className="infinite-end">

                <b>
                  🎉 You have seen all products.
                </b>

              </p>

            }

          >

            <div className="product-grid">

              <Suspense
                fallback={
                  <ProductCardLoader />
                }
              >

                {products.map(
                  (product) => (

                    <ProductCard
                      key={product._id}
                      product={product}
                    />

                  )
                )}

              </Suspense>

            </div>

          </InfiniteScroll>

        )}

      </section>

    </main>

  );

}


export default Home;
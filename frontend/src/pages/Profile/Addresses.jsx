import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./Addresses.css";
import { asyncAddUserAddress, asyncDeleteUserAddress, asyncGetUserAddresses } from "../../store/actions/authActions";

function Addresses() {
const dispatch = useDispatch()

  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    isDefult: false,
  });


  // ================= FETCH ADDRESSES =================

  useEffect(() => {

    const fetchAddresses = async () => {

      try {

        const response =
        await dispatch(asyncGetUserAddresses())

        setAddresses(
          response.addresses || []
        );

      } catch (error) {

        console.log(
          "Fetch addresses error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to fetch addresses."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchAddresses();

  }, []);


  // ================= INPUT CHANGE =================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setSuccess("");

  };


  // ================= ADD ADDRESS =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    if (!formData.street.trim()) {

      setError(
        "Street address is required."
      );

      return;
    }


    if (!formData.city.trim()) {

      setError(
        "City is required."
      );

      return;
    }


    if (!formData.state.trim()) {

      setError(
        "State is required."
      );

      return;
    }


    if (!formData.zip.trim()) {

      setError(
        "ZIP code is required."
      );

      return;
    }


    if (!formData.country.trim()) {

      setError(
        "Country is required."
      );

      return;
    }


    try {

      setSaving(true);


      const payload = {

        street:
          formData.street.trim(),

        city:
          formData.city.trim(),

        state:
          formData.state.trim(),

        zip:
          formData.zip.trim(),

        country:
          formData.country.trim(),

        isDefult:
          formData.isDefult,

      };


      const response =
        await dispatch(asyncAddUserAddress(payload));


      setAddresses(
        response.addresses || []
      );


      setSuccess(
        response.message ||
          "Address added successfully."
      );


      setFormData({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
        isDefult: false,
      });


      setShowForm(false);

    } catch (error) {

      console.log(
        "Add address error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to add address."
      );

    } finally {

      setSaving(false);

    }

  };


  // ================= DELETE ADDRESS =================

  const handleDelete = async (
    addressId
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this address?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      setError("");
      setSuccess("");


      const response =
        await dispatch(asyncDeleteUserAddress(addressId))


      setAddresses(
        response.addresses || []
      );


      setSuccess(
        response.message ||
          "Address deleted successfully."
      );

    } catch (error) {

      console.log(
        "Delete address error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to delete address."
      );

    }

  };


  // ================= LOADING =================

  if (loading) {

    return (
      <div className="addresses-loading">

        <div className="addresses-spinner"></div>

        <p>
          Loading addresses...
        </p>

      </div>
    );

  }


  return (
    <div className="addresses-page">

      <div className="addresses-container">


        {/* HEADER */}

        <div className="addresses-header">

          <div>

            <Link
              to="/profile"
              className="addresses-back"
            >
              ← Back to Profile
            </Link>

            <h1>
              My Address
            </h1>

            <p>
              Manage your delivery addresses
            </p>

          </div>


          <button
            className="add-address-btn"
            onClick={() => {

              setShowForm(
                !showForm
              );

              setError("");
              setSuccess("");

            }}
          >

            {showForm
              ? "Cancel"
              : "+ Add Address"}

          </button>

        </div>


        {/* MESSAGES */}

        {error && (
          <div className="address-message address-error">
            {error}
          </div>
        )}


        {success && (
          <div className="address-message address-success">
            {success}
          </div>
        )}


        {/* ADD FORM */}

        {showForm && (

          <div className="address-form-card">

            <h2>
              Add New Address
            </h2>

            <p className="form-description">
              Enter your complete delivery address.
            </p>


            <form onSubmit={handleSubmit}>


              {/* STREET */}

              <div className="address-form-group">

                <label htmlFor="street">
                  Street Address
                </label>

                <input
                  id="street"
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="House no, street, area"
                />

              </div>


              {/* CITY + STATE */}

              <div className="address-form-row">

                <div className="address-form-group">

                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />

                </div>


                <div className="address-form-group">

                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />

                </div>

              </div>


              {/* ZIP + COUNTRY */}

              <div className="address-form-row">

                <div className="address-form-group">

                  <label htmlFor="zip">
                    ZIP Code
                  </label>

                  <input
                    id="zip"
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    placeholder="Enter ZIP code"
                  />

                </div>


                <div className="address-form-group">

                  <label htmlFor="country">
                    Country
                  </label>

                  <input
                    id="country"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                  />

                </div>

              </div>


              {/* DEFAULT */}

              <label className="default-address">

                <input
                  type="checkbox"
                  name="isDefult"
                  checked={
                    formData.isDefult
                  }
                  onChange={handleChange}
                />

                <span>
                  Set as default address
                </span>

              </label>


              {/* SAVE */}

              <button
                type="submit"
                className="save-address-btn"
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : "Save Address"}

              </button>

            </form>

          </div>

        )}


        {/* ADDRESS LIST */}

        {addresses.length === 0 ? (

          <div className="empty-address">

            <div className="empty-address-icon">
              📍
            </div>

            <h2>
              No addresses found
            </h2>

            <p>
              Add your first delivery address
              to make checkout faster.
            </p>

            {!showForm && (

              <button
                className="empty-add-btn"
                onClick={() =>
                  setShowForm(true)
                }
              >
                + Add Address
              </button>

            )}

          </div>

        ) : (

          <div className="address-list">

            {addresses.map(
              (address) => (

                <div
                  className="address-card"
                  key={address._id}
                >

                  <div className="address-card-top">

                    <div className="address-icon">
                      📍
                    </div>

                    <div className="address-title">

                      <h2>
                        Delivery Address
                      </h2>

                      {address.isDefult && (
                        <span className="default-badge">
                          Default
                        </span>
                      )}

                    </div>

                  </div>


                  <div className="address-details">

                    <p>
                      {address.street}
                    </p>

                    <p>
                      {address.city},{" "}
                      {address.state}
                    </p>

                    <p>
                      {address.country} -{" "}
                      {address.zip}
                    </p>

                  </div>


                  <div className="address-actions">

                    <button
                      className="delete-address-btn"
                      onClick={() =>
                        handleDelete(
                          address._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Addresses;

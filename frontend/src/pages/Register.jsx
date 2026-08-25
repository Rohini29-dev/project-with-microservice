import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitHandler = async (data) => {
    const payload = {
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role,
      fullName: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
    };

    console.log(payload);

    try {
      await axios.post(
        "http://localhost:3000/api/auth/register",
        payload,
        {
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to create account."
      );
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* ================= HEADER ================= */}

        <div className="register-header">

          <div className="register-logo">
            PWS<span>.</span>
          </div>

          <h1>Create Account</h1>

          <p>
            Create your account to get started
          </p>

        </div>

        {/* ================= GOOGLE ================= */}

        <button
          type="button"
          className="google-btn"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />

          <span>
            Continue with Google
          </span>
        </button>

        {/* ================= DIVIDER ================= */}

        <div className="divider">
          <span>OR</span>
        </div>

        {/* ================= FORM ================= */}

        <form
          className="register-form"
          onSubmit={handleSubmit(submitHandler)}
        >

          {/* ================= NAME ================= */}

          <div className="name-group">

            <div className="input-group">

              <label htmlFor="firstName">
                First Name
              </label>

              <input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                {...register("firstName", {
                  required:
                    "First name is required",
                })}
              />

              {errors.firstName && (
                <small>
                  {errors.firstName.message}
                </small>
              )}

            </div>

            <div className="input-group">

              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                {...register("lastName", {
                  required:
                    "Last name is required",
                })}
              />

              {errors.lastName && (
                <small>
                  {errors.lastName.message}
                </small>
              )}

            </div>

          </div>

          {/* ================= USERNAME ================= */}

          <div className="input-group">

            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              {...register("username", {
                required:
                  "Username is required",
              })}
            />

            {errors.username && (
              <small>
                {errors.username.message}
              </small>
            )}

          </div>

          {/* ================= EMAIL ================= */}

          <div className="input-group">

            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required:
                  "Email is required",
              })}
            />

            {errors.email && (
              <small>
                {errors.email.message}
              </small>
            )}

          </div>

          {/* ================= PASSWORD ================= */}

          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register("password", {
                required:
                  "Password is required",

                minLength: {
                  value: 6,
                  message:
                    "Minimum 6 characters",
                },
              })}
            />

            {errors.password && (
              <small>
                {errors.password.message}
              </small>
            )}

          </div>

          {/* ================= ROLE ================= */}

          <div className="input-group">

            <label htmlFor="role">
              Account Type
            </label>

            <select
              id="role"
              {...register("role")}
            >
              <option value="user">
                User
              </option>

              <option value="seller">
                Seller
              </option>
            </select>

          </div>

          {/* ================= BUTTON ================= */}

          <button
            type="submit"
            className="register-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* ================= LOGIN ================= */}

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login">
            Sign In
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;
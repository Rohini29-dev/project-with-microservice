import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitHandler = async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    try {
      await axios.post(
        "http://localhost:3000/api/auth/login",
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
          "Invalid email or password"
      );
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* HEADER */}
        <div className="login-header">
          <div className="login-logo">
            PWS<span>.</span>
          </div>

          <h1>Welcome Back</h1>

          <p>
            Sign in to your account to continue
          </p>
        </div>

        {/* GOOGLE */}
        <button
          type="button"
          className="google-btn"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />

          <span>Continue with Google</span>
        </button>

        {/* DIVIDER */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* FORM */}
        <form
          className="login-form"
          onSubmit={handleSubmit(submitHandler)}
        >

          {/* EMAIL */}
          <div className="input-group">

            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <small>
                {errors.email.message}
              </small>
            )}

          </div>

          {/* PASSWORD */}
          <div className="input-group">

            <div className="password-label">
              <label htmlFor="password">
                Password
              </label>

              <button
                type="button"
                className="forgot-btn"
              >
                Forgot password?
              </button>
            </div>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <small>
                {errors.password.message}
              </small>
            )}

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* REGISTER */}
        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
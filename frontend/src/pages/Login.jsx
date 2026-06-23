import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

function Login() {
const naviagte = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    console.log(payload);

    // Login API Later
    try {
      await axios.post('http://localhost:3000/api/auth/login',
        payload
      ,{
        withCredentials:true
      }).then(resonse => {
        naviagte('/')
      })
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue</p>
        </div>

        <button type="button" className="google-btn">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
          />
          Continue with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <small>{errors.email.message}</small>
            )}
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <small>{errors.password.message}</small>
            )}
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
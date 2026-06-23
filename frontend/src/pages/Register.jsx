import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";

function Register() {
   const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
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

    // API Call Later

    try {
    await axios.post(
  "http://localhost:3000/api/auth/register",
  payload,
  {
    withCredentials: true,
  }
);

      navigate('/')
    } catch (error) {
  console.error(error);
}
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Create your account to continue</p>
        </div>

        <button type="button" className="google-btn">
          Continue with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="name-group">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                placeholder="Enter first name"
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              {errors.firstName && (
                <small>{errors.firstName.message}</small>
              )}
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Enter last name"
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />
              {errors.lastName && (
                <small>{errors.lastName.message}</small>
              )}
            </div>
          </div>

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors.username && (
              <small>{errors.username.message}</small>
            )}
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && <small>{errors.email.message}</small>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
            />
            {errors.password && (
              <small>{errors.password.message}</small>
            )}
          </div>

          <div className="input-group">
            <label>Role</label>

            <select {...register("role")}>
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button type="submit" className="register-btn">
            Create Account
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
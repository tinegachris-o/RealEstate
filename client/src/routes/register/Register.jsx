import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import createAxios from "../../libs/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";
function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    //console.log("this si formData", formData);
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");
    // console.log(username, email, password);
    //Register a user

    try {
      const res = await createAxios.post("/auth/register", {
        username,
        email,
        password,
      });
      // Display a success toast with the username
      toast.success(`${username} you have created account successfully`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Navigate to login after a short delay so the user can see the toast
      setTimeout(() => {
        navigate("/login");
      }, 5000);
      // console.log("this is response data", res.data);
      
    } catch (error) {
      setError(error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create An Account</h1>
          <input type="text" name="username" placeholder="username" />
          <input type="email" name="email" placeholder="email" />
          <input type="password" name="password" placeholder="password" />
          <button>Register</button>
          <Link to="/login">Do you have an Account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="img" />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;

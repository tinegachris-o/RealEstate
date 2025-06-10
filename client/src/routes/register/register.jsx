import api from "../../lib/axios.js";

import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    setError("");
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    //console.log("this is my formData",username,email,password)
    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });
     // console.log("this is  reponsedata data ", res.data );
      //console.log("this si my res:",res)
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/login");
      },2000);
    } catch (error) {
      console.log("error in registering user ");
      setError(error.response.data.message);
      toast.error(
        error.response?.data?.message || "registration failed failed!"
      );
    }finally{
      setIsLoading(false)
    }
  };
  return (
    <div className="register">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
}

export default Register;

import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/axios.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
function Login() {
  const { updateUser, currentUser } = useContext(AuthContext);
  console.log(
    "this is my cuurrent user id from login page:",
    currentUser?.userInfo?.id
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    //login set
    try {
      const res = await api.post("/auth/login", { username, password });
      //localStorage.setItem("user",JSON.stringify(res.data))
      updateUser(res.data);
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/");
      }, 1500);
      //console.log("this is my reponse messgage",res.data.message)
    } catch (error) {
      console.log("error in logging user ");
      setError(error.response.data.message);
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="username"
            required
            minLength={2}
            maxLength={7}
            type="text"
            placeholder="Username"
          />
          <input
            name="password"
            required
            minLength={3}
            maxLength={6}
            type="password"
            placeholder="Password"
          />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
}

export default Login;

import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import createAxios from "../../libs/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState(false);
  ///current use
  const { updateUser, currentUser } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      const res = await createAxios.post("/auth/login", {
        username,
        password,
      });
     // console.log(res.data);
      //after sucessfully login
      toast.success(`${username} welcome we misssed you`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      //// localStorage.setItem("user",JSON.stringify(res.data))
      // i use state managment know
      if (res.data && res.data.userInfo) {
        updateUser(res.data.userInfo);
      }
      navigate("/");
    } catch (error) {
      // Extract and display error from backend if available
      const errorMessage =
        error.response?.data?.message || "Failed to login. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>
            {currentUser?.username
              ? `welcome back ,${currentUser.username} `
              : "please login"}
          </h1>
          <input
            name="username"
            placeholder="username"
            required
            minLength={3}
            maxLength={20}
          />
          <input
            name="password"
            placeholder="password"
            required
            minLength={3}
            maxLength={10}
          />
          <span>
            <Link to="/register">Don't have account yet ?</Link>
          </span>
          <button disabled={loading}>
            {loading ? "Signing in " : "Sign In"}
          </button>
        </form>
      </div>
      <div className="imageContainer">
        <img src="/bg.png" alt="" />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;

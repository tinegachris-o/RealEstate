import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import Login from "../login/login.jsx";
function Layout() {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
function RequireAuth() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // useEffect(() => {
  // if (!currentUser) {
  //  navigate("/login");
  //}
  //}, [currentUser]);

  return !currentUser ? (
    navigate("/login")
  ) : (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export { Layout, RequireAuth };

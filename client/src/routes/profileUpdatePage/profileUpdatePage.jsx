import "./profileUpdatePage.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadWidget from "../../components/UploadWidget.jsx";
function ProfileUpdatePage() {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);
  //console.log("this is mu currentUser:",currentUser)
  console.log(
    `this is my currentUser info id from profilePage ${currentUser.userInfo.id}`
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const res = await api.put(`/users/${currentUser.userInfo.id}`, {
        username,
        email,
        password,
        avatar: avatar[0],
      });
      console.log("this si my response data from  profileUpdatePage", res.data);
      updateUser((prev) => ({ ...prev, userInfo: res.data.userInfo }));
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.log();
      setError(error.response.data.message);
    }
  };
  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.userInfo.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.userInfo.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={avatar[0] || currentUser.avatar || "user.png"}
          alt=""
          className="avatar"
        />
        <UploadWidget
          uwfConfig={{
            cloudName: import.meta.env.VITE_CLOUDNAME,
            uploadPreset: import.meta.env.VITE_UPLOADPRESET,
            maxImageFileSize: 90000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default ProfileUpdatePage;

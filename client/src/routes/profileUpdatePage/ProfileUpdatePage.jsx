import "./profileUpdatePage.scss";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import createAxios from "../../libs/axios";
import CloudinaryUploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState([]);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    console.log("form updation is working ");

    try {
      //Make Api call to end point
      const res = await createAxios.put(`/users/edit/${currentUser.id}`, {
        username,
        email,
        password,
        avatar: avatar[0] || currentUser.avatar,

        // avatar: avatar,
      });
      //
      updateUser(res.data && res.data.userInfo);
      navigate("/profile");
      console.log(
        "this is updated data from user",
        res.data
        //&&
        // res.data.userInfo
      );
    } catch (error) {
      console.log(error);
      // setError(error.response.data.messsage);
      setError(error.response?.data?.message || "Something went wrong");
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
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="enter a password"
            />
          </div>
          <button>Update</button>
          {error && <span>error</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={avatar[0] || currentUser.avatar || "/user.png"}
          alt=""
          className="avatar"
        />
        <CloudinaryUploadWidget
          uwConfig={{
            cloudName: "dgjg8ob5b",
            uploadPreset: "estate",
            muitiple: false,
            maxImageFileSize: 9000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;

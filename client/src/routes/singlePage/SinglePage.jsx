import "./singlepage.scss";
import Slider from "../../components/Slider/Slider";
import Map from "../../components/map/Map";
import Dompurify from "dompurify";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import createAxios from "../../libs/axios";

function SinglePage() {
  // Fetching data from the database
  const { currentUser } = useContext(AuthContext);
  const post = useLoaderData();
  const navigate = useNavigate();

  // Set initial saved state from post.isSaved
  const [saved, setSaved] = useState(post.isSaved);

  const handleSave = async () => {
    // Toggle saved state optimistically
    setSaved((prev) => !prev);

    // If no current user, redirect to login page
    if (!currentUser) {
      return navigate("/login");
    }

    try {
      await createAxios.post("/users/save", { postId: post.id });
    } catch (error) {
      // Revert saved state on error
      setSaved((prev) => !prev);
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="address pin" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="user avatar" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: Dompurify.sanitize(
                  post.postDetail?.desc || "No description available"
                ),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="utilities" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail?.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="pet policy" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail?.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="income policy" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail?.income || "N/A"}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="size" />
              <span>{post.postDetail?.size || 0} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="bedrooms" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="bathrooms" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="school" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail?.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail?.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="pet policy" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail?.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="restaurant" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail?.restaurant || "N/A"} m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button>
              <img src="/chat.png" alt="chat" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "yellow" : "white",
                cursor: "pointer",
              }}
            >
              <img src="/save.png" alt="save" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;

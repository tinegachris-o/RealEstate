import "./card.scss";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

function Card({ item }) {
  return (
    <div className="card">
      
      <Link className="imageContainer" to={`/${item.id}`}>
        <img src={item.images[0]} alt="image" />
        
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">{item.price}</p>
        <div className="bottom">
          <div className="feature">
            <img src='/bed.png' alt="bed" />
            <hr />
            <span>{item.bedroom} bedroom</span>
          </div>
          <div className="feature">
            <img src="/bath.png" alt="bed" />

            <span>{item.bathroom} bathroom</span>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="save"/>
            </div>
            <div className="icon">
              <img src="/chat.png" alt=""/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;

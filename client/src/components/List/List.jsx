import { listData } from "../../libs/dummyData";
import Card from "../Card/Card";
import "./list.scss";

function List({ posts }) {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default List;

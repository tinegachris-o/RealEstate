import createAxios from "./axios";
import { defer } from "react-router-dom";
export const singlePageLoader = async ({ request, params }) => {
  const res = await createAxios("/posts/" + params.id);
  return res.data;
};
export const listPageLoader = async ({ request, params }) => {
  console.log("this si listPageLoader:", request);
  //
  const query = request.url.split("?")[1];
  const postPromise = createAxios("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};
///profilePageLoader
export const profilePageLoader = async () => {
  const postPromise = createAxios("/users/profilePosts");
  const chatPromise= createAxios("/chats")
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise
  });
};

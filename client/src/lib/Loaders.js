import { defer } from "react-router-dom";
import api from "../lib/axios";
export const singlePageLoader = async ({ request, params }) => {
  const res = await api("/posts/" + params.id);
  return res.data;
};
export const listPageLoader = async ({ request, params }) => {
  //console.log("this is my request from listPageLoader", request);
  const query = request.url.split("?")[1];
  const postPromise = api("/posts?" + query);
  return defer({ postResponse: postPromise });
};
export const profilePageLoader = async () => {
  const postPromise = api("/users/profilePosts");
  const chatPromise = api("/chats");
  return defer({ postResponse: postPromise, chatResponse: chatPromise });
};

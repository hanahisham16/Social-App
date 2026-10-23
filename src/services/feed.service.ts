import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export async function getUserFeed(page = 1, limit = 10) {
  const data = await axios.get(
    `${baseUrl}/posts?page=${page}&limit=${limit}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("userToken")}`
      },
    },
  );
  return data;
}
export async function getMyFeed(page = 1, limit = 10) {
  return axios.get(
    `${baseUrl}/posts/feed?only=me&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
}

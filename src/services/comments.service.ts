import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export async function getPostComments(postId: string) {
  const data = await axios.get(`${baseUrl}/posts/${postId}/comments`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
  return data;
}
export async function creatPostComment(postId: string, formData: FormData) {
  const data = await axios.post(
    `${baseUrl}/posts/${postId}/comments`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
  return data;
}
export async function updatePostComment(
  postId: string,
  commentId: string,
  formData: FormData,
) {
  return axios.put(
    `${baseUrl}/posts/${postId}/comments/${commentId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
}

export async function deletePostComment(postId: string, commentId: string) {
  return axios.delete(`${baseUrl}/posts/${postId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}
export async function LikeComment(postId: string, commentId: string) {
  return axios.put(
    `${baseUrl}/posts/${postId}/comments/${commentId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
}

import axios from "axios";
import type { ChangePasswordSchemaType } from "../lib/Schemas/Auth.Schema";
const baseUrl = import.meta.env.VITE_BASE_URL;

export async function changePassword(formData: ChangePasswordSchemaType) {
  const { data } = await axios.patch(
    `${baseUrl}/users/change-password`,
    {
      password: formData.password,
      newPassword: formData.newPassword,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );

  return data;
}

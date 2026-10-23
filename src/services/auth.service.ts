import axios from "axios";
import type {
  LoginSchemaType,
  RegisterSchemaType,
} from "../lib/Schemas/Auth.Schema";

const baseUrl = import.meta.env.VITE_BASE_URL;

export async function registerUser(formData: RegisterSchemaType) {
  const data = await axios.post(
    `${baseUrl}/users/signup`,
    formData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return data;
}
export async function loginUser(formData: LoginSchemaType) {
  const data = await axios.post(`${baseUrl}/users/signin`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
}




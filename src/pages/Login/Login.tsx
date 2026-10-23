import { Button, Spinner } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { InputGroup, TextField, FieldError } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  loginSchema,
  type LoginSchemaType,
} from "../../lib/Schemas/Auth.Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginUser } from "../../services/auth.service";
import axios from "axios";
import { useContext } from "react";
import { TokenContext } from "../../components/context/tokenContext";

function Login() {
  const navigate = useNavigate();
const {setToken}= useContext(TokenContext)
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function submitData(values: LoginSchemaType) {
    try {
      const response = await loginUser(values);
      localStorage.setItem("userToken", response.data.data.token);
      setToken(response.data.data.token)
      toast.success(response.data.message, {
        position: "top-right",
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message, {
          position: "top-right",
        });
      }
    }
  }
  return (
    <>
      <>
        <section className="rounded-2xl bg-white p-4 sm:p-6">
          <div className="lg:hidden text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#00298d]">
              Route Posts
            </h2>
            <p className="mt-1 mb-4 text-base font-medium leading-snug text-slate-700">
              Connect with friends and the world around you on Route Posts.
            </p>
          </div>
          <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <NavLink
              to="/auth/login"
              className={({ isActive }) =>
                `rounded-lg py-2 text-sm text-center font-extrabold transition ${
                  isActive
                    ? "bg-white text-[#00298d] shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`
              }
            >
              Login
            </NavLink>{" "}
            <NavLink
              to="/auth/register"
              className={({ isActive }) =>
                `rounded-lg py-2 text-center text-sm font-extrabold transition ${
                  isActive
                    ? "bg-white text-[#00298d] shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`
              }
            >
              Register
            </NavLink>
          </div>
          <h1 className="text-main text-2xl font-black">
            Log in to Route Posts
          </h1>
          <p>Log in and continue your social journey.</p>
          <form onSubmit={handleSubmit(submitData)} className="space-y-4 pt-4">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  isInvalid={Boolean(errors.email)}
                  className="w-full"
                  aria-label="Email address"
                >
                  <InputGroup
                    className="bg-[#F8FAFC] focus-within:bg-white py-3 "
                    {...field}
                  >
                    <InputGroup.Prefix>
                      <Icon icon="basil:at-sign-outline" width="20" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      className="w-full p-0  bg-transparent"
                      placeholder="Email or username"
                      aria-label="Email address"
                    />
                  </InputGroup>
                  <FieldError>{errors.email?.message}</FieldError>
                </TextField>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  isInvalid={Boolean(errors.password)}
                  className="w-full"
                  aria-label="password"
                >
                  <InputGroup
                    className="bg-[#F8FAFC] pe-3 focus-within:bg-white py-3 "
                    {...field}
                  >
                    <InputGroup.Prefix>
                      <Icon icon="akar-icons:key" width="20" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      className="w-full p-0  bg-transparent"
                      aria-label="password"
                      type="password"
                      placeholder="Password"
                    />
                  </InputGroup>
                  <FieldError>{errors.password?.message}</FieldError>
                </TextField>
              )}
            />
            <Button
              type="submit"
              className="w-full py-6 px-0 rounded-xl text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-main"
            >
              {isSubmitting ? (
                <div className="flex gap-2">
                  <Spinner className="text-white" />
                  <p>loading.....</p>
                </div>
              ) : (
                "Log In"
              )}
            </Button>

            <button className="cursor-pointer mx-auto block text-sm font-semibold text-[#00298d] transition hover:underline">
              Forgot password?
            </button>
          </form>
        </section>
      </>
    </>
  );
}

export default Login;

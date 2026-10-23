import { Button, Spinner } from "@heroui/react";
import { ListBox, Select, FieldError } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";
import { InputGroup, TextField } from "@heroui/react";
import { Icon } from "@iconify/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchemaType,
} from "../../lib/Schemas/Auth.Schema";
import { registerUser } from "../../services/auth.service";
import axios from "axios";
import toast from "react-hot-toast";

function Register() {
 const navigate= useNavigate()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
  });
  async function submitData(values: RegisterSchemaType) {
    try {
      const response = await registerUser(values);
      toast.success(response.data.message ,{
        position:"top-right"
      });
      setTimeout(()=>{
      navigate("/auth/login")

      },1500)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ,{
        position:"top-right"
      });
      }
    }
  }

  return (
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
              `rounded-lg py-2 text-sm text-center font-extrabold transition ${isActive ? "bg-white text-[#00298d] shadow-sm" : "text-slate-600 hover:text-slate-800"}`
            }
          >
            Login
          </NavLink>{" "}
          <NavLink
            to="/auth/register"
            className={({ isActive }) =>
              `rounded-lg py-2 text-center text-sm font-extrabold transition ${isActive ? "bg-white text-[#00298d] shadow-sm" : "text-slate-600 hover:text-slate-800"}`
            }
          >
            Register
          </NavLink>
        </div>
        <h1 className="text-main text-2xl font-black">Creat a new account</h1>
        <p>it is quick and easy</p>
        <form onSubmit={handleSubmit(submitData)} className="space-y-4 pt-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                className="w-full"
                isInvalid={Boolean(errors.name)}
                aria-label="FullName"
              >
                <InputGroup
                  className="bg-[#F8FAFC] focus-within:bg-white py-3 "
                  {...field}
                >
                  <InputGroup.Prefix>
                    <Icon icon="ant-design:user-outlined" width="20" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    className="w-full p-0  bg-transparent"
                    placeholder="Full Name"
                    aria-label="FullName"
                  />
                </InputGroup>
                <FieldError>{errors.name?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                className="w-full"
                isInvalid={Boolean(errors.username)}
                aria-label="UserName"
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
                    placeholder="Username (optional)"
                    aria-label="UserName"
                  />
                </InputGroup>
                <FieldError>{errors.username?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                className="w-full"
                isInvalid={Boolean(errors.email)}
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
                    placeholder="name@email.com"
                    aria-label="Email address"
                  />
                </InputGroup>
                <FieldError>{errors.email?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <TextField
                className="w-full"
                isInvalid={Boolean(errors.gender)}
                aria-label="Email address"
              >
                <div className="relative w-full">
                  <Icon
                    icon="cuida:users-outline"
                    width="20"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 z-10"
                  />

                  <Select
                    {...field}
                    aria-label="Gender"
                    placeholder="Select gender"
                    className="w-full"
                  >
                    <Select.Trigger className="w-full flex items-center justify-between rounded-xl border-0 bg-[#F8FAFC] py-3 pl-11 pr-4 text-sm text-black outline-none transition focus-within:bg-white focus:bg-white focus:border-[#0485f7]">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>

                    <Select.Popover>
                      <ListBox className="text-black">
                        <ListBox.Item
                          textValue="Select gender"
                          className="text-slate-400 cursor-not-allowed p-2.5 select-none pointer-events-none"
                        >
                          Select gender
                        </ListBox.Item>
                        <ListBox.Item
                          id="female"
                          textValue="female"
                          className="text-black cursor-pointer p-2"
                        >
                          Female
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item
                          id="male"
                          textValue="male"
                          className="text-black cursor-pointer p-2"
                        >
                          Male
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
                <FieldError>{errors.gender?.message}</FieldError>
              </TextField>
            )}
          />

          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <TextField
                className="w-full"
                isInvalid={Boolean(errors.dateOfBirth)}
                aria-label="date"
              >
                <InputGroup
                  className="bg-[#F8FAFC] pe-3 focus-within:bg-white py-3 "
                  {...field}
                >
                  <InputGroup.Prefix>
                    <Icon icon="akar-icons:calendar" width="20" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    className="w-full p-0  bg-transparent"
                    aria-label="date"
                    type="date"
                  />
                </InputGroup>
                <FieldError>{errors.dateOfBirth?.message}</FieldError>
              </TextField>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                className="w-full"
                isInvalid={Boolean(errors.password)}
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
                    className="w-full p-0 bg-transparent"
                    aria-label="password"
                    type="password"
                    placeholder="Password"
                  />
                </InputGroup>
                <FieldError>{errors.password?.message}</FieldError>
              </TextField>
            )}
          />
          <Controller
            name="rePassword"
            control={control}
            render={({ field }) => (
              <TextField
                className="w-full"
                isInvalid={Boolean(errors.rePassword)}
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
                    placeholder="Confirm Password"
                  />
                </InputGroup>
                <FieldError>{errors.rePassword?.message}</FieldError>
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
              "Creat New Account"
            )}
          </Button>
        </form>
      </section>
    </>
  );
}

export default Register;

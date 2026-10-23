import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import {
  changePasswordSchema,
  type ChangePasswordSchemaType,
} from "../../lib/Schemas/Auth.Schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "../../services/repassword";

export default function Settings() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ChangePasswordSchemaType>({
    mode: "onChange",
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (formData: ChangePasswordSchemaType) => {
    try {
      const response = await changePassword(formData);
      toast.success(response.data?.message || "Password changed successfully!");
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5">
      <div className="min-w-0">
        <div className="mx-auto max-w-2xl">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
                <Icon icon="akar-icons:key" height={16} width={16} />
              </span>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  Change Password
                </h1>
                <p className="text-sm text-slate-500">
                  Keep your account secure by using a strong password.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">
                  Current password
                </label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#1877f2] focus:bg-white focus:ring-2 focus:ring-[#1877f2]/20"
                />
                {errors.password && (
                  <p className="text-xs text-rose-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">
                  New password
                </label>
                <input
                  type="password"
                  {...register("newPassword")}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#1877f2] focus:bg-white focus:ring-2 focus:ring-[#1877f2]/20"
                />
                <p className="text-xs text-slate-500 mt-1">
                  At least 8 characters with uppercase, lowercase, number, and
                  special character.
                </p>
                {errors.newPassword && (
                  <p className="text-xs text-rose-600 mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">
                  Confirm new password
                </label>
                <input
                  type="password"
                  {...register("rePassword")}
                  placeholder="Re-enter new password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-[#1877f2] focus:bg-white focus:ring-2 focus:ring-[#1877f2]/20"
                />
                {errors.rePassword && (
                  <p className="text-xs text-rose-600 mt-1">
                    {errors.rePassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || isSubmitting || !isDirty}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#1877f2] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && (
                  <Icon
                    icon="lucide:loader-circle"
                    className="animate-spin mr-2"
                    width={18}
                    height={18}
                  />
                )}
                {isSubmitting ? "Updating..." : "Update password"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

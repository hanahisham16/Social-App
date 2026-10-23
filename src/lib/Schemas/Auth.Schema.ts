import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("Full name is required.")
      .min(2, "Name must be at least 2 characters."),
    username: z
      .string()
      .regex(/^[a-z0-9_]{3,30}$/, "Username must be 3-30 chars (a-z, 0-9, _).")
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .nonempty("Email is required.")
      .email("Please enter a valid email address."),
    dateOfBirth: z
      .string()
      .nonempty("Date of birth is required.")
      .refine((date) => {
        const currentYear = new Date().getFullYear();
        const userYear = new Date(date).getFullYear();
        const age = currentYear - userYear;
        return age >= 14;
      }, "User must be older than 14"),
    gender: z.string().nonempty("Gender is required."),
    password: z
      .string()
      .nonempty("Password is required.")
      .min(8, "Password must be at least 8 characters long.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must include uppercase, lowercase, number, and special character.",
      ),
    rePassword: z.string().nonempty("Please confirm your password."),
  })
  .refine(
    (data) => {
      return data.password === data.rePassword;
    },
    { path: ["rePassword"], message: "Passwords do not match." },
  );

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email or username is required.")
    .email("Please enter a valid email address.")
    .or(
      z
        .string()
        .regex(
          /^[a-z0-9_]{3,30}$/,
          "Username must be 3-30 chars (a-z, 0-9, _).",
        ),
    ),
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must include uppercase, lowercase, number, and special character.",
    ),
});
export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .nonempty("Current password is required.")
      .min(8, "Password must be at least 8 characters long."),
      
    newPassword: z
      .string()
      .nonempty("New password is required.")
      .min(8, "Password must be at least 8 characters long.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must include uppercase, lowercase, number, and special character.",
      ),
      
    rePassword: z.string().nonempty("Please confirm your new password."),
  })
  .refine(
    (data) => data.newPassword === data.rePassword,
    { path: ["rePassword"], message: "Passwords do not match." }
  );

  
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;

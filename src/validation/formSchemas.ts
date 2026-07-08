import * as Yup from "yup";

const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const passwordRegex = /^.{6,}$/;
const otpRegex = /^\d{6}$/;
const taskTitleRegex = /^[A-Za-z0-9][A-Za-z0-9\s.,'!?()#&-]{2,79}$/;

const email = Yup.string()
  .trim()
  .required("Email is required")
  .matches(emailRegex, "Enter a valid email address");

const strongPassword = Yup.string()
  .required("Password is required")
  .matches(passwordRegex, "Password must be at least 6 characters");

export const loginSchema = Yup.object({
  email,
  password: Yup.string().required("Password is required"),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .matches(nameRegex, "Use 2-50 letters, spaces, dot, apostrophe or hyphen"),
  email,
  password: strongPassword,
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export const forgotPasswordSchema = Yup.object({
  email,
});

export const verifyUserSchema = Yup.object({
  email,
  otp: Yup.string()
    .trim()
    .required("OTP is required")
    .matches(otpRegex, "OTP must be 6 digits"),
});

export const resetPasswordSchema = Yup.object({
  email,
  otp: Yup.string()
    .trim()
    .required("OTP is required")
    .matches(otpRegex, "OTP must be 6 digits"),
  newPassword: strongPassword,
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

export const profileSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .matches(nameRegex, "Use 2-50 letters, spaces, dot, apostrophe or hyphen"),
  email,
});

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: strongPassword,
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

export const taskSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Task title is required")
    .matches(taskTitleRegex, "Use 3-80 letters, numbers or common punctuation"),
  description: Yup.string()
    .trim()
    .max(500, "Description must be 500 characters or less"),
  status: Yup.string()
    .oneOf(["pending", "completed"], "Choose a valid status")
    .required("Status is required"),
  priority: Yup.string()
    .oneOf(["low", "medium", "high"], "Choose a valid priority")
    .required("Priority is required"),
  dueDate: Yup.string(),
});

import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mail,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import AuthBox from "./AuthBox";
import { clearAuthMessage, resetPassword } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useToast } from "../../components/ToastProvider";

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const { loading, message, error } = useAppSelector((state) => state.auth);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    email: searchParams.get("email") || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearAuthMessage());
    }

    if (error) {
      toast.error(error);
      dispatch(clearAuthMessage());
    }
  }, [dispatch, error, message, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(resetPassword(form));

    if (resetPassword.fulfilled.match(result)) {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <AuthBox>
      <Link to="/login" className="mb-6 inline-flex items-center gap-2 font-medium">
        <ArrowLeft size={18} />
        Back to Login
      </Link>

      <h1 className="text-4xl font-bold mb-3">Reset password</h1>
      <p className="text-xl mb-8">Enter OTP and create a new password.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2" size={20} />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full h-14 rounded-xl bg-white pl-12 pr-4 outline-none"
          />
        </div>

        <div className="relative">
          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2" size={20} />
          <input
            name="otp"
            placeholder="OTP"
            value={form.otp}
            onChange={handleChange}
            className="w-full h-14 rounded-xl bg-white pl-12 pr-4 outline-none"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={20} />
          <input
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full h-14 rounded-xl bg-white pl-12 pr-12 outline-none"
          />

          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={20} />
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full h-14 rounded-xl bg-white pl-12 pr-12 outline-none"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-xl bg-black text-white font-semibold flex items-center justify-center gap-2"
        >
          <KeyRound size={20} />
          {loading ? "Resetting..." : "Reset Password"}
          <ArrowRight size={18} />
        </button>
      </form>
    </AuthBox>
  );
};

export default ResetPassword;

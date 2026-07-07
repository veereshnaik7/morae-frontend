import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import AuthBox from "./AuthBox";
import { forgotPassword } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, message, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword({ email }));

    if (forgotPassword.fulfilled.match(result)) {
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 800);
    }
  };

  return (
    <AuthBox>
      <Link to="/login" className="mb-6 inline-flex items-center gap-2 font-medium">
        <ArrowLeft size={18} />
        Back to Login
      </Link>

      <h1 className="text-4xl font-bold mb-3">Forgot password</h1>
      <p className="text-xl mb-8">Enter your email to receive OTP.</p>

      {message && <p className="mb-4 text-green-700 font-medium">{message}</p>}
      {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2" size={20} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 rounded-xl bg-white pl-12 pr-4 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-xl bg-black text-white font-semibold flex items-center justify-center gap-2"
        >
        
          {loading ? "Sending..." : "Send OTP"}
          <ArrowRight size={18} />
        </button>
      </form>

      <Link
        to="/login"
        className="mt-6 inline-flex items-center gap-2 font-medium"
      >
       Login <ArrowRight size={18} />
      </Link>
    </AuthBox>
  );
};

export default ForgotPassword;

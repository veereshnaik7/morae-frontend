import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthBox from "./AuthBox";
import { loginUser } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      navigate("/tasks");
    }
  };

  return (
    <AuthBox>
      <h1 className="text-4xl font-bold mb-3">Welcome back</h1>
      <p className="text-xl mb-8">Login to continue your account.</p>

      {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}

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
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={20} />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full h-14 rounded-xl bg-white pl-12 pr-12 outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-xl bg-black text-white font-semibold flex items-center justify-center gap-2"
        >
         
          {loading ? "Logging in..." : "Login"}
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="mt-6 flex justify-between text-sm font-medium">
        <Link to="/forgot-password" className="flex items-center gap-1">
          Forgot Password <ArrowRight size={16} />
        </Link>

        <Link to="/register" className="flex items-center gap-1">
          Create Account <ArrowRight size={16} />
        </Link>
      </div>
    </AuthBox>
  );
};

export default Login;

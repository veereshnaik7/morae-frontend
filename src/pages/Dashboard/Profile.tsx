import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../features/api";
import { logoutUser } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Profile = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authUser = useAppSelector((state) => state.auth.user);

    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const profileRes = await api.get("/users/me");

            setProfileForm({
                name: profileRes.data.data?.name || "",
                email: profileRes.data.data?.email || authUser?.email || "",
            });
        } catch (err: any) {
            setError(err.response?.data?.error || "Could not load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            await api.patch("/users/update", profileForm);

            setMessage("Profile updated");
        } catch (err: any) {
            setError(err.response?.data?.error || "Could not update profile");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const res = await api.post("/auth/change-password", passwordForm);

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setPasswordModalOpen(false);
            setMessage(res.data.message || "Password changed");

            setTimeout(async () => {
                await dispatch(logoutUser());
                navigate("/login", { replace: true });
            }, 900);
        } catch (err: any) {
            setError(err.response?.data?.error || "Could not change password");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-8">
                {error && (
                    <p className="mb-4 w-full max-w-xl rounded-md bg-red-50 px-4 py-3 text-red-700">
                        {error}
                    </p>
                )}

                {message && (
                    <p className="mb-4 w-full max-w-xl rounded-md bg-green-50 px-4 py-3 text-green-700">
                        {message}
                    </p>
                )}

                {loading ? (
                    <div className="w-full max-w-xl rounded-md bg-white p-6 text-center font-medium">
                        Loading...
                    </div>
                ) : (
                    <form
                        onSubmit={handleProfileSubmit}
                        className="w-full max-w-xl space-y-4 rounded-md bg-white p-5 pt-12"
                    >
                        <h2 className="text-center text-2xl font-bold underline">
                            Profile Details
                        </h2>

                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Name
                            </label>
                            <input
                                value={profileForm.name}
                                onChange={(e) =>
                                    setProfileForm({
                                        ...profileForm,
                                        name: e.target.value,
                                    })
                                }
                                className="h-12 w-full rounded-md border border-neutral-200 px-3 outline-none focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold">
                                Email
                            </label>
                            <input
                                type="email"
                                value={profileForm.email}
                                onChange={(e) =>
                                    setProfileForm({
                                        ...profileForm,
                                        email: e.target.value,
                                    })
                                }
                                className="h-12 w-full rounded-md border border-neutral-200 px-3 outline-none focus:border-black"
                            />
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                            <button
                                type="button"
                                onClick={() => {
                                    setError("");
                                    setMessage("");
                                    setPasswordModalOpen(true);
                                }}
                                className="h-12 rounded-md border border-black px-5 font-semibold text-black transition hover:bg-black hover:text-white"
                            >
                                Change Password
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="h-12 rounded-md bg-black px-5 font-semibold text-white disabled:opacity-60 sm:min-w-40"
                            >
                                {saving ? "Saving..." : "Save Profile"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {passwordModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6 backdrop-blur-sm">
                    <form
                        onSubmit={handlePasswordSubmit}
                        className="w-full max-w-md overflow-hidden rounded-md bg-white shadow-lg"
                    >
                        <div className="flex items-center justify-between bg-lime-300 px-5 py-4">
                            <h3 className="text-xl font-black text-black">
                                Change Password
                            </h3>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="grid h-10 w-10 place-items-center rounded-full bg-black/30 text-white"
                                >
                                    {showPasswords ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPasswordModalOpen(false)}
                                    className="grid h-10 w-10 place-items-center rounded-full bg-black/30 text-white"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 p-5">
                            {(
                                [
                                    "currentPassword",
                                    "newPassword",
                                    "confirmPassword",
                                ] as const
                            ).map((field) => (
                                <div key={field}>
                                    <label className="mb-2 block text-sm font-bold">
                                        {field === "currentPassword"
                                            ? "Current Password"
                                            : field === "newPassword"
                                            ? "New Password"
                                            : "Confirm Password"}
                                    </label>

                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                                            size={18}
                                        />

                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            value={passwordForm[field]}
                                            onChange={(e) =>
                                                setPasswordForm({
                                                    ...passwordForm,
                                                    [field]: e.target.value,
                                                })
                                            }
                                            className="h-12 w-full rounded-md border border-black/10 bg-neutral-50 px-4 pl-10 outline-none focus:border-black"
                                            required
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                                <button
                                    type="button"
                                    onClick={() => setPasswordModalOpen(false)}
                                    className="h-12 rounded-md border border-black px-6 font-bold"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex h-12 items-center justify-center gap-2 rounded-md bg-black px-6 font-bold text-white disabled:opacity-60"
                                >
                                    <Lock size={18} />
                                    {saving ? "Changing..." : "Change Password"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Profile;
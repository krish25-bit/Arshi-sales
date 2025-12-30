import { useState } from "react";

import Link from "next/link";
import Layout from "../components/Layout";
import Popup from "../components/Popup";
import GoogleLoginButton from "../components/googleloginbutton";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState({ message: "", type: "" });
  const router = useRouter();

  // NORMAL EMAIL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setPopup({ message: "Login successful!", type: "success" });
        setTimeout(() => router.push("/"), 1500);
      } else {
        setPopup({ message: data.message, type: "error" });
      }
    } catch (err) {
      setPopup({ message: "Something went wrong", type: "error" });
    }
  };



  return (
    <Layout>
      <Popup
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ message: "", type: "" })}
      />

      <div className="max-w-md mx-auto p-8 mt-10 border rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        {/* GOOGLE LOGIN BUTTON */}
        {/* GOOGLE LOGIN BUTTON */}
        <div className="flex justify-center mb-6">
          <GoogleLoginButton />
        </div>

        <div className="text-center text-gray-400 mb-4">OR</div>

        {/* EMAIL LOGIN FORM */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 border rounded"
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-2 p-3 border rounded"
            required
          />

          <div className="text-right mb-4">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-4">
          New user? <Link href="/signup">Create account</Link>
        </p>
      </div>
    </Layout>
  );
}

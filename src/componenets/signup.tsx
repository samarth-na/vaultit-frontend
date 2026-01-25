import { useState } from "react";
import { apiRequest } from "../lib/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Signup request started");

    try {
      // Make API request to signup endpoint
      const res = await apiRequest("/auth/sign-up/email", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      });

      console.log("Signup response:", res.status, res.ok);

      if (!res.ok) {
        throw new Error("Signup failed. Please check your details.");
      }

      const data = await res.json();
      console.log("Signup successful:", data);

      // signup successful
      // later you can navigate("/") here
      alert("signed up successfully");
    } catch (err: any) {
      console.log("Signup error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl  text-slate-900 font-serif">sign up</h1>
          <a href="/signin" className="text-sm text-blue-600 hover:underline">
            sign-in
          </a>
        </div>

        <p className="text-slate-600 text-sm mb-6">
          Enter your email below to sign up to your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-900">
                Password
              </label>
              <a href="#" className="text-sm text-slate-500 hover:underline">
                Forgot your password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Error */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "signing up..." : "sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}

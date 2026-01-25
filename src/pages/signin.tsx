import { useState } from "react";
import { apiRequest } from "../lib/api";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Signin request started");

    try {
      // Make API request to signin endpoint
      const res = await apiRequest("/auth/sign-in/email", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      console.log("Signin response:", res.status, res.ok);

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }
      
      const data = await res.json();
      console.log("Signin successful:", data);
      
      // signin successful
      // later you can navigate("/") here
      alert("signed in");
    } catch (err: any) {
      console.log("Signin error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className=" rounded-lg text-6xl mb-10 font-serif text-cyan-600 font-semibold">
        Vaultit
      </div>
      <div className=" flex items-center justify-center bg-yellow-50 px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl  text-slate-900 font-serif">
              signin to your account
            </h1>
            <a
              href="/signup"
              className="text-sm text-cyan-500  hover:underline "
            >
              Sign Up
            </a>
          </div>

          <p className="text-slate-600 text-sm mb-6">
            Enter your email below to signin to your account
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
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
                <a href="#" className="text-sm text-cyan-500 hover:underline">
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

            {/* Error */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-cyan-600 text-white py-2 text-sm font-medium hover:bg-cyan-800 disabled:opacity-60"
            >
              {loading ? "signing in..." : "signin"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

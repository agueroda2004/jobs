import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../shared/auth";
import { EyeIcon, EyeOffIcon } from "../../../components/ui/icons";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    const ok = await login(username, password);
    setSubmitting(false);
    if (ok) {
      navigate("/");
    } else {
      setError("Incorrect username or password");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Jobs
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Sign in to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          noValidate
        >
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="your-username"
              autoComplete="username"
              required
              className="h-11 w-full rounded-xl border-2 border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="h-11 w-full rounded-xl border-2 border-neutral-200 bg-white px-4 pr-11 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-800"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

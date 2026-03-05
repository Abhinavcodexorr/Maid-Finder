"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveSession } from "@/lib/auth-mock";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { api, apiRoutes, ApiError } from "@/lib/api-client";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormValues = z.infer<typeof schema>;

export default function CustomerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setApiError(null);
    const redirectTo = searchParams.get("redirect");
    const safeRedirect = redirectTo && redirectTo.startsWith("/") ? redirectTo : null;

    try {
      const result = await api.post<{
        success: boolean;
        token: string;
        user?: { fullName?: string; email?: string };
      }>(apiRoutes.user.login, {
        email: values.email.trim(),
        password: values.password,
      });

      saveSession(result?.user?.fullName || "Customer User", result?.user?.email || values.email, "customer", {
        token: result?.token,
      });
      router.push(safeRedirect || "/profile/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Unable to login. Please try again.");
      }
    }
  };

  return (
    <section className="mx-auto mt-10 max-w-md px-4 sm:px-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900">Customer Login</h1>
        <p className="mt-1 text-sm text-slate-600">Sign in to your customer account.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-semibold">Email Address</label>
            <input className="field" type="email" {...register("email")} />
            {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Password</label>
            <input className="field" type="password" {...register("password")} />
            {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
          </div>
          {apiError ? <p className="mt-1 text-xs text-red-600">{apiError}</p> : null}
          <button className="btn btn-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Sign In as Customer"}
          </button>
        </form>

        <button className="btn btn-soft mt-3 w-full" type="button">
          Sign in with Google
        </button>

        <div className="mt-4 text-center text-sm">
          <Link href="/register" className="text-brand hover:underline">
            Register as Customer
          </Link>
          <span className="mx-2 text-slate-300">|</span>
          <Link href="/maid-login" className="text-brand hover:underline">
            Maid Login
          </Link>
        </div>
      </div>
    </section>
  );
}

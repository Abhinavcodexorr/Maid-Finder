"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { api, apiRoutes, ApiError } from "@/lib/api-client";
import { saveSession } from "@/lib/auth-mock";
import { useSearchParams } from "next/navigation";

const schema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(8, "Please enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function CustomerRegisterPage() {
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
        token?: string;
        user?: { fullName?: string; email?: string };
      }>(apiRoutes.user.register, {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
      });

      if (result?.token) {
        saveSession(result?.user?.fullName || values.fullName, result?.user?.email || values.email, "customer", {
          token: result.token,
        });
        router.push(safeRedirect || "/profile/dashboard");
      } else {
        router.push(safeRedirect ? `/login?redirect=${encodeURIComponent(safeRedirect)}` : "/login");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Unable to register. Please try again.");
      }
    }
  };

  return (
    <section className="mx-auto mt-10 max-w-2xl px-4 sm:px-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900">Customer Registration</h1>
        <p className="mt-1 text-sm text-slate-600">Create your customer account.</p>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-semibold">Full Name</label>
            <input className="field" {...register("fullName")} />
            {errors.fullName ? <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Email Address</label>
            <input className="field" type="email" {...register("email")} />
            {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Phone Number</label>
            <input className="field" {...register("phone")} />
            {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Password</label>
            <input className="field" type="password" {...register("password")} />
            {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold">Confirm Password</label>
            <input className="field" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword ? (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
            ) : null}
          </div>
          <div className="md:col-span-2">
            {apiError ? <p className="mb-2 text-xs text-red-600">{apiError}</p> : null}
            <button className="btn btn-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating account..." : "Register as Customer"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="text-brand hover:underline">
            Already have account? Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

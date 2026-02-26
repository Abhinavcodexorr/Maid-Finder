"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveSession } from "@/lib/auth-mock";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormValues = z.infer<typeof schema>;

export default function MaidLoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    saveSession("Maid User", values.email, "maid");
    router.push("/profile/dashboard");
  };

  return (
    <section className="mx-auto mt-10 max-w-md px-4 sm:px-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900">Maid Login</h1>
        <p className="mt-1 text-sm text-slate-600">Sign in to your maid account.</p>

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
          <button className="btn btn-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Sign In as Maid"}
          </button>
        </form>

        <button className="btn btn-soft mt-3 w-full" type="button">
          Sign in with Google
        </button>

        <div className="mt-4 text-center text-sm">
          <Link href="/maid-register" className="text-brand hover:underline">
            Register as Maid
          </Link>
          <span className="mx-2 text-slate-300">|</span>
          <Link href="/login" className="text-brand hover:underline">
            Customer Login
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EMIRATES, NATIONALITIES, VISA_STATUS } from "@/lib/constants";

const schema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    gender: z.enum(["female", "male"], { message: "Select gender" }),
    nationality: z.string().min(2, "Nationality is required"),
    emirate: z.string().min(2, "Emirate is required"),
    visaStatus: z.string().min(2, "Visa status is required"),
    visaExpiryDate: z.string().min(1, "Visa expiry date is required"),
    mobileNumber: z.string().regex(/^\d{9}$/, "Mobile number must be 9 digits"),
    whatsappNumber: z.string().regex(/^\d{9}$/, "WhatsApp number must be 9 digits"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function MaidRegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 900));
    router.push("/maid-login");
  };

  return (
    <section className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900">Register as Maid</h1>
        <p className="mt-1 text-sm text-slate-600">Create your maid profile with complete information.</p>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full Name" error={errors.fullName?.message}>
            <input className="field" {...register("fullName")} />
          </Input>
          <Input label="Gender" error={errors.gender?.message}>
            <select className="field" {...register("gender")}>
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </Input>
          <Input label="Nationality" error={errors.nationality?.message}>
            <select className="field" {...register("nationality")}>
              <option value="">Select Nationality</option>
              {NATIONALITIES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Input>
          <Input label="Emirate" error={errors.emirate?.message}>
            <select className="field" {...register("emirate")}>
              <option value="">Select Emirate</option>
              {EMIRATES.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </Input>
          <Input label="Visa Status" error={errors.visaStatus?.message}>
            <select className="field" {...register("visaStatus")}>
              <option value="">Select Visa Status</option>
              {VISA_STATUS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Input>
          <Input label="Visa Expiry Date" error={errors.visaExpiryDate?.message}>
            <input className="field" type="date" {...register("visaExpiryDate")} />
          </Input>
          <Input label="Mobile Number" error={errors.mobileNumber?.message} hint="Prefix +971">
            <input className="field" placeholder="50 123 4567" {...register("mobileNumber")} />
          </Input>
          <Input label="WhatsApp Number" error={errors.whatsappNumber?.message} hint="Prefix +971">
            <input className="field" placeholder="50 123 4567" {...register("whatsappNumber")} />
          </Input>
          <Input label="Email Address" error={errors.email?.message}>
            <input className="field" type="email" {...register("email")} />
          </Input>
          <Input label="Password" error={errors.password?.message}>
            <input className="field" type="password" {...register("password")} />
          </Input>
          <Input label="Confirm Password" error={errors.confirmPassword?.message}>
            <input className="field" type="password" {...register("confirmPassword")} />
          </Input>

          <div className="md:col-span-2">
            <button className="btn btn-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Registering..." : "Register as Maid"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/maid-login" className="text-brand hover:underline">
            Already have maid account? Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  children,
  error,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold">{label}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

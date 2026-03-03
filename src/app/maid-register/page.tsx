"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EMIRATES, NATIONALITIES, VISA_STATUS } from "@/lib/constants";
import { useState } from "react";
import { saveSession } from "@/lib/auth-mock";
import { api, apiRoutes, ApiError } from "@/lib/api-client";

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
    experienceYears: z.coerce.number().min(0, "Experience years is required"),
    monthlySalaryAed: z.coerce.number().min(1, "Monthly salary is required"),
    skills: z.string().min(2, "Enter at least one skill"),
    imageUrl: z.string().url("Enter a valid image URL"),
    bio: z.string().min(10, "Bio should be at least 10 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.input<typeof schema>;

export default function MaidRegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      emirate: "Dubai",
      visaStatus: "Employer Visa",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setApiError(null);
    const payload = {
      email: values.email.trim(),
      password: values.password,
      fullName: values.fullName.trim(),
      nationality: values.nationality,
      emirate: values.emirate,
      visaStatus: values.visaStatus,
      experienceYears: Number(values.experienceYears),
      monthlySalaryAed: Number(values.monthlySalaryAed),
      skills: values.skills
        .split(",")
        .map((skill) => skill.trim().toLowerCase())
        .filter(Boolean),
      imageUrl: values.imageUrl.trim(),
      phone: `+971${values.mobileNumber}`,
      whatsapp: `+971${values.whatsappNumber}`,
      bio: values.bio.trim(),
    };

    try {
      const result = await api.post<{
        success: boolean;
        token: string;
        maid: {
          id: string;
          email: string;
          fullName: string;
          nationality: string;
          emirate: string;
          visaStatus: string;
          experienceYears: number;
          monthlySalaryAed: number;
          skills: string[];
          imageUrl: string;
          phone?: string;
          whatsapp?: string;
          bio?: string;
        };
      }>(apiRoutes.maid.register, payload);

      const token = result?.token;
      const maidData = result?.maid;
      if (!token || !maidData?.id) {
        throw new Error("Registration succeeded but auth token is missing.");
      }

      saveSession(maidData.fullName || values.fullName, maidData.email || values.email, "maid", {
        token,
        maidProfile: {
          id: maidData.id,
          fullName: maidData.fullName,
          nationality: maidData.nationality,
          emirate: maidData.emirate,
          visaStatus: maidData.visaStatus,
          experienceYears: maidData.experienceYears,
          monthlySalaryAed: maidData.monthlySalaryAed,
          skills: maidData.skills,
          imageUrl: maidData.imageUrl,
          phone: maidData.phone,
          whatsapp: maidData.whatsapp,
          bio: maidData.bio,
        },
      });

      router.push("/profile/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError(error instanceof Error ? error.message : "Something went wrong while registering.");
      }
    }
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
            <input className="field" placeholder="501234567" {...register("mobileNumber")} />
          </Input>
          <Input label="WhatsApp Number" error={errors.whatsappNumber?.message} hint="Prefix +971">
            <input className="field" placeholder="501234567" {...register("whatsappNumber")} />
          </Input>
          <Input label="Experience (Years)" error={errors.experienceYears?.message}>
            <input className="field" type="number" min={0} {...register("experienceYears")} />
          </Input>
          <Input label="Monthly Salary (AED)" error={errors.monthlySalaryAed?.message}>
            <input className="field" type="number" min={1} {...register("monthlySalaryAed")} />
          </Input>
          <Input label="Skills (comma separated)" error={errors.skills?.message}>
            <input className="field" placeholder="cleaning, cooking, childcare, laundry" {...register("skills")} />
          </Input>
          <Input label="Image URL" error={errors.imageUrl?.message}>
            <input className="field" placeholder="https://example.com/maids/photo.jpg" {...register("imageUrl")} />
          </Input>
          <div className="md:col-span-2">
            <Input label="Bio" error={errors.bio?.message}>
              <textarea className="field min-h-24" {...register("bio")} />
            </Input>
          </div>
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
            {apiError ? <p className="mb-3 text-sm text-red-600">{apiError}</p> : null}
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

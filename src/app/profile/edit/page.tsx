"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EMIRATES, NATIONALITIES, VISA_STATUS } from "@/lib/constants";
import { getAuthToken, getSession, syncMaidSessionFromBackend, updateSession } from "@/lib/auth-mock";
import { api, apiRoutes, ApiError } from "@/lib/api-client";

type MaidPayload = {
  id?: string;
  _id?: string;
  fullName?: string;
  nationality?: string;
  emirate?: string;
  visaStatus?: string;
  experienceYears?: number;
  monthlySalaryAed?: number;
  skills?: string[];
  imageUrl?: string;
  phone?: string;
  whatsapp?: string;
  bio?: string;
};

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  nationality: z.string().min(2, "Nationality is required"),
  emirate: z.string().min(2, "Emirate is required"),
  visaStatus: z.string().min(2, "Visa status is required"),
  experienceYears: z.coerce.number().min(0, "Experience years is required"),
  monthlySalaryAed: z.coerce.number().min(1, "Monthly salary is required"),
  skills: z.string().min(2, "Skills are required"),
  imageUrl: z.string().url("Enter a valid image URL"),
  phone: z.string().min(8, "Phone is required"),
  whatsapp: z.string().min(8, "WhatsApp is required"),
  bio: z.string().min(10, "Bio should be at least 10 characters"),
  password: z.string().optional(),
});

type FormValues = z.input<typeof schema>;

export default function EditMaidProfilePage() {
  const [notMaid, setNotMaid] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);
  const session = useMemo(() => getSession(), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      nationality: "",
      emirate: "",
      visaStatus: "",
      experienceYears: 0,
      monthlySalaryAed: 0,
      skills: "",
      imageUrl: "",
      phone: "",
      whatsapp: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    const hydrateMaid = async () => {
      if (!session || session.role !== "maid") {
        setNotMaid(true);
        setIsHydrating(false);
        return;
      }

      await syncMaidSessionFromBackend();

      const latestSession = getSession();
      const maidId = latestSession?.maidProfile?.id;
      const localMaid = latestSession?.maidProfile;

      if (!maidId) {
        reset({
          fullName: localMaid?.fullName ?? latestSession?.name ?? "",
          nationality: localMaid?.nationality ?? "",
          emirate: localMaid?.emirate ?? "Dubai",
          visaStatus: localMaid?.visaStatus ?? "Employer Visa",
          experienceYears: localMaid?.experienceYears ?? 0,
          monthlySalaryAed: localMaid?.monthlySalaryAed ?? 0,
          skills: Array.isArray(localMaid?.skills) ? localMaid.skills.join(", ") : "",
          imageUrl: localMaid?.imageUrl ?? "",
          phone: localMaid?.phone ?? "",
          whatsapp: localMaid?.whatsapp ?? "",
          bio: localMaid?.bio ?? "",
          password: "",
        });
        setIsHydrating(false);
        return;
      }

      try {
        const result = await api.get<{ success: boolean; data?: Record<string, unknown> }>(apiRoutes.maid.byId(maidId));
        const maid = (result?.data || result) as MaidPayload | null;

        if (!maid) {
          throw new Error("Could not load your latest profile data.");
        }

        reset({
          fullName: maid?.fullName ?? localMaid?.fullName ?? latestSession?.name ?? "",
          nationality: maid?.nationality ?? localMaid?.nationality ?? "",
          emirate: maid?.emirate ?? localMaid?.emirate ?? "Dubai",
          visaStatus: maid?.visaStatus ?? localMaid?.visaStatus ?? "Employer Visa",
          experienceYears: maid?.experienceYears ?? localMaid?.experienceYears ?? 0,
          monthlySalaryAed: maid?.monthlySalaryAed ?? localMaid?.monthlySalaryAed ?? 0,
          skills: Array.isArray(maid?.skills)
            ? maid.skills.join(", ")
            : Array.isArray(localMaid?.skills)
              ? localMaid.skills.join(", ")
              : "",
          imageUrl: maid?.imageUrl ?? localMaid?.imageUrl ?? "",
          phone: maid?.phone ?? localMaid?.phone ?? "",
          whatsapp: maid?.whatsapp ?? localMaid?.whatsapp ?? "",
          bio: maid?.bio ?? localMaid?.bio ?? "",
          password: "",
        });

        updateSession({
          name: maid?.fullName ?? latestSession?.name,
          maidProfile: {
            ...localMaid,
            ...maid,
            id: maid?.id ?? maid?._id ?? maidId,
          },
        });
      } catch {
        reset({
          fullName: localMaid?.fullName ?? latestSession?.name ?? "",
          nationality: localMaid?.nationality ?? "",
          emirate: localMaid?.emirate ?? "Dubai",
          visaStatus: localMaid?.visaStatus ?? "Employer Visa",
          experienceYears: localMaid?.experienceYears ?? 0,
          monthlySalaryAed: localMaid?.monthlySalaryAed ?? 0,
          skills: Array.isArray(localMaid?.skills) ? localMaid.skills.join(", ") : "",
          imageUrl: localMaid?.imageUrl ?? "",
          phone: localMaid?.phone ?? "",
          whatsapp: localMaid?.whatsapp ?? "",
          bio: localMaid?.bio ?? "",
          password: "",
        });
      } finally {
        setIsHydrating(false);
      }
    };

    void hydrateMaid();
  }, [reset, session]);

  const onSubmit = async (values: FormValues) => {
    if (!session || session.role !== "maid") return;
    const maidId = session.maidProfile?.id;
    const token = getAuthToken();

    if (!maidId) {
      setIsError(true);
      setApiMessage("Unable to find maid ID. Please login again.");
      return;
    }
    if (!token) {
      setIsError(true);
      setApiMessage("Missing auth token. Please login again.");
      return;
    }

    setApiMessage(null);
    setIsError(false);

    const payload = {
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
      phone: values.phone.trim(),
      whatsapp: values.whatsapp.trim(),
      bio: values.bio.trim(),
      ...(values.password?.trim() ? { password: values.password.trim() } : {}),
    };

    try {
      const result = await api.put<{ success: boolean; maid?: Record<string, unknown>; data?: Record<string, unknown> }>(
        apiRoutes.maid.byId(maidId),
        payload,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      const updated = (result?.maid || result?.data || payload) as MaidPayload;
      updateSession({
        name: updated.fullName ?? payload.fullName,
        maidProfile: {
          ...session.maidProfile,
          ...updated,
          id: updated?.id ?? updated?._id ?? maidId,
        },
      });
      setIsError(false);
      setApiMessage("Profile updated successfully.");
    } catch (error) {
      setIsError(true);
      if (error instanceof ApiError) {
        setApiMessage(error.message);
      } else {
        setApiMessage(error instanceof Error ? error.message : "Unable to update profile. Please try again.");
      }
    }
  };

  if (notMaid) {
    return (
      <section className="mx-auto mt-10 max-w-xl px-4 sm:px-6">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-slate-900">Maid Login Required</h1>
          <p className="mt-2 text-sm text-slate-600">Please sign in as maid to edit your profile.</p>
          <Link href="/maid-login" className="btn btn-primary mt-4 inline-flex">
            Go to Maid Login
          </Link>
        </div>
      </section>
    );
  }

  if (isHydrating) {
    return (
      <section className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
        <div className="card">
          <p className="text-sm text-slate-600">Loading your maid profile...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-10 max-w-4xl px-4 sm:px-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-900">Edit Maid Profile</h1>
        <p className="mt-1 text-sm text-slate-600">Update your profile details shown to customers.</p>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Field label="Full Name" error={errors.fullName?.message}>
            <input className="field" {...register("fullName")} />
          </Field>
          <Field label="Nationality" error={errors.nationality?.message}>
            <select className="field" {...register("nationality")}>
              <option value="">Select Nationality</option>
              {NATIONALITIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Emirate" error={errors.emirate?.message}>
            <select className="field" {...register("emirate")}>
              <option value="">Select Emirate</option>
              {EMIRATES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Visa Status" error={errors.visaStatus?.message}>
            <select className="field" {...register("visaStatus")}>
              <option value="">Select Visa Status</option>
              {VISA_STATUS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Experience Years" error={errors.experienceYears?.message}>
            <input className="field" type="number" min={0} {...register("experienceYears")} />
          </Field>
          <Field label="Monthly Salary AED" error={errors.monthlySalaryAed?.message}>
            <input className="field" type="number" min={1} {...register("monthlySalaryAed")} />
          </Field>
          <Field label="Skills (comma separated)" error={errors.skills?.message}>
            <input className="field" {...register("skills")} />
          </Field>
          <Field label="Image URL" error={errors.imageUrl?.message}>
            <input className="field" {...register("imageUrl")} />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <input className="field" {...register("phone")} />
          </Field>
          <Field label="WhatsApp" error={errors.whatsapp?.message}>
            <input className="field" {...register("whatsapp")} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Bio" error={errors.bio?.message}>
              <textarea className="field min-h-24" {...register("bio")} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Password (optional)" error={errors.password?.message}>
              <input className="field" type="password" placeholder="Leave blank to keep current password" {...register("password")} />
            </Field>
          </div>
          <div className="md:col-span-2">
            {apiMessage ? <p className={`mb-3 text-sm ${isError ? "text-red-600" : "text-green-700"}`}>{apiMessage}</p> : null}
            <button className="btn btn-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

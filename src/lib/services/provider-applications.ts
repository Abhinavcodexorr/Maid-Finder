"use client";

import { ApiError } from "@/lib/api-client";
import { writeJson, STORAGE_KEYS } from "@/lib/services/storage";

export interface ProviderApplicationInput {
  fullName: string;
  firstName?: string;
  lastName?: string;
  gender: "Male" | "Female";
  nationality: string;
  categoryId: string;
  area: string;
  city: string;
  state?: string;
  pincode?: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  password: string;
  /** Optional — in the OTP-first flow the selfie is sent later, with the KYC documents, in completeProviderProfile. */
  photoFile?: File;
}

export interface ProviderApplicationProvider {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  nationality?: string;
  categoryId?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  imageUrl?: string;
  applicationStatus: "pending" | "approved" | "rejected";
}

export interface ProviderApplicationResult {
  token: string;
  provider: ProviderApplicationProvider;
}

export interface OtpSendResult {
  alreadyRegistered: boolean;
  expiresInSeconds: number;
}

export interface OtpVerifyResult {
  token: string;
  isNewAccount: boolean;
  provider: ProviderApplicationProvider;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false) {
    throw new ApiError(data?.message || `Request failed with status ${response.status}`, response.status, data);
  }
  return data as T;
}

/** Step 1 of registration: text an OTP to the helper's mobile number. */
export function sendProviderOtp(mobileNumber: string): Promise<OtpSendResult> {
  return postJson<OtpSendResult>("/api/providers/send-otp", { mobileNumber });
}

/** Verifies the OTP; the backend finds-or-creates the account and returns its session token. */
export async function verifyProviderOtp(mobileNumber: string, otp: string): Promise<OtpVerifyResult> {
  const result = await postJson<OtpVerifyResult>("/api/providers/verify-otp", { mobileNumber, otp });
  writeJson(STORAGE_KEYS.providerSession, result.token);
  return result;
}

/** Uploads an image or video to the backend's generic upload endpoint and returns its public URL. */
export async function uploadMedia(file: File, token?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false || !data?.url) {
    const tooLarge = response.status === 413;
    throw new ApiError(
      tooLarge ? "That file is too large to upload. Try a shorter or smaller video." : data?.message || `Upload failed with status ${response.status}`,
      response.status,
      data
    );
  }
  return data.url as string;
}

/**
 * Downscales a phone-camera photo before upload — the site proxies uploads
 * through a serverless function with a small request-body limit, and a
 * full-resolution Aadhaar + PAN + selfie set can exceed it. PDFs and
 * non-images pass through untouched.
 */
export async function shrinkImage(file: File, maxSide = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export async function submitProviderApplication(input: ProviderApplicationInput): Promise<ProviderApplicationResult> {
  const formData = new FormData();
  formData.append("fullName", input.fullName);
  if (input.firstName) formData.append("firstName", input.firstName);
  if (input.lastName) formData.append("lastName", input.lastName);
  formData.append("gender", input.gender);
  formData.append("nationality", input.nationality);
  formData.append("categoryId", input.categoryId);
  formData.append("area", input.area);
  formData.append("city", input.city);
  if (input.state) formData.append("state", input.state);
  if (input.pincode) formData.append("pincode", input.pincode);
  formData.append("mobileNumber", input.mobileNumber);
  formData.append("whatsappNumber", input.whatsappNumber);
  formData.append("email", input.email);
  formData.append("password", input.password);
  if (input.photoFile) formData.append("photo", input.photoFile);

  // Goes through our own /api/providers/register proxy (same-origin), not
  // the external API directly — see src/app/api/providers/register/route.ts.
  const response = await fetch("/api/providers/register", { method: "POST", body: formData });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false) {
    throw new ApiError(data?.message || `Request failed with status ${response.status}`, response.status, data);
  }
  const result = data as ProviderApplicationResult;
  writeJson(STORAGE_KEYS.providerSession, result.token);
  return result;
}

export interface CompleteProfileIdProof {
  idType: string;
  idNumber: string;
  file: File;
}

export interface CompleteProfileInput {
  token: string;
  categoryIds: string[];
  experienceYears?: number;
  skills?: string[];
  panNumber?: string;
  aadhaarNumber?: string;
  state?: string;
  pincode?: string;
  idProofs: CompleteProfileIdProof[];
  /** Selfie for the profile photo. */
  selfieFile?: File | null;
  /** Public URL from uploadMedia() for the optional intro video. */
  introVideoUrl?: string;
}

/**
 * Submits the KYC documents (one or more government IDs), work
 * preferences, and the optional intro video — the part of registration
 * the real backend treats as "completing" a provider's profile, separate
 * from the initial register() call. Marks the application as submitted
 * for review (applicationStatus -> pending, profileComplete -> true).
 */
export async function completeProviderProfile(input: CompleteProfileInput): Promise<void> {
  const formData = new FormData();
  formData.append(
    "generalInfo",
    JSON.stringify({
      ...(input.panNumber && { panNumber: input.panNumber }),
      ...(input.aadhaarNumber && { aadhaarNumber: input.aadhaarNumber }),
      ...(input.state && { state: input.state }),
      ...(input.pincode && { pincode: input.pincode }),
      idProofs: input.idProofs.map(({ idType, idNumber }) => ({ idType, idNumber })),
    })
  );
  formData.append(
    "workPreferences",
    JSON.stringify({
      categoryIds: input.categoryIds,
      ...(input.experienceYears !== undefined && { experienceYears: input.experienceYears }),
      ...(input.skills && { skills: input.skills }),
    })
  );
  const idFiles = await Promise.all(input.idProofs.map(({ file }) => shrinkImage(file)));
  idFiles.forEach((file) => formData.append("idDocuments", file));
  if (input.selfieFile) formData.append("photo", await shrinkImage(input.selfieFile));
  if (input.introVideoUrl) formData.append("introVideoUrl", input.introVideoUrl);

  const response = await fetch("/api/providers/complete-profile", {
    method: "POST",
    headers: { Authorization: `Bearer ${input.token}` },
    body: formData,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success === false) {
    throw new ApiError(data?.message || `Request failed with status ${response.status}`, response.status, data);
  }
}

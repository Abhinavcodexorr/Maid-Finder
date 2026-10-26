"use client";

import { ApiError } from "@/lib/api-client";
import { writeJson, STORAGE_KEYS } from "@/lib/services/storage";

/*
 * Helper (provider) registration mirrors the mobile app:
 *   1. sendProviderOtp -> verifyProviderOtp   (creates the account, returns a session token)
 *   2. completeProviderProfile                (called once per screen: details, documents, video)
 * Every completeProviderProfile call is a partial update, so each screen
 * saves its own part as the helper moves forward.
 */

export interface ProviderApplicationProvider {
  id: string;
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  nationality?: string;
  categoryIds?: string[];
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  mobileNumber?: string;
  imageUrl?: string;
  applicationStatus: "pending" | "approved" | "rejected";
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

/** A service from the admin-managed catalog; `key` is what providers store as their category id. */
export interface CatalogService {
  id: string;
  key: string;
  name: string;
  imageUrl?: string;
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

/** The admin-managed service catalog — used for "What work do you do?" and the home page's service tiles. */
export async function fetchCatalogServices(): Promise<CatalogService[]> {
  const response = await fetch("/api/services");
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new ApiError(data?.message || "Couldn't load services", response.status, data);
  }
  return data.data as CatalogService[];
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
 * full-resolution Aadhaar + PAN set can exceed it. PDFs and non-images pass
 * through untouched.
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

export interface CompleteProfileInput {
  token: string;
  firstName?: string;
  lastName?: string;
  gender?: "Male" | "Female";
  nationality?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  /** Service keys from the catalog. */
  categoryIds?: string[];
  aadhaarFront?: File;
  aadhaarBack?: File;
  panCard?: File;
  /** Public URL from uploadMedia() for the intro / video KYC recording. */
  introVideoUrl?: string;
}

/**
 * Saves one screen's worth of a helper's profile. Only the fields that are
 * passed are sent, so it can be called once per registration screen.
 */
export async function completeProviderProfile(input: CompleteProfileInput): Promise<void> {
  const formData = new FormData();

  const generalInfo = {
    ...(input.firstName && { firstName: input.firstName }),
    ...(input.lastName && { lastName: input.lastName }),
    ...(input.gender && { gender: input.gender }),
    ...(input.nationality && { nationality: input.nationality }),
    ...(input.area && { area: input.area }),
    ...(input.city && { city: input.city }),
    ...(input.state && { state: input.state }),
    ...(input.pincode && { pincode: input.pincode }),
  };
  if (Object.keys(generalInfo).length) formData.append("generalInfo", JSON.stringify(generalInfo));
  if (input.categoryIds?.length) formData.append("workPreferences", JSON.stringify({ categoryIds: input.categoryIds }));

  const documents = { aadhaarFront: input.aadhaarFront, aadhaarBack: input.aadhaarBack, panCard: input.panCard };
  for (const [field, file] of Object.entries(documents)) {
    if (file) formData.append(field, await shrinkImage(file));
  }
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

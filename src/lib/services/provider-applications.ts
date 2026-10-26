"use client";

import { ApiError } from "@/lib/api-client";
import { writeJson, STORAGE_KEYS } from "@/lib/services/storage";

export interface ProviderApplicationInput {
  fullName: string;
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
  /** Selfie taken in the KYC step — the only file register() itself takes; the ID documents and video go through completeProviderProfile below. */
  photoFile: File;
}

export interface ProviderApplicationProvider {
  id: string;
  email: string;
  fullName: string;
  gender?: string;
  nationality?: string;
  categoryId?: string;
  area?: string;
  city?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  imageUrl?: string;
  applicationStatus: "pending" | "approved" | "rejected";
}

export interface ProviderApplicationResult {
  token: string;
  provider: ProviderApplicationProvider;
}

export async function submitProviderApplication(input: ProviderApplicationInput): Promise<ProviderApplicationResult> {
  const formData = new FormData();
  formData.append("fullName", input.fullName);
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
  formData.append("photo", input.photoFile);

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
  state?: string;
  pincode?: string;
  idProofs: CompleteProfileIdProof[];
  videoFile?: File | null;
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
  input.idProofs.forEach(({ file }) => formData.append("idDocuments", file));
  if (input.videoFile) formData.append("video", input.videoFile);

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

"use client";

import { api, apiRoutes } from "@/lib/api-client";
import { writeJson, STORAGE_KEYS } from "@/lib/services/storage";

export interface ProviderApplicationInput {
  fullName: string;
  gender: "Male" | "Female";
  nationality: string;
  categoryId: string;
  area: string;
  city: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  password: string;
  kyc: {
    idType: string;
    idNumber: string;
    idDocumentFile: File;
    photoFile: File;
  };
}

export interface ProviderApplicationMaid {
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
  maid: ProviderApplicationMaid;
}

export async function submitProviderApplication(input: ProviderApplicationInput): Promise<ProviderApplicationResult> {
  const formData = new FormData();
  formData.append("fullName", input.fullName);
  formData.append("gender", input.gender);
  formData.append("nationality", input.nationality);
  formData.append("categoryId", input.categoryId);
  formData.append("area", input.area);
  formData.append("city", input.city);
  formData.append("mobileNumber", input.mobileNumber);
  formData.append("whatsappNumber", input.whatsappNumber);
  formData.append("email", input.email);
  formData.append("password", input.password);
  formData.append("idType", input.kyc.idType);
  formData.append("idNumber", input.kyc.idNumber);
  formData.append("photo", input.kyc.photoFile);
  formData.append("idDocument", input.kyc.idDocumentFile);

  const result = await api.post<ProviderApplicationResult>(apiRoutes.maid.register, formData);
  writeJson(STORAGE_KEYS.maidSession, result.token);
  return result;
}

"use client";

import { MOCK_USERS } from "@/data/mockUsers";
import { readJson, writeJson, removeKey, STORAGE_KEYS } from "@/lib/services/storage";
import type { AvailabilityType, MockUser } from "@/types/marketplace";

export type PublicUser = Omit<MockUser, "password">;

function toPublic(user: MockUser): PublicUser {
  const { password: _password, ...rest } = user;
  void _password;
  return rest;
}

function isEmail(value: string): boolean {
  return /\S+@\S+\.\S+/.test(value);
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "").slice(-10);
}

function getAllUsers(): MockUser[] {
  const existing = readJson<MockUser[] | null>(STORAGE_KEYS.users, null);
  if (existing && existing.length > 0) return existing;
  writeJson(STORAGE_KEYS.users, MOCK_USERS);
  return MOCK_USERS;
}

function saveAllUsers(users: MockUser[]): void {
  writeJson(STORAGE_KEYS.users, users);
}

function findUserByEmailOrPhone(identifier: string): MockUser | undefined {
  const users = getAllUsers();
  if (isEmail(identifier)) {
    return users.find((u) => u.email.toLowerCase() === identifier.trim().toLowerCase());
  }
  const phoneDigits = normalizePhone(identifier);
  return users.find((u) => normalizePhone(u.phone) === phoneDigits);
}

export function emailExists(email: string): boolean {
  return getAllUsers().some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function phoneExists(phone: string): boolean {
  const digits = normalizePhone(phone);
  return getAllUsers().some((u) => normalizePhone(u.phone) === digits);
}

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export function signup(input: SignupInput): PublicUser {
  if (emailExists(input.email)) throw new Error("An account with this email already exists.");
  if (phoneExists(input.phone)) throw new Error("An account with this phone number already exists.");

  const user: MockUser = {
    id: `user-${Date.now()}`,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.startsWith("+91") ? input.phone : `+91 ${normalizePhone(input.phone)}`,
    password: input.password,
    role: "user",
    lookingFor: [],
    onboardingDismissed: false,
    createdAt: new Date().toISOString(),
  };

  const users = [...getAllUsers(), user];
  saveAllUsers(users);
  writeJson(STORAGE_KEYS.session, user.id);
  return toPublic(user);
}

export function login(identifier: string, password: string): PublicUser {
  const user = findUserByEmailOrPhone(identifier);
  if (!user || user.password !== password) {
    throw new Error("Incorrect email/phone or password. Please try again.");
  }
  writeJson(STORAGE_KEYS.session, user.id);
  return toPublic(user);
}

export function logout(): void {
  removeKey(STORAGE_KEYS.session);
}

export function getCurrentUser(): PublicUser | null {
  const sessionId = readJson<string | null>(STORAGE_KEYS.session, null);
  if (!sessionId) return null;
  const user = getAllUsers().find((u) => u.id === sessionId);
  return user ? toPublic(user) : null;
}

export function updateLookingFor(
  userId: string,
  patch: { lookingFor?: string[]; preferredArea?: string; requirementType?: AvailabilityType; onboardingDismissed?: boolean },
): PublicUser | null {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  saveAllUsers(users);
  return toPublic(users[idx]);
}

export function updateProfile(
  userId: string,
  patch: Partial<Pick<MockUser, "firstName" | "lastName" | "email" | "phone">>,
): PublicUser | null {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  saveAllUsers(users);
  return toPublic(users[idx]);
}

export function changePassword(userId: string, newPassword: string): void {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("User not found.");
  users[idx] = { ...users[idx], password: newPassword };
  saveAllUsers(users);
}

/** UI-only forgot-password flow: any 6-digit code is accepted as the OTP. */
export function requestPasswordReset(identifier: string): { found: boolean } {
  const user = findUserByEmailOrPhone(identifier);
  return { found: Boolean(user) };
}

export function isValidMockOtp(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

export function resetPasswordWithOtp(identifier: string, otp: string, newPassword: string): void {
  if (!isValidMockOtp(otp)) throw new Error("Enter the 6-digit code sent to you.");
  const user = findUserByEmailOrPhone(identifier);
  if (!user) throw new Error("We couldn't find an account with that email or phone.");
  changePassword(user.id, newPassword);
}

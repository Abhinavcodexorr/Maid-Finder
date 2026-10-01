"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile, updateLookingFor } from "@/lib/services/auth";
import { getCategories } from "@/lib/services";
import { Icon } from "@/components/ui/icon";
import { toast } from "@/components/ui/toaster";
import type { AvailabilityType } from "@/types/marketplace";

const CATEGORY_EMOJIS: Record<string, string> = {
  "cat-cook": "🍳",
  "cat-maid": "🧹",
  "cat-plumber": "🔧",
  "cat-electrician": "⚡",
  "cat-carpenter": "🪚",
  "cat-driver": "🚗",
  "cat-babysitter": "👶",
  "cat-elderly-care": "👵",
};

export default function ProfileDetailsPage() {
  const { user, refresh } = useAuth();
  const categories = useMemo(() => getCategories(), []);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [preferredArea, setPreferredArea] = useState(user?.preferredArea || "Mumbai");
  const [requirementType, setRequirementType] = useState<AvailabilityType>(
    user?.requirementType || "full-time"
  );
  const [lookingFor, setLookingFor] = useState<string[]>(user?.lookingFor || []);
  const [saving, setSaving] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setLookingFor((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      updateProfile(user.id, {
        firstName,
        lastName,
        email,
        phone,
      });

      updateLookingFor(user.id, {
        lookingFor,
        preferredArea,
        requirementType,
      });

      refresh();
      toast({
        title: "Profile Updated",
        description: "Your contact details and hiring preferences have been saved.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: "var(--ink)" }}>
          Profile & Hiring Preferences
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Keep your contact information and household staffing requirements up to date.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Contact Details */}
        <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <h2 className="font-display text-base font-bold mb-4" style={{ color: "var(--ink)" }}>
            Personal Details
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-xs font-semibold mb-1" style={{ color: "var(--ink)" }}>
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-xs font-semibold mb-1" style={{ color: "var(--ink)" }}>
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold mb-1" style={{ color: "var(--ink)" }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--primary)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold mb-1" style={{ color: "var(--ink)" }}>
                Mobile Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--primary)] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location & Household Preferences */}
        <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <h2 className="font-display text-base font-bold mb-4" style={{ color: "var(--ink)" }}>
            Location & Schedule Preferences
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cityArea" className="block text-xs font-semibold mb-1" style={{ color: "var(--ink)" }}>
                Primary City / Area
              </label>
              <select
                id="cityArea"
                value={preferredArea}
                onChange={(e) => setPreferredArea(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--primary)] focus:bg-white focus:outline-none"
              >
                <option value="Mumbai">Mumbai (Bandra, Andheri, Juhu, Powai)</option>
                <option value="Delhi">Delhi NCR (South Delhi, Gurgaon, Noida)</option>
                <option value="Bangalore">Bengaluru (Indiranagar, Koramangala, Whitefield)</option>
                <option value="Hyderabad">Hyderabad (Hitec City, Banjara Hills, Jubilee Hills)</option>
                <option value="Pune">Pune (Koregaon Park, Baner, Kothrud, Viman Nagar)</option>
                <option value="Chennai">Chennai (Adyar, Anna Nagar, T. Nagar)</option>
                <option value="Kolkata">Kolkata (Salt Lake, New Town, Park Street)</option>
                <option value="Ahmedabad">Ahmedabad (Vastrapur, Bodakdev, SG Highway)</option>
                <option value="Jaipur">Jaipur (Malviya Nagar, Vaishali Nagar, C-Scheme)</option>
              </select>
            </div>

            <div>
              <label htmlFor="requirementType" className="block text-xs font-semibold mb-1" style={{ color: "var(--ink)" }}>
                Working Arrangement
              </label>
              <select
                id="requirementType"
                value={requirementType}
                onChange={(e) => setRequirementType(e.target.value as AvailabilityType)}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--primary)] focus:bg-white focus:outline-none"
              >
                <option value="full-time">Full-time (8-10 Hours Daily)</option>
                <option value="part-time">Part-time (2-4 Hours Daily)</option>
                <option value="live-in">Live-in (24x7 Domestic Residency)</option>
                <option value="one-time">On-demand / One-time Relief</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-semibold mb-2" style={{ color: "var(--ink)" }}>
              Services You Need (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {categories.map((cat) => {
                const selected = lookingFor.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                      selected
                        ? "border-[var(--primary)] bg-[var(--primary-soft)]/20 text-[var(--ink)] font-semibold"
                        : "border-[var(--line)] bg-white text-[var(--ink-secondary)] hover:border-[var(--muted)]"
                    }`}
                  >
                    <span className="text-xl">{CATEGORY_EMOJIS[cat.id] ?? "🧹"}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs">{cat.name}</div>
                    </div>
                    {selected && (
                      <Icon name="check" className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Icon name="check" className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

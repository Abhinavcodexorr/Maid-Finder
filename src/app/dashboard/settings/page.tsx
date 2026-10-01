"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { changePassword } from "@/lib/services/auth";
import { Icon } from "@/components/ui/icon";
import { toast } from "@/components/ui/toaster";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Notification state
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Your new password must be at least 8 characters long.",
        variant: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please confirm your new password exactly.",
        variant: "error",
      });
      return;
    }

    setUpdatingPassword(true);
    try {
      changePassword(user.id, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password Changed",
        description: "Your account password has been updated securely.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Failed to change password",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export Initiated",
      description: "A JSON copy of your account profile has been compiled.",
      variant: "success",
    });
  };

  const handleDeleteAccount = () => {
    logout();
    toast({
      title: "Account Closed",
      description: "Your session and account data have been wiped from this device.",
      variant: "info",
    });
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: "var(--ink)" }}>
          Account Settings & Security
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Manage your account credentials, notifications, and privacy preferences.
        </p>
      </div>

      {/* Change Password Card */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Icon name="lock" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-base font-bold" style={{ color: "var(--ink)" }}>
              Change Password
            </h2>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Update your password to keep your domestic staffing account secure.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4 max-w-md">
          <div>
            <label htmlFor="currPass" className="block text-xs font-semibold mb-1" style={{ color: "var(--ink)" }}>
              Current Password
            </label>
            <input
              id="currPass"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--primary)] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="newPass" className="block text-xs font-semibold mb-1" style={{ color: "var(--ink)" }}>
              New Password
            </label>
            <input
              id="newPass"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--primary)] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="confirmPass" className="block text-xs font-semibold mb-1" style={{ color: "var(--ink)" }}>
              Confirm New Password
            </label>
            <input
              id="confirmPass"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              required
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)] px-3.5 py-2.5 text-sm transition-colors focus:border-[var(--primary)] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={updatingPassword}
            className="btn btn-primary btn-sm text-xs font-semibold"
          >
            {updatingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--ink)]">
            <Icon name="bell" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-base font-bold" style={{ color: "var(--ink)" }}>
              Alerts & Communications
            </h2>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Choose how you want to be notified about candidate matches and inquiries.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[var(--line-light)]">
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                WhatsApp Helper Matches
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Get instant notifications when candidates matching your criteria join in your locality.
              </p>
            </div>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(e) => setWhatsappAlerts(e.target.checked)}
              className="h-4 w-4 rounded accent-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                Email Digests & Receipts
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Receive monthly market salary reports, membership invoices, and interview checklists.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 rounded accent-[var(--primary)] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                SMS Status Updates
              </p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Text alerts for membership activation and security verification logins.
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="h-4 w-4 rounded accent-[var(--primary)] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Privacy & Danger Zone */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
        <h2 className="font-display text-base font-bold mb-1" style={{ color: "var(--ink)" }}>
          Privacy & Data Controls
        </h2>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
          Export your stored candidate views or close your account.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleExportData}
            className="btn btn-secondary btn-sm text-xs"
          >
            <Icon name="download" className="h-3.5 w-3.5" />
            Export My Data
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-sm text-xs text-[var(--error)] border border-[var(--error-soft)] bg-[var(--error-soft)]/30 hover:bg-[var(--error-soft)]"
          >
            <Icon name="trash" className="h-3.5 w-3.5" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--error-soft)] text-[var(--error)] mx-auto">
              <Icon name="alert-triangle" className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h3 className="font-display text-lg font-bold" style={{ color: "var(--ink)" }}>
                Delete Account?
              </h3>
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                This will wipe your active membership, saved helpers, and recent searches from this device. This cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary flex-1 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="btn flex-1 text-xs text-white"
                style={{ background: "var(--error)" }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

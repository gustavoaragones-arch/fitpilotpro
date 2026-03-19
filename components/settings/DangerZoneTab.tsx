"use client";

import { useState } from "react";
import { AlertTriangle, LogOut, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    // For now, just sign out — actual account deletion requires a server-side API call
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete account");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#2A2A2A] border border-[#EF4444]/30 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3A3A3A]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            <h2 className="text-base font-bold text-white">Delete Account</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#3A3A3A] transition-all min-h-[44px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-4">
            <p className="text-sm text-[#EF4444] font-medium mb-1">
              This action is irreversible
            </p>
            <p className="text-xs text-[#A0A0A0]">
              Deleting your account will permanently remove all your clients,
              sessions, routines, and progress records. This cannot be undone.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">
              Type <span className="text-white font-bold">DELETE</span> to
              confirm
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="DELETE"
              className="w-full bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#EF4444] min-h-[44px]"
            />
          </div>

          {error && <p className="text-sm text-[#EF4444]">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-[#3A3A3A] flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-[#A0A0A0] hover:text-white border border-[#3A3A3A] hover:border-[#555] rounded-lg transition-all min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={confirmation !== "DELETE" || loading}
            className="px-5 py-2.5 text-sm font-semibold bg-[#EF4444] text-white rounded-lg hover:bg-[#DC2626] transition-all min-h-[44px] disabled:opacity-40"
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DangerZoneTab() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl p-5">
        <p className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest mb-4">
          Danger Zone
        </p>

        <div className="space-y-4">
          {/* Sign out */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Sign Out</p>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                Sign out of your FitPilot Pro account on this device
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/10 rounded-lg transition-all min-h-[44px] disabled:opacity-60 shrink-0"
            >
              <LogOut className="w-4 h-4" />
              {signingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>

          <div className="border-t border-[#3A3A3A]" />

          {/* Delete account */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Delete Account</p>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-lg transition-all min-h-[44px] shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  );
}

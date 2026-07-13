"use client";

import { useState, useTransition } from "react";
import { CheckCheck } from "lucide-react";
import { completeSession } from "@/lib/actions/sessions";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Toast from "@/components/ui/Toast";
import { useT } from "@/lib/i18n";

interface CompleteSessionButtonProps {
  sessionId: string;
}

export default function CompleteSessionButton({
  sessionId,
}: CompleteSessionButtonProps) {
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useT();

  function handleConfirm() {
    startTransition(async () => {
      try {
        await completeSession(sessionId);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : t("error"),
        );
      } finally {
        setConfirmOpen(false);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={pending}
        aria-label={t("session.completeButton")}
        title={t("session.completeButton")}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white disabled:opacity-60"
      >
        <CheckCheck size={22} />
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title={t("session.completeButton")}
        message={t("session.completeMessage")}
        confirmLabel={t("session.completeButton")}
        cancelLabel={t("cancel")}
        pendingLabel={t("session.completing")}
        pending={pending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />

      {error && <Toast message={error} onDismiss={() => setError(null)} />}
    </>
  );
}

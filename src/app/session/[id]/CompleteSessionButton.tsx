"use client";

import { useState, useTransition } from "react";
import { CheckCheck } from "lucide-react";
import { completeSession } from "@/lib/actions/sessions";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Toast from "@/components/ui/Toast";

interface CompleteSessionButtonProps {
  sessionId: string;
}

export default function CompleteSessionButton({
  sessionId,
}: CompleteSessionButtonProps) {
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    startTransition(async () => {
      try {
        await completeSession(sessionId);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Errore durante la chiusura della spesa.",
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
        aria-label="Concludi spesa"
        title="Concludi spesa"
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white disabled:opacity-60"
      >
        <CheckCheck size={22} />
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Concludi spesa"
        message="Vuoi davvero concludere questa spesa? Potrai comunque riaprirla in seguito dallo storico."
        confirmLabel="Concludi"
        cancelLabel="Annulla"
        pendingLabel="Concludo…"
        pending={pending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />

      {error && <Toast message={error} onDismiss={() => setError(null)} />}
    </>
  );
}

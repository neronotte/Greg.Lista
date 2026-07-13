"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import FAB from "@/components/ui/FAB";
import BottomSheet from "@/components/ui/BottomSheet";
import { createFamily } from "@/lib/actions/families";

export default function FamiliesActions() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Il nome è obbligatorio");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await createFamily(name.trim());
        router.refresh();
        setOpen(false);
        setName("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore");
      }
    });
  }

  return (
    <>
      <FAB onClick={() => setOpen(true)} ariaLabel="New family" />
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="New Family"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
              Family name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Anderson Family"
              autoFocus
              className="w-full bg-bg-header rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-mid font-medium placeholder:font-normal"
            />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full mt-1 py-4 bg-brand-mid text-white rounded-2xl font-extrabold text-sm active:scale-[0.98] transition-transform"
            style={{ boxShadow: "0 4px 16px rgba(61,122,86,0.32)" }}
          >
            {pending ? "Creating…" : "Create Family"}
          </button>
        </form>
      </BottomSheet>
    </>
  );
}

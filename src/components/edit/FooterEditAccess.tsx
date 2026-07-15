"use client";

import * as React from "react";

import { useEditMode } from "./EditModeProvider";

export function FooterEditAccess() {
  const { enabled, unlocked, unlock, lock, active, setActive } = useEditMode();
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  if (!enabled) return null;

  function handleUnlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (unlock(password)) {
      setPassword("");
      setError(null);
      setOpen(false);
      return;
    }

    setError("Incorrect password.");
  }

  if (unlocked) {
    return (
      <div className="flex items-center justify-end gap-s3 text-[12px] uppercase tracking-[0.04em] text-white/45">
        <button
          type="button"
          onClick={() => setActive(!active)}
          className="transition-colors hover:text-white/75"
        >
          {active ? "Editing on" : "Editing off"}
        </button>
        <button
          type="button"
          onClick={lock}
          className="transition-colors hover:text-white/75"
        >
          Lock
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-s2">
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          setError(null);
        }}
        className="text-[12px] uppercase tracking-[0.04em] text-white/35 transition-colors hover:text-white/60"
      >
        Editor access
      </button>

      {open ? (
        <form
          onSubmit={handleUnlock}
          className="flex items-center gap-s2 rounded-pill border border-white/10 bg-white/5 px-s2 py-s2"
        >
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-[132px] bg-transparent px-s2 text-[12px] text-white outline-none placeholder:text-white/25"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-pill bg-white px-s3 py-1 text-[11px] font-medium uppercase tracking-[0.04em] text-ink transition-opacity hover:opacity-85"
          >
            Enter
          </button>
        </form>
      ) : null}

      {error ? <div className="text-[11px] text-white/55">{error}</div> : null}
    </div>
  );
}

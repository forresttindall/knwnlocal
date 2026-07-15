"use client";

import * as React from "react";

import type { PageKey } from "@/lib/content/pageContent";

type DeployStatus = "idle" | "pending" | "success" | "error";

type SelectedEditable = {
  field: string;
  current: string;
  rect: { top: number; left: number; width: number; height: number };
};

type EditModeContextValue = {
  pageKey: PageKey;
  enabled: boolean;
  unlocked: boolean;
  unlock: (password: string) => boolean;
  lock: () => void;
  active: boolean;
  setActive: (next: boolean) => void;
  values: Record<string, string>;
  setValue: (field: string, value: string) => void;
  dirtyFields: Set<string>;
  clearDirty: () => void;
  selected: SelectedEditable | null;
  setSelected: (next: SelectedEditable | null) => void;
  deployStatus: DeployStatus;
  setDeployStatus: (next: DeployStatus) => void;
  deployError: string | null;
  setDeployError: (next: string | null) => void;
};

const EditModeContext = React.createContext<EditModeContextValue | null>(null);
const EDIT_MODE_SESSION_KEY = "knwnlocal-edit-mode-unlocked";
const EDIT_MODE_PASSWORD =
  process.env.NEXT_PUBLIC_EDIT_MODE_PASSWORD?.trim() || "cde8181$";

export function useEditMode() {
  const ctx = React.useContext(EditModeContext);
  if (!ctx) {
    throw new Error("EditModeContext is missing");
  }
  return ctx;
}

export function EditModeProvider({
  enabled,
  pageKey,
  initialValues,
  children,
}: {
  enabled: boolean;
  pageKey: PageKey;
  initialValues: Record<string, string>;
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [values, setValues] = React.useState<Record<string, string>>(initialValues);
  const [dirtyFields, setDirtyFields] = React.useState<Set<string>>(new Set());
  const [selected, setSelected] = React.useState<SelectedEditable | null>(null);
  const [deployStatus, setDeployStatus] = React.useState<DeployStatus>("idle");
  const [deployError, setDeployError] = React.useState<string | null>(null);

  const setValue = React.useCallback((field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setDirtyFields((prev) => {
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  }, []);

  const clearDirty = React.useCallback(() => {
    setDirtyFields(new Set());
  }, []);

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    if (window.sessionStorage.getItem(EDIT_MODE_SESSION_KEY) === "true") {
      setUnlocked(true);
    }
  }, [enabled]);

  const unlock = React.useCallback(
    (password: string) => {
      if (!enabled || password.trim() !== EDIT_MODE_PASSWORD) {
        return false;
      }

      setUnlocked(true);
      setActive(true);

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(EDIT_MODE_SESSION_KEY, "true");
      }

      return true;
    },
    [enabled],
  );

  const lock = React.useCallback(() => {
    setUnlocked(false);
    setActive(false);
    setSelected(null);

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(EDIT_MODE_SESSION_KEY);
    }
  }, []);

  React.useEffect(() => {
    if (!enabled) return;
    if (active && unlocked) {
      document.documentElement.setAttribute("data-edit-mode", "true");
    } else {
      document.documentElement.removeAttribute("data-edit-mode");
    }
  }, [active, enabled, unlocked]);

  React.useEffect(() => {
    if (!enabled) return;
    if (!unlocked) return;
    if (!active) return;

    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      if (!target) return;

      const editable = target.closest?.('[data-editable="true"]') as HTMLElement | null;
      if (!editable) return;

      const field = editable.getAttribute("data-field");
      if (!field) return;

      event.preventDefault();
      event.stopPropagation();

      const rect = editable.getBoundingClientRect();
      const value = values[field] ?? editable.textContent ?? "";

      setSelected({
        field,
        current: value.trim(),
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [active, enabled, values]);

  const contextValue: EditModeContextValue = React.useMemo(
    () => ({
      pageKey,
      enabled,
      unlocked,
      unlock,
      lock,
      active,
      setActive,
      values,
      setValue,
      dirtyFields,
      clearDirty,
      selected,
      setSelected,
      deployStatus,
      setDeployStatus,
      deployError,
      setDeployError,
    }),
    [
      pageKey,
      enabled,
      unlocked,
      unlock,
      lock,
      active,
      values,
      setValue,
      dirtyFields,
      clearDirty,
      selected,
      deployStatus,
      deployError,
    ],
  );

  return <EditModeContext.Provider value={contextValue}>{children}</EditModeContext.Provider>;
}

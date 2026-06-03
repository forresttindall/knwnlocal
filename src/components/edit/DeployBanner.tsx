"use client";

import { Button } from "@/components/ui/Button";

import { useEditMode } from "./EditModeProvider";

export function DeployBanner() {
  const {
    enabled,
    dirtyFields,
    values,
    deployStatus,
    setDeployStatus,
    deployError,
    setDeployError,
    clearDirty,
  } = useEditMode();

  if (!enabled) return null;
  if (dirtyFields.size === 0) return null;

  async function onDeploy() {
    setDeployError(null);
    setDeployStatus("pending");

    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          changes: Array.from(dirtyFields).reduce<Record<string, string>>(
            (acc, field) => {
              acc[field] = values[field] ?? "";
              return acc;
            },
            {},
          ),
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        setDeployError(message || "Deploy failed.");
        setDeployStatus("error");
        return;
      }

      setDeployStatus("success");
      clearDirty();
    } catch (e) {
      setDeployError(e instanceof Error ? e.message : "Deploy failed.");
      setDeployStatus("error");
    }
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 bg-paper shadow-sm">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-s6 px-s8 py-s4">
        <div className="flex flex-col gap-1">
          <div className="text-[14px] font-semibold tracking-[-0.02em] text-ink">
            Changes ready to deploy
          </div>
          <div className="text-[13px] text-ink/70">
            {dirtyFields.size} field{dirtyFields.size === 1 ? "" : "s"} modified
            {deployStatus === "pending" ? " • Deploying…" : null}
            {deployStatus === "success" ? " • Deployed" : null}
          </div>
          {deployError ? (
            <div className="text-[13px] text-ink">{deployError}</div>
          ) : null}
        </div>

        <Button
          variant="primary"
          type="button"
          onClick={onDeploy}
          disabled={deployStatus === "pending"}
          className={deployStatus === "pending" ? "opacity-70" : ""}
        >
          Deploy Changes
        </Button>
      </div>
    </div>
  );
}

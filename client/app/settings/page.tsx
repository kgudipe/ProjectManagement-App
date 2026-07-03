"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { useGetAuthUserQuery, useUpdateUserMutation } from "@/state/api";

const labelStyles = "block text-sm font-semibold text-gray-700 dark:text-gray-200";
const textStyles = "control-input mt-1";

const Settings = () => {
  const { data: authData, isLoading } = useGetAuthUserQuery({});
  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation();

  const userDetails = authData?.userDetails;
  const cognitoId = authData?.userSub as string | undefined;
  const email = authData?.user?.signInDetails?.loginId ?? "—";

  const [username, setUsername] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const visibleUsername = username ?? userDetails?.username ?? "";

  const handleSave = async () => {
    if (!cognitoId || !visibleUsername.trim()) return;
    setStatus(null);
    try {
      await updateUser({ cognitoId, username: visibleUsername.trim() }).unwrap();
      setStatus("Saved");
    } catch {
      setStatus("Could not save changes");
    }
  };

  if (isLoading) return <div className="page-pad text-gray-600 dark:text-gray-300">Loading...</div>;

  return (
    <div className="page-pad">
      <Header name="Settings" />
      <div className="surface-card max-w-xl space-y-5 p-5">
        <div>
          <label className={labelStyles}>Username</label>
          <input
            className={textStyles}
            value={visibleUsername}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className={labelStyles}>Email</label>
          <div className={textStyles}>{email}</div>
        </div>
        <div>
          <label className={labelStyles}>Team</label>
          <div className={textStyles}>{userDetails?.teamId ?? "Unassigned"}</div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving || !visibleUsername.trim()}
            className="primary-button"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
          {status && <span className="text-sm text-gray-600 dark:text-gray-300">{status}</span>}
        </div>
      </div>
    </div>
  );
};

export default Settings;

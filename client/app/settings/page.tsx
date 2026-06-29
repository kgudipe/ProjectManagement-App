"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useGetAuthUserQuery, useUpdateUserMutation } from "@/state/api";

const labelStyles = "block text-sm font-medium dark:text-white";
const textStyles =
  "mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm dark:bg-dark-tertiary dark:text-white";

const Settings = () => {
  const { data: authData, isLoading } = useGetAuthUserQuery({});
  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation();

  const userDetails = authData?.userDetails;
  const cognitoId = authData?.userSub as string | undefined;
  const email = authData?.user?.signInDetails?.loginId ?? "—";

  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (userDetails?.username) setUsername(userDetails.username);
  }, [userDetails?.username]);

  const handleSave = async () => {
    if (!cognitoId || !username.trim()) return;
    setStatus(null);
    try {
      await updateUser({ cognitoId, username: username.trim() }).unwrap();
      setStatus("Saved");
    } catch {
      setStatus("Could not save changes");
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <Header name="Settings" />
      <div className="max-w-xl space-y-4">
        <div>
          <label className={labelStyles}>Username</label>
          <input
            className={textStyles}
            value={username}
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
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving || !username.trim()}
            className="rounded bg-blue-primary px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
          {status && <span className="text-sm dark:text-white">{status}</span>}
        </div>
      </div>
    </div>
  );
};

export default Settings;

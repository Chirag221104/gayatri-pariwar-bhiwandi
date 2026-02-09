"use client";

import { useEffect } from "react";

/**
 * Hook to warn the user before they leave a page with unsaved changes.
 * @param isDirty Whether there are unsaved changes
 */
export function useWarnUnsavedChanges(isDirty: boolean) {
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = ""; // Required for Chrome
                return "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty]);
}

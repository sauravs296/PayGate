"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";

export function ApiPageToastTrigger() {
  const params = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (params.get("created") === "1") {
      showToast(
        "success",
        "API Created Successfully! 🎉",
        "Your API is live and ready to accept payments on PayGate."
      );
      // Clean the query param from the URL without a reload
      router.replace("/apis", { scroll: false });
    } else if (params.get("updated") === "1") {
      showToast(
        "success",
        "API Updated",
        "Your changes have been saved successfully."
      );
      router.replace("/apis", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

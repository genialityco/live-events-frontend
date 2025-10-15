import { useContext } from "react";
import { OrgBrandingContext } from "./OrgBrandingContext";

export function useOrgBranding() {
  const ctx = useContext(OrgBrandingContext);
  if (!ctx) {
    throw new Error("useOrgBranding must be used within OrgBrandingProvider");
  }
  return ctx;
}

import { createContext } from "react";

export type OrgBranding = {
  orgId?: string;
  name?: string;
  logoUrl?: string;
};

export type OrgBrandingContextType = {
  branding: OrgBranding;
  setBranding: (b: OrgBranding) => void;
  clearBranding: () => void;
};

export const OrgBrandingContext = createContext<OrgBrandingContextType | null>(
  null
);

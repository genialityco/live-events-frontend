// src/brand/OrgBrandingProvider.tsx
import { useState, useCallback, useMemo } from "react";
import { type OrgBranding, OrgBrandingContext } from "./OrgBrandingContext";

export function OrgBrandingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [branding, setBrandingState] = useState<OrgBranding>({});

  const setBranding = useCallback((b: OrgBranding) => setBrandingState(b), []);
  const clearBranding = useCallback(() => setBrandingState({}), []);

  const value = useMemo(
    () => ({ branding, setBranding, clearBranding }),
    [branding, setBranding, clearBranding]
  );

  return (
    <OrgBrandingContext.Provider value={value}>
      {children}
    </OrgBrandingContext.Provider>
  );
}

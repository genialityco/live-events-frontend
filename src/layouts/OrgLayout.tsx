// src/layouts/OrgLayout.tsx
import { Outlet, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useOrgBranding } from "../brand";
import { fetchOrganizationById } from "../services/organizationsService";

export default function OrgLayout() {
  const { orgId } = useParams<{ orgId: string }>();
  const { branding, setBranding, clearBranding } = useOrgBranding();
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!orgId) return;

    // Si ya tenemos el mismo orgId cargado, no refetch
    if (branding.orgId === orgId) return;

    // Evita solicitudes concurrentes
    if (loadingRef.current) return;
    loadingRef.current = true;

    let active = true;
    (async () => {
      try {
        const org = await fetchOrganizationById(orgId);
        if (!active) return;
        setBranding({
          orgId: org._id,
          name: org.name,
          logoUrl: org.logoUrl,
        });
      } catch (e) {
        console.error(e)
        // opcional: manejar error / notificación
        setBranding({ orgId });
      } finally {
        loadingRef.current = false;
      }
    })();

    return () => {
      active = false;
      // Limpia branding al salir del scope de esta org
      clearBranding();
    };
    // Intencionalmente solo dependemos de orgId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  return <Outlet />;
}

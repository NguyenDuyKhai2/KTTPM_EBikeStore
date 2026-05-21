import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@ebike/shared-code/hooks";
import ManagerSidebar from "../components/manager/ManagerSidebar";
import ManagerTopNav from "../components/manager/ManagerTopNav";

const ManagerLayout = () => {
  const { isBootstrapping, isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-500">
        Đang tải phiên làm việc...
      </div>
    );
  }

  if (!isAuthenticated || !user?.roles.includes("MANAGER")) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Đóng menu"
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <ManagerSidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="min-h-screen lg:ml-[248px]">
        <ManagerTopNav onMenuClick={() => setMobileNavOpen(true)} />
        <main className="px-4 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;

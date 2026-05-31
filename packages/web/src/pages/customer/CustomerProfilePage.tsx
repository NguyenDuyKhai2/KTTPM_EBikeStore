import { CheckCircle2, LogOut, Save, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@ebike/shared-code/api";
import { useAuth } from "@ebike/shared-code/hooks";
import type { UserProfileResponse } from "@ebike/shared-code/types";

const CustomerProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isBootstrapping, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isBootstrapping && !isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, isBootstrapping, navigate]);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      if (isBootstrapping || !isAuthenticated) {
        return;
      }

      setLoading(true);
      setError("");
      try {
        const response = await authAPI.getProfile();
        if (!mounted) {
          return;
        }
        setProfile(response);
        setForm({
          firstName: response.firstName ?? "",
          lastName: response.lastName ?? ""
        });
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "Không thể tải hồ sơ lúc này.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadProfile();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, isBootstrapping]);

  const displayName = useMemo(() => {
    if (!profile) {
      return "Tài khoản";
    }
    return [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() || profile.username;
  }, [profile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await authAPI.updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim()
      });
      setProfile(response);
      setSuccess("Đã cập nhật hồ sơ.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể cập nhật hồ sơ.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="overflow-hidden rounded-lg border border-outline-variant/15 bg-white shadow-sm lg:col-span-7">
        <div className="border-b border-outline-variant/10 bg-surface-container-lowest px-6 py-5">
          <span className="mono-label text-primary">Hồ sơ khách hàng</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Thông tin tài khoản</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Cập nhật tên hiển thị và kiểm tra email đang dùng cho tài khoản Kinetic.
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              <div className="h-16 rounded-lg bg-surface-container-low" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-12 rounded-lg bg-surface-container-low" />
                <div className="h-12 rounded-lg bg-surface-container-low" />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <UserRound size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Xin chào</p>
                  <h3 className="truncate text-3xl font-bold tracking-tight">{displayName}</h3>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{profile?.email}</p>
                </div>
              </div>

              {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
              {success ? <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div> : null}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-foreground">Tên</span>
                    <input
                      value={form.firstName}
                      onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                      className="input-base bg-white"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-foreground">Họ</span>
                    <input
                      value={form.lastName}
                      onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                      className="input-base bg-white"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <button type="submit" disabled={saving} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
                    <Save size={16} />
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setProfile(null);
                    }}
                    className="btn-secondary"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>

      <aside className="space-y-6 lg:col-span-5">
        <div className="rounded-lg border border-outline-variant/15 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="text-primary" size={22} />
            <h3 className="text-xl font-bold tracking-tight">Trạng thái</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-4">
              <p className="text-sm text-muted-foreground">Tài khoản</p>
              <p className="mt-1 flex items-center gap-2 font-bold text-foreground">
                <CheckCircle2 size={16} className={profile?.active ? "text-emerald-600" : "text-muted-foreground"} />
                {profile?.active ? "Đang hoạt động" : "Tạm khóa"}
              </p>
            </div>
            <div className="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-4">
              <p className="text-sm text-muted-foreground">Xác minh</p>
              <p className="mt-1 flex items-center gap-2 font-bold text-foreground">
                <CheckCircle2 size={16} className={profile?.verified ? "text-emerald-600" : "text-muted-foreground"} />
                {profile?.verified ? "Đã xác minh" : "Chưa xác minh"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-outline-variant/15 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-bold tracking-tight">Vai trò và quyền</h3>
          <div className="mb-5 flex flex-wrap gap-2">
            {(profile?.roles ?? []).map((role) => (
              <span key={role} className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                {role}
              </span>
            ))}
          </div>
          <div className="max-h-48 overflow-y-auto pr-1">
            <div className="flex flex-wrap gap-2">
              {(profile?.permissions ?? []).map((permission) => (
                <span key={permission} className="rounded-md border border-outline-variant/20 bg-white px-3 py-1.5 text-xs text-muted-foreground">
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CustomerProfilePage;

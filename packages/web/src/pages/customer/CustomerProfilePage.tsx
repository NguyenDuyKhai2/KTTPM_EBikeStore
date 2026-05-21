import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@ebike/shared-code/api";
import { useAuth } from "@ebike/shared-code/hooks";
import type { UserProfileResponse } from "@ebike/shared-code/types";
import SectionShell from "../../components/common/SectionShell";

const CustomerProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isBootstrapping, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

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
          lastName: response.lastName ?? "",
          email: response.email ?? ""
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
        lastName: form.lastName.trim(),
        email: form.email.trim()
      });
      setProfile(response);
      setSuccess("Đã cập nhật hồ sơ.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Không thể cập nhật hồ sơ.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordSaving(true);
    setPasswordError("");
    setPasswordSuccess("");

    const currentPassword = passwordForm.currentPassword.trim();
    const newPassword = passwordForm.newPassword.trim();
    const confirmPassword = passwordForm.confirmPassword.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Vui lòng nhập đầy đủ thông tin mật khẩu.");
      setPasswordSaving(false);
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordSuccess("Đã đổi mật khẩu.");
    } catch (changeError) {
      setPasswordError(changeError instanceof Error ? changeError.message : "Không thể đổi mật khẩu.");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <SectionShell
      eyebrow="Hồ sơ khách hàng"
      title="Thông tin tài khoản"
      description="Quản lý thông tin cá nhân, trạng thái tài khoản và các quyền hiện đang được gán."
    >
      <div className="grid gap-6 px-6 py-8 lg:grid-cols-12">
        <section className="rounded-xl border border-outline-variant/15 bg-white p-6 lg:col-span-7">
          {loading ? (
            <p className="text-muted-foreground">Đang tải hồ sơ...</p>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm uppercase tracking-wider text-muted-foreground">Xin chào</p>
                <h2 className="mt-1 text-3xl font-bold">{displayName}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{profile?.email}</p>
              </div>

              {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
              {success ? <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div> : null}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-muted-foreground">Tên</span>
                    <input
                      value={form.firstName}
                      onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                      className="input-base"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-muted-foreground">Họ</span>
                    <input
                      value={form.lastName}
                      onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                      className="input-base"
                    />
                  </label>
                </div>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-muted-foreground">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    className="input-base"
                  />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button type="submit" disabled={saving} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
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
                    Đăng xuất
                  </button>
                </div>
              </form>
            </>
          )}
        </section>

        <section className="rounded-xl border border-outline-variant/15 bg-white p-6 lg:col-span-7">
          <div className="mb-6">
            <h3 className="text-xl font-bold">Đổi mật khẩu</h3>
            <p className="mt-2 text-sm text-muted-foreground">Cập nhật mật khẩu đăng nhập để bảo vệ tài khoản của bạn.</p>
          </div>

          {passwordError ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{passwordError}</div> : null}
          {passwordSuccess ? <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{passwordSuccess}</div> : null}

          <form className="space-y-5" onSubmit={handlePasswordSubmit}>
            <label className="space-y-2 block">
              <span className="text-sm font-semibold text-muted-foreground">Mật khẩu hiện tại</span>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
                className="input-base"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-muted-foreground">Mật khẩu mới</span>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                  className="input-base"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-muted-foreground">Xác nhận mật khẩu mới</span>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  className="input-base"
                />
              </label>
            </div>

            <button type="submit" disabled={passwordSaving} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60">
              {passwordSaving ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
            </button>
          </form>
        </section>

        <aside className="space-y-6 lg:col-span-5">
          <div className="rounded-xl border border-outline-variant/15 bg-white p-6">
            <h3 className="mb-4 text-xl font-bold">Trạng thái</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-surface-container-low p-4">
                <p className="text-sm text-muted-foreground">Tài khoản</p>
                <p className="mt-1 font-bold">{profile?.active ? "Đang hoạt động" : "Tạm khóa"}</p>
              </div>
              <div className="rounded-lg bg-surface-container-low p-4">
                <p className="text-sm text-muted-foreground">Xác minh</p>
                <p className="mt-1 font-bold">{profile?.verified ? "Đã xác minh" : "Chưa xác minh"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/15 bg-white p-6">
            <h3 className="mb-4 text-xl font-bold">Vai trò và quyền</h3>
            <div className="mb-5 flex flex-wrap gap-2">
              {(profile?.roles ?? []).map((role) => (
                <span key={role} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {role}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile?.permissions ?? []).map((permission) => (
                <span key={permission} className="rounded-lg border border-outline-variant/20 px-3 py-1 text-xs text-muted-foreground">
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </SectionShell>
  );
};

export default CustomerProfilePage;

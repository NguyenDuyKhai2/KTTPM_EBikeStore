import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, CircleAlert, KeyRound, Mail, RefreshCcw, ShieldCheck, User2 } from "lucide-react";
import { authAPI } from "@ebike/shared-code/api";
import { useAuth } from "@ebike/shared-code/hooks";
import type { UserProfileResponse } from "@ebike/shared-code/types";
import { useNavigate } from "react-router-dom";
import SectionShell from "../../components/common/SectionShell";

const pillBaseClass =
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.08em] uppercase";

const CustomerProfilePageApi = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const profileLabel = useMemo(() => {
    if (!profile) {
      return "";
    }

    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
    return fullName || user?.fullName || profile.username;
  }, [profile, user?.fullName]);

  useEffect(() => {
    if (!token) {
      navigate("/auth", { replace: true });
    }
  }, [navigate, token]);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!token) {
        if (isMounted) {
          setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem hồ sơ.");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const identity = user?.username || user?.email || (await authAPI.getUserFromToken());
        if (!identity) {
          throw new Error("Không thể xác định người dùng hiện tại từ phiên đăng nhập.");
        }

        const response = await authAPI.getProfile(identity);
        if (isMounted) {
          setProfile(response);
        }
      } catch (fetchError) {
        if (isMounted) {
          const message =
            fetchError instanceof Error ? fetchError.message : "Không thể tải hồ sơ từ hệ thống lúc này.";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [token, user?.email, user?.username]);

  return (
    <SectionShell
      eyebrow="Hồ Sơ Khách Hàng"
      title="Một trang hồ sơ gọn, sáng và bám dữ liệu thật từ backend."
      description="Trang này đọc JWT hiện tại, gọi API hồ sơ người dùng và hiển thị vai trò, trạng thái xác minh cùng quyền truy cập của tài khoản."
    >
      <div className="px-6 pb-12">
        <div className="relative overflow-hidden rounded-[32px] border border-emerald-100 bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(236,253,245,0.96)_46%,_rgba(239,246,255,0.96)_100%)] shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_38%)]" />
          <div className="relative grid gap-6 p-6 lg:grid-cols-[1.25fr_0.9fr] lg:p-8">
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-slate-950 text-white shadow-lg">
                    <User2 className="h-10 w-10" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">Identity</p>
                      <h2 className="text-3xl font-black tracking-tight text-slate-950">{profileLabel || "Hồ sơ tài khoản"}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`${pillBaseClass} ${
                          profile?.active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {profile?.active ? "Đang hoạt động" : "Tạm khóa"}
                      </span>
                      <span
                        className={`${pillBaseClass} ${
                          profile?.verified
                            ? "border-sky-200 bg-sky-50 text-sky-700"
                            : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        {profile?.verified ? "Đã xác minh" : "Chưa xác minh"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setProfile(null);
                  }}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Đăng xuất
                </button>
              </div>

              {isLoading ? (
                <div className="rounded-[24px] border border-slate-200 bg-white/90 p-6 text-slate-600">
                  <div className="mb-3 h-5 w-44 animate-pulse rounded-full bg-slate-200" />
                  <div className="mb-2 h-4 w-full animate-pulse rounded-full bg-slate-100" />
                  <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-100" />
                </div>
              ) : error ? (
                <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-5 text-rose-700">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]">
                    <CircleAlert className="h-4 w-4" />
                    Không tải được hồ sơ
                  </div>
                  <p className="m-0 text-sm leading-6">{error}</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <article className="rounded-[24px] border border-white/70 bg-white/95 p-5 shadow-sm">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Thông tin chính</p>
                    <div className="space-y-3 text-sm text-slate-700">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-emerald-600" />
                        <span>{profile?.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <User2 className="h-4 w-4 text-emerald-600" />
                        <span>@{profile?.username}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <BadgeCheck className="h-4 w-4 text-emerald-600" />
                        <span>Mã người dùng: #{profile?.userId}</span>
                      </div>
                    </div>
                  </article>

                  <article className="rounded-[24px] border border-white/70 bg-slate-950 p-5 text-white shadow-sm">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Tóm tắt quyền</p>
                    <div className="space-y-3">
                      <p className="m-0 text-sm text-slate-300">
                        Tài khoản hiện có {profile?.roles.length ?? 0} vai trò và {profile?.permissions.length ?? 0} quyền truy cập.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(profile?.roles ?? []).map((role) => (
                          <span key={role} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-white">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </div>
              )}
            </div>

            <div className="grid gap-4 self-start">
              <article className="rounded-[26px] border border-slate-200 bg-white/90 p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-sky-600" />
                  <h3 className="m-0 text-base font-bold text-slate-900">Vai trò hiện có</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(profile?.roles ?? []).map((role) => (
                    <span key={role} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-sky-700">
                      {role}
                    </span>
                  ))}
                  {!isLoading && !error && (profile?.roles.length ?? 0) === 0 ? (
                    <span className="text-sm text-slate-500">Chưa có vai trò nào được gán.</span>
                  ) : null}
                </div>
              </article>

              <article className="rounded-[26px] border border-slate-200 bg-white/90 p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <KeyRound className="h-5 w-5 text-emerald-600" />
                  <h3 className="m-0 text-base font-bold text-slate-900">Permissions từ API</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(profile?.permissions ?? []).map((permission) => (
                    <span
                      key={permission}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800"
                    >
                      {permission}
                    </span>
                  ))}
                  {!isLoading && !error && (profile?.permissions.length ?? 0) === 0 ? (
                    <span className="text-sm text-slate-500">Hệ thống chưa trả permission nào cho tài khoản này.</span>
                  ) : null}
                </div>
              </article>

              <article className="rounded-[26px] border border-amber-200 bg-amber-50/90 p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <RefreshCcw className="h-5 w-5 text-amber-700" />
                  <h3 className="m-0 text-base font-bold text-amber-950">Luồng dữ liệu</h3>
                </div>
                <p className="m-0 text-sm leading-6 text-amber-900">
                  Trang này dùng JWT đã lưu sau khi đăng nhập, xác định người dùng hiện tại và gọi endpoint hồ sơ để lấy dữ liệu thật từ backend Spring.
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

export default CustomerProfilePageApi;

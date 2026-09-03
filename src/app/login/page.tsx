"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { setAuthSession } from "@/config/auth";
import { USERS, type UserRole } from "@/config/userConfig";


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const proposalId =
    searchParams.get("proposalId") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const handleLogin = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    const user = USERS.find(
      (item) =>
        item.email === normalizedEmail &&
        item.password === password
    );

    if (!user) {
      setError(
        "Invalid email or password. Please try again."
      );
      return;
    }

    setIsLoading(true);

    setAuthSession({
      email: user.email,
      role: user.role,
    });




    const dashboardUrl = proposalId
      ? `/dashboard?proposalId=${encodeURIComponent(proposalId)}`
      : "/dashboard";

    router.push(dashboardUrl);




    // if (user.role === "Planner") {
    //   if (!proposalId) {
    //     setError(
    //       "Proposal ID is missing. Please start planning from the proposal."
    //     );
    //     setIsLoading(false);
    //     return;
    //   }

    //   router.push(
    //     `/proposal/${proposalId}/availability`
    //   );

    //   return;
    // }

    // if (
    //   user.role === "National Admin" ||
    //   user.role === "State Admin" ||
    //   user.role === "District Admin" ||
    //   user.role === "Block Admin" ||
    //   user.role === "Approver"
    // ) {
    //   if (!proposalId) {
    //     setError(
    //       "Proposal ID is missing. Please start from the proposal."
    //     );
    //     setIsLoading(false);
    //     return;
    //   }

    //   router.push(
    //     `/location?proposalId=${encodeURIComponent(
    //       proposalId
    //     )}`
    //   );

    //   return;
    // }

    setIsLoading(false);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef5f8] px-4 py-8">

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full border border-[#075a91]/10" />

        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full border border-[#f58220]/10" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#075a91 1px, transparent 1px), linear-gradient(90deg,#075a91 1px,transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />

      </div>


      {/* LOGIN CARD */}

      <section className="relative z-10 w-full max-w-[920px] overflow-hidden rounded-[12px] border border-[#c9dce7] bg-white shadow-[0_18px_55px_rgba(0,59,99,0.14)]">

        {/* TOP ACCENT */}

        <div className="flex h-[4px] w-full">
          <div className="flex-1 bg-[#075a91]" />
          <div className="w-[120px] bg-[#f58220]" />
        </div>


        <div className="grid md:grid-cols-[1fr_390px]">

          {/* LEFT BRAND */}

          <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#003b63] via-[#075a91] to-[#087fb8] p-10 md:flex md:flex-col md:justify-between">

            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/10" />

            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-white/10" />


            <div className="relative">

              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-[8px] border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur">
                <ShieldCheck
                  size={24}
                  strokeWidth={1.8}
                />
              </div>

              <div className="text-[8px] font-extrabold uppercase tracking-[2px] text-[#f58220]">
                VGPP
              </div>

              <h1 className="mt-2 text-[28px] font-extrabold leading-tight text-white">
                Planning &
                <br />
                Governance
                <br />
                Platform
              </h1>

              <p className="mt-5 max-w-[330px] text-[11px] leading-relaxed text-white/65">
                Secure access to geographical planning,
                requirements, VGP AAP and approval
                workflows.
              </p>

            </div>


            <div className="relative">

              <div className="mb-3 h-px w-full bg-white/10" />

              <div className="flex items-center justify-between">

                <span className="text-[8px] font-semibold uppercase tracking-[1px] text-white/45">
                  GIS PLANNING SYSTEM
                </span>

                <span className="flex items-center gap-1.5 text-[8px] font-bold text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f58220]" />
                  SECURE LOGIN
                </span>

              </div>

            </div>

          </div>


          {/* RIGHT LOGIN */}

          <div className="p-6 sm:p-8">

            {/* MOBILE BRAND */}

            <div className="mb-6 flex items-center gap-3 md:hidden">

              <div className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#075a91] text-white">
                <ShieldCheck size={17} />
              </div>

              <div>

                <div className="text-[8px] font-extrabold uppercase tracking-[1.3px] text-[#f58220]">
                  VGPP
                </div>

                <div className="text-[14px] font-extrabold text-[#003b63]">
                  Planning Platform
                </div>

              </div>

            </div>


            {/* TITLE */}

            <div className="mb-7">

              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-[7px] bg-[#eaf6fd] text-[#075a91]">
                <LogIn size={17} />
              </div>

              <h2 className="text-[21px] font-extrabold tracking-tight text-[#003b63]">
                Welcome Back
              </h2>

              <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
                Sign in to continue to the VGPP
                planning workspace.
              </p>

            </div>


            <form
              onSubmit={handleLogin}
              className="space-y-4"
            >

              {/* EMAIL */}

              <div>

                <label className="mb-1.5 block text-[8px] font-extrabold uppercase tracking-[0.8px] text-[#475569]">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email"
                    autoComplete="username"
                    className="h-11 w-full rounded-[6px] border border-[#cbdde7] bg-[#f9fbfc] pl-9 pr-3 text-[10px] font-medium text-[#20354a] outline-none transition placeholder:text-slate-400 focus:border-[#075a91] focus:bg-white focus:ring-2 focus:ring-[#075a91]/10"
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div>

                <label className="mb-1.5 block text-[8px] font-extrabold uppercase tracking-[0.8px] text-[#475569]">
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-11 w-full rounded-[6px] border border-[#cbdde7] bg-[#f9fbfc] pl-9 pr-10 text-[10px] font-medium text-[#20354a] outline-none transition placeholder:text-slate-400 focus:border-[#075a91] focus:bg-white focus:ring-2 focus:ring-[#075a91]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-[#075a91]"
                    title={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>

                </div>

              </div>


              {/* ERROR */}

              {error && (
                <div className="rounded-[6px] border border-[#fecaca] bg-[#fff5f5] px-3 py-2.5">

                  <div className="flex items-start gap-2">

                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#dc2626]" />

                    <p className="text-[8px] font-semibold leading-relaxed text-[#b91c1c]">
                      {error}
                    </p>

                  </div>

                </div>
              )}


              {/* LOGIN */}

              <button
                type="submit"
                disabled={isLoading}
                className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-[#075a91] text-[9px] font-extrabold uppercase tracking-[0.7px] text-white shadow-[0_6px_16px_rgba(7,90,145,0.20)] transition hover:bg-[#003b63] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {isLoading
                  ? "Signing In..."
                  : "Sign In"}

                {!isLoading && (
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                )}

              </button>

            </form>


            {/* DEMO CREDENTIALS */}

            <div className="mt-6 rounded-[7px] border border-[#dce8ef] bg-[#f7fafc] p-3.5">

              <div className="mb-2 text-[7px] font-extrabold uppercase tracking-[1px] text-[#075a91]">
                Demo Access
              </div>

              <div className="space-y-1.5 text-[8px] text-slate-500">

                <div className="flex justify-between gap-3">
                  <span>National Admin</span>
                  <span className="font-semibold text-[#003b63]">
                    national@gmail.com
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>State Admin</span>
                  <span className="font-semibold text-[#003b63]">
                    state@gmail.com
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>District Admin</span>
                  <span className="font-semibold text-[#003b63]">
                    district@gmail.com
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>Block Admin</span>
                  <span className="font-semibold text-[#003b63]">
                    block@gmail.com
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>Panchayat / Planner</span>
                  <span className="font-semibold text-[#003b63]">
                    panchayat@gmail.com
                  </span>
                </div>

              </div>

            </div>


            <p className="mt-5 text-center text-[7px] text-slate-400">
              VGPP • GIS ENABLED PLANNING
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}
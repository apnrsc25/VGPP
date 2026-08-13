"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CURRENT_USER_ROLE } from "@/config/userConfig";

const ASHOKA_IMG =
  "https://bhuvan-app2.nrsc.gov.in/planner_v3/img/Ashoka.png";

const LOGO_IMG =
  "https://bhuvan-app2.nrsc.gov.in/planner_v3/img/LOGO.png";

type ModalType = "contact" | "terms" | "updates" | null;

interface VGPPLandingProps {
  proposalId: string;
}

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function VGPPLanding({
  proposalId,
}: VGPPLandingProps) {
  const router = useRouter();

  const [modal, setModal] =
    useState<ModalType>(null);

  const handleNext = () => {
    if (CURRENT_USER_ROLE === "Planner") {
      router.push(
        `/proposal/${proposalId}/availability`
      );
      return;
    }

    router.push(
      `/location`
    );
  };

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#eef5f8] text-[#20354a]">

      {/* =====================================================
          BACKGROUND GEO PATTERN
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-24 -top-24 h-[280px] w-[280px] rounded-full border border-[#075a91]/10" />

        <div className="absolute -left-16 -top-16 h-[210px] w-[210px] rounded-full border border-[#f58220]/10" />

        <div className="absolute right-[-120px] top-[15%] h-[360px] w-[360px] rounded-full border border-[#075a91]/10" />

        <div className="absolute bottom-[-180px] left-[35%] h-[400px] w-[400px] rounded-full border border-[#f58220]/10" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#075a91 1px, transparent 1px), linear-gradient(90deg, #075a91 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>


      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="relative z-10 shrink-0 border-b border-[#c9dce8] bg-white/95 shadow-[0_3px_14px_rgba(0,59,99,0.08)] backdrop-blur">

        <div className="mx-auto flex h-[58px] w-full max-w-[1500px] items-center justify-between px-3 sm:h-[64px] sm:px-6 lg:px-8">

          {/* LEFT BRAND */}

          <div className="flex w-[65px] shrink-0 items-center sm:w-[100px] lg:w-[130px]">

            <img
              src={ASHOKA_IMG}
              alt="Ashoka Emblem"
              className="h-[34px] w-auto object-contain sm:h-[42px] lg:h-[46px]"
            />

          </div>


          {/* CENTER BRAND */}

          <div className="flex min-w-0 flex-1 flex-col items-center text-center">

            <div className="flex items-center gap-2">

              <span className="hidden h-[1px] w-5 bg-[#f58220] sm:block" />

              <h1 className="truncate text-[12px] font-bold tracking-[0.2px] text-[#075a91] sm:text-[16px] lg:text-[19px]">
                Viksit Gram Panchayat Planning
              </h1>

              <span className="hidden h-[1px] w-5 bg-[#f58220] sm:block" />

            </div>


            <div className="mt-0.5 flex items-center gap-1.5 text-[6px] font-semibold uppercase tracking-[1px] text-[#64748b] sm:text-[8px]">

              <span>Bhuvan Geoportal</span>

              <span className="text-[#f58220]">
                •
              </span>

              <span>NRSC</span>

              <span className="text-[#f58220]">
                •
              </span>

              <span>ISRO</span>

            </div>

          </div>


          {/* RIGHT BRAND */}

          <div className="flex w-[65px] shrink-0 justify-end sm:w-[100px] lg:w-[130px]">

            <img
              src={LOGO_IMG}
              alt="NRSC / Bhuvan Logo"
              className="h-[34px] w-auto object-contain sm:h-[42px] lg:h-[46px]"
            />

          </div>

        </div>


        {/* BRAND STRIPE */}

        <div className="flex h-[3px] w-full">

          <div className="w-[72%] bg-[#075a91]" />

          <div className="w-[28%] bg-[#f58220]" />

        </div>

      </header>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5">

        <section className="flex h-full max-h-[calc(100dvh-250px)] w-full max-w-[1180px] flex-col overflow-hidden rounded-[6px] border border-[#c8dce8] bg-white/95 shadow-[0_12px_45px_rgba(0,59,99,0.12)] backdrop-blur">

          {/* TOP ACCENT */}

          <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[#075a91] via-[#0c6fa6] to-[#f58220]" />


          {/* CONTENT GRID */}

          <div className="grid min-h-0 flex-1 lg:grid-cols-[1.3fr_0.7fr]">

            {/* =================================================
                LEFT CONTENT
            ================================================== */}

            <div className="flex min-h-0 flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-5">

              {/* EYEBROW */}

              <div className="mb-3 flex shrink-0 items-center gap-2">

                <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-[#075a91] text-[8px] font-bold text-white shadow-sm sm:h-7 sm:w-7 sm:text-[9px]">
                  VG
                </span>

                <div>

                  <div className="text-[7px] font-bold uppercase tracking-[1.3px] text-[#f58220] sm:text-[8px]">
                    Bhuvan Geospatial Initiative
                  </div>

                  <div className="mt-0.5 text-[8px] font-medium text-[#64748b]">
                    Gram Panchayat Planning Platform
                  </div>

                </div>

              </div>


              {/* HEADING */}

              <div className="max-w-[650px] shrink-0">

                <h2 className="text-[21px] font-extrabold leading-[1.1] tracking-[-0.4px] text-[#003b63] sm:text-[27px] lg:text-[32px]">

                  VGPP Geospatial

                  <span className="block text-[#075a91]">
                    Planning Portal
                  </span>

                </h2>


                <div className="mt-2 flex items-center gap-2">

                  <div className="h-[3px] w-12 rounded-full bg-[#075a91]" />

                  <div className="h-[3px] w-4 rounded-full bg-[#f58220]" />

                </div>

              </div>


              {/* INTRO */}

              <p className="mt-3 max-w-[700px] shrink-0 text-[9px] font-medium leading-[1.5] text-[#475569] sm:text-[10px] lg:text-[11px]">

                A geospatial planning portal built to support Gram Panchayat
                level planning of VGPP activities across India using spatial
                information, GIS-based analysis and decision-support tools.

              </p>


              {/* MOBILE DESCRIPTION */}

              <div className="mt-3 shrink-0 border-t border-[#e1ebf1] pt-3 text-[8px] leading-[1.5] text-[#526273] sm:hidden">

                <p>
                  VGPP brings together satellite imagery, thematic
                  information, geo-tagged assets and administrative
                  boundaries to support better Gram Panchayat level
                  planning and decision making.
                </p>

              </div>


              {/* DESKTOP / TABLET DESCRIPTION */}

              <div className="mt-4 hidden min-h-0 flex-1 overflow-hidden border-t border-[#e1ebf1] pt-3 text-[9px] leading-[1.5] text-[#526273] sm:block sm:text-[12px]">

                <div className="space-y-2">

                  <p>
                    Following the nationwide effort to geo-tag assets
                    created under VGPP, using GIS to identify upcoming
                    activities and their locations became a natural next
                    step — a need felt strongly by every stakeholder
                    involved. The Department of Rural Development (DoRD),
                    under MoRD, has pushed consistently for this
                    geospatial approach through pilot-level capacity
                    building and direct support for state functionaries.
                  </p>


                  <p>
                    The current phase of VGPP, as part of Bhuvan, draws on
                    multi-temporal IRS satellite imagery at better than
                    3 m detail in natural colour, along with digital
                    terrain data, thematic layers, and the locations of
                    VGPP works and watershed management assets.
                    Open-source tools power custom visualisation and
                    spatial analysis of these decision layers within
                    Yuktdhara.
                  </p>


                  <p>
                    Legacy national datasets — Land Use Land Cover,
                    roads and streams at 1:10,000 scale, plus groundwater
                    prospects, geomorphology, wasteland and land
                    degradation mapping at 1:50,000 scale — add further
                    depth to the planning process. Current Gram Panchayat
                    and related administrative boundaries allow analysis
                    to stay scoped to the right area.
                  </p>


                  <p>
                    Login is currently Gram Panchayat-specific,
                    supporting both the planning and approval steps
                    needed to evaluate and accept proposed activities —
                    broader user levels will be added over time.
                  </p>


                  <p>
                    The portal takes a functionary through selecting
                    their GP, choosing a work category, running spatial
                    analysis, identifying the asset, submitting for
                    approval, and — once later-stage tools such as
                    NREGASoft linkage are complete — final approval and
                    ingestion.
                  </p>


                  <p>
                    Functionary teams may run trial planning wherever
                    login access has already been shared. Access for
                    remaining Gram Panchayats is being rolled out as
                    multiple logins created for geo-tagging and
                    moderation are resolved.
                  </p>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="mt-3 flex shrink-0 flex-col-reverse gap-2 border-t border-[#d9e6ee] pt-3 sm:flex-row sm:items-center sm:justify-between">

                {/* ABOUT */}

                <button
                  type="button"
                  onClick={() =>
                    setModal("updates")
                  }
                  className="inline-flex min-h-8 cursor-pointer items-center justify-center gap-2 rounded-[3px] border border-[#075a91] bg-white px-4 py-1.5 text-[9px] font-bold text-[#075a91] transition-all hover:border-[#f58220] hover:bg-[#fff8f1] hover:text-[#d86d0b] active:scale-[0.98]"
                >

                  <span className="h-[5px] w-[5px] rounded-full bg-[#f58220]" />

                  About Yuktdhara

                </button>


                {/* NEXT */}

                <button
                  type="button"
                  onClick={handleNext}
                  className="group inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-[3px] bg-[#075a91] px-6 py-2 text-[9px] font-bold tracking-[0.4px] text-white shadow-[0_4px_12px_rgba(7,90,145,0.24)] transition-all hover:bg-[#003b63] hover:shadow-[0_6px_16px_rgba(0,59,99,0.30)] active:scale-[0.98]"
                >

                  <span>
                    Continue to Planning
                  </span>

                  <span className="text-[14px] transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>

                </button>

              </div>

            </div>


            {/* =================================================
                RIGHT VISUAL PANEL
            ================================================== */}

            <div className="relative hidden min-h-0 overflow-hidden bg-[#003b63] lg:block">

              {/* GRID */}

              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />


              {/* CIRCLES */}

              <div className="absolute -right-28 -top-28 h-[380px] w-[380px] rounded-full border border-white/10" />

              <div className="absolute -right-12 -top-12 h-[250px] w-[250px] rounded-full border border-[#f58220]/20" />

              <div className="absolute bottom-[-120px] left-[-100px] h-[320px] w-[320px] rounded-full border border-white/10" />


              {/* PANEL CONTENT */}

              <div className="relative flex h-full min-h-0 flex-col justify-between p-6">

                {/* TOP */}

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">

                    <span className="h-1.5 w-1.5 rounded-full bg-[#f58220]" />

                    <span className="text-[7px] font-bold uppercase tracking-[1.3px] text-white/80">
                      Geospatial Planning
                    </span>

                  </div>


                  <h3 className="mt-5 max-w-[280px] text-[22px] font-bold leading-[1.2] text-white">

                    Plan with

                    <span className="block text-[#f58220]">
                      spatial intelligence.
                    </span>

                  </h3>


                  <p className="mt-3 max-w-[300px] text-[9px] leading-[1.7] text-white/65">

                    Bring spatial information, assets, thematic layers
                    and planning decisions together in one integrated
                    workflow.

                  </p>

                </div>


                {/* GEO VISUAL */}

                <div className="relative mx-auto my-4 h-[180px] w-[180px]">

                  {/* OUTER CIRCLE */}

                  <div className="absolute inset-0 rounded-full border border-white/10" />

                  {/* SECOND CIRCLE */}

                  <div className="absolute inset-[20px] rounded-full border border-white/10" />

                  {/* INNER CIRCLE */}

                  <div className="absolute inset-[45px] rounded-full border border-[#f58220]/30" />


                  {/* ROUTES */}

                  <div className="absolute left-[25px] top-[82px] h-[1px] w-[130px] rotate-[-18deg] bg-[#f58220]/60" />

                  <div className="absolute left-[42px] top-[103px] h-[1px] w-[105px] rotate-[27deg] bg-white/25" />

                  <div className="absolute left-[76px] top-[40px] h-[120px] w-[1px] rotate-[28deg] bg-white/20" />


                  {/* NODES */}

                  <div className="absolute left-[38px] top-[52px] h-3 w-3 rounded-full border-2 border-white bg-[#f58220] shadow-[0_0_15px_rgba(245,130,32,0.65)]" />

                  <div className="absolute right-[35px] top-[68px] h-2.5 w-2.5 rounded-full border border-white bg-[#0c88c4]" />

                  <div className="absolute bottom-[45px] left-[75px] h-3 w-3 rounded-full border-2 border-white bg-[#f58220]" />

                  <div className="absolute bottom-[32px] right-[43px] h-2.5 w-2.5 rounded-full border border-white bg-[#0c88c4]" />


                  {/* CENTER */}

                  <div className="absolute left-1/2 top-1/2 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_0_35px_rgba(255,255,255,0.08)] backdrop-blur">

                    <div className="text-[15px] font-extrabold text-white">
                      GIS
                    </div>

                    <div className="mt-0.5 text-[6px] font-semibold uppercase tracking-[1px] text-white/55">
                      Planning
                    </div>

                  </div>

                </div>


                {/* BOTTOM INFO */}

                <div className="grid grid-cols-2 gap-2">


                </div>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="relative z-10 shrink-0 border-t-2 border-[#f58220] bg-[#003b63] text-white">

        <div className="mx-auto flex h-[34px] w-full max-w-[1500px] items-center justify-between px-3 sm:px-6">

          <span className="text-[7px] leading-none text-white/75 sm:text-[8px]">

            Application is best viewed at a screen resolution of
            1024×768 pixels or higher, in Chrome or Firefox.

          </span>


          <div className="flex shrink-0 items-center gap-2 text-[8px]">

            <button
              type="button"
              onClick={() =>
                setModal("contact")
              }
              className="cursor-pointer font-semibold text-white/90 transition hover:text-[#f58220] hover:underline"
            >
              Contact Us
            </button>


            <span className="text-white/30">
              |
            </span>


            <button
              type="button"
              onClick={() =>
                setModal("terms")
              }
              className="cursor-pointer font-semibold text-white/90 transition hover:text-[#f58220] hover:underline"
            >
              Terms
            </button>

          </div>

        </div>

      </footer>


      {/* =====================================================
          CONTACT MODAL
      ====================================================== */}

      {modal === "contact" && (
        <Modal
          title="Contact Us"
          onClose={() =>
            setModal(null)
          }
        >

          <strong className="text-[#075a91]">
            Our Office
          </strong>

          <p>
            Bhuvan Cell, National Remote Sensing Centre,
            Indian Space Research Organisation, Government
            of India, Balanagar, Hyderabad – 500 625, India.
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            +91-40-2388 4588 / 89
          </p>

          <p>
            <strong>Email:</strong>{" "}
            bhuvan [at] nrsc [dot] gov [dot] in
          </p>

          <p>
            For questions on Bhuvan products and services,
            visit the{" "}

            <a
              href="https://bhuvan.nrsc.gov.in/forum/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#075a91] underline decoration-[#f58220] underline-offset-2 hover:text-[#f58220]"
            >
              Discussion Forum
            </a>

            .
          </p>

        </Modal>
      )}


      {/* =====================================================
          TERMS MODAL
      ====================================================== */}

      {modal === "terms" && (
        <Modal
          title="Bhuvan Terms of Service"
          onClose={() =>
            setModal(null)
          }
        >

          <p>
            Downloading, installing, accessing, or using the
            Bhuvan website, plug-in, service, or any of its
            content means you agree to be bound by these terms.
          </p>


          <strong className="text-[#075a91]">
            Use of the products
          </strong>

          <p>
            DOS/ISRO/NRSC grants a non-exclusive,
            non-transferable licence to access the Bhuvan
            geoportal and its services, and to use the content
            made available through it.
          </p>


          <strong className="text-[#075a91]">
            Restrictions
          </strong>

          <ul className="list-disc space-y-1.5 pl-5">

            <li>
              Access the site only through the means the
              portal itself provides.
            </li>

            <li>
              Do not copy, translate, modify, or create
              derivative works from the content.
            </li>

            <li>
              Do not redistribute, sell, sublicense, or
              otherwise pass content to third parties.
            </li>

            <li>
              Do not reverse-engineer or decompile the service.
            </li>

            <li>
              Do not bulk-download or mass-feed any content,
              including coordinates or imagery.
            </li>

            <li>
              Do not remove or alter any notice, warning,
              or rights link shown on the site.
            </li>

            <li>
              Do not use the content for real-time navigation
              or autonomous vehicle control.
            </li>

          </ul>


          <strong className="text-[#075a91]">
            Content on the Bhuvan website
          </strong>

          <p>
            Bhuvan gives access to a range of content — IRS
            imagery, map and terrain data, administrative
            boundaries, soils, census data, and more —
            provided by Bhuvan, its licensors, and its users.
          </p>

          <p>
            This content is for viewing purposes only;
            DOS/ISRO/NRSC and its licensors retain all
            ownership rights, and using the site does not
            transfer any rights to you. Some content originates
            from other departments and carries its own
            copyright protections.
          </p>

        </Modal>
      )}


      {/* =====================================================
          UPDATES MODAL
      ====================================================== */}

      {modal === "updates" && (
        <Modal
          title="Bhuvan VGPP Application Updates"
          onClose={() =>
            setModal(null)
          }
        >

          <p>
            Support has been added for including line department
            (convergence) works during the VGPP planning phase.
          </p>

        </Modal>
      )}

    </div>
  );
}


/* ============================================================
   MODAL
============================================================ */

function Modal({
  title,
  children,
  onClose,
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#003b63]/50 px-3 py-4 backdrop-blur-[3px] sm:px-5"
      onClick={onClose}
    >

      <div
        className="relative flex max-h-[88dvh] w-full max-w-[680px] flex-col overflow-hidden rounded-[5px] border border-[#c8dce8] bg-white shadow-[0_18px_50px_rgba(0,59,99,0.28)]"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ACCENT */}

        <div className="h-[4px] shrink-0 bg-gradient-to-r from-[#075a91] via-[#0c6fa6] to-[#f58220]" />


        {/* MODAL HEADER */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#dce8ef] bg-[#f6fafc] px-4 py-3 sm:px-6">

          <div>

            <h3 className="text-[13px] font-bold text-[#075a91] sm:text-[15px]">
              {title}
            </h3>

            <div className="mt-1 h-[2px] w-8 bg-[#f58220]" />

          </div>


          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#cbd5e1] text-[17px] leading-none text-[#64748b] transition hover:border-[#f58220] hover:bg-[#fff7ed] hover:text-[#d86d0b]"
          >
            ×
          </button>

        </div>


        {/* MODAL BODY */}

        <div className="min-h-0 overflow-y-auto px-4 py-4 text-[9px] leading-[1.65] text-[#475569] sm:px-6 sm:py-5 sm:text-[10px]">

          <div className="space-y-3">
            {children}
          </div>

        </div>

      </div>

    </div>
  );
}
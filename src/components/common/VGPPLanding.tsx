"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  children: React.ReactNode;
  onClose: () => void;
}

export default function VGPPLanding({
  proposalId,
}: VGPPLandingProps) {
  const router = useRouter();

  const [modal, setModal] = useState<ModalType>(null);

  const handleNext = () => {
    router.push(`/proposal/${proposalId}/availability`);
  };

  return (
    <div className="min-h-screen bg-[#eaf2f6] text-[#172b4d] flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="h-[72px] shrink-0 border-b-2 border-[#005a91] bg-white">
        <div className="mx-auto flex h-full items-center justify-between px-5">
          {/* Ashoka */}
          <div className="flex h-full w-[120px] items-center">
            <img
              src={ASHOKA_IMG}
              alt="Ashoka Emblem"
              className="h-[48px] w-auto object-contain"
            />
          </div>

          {/* Center Title */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <h1 className="text-[17px] font-bold leading-tight text-[#005a91]">
              Viksit Gram Panchayat Planning
            </h1>

            <span className="mt-[2px] text-[9px] font-medium text-slate-500">
              Bhuvan Geoportal · NRSC · ISRO
            </span>
          </div>

          {/* NRSC Logo */}
          <div className="flex h-full w-[120px] items-center justify-end">
            <img
              src={LOGO_IMG}
              alt="NRSC / Bhuvan Logo"
              className="h-[48px] w-auto object-contain"
            />
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex flex-1 items-start justify-center px-4 py-7">
        <section className="w-full max-w-[820px] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.12)]">
          {/* Content */}
          <div className="px-7 py-6">
            <h2 className="mb-4 text-[15px] font-bold text-[#005a91]">
              VGPP Geospatial Planning Portal
            </h2>

            <div className="space-y-3 text-[11px] leading-[1.65] text-slate-700">
              <p>
                VGPP is a geospatial planning portal built to support Gram
                Panchayat level planning of VGPP activities across India. The
                portal brings together a wide range of spatial information so
                planning can take a holistic, GIS-based approach using
                open-source tools.
              </p>

              <p>
                Following the nationwide effort to geo-tag assets created under
                VGPP, using GIS to identify upcoming activities and their
                locations became a natural next step — a need felt strongly by
                every stakeholder involved. The Department of Rural Development
                (DoRD), under MoRD, has pushed consistently for this geospatial
                approach through pilot-level capacity building and direct
                support for state functionaries.
              </p>

              <p>
                The current phase of VGPP, as part of Bhuvan, draws on
                multi-temporal IRS satellite imagery at better than 3 m detail
                in natural colour, along with digital terrain data, thematic
                layers, and the locations of VGPP works and watershed
                management assets. Open-source tools power custom visualisation
                and spatial analysis of these decision layers within
                Yuktdhara.
              </p>

              <p>
                Legacy national datasets — Land Use Land Cover, roads and
                streams at 1:10,000 scale, plus groundwater prospects,
                geomorphology, wasteland and land degradation mapping at
                1:50,000 scale — add further depth to the planning process.
                Current Gram Panchayat and related administrative boundaries
                allow analysis to stay scoped to the right area.
              </p>

              <p>
                Login is currently Gram Panchayat-specific, supporting both
                the planning and approval steps needed to evaluate and accept
                proposed activities — broader user levels will be added over
                time.
              </p>

              <p>
                The portal takes a functionary through selecting their GP,
                choosing a work category, running spatial analysis, identifying
                the asset, submitting for approval, and — once later-stage
                tools such as NREGASoft linkage are complete — final approval
                and ingestion.
              </p>

              <p>
                Functionary teams may run trial planning wherever login access
                has already been shared. Access for remaining Gram Panchayats
                is being rolled out as multiple logins created for geo-tagging
                and moderation are resolved.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setModal("updates")}
                className="rounded-[2px] bg-[#075a91] px-4 py-2 text-[10px] font-semibold text-white shadow-sm transition hover:bg-[#064d7b] cursor-pointer"
              >
                About Yuktdhara
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="rounded-[2px] bg-[#075a91] px-5 py-2 text-[10px] font-semibold text-white shadow-sm transition hover:bg-[#064d7b] cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="h-[36px] shrink-0 bg-[#075a91] px-3 text-white">
        <div className="flex h-full items-center justify-between text-[8px]">
          <span>
            Application is best viewed at a screen resolution of 1024×768
            pixels or higher, in Chrome or Firefox.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModal("contact")}
              className="font-semibold hover:underline"
            >
              Contact Us
            </button>

            <span className="opacity-70">|</span>

            <button
              type="button"
              onClick={() => setModal("terms")}
              className="font-semibold hover:underline"
            >
              Terms
            </button>
          </div>
        </div>
      </footer>

      {/* ================= MODALS ================= */}

      {modal === "contact" && (
        <Modal
          title="Contact Us"
          onClose={() => setModal(null)}
        >
          <strong>Our Office</strong>

          <p>
            Bhuvan Cell, National Remote Sensing Centre, Indian Space
            Research Organisation, Government of India, Balanagar,
            Hyderabad – 500 625, India.
          </p>

          <p>Phone: +91-40-2388 4588 / 89</p>

          <p>Email: bhuvan [at] nrsc [dot] gov [dot] in</p>

          <p>
            For questions on Bhuvan products and services, visit the{" "}
            <a
              href="https://bhuvan.nrsc.gov.in/forum/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#075a91] underline"
            >
              Discussion Forum
            </a>
            .
          </p>
        </Modal>
      )}

      {modal === "terms" && (
        <Modal
          title="Bhuvan Terms of Service"
          onClose={() => setModal(null)}
        >
          <p>
            Downloading, installing, accessing, or using the Bhuvan website,
            plug-in, service, or any of its content means you agree to be
            bound by these terms.
          </p>

          <strong>Use of the products</strong>

          <p>
            DOS/ISRO/NRSC grants a non-exclusive, non-transferable licence to
            access the Bhuvan geoportal and its services, and to use the
            content made available through it.
          </p>

          <strong>Restrictions</strong>

          <ul className="list-disc space-y-1 pl-5">
            <li>
              Access the site only through the means the portal itself
              provides.
            </li>
            <li>
              Do not copy, translate, modify, or create derivative works from
              the content.
            </li>
            <li>
              Do not redistribute, sell, sublicense, or otherwise pass
              content to third parties.
            </li>
            <li>Do not reverse-engineer or decompile the service.</li>
            <li>
              Do not bulk-download or mass-feed any content, including
              coordinates or imagery.
            </li>
            <li>
              Do not remove or alter any notice, warning, or rights link shown
              on the site.
            </li>
            <li>
              Do not use the content for real-time navigation or autonomous
              vehicle control.
            </li>
          </ul>

          <strong>Content on the Bhuvan website</strong>

          <p>
            Bhuvan gives access to a range of content — IRS imagery, map and
            terrain data, administrative boundaries, soils, census data, and
            more — provided by Bhuvan, its licensors, and its users.
          </p>

          <p>
            This content is for viewing purposes only; DOS/ISRO/NRSC and its
            licensors retain all ownership rights, and using the site does not
            transfer any rights to you. Some content originates from other
            departments and carries its own copyright protections.
          </p>
        </Modal>
      )}

      {modal === "updates" && (
        <Modal
          title="Bhuvan VGPP Application Updates"
          onClose={() => setModal(null)}
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

/* ================= MODAL ================= */

function Modal({
  title,
  children,
  onClose,
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[80vh] w-full max-w-[650px] overflow-y-auto rounded-sm bg-white p-6 text-[11px] leading-relaxed text-slate-700 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-3 text-xl leading-none text-slate-500 hover:text-slate-900"
        >
          ×
        </button>

        <h3 className="mb-4 border-b border-slate-200 pb-2 text-[15px] font-bold text-[#075a91]">
          {title}
        </h3>

        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}
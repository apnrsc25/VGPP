"use client";

import {
    CheckCircle2,
    ClipboardCheck,
    FileCheck2,
    Printer,
    ShieldCheck,
    Stamp,
    MapPinned,
} from "lucide-react";


interface SelectedWork {
    id: string;
    workName: string;
    theme: string;
    subTheme: string;
    type: string;
    geotagged: boolean;
}

interface ApprovalRightPanelProps {
    finalWorks: SelectedWork[];
    proposalId: string;
}

export default function ApprovalRightPanel({
    finalWorks,
    proposalId,
}: ApprovalRightPanelProps) {

    const geotaggedCount = finalWorks.filter(
        (work) => work.geotagged
    ).length;

    const notGeotaggedCount =
        finalWorks.length - geotaggedCount;

    const readyCount = finalWorks.length;

    const allGeotagged =
        finalWorks.length > 0 &&
        geotaggedCount === finalWorks.length;

    return (
        <section className="flex min-h-[560px] min-w-0 flex-col overflow-hidden rounded-[10px] border border-[#d5e2ea] bg-white shadow-[0_4px_18px_rgba(0,59,99,0.08)] xl:min-h-0">

            {/* =====================================================
          HEADER
      ====================================================== */}

            <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#d7e5ed] bg-gradient-to-r from-[#f8fbfd] via-white to-[#fffaf5] px-3">

                {/* LEFT */}

                <div className="flex min-w-0 items-center gap-2.5">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#008f6a] text-white shadow-sm">
                        <ShieldCheck size={14} />
                    </div>

                    <div className="min-w-0">

                        <h2 className="truncate text-[11px] font-extrabold uppercase tracking-[0.45px] text-[#183b56] sm:text-[12px]">
                            Approval Review
                        </h2>

                        <p className="truncate text-[7px] text-slate-400 sm:text-[8px]">
                            Final verification before submission
                        </p>

                    </div>

                </div>


                {/* RIGHT */}

                <div className="flex shrink-0 items-center gap-1.5">

                    <span className="rounded-full border border-[#cce8da] bg-[#effbf5] px-2 py-1 text-[6px] font-extrabold text-[#00875a] sm:text-[7px]">
                        {readyCount} READY
                    </span>

                    <span className="max-w-[100px] truncate rounded-full bg-[#edf7fc] px-2 py-1 text-[6px] font-extrabold text-[#075a91] sm:text-[7px]">
                        {proposalId}
                    </span>

                </div>

            </div>


            <div className="min-h-0 flex-1 overflow-auto">

                <section className="border-b border-[#d7e5ed] bg-[#f8fafb]">

                    {/* CERTIFICATE HEADER */}

                    <div className="flex min-h-10 items-center justify-between border-b border-[#e2ebf0] px-3 py-1.5">

                        <div className="flex min-w-0 items-center gap-2">

                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] bg-[#fff6e9] text-[#c76a00]">
                                <Stamp size={12} />
                            </div>

                            <div className="min-w-0">

                                <h3 className="truncate text-[9px] font-extrabold uppercase tracking-[0.45px] text-[#365a7a]">
                                    GP Resolution Certificate
                                </h3>

                                <p className="truncate text-[6px] text-slate-400">
                                    Official Gram Panchayat Resolution
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* CERTIFICATE DOCUMENT */}

                    <div className="p-3 sm:p-4">

                        <div id="gp-resolution-certificate" className="relative overflow-hidden rounded-[9px] border border-[#cdbd82] bg-[#fffdf7] shadow-[0_4px_18px_rgba(128,106,50,0.10)]">

                            {/* OUTER GOLD ACCENT */}

                            <div className="h-[3px] bg-gradient-to-r from-[#806a32] via-[#d8c98f] to-[#806a32]" />

                            {/* INNER DOCUMENT */}

                            <div className="m-[5px] rounded-[6px] border border-dashed border-[#d8c98f]">

                                <div className="px-4 py-4 sm:px-5 sm:py-5">

                                    <div className="flex items-start justify-between gap-5">

                                        {/* LEFT */}

                                        <div>

                                            <p className="text-[7px] font-bold tracking-[1.4px] text-[#806a32]">
                                                GOVERNMENT OF INDIA
                                            </p>

                                            <p className="mt-0.5 text-[10px] font-extrabold tracking-[0.65px] text-[#171717] sm:text-[11px]">
                                                MINISTRY OF RURAL DEVELOPMENT
                                            </p>

                                            <p className="mt-0.5 text-[7px] font-bold tracking-[0.9px] text-[#806a32]">
                                                VBG-RAM — SATURATED MODE
                                            </p>

                                        </div>


                                        {/* RIGHT */}

                                        <div className="shrink-0 text-right text-[6px] leading-[1.7] text-[#806a32] sm:text-[7px]">

                                            <p>
                                                Ref. No.: GP/VBGRAMG/2025–26/___
                                            </p>

                                            <p>
                                                Date: 18 August 2026
                                            </p>

                                        </div>

                                    </div>

                                    <div className="my-3 border-t border-[#d8c98f]" />

                                    <div className="text-center">

                                        <h1 className="text-[11px] font-extrabold tracking-[0.7px] text-[#171717] sm:text-[12px]">
                                            GRAM SABHA RESOLUTION
                                        </h1>

                                        <p className="mt-0.5 text-[6px] font-semibold tracking-[0.35px] text-[#806a32] sm:text-[7px]">
                                            Viksit Bharat Guarantee Rozgar and Ajeevika Mission Gramin
                                        </p>

                                    </div>

                                    <div className="my-3 border-t border-[#d8c98f]" />

                                    <p className="text-[7px] leading-[1.85] text-[#252525] sm:text-[8px]">

                                        This is to certify that the Gram Panchayat of

                                        <span className="mx-1 inline-block min-w-[75px] border-b border-[#806a32]" />

                                        , Block

                                        <span className="mx-1 inline-block min-w-[65px] border-b border-[#806a32]" />

                                        , District

                                        <span className="mx-1 inline-block min-w-[75px] border-b border-[#806a32]" />

                                        , has under the Viksit Bharat Guarantee for Rozgar and Ajeevika
                                        Mission Gramin initiative, duly deliberated upon and resolved in
                                        its Gram Sabha meeting to undertake a total of

                                        <strong className="mx-1 font-extrabold text-[#075a91]">
                                            {finalWorks.length}
                                        </strong>

                                        works under the Viksit Bharat Guarantee for Rozgar and Ajeevika
                                        Mission Gramin Scheme for the financial year

                                        <strong className="mx-1 font-extrabold text-[#075a91]">
                                            2025–26
                                        </strong>

                                        . The said works span across water security, rural infrastructure,
                                        livelihood assets, and climate resilience domains and have been
                                        selected with due consideration of local needs, available resources,
                                        and community priorities as mandated under the VBG-RAM operational
                                        guidelines. The Gram Panchayat hereby affirms that the foregoing
                                        action plan has been prepared in a transparent and participatory
                                        manner.

                                    </p>

                                    <div className="mt-5 grid grid-cols-3 gap-5">

                                        {/* PRADHAN */}

                                        <div className="text-center">

                                            <div className="mb-1 border-t border-[#806a32]" />

                                            <p className="text-[7px] font-bold text-[#171717] sm:text-[8px]">
                                                Gram Pradhan / Sarpanch
                                            </p>

                                            <p className="mt-0.5 text-[5px] text-slate-500 sm:text-[6px]">
                                                Gram Panchayat, with seal
                                            </p>

                                        </div>


                                        {/* SECRETARY */}

                                        <div className="text-center">

                                            <div className="mb-1 border-t border-[#806a32]" />

                                            <p className="text-[7px] font-bold text-[#171717] sm:text-[8px]">
                                                Panchayat Secretary
                                            </p>

                                            <p className="mt-0.5 text-[5px] text-slate-500 sm:text-[6px]">
                                                Authorized Signatory
                                            </p>

                                        </div>


                                        {/* BDO */}

                                        <div className="text-center">

                                            <div className="mb-1 border-t border-[#806a32]" />

                                            <p className="text-[7px] font-bold text-[#171717] sm:text-[8px]">
                                                Block Development Officer
                                            </p>

                                            <p className="mt-0.5 text-[5px] text-slate-500 sm:text-[6px]">
                                                Countersignature & Seal
                                            </p>

                                        </div>

                                    </div>

                                    <div className="mt-4 flex items-end justify-between">

                                        <div>

                                            <p className="text-[7px] font-bold text-[#171717]">
                                                Place & Date
                                            </p>

                                            <div className="mt-1 flex items-center gap-1">

                                                <span className="inline-block min-w-[70px] border-b border-[#806a32]" />

                                                <span className="text-[6px] text-slate-500">
                                                    , 18 August 2026
                                                </span>

                                            </div>

                                        </div>


                                        {/* SEAL */}

                                        <div className="flex h-11 w-11 rotate-[-8deg] items-center justify-center rounded-full border border-[#c8b879] text-center text-[5px] font-bold uppercase leading-[1.25] text-[#b6a66c] opacity-70">

                                            Gram
                                            <br />
                                            Panchayat
                                            <br />
                                            Seal

                                        </div>

                                    </div>

                                </div>

                            </div>


                            <div className="h-[3px] bg-gradient-to-r from-[#806a32] via-[#d8c98f] to-[#806a32]" />

                        </div>

                    </div>

                </section>

                <section className="bg-white">

                    {/* TABLE HEADER */}

                    <div className="flex min-h-11 items-center justify-between border-b border-[#d7e5ed] bg-gradient-to-r from-[#f8fbfd] via-white to-[#f5fafc] px-3">

                        <div className="flex min-w-0 items-center gap-2">

                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#edf7fc] text-[#075a91]">
                                <ClipboardCheck size={13} />
                            </div>

                            <div className="min-w-0">

                                <h3 className="truncate text-[10px] font-extrabold uppercase tracking-[0.5px] text-[#183b56]">
                                    Gap Analysis
                                </h3>

                                <p className="truncate text-[6px] text-slate-400 sm:text-[7px]">
                                    Work-wise verification before final approval
                                </p>

                            </div>

                        </div>


                        {/* TABLE COUNTS */}

                        <div className="flex shrink-0 items-center gap-1.5">

                            <div className="hidden items-center gap-1 rounded-full border border-[#bce6d5] bg-[#effbf5] px-2 py-1 sm:flex">

                                <span className="h-1.5 w-1.5 rounded-full bg-[#00875a]" />

                                <span className="text-[6px] font-extrabold text-[#00875a]">
                                    {geotaggedCount} GEOTAGGED
                                </span>

                            </div>


                            {notGeotaggedCount > 0 && (
                                <div className="hidden items-center gap-1 rounded-full border border-[#f5d6a7] bg-[#fff8ed] px-2 py-1 sm:flex">

                                    <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />

                                    <span className="text-[6px] font-extrabold text-[#b45309]">
                                        {notGeotaggedCount} PENDING
                                    </span>

                                </div>
                            )}


                            <span className="rounded-full bg-[#edf7fc] px-2 py-1 text-[7px] font-extrabold text-[#075a91]">
                                {finalWorks.length}
                            </span>

                        </div>

                    </div>


                    {/* TABLE */}

                    <div className="approval-print-table max-h-[330px] overflow-auto">

                        <table className="w-full min-w-[650px] border-collapse">

                            {/* TABLE HEAD */}

                            <thead className="sticky top-0 z-20 bg-[#003b63] text-white shadow-[0_2px_5px_rgba(0,0,0,0.12)]">

                                <tr className="h-9">

                                    <th className="w-[7%] border-r border-white/10 px-2 text-left text-[7px] font-extrabold uppercase tracking-[0.4px]">
                                        #
                                    </th>

                                    <th className="w-[18%] border-r border-white/10 px-2 text-left text-[7px] font-extrabold uppercase tracking-[0.4px]">
                                        UUID
                                    </th>

                                    <th className="w-[35%] border-r border-white/10 px-2 text-left text-[7px] font-extrabold uppercase tracking-[0.4px]">
                                        WORK NAME
                                    </th>

                                    <th className="w-[17%] border-r border-white/10 px-2 text-left text-[7px] font-extrabold uppercase tracking-[0.4px]">
                                        THEME
                                    </th>

                                    <th className="w-[10%] border-r border-white/10 px-2 text-center text-[7px] font-extrabold uppercase tracking-[0.4px]">
                                        TYPE
                                    </th>

                                    <th className="w-[13%] px-2 text-center text-[7px] font-extrabold uppercase tracking-[0.4px]">
                                        GEOTAGGED
                                    </th>

                                </tr>

                            </thead>


                            {/* TABLE BODY */}

                            <tbody>

                                {finalWorks.length === 0 ? (
                                    <tr>

                                        <td
                                            colSpan={6}
                                            className="py-14 text-center"
                                        >

                                            <div className="mx-auto flex max-w-[260px] flex-col items-center">

                                                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7e5ed] bg-[#f5f9fb] text-[#9aafbd]">
                                                    <MapPinned size={19} />
                                                </div>

                                                <p className="mt-3 text-[9px] font-extrabold text-slate-400">
                                                    No works available
                                                </p>

                                                <p className="mt-1 text-[7px] leading-relaxed text-slate-300">
                                                    Selected works from the previous steps will
                                                    appear here for final gap analysis.
                                                </p>

                                            </div>

                                        </td>

                                    </tr>
                                ) : (
                                    finalWorks.map((work, index) => (

                                        <tr
                                            key={`gap-analysis-${work.id}`}
                                            className="group h-10 border-b border-[#e6eef3] bg-white transition hover:bg-[#f5fafc]"
                                        >

                                            {/* NUMBER */}

                                            <td className="px-2">

                                                <span className="font-mono text-[7px] font-bold text-slate-400 group-hover:text-[#075a91]">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>

                                            </td>


                                            {/* UUID */}

                                            <td className="truncate px-2">

                                                <span
                                                    title={work.id}
                                                    className="inline-flex max-w-full rounded-[4px] border border-[#d9e7ee] bg-[#f5f9fb] px-1.5 py-1 font-mono text-[6px] font-semibold text-[#526b7b]"
                                                >
                                                    <span className="truncate">
                                                        {work.id}
                                                    </span>
                                                </span>

                                            </td>


                                            {/* WORK NAME */}

                                            <td
                                                className="max-w-[250px] truncate px-2 text-[8px] font-bold text-[#263f52]"
                                                title={work.workName}
                                            >

                                                <div className="flex min-w-0 items-center gap-1.5">

                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#075a91] opacity-50 transition group-hover:opacity-100" />

                                                    <span className="truncate">
                                                        {work.workName}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* THEME */}

                                            <td
                                                className="truncate px-2 text-[7px] font-bold"
                                                title={work.theme}
                                            >

                                                <span
                                                    className={`inline-flex max-w-full items-center gap-1 rounded-full px-2 py-1 ${work.theme === "Water Security"
                                                        ? "bg-[#fff7ed] text-[#c76a00]"
                                                        : work.theme ===
                                                            "Rural Infrastructure"
                                                            ? "bg-[#f5f0ff] text-[#7c3aed]"
                                                            : work.theme ===
                                                                "Livelihood Infrastructure"
                                                                ? "bg-[#effbf5] text-[#00875a]"
                                                                : "bg-[#eef8fc] text-[#0879b1]"
                                                        }`}
                                                >

                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />

                                                    <span className="truncate">
                                                        {work.theme}
                                                    </span>

                                                </span>

                                            </td>


                                            {/* TYPE */}

                                            <td className="px-2 text-center">

                                                <span
                                                    className={`inline-flex rounded-full border px-2 py-1 text-[6px] font-extrabold ${work.type === "Repair"
                                                        ? "border-[#fecaca] bg-[#fff5f5] text-[#dc2626]"
                                                        : "border-[#bce6d5] bg-[#effbf5] text-[#00875a]"
                                                        }`}
                                                >
                                                    {work.type}
                                                </span>

                                            </td>


                                            {/* GEOTAGGED */}

                                            <td className="px-2 text-center">

                                                {work.geotagged ? (

                                                    <span className="inline-flex items-center gap-1 rounded-full border border-[#bce6d5] bg-[#effbf5] px-2 py-1 text-[6px] font-extrabold text-[#00875a]">

                                                        <CheckCircle2 size={8} />

                                                        YES

                                                    </span>

                                                ) : (

                                                    <span className="inline-flex items-center gap-1 rounded-full border border-[#f5d6a7] bg-[#fff8ed] px-2 py-1 text-[6px] font-extrabold text-[#b45309]">

                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />

                                                        PENDING

                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* TABLE FOOTER */}

                    {finalWorks.length > 0 && (
                        <div className="flex min-h-9 items-center justify-between border-t border-[#e1ebf0] bg-[#f8fbfd] px-3">

                            <div className="flex items-center gap-1.5">

                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${allGeotagged
                                        ? "bg-[#00875a]"
                                        : "bg-[#d97706]"
                                        }`}
                                />

                                <span className="text-[7px] font-semibold text-slate-500">

                                    {allGeotagged
                                        ? "All works are geotagged and ready for approval."
                                        : `${notGeotaggedCount} work(s) require geotagging before approval.`}

                                </span>

                            </div>


                            <span className="hidden text-[7px] font-bold text-slate-400 sm:block">
                                {finalWorks.length} TOTAL WORKS
                            </span>

                        </div>
                    )}

                </section>

            </div>

        </section>
    );
}

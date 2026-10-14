
// "use client";

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { QRCodeSVG } from "qrcode.react";
// import {
//   CheckCircle2,
//   Clock3,
//   FileCheck2,
//   FileText,
//   Printer,
//   RotateCcw,
//   ShieldCheck,
//   Upload,
// } from "lucide-react";

// type ResolutionStatus =
//   | "PENDING"
//   | "APPROVED"
//   | "PRINTED"
//   | "UPLOADED"
//   | "SUBMITTED";

// type ResolutionRecord = {
//   work: Record<string, unknown>;
//   status: string;
//   events?: string[];
// };

// type Resolution = {
//   resolutionId: string;
//   createdAt: string;
//   status?: ResolutionStatus;
//   records: ResolutionRecord[];
//   uploadedFileName?: string;
//   approvedAt?: string;
//   printedAt?: string;
//   uploadedAt?: string;
//   verifiedAt?: string;
// };

// type Props = {
//   proposalId: string;
// };

// const BLUE = "#075a91";
// const ORANGE = "#f58220";

// const getResolutionsKey = (proposalId: string) =>
//   `proposal_conclusion_resolutions_${proposalId}`;

// const getWorksKey = (proposalId: string) =>
//   `proposal_conclusion_works_${proposalId}`;

// function getResolutionStatus(resolution: Resolution): ResolutionStatus {
//   if (resolution.status) return resolution.status;

//   // Compatibility with resolutions saved by earlier versions.
//   const events = resolution.records.flatMap((record) => record.events ?? []);
//   const joined = events.join(" ").toLowerCase();

//   if (resolution.verifiedAt || joined.includes("verified")) {
//     return "SUBMITTED";
//   }
//   if (resolution.uploadedAt || joined.includes("uploaded")) {
//     return "UPLOADED";
//   }
//   if (resolution.printedAt || joined.includes("printed")) {
//     return "PRINTED";
//   }
//   if (resolution.approvedAt || joined.includes("approved")) {
//     return "APPROVED";
//   }

//   return "PENDING";
// }

// function getWorkName(work: Record<string, unknown>, index: number) {
//   const candidates = [
//     work.workName,
//     work.name,
//     work.title,
//     work.activityName,
//     work.projectName,
//     work.workDescription,
//     work.description,
//   ];

//   const name = candidates.find(
//     (value) => typeof value === "string" && value.trim()
//   );

//   return typeof name === "string" ? name : `Work ${index + 1}`;
// }

// function getWorkValue(
//   work: Record<string, unknown>,
//   keys: string[],
//   fallback = "—"
// ) {
//   for (const key of keys) {
//     const value = work[key];

//     if (value !== null && value !== undefined && String(value).trim()) {
//       return String(value);
//     }
//   }

//   return fallback;
// }

// function formatDate(value?: string) {
//   if (!value) return "—";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) return "—";

//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }

// const STATUS_LABELS: Record<ResolutionStatus, string> = {
//   PENDING: "Pending",
//   APPROVED: "Approved",
//   PRINTED: "Printed",
//   UPLOADED: "Awaiting verification",
//   SUBMITTED: "Verified / Submitted",
// };

// function statusClasses(status: ResolutionStatus) {
//   switch (status) {
//     case "SUBMITTED":
//       return "bg-green-100 text-green-800";
//     case "UPLOADED":
//       return "bg-purple-100 text-purple-800";
//     case "APPROVED":
//     case "PRINTED":
//       return "bg-blue-100 text-blue-800";
//     default:
//       return "bg-amber-100 text-amber-800";
//   }
// }

// export default function ConclusionWorkspace({ proposalId }: Props) {
//   const [resolutions, setResolutions] = useState<Resolution[]>([]);
//   const [selectedResolutionId, setSelectedResolutionId] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [notice, setNotice] = useState("");
//   const [isUploading, setIsUploading] = useState(false);

//   const resolutionsKey = useMemo(
//     () => getResolutionsKey(proposalId),
//     [proposalId]
//   );

//   const selectedResolution = useMemo(
//     () =>
//       resolutions.find(
//         (resolution) => resolution.resolutionId === selectedResolutionId
//       ) ?? resolutions[0],
//     [resolutions, selectedResolutionId]
//   );

//   const selectedStatus = selectedResolution
//     ? getResolutionStatus(selectedResolution)
//     : "PENDING";

//   const persistResolutions = useCallback(
//     (nextResolutions: Resolution[]) => {
//       setResolutions(nextResolutions);

//       sessionStorage.setItem(
//         resolutionsKey,
//         JSON.stringify(nextResolutions)
//       );

//       // Keep the Header's conclusion stepper synchronized in this tab.
//       window.dispatchEvent(
//         new CustomEvent("conclusion-workflow-update", {
//           detail: {
//             proposalId,
//             resolutionId: selectedResolutionId,
//             status: selectedStatus,
//           },
//         })
//       );
//     },
//     [
//       resolutionsKey,
//       proposalId,
//       selectedResolutionId,
//       selectedStatus,
//     ]
//   );

//   useEffect(() => {
//     try {
//       const saved = sessionStorage.getItem(resolutionsKey);

//       if (saved) {
//         const parsed = JSON.parse(saved);

//         if (Array.isArray(parsed)) {
//           setResolutions(parsed);
//           setSelectedResolutionId(parsed[0]?.resolutionId ?? "");
//           return;
//         }
//       }

//       // Compatibility fallback: convert previously saved works into
//       // one resolution if no resolution collection exists yet.
//       const oldWorks = sessionStorage.getItem(getWorksKey(proposalId));

//       if (oldWorks) {
//         const parsedWorks = JSON.parse(oldWorks);

//         if (Array.isArray(parsedWorks) && parsedWorks.length > 0) {
//           const resolution: Resolution = {
//             resolutionId: "RES-001",
//             createdAt: new Date().toISOString(),
//             status: "PENDING",
//             records: parsedWorks.map((work) => ({
//               work,
//               status: "PENDING",
//               events: ["Added to RES-001"],
//             })),
//           };

//           setResolutions([resolution]);
//           setSelectedResolutionId(resolution.resolutionId);
//           sessionStorage.setItem(
//             resolutionsKey,
//             JSON.stringify([resolution])
//           );
//         }
//       }
//     } catch (error) {
//       console.error("Unable to load resolutions:", error);
//       setNotice("Unable to load saved resolutions.");
//     } finally {
//       setLoading(false);
//     }
//   }, [proposalId, resolutionsKey]);

//   const updateSelectedResolution = useCallback(
//     (
//       updater: (resolution: Resolution) => Resolution,
//       message: string
//     ) => {
//       if (!selectedResolution) return;

//       const nextResolutions = resolutions.map((resolution) =>
//         resolution.resolutionId === selectedResolution.resolutionId
//           ? updater(resolution)
//           : resolution
//       );

//       setResolutions(nextResolutions);

//       sessionStorage.setItem(
//         resolutionsKey,
//         JSON.stringify(nextResolutions)
//       );

//       setNotice(message);

//       const updated = nextResolutions.find(
//         (resolution) =>
//           resolution.resolutionId === selectedResolution.resolutionId
//       );

//       if (updated) {
//         window.dispatchEvent(
//           new CustomEvent("conclusion-workflow-update", {
//             detail: {
//               proposalId,
//               resolutionId: updated.resolutionId,
//               status: getResolutionStatus(updated),
//             },
//           })
//         );
//       }
//     },
//     [selectedResolution, resolutions, resolutionsKey, proposalId]
//   );

//   const approveResolution = () => {
//     if (!selectedResolution || selectedStatus !== "PENDING") return;

//     updateSelectedResolution(
//       (resolution) => ({
//         ...resolution,
//         status: "APPROVED",
//         approvedAt: new Date().toISOString(),
//         records: resolution.records.map((record) => ({
//           ...record,
//           status: "APPROVED",
//           events: [...(record.events ?? []), "Resolution approved"],
//         })),
//       }),
//       `${selectedResolution.resolutionId} approved successfully.`
//     );
//   };

//   const printResolution = () => {
//     if (
//       !selectedResolution ||
//       !["APPROVED", "PRINTED"].includes(selectedStatus)
//     ) {
//       return;
//     }

//     updateSelectedResolution(
//       (resolution) => ({
//         ...resolution,
//         status: "PRINTED",
//         printedAt: new Date().toISOString(),
//         records: resolution.records.map((record) => ({
//           ...record,
//           status: "PRINTED",
//           events: [...(record.events ?? []), "Included in printed resolution"],
//         })),
//       }),
//       "Print dialog opened for the selected resolution."
//     );

//     window.setTimeout(() => window.print(), 100);
//   };

//   const uploadSignedCopy = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];

//     if (!file || !selectedResolution) return;

//     if (selectedStatus !== "PRINTED") {
//       setNotice("Approve and print the resolution before uploading.");
//       event.target.value = "";
//       return;
//     }

//     setIsUploading(true);

//     try {
//       // Demo only: this records the file name. It does not upload
//       // the actual file to a server. Integrate your backend API here.
//       updateSelectedResolution(
//         (resolution) => ({
//           ...resolution,
//           status: "UPLOADED",
//           uploadedAt: new Date().toISOString(),
//           uploadedFileName: file.name,
//           records: resolution.records.map((record) => ({
//             ...record,
//             status: "UPLOADED",
//             events: [...(record.events ?? []), "Signed copy uploaded"],
//           })),
//         }),
//         "Signed copy recorded. Resolution is awaiting verification."
//       );
//     } catch (error) {
//       console.error("Unable to record signed copy:", error);
//       setNotice("Unable to record the signed copy.");
//     } finally {
//       setIsUploading(false);
//       event.target.value = "";
//     }
//   };

//   const verifyResolution = () => {
//     if (!selectedResolution || selectedStatus !== "UPLOADED") return;

//     updateSelectedResolution(
//       (resolution) => ({
//         ...resolution,
//         status: "SUBMITTED",
//         verifiedAt: new Date().toISOString(),
//         records: resolution.records.map((record) => ({
//           ...record,
//           status: "SUBMITTED",
//           events: [...(record.events ?? []), "Resolution verified"],
//         })),
//       }),
//       `${selectedResolution.resolutionId} verified successfully.`
//     );
//   };

//   const revertResolution = () => {
//     if (!selectedResolution || selectedStatus !== "UPLOADED") return;

//     const confirmed = window.confirm(
//       `Revert ${selectedResolution.resolutionId}? All works in this resolution will return to PENDING.`
//     );

//     if (!confirmed) return;

//     updateSelectedResolution(
//       (resolution) => ({
//         ...resolution,
//         status: "PENDING",
//         approvedAt: undefined,
//         printedAt: undefined,
//         uploadedAt: undefined,
//         verifiedAt: undefined,
//         uploadedFileName: undefined,
//         records: resolution.records.map((record) => ({
//           ...record,
//           status: "PENDING",
//           events: [...(record.events ?? []), "Resolution reverted to PENDING"],
//         })),
//       }),
//       `${selectedResolution.resolutionId} reverted. All its works are PENDING.`
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-[300px] items-center justify-center text-sm text-gray-500">
//         Loading resolutions...
//       </div>
//     );
//   }

//   return (
//     <div className="conclusion-workspace flex h-[calc(100dvh-150px)] min-h-[520px] flex-col overflow-hidden bg-slate-50">
//       <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 md:flex-row md:gap-4 md:p-4">
//         {/* LEFT PANEL: Resolution list */}
//         <aside className="flex min-h-0 w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:w-[320px] md:min-w-[280px] md:shrink-0 lg:w-[360px]">
//           <div className="border-b border-slate-200 p-4">
//             <div className="flex items-center justify-between gap-2">
//               <div>
//                 <h2 className="text-base font-bold text-slate-800">
//                   Resolutions
//                 </h2>
//                 <p className="mt-1 text-xs text-slate-500">
//                   Select a resolution to view its document.
//                 </p>
//               </div>

//               <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
//                 {resolutions.length}
//               </span>
//             </div>

//             <div className="mt-3 grid grid-cols-2 gap-2">
//               <div className="rounded-lg bg-slate-50 p-2">
//                 <p className="text-[11px] text-slate-500">Total works</p>
//                 <p className="text-lg font-bold text-slate-800">
//                   {resolutions.reduce(
//                     (total, resolution) => total + resolution.records.length,
//                     0
//                   )}
//                 </p>
//               </div>

//               <div className="rounded-lg bg-slate-50 p-2">
//                 <p className="text-[11px] text-slate-500">Awaiting verification</p>
//                 <p className="text-lg font-bold text-slate-800">
//                   {resolutions.filter(
//                     (resolution) =>
//                       getResolutionStatus(resolution) === "UPLOADED"
//                   ).length}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
//             {resolutions.length === 0 ? (
//               <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
//                 <FileText className="mx-auto h-8 w-8 text-slate-400" />
//                 <p className="mt-2 text-sm font-medium text-slate-700">
//                   No resolutions found
//                 </p>
//                 <p className="mt-1 text-xs text-slate-500">
//                   Submit selected works from Approval to create a resolution.
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {resolutions.map((resolution) => {
//                   const status = getResolutionStatus(resolution);
//                   const active =
//                     selectedResolution?.resolutionId === resolution.resolutionId;

//                   return (
//                     <button
//                       type="button"
//                       key={resolution.resolutionId}

//                       onClick={() => {
//                         setSelectedResolutionId(resolution.resolutionId);
//                         setNotice("");

//                         window.dispatchEvent(
//                           new CustomEvent("conclusion-workflow-update", {
//                             detail: {
//                               proposalId,
//                               resolutionId: resolution.resolutionId,
//                               status: getResolutionStatus(resolution),
//                             },
//                           })
//                         );
//                       }}

//                       className={`w-full rounded-lg border p-3 text-left transition ${active
//                           ? "border-[#075a91] bg-blue-50 ring-1 ring-[#075a91]/20"
//                           : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
//                         }`}
//                     >
//                       <div className="flex items-start justify-between gap-2">
//                         <div className="min-w-0">
//                           <p className="truncate text-sm font-bold text-slate-800">
//                             {resolution.resolutionId}
//                           </p>
//                           <p className="mt-1 text-xs text-slate-500">
//                             Created {formatDate(resolution.createdAt)}
//                           </p>
//                         </div>

//                         {status === "SUBMITTED" ? (
//                           <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
//                         ) : status === "UPLOADED" ? (
//                           <Clock3 className="h-4 w-4 shrink-0 text-purple-600" />
//                         ) : (
//                           <FileCheck2 className="h-4 w-4 shrink-0 text-slate-500" />
//                         )}
//                       </div>

//                       <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
//                         <span className="text-xs text-slate-600">
//                           {resolution.records.length} works
//                         </span>

//                         <span
//                           className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClasses(status)}`}
//                         >
//                           {STATUS_LABELS[status]}
//                         </span>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           <div className="border-t border-slate-200 px-3 py-2 text-[11px] text-slate-500">
//             Resolution list scrolls independently.
//           </div>
//         </aside>

//         {/* RIGHT PANEL: Selected resolution document */}
//         <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//           {!selectedResolution ? (
//             <div className="flex flex-1 items-center justify-center p-6 text-center">
//               <div>
//                 <FileText className="mx-auto h-10 w-10 text-slate-300" />
//                 <h2 className="mt-3 font-semibold text-slate-700">
//                   Select a resolution
//                 </h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   The resolution document will appear here.
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Document toolbar */}
//               <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
//                 <div className="min-w-0">
//                   <h2 className="truncate text-base font-bold text-slate-800">
//                     {selectedResolution.resolutionId}
//                   </h2>
//                   <p className="mt-1 text-xs text-slate-500">
//                     {selectedResolution.records.length} works in this resolution
//                   </p>
//                 </div>

//                 <span
//                   className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(selectedStatus)}`}
//                 >
//                   {STATUS_LABELS[selectedStatus]}
//                 </span>
//               </div>

//               {/* Document scroll area */}
//               <div className="min-h-0 flex-1 overflow-y-auto bg-slate-100 p-3 md:p-5">
//                 <article
//                   id="resolution-document"
//                   className="resolution-paper relative mx-auto min-h-[800px] w-full max-w-[850px] bg-white p-5 text-slate-900 shadow-md sm:p-8 md:p-10"
//                 >
//                   {/* QR appears only after approval */}
//                   {["APPROVED", "PRINTED", "UPLOADED", "SUBMITTED"].includes(
//                     selectedStatus
//                   ) && (
//                       <div className="mb-5 flex justify-end">
//                         <div className="flex flex-col items-center gap-1">
//                           <QRCodeSVG
//                             value={`VGPP:${proposalId}:${selectedResolution.resolutionId}`}
//                             size={76}
//                             level="M"
//                           />
//                           <span className="text-[9px] font-semibold">
//                             {selectedResolution.resolutionId}
//                           </span>
//                         </div>
//                       </div>
//                     )}

//                   <div className="border-b-2 border-[#075a91] pb-5 text-center">
//                     <p className="text-xs font-semibold uppercase tracking-widest text-[#075a91]">
//                       Viksit Gram Panchayat Planning
//                     </p>

//                     <h1 className="mt-3 text-xl font-bold uppercase sm:text-2xl">
//                       Gram Sabha Resolution
//                     </h1>

//                     <p className="mt-2 text-xs text-slate-600">
//                       Resolution No. {selectedResolution.resolutionId}
//                     </p>
//                   </div>

//                   <section className="mt-6 space-y-3 text-sm leading-6">
//                     <p>
//                       This resolution records the works grouped under{" "}
//                       <strong>{selectedResolution.resolutionId}</strong> for
//                       consideration and approval through the VGPP workflow.
//                     </p>

//                     <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-4 sm:grid-cols-2">
//                       <div>
//                         <p className="text-xs text-slate-500">Resolution ID</p>
//                         <p className="font-semibold">
//                           {selectedResolution.resolutionId}
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-xs text-slate-500">Created on</p>
//                         <p className="font-semibold">
//                           {formatDate(selectedResolution.createdAt)}
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-xs text-slate-500">Works included</p>
//                         <p className="font-semibold">
//                           {selectedResolution.records.length}
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-xs text-slate-500">Current status</p>
//                         <p className="font-semibold">
//                           {STATUS_LABELS[selectedStatus]}
//                         </p>
//                       </div>
//                     </div>
//                   </section>

//                   <section className="mt-7">
//                     <h2 className="border-l-4 border-[#f58220] pl-3 text-base font-bold">
//                       Works Summary
//                     </h2>

//                     <p className="mt-3 text-sm leading-6">
//                       The following works are included together in this
//                       resolution. Actions taken on this resolution apply to all
//                       the listed works.
//                     </p>

//                     <div className="mt-4 overflow-x-auto">
//                       <table className="w-full border-collapse text-left text-xs sm:text-sm">
//                         <thead>
//                           <tr className="bg-[#075a91] text-white">
//                             <th className="border border-slate-300 px-3 py-3">
//                               S. No.
//                             </th>
//                             <th className="border border-slate-300 px-3 py-3">
//                               Work / Activity
//                             </th>
//                             <th className="border border-slate-300 px-3 py-3">
//                               Theme
//                             </th>
//                             <th className="border border-slate-300 px-3 py-3">
//                               Estimated Cost
//                             </th>
//                             <th className="border border-slate-300 px-3 py-3">
//                               Status
//                             </th>
//                           </tr>
//                         </thead>

//                         <tbody>
//                           {selectedResolution.records.map((record, index) => (
//                             <tr
//                               key={`${selectedResolution.resolutionId}-${index}`}
//                               className={index % 2 ? "bg-slate-50" : "bg-white"}
//                             >
//                               <td className="border border-slate-300 px-3 py-3 align-top">
//                                 {index + 1}
//                               </td>

//                               <td className="border border-slate-300 px-3 py-3 align-top">
//                                 <p className="font-medium">
//                                   {getWorkName(record.work, index)}
//                                 </p>

//                                 <p className="mt-1 text-[11px] text-slate-500">
//                                   {getWorkValue(
//                                     record.work,
//                                     ["workCode", "activityCode", "code"],
//                                     ""
//                                   )}
//                                 </p>
//                               </td>

//                               <td className="border border-slate-300 px-3 py-3 align-top">
//                                 {getWorkValue(
//                                   record.work,
//                                   ["theme", "themeName", "sector", "category"]
//                                 )}
//                               </td>

//                               <td className="border border-slate-300 px-3 py-3 align-top">
//                                 {getWorkValue(
//                                   record.work,
//                                   [
//                                     "estimatedCost",
//                                     "estimatedAmount",
//                                     "amount",
//                                     "cost",
//                                   ]
//                                 )}
//                               </td>

//                               <td className="border border-slate-300 px-3 py-3 align-top">
//                                 {STATUS_LABELS[
//                                   (record.status as ResolutionStatus) in STATUS_LABELS
//                                     ? (record.status as ResolutionStatus)
//                                     : selectedStatus
//                                 ]}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </section>

//                   <section className="mt-8">
//                     <h2 className="border-l-4 border-[#f58220] pl-3 text-base font-bold">
//                       Approval Record
//                     </h2>

//                     <div className="mt-3 space-y-2 text-xs leading-5 text-slate-700">
//                       <p>
//                         <strong>Approval date:</strong>{" "}
//                         {formatDate(selectedResolution.approvedAt)}
//                       </p>
//                       <p>
//                         <strong>Print date:</strong>{" "}
//                         {formatDate(selectedResolution.printedAt)}
//                       </p>
//                       <p>
//                         <strong>Signed copy uploaded:</strong>{" "}
//                         {selectedResolution.uploadedFileName || "Not uploaded"}
//                       </p>
//                       <p>
//                         <strong>Verification date:</strong>{" "}
//                         {formatDate(selectedResolution.verifiedAt)}
//                       </p>
//                     </div>
//                   </section>

//                   <div className="mt-12 grid grid-cols-2 gap-8 text-center text-xs">
//                     <div className="border-t border-slate-400 pt-2">
//                       Authorized Signatory
//                     </div>
//                     <div className="border-t border-slate-400 pt-2">
//                       Gram Sabha / Competent Authority
//                     </div>
//                   </div>

//                   <footer className="mt-10 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-500">
//                     VGPP · {selectedResolution.resolutionId} · Generated
//                     electronically
//                   </footer>
//                 </article>
//               </div>

//               {/* Resolution-level actions */}
//               <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-white p-3 md:p-4">
//                 {selectedStatus === "PENDING" && (
//                   <button
//                     type="button"
//                     onClick={approveResolution}
//                     className="inline-flex items-center gap-2 rounded-lg bg-[#075a91] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#064a76]"
//                   >
//                     <ShieldCheck size={16} />
//                     Approve Resolution
//                   </button>
//                 )}

//                 {["APPROVED", "PRINTED"].includes(selectedStatus) && (
//                   <button
//                     type="button"
//                     onClick={printResolution}
//                     className="inline-flex items-center gap-2 rounded-lg bg-[#075a91] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#064a76]"
//                   >
//                     <Printer size={16} />
//                     Print Resolution
//                   </button>
//                 )}

//                 {selectedStatus === "PRINTED" && (
//                   <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#f58220] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#dc7018]">
//                     <Upload size={16} />
//                     {isUploading ? "Recording..." : "Upload Signed Copy"}
//                     <input
//                       type="file"
//                       accept=".pdf,.jpg,.jpeg,.png"
//                       className="hidden"
//                       disabled={isUploading}
//                       onChange={uploadSignedCopy}
//                     />
//                   </label>
//                 )}

//                 {selectedStatus === "UPLOADED" && (
//                   <>
//                     <button
//                       type="button"
//                       onClick={verifyResolution}
//                       className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
//                     >
//                       <CheckCircle2 size={16} />
//                       Verify Resolution
//                     </button>

//                     <button
//                       type="button"
//                       onClick={revertResolution}
//                       className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
//                     >
//                       <RotateCcw size={16} />
//                       Revert to Pending
//                     </button>
//                   </>
//                 )}

//                 {selectedStatus === "SUBMITTED" && (
//                   <div className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-800">
//                     <CheckCircle2 size={16} />
//                     Resolution Verified
//                   </div>
//                 )}

//                 {notice && (
//                   <p
//                     role="status"
//                     className="w-full text-xs text-slate-600 md:ml-auto md:w-auto md:max-w-[280px] md:text-right"
//                   >
//                     {notice}
//                   </p>
//                 )}
//               </div>
//             </>
//           )}
//         </main>
//       </div>

//       <style jsx global>{`
//         @media print {
//           body * {
//             visibility: hidden !important;
//           }

//           #resolution-document,
//           #resolution-document * {
//             visibility: visible !important;
//           }

//           #resolution-document {
//             position: absolute !important;
//             left: 0 !important;
//             top: 0 !important;
//             width: 100% !important;
//             max-width: none !important;
//             min-height: 0 !important;
//             padding: 12mm !important;
//             margin: 0 !important;
//             box-shadow: none !important;
//             overflow: visible !important;
//           }

//           .conclusion-workspace {
//             height: auto !important;
//             min-height: 0 !important;
//             overflow: visible !important;
//           }

//           @page {
//             size: A4;
//             margin: 8mm;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }





















"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  FileUp,
  Printer,
  RotateCcw,
  ShieldCheck,
  Upload,
  X,
  CloudUpload,
  Image as ImageIcon,
} from "lucide-react";

type ResolutionStatus =
  | "PENDING"
  | "APPROVED"
  | "PRINTED"
  | "UPLOADED"
  | "SUBMITTED";

type ResolutionRecord = {
  work: Record<string, unknown>;
  status: string;
  events?: string[];
};
type Resolution = {
  resolutionId: string;
  createdAt: string;
  status?: ResolutionStatus;
  records: ResolutionRecord[];
  uploadedFileName?: string;
  approvedAt?: string;
  printedAt?: string;
  uploadedAt?: string;
  verifiedAt?: string;
};
type Props = { proposalId: string };

const BLUE = "#075a91";
const ORANGE = "#f58220";
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 15 * 1024 * 1024;

const getResolutionsKey = (proposalId: string) => `proposal_conclusion_resolutions_${proposalId}`;
const getWorksKey = (proposalId: string) => `proposal_conclusion_works_${proposalId}`;

function getResolutionStatus(resolution: Resolution): ResolutionStatus {
  if (resolution.status) return resolution.status;
  const events = (resolution.records ?? []).flatMap((record) => record.events ?? []).join(" ").toLowerCase();
  if (resolution.verifiedAt || events.includes("verified")) return "SUBMITTED";
  if (resolution.uploadedAt || events.includes("uploaded")) return "UPLOADED";
  if (resolution.printedAt || events.includes("printed")) return "PRINTED";
  if (resolution.approvedAt || events.includes("approved")) return "APPROVED";
  return "PENDING";
}

function getWorkName(work: Record<string, unknown>, index: number) {
  const value = [work.workName, work.name, work.title, work.activityName, work.projectName, work.workDescription, work.description]
    .find((item) => typeof item === "string" && item.trim());
  return typeof value === "string" ? value : `Work ${index + 1}`;
}

function getWorkValue(work: Record<string, unknown>, keys: string[], fallback = "—") {
  for (const key of keys) {
    const value = work[key];
    if (value !== null && value !== undefined && String(value).trim()) return String(value);
  }
  return fallback;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_LABELS: Record<ResolutionStatus, string> = {
  PENDING: "Pending finalisation",
  APPROVED: "Approved · Ready to print",
  PRINTED: "Printed · Signed copy required",
  UPLOADED: "Awaiting verification",
  SUBMITTED: "Verified / Submitted",
};

function statusClasses(status: ResolutionStatus) {
  switch (status) {
    case "SUBMITTED": return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "UPLOADED": return "border-violet-200 bg-violet-50 text-violet-800";
    case "APPROVED":
    case "PRINTED": return "border-blue-200 bg-blue-50 text-blue-800";
    default: return "border-amber-200 bg-amber-50 text-amber-800";
  }
}

function getStepForStatus(status: ResolutionStatus) {
  if (status === "APPROVED") return 2;
  if (status === "PRINTED") return 3;
  if (status === "UPLOADED" || status === "SUBMITTED") return 4;
  return 1;
}

export default function ConclusionWorkspace({ proposalId }: Props) {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [selectedResolutionId, setSelectedResolutionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [location, setLocation] = useState<string | null>(null);

  const resolutionsKey = useMemo(() => getResolutionsKey(proposalId), [proposalId]);
  const selectedResolution = useMemo(
    () => resolutions.find((item) => item.resolutionId === selectedResolutionId) ?? resolutions[0],
    [resolutions, selectedResolutionId]
  );
  const selectedStatus: ResolutionStatus = selectedResolution ? getResolutionStatus(selectedResolution) : "PENDING";
  const isUploadStep = selectedStatus === "PRINTED" || selectedStatus === "UPLOADED";

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const dispatchWorkflowUpdate = useCallback((resolution: Resolution) => {
    window.dispatchEvent(new CustomEvent("conclusion-workflow-update", {
      detail: { proposalId, resolutionId: resolution.resolutionId, status: getResolutionStatus(resolution), step: getStepForStatus(getResolutionStatus(resolution)) },
    }));
  }, [proposalId]);

  useEffect(() => {
    try {
      const location = sessionStorage.getItem("vgpp_location");
      const savedLocation = JSON.parse(location ?? "null");
      if (location) {
        setLocation(savedLocation);
      }
      const saved = sessionStorage.getItem(resolutionsKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((item): item is Resolution => Boolean(item && typeof item.resolutionId === "string" && Array.isArray(item.records)));
          setResolutions(valid);
          setSelectedResolutionId(valid[0]?.resolutionId ?? "");
          if (valid[0]) dispatchWorkflowUpdate(valid[0]);
          return;
        }
      }
      // Backward compatibility with the older works-only session key.
      const oldWorks = sessionStorage.getItem(getWorksKey(proposalId));
      if (oldWorks) {
        const parsedWorks: unknown = JSON.parse(oldWorks);
        if (Array.isArray(parsedWorks) && parsedWorks.length) {
          const legacy: Resolution = {
            resolutionId: "RES-001",
            createdAt: new Date().toISOString(),
            status: "PENDING",
            records: parsedWorks.map((work) => ({ work: (work && typeof work === "object" ? work : {}) as Record<string, unknown>, status: "PENDING", events: ["Added to RES-001"] })),
          };
          setResolutions([legacy]);
          setSelectedResolutionId(legacy.resolutionId);
          sessionStorage.setItem(resolutionsKey, JSON.stringify([legacy]));
          dispatchWorkflowUpdate(legacy);
        }
      }
    } catch (error) {
      console.error("Unable to load resolutions:", error);
      setNotice("Saved resolutions could not be loaded. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }, [proposalId, resolutionsKey, dispatchWorkflowUpdate]);

  const updateSelectedResolution = useCallback((updater: (resolution: Resolution) => Resolution, message: string) => {
    if (!selectedResolution) return;
    const next = resolutions.map((item) => item.resolutionId === selectedResolution.resolutionId ? updater(item) : item);
    const updated = next.find((item) => item.resolutionId === selectedResolution.resolutionId);
    setResolutions(next);
    sessionStorage.setItem(resolutionsKey, JSON.stringify(next));
    setNotice(message);
    if (updated) dispatchWorkflowUpdate(updated);
  }, [selectedResolution, resolutions, resolutionsKey, dispatchWorkflowUpdate]);

  const selectResolution = (resolution: Resolution) => {
    setSelectedResolutionId(resolution.resolutionId);
    setSelectedFile(null);
    setNotice("");
    dispatchWorkflowUpdate(resolution);
  };

  const approveResolution = () => {
    if (!selectedResolution || selectedStatus !== "PENDING") return;
    updateSelectedResolution((resolution) => ({
      ...resolution,
      status: "APPROVED",
      approvedAt: new Date().toISOString(),
      records: resolution.records.map((record) => ({ ...record, status: "APPROVED", events: [...(record.events ?? []), "Resolution approved"] })),
    }), `${selectedResolution.resolutionId} approved. You can now print the consolidated resolution.`);
  };

  const printResolution = () => {
    if (!selectedResolution || !["APPROVED", "PRINTED"].includes(selectedStatus)) return;
    // Print before changing the status, so the actual resolution document is still in the DOM.
    window.print();
    updateSelectedResolution((resolution) => ({
      ...resolution,
      status: "PRINTED",
      printedAt: new Date().toISOString(),
      records: resolution.records.map((record) => ({ ...record, status: "PRINTED", events: [...(record.events ?? []), "Included in printed resolution"] })),
    }), "Print dialog completed. Upload the signed copy to continue.");
  };

  const handleFileSelection = (file?: File) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setNotice("Unsupported file type. Please choose a PDF, JPG, JPEG or PNG file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setNotice("The file is larger than 15 MB. Please choose a smaller document.");
      return;
    }
    setSelectedFile(file);
    setNotice("");
  };

  const uploadSignedCopy = async () => {
    if (!selectedResolution || !selectedFile) {
      setNotice("Please select or drop the signed document before uploading.");
      return;
    }
    if (selectedStatus !== "PRINTED") {
      setNotice("The resolution must be printed before its signed copy can be uploaded.");
      return;
    }
    setIsUploading(true);
    try {
      // Demo mode: only metadata/status is saved in sessionStorage. The binary file is not sent to a server.
      updateSelectedResolution((resolution) => ({
        ...resolution,
        status: "UPLOADED",
        uploadedAt: new Date().toISOString(),
        uploadedFileName: selectedFile.name,
        records: resolution.records.map((record) => ({ ...record, status: "UPLOADED", events: [...(record.events ?? []), "Signed copy uploaded"] })),
      }), "Signed copy recorded in demo mode. The resolution is awaiting verification.");
    } catch (error) {
      console.error("Unable to record signed copy:", error);
      setNotice("Unable to record the signed copy. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const verifyResolution = () => {
    if (!selectedResolution || selectedStatus !== "UPLOADED") return;
    updateSelectedResolution((resolution) => ({
      ...resolution,
      status: "SUBMITTED",
      verifiedAt: new Date().toISOString(),
      records: resolution.records.map((record) => ({ ...record, status: "SUBMITTED", events: [...(record.events ?? []), "Resolution verified"] })),
    }), `${selectedResolution.resolutionId} verified successfully.`);
  };

  const revertResolution = () => {
    if (!selectedResolution || selectedStatus !== "UPLOADED") return;
    const confirmed = window.confirm(`Revert ${selectedResolution.resolutionId}? All works in this resolution will return to PENDING.`);
    if (!confirmed) return;
    updateSelectedResolution((resolution) => ({
      ...resolution,
      status: "PENDING",
      approvedAt: undefined,
      printedAt: undefined,
      uploadedAt: undefined,
      verifiedAt: undefined,
      uploadedFileName: undefined,
      records: resolution.records.map((record) => ({ ...record, status: "PENDING", events: [...(record.events ?? []), "Resolution reverted to PENDING"] })),
    }), `${selectedResolution.resolutionId} reverted. All works in this resolution are now PENDING.`);
    setSelectedFile(null);
  };

  if (loading) {
    return <div className="flex min-h-[300px] items-center justify-center gap-3 text-sm text-slate-600"><span className="h-5 w-5 animate-spin rounded-full border-2 border-[#075a91] border-t-transparent" /> Loading resolutions...</div>;
  }

  return (
    <div className="conclusion-workspace flex h-[calc(100dvh-150px)] min-h-[520px] flex-col overflow-hidden bg-[#f2f7fb] text-slate-800">
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 md:flex-row md:gap-4 md:p-4">
        {/* LEFT: scrollable resolution navigator */}
        <aside className="flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[#d4e3ed] bg-white shadow-[0_8px_28px_rgba(7,90,145,0.08)] md:w-[320px] md:min-w-[280px] md:shrink-0 lg:w-[360px]">
          <div className="relative overflow-hidden border-b border-[#dce8f0] bg-gradient-to-br from-[#075a91] to-[#0b4770] p-4 text-white">
            <div className="absolute -right-7 -top-8 h-28 w-28 rounded-full border-[16px] border-white/10" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">VGPP · Resolution Desk</p>
                <h2 className="mt-1 text-xl font-bold">Resolutions</h2>
                <p className="mt-1 text-xs text-blue-100">Choose a resolution to continue its workflow.</p>
              </div>
              <span className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-lg font-bold">{resolutions.length}</span>
            </div>
            <div className="relative mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/15 bg-white/10 p-3"><p className="text-[10px] text-blue-100">Total works</p><p className="mt-1 text-xl font-bold">{resolutions.reduce((sum, item) => sum + item.records.length, 0)}</p></div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3"><p className="text-[10px] text-blue-100">Awaiting verification</p><p className="mt-1 text-xl font-bold">{resolutions.filter((item) => getResolutionStatus(item) === "UPLOADED").length}</p></div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
            {resolutions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#c7dbe8] bg-[#f7fbfe] px-5 py-10 text-center">
                <FileText className="mx-auto h-9 w-9 text-[#7ca9c5]" />
                <p className="mt-3 text-sm font-bold text-slate-700">No resolutions yet</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Submit selected works from Approval to create a resolution.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {resolutions.map((resolution, index) => {
                  const status = getResolutionStatus(resolution);
                  const active = selectedResolution?.resolutionId === resolution.resolutionId;
                  return (
                    <button key={resolution.resolutionId} type="button" onClick={() => selectResolution(resolution)} className={`group relative w-full overflow-hidden rounded-xl border p-3 text-left transition-all ${active ? "border-[#075a91] bg-[#eff7fc] shadow-[0_4px_14px_rgba(7,90,145,0.12)] ring-1 ring-[#075a91]/20" : "border-slate-200 bg-white hover:border-[#a8c9df] hover:bg-[#f8fbfd]"}`}>
                      {active && <span className="absolute inset-y-0 left-0 w-1 bg-[#f58220]" />}
                      <div className="flex items-start justify-between gap-2 pl-1">
                        <div className="min-w-0"><p className="truncate text-sm font-bold text-slate-800">{resolution.resolutionId}</p><p className="mt-1 text-[11px] text-slate-500">Resolution {String(index + 1).padStart(2, "0")} · {formatDate(resolution.createdAt)}</p></div>
                        {status === "SUBMITTED" ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : status === "UPLOADED" ? <Clock3 className="h-4 w-4 shrink-0 text-violet-600" /> : <FileCheck2 className="h-4 w-4 shrink-0 text-[#075a91]" />}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pl-1"><span className="text-xs font-medium text-slate-600">{resolution.records.length} {resolution.records.length === 1 ? "work" : "works"}</span><span className={`inline-flex max-w-full rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusClasses(status)}`}>{STATUS_LABELS[status]}</span></div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-[#dce8f0] bg-[#f8fbfd] px-4 py-3 text-[11px] text-slate-500"><span className="h-2 w-2 rounded-full bg-[#f58220]" /> List scrolls independently · select any resolution</div>
        </aside>

        {/* RIGHT: resolution document OR full upload workspace */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#d4e3ed] bg-white shadow-[0_8px_28px_rgba(7,90,145,0.08)]">
          {!selectedResolution ? (
            <div className="flex flex-1 items-center justify-center p-6 text-center"><div className="max-w-sm"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf4fa]"><FileText className="h-8 w-8 text-[#075a91]" /></div><h2 className="mt-4 text-lg font-bold text-slate-800">Select a resolution</h2><p className="mt-1 text-sm leading-6 text-slate-500">The document and its workflow actions will appear here.</p></div></div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce8f0] bg-white px-4 py-3 md:px-5">
                <div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf4fa] text-[#075a91]">{isUploadStep ? <CloudUpload size={21} /> : <FileText size={21} />}</div><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#075a91]">VGPP · Conclusion</p><h2 className="truncate text-base font-bold text-slate-800">{selectedResolution.resolutionId}{isUploadStep ? " · Signed Document Upload" : " · Resolution Document"}</h2><p className="mt-0.5 text-xs text-slate-500">{selectedResolution.records.length} works grouped in one resolution</p></div></div>
                <span className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${statusClasses(selectedStatus)}`}>{STATUS_LABELS[selectedStatus]}</span>
              </div>

              {isUploadStep ? (
                <section className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-gradient-to-b from-[#f5faff] to-[#edf5fa] p-4 md:p-6 lg:p-8">
                  <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f58220]">Step 3 · Upload</p><h3 className="mt-1 text-xl font-bold text-[#075a91] md:text-2xl">Upload signed resolution</h3><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Drop the signed copy of <strong>{selectedResolution.resolutionId}</strong> here. Preview the document before recording the upload.</p></div><div className="rounded-xl border border-[#d3e5f0] bg-white px-3 py-2 text-xs text-slate-600"><span className="font-semibold text-[#075a91]">Accepted:</span> PDF, JPG, PNG · Max 15 MB</div></div>

                    {selectedStatus === "UPLOADED" ? (
                      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"><CheckCircle2 className="h-9 w-9 text-emerald-600" /></div>
                        <h4 className="mt-4 text-lg font-bold text-slate-800">Signed copy recorded</h4>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">This resolution is awaiting verification. The file metadata is saved in this demo; connect the backend to persist the actual document.</p>
                        <div className="mt-5 flex max-w-full items-center gap-3 rounded-xl border border-[#dce8f0] bg-[#f7fbfe] px-4 py-3 text-left"><FileCheck2 className="h-6 w-6 shrink-0 text-[#075a91]" /><div className="min-w-0"><p className="break-all text-sm font-semibold text-slate-800">{selectedResolution.uploadedFileName || "Signed document"}</p><p className="mt-0.5 text-xs text-slate-500">Uploaded {formatDate(selectedResolution.uploadedAt)}</p></div></div>
                        <div className="mt-6 flex flex-wrap justify-center gap-3"><button type="button" onClick={verifyResolution} className="inline-flex items-center gap-2 rounded-xl bg-[#075a91] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#06466f]"><ShieldCheck size={17} /> Verify Resolution</button><button type="button" onClick={revertResolution} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"><RotateCcw size={16} /> Revert to Pending</button></div>
                      </div>
                    ) : !selectedFile ? (
                      <div onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false); }} onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFileSelection(event.dataTransfer.files?.[0]); }} className={`flex min-h-[320px] flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all md:min-h-[400px] ${isDragging ? "scale-[1.005] border-[#f58220] bg-[#fff7ed] shadow-[0_0_0_4px_rgba(245,130,32,0.10)]" : "border-[#9fc2d9] bg-white/90 hover:border-[#075a91] hover:bg-white"}`}>
                        <div className={`flex h-20 w-20 items-center justify-center rounded-3xl transition ${isDragging ? "bg-orange-100 text-[#d96c0e]" : "bg-[#eaf4fa] text-[#075a91]"}`}><CloudUpload className="h-10 w-10" /></div>
                        <h4 className="mt-5 text-lg font-bold text-slate-800 md:text-xl">{isDragging ? "Drop your document now" : "Drag & drop your signed document"}</h4>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Drop the signed resolution file anywhere in this area. Once selected, a preview will appear here before upload.</p>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#075a91] px-6 py-3 text-sm font-bold text-white shadow-[0_5px_14px_rgba(7,90,145,0.2)] transition hover:-translate-y-0.5 hover:bg-[#06466f]"><FileUp size={18} /> Browse files</button>
                        <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="hidden" onChange={(event) => { handleFileSelection(event.target.files?.[0]); event.target.value = ""; }} />
                        <div className="mt-6 flex flex-wrap justify-center gap-2"><span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">PDF document</span><span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">JPG / PNG image</span><span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">Up to 15 MB</span></div>
                      </div>
                    ) : (
                      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#cfe0eb] bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce8f0] bg-white p-4"><div className="flex min-w-0 items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf4fa] text-[#075a91]">{selectedFile.type === "application/pdf" ? <FileText size={22} /> : <ImageIcon size={22} />}</div><div className="min-w-0"><p className="break-all text-sm font-bold text-slate-800">{selectedFile.name}</p><p className="mt-1 text-xs text-slate-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Preview ready</p></div></div><button type="button" onClick={() => setSelectedFile(null)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"><X size={15} /> Remove / Replace</button></div>
                        <div className="min-h-[320px] flex-1 bg-[#eaf1f6] p-3 md:p-5">{selectedFile.type === "application/pdf" ? <iframe title={`Preview ${selectedFile.name}`} src={previewUrl} className="h-[55vh] min-h-[360px] w-full rounded-xl border border-slate-200 bg-white" /> : <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-slate-200 bg-white p-3"><img src={previewUrl} alt={`Preview ${selectedFile.name}`} className="max-h-[55vh] max-w-full object-contain" /></div>}</div>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dce8f0] p-4"><p className="text-xs text-slate-500">Check that the signed document is correct before uploading.</p><button type="button" disabled={isUploading} onClick={uploadSignedCopy} className="inline-flex items-center gap-2 rounded-xl bg-[#f58220] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#dc7018] disabled:cursor-not-allowed disabled:opacity-60"><Upload size={17} />{isUploading ? "Recording upload…" : "Upload Signed Copy"}</button></div>
                      </div>
                    )}
                    {notice && <p role="status" className="mt-3 rounded-lg border border-[#d3e5f0] bg-white px-4 py-3 text-sm text-slate-700">{notice}</p>}
                    <p className="mt-4 text-center text-[11px] leading-5 text-slate-500">Demo mode: selecting a file displays a local preview. The actual file is not sent to the server until a backend upload API is integrated.</p>
                  </div>
                </section>
              ) : (
                <div className="min-h-0 flex-1 overflow-y-auto bg-[#edf4f8] p-3 md:p-5">
                  <article
                    id="resolution-document"
                    className="resolution-paper relative mx-auto w-full max-w-[1100px] border-t-4 border-[#f58220] bg-[#f8fbff] px-5 py-6 text-[#082b55] shadow-[0_8px_30px_rgba(15,45,65,0.12)] sm:px-8 md:px-10"
                  >
                    {/* Inner document border */}
                    <div className="pointer-events-none absolute inset-2 rounded-lg border border-dashed border-[#cbdde8]" />

                    {/* Header */}
                    <header className="relative border-b border-[#cbdde8] pb-4 text-center">
                      <div className="text-[11px] font-bold uppercase leading-5 sm:text-xs">
                        <p>Gram Panchayat: {location?.panchayat}</p>
                        <p>Block: {location?.block}</p>
                        <p>District: {location?.district}</p>
                      </div>

                      <h1 className="mt-3 text-lg font-extrabold uppercase tracking-wide sm:text-xl">
                        Gram Sabha Resolution
                      </h1>

                      <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                        Approval of Viksit Gram Panchayat Plan (VGPP)
                      </p>

                      <p className="text-[10px] leading-5 text-slate-500 sm:text-xs">
                        Under Viksit Bharat – Guarantee for Rozgar and Ajeevika Mission,
                        Gramin (VB-G RAM G) Act, 2025
                      </p>
                    </header>

                    {/* A. Resolution */}
                    <section className="relative mt-4">
                      <h2 className="border-l-[3px] border-[#f58220] pl-2 text-xs font-extrabold uppercase">
                        A. Resolution
                      </h2>

                      <ol className="mt-2 space-y-2 pl-5 text-[11px] leading-5 sm:text-xs">
                        <li className="pl-1">
                          The Gram Sabha hereby APPROVES the Viksit Gram Panchayat Plan
                          (VGPP) for the year(s) 2027–28 as placed before it. The details
                          of works are listed in Annexure-A of this resolution.
                        </li>
                        <li className="pl-1">
                          This Gram Sabha confirms that the VGPP has been prepared on a
                          saturation basis, after considering identified development gaps,
                          demand for works, local priorities and available resources, and
                          reflects the genuine needs of all sections of the village community.
                        </li>
                        <li className="pl-1">
                          This Gram Sabha authorises the Gram Panchayat to upload this
                          resolution, along with the approved list of works, on the
                          Yuktdhara Planning Portal and to submit the finalised VGPP
                          electronically to the Block level for consolidation.
                        </li>
                        <li className="pl-1">
                          This Gram Sabha further resolves to remain engaged in the periodic
                          review, monitoring, and social audit of the implementation of the
                          approved VGPP, and in assessing the outcomes achieved through the
                          planned interventions.
                        </li>
                      </ol>
                    </section>

                    {/* B. Summary of approved works */}
                    <section className="relative mt-4">
                      <h2 className="border-l-[3px] border-[#f58220] pl-2 text-xs font-extrabold uppercase">
                        B. Summary of Approved Works [VGPP]
                      </h2>

                      <div className="mt-2 overflow-x-auto">
                        <table className="w-full border-collapse text-[10px] sm:text-xs">
                          <thead>
                            <tr className="bg-[#edf3fb] text-center font-extrabold uppercase tracking-wide">
                              <th className="border border-[#d1dfec] border-b-2 border-b-[#f58220] px-2 py-2">
                                Thematic Domain
                              </th>
                              <th className="border border-[#d1dfec] border-b-2 border-b-[#f58220] px-2 py-2">
                                Nos. of Works Proposed
                              </th>
                              <th className="border border-[#d1dfec] border-b-2 border-b-[#f58220] px-2 py-2">
                                Proposed Expenditure (₹)
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {(() => {
                              const themeGroups = new Map<
                                string,
                                { count: number; total: number }
                              >();

                              selectedResolution.records.forEach((record) => {
                                const theme = getWorkValue(
                                  record.work,
                                  ["theme", "themeName", "sector", "category"],
                                  "Other"
                                );

                                const costValue = getWorkValue(
                                  record.work,
                                  ["estimatedCost", "estimatedAmount", "amount", "cost"],
                                  "0"
                                );

                                const cost =
                                  Number(String(costValue).replace(/[₹,\s]/g, "")) || 0;

                                const current = themeGroups.get(theme) ?? {
                                  count: 0,
                                  total: 0,
                                };

                                themeGroups.set(theme, {
                                  count: current.count + 1,
                                  total: current.total + cost,
                                });
                              });

                              const groups = Array.from(themeGroups.entries());
                              const totalCost = groups.reduce(
                                (sum, [, value]) => sum + value.total,
                                0
                              );

                              return (
                                <>
                                  {groups.map(([theme, value]) => (
                                    <tr key={theme}>
                                      <td className="border border-[#d1dfec] px-2 py-1.5">
                                        {theme}
                                      </td>
                                      <td className="border border-[#d1dfec] px-2 py-1.5 text-center">
                                        {value.count}
                                      </td>
                                      <td className="border border-[#d1dfec] px-2 py-1.5 text-right">
                                        {value.total.toLocaleString("en-IN", {
                                          style: "currency",
                                          currency: "INR",
                                          maximumFractionDigits: 0,
                                        })}
                                      </td>
                                    </tr>
                                  ))}

                                  <tr className="bg-[#fff3e5] font-extrabold">
                                    <td className="border border-[#d1dfec] px-2 py-1.5">
                                      Total
                                    </td>
                                    <td className="border border-[#d1dfec] px-2 py-1.5 text-center">
                                      {selectedResolution.records.length}
                                    </td>
                                    <td className="border border-[#d1dfec] px-2 py-1.5 text-right">
                                      {totalCost.toLocaleString("en-IN", {
                                        style: "currency",
                                        currency: "INR",
                                        maximumFractionDigits: 0,
                                      })}
                                    </td>
                                  </tr>
                                </>
                              );
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* Annexure-A */}
                    <section className="relative mt-4">
                      <h2 className="border-l-[3px] border-[#f58220] pl-2 text-xs font-extrabold uppercase">
                        Annexure-A: List of Approved Works
                      </h2>

                      <div className="mt-2 overflow-x-auto">
                        <table className="w-full border-collapse text-[10px] sm:text-xs">
                          <thead>
                            <tr className="bg-[#edf3fb] text-center font-extrabold uppercase tracking-wide">
                              <th className="border border-[#d1dfec] border-b-2 border-b-[#f58220] px-2 py-2">
                                Priority
                              </th>
                              <th className="border border-[#d1dfec] border-b-2 border-b-[#f58220] px-2 py-2">
                                Work Name
                              </th>
                              <th className="border border-[#d1dfec] border-b-2 border-b-[#f58220] px-2 py-2">
                                Theme
                              </th>
                              <th className="border border-[#d1dfec] border-b-2 border-b-[#f58220] px-2 py-2">
                                Type
                              </th>
                              <th className="border border-[#d1dfec] border-b-2 border-b-[#f58220] px-2 py-2">
                                Qty
                              </th>
                              <th className="border border-[#d1dfec] border-b-2 border-b-[#f58220] px-2 py-2">
                                Cost (₹)
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {selectedResolution.records.map((record, index) => {
                              const workStatus = (
                                ["PENDING", "APPROVED", "PRINTED", "UPLOADED", "SUBMITTED"] as string[]
                              ).includes(record.status)
                                ? (record.status as ResolutionStatus)
                                : selectedStatus;

                              return (
                                <tr
                                  key={`${selectedResolution.resolutionId}-${index}`}
                                  className={index % 2 ? "bg-white" : "bg-[#f6f9fd]"}
                                >
                                  <td className="border border-[#d1dfec] px-2 py-1.5 text-center">
                                    {index + 1}
                                  </td>
                                  <td className="border border-[#d1dfec] px-2 py-1.5">
                                    {getWorkName(record.work, index)}
                                  </td>
                                  <td className="border border-[#d1dfec] px-2 py-1.5">
                                    {getWorkValue(
                                      record.work,
                                      ["theme", "themeName", "sector", "category"]
                                    )}
                                  </td>
                                  <td className="border border-[#d1dfec] px-2 py-1.5 text-center">
                                    {getWorkValue(record.work, ["type", "workType"], "New")}
                                  </td>
                                  <td className="border border-[#d1dfec] px-2 py-1.5 text-center">
                                    {getWorkValue(
                                      record.work,
                                      ["quantity", "qty", "unit", "measurement"],
                                      "1 No."
                                    )}
                                  </td>
                                  <td className="border border-[#d1dfec] px-2 py-1.5 text-right whitespace-nowrap">
                                    {getWorkValue(
                                      record.work,
                                      ["estimatedCost", "estimatedAmount", "amount", "cost"],
                                      "—"
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* Footer / signatures */}
                    <footer className="relative mt-6 flex items-end justify-between gap-5 text-[10px] sm:text-xs">
                      <div>
                        <p className="font-bold">
                          Place: {location?.panchayat}, {location?.block}
                        </p>
                        <p className="mt-1 text-slate-500">
                          Date: {formatDate(selectedResolution.createdAt)}
                        </p>
                      </div>

                      <div className="min-w-[120px] text-center">
                        <div className="mb-1 border-t border-slate-400" />
                        <p className="font-bold">Sarpanch</p>
                        <p className="text-slate-500">Gram Panchayat {location?.panchayat}</p>
                      </div>
                    </footer>

                    {/* QR appears only after approval */}
                    {(
                      ["APPROVED", "PRINTED", "UPLOADED", "SUBMITTED"] as ResolutionStatus[]
                    ).includes(selectedStatus) && (
                        <div className="absolute right-5 top-5 z-10 flex flex-col items-center gap-1 rounded-md border border-[#d1dfec] bg-white p-2 sm:right-8 sm:top-8">
                          <QRCodeSVG
                            value={`VGPP:${proposalId}:${selectedResolution.resolutionId}`}
                            size={64}
                            level="M"
                          />
                          {/* <span className="text-[8px] font-bold text-[#075a91]">
                            {selectedResolution.resolutionId}
                          </span> */}
                        </div>
                      )}
                  </article>
                </div>
              )}

              {/* Actions change the whole resolution, never individual works. */}
              {!isUploadStep && <div className="flex flex-wrap items-center gap-2 border-t border-[#dce8f0] bg-white p-3 md:px-5 md:py-4">
                {selectedStatus === "PENDING" && <button type="button" onClick={approveResolution} className="inline-flex items-center gap-2 rounded-xl bg-[#075a91] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#06466f]"><ShieldCheck size={17} /> Approve Resolution</button>}
                {(["APPROVED", "PRINTED"] as ResolutionStatus[]).includes(selectedStatus) && <button type="button" onClick={printResolution} className="inline-flex items-center gap-2 rounded-xl bg-[#075a91] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#06466f]"><Printer size={17} /> {selectedStatus === "PRINTED" ? "Print Again" : "Print Resolution"}</button>}
                {selectedStatus === "SUBMITTED" && <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800"><CheckCircle2 size={17} /> Resolution verified</div>}
                {notice && <p role="status" className="w-full text-xs text-slate-600 md:ml-auto md:w-auto md:max-w-[320px] md:text-right">{notice}</p>}
              </div>}
            </>
          )}
        </main>
      </div>
      <style jsx global>{`@media print { body * { visibility: hidden !important; } #resolution-document, #resolution-document * { visibility: visible !important; } #resolution-document { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; max-width: none !important; min-height: 0 !important; padding: 12mm !important; margin: 0 !important; box-shadow: none !important; overflow: visible !important; } .conclusion-workspace { height: auto !important; min-height: 0 !important; overflow: visible !important; } @page { size: A4; margin: 8mm; } }`}</style>
    </div>
  );
}

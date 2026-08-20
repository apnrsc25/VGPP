"use client";

import {
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { Fragment, useMemo, useState } from "react";

import type { Work } from "@/types/work";

interface RequirementTableProps {
  works: Work[];
  selectedIds: Set<string>;
  onAdd: (work: Work) => void;
  ejalCounts: Map<string, number>;
  activeTab: "ejal" | "permissible";
}

interface SubCategoryGroup {
  name: string;
  works: Work[];
}

interface CategoryGroup {
  name: string;
  works: Work[];
  subCategories: SubCategoryGroup[];
}

type SortColumn =
  | "theme"
  | "subTheme"
  | "workName"
  | "quantity"
  | "unit";

type SortDirection = "asc" | "desc";

type WorkWithOptionalFields = Work & {
  unit?: string;
  count?: number;
};

export default function RequirementTable({
  works,
  selectedIds,
  onAdd,
  ejalCounts,
  activeTab,
}: RequirementTableProps) {
  const [sortColumn, setSortColumn] =
    useState<SortColumn | null>(null);

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [expandedCategories, setExpandedCategories] =
    useState<Set<string>>(new Set());

  const [expandedSubCategories, setExpandedSubCategories] =
    useState<Set<string>>(new Set());

  const getQuantity = (work: Work) => {
    const item = work as WorkWithOptionalFields;

    return item.quantity ?? item.count ?? 0;
  };

  const getUnit = (work: Work) => {
    const item = work as WorkWithOptionalFields;

    return item.unit ?? "—";
  };

  const compareValues = (
    valueA: string | number,
    valueB: string | number
  ) => {
    if (
      typeof valueA === "number" &&
      typeof valueB === "number"
    ) {
      return valueA - valueB;
    }

    return String(valueA).localeCompare(
      String(valueB),
      undefined,
      {
        sensitivity: "base",
        numeric: true,
      }
    );
  };

  const sortedWorks = useMemo(() => {
    if (!sortColumn) {
      return works;
    }

    return [...works].sort((a, b) => {
      let valueA: string | number = "";
      let valueB: string | number = "";

      switch (sortColumn) {
        case "theme":
          valueA = a.theme ?? "";
          valueB = b.theme ?? "";
          break;

        case "subTheme":
          valueA = a.subTheme ?? "";
          valueB = b.subTheme ?? "";
          break;

        case "workName":
          valueA = a.workName ?? "";
          valueB = b.workName ?? "";
          break;

        case "quantity":
          valueA = getQuantity(a);
          valueB = getQuantity(b);
          break;

        case "unit":
          valueA = getUnit(a);
          valueB = getUnit(b);
          break;
      }

      const result = compareValues(valueA, valueB);

      return sortDirection === "asc"
        ? result
        : -result;
    });
  }, [works, sortColumn, sortDirection]);

  const groupedWorks = useMemo<CategoryGroup[]>(() => {
    const categoryMap = new Map<string, Work[]>();

    sortedWorks.forEach((work) => {
      const category =
        work.theme?.trim() || "Other";

      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }

      categoryMap.get(category)!.push(work);
    });

    const categoryOrder = [
      "Water Security",
      "Rural Infrastructure",
      "Livelihood Infrastructure",
      "Climate Resilience",
    ];

    const sortedCategories =
      Array.from(categoryMap.entries()).sort(
        ([categoryA], [categoryB]) => {
          if (sortColumn === "theme") {
            const result = categoryA.localeCompare(
              categoryB,
              undefined,
              {
                sensitivity: "base",
                numeric: true,
              }
            );

            return sortDirection === "asc"
              ? result
              : -result;
          }

          const indexA =
            categoryOrder.indexOf(categoryA);

          const indexB =
            categoryOrder.indexOf(categoryB);

          if (
            indexA !== -1 &&
            indexB !== -1
          ) {
            return indexA - indexB;
          }

          if (indexA !== -1) {
            return -1;
          }

          if (indexB !== -1) {
            return 1;
          }

          return categoryA.localeCompare(
            categoryB,
            undefined,
            {
              sensitivity: "base",
            }
          );
        }
      );

    return sortedCategories.map(
      ([categoryName, categoryWorks]) => {
        const subCategoryMap =
          new Map<string, Work[]>();

        categoryWorks.forEach((work) => {
          const subCategory =
            work.subTheme?.trim() || "Other";

          if (!subCategoryMap.has(subCategory)) {
            subCategoryMap.set(
              subCategory,
              []
            );
          }

          subCategoryMap
            .get(subCategory)!
            .push(work);
        });

        const subCategories =
          Array.from(
            subCategoryMap.entries()
          )
            .sort(
              ([subA], [subB]) => {
                if (
                  sortColumn ===
                  "subTheme"
                ) {
                  const result =
                    subA.localeCompare(
                      subB,
                      undefined,
                      {
                        sensitivity:
                          "base",
                        numeric: true,
                      }
                    );

                  return sortDirection ===
                    "asc"
                    ? result
                    : -result;
                }

                return subA.localeCompare(
                  subB,
                  undefined,
                  {
                    sensitivity: "base",
                  }
                );
              }
            )
            .map(
              ([name, subWorks]) => ({
                name,
                works: subWorks,
              })
            );

        return {
          name: categoryName,
          works: categoryWorks,
          subCategories,
        };
      }
    );
  }, [
    sortedWorks,
    sortColumn,
    sortDirection,
  ]);

  const toggleCategory = (
    category: string
  ) => {
    setExpandedCategories((current) => {
      const next = new Set(current);

      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }

      return next;
    });
  };

  const toggleSubCategory = (
    category: string,
    subCategory: string
  ) => {
    const key =
      `${category}__${subCategory}`;

    setExpandedSubCategories((current) => {
      const next = new Set(current);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  const getThemeClasses = (
    theme: string
  ) => {
    if (
      theme ===
      "Rural Infrastructure"
    ) {
      return {
        text: "text-[#7c3aed]",
        bg: "bg-[#f5f0ff]",
        dot: "bg-[#7c3aed]",
      };
    }

    if (
      theme ===
      "Livelihood Infrastructure"
    ) {
      return {
        text: "text-[#00875a]",
        bg: "bg-[#effbf5]",
        dot: "bg-[#00875a]",
      };
    }

    if (
      theme ===
      "Climate Resilience"
    ) {
      return {
        text: "text-[#0879b1]",
        bg: "bg-[#edf8fd]",
        dot: "bg-[#0879b1]",
      };
    }

    return {
      text: "text-[#d97706]",
      bg: "bg-[#fff8ed]",
      dot: "bg-[#d97706]",
    };
  };

  const handleSort = (
    column: SortColumn
  ) => {
    if (sortColumn === column) {
      setSortDirection((current) =>
        current === "asc"
          ? "desc"
          : "asc"
      );

      return;
    }

    setSortColumn(column);
    setSortDirection("asc");
  };

  const SortIcon = ({
    column,
  }: {
    column: SortColumn;
  }) => {
    if (sortColumn !== column) {
      return (
        <ArrowUpDown
          size={11}
          className="opacity-50"
        />
      );
    }

    return sortDirection === "asc" ? (
      <ArrowUp size={11} />
    ) : (
      <ArrowDown size={11} />
    );
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto">
      <table className="w-full min-w-[760px] table-fixed border-collapse text-[10px] sm:text-[11px]">
        <thead className="sticky top-0 z-20 bg-[#003b63] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
          <tr className="h-9 text-[8px] uppercase tracking-[0.5px] sm:h-10 sm:text-[9px]">
            <th className="w-[18%] px-2 text-left">
              <button type="button" onClick={() => handleSort("theme")} className="flex w-full cursor-pointer items-center gap-1.5 text-left font-bold transition hover:text-[#f58220]">
                <span>THEME</span>
                <SortIcon column="theme" />
              </button>
            </th>

            <th className="w-[20%] px-2 text-left">
              <button type="button" onClick={() => handleSort("subTheme")} className="flex w-full cursor-pointer items-center gap-1.5 text-left font-bold transition hover:text-[#f58220]">
                <span>SUB THEME</span>
                <SortIcon column="subTheme" />
              </button>
            </th>

            <th className="w-[35%] px-2 text-left">
              <button type="button" onClick={() => handleSort("workName")} className="flex w-full cursor-pointer items-center gap-1.5 text-left font-bold transition hover:text-[#f58220]">
                <span>WORK NAME</span>
                <SortIcon column="workName" />
              </button>
            </th>

            <th className="w-[9%] px-2 text-center">
              <button type="button" onClick={() => handleSort("quantity")} className="mx-auto flex cursor-pointer items-center justify-center gap-1.5 font-bold transition hover:text-[#f58220]">
                <span>QTY</span>
                <SortIcon column="quantity" />
              </button>
            </th>

            <th className="w-[10%] px-2 text-center">
              <button type="button" onClick={() => handleSort("unit")} className="mx-auto flex cursor-pointer items-center justify-center gap-1.5 font-bold transition hover:text-[#f58220]">
                <span>UNIT</span>
                <SortIcon column="unit" />
              </button>
            </th>

            <th className="w-[8%] px-2 text-center">
              ADD
            </th>
          </tr>
        </thead>

        <tbody>
          {groupedWorks.map((category) => {
            const categoryExpanded =
              expandedCategories.has(
                category.name
              );

            const themeClasses =
              getThemeClasses(
                category.name
              );

            return (
              <Fragment
                key={`category-${category.name}`}
              >
                <tr
                  onClick={() =>
                    toggleCategory(
                      category.name
                    )
                  }
                  className="h-11 cursor-pointer border-b border-[#cbdde8] bg-[#f3f9fc] transition hover:bg-[#e7f3f9]"
                >
                  <td
                    colSpan={2}
                    className="px-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-white text-[#075a91] shadow-sm">
                        {categoryExpanded ? (
                          <ChevronDown
                            size={14}
                          />
                        ) : (
                          <ChevronRight
                            size={14}
                          />
                        )}
                      </span>

                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${themeClasses.dot}`}
                      />

                      <span
                        className={`truncate text-[9px] font-extrabold uppercase tracking-[0.35px] sm:text-[10px] ${themeClasses.text}`}
                      >
                        {category.name}
                      </span>
                    </div>
                  </td>

                  <td
                    colSpan={3}
                    className="px-2"
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[8px] font-semibold text-slate-400">
                        {category.subCategories.length} SUB-CATEGORIES
                      </span>

                      <span className="rounded-full bg-white px-2 py-1 text-[8px] font-extrabold text-[#075a91] shadow-sm">
                        {category.works.length}
                      </span>

                      <span className="text-[7px] font-bold text-slate-400">
                        WORKS
                      </span>
                    </div>
                  </td>

                  <td />
                </tr>

                {categoryExpanded &&
                  category.subCategories.map(
                    (subCategory) => {
                      const subKey =
                        `${category.name}__${subCategory.name}`;

                      const subExpanded =
                        expandedSubCategories.has(
                          subKey
                        );

                      return (
                        <Fragment
                          key={`subcategory-${subKey}`}
                        >
                          <tr
                            onClick={() =>
                              toggleSubCategory(
                                category.name,
                                subCategory.name
                              )
                            }
                            className="h-10 cursor-pointer border-b border-[#e1ebf0] bg-white transition hover:bg-[#f7fbfd]"
                          >
                            <td className="px-2">
                              <span className="ml-4 flex items-center gap-2">
                                {subExpanded ? (
                                  <ChevronDown
                                    size={13}
                                    className="text-[#075a91]"
                                  />
                                ) : (
                                  <ChevronRight
                                    size={13}
                                    className="text-slate-400"
                                  />
                                )}

                                <span className="h-1.5 w-1.5 rounded-full bg-[#f58220]" />

                                <span className="text-[8px] font-bold text-[#36566b] sm:text-[9px]">
                                  {category.name}
                                </span>
                              </span>
                            </td>

                            <td
                              className="truncate px-2 font-bold text-[#263f52]"
                              title={subCategory.name}
                            >
                              {subCategory.name}
                            </td>

                            <td className="px-2">
                              <span className="rounded-full bg-[#f1f7fa] px-2 py-1 text-[7px] font-bold text-[#526b7b]">
                                {subCategory.works.length} WORKS
                              </span>
                            </td>

                            <td className="px-2 text-center">
                              {activeTab === "ejal" ? (
                                <span className="text-[8px] font-bold text-[#075a91]">
                                  {subCategory.works.reduce(
                                    (total, work) =>
                                      total +
                                      getQuantity(
                                        work
                                      ),
                                    0
                                  )}
                                </span>
                              ) : (
                                <span className="text-slate-300">
                                  —
                                </span>
                              )}
                            </td>

                            <td />
                            <td />
                          </tr>

                          {subExpanded &&
                            subCategory.works.map(
                              (work) => {
                                const selectedCount =
                                  ejalCounts.get(
                                    work.id
                                  ) ?? 0;

                                const originalCount =
                                  getQuantity(work);

                                const remainingCount =
                                  activeTab === "ejal"
                                    ? Math.max(
                                      0,
                                      originalCount -
                                      selectedCount
                                    )
                                    : null;

                                const isSelected =
                                  selectedIds.has(
                                    work.id
                                  );

                                const isDisabled =
                                  activeTab === "ejal"
                                    ? remainingCount === 0
                                    : false;

                                return (
                                  <tr
                                    key={`work-${work.id}`}
                                    className="group h-10 border-b border-[#edf2f5] bg-white text-[#334155] transition hover:bg-[#f8fbfd] sm:h-11"
                                  >
                                    <td className="px-2">
                                      <div className="ml-8 flex items-center gap-1.5">
                                        <span className="h-1 w-1 shrink-0 rounded-full bg-[#cbd5e1]" />

                                        <span
                                          className={`truncate text-[7px] font-semibold sm:text-[8px] ${themeClasses.text}`}
                                        >
                                          {category.name}
                                        </span>
                                      </div>
                                    </td>

                                    <td
                                      className="truncate px-2 text-[8px] text-slate-400"
                                      title={
                                        subCategory.name
                                      }
                                    >
                                      {subCategory.name}
                                    </td>

                                    <td
                                      className="truncate px-2 font-semibold text-[#263f52]"
                                      title={
                                        work.workName
                                      }
                                    >
                                      <div className="ml-2 flex min-w-0 items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#075a91] opacity-50 group-hover:opacity-100" />

                                        <span className="truncate">
                                          {work.workName}
                                        </span>
                                      </div>
                                    </td>

                                    <td className="px-2 text-center">
                                      <span className="inline-flex min-w-7 items-center justify-center rounded-[4px] border border-[#c7dfed] bg-[#edf7fc] px-1.5 py-1 text-[8px] font-extrabold text-[#075a91]">
                                        {activeTab ===
                                          "ejal"
                                          ? remainingCount
                                          : getQuantity(
                                            work
                                          )}
                                      </span>
                                    </td>

                                    <td className="px-2 text-center">
                                      <span className="text-[8px] font-medium text-slate-500">
                                        {getUnit(work)}
                                      </span>
                                    </td>

                                    <td className="px-2 text-center">
                                      {/* <button
                                        type="button"
                                        disabled={
                                          isDisabled
                                        }
                                        onClick={(
                                          event
                                        ) => {
                                          event.stopPropagation();
                                          onAdd(work);
                                        }}
                                        title={
                                          isDisabled
                                            ? "Already selected"
                                            : "Add work"
                                        }
                                        className={`mx-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border transition-all active:scale-90 ${isDisabled ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300" : "border-[#9ed1b8] bg-[#f0fbf5] text-[#00875a] hover:border-[#00875a] hover:bg-[#00875a] hover:text-white"}`}
                                      >
                                        {isSelected &&
                                        activeTab ===
                                          "permissible" ? (
                                          <Check
                                            size={12}
                                          />
                                        ) : (
                                          <Plus
                                            size={13}
                                          />
                                        )}
                                      </button> */}

                                      <button
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={() => onAdd(work)}
                                        title={isDisabled ? "Quantity limit reached" : "Add work"}
                                        className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full border transition-all active:scale-90 ${isDisabled
                                          ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
                                          : "cursor-pointer border-[#9ed1b8] bg-[#f0fbf5] text-[#00875a] hover:border-[#00875a] hover:bg-[#00875a] hover:text-white"
                                          }`}
                                      >
                                        {activeTab === "permissible" ? (
                                          <Plus size={13} />
                                        ) : isSelected ? (
                                          <Check size={12} />
                                        ) : (
                                          <Plus size={13} />
                                        )}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                        </Fragment>
                      );
                    }
                  )}
              </Fragment>
            );
          })}

          {works.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="py-16 text-center"
              >
                <div className="mx-auto max-w-[250px]">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7fc] text-[#075a91]">
                    <Plus size={17} />
                  </div>

                  <p className="text-[10px] font-bold text-slate-500">
                    No works available
                  </p>

                  <p className="mt-1 text-[8px] text-slate-400">
                    Try changing your search or filters.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
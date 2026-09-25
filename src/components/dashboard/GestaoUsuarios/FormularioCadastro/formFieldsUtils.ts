export const labelClass = (disabled: boolean) =>
    `required text-[14px] font-[700] ${disabled ? "text-[#B0B0B0]" : "text-[#42474a]"}`;

export const inputClass = (disabled: boolean) =>
    `font-normal border-[#DADADA] bg-white ${disabled ? "text-[#B0B0B0]" : ""}`;

export const comboboxClass = (disabled: boolean) =>
    `border-[#DADADA] bg-white ${disabled ? "text-[#B0B0B0]" : ""}`;

export function getEmailDreUeGridCols(
    showDRE: boolean,
    showUE: boolean,
): string {
    if (showDRE && showUE) return "md:grid-cols-3";
    if (showDRE || showUE) return "md:grid-cols-2";
    return "";
}

"use client";

import { MultiSelect } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
    label: string;
    value: string;
}

export interface MultiSelectWithOtherProps {
    options: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;

    shouldShowTextField: (
        selectedValues: string[],
        options: MultiSelectOption[],
    ) => boolean;

    label?: string;

    textFieldLabel?: string;
    textFieldPlaceholder?: string;
    textFieldValue?: string;
    onTextFieldChange?: (value: string) => void;
    textFieldDisabled?: boolean;
    textFieldError?: string;

    hint?: string;
}

export function MultiSelectWithOther({
    options,
    value,
    onChange,
    placeholder,
    disabled = false,
    className,
    shouldShowTextField,
    label,
    textFieldLabel,
    textFieldPlaceholder = "Descreva aqui...",
    textFieldValue = "",
    onTextFieldChange,
    textFieldDisabled,
    textFieldError,
    hint,
}: Readonly<MultiSelectWithOtherProps>) {
    const showTextField = shouldShowTextField(value, options);
    const isTextFieldDisabled = textFieldDisabled ?? disabled;

    return (
        <div
            className={cn(
                "flex flex-col gap-2",
                showTextField && "bg-[#F5F6F8] rounded-md p-4",
                className,
            )}
        >
            {label && (
                <label
                    className={cn(
                        "text-sm font-bold",
                        disabled ? "text-[#B0B0B0]" : "text-[#42474a]",
                    )}
                >
                    {label}
                </label>
            )}

            <MultiSelect
                options={options}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
            />

            {hint && (
                <p
                    className={cn(
                        "text-sm",
                        disabled ? "text-[#B0B0B0]" : "text-[#42474a]",
                    )}
                >
                    {hint}
                </p>
            )}

            {showTextField && (
                <div className="flex flex-col gap-2 mt-2">
                    {textFieldLabel && (
                        <label
                            className={cn(
                                "text-sm font-bold",
                                isTextFieldDisabled
                                    ? "text-[#B0B0B0]"
                                    : "text-[#42474a]",
                            )}
                        >
                            {textFieldLabel}
                        </label>
                    )}
                    <textarea
                        placeholder={textFieldPlaceholder}
                        value={textFieldValue}
                        onChange={(e) => onTextFieldChange?.(e.target.value)}
                        disabled={isTextFieldDisabled}
                        className={cn(
                            "flex min-h-[80px] w-full border border-[#dadada] bg-background px-3 py-2 text-sm font-medium",
                            "ring-0 ring-offset-0 shadow-none outline-none",
                            "focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none focus:bg-[#E8F0FE] focus:border-[#ced4da]",
                            "disabled:cursor-not-allowed disabled:border-[#B0B0B0] disabled:text-[#B0B0B0]",
                            "rounded-[4px] resize-none",
                            textFieldError && "!border-destructive",
                        )}
                    />
                    {textFieldError && (
                        <p className="text-sm font-medium text-destructive">
                            {textFieldError}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

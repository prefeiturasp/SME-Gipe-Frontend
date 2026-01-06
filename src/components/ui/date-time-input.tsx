import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface DateTimeInputProps {
    dateValue?: string;
    timeValue?: string;
    onDateChange?: (value: string) => void;
    onTimeChange?: (value: string) => void;
    maxDate?: string;
    datePlaceholder?: string;
    timePlaceholder?: string;
    className?: string;
    disabled?: boolean;
}

const DateTimeInput = React.forwardRef<HTMLDivElement, DateTimeInputProps>(
    (
        {
            dateValue,
            timeValue,
            onDateChange,
            onTimeChange,
            maxDate,
            datePlaceholder = "Selecione a data",
            timePlaceholder = "Digite o horário",
            className,
            disabled = false,
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex items-center gap-0 border rounded-md overflow-hidden bg-background",
                    disabled ? "border-[#B0B0B0]" : "border-input",
                    className
                )}
            >
                <div className="flex-1">
                    <Input
                        type="date"
                        placeholder={datePlaceholder}
                        value={dateValue}
                        onChange={(e) => onDateChange?.(e.target.value)}
                        max={maxDate}
                        readOnly={disabled}
                        className={cn(
                            "border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 has-calendar",
                            disabled &&
                                "text-[#B0B0B0] cursor-not-allowed pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-50"
                        )}
                    />
                </div>
                <div className="flex-1">
                    <Input
                        type="time"
                        placeholder={timePlaceholder}
                        value={timeValue}
                        readOnly={disabled}
                        onChange={(e) => onTimeChange?.(e.target.value)}
                        className={cn(
                            "border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 has-calendar",
                            disabled &&
                                "text-[#B0B0B0] cursor-not-allowed pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-50"
                        )}
                    />
                </div>
            </div>
        );
    }
);

DateTimeInput.displayName = "DateTimeInput";

export { DateTimeInput };

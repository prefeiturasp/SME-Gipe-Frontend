import * as React from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
    CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function MultiSelect({
    options,
    value = [],
    onChange,
    placeholder = "Selecione...",
    disabled = false,
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (optionValue: string) => {
        const newValue = value.includes(optionValue)
            ? value.filter((v) => v !== optionValue)
            : [...value, optionValue];
        onChange(newValue);
    };

    const getDisplayText = () => {
        if (value.length === 0) {
            return placeholder;
        }

        const selectedLabels = value
            .map((val) => options.find((opt) => opt.value === val)?.label)
            .filter(Boolean);

        return selectedLabels.join(", ");
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    className={cn(
                        "w-full justify-between text-[14px] text-[#42474A] font-[400]",
                        value.length === 0 && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled}
                >
                    {getDisplayText()}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                sideOffset={4}
                className="w-[var(--radix-popover-trigger-width)] p-0 min-w-[200px]"
            >
                <Command>
                    <CommandInput placeholder="Buscar..." />
                    <CommandList>
                        <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
                        {options.map((opt) => {
                            const isSelected = value.includes(opt.value);
                            return (
                                <CommandItem
                                    key={opt.value}
                                    value={opt.label}
                                    onSelect={() => handleSelect(opt.value)}
                                    className={cn(
                                        "cursor-pointer flex items-center gap-2"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex h-4 w-4 items-center justify-center rounded-sm border border-[#dadada]",
                                            isSelected
                                                ? "bg-[#717FC7] border-[#717FC7] text-white"
                                                : "bg-white"
                                        )}
                                    >
                                        {isSelected && (
                                            <Check className="h-3 w-3" />
                                        )}
                                    </div>
                                    <span>{opt.label}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

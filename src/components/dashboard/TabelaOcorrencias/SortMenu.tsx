"use client";

import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

type SortOption = {
    id: string | number;
    label: string;
    desc: boolean;
};

export default function SortMenu({
    options,
    onSelect,
    selectedId,
    children,
}: Readonly<{
    options: SortOption[];
    onSelect: (opt: SortOption) => void;
    selectedId?: string;
    children?: React.ReactNode;
}>) {
    const opts = React.useMemo(
        () => options.map((o) => ({ ...o, id: String(o.id) })),
        [options]
    );

    const radioGroupProps =
        selectedId !== undefined
            ? { value: String(selectedId) }
            : { defaultValue: opts[0]?.id };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="inline-flex items-center cursor-pointer">
                    {children}
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent sideOffset={6}>
                <DropdownMenuRadioGroup
                    {...radioGroupProps}
                    onValueChange={(val) => {
                        const opt = opts.find(
                            (o) => String(o.id) === String(val)
                        );
                        if (opt) onSelect(opt);
                    }}
                >
                    {opts.map((opt) => (
                        <DropdownMenuRadioItem key={opt.id} value={opt.id}>
                            <div className="flex items-center justify-between w-full">
                                <span>{opt.label}</span>
                            </div>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

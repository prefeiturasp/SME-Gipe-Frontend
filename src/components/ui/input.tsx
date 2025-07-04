import * as React from "react";

import { Props as BaseInputMaskProps } from "react-input-mask";
import BaseInputMask from "@mona-health/react-input-mask";

import { cn } from "@/lib/utils";
import { numberToBRL } from "@/lib/utils";
import { useFormField } from "./form";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        const { error } = useFormField();

        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#E6E6E6]",
                    error &&
                        "!border-destructive focus-visible:ring-destructive",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export interface InputMaskProps extends InputProps {
    maskProps: BaseInputMaskProps;
}

const InputMask = React.forwardRef<HTMLInputElement, InputMaskProps>(
    ({ maskProps, ...props }, ref) => {
        return (
            <BaseInputMask
                {...maskProps}
                {...props}
                maskPlaceholder={null}
                ref={ref}
            >
                <Input />
            </BaseInputMask>
        );
    }
);
InputMask.displayName = "InputMask";

export interface CurrencyInputProps extends InputProps {}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ onChange, ...props }, ref) => {
        return (
            <Input
                {...props}
                onChange={(e) => {
                    const cleanedValue = Number(
                        e.target.value.replace(/\D/g, "")
                    );
                    const valueCents = Number(cleanedValue) / 100;
                    e.target.value = numberToBRL(valueCents);
                    onChange && onChange(e);
                }}
                ref={ref}
            />
        );
    }
);
CurrencyInput.displayName = "CurrencyInput";

const DocumentInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ onChange, ...props }, ref) => {
        return (
            <Input
                {...props}
                onChange={(e) => {
                    const input = e.target as HTMLInputElement;
                    const cleanedValue = input.value.replace(/\D/g, "");
                    if (cleanedValue.length <= 11) {
                        input.value = cleanedValue
                            .replace(/(\d{3})(\d)/, "$1.$2")
                            .replace(/(\d{3})(\d)/, "$1.$2")
                            .replace(/(\d{3})(\d{1,2})/, "$1-$2");
                    } else {
                        input.value = cleanedValue
                            .replace(/(\d{2})(\d)/, "$1.$2")
                            .replace(/(\d{3})(\d)/, "$1.$2")
                            .replace(/(\d{3})(\d)/, "$1/$2")
                            .replace(/(\d{4})(\d)/, "$1-$2")
                            .replace(/(-\d{2})\d+/, "$1");
                    }
                    onChange && onChange(e);
                }}
                ref={ref}
            />
        );
    }
);
DocumentInput.displayName = "DocumentInput";

const PhoneInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ onChange, ...props }, ref) => {
        return (
            <Input
                {...props}
                onChange={(e) => {
                    const input = e.target as HTMLInputElement;
                    const cleanedValue = input.value.replace(/\D/g, "");
                    if (cleanedValue.length <= 10) {
                        input.value = cleanedValue
                            .replace(/(\d{2})(\d)/, "($1) $2")
                            .replace(/(\d{4})(\d)/, "$1-$2");
                    } else {
                        input.value = cleanedValue
                            .replace(/(\d{2})(\d)/, "($1) $2")
                            .replace(/(\d{5})(\d)/, "$1-$2")
                            .replace(/(-\d{4})\d+/, "$1");
                    }
                    onChange && onChange(e);
                }}
                ref={ref}
            />
        );
    }
);
PhoneInput.displayName = "PhoneInput";

export { Input, InputMask, CurrencyInput, DocumentInput, PhoneInput };

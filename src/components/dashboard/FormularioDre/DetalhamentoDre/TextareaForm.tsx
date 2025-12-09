import { Control, FieldPath } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormularioDreData } from "./schema";

type TextareaFormProps = {
    control: Control<FormularioDreData>;
    name: FieldPath<FormularioDreData>;
    label: string;
    placeholder?: string;
};

export function TextareaForm({
    control,
    name,
    label,
    placeholder = "Descreva aqui...",
}: Readonly<TextareaFormProps>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={placeholder}
                            className="min-h-[120px]"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

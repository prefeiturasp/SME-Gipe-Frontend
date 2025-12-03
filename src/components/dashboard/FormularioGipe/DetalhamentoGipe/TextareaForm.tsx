import { Control, FieldPath } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormularioGipeData } from "./schema";

type TextareaFormProps = {
    control: Control<FormularioGipeData>;
    name: FieldPath<FormularioGipeData>;
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
                            className="min-h-[80px]"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

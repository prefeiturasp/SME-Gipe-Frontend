"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control, FieldValues, Path } from "react-hook-form";

interface CampoDescricaoOcorrenciaProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    disabled?: boolean;
    questionNumber?: number;
}

export function CampoDescricaoOcorrencia<T extends FieldValues>({
    control,
    name,
    disabled = false,
    questionNumber,
}: Readonly<CampoDescricaoOcorrenciaProps<T>>) {
    const prefix = questionNumber == null ? "" : `${questionNumber}. `;
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel disabled={disabled}>
                        {prefix}Descreva a ocorrência*
                    </FormLabel>
                    <p
                        className={`text-sm mt-1 mb-2 ${
                            disabled ? "text-[#B0B0B0]" : "text-[#42474a]"
                        }`}
                    >
                        Descreva o que ocorreu, incluindo data, local, caso
                        existam pessoas envolvidas e demais informações
                        relevantes para o registro.
                    </p>
                    <FormControl>
                        <Textarea
                            placeholder="Descreva aqui..."
                            className="min-h-[80px]"
                            {...field}
                            disabled={disabled}
                        />
                    </FormControl>
                    <Alert className="mt-2" variant="info">
                        <AlertDescription>
                            <strong>Importante:</strong> Esse campo não exclui a
                            necessidade de lavratura do boletim de ocorrência
                        </AlertDescription>
                    </Alert>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

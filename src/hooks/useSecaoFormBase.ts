import { ForwardedRef, useEffect, useImperativeHandle } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export type SecaoBaseRef<T extends FieldValues> = {
    getFormData: () => T;
    submitForm: () => Promise<boolean>;
    getFormInstance: () => UseFormReturn<T>;
};

type UseSecaoFormBaseParams<T extends FieldValues> = {
    form: UseFormReturn<T>;
    onFormChange?: (data: Partial<T>) => void;
    handleSubmit: (data: T) => Promise<void>;
    ref: ForwardedRef<SecaoBaseRef<T>>;
};

export function useSecaoFormBase<T extends FieldValues>({
    form,
    onFormChange,
    handleSubmit,
    ref,
}: UseSecaoFormBaseParams<T>) {
    const watchedValues = form.watch();
    useEffect(() => {
        onFormChange?.(watchedValues);
    }, [watchedValues, onFormChange]);

    useImperativeHandle(ref, () => ({
        getFormData: () => form.getValues(),
        submitForm: async () => {
            const isValid = await form.trigger();
            if (!isValid) return false;
            const data = form.getValues();
            await handleSubmit(data);
            return true;
        },
        getFormInstance: () => form,
    }));
}

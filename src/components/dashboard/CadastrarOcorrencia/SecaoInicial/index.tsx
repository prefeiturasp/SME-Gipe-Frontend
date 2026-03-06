"use client";

import { Button } from "@/components/ui/button";
import { DateTimeInput } from "@/components/ui/date-time-input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/headless-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAtualizarSecaoInicial } from "@/hooks/useAtualizarSecaoInicial";
import { useGetUnidades } from "@/hooks/useGetUnidades";
import { useSecaoInicial } from "@/hooks/useSecaoInicial";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { hasFormDataChanged } from "@/lib/formUtils";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useUserStore } from "@/stores/useUserStore";
import { UnidadeEducacional } from "@/types/unidades";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { formSchema, SecaoInicialData } from "./schema";

export type SecaoInicialProps = {
    onSuccess?: () => void;
    showButtons?: boolean;
    onFormChange?: (data: Partial<SecaoInicialData>) => void;
    disabled?: boolean;
};

export type SecaoInicialRef = {
    getFormData: () => SecaoInicialData;
    submitForm: () => Promise<boolean>;
    getFormInstance: () => UseFormReturn<SecaoInicialData>;
};

const SecaoInicial = forwardRef<SecaoInicialRef, SecaoInicialProps>(
    (
        { onSuccess, showButtons = true, onFormChange, disabled = false },
        ref,
    ) => {
        const user = useUserStore((state) => state.user);
        const { isGipe, isPontoFocal, isAssistenteOuDiretor } =
            useUserPermissions();
        const { mutateAsync: criarOcorrencia, isPending: isCriando } =
            useSecaoInicial();
        const { mutateAsync: atualizarOcorrencia, isPending: isAtualizando } =
            useAtualizarSecaoInicial();

        const {
            formData,
            savedFormData,
            setFormData,
            setSavedFormData,
            setOcorrenciaUuid,
            ocorrenciaUuid,
        } = useOcorrenciaFormStore();

        const [dreUuid, setDreUuid] = useState<string>(
            user?.unidades[0]?.dre?.dre_uuid ?? "",
        );

        const {
            data: dresData,
            isLoading: isLoadingDres,
            isError: isErrorDres,
        } = useGetUnidades(true, undefined, "DRE");

        const {
            data: uesData,
            isLoading: isLoadingUes,
            isError: isErrorUes,
        } = useGetUnidades(true, dreUuid || undefined);

        useEffect(() => {
            if (isGipe && formData.dre && !dreUuid && dresData?.length) {
                const matchingDre = dresData.find(
                    (d: UnidadeEducacional) => d.codigo_eol === formData.dre,
                );
                if (matchingDre) {
                    setDreUuid(matchingDre.uuid);
                }
            }
        }, [isGipe, formData.dre, dreUuid, dresData]);

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const maxDate = `${yyyy}-${mm}-${dd}`;

        const getDefaultDre = () => {
            if (formData.dre) return formData.dre;
            if (isAssistenteOuDiretor || isPontoFocal)
                return user?.unidades[0]?.dre?.codigo_eol ?? "";
            return "";
        };

        const getDefaultUe = () => {
            if (formData.unidadeEducacional) return formData.unidadeEducacional;
            if (isAssistenteOuDiretor)
                return user?.unidades[0]?.ue?.codigo_eol ?? "";
            return "";
        };

        const form = useForm<SecaoInicialData>({
            resolver: zodResolver(formSchema),
            mode: "onChange",
            defaultValues: {
                dataOcorrencia: formData.dataOcorrencia ?? "",
                horaOcorrencia: formData.horaOcorrencia ?? "",
                dre: getDefaultDre(),
                unidadeEducacional: getDefaultUe(),
                tipoOcorrencia: formData.tipoOcorrencia ?? undefined,
            },
        });

        const isDreDisabled =
            disabled ||
            !!ocorrenciaUuid ||
            isAssistenteOuDiretor ||
            isPontoFocal;
        const dreValue = form.watch("dre");
        const isUeDisabled =
            disabled || !!ocorrenciaUuid || isAssistenteOuDiretor || !dreValue;

        const { isValid } = form.formState;

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

        const handleSubmit = async (data: SecaoInicialData) => {
            setFormData(data);

            if (ocorrenciaUuid) {
                if (!hasFormDataChanged(data, savedFormData)) {
                    onSuccess?.();
                    return;
                }

                const dataHoraOcorrencia = new Date(
                    `${data.dataOcorrencia}T${data.horaOcorrencia}`,
                ).toISOString();

                const response = await atualizarOcorrencia({
                    uuid: ocorrenciaUuid,
                    body: {
                        data_ocorrencia: dataHoraOcorrencia,
                        unidade_codigo_eol: data.unidadeEducacional,
                        dre_codigo_eol: data.dre,
                        sobre_furto_roubo_invasao_depredacao:
                            data.tipoOcorrencia === "Sim",
                    },
                });

                if (response.success) {
                    setSavedFormData(data);
                    onSuccess?.();
                    return;
                }

                toast({
                    variant: "error",
                    title: "Erro ao atualizar ocorrência",
                    description: response.error,
                });
                return;
            }

            const dataHoraOcorrencia = new Date(
                `${data.dataOcorrencia}T${data.horaOcorrencia}`,
            ).toISOString();

            const response = await criarOcorrencia({
                data_ocorrencia: dataHoraOcorrencia,
                unidade_codigo_eol: data.unidadeEducacional,
                dre_codigo_eol: data.dre,
                sobre_furto_roubo_invasao_depredacao:
                    data.tipoOcorrencia === "Sim",
            });

            if (!response.success) {
                toast({
                    variant: "error",
                    title: "Erro ao cadastrar ocorrência",
                    description: response.error,
                });
                return;
            }

            if (response.data?.uuid) {
                setOcorrenciaUuid(response.data.uuid);
                setSavedFormData(data);
                onSuccess?.();
            }
        };

        const dreNome = formData.nomeDre ?? user?.unidades[0]?.dre?.nome ?? "";
        const unidadeNome =
            formData.nomeUnidade ?? user?.unidades[0]?.ue?.nome ?? "";

        const dresOptions =
            dresData?.map((dre: UnidadeEducacional) => ({
                value: dre.codigo_eol,
                label: dre.nome,
                uuid: dre.uuid,
            })) ?? [];

        const uesOptions =
            uesData?.map((ue: UnidadeEducacional) => ({
                value: ue.codigo_eol,
                label: ue.nome,
            })) ?? [];

        const handleDreChange = (
            value: string,
            fieldOnChange: (value: string) => void,
        ) => {
            fieldOnChange(value);
            const selectedDre = dresOptions.find(
                (d: { value: string; label: string; uuid: string }) =>
                    d.value === value,
            );
            if (selectedDre) {
                setDreUuid(selectedDre.uuid);
                setFormData({ nomeDre: selectedDre.label });
            }
            form.setValue("unidadeEducacional", "", {
                shouldValidate: true,
            });
            setFormData({ nomeUnidade: undefined });
        };

        const handleUeChange = (
            value: string,
            fieldOnChange: (value: string) => void,
        ) => {
            fieldOnChange(value);
            const selectedUe = uesOptions.find(
                (u: { value: string; label: string }) => u.value === value,
            );
            if (selectedUe) {
                setFormData({ nomeUnidade: selectedUe.label });
            }
        };

        const getDrePlaceholder = () => {
            if (isLoadingDres) return "Carregando...";
            if (isErrorDres) return "Erro ao carregar DREs";
            return "Selecione a DRE";
        };

        const getUePlaceholder = () => {
            if (!dreValue) return "Selecione primeiro uma DRE";
            if (isLoadingUes) return "Carregando...";
            if (isErrorUes) return "Erro ao carregar unidades";
            return "Selecione a unidade";
        };

        return (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex flex-col gap-6 mt-4"
                >
                    <fieldset className="contents">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="dataOcorrencia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel disabled={disabled}>
                                            Quando a ocorrência aconteceu?*
                                        </FormLabel>
                                        <FormControl>
                                            <DateTimeInput
                                                dateValue={field.value}
                                                timeValue={
                                                    form.watch(
                                                        "horaOcorrencia",
                                                    ) || ""
                                                }
                                                onDateChange={field.onChange}
                                                onTimeChange={(value) =>
                                                    form.setValue(
                                                        "horaOcorrencia",
                                                        value,
                                                        {
                                                            shouldValidate: true,
                                                        },
                                                    )
                                                }
                                                maxDate={maxDate}
                                                disabled={disabled}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel disabled={isDreDisabled}>
                                            Qual a DRE?*
                                        </FormLabel>
                                        <Select
                                            key={field.value}
                                            onValueChange={
                                                isGipe && !ocorrenciaUuid
                                                    ? (value) =>
                                                          handleDreChange(
                                                              value,
                                                              field.onChange,
                                                          )
                                                    : field.onChange
                                            }
                                            value={field.value}
                                            disabled={isDreDisabled}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            isGipe
                                                                ? getDrePlaceholder()
                                                                : "Selecione a DRE"
                                                        }
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {isGipe && !ocorrenciaUuid
                                                    ? dresOptions.map(
                                                          (dre: {
                                                              value: string;
                                                              label: string;
                                                              uuid: string;
                                                          }) => (
                                                              <SelectItem
                                                                  key={
                                                                      dre.value
                                                                  }
                                                                  value={
                                                                      dre.value
                                                                  }
                                                              >
                                                                  {dre.label}
                                                              </SelectItem>
                                                          ),
                                                      )
                                                    : field.value &&
                                                      dreNome && (
                                                          <SelectItem
                                                              value={
                                                                  field.value
                                                              }
                                                          >
                                                              {dreNome}
                                                          </SelectItem>
                                                      )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="unidadeEducacional"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={isUeDisabled}>
                                        Qual a Unidade Educacional?*
                                    </FormLabel>
                                    <Select
                                        key={field.value}
                                        onValueChange={
                                            (isPontoFocal || isGipe) &&
                                            !ocorrenciaUuid
                                                ? (value) =>
                                                      handleUeChange(
                                                          value,
                                                          field.onChange,
                                                      )
                                                : field.onChange
                                        }
                                        value={field.value}
                                        disabled={isUeDisabled}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        isPontoFocal || isGipe
                                                            ? getUePlaceholder()
                                                            : "Selecione a unidade"
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {(isPontoFocal || isGipe) &&
                                            !ocorrenciaUuid
                                                ? uesOptions.map(
                                                      (ue: {
                                                          value: string;
                                                          label: string;
                                                      }) => (
                                                          <SelectItem
                                                              key={ue.value}
                                                              value={ue.value}
                                                          >
                                                              {ue.label}
                                                          </SelectItem>
                                                      ),
                                                  )
                                                : field.value &&
                                                  unidadeNome && (
                                                      <SelectItem
                                                          value={field.value}
                                                      >
                                                          {unidadeNome}
                                                      </SelectItem>
                                                  )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tipoOcorrencia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        A ocorrência é sobre furto, roubo,
                                        invasão ou depredação?*
                                    </FormLabel>
                                    <FormControl>
                                        <div className="pt-2">
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value ?? ""}
                                                className="flex flex-col space-y-2"
                                                disabled={disabled}
                                            >
                                                <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                                    <RadioGroupItem value="Sim" />
                                                    <span
                                                        className={
                                                            disabled
                                                                ? "text-sm text-[#B0B0B0]"
                                                                : "text-sm text-[#42474a]"
                                                        }
                                                    >
                                                        Sim
                                                    </span>
                                                </label>
                                                <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                                    <RadioGroupItem value="Não" />
                                                    <span
                                                        className={
                                                            disabled
                                                                ? "text-sm text-[#B0B0B0]"
                                                                : "text-sm text-[#42474a]"
                                                        }
                                                    >
                                                        Não
                                                    </span>
                                                </label>
                                            </RadioGroup>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {showButtons && (
                            <div className="flex justify-end gap-2">
                                <Button
                                    size="sm"
                                    variant="customOutline"
                                    disabled
                                >
                                    Anterior
                                </Button>
                                <Button
                                    size="sm"
                                    type="submit"
                                    variant="submit"
                                    disabled={
                                        !isValid || isCriando || isAtualizando
                                    }
                                >
                                    Próximo
                                </Button>
                            </div>
                        )}
                    </fieldset>
                </form>
            </Form>
        );
    },
);

SecaoInicial.displayName = "SecaoInicial";

export default SecaoInicial;

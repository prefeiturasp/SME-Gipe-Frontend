import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/headless-toast";
import { useFetchDREs, useFetchUEs } from "@/hooks/useUnidades";
import type { UnidadeEducacional } from "@/types/unidades";
import { useCadastroGestaoUsuario } from "@/hooks/useCadastroGestaoUsuario";
import { useAtualizarGestaoUsuario } from "@/hooks/useAtualizarGestaoUsuario";
import { useUserStore } from "@/stores/useUserStore";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useObterUsuarioGestao } from "@/hooks/useObterUsuarioGestao";
import formSchema, { FormDataCadastroUsuario } from "./schema";
import { buildCadastroPayload, mapCargoNumericoParaString } from "./utils";

const REDE_OPTIONS = [
    { value: "DIRETA", label: "Direta" },
    { value: "INDIRETA", label: "Indireta" },
];

const CARGO_OPTIONS_INDIRETA = [
    { value: "diretor", label: "Diretor(a)" },
    { value: "assistente", label: "Assistente de direção" },
];

const CARGO_OPTIONS_DIRETA = [
    { value: "diretor", label: "Diretor(a)" },
    { value: "assistente", label: "Assistente de direção" },
    { value: "ponto_focal", label: "Ponto focal" },
    { value: "gipe", label: "GIPE" },
];

type UseCadastroUsuarioFormProps = {
    mode?: "create" | "edit";
    usuarioUuid?: string;
};

export function useCadastroUsuarioForm({
    mode = "create",
    usuarioUuid,
}: UseCadastroUsuarioFormProps = {}) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [dadosIniciaisCarregados, setDadosIniciaisCarregados] =
        useState(false);
    const [carregandoDados, setCarregandoDados] = useState(false);
    const montagemInicialRef = useRef(true);

    const { user } = useUserStore();
    const { isPontoFocal, isGipe } = useUserPermissions();
    const { mutate: cadastrarUsuario, isPending: isPendingCreate } =
        useCadastroGestaoUsuario();
    const { mutate: atualizarUsuario, isPending: isPendingUpdate } =
        useAtualizarGestaoUsuario(usuarioUuid || "");
    const isPending = mode === "edit" ? isPendingUpdate : isPendingCreate;

    const form = useForm<FormDataCadastroUsuario>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rede: "",
            cargo: "",
            fullName: "",
            rf: "",
            cpf: "",
            email: "",
            dre: "",
            ue: "",
            isAdmin: false,
        },
        mode: "onChange",
    });

    const {
        reset,
        setValue,
        getValues,
        formState: { isValid, isDirty },
        control,
    } = form;

    const watchedRede = useWatch({ control, name: "rede" });
    const watchedCargo = useWatch({ control, name: "cargo" });
    const watchedDre = useWatch({ control, name: "dre" });

    const { data: dreOptions = [] } = useFetchDREs();
    const { data: ueOptions = [] } = useFetchUEs(watchedDre, watchedRede);

    const { data: usuarioData } = useObterUsuarioGestao({
        uuid: usuarioUuid || "",
        enabled: mode === "edit" && !!usuarioUuid,
    });
    const isFormDisabled = mode === "edit" && usuarioData?.is_active === false;

    useEffect(() => {
        if (mode === "edit" && usuarioUuid) {
            setDadosIniciaisCarregados(false);
            setCarregandoDados(false);
            montagemInicialRef.current = true;
        }
    }, [usuarioUuid, mode]);

    const cargoOptions = useMemo(() => {
        const options =
            watchedRede === "INDIRETA"
                ? CARGO_OPTIONS_INDIRETA
                : CARGO_OPTIONS_DIRETA;
        if (isGipe) return options;
        return options.filter((option) => option.value !== "gipe");
    }, [watchedRede, isGipe]);

    const showFields = useMemo(() => {
        const base = !!watchedRede && !!watchedCargo;
        const isSpecialCargo = ["gipe", "admin"].includes(watchedCargo);

        return {
            dre: base && !isSpecialCargo,
            ue: base && !isSpecialCargo && watchedCargo !== "ponto_focal",
            adminCheckbox:
                base && ["ponto_focal", "gipe"].includes(watchedCargo),
        };
    }, [watchedRede, watchedCargo]);

    useEffect(() => {
        if (
            mode === "edit" &&
            usuarioData &&
            dreOptions.length > 0 &&
            !dadosIniciaisCarregados
        ) {
            setCarregandoDados(true);
            const cargo = mapCargoNumericoParaString(usuarioData.cargo);
            const dreMatch = dreOptions.find(
                (d: UnidadeEducacional) =>
                    d.codigo_eol === usuarioData.codigo_eol_dre_da_unidade
            );

            reset({
                rede: usuarioData.rede,
                cargo,
                fullName: usuarioData.name,
                rf: usuarioData.rede === "DIRETA" ? usuarioData.username : "",
                cpf: usuarioData.cpf,
                email: usuarioData.email,
                dre: dreMatch?.uuid || "",
                ue: "",
                isAdmin: usuarioData.is_app_admin,
            });
            setDadosIniciaisCarregados(true);
            setTimeout(() => {
                setCarregandoDados(false);
                montagemInicialRef.current = false;
            }, 200);
        }
    }, [mode, usuarioData, dreOptions, reset, dadosIniciaisCarregados]);

    useEffect(() => {
        if (
            mode === "edit" &&
            dadosIniciaisCarregados &&
            ueOptions.length > 0 &&
            usuarioData?.codigo_eol_unidade &&
            !getValues("ue")
        ) {
            const ueMatch = ueOptions.find(
                (u: UnidadeEducacional) =>
                    u.codigo_eol === usuarioData.codigo_eol_unidade
            );
            if (ueMatch) {
                setValue("ue", ueMatch.uuid, { shouldValidate: true });
            }
        }
    }, [
        mode,
        ueOptions,
        usuarioData,
        dadosIniciaisCarregados,
        setValue,
        getValues,
    ]);

    useEffect(() => {
        const dreUUID = user?.unidades?.[0]?.dre?.dre_uuid;
        const podeAutoPreencher = isPontoFocal && dreUUID;
        if (
            podeAutoPreencher &&
            watchedRede &&
            watchedCargo &&
            (mode === "create" || dadosIniciaisCarregados) &&
            !watchedDre
        ) {
            setValue("dre", dreUUID);
        }
    }, [
        isPontoFocal,
        user,
        watchedRede,
        watchedCargo,
        mode,
        dadosIniciaisCarregados,
        setValue,
        watchedDre,
    ]);

    const handleRedeChange = useCallback(
        (val: string) => {
            if (val === getValues("rede")) return;

            if (
                mode === "edit" &&
                (carregandoDados || montagemInicialRef.current)
            )
                return;

            setValue("rede", val, { shouldValidate: true });

            if (mode === "create" || dadosIniciaisCarregados) {
                setValue("cargo", "");
                setValue("dre", "");
                setValue("ue", "");

                if (mode === "create") {
                    setValue("fullName", "");
                    setValue("rf", "");
                    setValue("cpf", "");
                    setValue("email", "");
                }
            }
        },
        [mode, dadosIniciaisCarregados, carregandoDados, setValue, getValues]
    );

    const handleDreChange = useCallback(
        (val: string) => {
            if (val === getValues("dre")) return;

            if (
                mode === "edit" &&
                (carregandoDados || montagemInicialRef.current)
            )
                return;

            setValue("dre", val, { shouldValidate: true });
            setValue("ue", "", { shouldValidate: true });
        },
        [mode, carregandoDados, setValue, getValues]
    );

    const handleCargoChange = useCallback(
        (val: string) => {
            if (val === getValues("cargo")) return;

            if (
                mode === "edit" &&
                (carregandoDados || montagemInicialRef.current)
            )
                return;

            setValue("cargo", val, { shouldValidate: true });

            if (val === "ponto_focal" || val === "gipe") {
                setValue("ue", "", { shouldValidate: true });
            }
        },
        [mode, carregandoDados, setValue, getValues]
    );

    function handleConfirmCadastro() {
        const payload = buildCadastroPayload(
            getValues(),
            dreOptions,
            ueOptions
        );

        if (mode === "edit") {
            atualizarUsuario(payload, {
                onSuccess: (response) => {
                    if (!response.success) {
                        toast({
                            title: "Não conseguimos concluir a ação!",
                            description:
                                response.error || "Erro ao atualizar usuário.",
                            variant: "error",
                        });
                        return;
                    }

                    queryClient.invalidateQueries({
                        queryKey: ["usuario-gestao", usuarioUuid],
                    });

                    toast({
                        title: "Tudo certo por aqui!",
                        description: "Usuário atualizado com sucesso!",
                        variant: "success",
                    });
                    setModalOpen(false);
                    router.push("/dashboard/gestao-usuarios?tab=ativos");
                },
                onError: () => {
                    toast({
                        title: "Erro no servidor",
                        description: "Tente novamente mais tarde.",
                        variant: "error",
                    });
                },
            });
        } else {
            cadastrarUsuario(payload, {
                onSuccess: (response) => {
                    if (!response.success) {
                        toast({
                            title: "Não conseguimos concluir a ação!",
                            description:
                                response.error || "Erro ao cadastrar usuário.",
                            variant: "error",
                        });
                        return;
                    }

                    toast({
                        title: "Tudo certo por aqui!",
                        description:
                            "A pessoa usuária foi cadastrada com sucesso!",
                        variant: "success",
                    });
                    setModalOpen(false);
                    router.push("/dashboard/gestao-usuarios?tab=ativos");
                },
                onError: () => {
                    toast({
                        title: "Erro no servidor",
                        description: "Tente novamente mais tarde.",
                        variant: "error",
                    });
                },
            });
        }
    }

    let cargoAlterado = false;
    if (mode === "edit" && usuarioData) {
        const cargoInicial = mapCargoNumericoParaString(usuarioData.cargo);
        cargoAlterado = watchedCargo !== cargoInicial;
    }

    return {
        form,
        isValid,
        isPending,
        modalOpen,
        setModalOpen,
        dreOptions,
        ueOptions,
        redeOptions: REDE_OPTIONS,
        cargoOptions,
        showFields,
        isRedeSelected: !!watchedRede,
        shouldShowExtraFields: !!watchedRede && !!watchedCargo,
        isRedeIndireta: watchedRede === "INDIRETA",
        isRedeDireta: watchedRede === "DIRETA",
        handleSubmitClick: (e: React.MouseEvent) => {
            e.preventDefault();
            if (mode === "edit") {
                handleConfirmCadastro();
            } else {
                setModalOpen(true);
            }
        },
        handleConfirmCadastro,
        handleRedeChange,
        handleCargoChange,
        handleDreChange,
        isDreDisabled: isPontoFocal,
        router,
        mode,
        hasChanges: isDirty || cargoAlterado,
        isFormDisabled
    };
}

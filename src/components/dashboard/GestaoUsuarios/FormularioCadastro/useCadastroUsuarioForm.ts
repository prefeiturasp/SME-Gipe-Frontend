import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/headless-toast";
import { useFetchDREs, useFetchUEs } from "@/hooks/useUnidades";
import type { UnidadeEducacional } from "@/types/unidades";
import { useCadastroGestaoUsuario } from "@/hooks/useCadastroGestaoUsuario";
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
    const [modalOpen, setModalOpen] = useState(false);
    const [dadosIniciaisCarregados, setDadosIniciaisCarregados] =
        useState(false);

    const { user } = useUserStore();
    const { isPontoFocal, isGipe } = useUserPermissions();
    const { mutate: cadastrarUsuario, isPending } = useCadastroGestaoUsuario();

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
        formState: { isValid },
        control,
    } = form;

    const watchedRede = useWatch({ control, name: "rede" });
    const watchedCargo = useWatch({ control, name: "cargo" });
    const watchedDre = useWatch({ control, name: "dre" });

    const { data: dreOptions = [] } = useFetchDREs();
    const { data: ueOptions = [] } = useFetchUEs(watchedDre);

    const { data: usuarioData } = useObterUsuarioGestao({
        uuid: usuarioUuid || "",
        enabled: mode === "edit" && !!usuarioUuid,
    });

    console.log("usuarioData", usuarioData);

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
        if (mode === "edit" && usuarioData && dreOptions.length > 0) {
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
        }
    }, [mode, usuarioData, dreOptions, reset]);

    useEffect(() => {
        if (
            mode === "edit" &&
            dadosIniciaisCarregados &&
            ueOptions.length > 0 &&
            usuarioData?.codigo_eol_unidade
        ) {
            const ueMatch = ueOptions.find(
                (u: UnidadeEducacional) =>
                    u.codigo_eol === usuarioData.codigo_eol_unidade
            );
            if (ueMatch) {
                setValue("ue", ueMatch.uuid, { shouldValidate: true });
            }
        }
    }, [mode, ueOptions, usuarioData, dadosIniciaisCarregados, setValue]);

    useEffect(() => {
        const podeAutoPreencher =
            isPontoFocal && user?.unidades?.[0]?.dre?.dre_uuid;
        if (
            podeAutoPreencher &&
            watchedRede &&
            watchedCargo &&
            (mode === "create" || dadosIniciaisCarregados)
        ) {
            setValue("dre", user.unidades[0].dre.dre_uuid || "");
        }
    }, [
        isPontoFocal,
        user,
        watchedRede,
        watchedCargo,
        mode,
        dadosIniciaisCarregados,
        setValue,
    ]);

    const handleRedeChange = (val: string) => {
        setValue("rede", val);
        if (mode === "create") {
            reset({
                ...form.getValues(),
                cargo: "",
                dre: "",
                ue: "",
                fullName: "",
                rf: "",
                cpf: "",
                email: "",
            });
        }
    };

    const handleDreChange = (val: string) => {
        setValue("dre", val);
        setValue("ue", "", { shouldValidate: true });
    };

    function handleConfirmCadastro() {
        const payload = buildCadastroPayload(
            getValues(),
            dreOptions,
            ueOptions
        );

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
                    description: "A pessoa usuária foi cadastrada com sucesso!",
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
            setModalOpen(true);
        },
        handleConfirmCadastro,
        handleRedeChange,
        handleDreChange,
        isDreDisabled: isPontoFocal,
        router,
    };
}

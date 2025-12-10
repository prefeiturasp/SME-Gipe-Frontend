import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/headless-toast";
import { useFetchDREs, useFetchUEs } from "@/hooks/useUnidades";
import { useCadastroGestaoUsuario } from "@/hooks/useCadastroGestaoUsuario";
import formSchema, { FormDataCadastroUsuario } from "./schema";
import { buildCadastroPayload } from "./utils";

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

export function useCadastroUsuarioForm() {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const { data: dreOptions = [] } = useFetchDREs();
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
        reValidateMode: "onChange",
    });

    const { isValid } = form.formState;
    const values = form.watch();
    const { data: ueOptions = [] } = useFetchUEs(values.dre);

    useEffect(() => {
        if (values.rede) {
            form.setValue("cargo", "");
            form.setValue("fullName", "");
            form.setValue("rf", "");
            form.setValue("cpf", "");
            form.setValue("email", "");
            form.setValue("dre", "");
            form.setValue("ue", "");
        }
    }, [values.rede, form]);

    useEffect(() => {
        if (values.cargo === "gipe") {
            form.setValue("dre", "");
            form.setValue("ue", "");
        } else if (values.cargo === "ponto_focal") {
            form.setValue("ue", "");
        }
    }, [values.cargo, form]);

    const cargoOptions =
        values.rede === "INDIRETA"
            ? CARGO_OPTIONS_INDIRETA
            : CARGO_OPTIONS_DIRETA;

    const isRedeSelected = !!values.rede;
    const isCargoSelected = !!values.cargo;
    const shouldShowExtraFields = isRedeSelected && isCargoSelected;

    const showFields = {
        dre:
            shouldShowExtraFields &&
            values.cargo !== "gipe" &&
            values.cargo !== "admin",
        ue:
            shouldShowExtraFields &&
            values.cargo !== "ponto_focal" &&
            values.cargo !== "gipe" &&
            values.cargo !== "admin",
        adminCheckbox:
            shouldShowExtraFields &&
            (values.cargo === "ponto_focal" || values.cargo === "gipe"),
    };

    const isRedeIndireta = values.rede === "INDIRETA";
    const isRedeDireta = values.rede === "DIRETA";

    function handleSubmitClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setModalOpen(true);
    }

    function handleConfirmCadastro() {
        const formValues = form.getValues();
        const payload = buildCadastroPayload(formValues, dreOptions, ueOptions);

        cadastrarUsuario(payload, {
            onSuccess: (response) => {
                if (!response.success) {
                    toast({
                        title: "Não conseguimos concluir a ação!",
                        description:
                            response.error ||
                            "Ocorreu um erro e não conseguimos cadastrar a pessoa usuária. Por favor,  tente novamente.",
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
                router.push("/dashboard/gestao-usuarios");
            },
            onError: () => {
                toast({
                    title: "Não conseguimos concluir a ação!",
                    description:
                        "Ocorreu um erro e não conseguimos cadastrar a pessoa usuária. Por favor,  tente novamente.",
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
        isRedeSelected,
        shouldShowExtraFields,
        showFields,
        isRedeIndireta,
        isRedeDireta,
        handleSubmitClick,
        handleConfirmCadastro,
        router,
    };
}

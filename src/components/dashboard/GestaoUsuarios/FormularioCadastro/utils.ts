import {
    PERFIL_ASSISTENTE_DIRETOR,
    PERFIL_DIRETOR,
    PERFIL_GIPE,
    PERFIL_PONTO_FOCAL,
} from "@/const";
import type { FormDataCadastroUsuario } from "./schema";

export type CadastroUsuarioPayload = {
    username: string;
    name: string;
    email: string;
    cpf: string;
    cargo: number;
    rede: "DIRETA" | "INDIRETA";
    unidades: string[];
    is_app_admin: boolean;
};

const CARGO_MAP: Record<string, number> = {
    diretor: PERFIL_DIRETOR,
    assistente: PERFIL_ASSISTENTE_DIRETOR,
    ponto_focal: PERFIL_PONTO_FOCAL,
    gipe: PERFIL_GIPE,
};

const CARGO_REVERSE_MAP: Record<number, string> = {
    [PERFIL_DIRETOR]: "diretor",
    [PERFIL_ASSISTENTE_DIRETOR]: "assistente",
    [PERFIL_PONTO_FOCAL]: "ponto_focal",
    [PERFIL_GIPE]: "gipe",
};

/**
 * Remove todos os caracteres não numéricos de uma string
 */
export function removeMask(value: string): string {
    return value.replaceAll(/\D/g, "");
}

/**
 * Aplica máscara de CPF: 123.456.789-10
 */
export function maskCPF(value: string): string {
    const numbers = removeMask(value);
    return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function buildCadastroPayload(
    formValues: FormDataCadastroUsuario,
    dreOptions: Array<{ uuid: string; codigo_eol: string; nome: string }>,
    ueOptions: Array<{ uuid: string; codigo_eol: string; nome: string }>
): CadastroUsuarioPayload {
    const unidades: string[] = [];

    if (formValues.cargo === "ponto_focal" && formValues.dre) {
        const dreSelected = dreOptions.find(
            (dre) => dre.uuid === formValues.dre
        );
        if (dreSelected) {
            unidades.push(dreSelected.codigo_eol);
        }
    } else if (
        (formValues.cargo === "diretor" || formValues.cargo === "assistente") &&
        formValues.ue
    ) {
        const ueSelected = ueOptions.find((ue) => ue.uuid === formValues.ue);
        if (ueSelected) {
            unidades.push(ueSelected.codigo_eol);
        }
    }

    let username: string;
    if (formValues.rede === "INDIRETA") {
        username = removeMask(formValues.cpf);
    } else {
        username = formValues.rf ? formValues.rf : removeMask(formValues.cpf);
    }

    const cpf = removeMask(formValues.cpf);

    const isAppAdmin =
        formValues.cargo === "diretor" || formValues.cargo === "assistente"
            ? false
            : formValues.isAdmin;

    return {
        username,
        name: formValues.fullName,
        email: formValues.email,
        cpf,
        cargo: CARGO_MAP[formValues.cargo],
        rede: formValues.rede as "DIRETA" | "INDIRETA",
        unidades,
        is_app_admin: isAppAdmin,
    };
}

/**
 * Converte código de cargo numérico para string
 */
export function mapCargoNumericoParaString(cargoNumerico: number): string {
    return CARGO_REVERSE_MAP[cargoNumerico] || "";
}

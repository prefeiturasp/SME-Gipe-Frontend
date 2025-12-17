import { create } from "zustand";
import { SecaoInicialData } from "@/components/dashboard/CadastrarOcorrencia/SecaoInicial/schema";
import { SecaoFurtoERouboData } from "@/components/dashboard/CadastrarOcorrencia/SecaoFurtoERoubo/schema";
import { SecaoNaoFurtoERouboData } from "@/components/dashboard/CadastrarOcorrencia/SecaoNaoFurtoERoubo/schema";
import { SecaoFinalData } from "@/components/dashboard/CadastrarOcorrencia/SecaoFinal/schema";
import { InformacoesAdicionaisData } from "@/components/dashboard/CadastrarOcorrencia/InformacoesAdicionais/schema";
import { AnexosData } from "@/components/dashboard/CadastrarOcorrencia/Anexos/schema";
import { FormularioDreData } from "@/components/dashboard/FormularioDre/DetalhamentoDre/schema";
import { FormularioGipeData } from "@/components/dashboard/FormularioGipe/DetalhamentoGipe/schema";

type OcorrenciaFormData = Partial<SecaoInicialData> &
    Partial<SecaoFurtoERouboData> &
    Partial<SecaoNaoFurtoERouboData> &
    Partial<SecaoFinalData> &
    Partial<InformacoesAdicionaisData> &
    Partial<AnexosData> &
    Partial<FormularioDreData> &
    Partial<FormularioGipeData> & {
        nomeDre?: string;
        nomeUnidade?: string;
        status?: string;
    };

type OcorrenciaFormState = {
    ocorrenciaUuid: string | null;
    formData: OcorrenciaFormData;
    savedFormData: OcorrenciaFormData;
    setFormData: (data: Partial<OcorrenciaFormData>) => void;
    setSavedFormData: (data: Partial<OcorrenciaFormData>) => void;
    setOcorrenciaUuid: (id: string) => void;
    reset: () => void;
};

const initialState = {
    ocorrenciaUuid: null,
    formData: {},
    savedFormData: {},
};

export const useOcorrenciaFormStore = create<OcorrenciaFormState>((set) => ({
    ...initialState,
    setFormData: (data) =>
        set((state) => ({
            formData: { ...state.formData, ...data },
        })),
    setSavedFormData: (data) =>
        set((state) => ({
            savedFormData: { ...state.savedFormData, ...data },
        })),
    setOcorrenciaUuid: (id) => set({ ocorrenciaUuid: id }),
    reset: () => set(initialState),
}));

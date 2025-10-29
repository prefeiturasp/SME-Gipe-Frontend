import { create } from "zustand";
import { SecaoInicialData } from "@/components/dashboard/CadastrarOcorrencia/SecaoInicial/schema";
import { SecaoFurtoERouboData } from "@/components/dashboard/CadastrarOcorrencia/SecaoFurtoERoubo/schema";
import { SecaoNaoFurtoERouboData } from "@/components/dashboard/CadastrarOcorrencia/SecaoNaoFurtoERoubo/schema";

type OcorrenciaFormData = Partial<SecaoInicialData> &
    Partial<SecaoFurtoERouboData> &
    Partial<SecaoNaoFurtoERouboData>;

type OcorrenciaFormState = {
    ocorrenciaUuid: string | null;
    formData: OcorrenciaFormData;
    setFormData: (data: Partial<OcorrenciaFormData>) => void;
    setOcorrenciaUuid: (id: string) => void;
    reset: () => void;
};

const initialState = {
    ocorrenciaUuid: null,
    formData: {},
};

export const useOcorrenciaFormStore = create<OcorrenciaFormState>((set) => ({
    ...initialState,
    setFormData: (data) =>
        set((state) => ({
            formData: { ...state.formData, ...data },
        })),
    setOcorrenciaUuid: (id) => set({ ocorrenciaUuid: id }),
    reset: () => set(initialState),
}));

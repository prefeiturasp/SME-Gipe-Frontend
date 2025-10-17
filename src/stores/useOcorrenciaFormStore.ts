import { create } from "zustand";
import { CadastroOcorrenciaData } from "@/components/dashboard/CadastrarOcorrencia/SecaoInicial/schema";
import { CategorizarData } from "@/components/dashboard/CadastrarOcorrencia/SecaoFurtoERoubo/schema";

type OcorrenciaFormData = Partial<CadastroOcorrenciaData> &
    Partial<CategorizarData>;

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

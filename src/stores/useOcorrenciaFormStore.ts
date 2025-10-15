import { create } from "zustand";
import { CadastroOcorrenciaData } from "@/components/dashboard/CadastrarOcorrencia/SecaoInicial/schema";
import { CategorizarData } from "@/components/dashboard/CadastrarOcorrencia/SecaoFurtoERoubo/schema";

type OcorrenciaFormData = Partial<CadastroOcorrenciaData> &
    Partial<CategorizarData>;

type OcorrenciaFormState = {
    ocorrenciaId: number | null;
    formData: OcorrenciaFormData;
    setFormData: (data: Partial<OcorrenciaFormData>) => void;
    setOcorrenciaId: (id: number) => void;
    reset: () => void;
};

const initialState = {
    ocorrenciaId: null,
    formData: {},
};

export const useOcorrenciaFormStore = create<OcorrenciaFormState>((set) => ({
    ...initialState,
    setFormData: (data) =>
        set((state) => ({
            formData: { ...state.formData, ...data },
        })),
    setOcorrenciaId: (id) => set({ ocorrenciaId: id }),
    reset: () => set(initialState),
}));

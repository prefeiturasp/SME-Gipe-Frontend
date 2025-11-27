// hooks/useBaixarAnexo.ts
import { useMutation } from "@tanstack/react-query";
import { baixarAnexo } from "@/actions/baixar-anexo";

type BaixarAnexoParams = {
  uuid: string;
  nomeArquivo: string;
};

export const useBaixarAnexo = () => {
  return useMutation({
    mutationFn: async ({ uuid, nomeArquivo }: BaixarAnexoParams) => {
      const result = await baixarAnexo(uuid);

      if (!result.success) {
        throw new Error(result.error);
      }

      const response = await fetch(result.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = nomeArquivo
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);

      return true;
    },
  });
};
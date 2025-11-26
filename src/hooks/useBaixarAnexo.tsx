import { useMutation } from "@tanstack/react-query";
import { baixarAnexo } from "@/actions/baixar-anexo";

type BaixarAnexoParams = {
  uuid: string;
  nomeArquivo: string;
};

export const useBaixarAnexo = () => {
  return useMutation({
    mutationFn: async ({ uuid, nomeArquivo }: BaixarAnexoParams) => {
      const blob = await baixarAnexo(uuid);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.download = nomeArquivo;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    },
  });
};

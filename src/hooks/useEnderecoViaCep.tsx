import { useMutation } from "@tanstack/react-query";
import { getEnderecoPorCepAction, EnderecoAPI } from "@/actions/get-endereco-via-cep";

export const useEnderecoPorCep = () => {
  return useMutation<EnderecoAPI, Error, string>({
    mutationFn: async (cep: string) => {
      const response = await getEnderecoPorCepAction(cep);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });
};
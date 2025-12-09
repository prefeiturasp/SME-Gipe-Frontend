"use server";

import { AxiosError } from "axios";
import axios from "axios";

export type EnderecoAPI = {
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export const getEnderecoPorCepAction = async (
  cep: string
): Promise<{ success: true; data: EnderecoAPI } | { success: false; error: string }> => {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) {
    return { success: false, error: "CEP inválido" };
  }

  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);

    if (data.erro) {
      return { success: false, error: "CEP não encontrado" };
    }

    return {
      success: true,
      data: {
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      },
    };
  } catch (err) {
    const error = err as AxiosError;
    let message = "Erro ao buscar o endereço";

    if (error.code === "ENOTFOUND") {
      message = "Serviço de CEP indisponível";
    } else if (error.message) {
      message = error.message;
    }

    return { success: false, error: message };
  }
};
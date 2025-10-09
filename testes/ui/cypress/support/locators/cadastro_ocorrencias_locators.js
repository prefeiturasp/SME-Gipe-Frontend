class Cadastro_ocorrencias_Localizadores {
  // Botão Nova Ocorrência
  btn_nova_ocorrencia() {
    return '/html/body/div[1]/div/div[2]/main/div/div[2]/div/a';
  }

    input_data_ocorrencia() {
    return 'input[placeholder="dd/mm/aaaa"]';
  }

    selecionar__ocorrencia_roubo_furto() {
    return 'button[data-state="checked"]';
  }
}

export default Cadastro_ocorrencias_Localizadores;
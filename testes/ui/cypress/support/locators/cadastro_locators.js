class Cadastro_Localizadores {
  // Botão para abrir o dropdown da DRE
  select_dre() {
    return '//div[label[contains(text(),"Selecione a DRE")]]//button[@role="combobox"]';
  }

  // Botão para abrir o dropdown da UE
  select_ue() {
    return '//div[label[contains(text(),"Digite o nome da UE")]]//button[@role="combobox"]';
  }

  // Input do nome completo pelo placeholder
  input_nome_completo() {
    return 'input[placeholder="Exemplo: Maria Clara Medeiros"]';
  }

  // Input do CPF usando a label associada
  input_cpf() {
    return '//div[label[contains(text(),"Qual o seu CPF")]]//input';
  }

  // Botão avançar no formulário (dentro do form atual)
  proxima_etapa_form() {
    return '//form//button[contains(text(), "Avançar")]';
  }
}

export default Cadastro_Localizadores;
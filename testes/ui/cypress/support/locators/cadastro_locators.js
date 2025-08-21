class Cadastro_Localizadores {
  // Dropdown DRE (XPath)
  select_dre() {
    return '//div[label[contains(text(),"Selecione a DRE")]]//button[@role="combobox"]';
  }

  // Dropdown UE (XPath)
  select_ue() {
    return '//div[label[contains(text(),"Digite o nome da UE")]]//button[@role="combobox"]';
  }

  // Nome completo (CSS)
  input_nome_completo() {
    return 'input[placeholder="Exemplo: Maria Clara Medeiros"]';
  }

  // CPF (XPath)
  input_cpf() {
    return '//div[label[contains(text(),"Qual o seu CPF")]]//input';
  }

  // E-mail (CSS)
  input_email() {
    return 'input[placeholder="Digite o seu e-mail corporativo"], input[type="email"][data-testid], input[data-testid="input-email"]';
  }

  // Nova senha (CSS)
  input_nova_senha() {
    return 'input[placeholder="Digite sua senha"], input[data-testid="input-password"]';
  }

  // Confirmação de senha (CSS)
  input_confirmacao_senha() {
    return 'input[placeholder="Confirme sua senha"], input[data-testid="input-password-confirmation"], input[data-testid="input-confirm-password"]';
  }

  // Botão Avançar (XPath)
  proxima_etapa_form() {
    return '//form//button[contains(text(), "Avançar")]';
  }

  // Botão Cadastrar agora (XPath)
  cadastrar_agora_form() {
    return '//form//button[contains(text(), "Cadastrar agora")]';
  }

  mensagem_email_ja_cadastrado() {
    return '/html/body/div/div[2]/div/form/div[7]';
  }

    CPF_ja_cadastrado() {
    return '/html/body/div/div[2]/div/form/div[7]';
  }
}

export default Cadastro_Localizadores;

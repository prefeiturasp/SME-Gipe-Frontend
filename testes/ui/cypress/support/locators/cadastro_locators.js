class Cadastro_Localizadores {
  // Label "Selecione a DRE" (CSS)
  label_dre() {
    return 'body > div > div.w-full.md\\:w-1\\/2.flex.flex-col.bg-white.overflow-y-auto.justify-center > div > form > div.space-y-2.mb-4.mt-4 > label';
  }

  // Dropdown DRE - botão (CSS absoluto)
  select_dre() {
    return 'body > div > div.w-full.md\\:w-1\\/2.flex.flex-col.bg-white.overflow-y-auto.justify-center > div > form > div.space-y-2.mb-4.mt-4 > button';
  }

  // Span do valor selecionado na DRE
  select_dre_valor() {
    return 'body > div > div.w-full.md\\:w-1\\/2.flex.flex-col.bg-white.overflow-y-auto.justify-center > div > form > div.space-y-2.mb-4.mt-4 > button > span';
  }

  // Label "Digite o nome da UE" — usada com cy.contains('label', ...)
  label_ue() {
    return 'Digite o nome da UE';
  }

  // Campo UE: não usar seletor fixo — a função usa cy.contains('label') para localizar
  // Este valor não é usado diretamente, a função selecionarDropdownUE navega pelo label
  select_ue() {
    return 'Digite o nome da UE';
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

  // Mensagem de e-mail já cadastrado
  mensagem_email_ja_cadastrado() {
    return '/html/body/div/div[2]/div/form/div[7]';
  }

  // Mensagem CPF já cadastrado
  CPF_ja_cadastrado() {
    return '/html/body/div/div[2]/div/form/div[7]';
  }

  // Campo de e-mail na segunda etapa (caso tenha diferença)
  input_campo_email() {
    return 'input[data-testid="input-email"]';
  }
}

export default Cadastro_Localizadores;
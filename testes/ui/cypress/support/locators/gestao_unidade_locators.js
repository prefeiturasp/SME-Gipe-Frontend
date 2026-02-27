class Gestao_Unidade_Localizadores {
  
  menu_gestao() {
    return '/html/body/div/div/div[1]/div[2]/div/div[2]/div/div/ul/li[3]/div[1]'
  }

  opcao_gestao_unidades() {
    return '//*[contains(@href, "gestao-unidades-educacionais") or contains(text(), "Gestão de unidades Educacionais")]'
  }

  titulo_pagina() {
    return 'h1'
  }

  container_abas() {
    return 'div.bg-muted.text-muted-foreground.inline-flex.items-center.rounded-lg'
  }

  aba_unidades_ativas() {
    return '//button[contains(@id, "trigger-ativas") or contains(text(), "Unidades Educacionais ativas")]'
  }

  aba_unidades_inativas() {
    return '//button[contains(@id, "trigger-inativas") or contains(text(), "Unidades Educacionais inativas")]'
  }

  botao_cadastrar_unidade() {
    return 'a[href="/dashboard/gestao-unidades-educacionais/cadastro"], button:contains("Cadastrar Unidade Educacional")'
  }

  // Filtros
  campo_diretoria_regional() {
    return 'div[role="combobox"], button:contains("Selecionar DRE"), select[name*="dre"]'
  }

  // Tabela
  tabela_unidades() {
    return 'table tbody, div[role="table"]'
  }

  cabecalho_tabela_acao() {
    return '//th[contains(text(), "Ação")]'
  }

  primeira_linha_tabela() {
    return 'table tbody tr:first-child, div[role="row"]:first-child'
  }

  coluna_nome_unidade(nomeUnidade) {
    return `//td[contains(text(), "${nomeUnidade}")]`
  }

  botao_visualizar_primeira_linha() {
    return 'table tbody tr:first-child button[aria-label*="visualizar"], table tbody tr:first-child button:contains("Visualizar")'
  }

  // Página de edição
  titulo_editar_unidade() {
    return 'h1:contains("Editar Unidade Educacional")'
  }

  botao_inativar_unidade() {
    return '/html/body/div/div/div[2]/main/div[1]/div/button, button:contains("Inativar Unidade Educacional")'
  }

  botao_reativar_unidade() {
    return 'button:contains("Reativar Unidade Educacional")'
  }

  // Modal de inativação
  modal_inativacao() {
    return 'div[role="dialog"]'
  }

  titulo_modal_inativacao() {
    return '//h2[contains(text(), "Inativação de Unidade Educacional")]'
  }

  mensagem_confirmacao_inativacao() {
    return '//p[contains(text(), "Ao inativar o perfil da unidade educacional")]'
  }

  label_motivo_inativacao() {
    return '//label[contains(text(), "Motivo da inativação da UE")]'
  }

  campo_motivo_inativacao() {
    return '/html/body/div[3]/div[2]/textarea, div[role="dialog"] textarea, textarea[placeholder*="motivo"]'
  }

  botao_cancelar_modal() {
    return '/html/body/div[3]/div[3]/button[1], div[role="dialog"] button:contains("Cancelar")'
  }

  botao_confirmar_inativacao() {
    return '/html/body/div[3]/div[3]/button[2], div[role="dialog"] button:contains("Inativar Unidade Educacional")'
  }

  // Mensagens de sucesso
  mensagem_sucesso() {
    return 'div[role="alert"], div.success-message, div:contains("sucesso")'
  }
}

export default Gestao_Unidade_Localizadores

class Gestao_Pessoas_Localizadores {
  
  titulo_intercorrencias() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div.flex.items-center.justify-between.w-full.px-4 > h1';
  }

  menu_gestao() {
    return '/html/body/div/div/div[1]/div[2]/div/div[2]/div/div/ul/li[3]/div[1]';
  }

  opcao_gestao_pessoa_usuaria() {
    return '//*[contains(@id, "radix-")]/ul/li[1]/a/div/span';
  }

  titulo_gestao_usuarios() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div.flex.items-center.justify-between.w-full.px-4 > h1';
  }

  container_abas() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div:nth-child(3) > div > div.bg-muted.text-muted-foreground.inline-flex.items-center.rounded-lg.p-\\[3px\\].justify-between.w-full.h-12';
  }

  aba_pendencias() {
    return '//button[contains(@id, "trigger-pendencias") or contains(text(), "Pendências")]';
  }

  aba_usuarios_ativos() {
    return '//button[contains(@id, "trigger-ativos") or contains(text(), "Usuários ativos")]';
  }

  aba_usuarios_inativos() {
    return '//button[contains(@id, "trigger-inativos")]';
  }

  botao_cadastrar_pessoa() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div:nth-child(2) > div > a > span';
  }

  titulo_rede() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div.bg-white.rounded-\\[4px\\].shadow-\\[4px_4px_12px_0px_rgba\\(0\\,0\\,0\\,0\\.12\\)\\].p-\\[24px_32px\\].flex.flex-col.gap-6.m-4 > form > div.grid.grid-cols-1.md\\:grid-cols-2.gap-6.mb-6 > div:nth-child(1) > label';
  }

  campo_rede() {
    return '#\\:rb\\:-form-item > span';
  }

  titulo_cargo() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div.bg-white.rounded-\\[4px\\].shadow-\\[4px_4px_12px_0px_rgba\\(0\\,0\\,0\\,0\\.12\\)\\].p-\\[24px_32px\\].flex.flex-col.gap-6.m-4 > form > div.grid.grid-cols-1.md\\:grid-cols-2.gap-6.mb-6 > div:nth-child(2) > label';
  }

  campo_cargo() {
    return '#\\:rd\\:-form-item > span';
  }

  titulo_nome_completo() {
    return 'div.grid:nth-child(3) > div:nth-child(1) > label:nth-child(1)';
  }

  campo_nome_completo() {
    return '//div[contains(@class, "grid")][3]//div[1]//input[contains(@id, "-form-item")]';
  }

  titulo_cpf() {
    return 'div.grid:nth-child(3) > div:nth-child(2) > label:nth-child(1)';
  }

  campo_cpf() {
    return '//div[contains(@class, "grid")][3]//div[2]//input[contains(@id, "-form-item")]';
  }

  titulo_rf() {
    return 'div.grid:nth-child(4) > div:nth-child(1) > label:nth-child(1)';
  }

  campo_rf() {
    return '//div[contains(@class, "grid")][4]//div[1]//input[contains(@id, "-form-item")]';
  }

  titulo_email() {
    return 'div.grid:nth-child(4) > div:nth-child(2) > label:nth-child(1)';
  }

  campo_email() {
    return '//div[contains(@class, "grid")][4]//div[2]//input[contains(@id, "-form-item")]';
  }

  titulo_diretoria_regional() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div.bg-white.rounded-\\[4px\\].shadow-\\[4px_4px_12px_0px_rgba\\(0\\,0\\,0\\,0\\.12\\)\\].p-\\[24px_32px\\].flex.flex-col.gap-6.m-4 > form > div:nth-child(5) > div > label';
  }

  campo_diretoria_regional() {
    return '/html/body/div/div/div[2]/main/div[2]/form/div[4]/div/button';
  }

  titulo_unidade_educacional() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div.bg-white.rounded-\\[4px\\].shadow-\\[4px_4px_12px_0px_rgba\\(0\\,0\\,0\\,0\\.12\\)\\].p-\\[24px_32px\\].flex.flex-col.gap-6.m-4 > form > div:nth-child(6) > div > label';
  }

  campo_unidade_educacional() {
    return '/html/body/div[1]/div/div[2]/main/div[2]/form/div[5]/div/button';
  }

  botao_cancelar_form() {
    return '/html/body/div/div/div[2]/main/div[2]/form/div[6]/button[1]';
  }

  botao_cadastrar_perfil_form() {
    return '/html/body/div/div/div[2]/main/div[2]/form/div[6]/button[2]';
  }

  modal_titulo_cadastro() {
    return 'div[role="alertdialog"]';
  }

  modal_texto_confirmacao() {
    return 'div[role="alertdialog"] p, div[role="alertdialog"] span';
  }

  botao_cancelar_modal() {
    return '/html/body/div[3]/div[2]/button[1]';
  }

  botao_cadastrar_pessoa_modal() {
    return '/html/body/div[3]/div[2]/button[2]';
  }

  filtro_dre_ativos() {
    return '//div[contains(@id, "content-ativos")]//section//div//div[1]//p';
  }

  botao_filtro_dre_ativos() {
    return '//div[contains(@id, "content-ativos")]//section//div//div[1]//button';
  }

  filtro_ue_ativos() {
    return '//div[contains(@id, "content-ativos")]//section//div//div[2]//p';
  }

  botao_filtro_ue_ativos() {
    return '//div[contains(@id, "content-ativos")]//section//div//div[2]//button';
  }

  coluna_acao_ativos() {
    return '//div[contains(@id, "content-ativos")]//table//tbody//tr[1]//td[8]//a//span';
  }

  filtro_dre_inativos() {
    return '//div[contains(@id, "content-inativos")]//section//div//div[1]//p';
  }

  botao_filtro_dre_inativos() {
    return '//div[contains(@id, "content-inativos")]//section//div//div[1]//button';
  }

  filtro_ue_inativos() {
    return '//div[contains(@id, "content-inativos")]//section//div//div[2]//p';
  }

  botao_filtro_ue_inativos() {
    return '//div[contains(@id, "content-inativos")]//section//div//div[2]//button';
  }

  cabecalho_tabela_inativos() {
    return '//div[contains(@id, "content-inativos")]//div[contains(@class, "rounded-md")]//table//thead';
  }

  coluna_acao_inativos() {
    return '//div[contains(@id, "content-inativos")]//table//tbody//tr[1]//td[8]//a//span';
  }

  titulo_editar_perfil() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div.flex.items-center.justify-between.w-full.px-4 > h1';
  }

  botao_inativar_perfil() {
    return '/html/body/div/div/div[2]/main/div[1]/div/button';
  }

  botao_reativar_perfil() {
    return '/html/body/div/div/div[2]/main/div[1]/div/button';
  }

  modal_inativacao() {
    return '#radix-\\:r18\\:';
  }

  modal_titulo_inativacao() {
    return '#radix-\\:r19\\:';
  }

  botao_cancelar_inativacao() {
    return '//*[@id="radix-:r18:"]/div[2]/button[1]';
  }

  botao_confirmar_inativacao() {
    return '//*[@id="radix-:r18:"]/div[2]/button[2]';
  }

  modal_reativacao() {
    return '#radix-\\:ra6\\:';
  }

  modal_titulo_reativacao() {
    return '#radix-\\:ra7\\:';
  }

  botao_cancelar_reativacao() {
    return '/html/body/div[3]/div[2]/button[1]';
  }

  botao_confirmar_reativacao() {
    return '/html/body/div[3]/div[2]/button[2]';
  }

  card_pendencia() {
    return '//div[contains(@id, "content-pendencias")]//div[contains(@class, "px-6")]';
  }

  pendencia_cpf() {
    return '//div[contains(@id, "content-pendencias")]//div[contains(@class, "px-6")]//p[contains(@class, "font-bold")][1]';
  }

  pendencia_email() {
    return '//div[contains(@id, "content-pendencias")]//div[contains(@class, "px-6")]//p[contains(@class, "font-bold")][2]';
  }

  pendencia_dre() {
    return '//div[contains(@id, "content-pendencias")]//div[contains(@class, "px-6")]//p[contains(@class, "font-bold")][3]';
  }

  pendencia_ue() {
    return '//div[contains(@id, "content-pendencias")]//div[contains(@class, "px-6")]//p[contains(@class, "font-bold")][4]';
  }

  pendencia_data() {
    return '//div[contains(@id, "content-pendencias")]//div[contains(@class, "px-6")]//span[contains(@class, "font-bold")]';
  }

  botao_recusar_pendencia() {
    return '//div[contains(@id, "content-pendencias")]//button[contains(., "Recusar")]';
  }

  botao_aprovar_pendencia() {
    return '//div[contains(@id, "content-pendencias")]//button[contains(., "Aprovar")]';
  }

  // Locators para modal de recusa
  modal_recusa() {
    return 'div[role="dialog"], div[role="alertdialog"]';
  }

  modal_titulo_recusa() {
    return '//div[@role="dialog" or @role="alertdialog"]//h2 | //div[@role="dialog" or @role="alertdialog"]//*[contains(text(), "Recusar")]';
  }

  modal_mensagem_recusa() {
    return '//div[@role="dialog" or @role="alertdialog"]//*[contains(text(), "recusar a solicitação")]';
  }

  campo_motivo_recusa() {
    return '#motivo, textarea[name="motivo"], textarea[placeholder*="motivo"]';
  }

  label_motivo_recusa() {
    return '//label[contains(text(), "Motivo de recusa")]';
  }

  botao_cancelar_recusa() {
    return '//div[@role="dialog" or @role="alertdialog"]//button[contains(., "Cancelar")]';
  }

  botao_confirmar_recusa() {
    return '//div[@role="dialog" or @role="alertdialog"]//button[contains(., "Recusar perfil")]';
  }
}

export default Gestao_Pessoas_Localizadores;

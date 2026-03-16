class CadastroUeLocalizadores {
  // ==================== ABA 3: INFORMAÇÕES ADICIONAIS ====================
  
  // Título da aba
  aba_informacoes_adicionais() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div > div:nth-child(3) > div.mt-2.text-center > p'
  }

  // Nome da pessoa agressora
  label_nome_agressor() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div:nth-child(1) > label'
  }

  input_nome_agressor() {
    return '//*[@id=":r30:-form-item"]'
  }

  // Idade da pessoa agressora
  label_idade_agressor() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div:nth-child(2) > label'
  }

  input_idade_agressor() {
    return '//*[@id=":r31:-form-item"]'
  }

  // Endereço da pessoa agressora
  label_endereco_agressor() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.border.border-\\[\\#DADADA\\].rounded-md.p-6.space-y-3.my-3 > h3'
  }

  input_cep() {
    return '//*[@id=":r32:-form-item"]/input'
  }

  btn_pesquisar_cep() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[3]/div[1]/button'
  }

  input_numero_residencia() {
    return '//*[@id=":r34:-form-item"]'
  }

  // O que motivou a ocorrência
  label_motivacao() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.grid.grid-cols-1.md\\:grid-cols-2.gap-4 > div:nth-child(1) > label'
  }

  btn_campo_motivacao() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[2]/div[1]/button'
  }

  opcao_cyberbullying() {
    return '//span[contains(text(), "Cyberbullying")]'
  }

  opcao_atividades_ilicitas() {
    return '//span[contains(text(), "Atividades ilícitas")]'
  }

  // Qual o gênero
  label_genero() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.grid.grid-cols-1.md\\:grid-cols-2.gap-4 > div:nth-child(2) > label'
  }

  select_genero() {
    return '#\\:r3c\\:-form-item'
  }

  // Qual o grupo étnico-racial
  label_etnico() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.grid.grid-cols-1.md\\:grid-cols-3.gap-4 > div:nth-child(1) > label'
  }

  select_etnico() {
    return '#\\:r3e\\:-form-item'
  }

  // Qual a etapa escolar
  label_etapa() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.grid.grid-cols-1.md\\:grid-cols-3.gap-4 > div:nth-child(2) > label'
  }

  select_etapa() {
    return '#\\:r3g\\:-form-item'
  }

  // Qual a frequência escolar
  label_frequencia() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.grid.grid-cols-1.md\\:grid-cols-3.gap-4 > div:nth-child(3) > label'
  }

  select_frequencia() {
    return '#\\:r3i\\:-form-item'
  }

  // Interação da pessoa agressora
  label_interacao() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div:nth-child(6) > label'
  }

  input_interacao() {
    return '//*[@id=":r3k:-form-item"]'
  }

  // Redes de proteção
  label_redes() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div:nth-child(7) > label'
  }

  input_redes() {
    return '//*[@id=":r3l:-form-item"]'
  }

  // Conselho Tutelar
  label_conselho() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div:nth-child(8) > label'
  }

  radio_conselho_sim() {
    return '//*[@id=":r3m:-form-item"]/div/label[1]'
  }

  // NAAPA
  label_naapa() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div:nth-child(9) > label'
  }

  radio_naapa_sim() {
    return '//*[@id=":r3p:-form-item"]/div/label[1]'
  }

  // Botão próximo da aba 3
  btn_proximo_aba3() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[8]/button[2]'
  }

  // ==================== ABA 5: ANEXOS ====================

  // Títulos
  titulo_anexos() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div:nth-child(2) > h2'
  }

  label_selecione_arquivo() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div:nth-child(2) > form > fieldset > div.grid.grid-cols-1.md\\:grid-cols-2.gap-4 > div:nth-child(1) > div > label'
  }

  // Botão escolher arquivo
  btn_escolher_arquivo() {
    return '/html/body/div/div/div[2]/main/div/div[3]/div[2]/form/fieldset/div[2]/div[1]/div/div/button'
  }

  // Tipo do documento
  label_tipo_documento() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div:nth-child(2) > form > fieldset > div.grid.grid-cols-1.md\\:grid-cols-2.gap-4 > div.flex.gap-4 > div.space-y-2.flex-1 > label'
  }

  select_tipo_documento() {
    return '#\\:ra0\\:-form-item'
  }

  // Botão anexar documento
  btn_anexar_documento() {
    return '/html/body/div/div/div[2]/main/div/div[3]/div[2]/form/fieldset/div[2]/div[2]/div[2]/button'
  }

  // Botão Finalizar
  btn_finalizar() {
    return '/html/body/div/div/div[2]/main/div/div[3]/div[2]/form/fieldset/div[2]/div[2]/div[2]/button'
  }

  // ==================== MODAL CONCLUSÃO ====================

  modal_conclusao() {
    return '#radix-\\:ra6\\:'
  }

  label_motivo_encerramento() {
    return '#radix-\\:ra5\\: > form > div.space-y-2 > label'
  }

  input_motivo_encerramento() {
    return '//*[@id=":ras:-form-item"]'
  }

  btn_voltar_modal() {
    return '//*[@id="radix-:ra5:"]/form/div[2]/button[1]'
  }

  btn_finalizar_modal() {
    return '/html/body/div[3]/form/div[2]/button[2]'
  }

  // Mensagem de sucesso
  mensagem_sucesso() {
    return 'div[role="alertdialog"]'
  }

  // Botão fechar modal de sucesso
  btn_fechar_sucesso() {
    return '/html/body/div[3]/div[4]/button'
  }

  btn_fechar_final() {
    return '//*[@id="radix-:rr0:"]/div[4]/button'
  }
}

export default CadastroUeLocalizadores

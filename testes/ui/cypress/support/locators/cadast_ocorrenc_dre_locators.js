/**
 * @fileoverview Localizadores para Cadastro de Ocorrência - Perfil DRE
 * @description Seletores para elementos da interface de cadastro de ocorrências com perfil DRE
 */

class CadastroOcorrenciaDreLocalizadores {

  // ==================== NAVEGAÇÃO PRINCIPAL ====================

  btn_nova_ocorrencia() {
    return '//a[contains(@href, "cadastrar-ocorrencia") or contains(normalize-space(.), "Nova Ocorr")]'
  }

  // ==================== ABA 1: DATA E HORA ====================

  input_data_ocorrencia() {
    return 'input[type="date"]'
  }

  input_hora_ocorrencia() {
    return 'input[placeholder="Digite o horário"]'
  }

  input_hora_ocorrencia_xpath() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/div/div[2]/input'
  }

  // Pergunta furto/roubo - opção Sim
  radio_furto_sim() {
    return 'button[value="sim"], label:contains("Sim")'
  }

  // Pergunta furto/roubo - opção Não
  radio_furto_nao() {
    return 'button[value="nao"], label:contains("Não")'
  }

  btn_proximo_aba1() {
    return '//button[contains(normalize-space(.), "Próximo") or contains(normalize-space(.), "Proximo")]'
  }

  // ==================== ABA 2: TIPO DE OCORRÊNCIA ====================

  btn_campo_tipo_ocorrencia() {
    return 'button[role="combobox"]'
  }

  dropdown_opcao() {
    return '[role="option"]'
  }

  btn_campo_envolvidos() {
    return 'button[id*="form-item"]'
  }

  textarea_descricao() {
    return 'textarea[placeholder*="Descreva"], textarea[id*="form-item"]'
  }

  btn_proximo_aba2() {
    return '//button[contains(normalize-space(.), "Próximo") or contains(normalize-space(.), "Proximo")]'
  }

  // ==================== ABA 3: INFORMAÇÕES ADICIONAIS ====================

  aba_informacoes_adicionais() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div > div:nth-child(3) > div.mt-2.text-center > p'
  }

  input_nome_agressor() {
    return '//*[@id=":r30:-form-item"]'
  }

  input_idade_agressor() {
    return '//*[@id=":r31:-form-item"]'
  }

  btn_campo_motivacao() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[2]/div[1]/button'
  }

  select_genero() {
    return '#\\:r3c\\:-form-item'
  }

  select_etnico() {
    return '#\\:r3e\\:-form-item'
  }

  select_etapa() {
    return '#\\:r3g\\:-form-item'
  }

  select_frequencia() {
    return '#\\:r3i\\:-form-item'
  }

  btn_proximo_aba3() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[8]/button[2]'
  }

  // ==================== ABA 4: DECLARANTE E PROTOCOLOS ====================

  aba_declarante() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div > div:nth-child(4) > div.mt-2.text-center > p'
  }

  btn_campo_declarante() {
    return 'button[id*="form-item"]:nth-of-type(1)'
  }

  btn_campo_seguranca_publica() {
    return 'button[id*="form-item"]:nth-of-type(2)'
  }

  btn_campo_protocolo() {
    return 'button[id*="form-item"]:nth-of-type(3)'
  }

  btn_proximo_aba4() {
    return '//button[contains(normalize-space(.), "Próximo") or contains(normalize-space(.), "Proximo")]'
  }

  // ==================== ABA 5: ANEXOS ====================

  titulo_anexos() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div:nth-child(2) > h2'
  }

  btn_escolher_arquivo() {
    return '/html/body/div/div/div[2]/main/div/div[3]/div[2]/form/fieldset/div[2]/div[1]/div/div/button'
  }

  input_file() {
    return 'input[type="file"]'
  }

  select_tipo_documento() {
    return 'button[role="combobox"]:last-of-type'
  }

  btn_anexar_documento() {
    return '/html/body/div/div/div[2]/main/div/div[3]/div[2]/form/fieldset/div[2]/div[2]/div[2]/button'
  }

  btn_finalizar_anexos() {
    return '//button[contains(normalize-space(.), "Finalizar")]'
  }

  // ==================== MODAL DE CONCLUSÃO ====================

  modal_conclusao() {
    return 'div[role="dialog"]'
  }

  btn_finalizar_modal() {
    return '/html/body/div[3]/form/div[2]/button[2]'
  }

  // Mensagem de sucesso (toast/alertdialog)
  mensagem_sucesso() {
    return 'div[role="alertdialog"], [role="alert"]'
  }

  btn_fechar_sucesso() {
    return '/html/body/div[3]/div[4]/button'
  }

  // ==================== VALIDAÇÕES ====================

  titulo_historico() {
    return 'h1, h2, .text-\\[24px\\]'
  }

  tabela_ocorrencias() {
    return 'table tbody tr'
  }
}

export default CadastroOcorrenciaDreLocalizadores

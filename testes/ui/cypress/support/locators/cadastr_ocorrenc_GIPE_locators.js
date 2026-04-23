/**
 * Localizadores para a feature: cadastr_ocorrenc_GIPE.feature
 * 
 * Esta feature é específica para cadastro de ocorrências com perfil GIPE
 * (perfil administrativo que seleciona DRE e Unidade Educacional)
 * 
 * Diferenças vs cadastro_ue.feature:
 * - Aba 1: Inclui seleção de DRE e UE
 * - Abas 3-5: Compartilha mesmos steps de cadastro_ue.js
 */

class CadastrOcorrencGIPELocalizadores {
  // ═══════════════════════════════════════════════════════════════════════
  // ABA 1: Data, Hora e Unidade Educacional
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Botão "Nova Ocorrência" no dashboard
   * CSS baseado na classe de cor primária do design system (#717FC7)
   * Mais estável que XPath absoluto ou texto (botão pode ter ícone sem texto)
   */
  btn_nova_ocorrencia() {
    return 'main button[class*="717FC7"], main button[class*="bg-\\[#717FC7"]'
  }

  /**
   * Input de data (type="date")
   */
  input_data_ocorrencia() {
    return 'input[type="date"]'
  }

  /**
   * Input de hora (placeholder="Digite o horário")
   */
  input_hora_ocorrencia() {
    return 'input[placeholder="Digite o horário"]'
  }

  /**
   * Dropdown DRE - Botão para abrir lista de DREs
   * Usado apenas em perfil GIPE
   * XPath relativo baseado no label para resistir a mudanças de estrutura DOM
   */
  btn_dropdown_dre() {
    return "//label[contains(normalize-space(),'Qual a DRE')]/ancestor::div[.//button][1]//button[1]"
  }

  /**
   * Dropdown Unidade Educacional - Botão para abrir lista de UEs
   * Usado apenas em perfil GIPE
   * XPath relativo baseado no label para resistir a mudanças de estrutura DOM
   */
  btn_dropdown_ue() {
    return "//label[contains(normalize-space(),'Qual a Unidade Educacional')]/ancestor::div[.//button][1]//button[1]"
  }

  /**
   * Radio button "Não" para pergunta sobre furto/roubo/invasão
   */
  radio_nao_furto_roubo() {
    return 'label[data-state="checked"]'
  }

  /**
   * Botão "Próximo" para avançar entre abas
   */
  btn_proximo() {
    return 'button:contains("Próximo"), button:contains("Proximo")'
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ABA 2: Tipo de Ocorrência e Envolvidos
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Dropdown "Qual o tipo de ocorrência?"
   */
  btn_dropdown_tipo_ocorrencia() {
    return 'button.flex.w-full.min-h-[40px]'
  }

  /**
   * Container do dropdown aberto (listbox)
   */
  listbox_opcoes() {
    return 'div[role="listbox"]'
  }

  /**
   * Opções individuais dentro do dropdown
   */
  opcoes_dropdown() {
    return 'div[role="option"]'
  }

  /**
   * Label "Quem são os envolvidos?*"
   */
  label_envolvidos() {
    return 'label:contains("Quem são os envolvidos")'
  }

  /**
   * Dropdown de envolvidos
   * XPath relativo baseado no label "envolvidos"
   */
  btn_dropdown_envolvidos() {
    return "//label[contains(normalize-space(),'envolvidos')]/ancestor::div[.//button][1]//button[1]"
  }

  /**
   * Textarea "Descreva a ocorrência*"
   */
  textarea_descricao() {
    return 'textarea[id*="form-item"]'
  }

  /**
   * Radio button de confirmação (Sim/Não para informações de agressor)
   */
  radio_confirmacao() {
    return 'label.flex:nth-child(1) > span:nth-child(3)'
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ABA 3: Informações do Agressor
  // ═══════════════════════════════════════════════════════════════════════
  // Nota: Aba 3 usa os mesmos seletores de cadastro_ue_locators.js

  /**
   * Label do campo nome do agressor — XPath relativo por texto do label
   */
  label_nome_agressor() {
    return "//label[contains(normalize-space(),'nome da pessoa') or contains(normalize-space(),'Nome da pessoa')]"
  }

  /**
   * Input do campo nome — irmão direto do label de nome
   */
  input_nome_agressor() {
    return "//label[contains(normalize-space(),'nome da pessoa') or contains(normalize-space(),'Nome da pessoa')]/../input"
  }

  /**
   * Label do campo idade do agressor — XPath relativo por texto do label
   */
  label_idade_agressor() {
    return "//label[contains(normalize-space(),'idade da pessoa') or contains(normalize-space(),'Idade da pessoa')]"
  }

  /**
   * Input do campo idade — irmão direto do label de idade
   */
  input_idade_agressor() {
    return "//label[contains(normalize-space(),'idade da pessoa') or contains(normalize-space(),'Idade da pessoa')]/../input"
  }

  /**
   * Dropdown "Gênero"
   * XPath relativo baseado no label
   */
  btn_dropdown_genero() {
    return "//label[contains(normalize-space(),'Gênero') or contains(normalize-space(),'Genero')]/ancestor::div[.//button][1]//button[1]"
  }

  /**
   * Dropdown "Étnico-Racial"
   * XPath relativo baseado no label
   */
  btn_dropdown_etnico_racial() {
    return "//label[contains(normalize-space(),'tnico') and (contains(normalize-space(),'Racial') or contains(normalize-space(),'racial'))]/ancestor::div[.//button][1]//button[1]"
  }

  /**
   * Dropdown "Etapa Escolar"
   * XPath relativo baseado no label
   */
  btn_dropdown_etapa_escolar() {
    return "//label[contains(normalize-space(),'Etapa Escolar') or contains(normalize-space(),'etapa escolar')]/ancestor::div[.//button][1]//button[1]"
  }

  /**
   * Dropdown "Frequência Escolar"
   * XPath relativo baseado no label
   */
  btn_dropdown_frequencia_escolar() {
    return "//label[contains(normalize-space(),'Frequ') and contains(normalize-space(),'Escolar')]/ancestor::div[.//button][1]//button[1]"
  }

  /**
   * Textarea "Interação no ambiente escolar"
   */
  textarea_interacao_escolar() {
    return 'textarea[placeholder*="interação"], textarea[id*="form-item"]'
  }

  /**
   * Botão de dropdown do campo motivações
   * XPath relativo baseado no label
   */
  btn_campo_motivacao() {
    return "//label[contains(normalize-space(),'otiva')]/ancestor::div[.//button][1]//button[1]"
  }

  /**
   * Botão "Motivações" (alias)
   */
  btn_motivacoes() {
    return 'button:contains("Motivação")'
  }

  /**
   * Checkboxes de motivações (dentro do dropdown)
   */
  checkboxes_motivacoes() {
    return 'div[role="checkbox"]'
  }

  /**
   * Checkbox "Conselho Tutelar foi acionado?"
   */
  checkbox_conselho_tutelar() {
    return 'input[type="checkbox"][name*="conselho"]'
  }

  /**
   * Checkbox "Acompanhado pelo NAAPA?"
   */
  checkbox_naapa() {
    return 'input[type="checkbox"][name*="naapa"]'
  }

  /**
   * Textarea "Redes de proteção"
   */
  textarea_redes_protecao() {
    return 'textarea[placeholder*="redes"], textarea:last-of-type'
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ABA 4: Declarante e Protocolos
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Dropdown "Declarante"
   */
  btn_dropdown_declarante() {
    return 'button:contains("Selecione o declarante"), button[aria-label*="declarante"]'
  }

  /**
   * Dropdown "Comunicação com segurança pública"
   */
  btn_dropdown_seguranca_publica() {
    return 'button:contains("Selecione"), button[aria-label*="segurança"]'
  }

  /**
   * Dropdown "Protocolo acionado"
   */
  btn_dropdown_protocolo() {
    return 'button:contains("Selecione o protocolo"), button[aria-label*="protocolo"]'
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ABA 5: Anexos e Finalização
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Botão "Escolher arquivo"
   * XPath relativo baseado no texto do botão
   */
  btn_escolher_arquivo() {
    return "//button[contains(normalize-space(),'Escolher arquivo') or contains(normalize-space(),'Escolher Arquivo')]"
  }

  /**
   * Input file (hidden) para upload
   */
  input_file() {
    return 'input[type="file"]'
  }

  /**
   * Dropdown "Tipo de documento"
   */
  btn_dropdown_tipo_documento() {
    return 'button:contains("Selecione o tipo"), button[aria-label*="tipo de documento"]'
  }

  /**
   * Botão "Anexar documento"
   * XPath relativo baseado no texto do botão
   */
  btn_anexar_documento() {
    return "//button[contains(normalize-space(),'Anexar documento') or contains(normalize-space(),'Anexar Documento')]"
  }

  /**
   * Botão "Anterior"
   */
  btn_anterior() {
    return 'button:contains("Anterior")'
  }

  /**
   * Botão "Finalizar"
   */
  btn_finalizar() {
    return 'button:contains("Finalizar")'
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MODAL DE CONCLUSÃO
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Mensagem de sucesso "Ocorrência registrada com sucesso!"
   */
  msg_sucesso() {
    return ':contains("Ocorrência registrada com sucesso")'
  }

  /**
   * Botão para fechar modal (pode ser "OK", "Fechar", ou ícone X)
   */
  btn_fechar_modal() {
    return 'button:contains("OK"), button:contains("Fechar"), button[aria-label="Fechar"]'
  }

  /**
   * Texto de redirecionamento "Histórico de ocorrências registradas"
   */
  texto_historico() {
    return ':contains("Histórico de ocorrências registradas")'
  }
}

export default CadastrOcorrencGIPELocalizadores

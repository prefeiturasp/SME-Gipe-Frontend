/**
 * @fileoverview Localizadores para Cadastro de Ocorrência - Perfil DRE
 * @description Seletores para elementos da interface de cadastro de ocorrências com perfil DRE
 * @author Equipe de Automação - SME Gipe Frontend
 * @version 1.0.0
 */

class Complement_DRE_Localizadores {
  // ==================== LOCALIZADORES GERAIS ====================
  
  /**
   * Botão Nova Ocorrência
   * @returns {string} XPath do botão
   */
  btn_nova_ocorrencia() {
    return '/html/body/div[1]/div/div[2]/main/div/div[2]/div/a';
  }

  // ==================== ABA 1: INFORMAÇÕES BÁSICAS ====================
  
  /**
   * Campo de data da ocorrência
   * @returns {string} Seletor CSS do input de data
   */
  input_data_ocorrencia() {
    return 'input[type="date"]';
  }

  /**
   * Campo de horário da ocorrência
   * @returns {string} Seletor CSS do input de horário
   */
  input_hora_ocorrencia() {
    return 'input[placeholder="Digite o horário"]';
  }

  /**
   * XPath alternativo para campo de horário
   * @returns {string} XPath do input de horário
   */
  input_hora_ocorrencia_xpath() {
    return '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/div/div[2]/input';
  }

  /**
   * Botão de opção Sim para furto/roubo
   * @returns {string} Seletor CSS do botão
   */
  btn_opcao_sim_furto() {
    return 'button[data-state="checked"]';
  }

  /**
   * Botão de opção Não para furto/roubo
   * @returns {string} Seletor CSS do botão
   */
  btn_opcao_nao_furto() {
    return 'button[data-state="unchecked"]';
  }

  /**
   * Botão Próximo (genérico)
   * @returns {string} Seletor CSS do botão
   */
  btn_proximo() {
    return 'button.inline-flex:nth-child(2)';
  }

  // ==================== ABA 2: DETALHES DA OCORRÊNCIA ====================
  
  /**
   * Campo dropdown "Qual o tipo de ocorrência?"
   * @returns {string} Seletor CSS do campo
   */
  campo_tipo_ocorrencia() {
    return 'button[role="combobox"]';
  }

  /**
   * Opção no dropdown (genérica)
   * @returns {string} Seletor CSS das opções
   */
  dropdown_opcao() {
    return 'div[role="option"]';
  }

  /**
   * Campo "Quem são os envolvidos?"
   * @returns {string} Seletor CSS do campo
   */
  campo_envolvidos() {
    return 'button[id*="form-item"]';
  }

  /**
   * Campo de descrição da ocorrência
   * @returns {string} Seletor CSS do textarea
   */
  campo_descricao() {
    return 'textarea[placeholder*="Descreva"]';
  }

  /**
   * Botão de opção Sim para patrimônio danificado
   * @returns {string} Seletor CSS do botão
   */
  btn_patrimonio_sim() {
    return 'button[value="sim"]';
  }

  /**
   * Botão de opção Não para patrimônio danificado
   * @returns {string} Seletor CSS do botão
   */
  btn_patrimonio_nao() {
    return 'button[value="nao"]';
  }

  // ==================== ABA 3: INFORMAÇÕES COMPLEMENTARES ====================
  
  /**
   * Campo do declarante
   * @returns {string} Seletor CSS do campo
   */
  campo_declarante() {
    return 'button[id*="declarante"]';
  }

  /**
   * Campo de segurança pública
   * @returns {string} Seletor CSS do campo
   */
  campo_seguranca_publica() {
    return 'button[id*="seguranca"]';
  }

  /**
   * Campo de protocolo
   * @returns {string} Seletor CSS do campo
   */
  campo_protocolo() {
    return 'button[id*="protocolo"]';
  }

  // ==================== ABA 4: ANEXOS ====================
  
  /**
   * Área de anexos
   * @returns {string} Seletor CSS da área de anexos
   */
  area_anexos() {
    return 'div[class*="anexo"]';
  }

  /**
   * Botão de upload de arquivo
   * @returns {string} Seletor CSS do botão
   */
  btn_upload_arquivo() {
    return 'input[type="file"]';
  }

  /**
   * Título "Anexos"
   * @returns {string} Seletor CSS do título
   */
  titulo_anexos() {
    return 'h2:contains("Anexos"), h3:contains("Anexos")';
  }

  // ==================== BOTÕES DE NAVEGAÇÃO ====================
  
  /**
   * Botão Finalizar
   * @returns {string} Seletor CSS do botão
   */
  btn_finalizar() {
    return 'button:contains("Finalizar"), button:contains("Concluir")';
  }

  /**
   * Botão Voltar
   * @returns {string} Seletor CSS do botão
   */
  btn_voltar() {
    return 'button:contains("Voltar")';
  }

  // ==================== VALIDAÇÕES E MENSAGENS ====================
  
  /**
   * Mensagem de sucesso
   * @returns {string} Seletor CSS da mensagem
   */
  mensagem_sucesso() {
    return 'div[role="alert"], div[class*="success"]';
  }

  /**
   * Mensagem de erro
   * @returns {string} Seletor CSS da mensagem
   */
  mensagem_erro() {
    return 'div[role="alert"][class*="error"], div[class*="error"]';
  }

  /**
   * Título da página
   * @returns {string} Seletor CSS do título
   */
  titulo_pagina() {
    return 'h1, h2';
  }
}

export default Complement_DRE_Localizadores;

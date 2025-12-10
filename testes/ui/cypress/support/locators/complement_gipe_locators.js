/**
 * @fileoverview Localizadores para Login - Perfil GIPE
 * @description Seletores para elementos da interface de login com perfil GIPE
 * @author Equipe de Automação - SME Gipe Frontend
 * @version 1.0.0
 */

class Complement_GIPE_Localizadores {
  // ==================== LOCALIZADORES DE LOGIN ====================
  
  /**
   * Campo de usuário (RF ou CPF)
   * @returns {string} Seletor CSS do input
   */
  campo_usuario() {
    return 'input[placeholder="Digite um RF ou CPF"]';
  }

  /**
   * Campo de senha
   * @returns {string} Seletor CSS do input
   */
  campo_senha() {
    return 'input[placeholder="Digite sua senha"]';
  }

  /**
   * Botão Acessar
   * @returns {string} Seletor CSS do botão
   */
  botao_acessar() {
    return 'button:contains("Acessar")';
  }

  /**
   * Título do dashboard
   * @returns {string} Seletor CSS do título
   */
  titulo_dashboard() {
    return 'h1, h2';
  }

  /**
   * Texto de histórico de ocorrências
   * @returns {string} Seletor CSS do texto
   */
  texto_historico() {
    return '.text-\\[24px\\]';
  }
}

export default Complement_GIPE_Localizadores;

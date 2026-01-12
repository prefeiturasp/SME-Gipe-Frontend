/**
 * @fileoverview Step Definitions para Consulta de Ocorrência
 * @description Implementação dos steps para consulta e visualização de ocorrências
 * @author Equipe de Automação - SME Gipe Frontend
 * @version 1.0.0
 * @lastModified 23 de outubro de 2025
 */

import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../locators/login_locators'
import Consulta_Ocorrencia_Localizadores from '../locators/consulta_ocorrencia_locators'

// =============================================================================
// INSTÂNCIAS DOS LOCALIZADORES
// =============================================================================

const locators_login = new Login_Gipe_Localizadores()
const locators = new Consulta_Ocorrencia_Localizadores()

// =============================================================================
// CONSTANTES E CONFIGURAÇÕES
// =============================================================================

/**
 * Configurações de timeout para diferentes operações
 */
const TIMEOUTS = {
  MINIMAL: 1000,
  SHORT: 3000,
  DEFAULT: 6000,
  EXTENDED: 10000,
  LONG: 15000
}

/**
 * Credenciais de acesso ao sistema
 */
const CREDENCIAIS = {
  RF: '05481179342',
  SENHA: 'Sgp9342'
}

/**
 * Mensagens de log padronizadas
 */
const LOG_MESSAGES = {
  LOGIN_INICIO: '=== REALIZANDO LOGIN COM SUCESSO ===',
  LOGIN_SUCESSO: 'Login realizado com sucesso - Redirecionado para dashboard',
  VALIDACAO_TITULO: '=== VALIDANDO TÍTULO DA PÁGINA ===',
  VALIDACAO_CAMPO: '=== VALIDANDO CAMPO DE AÇÃO ===',
  CLIQUE_VISUALIZAR: '=== CLICANDO EM VISUALIZAR ===',
  VALIDACAO_FINAL: '=== VALIDANDO CAMPO NA PÁGINA DE DETALHES ==='
}

// =============================================================================
// HOOKS - SETUP E TEARDOWN
// =============================================================================

Before(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.log('Iniciando cenário - ambiente limpo')
})

After(() => {
  cy.log('Cenário finalizado')
})

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

/**
 * Função para realizar login no sistema com validações robustas
 */
function realizarLogin() {
  cy.log(LOG_MESSAGES.LOGIN_INICIO)
  
  // Acesso à URL base
  cy.login_gipe()
  
  cy.get(locators_login.campo_usuario(), { timeout: TIMEOUTS.EXTENDED })
    .should('be.visible')
    .clear()
    .type(CREDENCIAIS.RF)
  
  cy.get(locators_login.campo_senha(), { timeout: TIMEOUTS.DEFAULT })
    .should('be.visible')
    .clear()
    .type(CREDENCIAIS.SENHA)

  cy.get('button', { timeout: TIMEOUTS.DEFAULT })
    .filter((_, el) => el.innerText && el.innerText.trim() === 'Acessar')
    .should('be.visible')
    .should('not.be.disabled')
    .click()

  cy.url({ timeout: TIMEOUTS.EXTENDED }).should('include', '/dashboard')
  
  cy.log(LOG_MESSAGES.LOGIN_SUCESSO)
}

/**
 * Função para validar título usando múltiplas estratégias
 * @param {string} tituloEsperado - Texto do título esperado
 */
function validarTitulo(tituloEsperado) {
  cy.log(LOG_MESSAGES.VALIDACAO_TITULO)
  
  // Primeira tentativa: seletor CSS específico
  cy.get('body').then(($body) => {
    if ($body.find(locators.titulo_historico_ocorrencias()).length > 0) {
      cy.get(locators.titulo_historico_ocorrencias(), { timeout: TIMEOUTS.DEFAULT })
        .should('be.visible')
        .should('contain.text', tituloEsperado)
        .then(() => {
          cy.log('Título encontrado com seletor CSS específico')
        })
    } else {
      // Fallback: seletor por texto
      cy.get(locators.titulo_historico_texto(), { timeout: TIMEOUTS.DEFAULT })
        .should('be.visible')
        .should('contain.text', tituloEsperado)
        .then(() => {
          cy.log('Título encontrado com seletor por texto')
        })
    }
  })
}

/**
 * Função para validar campo "Ação" usando múltiplas estratégias
 */
function validarCampoAcao() {
  cy.log(LOG_MESSAGES.VALIDACAO_CAMPO)
  
  // Primeira tentativa: seletor específico
  cy.get('body').then(($body) => {
    if ($body.find(locators.campo_acao()).length > 0) {
      cy.get(locators.campo_acao(), { timeout: TIMEOUTS.DEFAULT })
        .should('be.visible')
        .should('contain.text', 'Ação')
        .then(() => {
          cy.log(' Campo Ação encontrado com seletor específico')
        })
    } else {
      // Fallback: seletor alternativo
      cy.get(locators.campo_acao_alt(), { timeout: TIMEOUTS.DEFAULT })
        .should('be.visible')
        .should('contain.text', 'Ação')
        .then(() => {
          cy.log(' Campo Ação encontrado com seletor alternativo')
        })
    }
  })
}

/**
 * Função para clicar no botão visualizar usando múltiplas estratégias
 */
function clicarVisualizar() {
  cy.log(LOG_MESSAGES.CLIQUE_VISUALIZAR)
  
  // Primeira tentativa: seletor robusto
  cy.get('body').then(($body) => {
    const seletorRobusto = locators.btn_visualizar_robusto()
    
    if ($body.find(seletorRobusto).length > 0) {
      cy.log(' Botão encontrado com seletor robusto')
      cy.get(seletorRobusto, { timeout: TIMEOUTS.DEFAULT })
        .first()
        .should('be.visible')
        .click({ force: true })
    } else {
      // Segunda tentativa: seletor alternativo
      cy.log(' Tentando seletor alternativo...')
      const seletorAlt = locators.btn_visualizar()
      
      if ($body.find(seletorAlt).length > 0) {
        cy.get(seletorAlt, { timeout: TIMEOUTS.DEFAULT })
          .first()
          .should('be.visible')
          .click({ force: true })
          .then(() => {
            cy.log(' Botão encontrado com seletor alternativo')
          })
      } else {
        // Terceira tentativa: link visualizar
        cy.log(' Tentando link visualizar...')
        cy.get(locators.link_visualizar(), { timeout: TIMEOUTS.DEFAULT })
          .first()
          .should('be.visible')
          .click({ force: true })
          .then(() => {
            cy.log(' Botão encontrado via link')
          })
      }
    }
  })
}

/**
 * Função para validar campo "Quando a ocorrência aconteceu?" na página de detalhes
 */
function validarCampoQuandoOcorrencia() {
  cy.log(LOG_MESSAGES.VALIDACAO_FINAL)
  
  cy.wait(TIMEOUTS.SHORT)
  
  // Primeira tentativa: seletor por texto
  cy.get('body').then(($body) => {
    if ($body.text().includes('Quando a ocorrência aconteceu?')) {
      cy.get(locators.campo_quando_ocorrencia_texto(), { timeout: TIMEOUTS.DEFAULT })
        .should('be.visible')
        .should('contain.text', 'Quando a ocorrência aconteceu?')
        .then(() => {
          cy.log(' Campo "Quando a ocorrência aconteceu?" encontrado')
        })
    } else {
      // Fallback: seletor alternativo
      cy.get(locators.campo_quando_ocorrencia_alt(), { timeout: TIMEOUTS.DEFAULT })
        .should('be.visible')
        .should('contain.text', 'Quando a ocorrência aconteceu?')
        .then(() => {
          cy.log(' Campo encontrado com seletor alternativo')
        })
    }
  })
}

// =============================================================================
// STEPS: ACESSO E LOGIN
// =============================================================================

/**
 * Step para realizar login com sucesso - implementação específica para consulta
 */
Given('que o usuário realizou o login com sucesso para consulta', () => {
  cy.log('=== EXECUTANDO LOGIN ESPECÍFICO PARA CONSULTA ===')
  realizarLogin()
})

/**
 * Step genérico para manter compatibilidade - mas usando credenciais corretas
 */
Given('que o usuário realizou o login com sucesso', () => {
  cy.log('=== EXECUTANDO LOGIN COM CREDENCIAIS ATUALIZADAS ===')
  realizarLogin()
})

// =============================================================================
// STEPS: NAVEGAÇÃO E VALIDAÇÃO
// =============================================================================

/**
 * Step para validar que está na página principal
 */
When('o usuário está na página principal do sistema', () => {
  cy.log('=== VALIDANDO PÁGINA PRINCIPAL ===')
  
  cy.url({ timeout: TIMEOUTS.DEFAULT }).should('include', '/dashboard')

  cy.get(locators.area_dashboard(), { timeout: TIMEOUTS.DEFAULT })
    .should('be.visible')
    
  cy.log(' Usuário está na página principal do sistema')
})

/**
 * Step para localizar e validar título
 */
When('localiza e valida o título {string}', (titulo) => {
  validarTitulo(titulo)
})

/**
 * Step para localizar e validar campo "Ação"
 */
When('localiza e valida o campo {string}', (campo) => {
  if (campo.toLowerCase().includes('ação')) {
    validarCampoAcao()
  } else {
    cy.log(` Validação não implementada para o campo: ${campo}`)
    cy.get('body').should('contain.text', campo)
  }
})

/**
 * Step para clicar em visualizar
 */
When('clica em {string}', (botao) => {
  if (botao.toLowerCase().includes('visualizar')) {
    clicarVisualizar()
  } else {
    cy.log(` Clique não implementado para: ${botao}`)
    cy.contains(botao, { timeout: TIMEOUTS.DEFAULT }).click()
  }
})

// =============================================================================
// STEPS: VALIDAÇÕES FINAIS
// =============================================================================

/**
 * Step para validar resultado e campo específico
 */
Then('o sistema exibe o resultado e valida o campo {string}', (campo) => {
  cy.log('=== VALIDANDO RESULTADO FINAL ===')

  cy.url({ timeout: TIMEOUTS.EXTENDED }).should('include', '/cadastrar-ocorrencia/')
  
  if (campo.includes('Quando a ocorrência aconteceu?')) {
    validarCampoQuandoOcorrencia()
  } else {
    cy.log(` Validação não implementada para o campo: ${campo}`)
    cy.get('body', { timeout: TIMEOUTS.DEFAULT }).should('contain.text', campo)
  }
  
  cy.log(' Validação do resultado concluída com sucesso')
})

/**
 * Step para validar título na página
 */
Then('o título {string} deve estar visível', (titulo) => {
  validarTitulo(titulo)
})

/**
 * Step para validar campo na tabela
 */
Then('o campo {string} deve estar presente na tabela', (campo) => {
  if (campo.toLowerCase().includes('ação')) {
    validarCampoAcao()
  } else {
    cy.get(locators.tabela_ocorrencias(), { timeout: TIMEOUTS.DEFAULT })
      .should('be.visible')
      .should('contain.text', campo)
  }
})

/**
 * Step para validar existência de ocorrências
 */
Then('deve existir pelo menos uma ocorrência listada', () => {
  cy.log('=== VALIDANDO EXISTÊNCIA DE OCORRÊNCIAS ===')
  
  cy.get(locators.linhas_tabela(), { timeout: TIMEOUTS.DEFAULT })
    .should('have.length.greaterThan', 0)
    .then(($linhas) => {
      cy.log(` Encontradas ${$linhas.length} ocorrência(s) listada(s)`)
    })
})
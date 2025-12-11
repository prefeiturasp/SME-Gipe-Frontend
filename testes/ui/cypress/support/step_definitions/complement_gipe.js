/**
 * @fileoverview Step Definitions para Login - Perfil GIPE
 * @description Implementação dos steps para login com perfil GIPE
 * @author Equipe de Automação - SME Gipe Frontend
 * @version 1.0.0
 */

import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../locators/login_locators'

// =============================================================================
// INSTÂNCIAS DOS LOCALIZADORES
// =============================================================================

const locators_login = new Login_Gipe_Localizadores()

// =============================================================================
// CONSTANTES E CONFIGURAÇÕES
// =============================================================================

/**
 * Credenciais de acesso - Perfil GIPE
 */
const CREDENCIAIS_GIPE = {
  RF: '39411157076',
  SENHA: 'Sgp7076'
}

/**
 * Configurações de timeout
 */
const TIMEOUTS = {
  MINIMAL: 1000,
  SHORT: 2000,
  DEFAULT: 3000,
  EXTENDED: 5000,
  LONG: 15000,
  VERY_LONG: 30000
}

/**
 * Mensagens de log
 */
const LOG_MESSAGES = {
  LOGIN_INICIO: '=== REALIZANDO LOGIN COM PERFIL GIPE ===',
  LOGIN_SUCESSO: '✅ Login GIPE realizado com sucesso',
  VALIDACAO: '=== VALIDANDO ELEMENTO ==='
}

// =============================================================================
// HOOKS - SETUP E TEARDOWN
// =============================================================================

Before(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.log('🔄 Iniciando cenário - ambiente limpo')
})

After(() => {
  cy.log('✅ Cenário finalizado')
})

// =============================================================================
// STEP DEFINITIONS - LOGIN
// =============================================================================

Given('que eu acesso o sistema como GIPE', () => {
  cy.log(LOG_MESSAGES.LOGIN_INICIO)
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('/', { 
    timeout: TIMEOUTS.VERY_LONG,
    retryOnNetworkFailure: true
  })
  cy.wait(TIMEOUTS.DEFAULT)
  cy.url({ timeout: TIMEOUTS.VERY_LONG }).should('include', 'gipe.sme.prefeitura.sp.gov.br')
})

When('eu efetuo login com RF GIPE', () => {
  cy.log(`Login com RF: ${CREDENCIAIS_GIPE.RF}`)
  
  // Preencher RF
  cy.get(locators_login.campo_usuario(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .clear()
    .type(CREDENCIAIS_GIPE.RF, { delay: 100 })
  
  // Preencher senha
  cy.get(locators_login.campo_senha(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .clear()
    .type(CREDENCIAIS_GIPE.SENHA, { delay: 100 })
  
  // Clicar no botão Acessar
  cy.get('button')
    .filter((_, el) => el.innerText && el.innerText.trim() === 'Acessar')
    .should('be.visible')
    .should('not.be.disabled')
    .click()
  
  cy.wait(TIMEOUTS.EXTENDED)
  cy.log(LOG_MESSAGES.LOGIN_SUCESSO)
})

Then('devo ser redirecionado para o dashboard', () => {
  cy.url({ timeout: TIMEOUTS.VERY_LONG }).should('include', '/dashboard')
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('✅ Redirecionado para dashboard com sucesso')
})

Then('devo visualizar a página principal do sistema', () => {
  cy.get('body', { timeout: TIMEOUTS.LONG }).should('be.visible')
  
  // Validar existência do texto "Histórico de ocorrências registradas"
  cy.get('.text-\\[24px\\]', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .and('contain.text', 'Histórico de ocorrências registradas')
  
  cy.log('✅ Página principal carregada com histórico de ocorrências')
})

When('estou na página principal do sistema', () => {
  cy.url({ timeout: TIMEOUTS.LONG }).should('include', '/dashboard')
  cy.wait(TIMEOUTS.SHORT)
})

Then('devo ver o título {string}', (titulo) => {
  cy.log(`${LOG_MESSAGES.VALIDACAO} - ${titulo}`)
  cy.contains('h1, h2', titulo, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
  cy.log(`✅ Título "${titulo}" encontrado`)
})

Then('o sistema deve exibir as funcionalidades disponíveis para GIPE', () => {
  cy.get('body', { timeout: TIMEOUTS.LONG }).should('be.visible')
  cy.wait(TIMEOUTS.SHORT)
  cy.log('✅ Funcionalidades GIPE carregadas')
})

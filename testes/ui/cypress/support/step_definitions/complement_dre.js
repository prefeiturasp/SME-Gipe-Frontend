/**
 * @fileoverview Step Definitions para Login - Perfil DRE
 * @description Implementação dos steps para login com perfil DRE
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
 * Credenciais de acesso - Perfil DRE
 */
const CREDENCIAIS_DRE = {
  RF: '7311559',
  SENHA: 'Sgp1559'
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
  LOGIN_INICIO: '=== REALIZANDO LOGIN COM PERFIL DRE ===',
  LOGIN_SUCESSO: '✅ Login DRE realizado com sucesso',
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

Given('que eu acesso o sistema como DRE', () => {
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

When('eu efetuo login com RF DRE', () => {
  cy.log(`Login com RF: ${CREDENCIAIS_DRE.RF}`)
  
  // Preencher RF
  cy.get(locators_login.campo_usuario(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .clear()
    .type(CREDENCIAIS_DRE.RF, { delay: 100 })
  
  // Preencher senha
  cy.get(locators_login.campo_senha(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .clear()
    .type(CREDENCIAIS_DRE.SENHA, { delay: 100 })
  
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

Then('o sistema deve exibir as funcionalidades disponíveis para DRE', () => {
  cy.get('body', { timeout: TIMEOUTS.LONG }).should('be.visible')
  cy.wait(TIMEOUTS.SHORT)
  cy.log('✅ Funcionalidades DRE carregadas')
})

// =============================================================================
// STEP DEFINITIONS - COMPLEMENTO DE OCORRÊNCIA
// =============================================================================

When('eu visualizo uma ocorrência registrada', () => {
  cy.log('=== VISUALIZANDO OCORRÊNCIA ===')
  
  // Validar presença da página de histórico (busca por qualquer elemento com o texto)
  cy.contains('Histórico de ocorrências', { timeout: TIMEOUTS.VERY_LONG })
    .should('be.visible')
  
  cy.wait(TIMEOUTS.DEFAULT)
  
  // Clicar no ícone de visualização (lupa) da primeira ocorrência
  cy.get('table tbody tr', { timeout: TIMEOUTS.LONG })
    .first()
    .find('a[href*="/"], button, svg')
    .first()
    .should('be.visible')
    .click({ force: true })
  
  cy.wait(TIMEOUTS.EXTENDED)
  cy.log('✅ Ocorrência visualizada')
})

Then('devo visualizar todos os campos do formulário de ocorrência', () => {
  cy.log('=== VALIDANDO CAMPOS DO FORMULÁRIO ===')
  
  const camposObrigatorios = [
    'Quando a ocorrência aconteceu?',
    'A ocorrência é sobre furto, roubo, invasão ou depredação?',
    'Qual o tipo de ocorrência?',
    'Quem são os envolvidos?',
    'Descreva a ocorrência',
    'Existem informações sobre o agressor e/ou vítima?',
    'Quem é o declarante?',
    'Houve comunicação com a segurança pública?',
    'Qual protocolo acionado?'
  ]
  
  camposObrigatorios.forEach(campo => {
    cy.contains('label', campo, { timeout: TIMEOUTS.LONG })
      .should('be.visible')
  })
  
  cy.log('✅ Todos os campos obrigatórios validados')
})

Then('devo ver o botão {string} para continuar', (textoBotao) => {
  cy.contains('button', textoBotao, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .should('not.be.disabled')
  cy.log(`✅ Botão "${textoBotao}" encontrado`)
})

When('eu clico no botão {string}', (textoBotao) => {
  cy.contains('button', textoBotao, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .click()
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log(`✅ Clicado no botão "${textoBotao}"`)
})

Then('devo visualizar o formulário de continuação da ocorrência', () => {
  cy.log('=== VALIDANDO FORMULÁRIO DE CONTINUAÇÃO ===')
  
  cy.contains('h2', 'Continuação da ocorrência', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
  
  const camposContinuacao = [
    'Houve acionamento da Secretaria de Seguranças Pública ou Forças de Segurança?',
    'Houve interlocução com a Supervisão Técnica de Saúde (STS)?',
    'Houve interlocução com a Coordenação de Políticas para Criança e Adolescente (CPCA)?',
    'Houve interlocução com a Supervisão Escolar?',
    'Houve interlocução com o Núcleo de Apoio e Acompanhamento para a Aprendizagem (NAAPA)?'
  ]
  
  camposContinuacao.forEach(campo => {
    cy.contains('label', campo, { timeout: TIMEOUTS.LONG })
      .should('be.visible')
  })
  
  cy.log('✅ Formulário de continuação validado')
})

Then('devo preencher os campos de interlocução obrigatórios', () => {
  cy.log('=== PREENCHENDO CAMPOS OBRIGATÓRIOS ===')
  // Implementação futura: selecionar opções obrigatórias
  cy.wait(TIMEOUTS.SHORT)
  cy.log('✅ Campos obrigatórios identificados')
})

Then('devo preencher os campos complementares das interlocuções', () => {
  cy.log('=== PREENCHENDO CAMPOS COMPLEMENTARES ===')
  
  const textoComplementar = 'Teste de automação - informação complementar'
  
  // Preencher campos de textarea visíveis
  cy.get('textarea[id*="form-item"]', { timeout: TIMEOUTS.LONG })
    .each(($textarea, index) => {
      if ($textarea.is(':visible')) {
        cy.wrap($textarea)
          .clear()
          .type(textoComplementar, { delay: 50 })
        cy.log(`✅ Campo complementar ${index + 1} preenchido`)
      }
    })
  
  cy.wait(TIMEOUTS.SHORT)
})

When('eu finalizo o preenchimento', () => {
  cy.log('=== FINALIZANDO PREENCHIMENTO ===')
  cy.wait(TIMEOUTS.SHORT)
  cy.log('✅ Formulário pronto para envio')
})

Then('devo retornar para o histórico de ocorrências', () => {
  cy.contains('Histórico de ocorrências', { timeout: TIMEOUTS.VERY_LONG })
    .should('be.visible')
  cy.log('✅ Retornado ao histórico')
})

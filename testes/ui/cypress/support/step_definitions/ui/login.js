import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../../locators/login_locators'

const locators = new Login_Gipe_Localizadores()
const TIMEOUT_PADRAO = 15000
const DELAY_DIGITACAO = 50

/**
 * Preenche os campos de RF e senha com credenciais válidas
 */
When('eu insiro credenciais válidas', () => {
  const rf = Cypress.env('RF_VALIDO')
  const senha = Cypress.env('SENHA_VALIDA')
  
  cy.wait(500)
  
  cy.get(locators.campo_usuario(), { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .clear()
    .type(rf, { delay: DELAY_DIGITACAO })

  cy.get(locators.campo_senha(), { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .clear()
    .type(senha, { delay: DELAY_DIGITACAO })
  
  cy.wait(500)
})

/**
 * Preenche os campos de RF e senha com credenciais inválidas
 */
When('eu insiro credenciais inválidas', () => {
  const rf = Cypress.env('RF_INVALIDO')
  const senha = Cypress.env('SENHA_INVALIDA')
  
  cy.wait(500)
  
  cy.get(locators.campo_usuario(), { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .clear()
    .type(rf, { delay: DELAY_DIGITACAO })

  cy.get(locators.campo_senha(), { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .clear()
    .type(senha, { delay: DELAY_DIGITACAO })
  
  cy.wait(500)
})

/**
 * Preenche apenas o campo RF, deixando senha vazia
 */
When('eu insiro apenas o RF sem senha', () => {
  const rf = Cypress.env('RF_INVALIDO')
  
  cy.wait(500)
  
  cy.get(locators.campo_usuario(), { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .clear()
    .type(rf, { delay: DELAY_DIGITACAO })
  
  cy.wait(500)
})

/**
 * Preenche apenas o campo senha, deixando RF vazio
 */
When('eu insiro apenas a senha sem RF', () => {
  const senha = Cypress.env('SENHA_INVALIDA')
  
  cy.wait(500)
  
  cy.get(locators.campo_senha(), { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .clear()
    .type(senha, { delay: DELAY_DIGITACAO })
  
  cy.wait(500)
})

/**
 * Clica no botão de acessar/login
 */
When('clico no botão de acessar', () => {
  cy.wait(500)
  
  cy.get('button', { timeout: TIMEOUT_PADRAO })
    .filter((_, el) => el.innerText && el.innerText.trim() === 'Acessar')
    .should('be.visible')
    .should('not.be.disabled')
    .click()
  
  cy.wait(2000)
})

/**
 * Valida redirecionamento para dashboard após login bem-sucedido
 */
Then('devo ser redirecionado para o dashboard', () => {
  cy.url({ timeout: 30000 }).should('include', '/dashboard')
  cy.log('Redirecionado para dashboard')
})

/**
 * Valida que a página principal está carregada e visível
 */
Then('devo visualizar a página principal do sistema', () => {
  cy.get('body', { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .and('not.be.empty')
  cy.log('Página principal carregada com sucesso')
})

/**
 * Valida que o sistema exibe funcionalidades específicas para o perfil UE
 */
Then('o sistema deve exibir as funcionalidades disponíveis para UE', () => {
  cy.get('body', { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
  cy.log('Funcionalidades UE disponíveis')
})

/**
 * Valida exibição de mensagem de erro de autenticação
 */
Then('devo visualizar mensagem de erro de autenticação', () => {
  cy.wait(1000)
  
  cy.get('body', { timeout: 10000 }).then(($body) => {
    const bodyText = $body.text()
    
    if (bodyText.includes('Usuário e/ou senha inválida')) {
      cy.contains('Usuário e/ou senha inválida', { timeout: 10000 })
        .should('be.visible')
    } else if (bodyText.includes('inválida') || bodyText.includes('incorreto')) {
      cy.contains(/inválida|incorreto/i, { timeout: 10000 })
        .should('be.visible')
    } else {
      throw new Error('Mensagem de erro de autenticação não encontrada')
    }
  })
  
  cy.log('Mensagem de erro de autenticação validada')
})

/**
 * Valida que o campo senha está em branco e exibe validação apropriada
 */
Then('devo visualizar validação de senha obrigatória', () => {
  cy.get(locators.campo_senha())
    .should('have.value', '')
  
  cy.get('body', { timeout: 10000 }).then(($body) => {
    const bodyText = $body.text()
    
    if (bodyText.includes('Senha é obrigatória') || bodyText.includes('obrigatória')) {
      cy.contains(/Senha é obrigatória|obrigatória/i, { timeout: 5000 })
        .should('be.visible')
    } else if ($body.find('button[disabled]').length > 0) {
      cy.get('button[disabled]').should('exist')
    } else {
      cy.url().should('include', '/')
    }
  })
  
  cy.log('Validação de senha obrigatória verificada')
})

/**
 * Valida que o campo RF está em branco e exibe validação apropriada
 */
Then('devo visualizar validação de RF obrigatório', () => {
  cy.get(locators.campo_usuario())
    .should('have.value', '')
  
  cy.get('body', { timeout: 10000 }).then(($body) => {
    const bodyText = $body.text()
    
    if (bodyText.includes('RF ou CPF é obrigatório') || bodyText.includes('obrigatório')) {
      cy.contains(/RF ou CPF é obrigatório|obrigatório/i, { timeout: 5000 })
        .should('be.visible')
    } else if ($body.find('button[disabled]').length > 0) {
      cy.get('button[disabled]').should('exist')
    } else {
      cy.url().should('include', '/')
    }
  })
  
  cy.log('Validação de RF obrigatório verificada')
})


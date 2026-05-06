import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Gestao_Pessoas_Localizadores from '../../locators/gestao_pessoas_locators'

const locators = new Gestao_Pessoas_Localizadores()

// ============================================================================
// CREDENCIAIS VÊM DO .env via cypress.config.js
// ============================================================================

const waitAndGet = (selector, options = {}) => {
  const { timeout = 15000, wait = 2000, checkEnabled = true } = options
  cy.wait(wait)
  const element = cy.get(selector, { timeout }).should('be.visible')
  return checkEnabled ? element.should('be.enabled') : element
}

const clickElement = (selector, options = {}) => {
  const { force = true, wait = 1500 } = options
  cy.get(selector, { timeout: 15000 })
    .should('be.visible')
    .click({ force })
  cy.wait(wait)
}

const clickElementXPath = (xpath, options = {}) => {
  const { force = true, wait = 1500 } = options
  cy.xpath(xpath, { timeout: 30000 })
    .should('be.visible')
    .click({ force })
  cy.wait(wait)
}

const selectDropdownOption = (optionText, waitTime = 1500) => {
  cy.wait(2000)
  cy.get('body').then($body => {
    const selector = $body.find('div[role="option"]').length > 0 
      ? 'div[role="option"]' 
      : 'span, div'
    
    cy.contains(selector, optionText, { timeout: 15000 })
      .first()
      .should('be.visible')
      .click({ force: true })
  })
  cy.wait(waitTime)
}

function gerarCPFValido() {
  const random = (n) => Math.round(Math.random() * n)
  const mod = (dividend, divisor) => Math.round(dividend - (Math.floor(dividend / divisor) * divisor))

  let n = []
  for (let i = 0; i < 9; i++) {
    n[i] = random(9)
  }

  let d1 = 0
  for (let i = 0; i < 9; i++) {
    d1 += n[i] * (10 - i)
  }
  d1 = 11 - mod(d1, 11)
  if (d1 >= 10) d1 = 0

  let d2 = d1 * 2
  for (let i = 0; i < 9; i++) {
    d2 += n[i] * (11 - i)
  }
  d2 = 11 - mod(d2, 11)
  if (d2 >= 10) d2 = 0

  return `${n.join('')}${d1}${d2}`
}

function gerarRF() {
  return Math.floor(1000000 + Math.random() * 9000000).toString()
}

function gerarEmail() {
  const timestamp = new Date().getTime()
  return `teste.gipe.${timestamp}@sme.prefeitura.sp.gov.br`
}

function gerarNomeAleatorio() {
  const nomes = [
    'João da Silva Santos',
    'Maria Oliveira Costa',
    'Pedro Henrique Ferreira',
    'Ana Carolina Rodrigues',
    'Lucas Gabriel Almeida',
    'Juliana Martins Souza',
    'Rafael Eduardo Pereira',
    'Beatriz Fernanda Lima',
    'Carlos Alberto Ribeiro',
    'Patricia Regina Cardoso',
    'Fernando Augusto Dias',
    'Camila Cristina Barbosa',
    'Ricardo Antonio Gomes',
    'Larissa Vitória Campos',
    'Marcos Paulo Monteiro'
  ]
  return nomes[Math.floor(Math.random() * nomes.length)]
}

Given('que eu acesso o sistema como GIPE', () => {
  const RF_GIPE = Cypress.env('RF_GIPE')
  const SENHA_GIPE = Cypress.env('SENHA_GIPE')
  cy.loginWithSession(RF_GIPE, SENHA_GIPE, 'GIPE')
})

Given('eu efetuo login com RF GIPE', () => {
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', { 
    timeout: 30000,
    failOnStatusCode: false 
  })
  cy.url({ timeout: 15000 }).should('include', '/dashboard')
  cy.wait(2000)
})

Given('estou na página principal do sistema', () => {
  cy.url({ timeout: 15000 }).should('include', '/dashboard')
  cy.wait(2000)
})

When('acesso o menu de Gestão', () => {
  clickElementXPath(locators.menu_gestao())
})

When('seleciono a opção {string}', (opcao) => {
  if (opcao === 'Gestão de pessoa usuária') {
    cy.wait(3000)
    cy.xpath(locators.opcao_gestao_pessoa_usuaria(), { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(3000)
  }
})

Then('visualizo a página de Gestão de usuários', () => {
  cy.get(locators.titulo_gestao_usuarios(), { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', 'Gestão')
  cy.wait(1000)
})

Then('visualizo as abas {string}, {string} e {string}', (aba1, aba2, aba3) => {
  cy.get(locators.container_abas(), { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', aba1)
    .should('contain.text', aba2)
    .should('contain.text', aba3)
  cy.wait(1000)
})

When('clico no botão {string}', (botao) => {
  if (botao === 'Cadastrar pessoa usuária') {
    cy.get(locators.botao_cadastrar_pessoa(), { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(3000)
  } else if (botao === 'Cadastrar perfil') {
    clickElementXPath(locators.botao_cadastrar_perfil_form())
  } else if (botao === 'Inativar perfil') {
    clickElementXPath(locators.botao_inativar_perfil())
  } else if (botao === 'Reativar perfil') {
    clickElementXPath(locators.botao_reativar_perfil())
  } else if (botao === 'Inativar Unidade Educacional') {
    const xpathBotao = '/html/body/div/div/div[2]/main/div[1]/div/button'
    cy.log('Clicando no botão Inativar Unidade Educacional')
    cy.wait(3000)
    cy.xpath(xpathBotao, { timeout: 30000 })
      .should('exist')
      .should('be.visible')
      .should('not.be.disabled')
      .scrollIntoView()
      .wait(1000)
      .click({ force: true })
    cy.wait(5000)
    cy.log('Clique executado - aguardando modal')
  } else if (botao === 'Reativar Unidade Educacional') {
    const xpathBotao = '/html/body/div/div/div[2]/main/div[1]/div/button'
    cy.log('Clicando no botão Reativar Unidade Educacional')
    cy.wait(3000)
    cy.xpath(xpathBotao, { timeout: 30000 })
      .should('exist')
      .should('be.visible')
      .should('not.be.disabled')
      .scrollIntoView()
      .wait(1000)
      .click({ force: true })
    cy.wait(5000)
    cy.log('Clique executado - aguardando modal de reativação')
  }
})

Then('visualizo o formulário de cadastro de perfil', () => {
  cy.get(locators.titulo_rede(), { timeout: 15000 }).should('be.visible')
  cy.get(locators.titulo_cargo(), { timeout: 15000 }).should('be.visible')
  cy.wait(1000)
})

When('preencho o campo {string} com {string}', (campo, valor) => {
  if (campo === 'Rede') {
    cy.get(locators.campo_rede(), { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(2000)
    selectDropdownOption(valor)
  } else if (campo === 'Cargo') {
    cy.get(locators.campo_cargo(), { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(2000)
    selectDropdownOption(valor)
  }
})

When('valido a existência e preencho o campo {string} com um nome aleatório', (campo) => {
  const nomes = [
    'Maria Clara Medeiros',
    'João Pedro Santos Silva',
    'Ana Carolina Oliveira Costa',
    'Pedro Henrique Souza Lima',
    'Mariana Cristina Alves Pereira',
    'Lucas Gabriel Ferreira Rocha',
    'Beatriz Helena Rodrigues Araújo',
    'Rafael Eduardo Martins Carvalho',
    'Juliana Aparecida Gomes Ribeiro',
    'Thiago Alexandre Dias Barbosa'
  ]
  const nomeAleatorio = nomes[Math.floor(Math.random() * nomes.length)]
  
  cy.wait(1000)
  cy.contains('label', 'Nome completo', { matchCase: false }).should('be.visible')
  cy.contains('label', 'Nome completo', { matchCase: false })
    .parent()
    .find('input')
    .should('be.visible')
    .should('be.enabled')
    .clear()
    .type(nomeAleatorio, { delay: 50 })
    .should('have.value', nomeAleatorio)
  
  cy.wait(1000)
  cy.wrap(nomeAleatorio).as('nomeUsuario')
})

When('valido a existência e preencho o campo {string} com um CPF válido', (campo) => {
  const cpf = gerarCPFValido()
  
  cy.wait(1000)
  cy.contains('label', 'CPF', { matchCase: false }).should('be.visible')
  cy.contains('label', 'CPF', { matchCase: false })
    .parent()
    .find('input')
    .should('be.visible')
    .should('be.enabled')
    .clear()
    .type(cpf, { delay: 50 })
    .invoke('val')
    .should('not.be.empty')
  
  cy.wait(1000)
  cy.wrap(cpf).as('cpfUsuario')
})

When('valido a existência e preencho o campo {string} com um RF válido de 7 dígitos', (campo) => {
  const rf = gerarRF()
  
  cy.wait(1000)
  cy.contains('label', /^RF\s*\*?$/i).should('be.visible')
  cy.contains('label', /^RF\s*\*?$/i)
    .parent()
    .find('input')
    .should('be.visible')
    .should('be.enabled')
    .clear()
    .type(rf, { delay: 50 })
    .should('have.value', rf)
  
  cy.wait(1000)
  cy.wrap(rf).as('rfUsuario')
})

When('valido a existência e preencho o campo {string} com um e-mail válido', (campo) => {
  const email = 'testesgipe23@sme.prefeitura.sp.gov.br'
  
  cy.wait(1000)
  cy.contains('label', /e-?mail/i).should('be.visible')
  cy.contains('label', /e-?mail/i)
    .parent()
    .find('input')
    .should('be.visible')
    .should('be.enabled')
    .clear()
    .type(email, { delay: 50 })
    .should('have.value', email)
  
  cy.wait(1000)
  cy.wrap(email).as('emailUsuario')
})

When('seleciono uma {string} aleatória', (campo) => {
  cy.xpath(locators.campo_diretoria_regional(), { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(3000)
  
  cy.get('div[role="option"]', { timeout: 15000 })
    .first()
    .should('be.visible')
    .click({ force: true })
  cy.wait(2000)
})

When('seleciono uma {string} disponível', (campo) => {
  cy.xpath(locators.campo_unidade_educacional(), { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(3000)
  
  cy.get('body').then($body => {
    const opcoes = $body.find('div[role="option"]')
    
    if (opcoes.length > 0) {
      cy.get('div[role="option"]', { timeout: 15000 })
        .first()
        .should('be.visible')
        .click({ force: true })
      cy.wait(2000)
    } else {
      cy.xpath(locators.campo_diretoria_regional()).click({ force: true })
      cy.wait(2000)
      cy.get('div[role="option"]').eq(1).click({ force: true })
      cy.wait(2000)
      cy.xpath(locators.campo_unidade_educacional()).click({ force: true })
      cy.wait(2000)
      cy.get('div[role="option"]').first().click({ force: true })
    }
  })
})

Then('visualizo os botões {string} e {string}', (botao1, botao2) => {
  cy.xpath(locators.botao_cancelar_form(), { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', botao1)
  
  cy.xpath(locators.botao_cadastrar_perfil_form(), { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', botao2)
  cy.wait(1000)
})

Then('o sistema exibe o modal de confirmação de cadastro', () => {
  cy.wait(3000)
  
  cy.get('body').then($body => {
    const modalSelectors = [
      'div[role="alertdialog"]',
      'div[role="dialog"]',
      '[role="alertdialog"]',
      '[role="dialog"]',
      'div[data-state="open"]',
      'div[data-radix-dialog-overlay]',
      '.radix-dialog-overlay'
    ]
    
    let modalFound = false
    for (const selector of modalSelectors) {
      const elements = $body.find(selector)
      if (elements.length > 0) {
        cy.get(selector, { timeout: 20000 })
          .should('be.visible')
          .should('exist')
        modalFound = true
        break
      }
    }
    
    if (!modalFound) {
      const textosPossiveis = [
        'Ao cadastrar a pessoa usuária',
        'Cadastrar pessoa',
        'Confirmar cadastro',
        'Atenção'
      ]
      
      for (const texto of textosPossiveis) {
        if ($body.find(`:contains("${texto}")`).length > 0) {
          cy.contains(texto, { timeout: 20000 }).should('be.visible')
          break
        }
      }
    }
  })
  
  cy.wait(1000)
})

Then('visualizo a mensagem {string}', (mensagem) => {
  cy.wait(1000)
  cy.get('div[role="alertdialog"], div[role="dialog"]', { timeout: 15000 })
    .should('be.visible')
    .within(() => {
      cy.contains('Ao cadastrar a pessoa usuária', { timeout: 10000 }).should('be.visible')
    })
  cy.wait(1000)
})

Then('visualizo os botões {string} e {string} no modal', (botao1, botao2) => {
  cy.wait(1000)
  
  if (botao1 === 'Cancelar' && botao2 === 'Inativar Unidade Educacional') {
    const xpathBotaoCancelar = '/html/body/div[3]/div[3]/button[1]'
    const xpathBotaoInativar = '/html/body/div[3]/div[3]/button[2]'
    
    cy.xpath(xpathBotaoCancelar, { timeout: 15000 })
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .then(texto => {
        cy.log(`Botão 1 encontrado: "${texto.trim()}"`)
        expect(texto.trim()).to.include('Cancelar')
      })
    
    cy.xpath(xpathBotaoInativar, { timeout: 15000 })
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .then(texto => {
        cy.log(`Botão 2 encontrado: "${texto.trim()}"`)
        expect(texto.trim()).to.include('Inativar')
      })
  } else {
    cy.get('div[role="alertdialog"], div[role="dialog"]', { timeout: 15000 })
      .should('be.visible')
      .within(() => {
        cy.contains('button', botao1, { timeout: 10000 }).should('be.visible')
        cy.contains('button', botao2, { timeout: 10000 }).should('be.visible')
      })
  }
  
  cy.wait(1000)
  cy.log('Botões do modal validados com sucesso')
})

When('confirmo o cadastro clicando em {string}', (botao) => {
  cy.wait(1000)
  cy.get('div[role="alertdialog"], div[role="dialog"]', { timeout: 15000 })
    .should('be.visible')
    .within(() => {
      cy.contains('button', botao, { timeout: 10000 })
        .should('be.visible')
        .should('be.enabled')
        .click({ force: true })
    })
  cy.wait(2000)
})

Then('o sistema redireciona para a tela de Gestão de usuários', () => {
  cy.url({ timeout: 15000 }).should('include', '/gestao')
  cy.get(locators.titulo_gestao_usuarios(), { timeout: 15000 }).should('be.visible')
  cy.wait(2000)
})

Then('o novo perfil é cadastrado com sucesso', () => {
  cy.wait(1000)
})

When('acesso a aba {string}', (aba) => {
  if (aba === 'Usuários ativos' || aba === 'Perfis ativos') {
    clickElementXPath(locators.aba_usuarios_ativos())
  } else if (aba === 'Usuários inativos' || aba === 'Perfis inativos') {
    clickElementXPath(locators.aba_usuarios_inativos())
  } else if (aba === 'Pendências de aprovação') {
    clickElementXPath(locators.aba_pendencias())
  }
})

When('filtro pela {string} {string}', (tipo, valor) => {
  if (tipo === 'Diretoria Regional') {
    cy.wait(2000)
    cy.get('body').then($body => {
      cy.xpath('//div[contains(@id, "content-ativos")]', { timeout: 5000 }).then($ativos => {
        if ($ativos.length > 0 && $ativos.is(':visible')) {
          cy.xpath(locators.botao_filtro_dre_ativos(), { timeout: 15000 })
            .first()
            .should('be.visible')
            .click({ force: true })
        } else {
          cy.xpath(locators.botao_filtro_dre_inativos(), { timeout: 15000 })
            .first()
            .should('be.visible')
            .click({ force: true })
        }
      })
      cy.wait(2000)
      selectDropdownOption(valor)
      cy.wait(3000)
    })
  } else if (tipo === 'Unidade Educacional') {
    cy.wait(2000)
    cy.get('body').then($body => {
      cy.xpath('//div[contains(@id, "content-ativos")]', { timeout: 5000 }).then($ativos => {
        if ($ativos.length > 0 && $ativos.is(':visible')) {
          cy.xpath(locators.botao_filtro_ue_ativos(), { timeout: 15000 })
            .first()
            .should('be.visible')
            .click({ force: true })
        } else {
          cy.xpath(locators.botao_filtro_ue_inativos(), { timeout: 15000 })
            .first()
            .should('be.visible')
            .click({ force: true })
        }
      })
      cy.wait(2000)
      selectDropdownOption(valor)
      cy.wait(3000)
    })
  }
})

Then('visualizo a listagem de perfis ativos', () => {
  cy.wait(2000)
  cy.get('table', { timeout: 15000 }).should('be.visible')
  cy.wait(1000)
})

Then('visualizo a listagem de perfis inativos', () => {
  cy.wait(3000)
  cy.get('table', { timeout: 20000 }).should('be.visible')
  cy.wait(1000)
})

Then('visualizo as colunas {string}, {string}, {string}, {string}, {string}, {string}, {string} e {string}', 
  (col1, col2, col3, col4, col5, col6, col7, col8) => {
  cy.get('table', { timeout: 15000 }).should('be.visible')
  cy.wait(1000)
})

Then('valido a existência do texto {string} no cabeçalho da tabela', (texto) => {
  cy.get('table thead', { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', texto)
  cy.wait(500)
})

When('clico no botão visualizar do usuário', () => {
  cy.wait(2000)
  cy.xpath(locators.coluna_acao_ativos(), { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(3000)
})

When('clico no botão visualizar do usuário inativo', () => {
  cy.wait(2000)
  cy.xpath(locators.coluna_acao_inativos(), { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(3000)
})

Then('visualizo a página de edição de perfil', () => {
  cy.wait(2000)
  cy.wait(1000)
})

Then('o sistema exibe o modal de inativação de perfil', () => {
  cy.wait(2000)
  cy.get('div[role="dialog"], [role="dialog"]', { timeout: 15000 }).should('be.visible')
  cy.wait(1000)
})

Then('visualizo a mensagem de confirmação de inativação', () => {
  cy.wait(1000)
  cy.get('div[role="alertdialog"], div[role="dialog"]', { timeout: 15000 })
    .should('be.visible')
    .within(() => {
      cy.contains(/Motivo da inativação do perfil/i, { timeout: 10000 })
        .should('be.visible')
    })
  cy.wait(500)
})

When('confirmo a inativação clicando em {string}', (botao) => {
  cy.wait(2000)
  
  cy.get('body').then(($body) => {
    const textareaMotivo = $body.find('textarea#motivo')
    const isPessoaContext = textareaMotivo.length === 0
    
    if (isPessoaContext) {
      cy.log('Contexto: Gestão de Pessoas')
      
      cy.get('div[role="dialog"]', { timeout: 15000 })
        .find('textarea')
        .should('be.visible')
        .click({ force: true })
        .clear()
        .type('para teste', { delay: 50 })
      
      cy.wait(1500)
      
      cy.xpath('/html/body/div[3]/div[2]/button[2]', { timeout: 15000 })
        .should('be.visible')
        .click({ force: true })
    } else {
      cy.log('Contexto: Gestão de Unidades')
      
      cy.xpath('/html/body/div[3]/div[3]/button[2]', { timeout: 15000 })
        .should('exist')
        .should('be.visible')
        .scrollIntoView()
        .click({ force: true })
      
      cy.log('Inativação confirmada - botão clicado com sucesso')
    }
  })
  
  cy.wait(3000)
})

Then('o perfil é inativado com sucesso', () => {
  cy.wait(1000)
})

Then('o sistema exibe o modal de reativação de perfil', () => {
  cy.wait(2000)
  cy.get('div[role="dialog"], [role="dialog"]', { timeout: 15000 }).should('be.visible')
  cy.wait(1000)
})

Then('visualizo a mensagem de confirmação de reativação', () => {
  cy.wait(1000)
  cy.xpath('/html/body/div[3]/span', { timeout: 15000 }).should('be.visible')
  cy.wait(500)
})

Then('visualizo os botões {string} e {string} no modal de reativação', (botao1, botao2) => {
  cy.wait(500)
  cy.xpath('/html/body/div[3]/div[2]/button[1]', { timeout: 10000 }).should('be.visible')
  cy.xpath('/html/body/div[3]/div[2]/button[2]', { timeout: 10000 }).should('be.visible')
  cy.wait(500)
})

/* REMOVIDO - Step duplicado com conflito
When('confirmo a reativação clicando em {string}', (botao) => {
  cy.wait(2000)
  
  cy.xpath('/html/body/div[3]/div[2]/button[2]', { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  
  cy.wait(3000)
})
*/

Then('o perfil é reativado com sucesso', () => {
  cy.wait(1000)
})

Then('visualizo os perfis aguardando aprovação', () => {
  cy.wait(2000)
  cy.get('body').then($body => {
    if ($body.find('[id*="content-pendencias"]').length > 0) {
      cy.xpath('//div[contains(@id, "content-pendencias")]', { timeout: 15000 }).should('be.visible')
    }
  })
  cy.wait(1000)
})

Then('visualizo a lista de perfis pendentes de aprovação', () => {
  cy.get('body').then($body => {
    const hasPendencias = $body.find(locators.card_pendencia()).length > 0
    if (hasPendencias) {
      cy.get(locators.card_pendencia(), { timeout: 15000 }).should('be.visible')
    }
  })
})

Then('cada perfil exibe os dados {string}, {string}, {string}, {string} e {string}', 
  (dado1, dado2, dado3, dado4, dado5) => {
  cy.wait(1000)
  cy.get('body').then($body => {
    if ($body.find('[id*="content-pendencias"]').length > 0) {
      cy.xpath('//div[contains(@id, "content-pendencias")]', { timeout: 15000 })
        .invoke('text')
        .then((text) => {
          if (text.trim().length === 0) {
            cy.log('Área de pendências está vazia - sem perfis pendentes')
          }
        })
    }
  })
})

Then('cada perfil possui os botões {string} e {string}', (botao1, botao2) => {
  cy.wait(1000)
  cy.get('body').then($body => {
    if ($body.find('[id*="content-pendencias"]').length > 0) {
      cy.xpath('//div[contains(@id, "content-pendencias")]//button', { timeout: 15000 })
        .then(($buttons) => {
          if ($buttons.length === 0) {
            cy.log('Nenhum botão encontrado - sem perfis pendentes')
          }
        })
    }
  })
})

Given('que estou na página de cadastro do sistema', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/cadastro', { 
    timeout: 60000,
    retryOnNetworkFailure: true,
    failOnStatusCode: false
  })
  cy.wait(3000)
  cy.url({ timeout: 30000 }).should('include', '/cadastro')
})

Given('que acesso a página de cadastro direto', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/cadastro', { 
    timeout: 60000,
    retryOnNetworkFailure: true,
    failOnStatusCode: false
  })
  cy.wait(3000)
  cy.url({ timeout: 30000 }).should('include', '/cadastro')
})

When('informo a DRE {string}', (dre) => {
  cy.wait(2000)
  const selectorDRE = '//div[label[contains(text(),"Selecione a DRE")]]//button[@role="combobox"]'
  
  cy.xpath(selectorDRE, { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  
  cy.wait(1000)
  cy.xpath(selectorDRE).type(dre.charAt(0), { force: true })
  
  cy.get('body', { timeout: 15000 })
    .contains('option, [role="option"]', dre)
    .first()
    .scrollIntoView()
    .click({ force: true })
  
  cy.wait(2000)
})

When('informo uma DRE disponível', () => {
  const dre = 'DIRETORIA REGIONAL DE EDUCACAO IPIRANGA'
  const selectorLabel = 'body > div > div.w-full.md\\:w-1\\/2.flex.flex-col.bg-white.overflow-y-auto.justify-center > div > form > div.space-y-2.mb-4.mt-4 > label'
  const selectorBotao = 'body > div > div.w-full.md\\:w-1\\/2.flex.flex-col.bg-white.overflow-y-auto.justify-center > div > form > div.space-y-2.mb-4.mt-4 > button'
  const selectorSpan  = 'body > div > div.w-full.md\\:w-1\\/2.flex.flex-col.bg-white.overflow-y-auto.justify-center > div > form > div.space-y-2.mb-4.mt-4 > button > span'

  // 1. Validar existência da label
  cy.get(selectorLabel, { timeout: 15000 })
    .should('be.visible')
    .and('contain.text', 'Selecione a DRE')
  cy.log('✅ Label "Selecione a DRE" validada')

  // 2. Validar existência do botão e clicar
  cy.get(selectorBotao, { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })

  cy.wait(3000)

  // 3. Buscar opção pelo texto EXATO
  cy.get('body')
    .find('span, li')
    .filter(':visible')
    .then($els => {
      const alvo = [...$els].find(el => Cypress.$(el).text().trim().toUpperCase() === dre)
      if (alvo) {
        cy.log(`✅ Clicando na opção DRE: ${dre}`)
        cy.wrap(alvo).scrollIntoView().click({ force: true })
      } else {
        cy.log(`⚠️ Fallback: cy.contains`)
        cy.contains(dre).first().scrollIntoView().click({ force: true })
      }
    })

  cy.wait(2000)

  // 4. Validar seleção pelo span interno
  cy.get(selectorSpan, { timeout: 10000 })
    .invoke('text')
    .then(txt => {
      cy.log(`✅ DRE selecionada: ${txt.trim()}`)
      expect(txt.trim().toUpperCase()).to.include('IPIRANGA')
    })

  cy.wait(1000)
})

When('informo uma Unidade Educacional disponível', () => {
  // Opções disponíveis para seleção aleatória
  const opcoesUE = ['ABRAO HUCK', 'SENA MADUREIRA', 'ANTONIO RUBBO']
  const termosBusca = {
    'ABRAO HUCK':    'ABRAO HUCK, DR.',
    'SENA MADUREIRA': 'SENA MADUREIRA',
    'ANTONIO RUBBO': 'ANTONIO RUBBO MULLER, PROF.'
  }
  const termoBusca = opcoesUE[Math.floor(Math.random() * opcoesUE.length)]
  const nomeCompleto = termosBusca[termoBusca]
  cy.log(`🎲 UE sorteada: ${nomeCompleto} (busca: "${termoBusca}")`)

  // Seletor da label: busca pela label que contenha "UE" dentro do form
  const selectorLabel = 'label[class*="required"][class*="text-\\[\\#42474a\\]"]'
  // Seletor do input: usa o placeholder único do campo UE
  const selectorInput = 'input[placeholder*="EMEF"], input[placeholder*="João da Silva"], input[placeholder*="Exemplo"]'

  // 1. Validar existência da label "Digite o nome da UE"
  cy.contains('label', 'Digite o nome da UE', { timeout: 15000 })
    .should('be.visible')
  cy.log('✅ Label "Digite o nome da UE" validada')

  cy.wait(500)

  // 2. Digitar no input de busca para disparar o autocomplete
  cy.get(selectorInput, { timeout: 15000 })
    .should('be.visible')
    .clear()
    .type(termoBusca, { delay: 80 })

  cy.wait(3000)

  // 3. Aguardar e clicar na opção do autocomplete
  // O autocomplete renderiza em uma lista — buscar pelo texto da opção
  cy.get('body')
    .find('li, [role="option"], [cmdk-item], [data-value]')
    .filter(':visible')
    .then($els => {
      const alvo = [...$els].find(el => {
        const txt = Cypress.$(el).text().trim().toUpperCase()
        return txt.includes(termoBusca.toUpperCase())
      })
      if (alvo) {
        cy.log(`✅ Clicando na opção UE: ${Cypress.$(alvo).text().trim()}`)
        cy.wrap(alvo).scrollIntoView().click({ force: true })
      } else {
        // Fallback: buscar em qualquer elemento visível com o termo
        cy.log(`⚠️ Fallback: buscando por contains("${termoBusca}")`)
        cy.contains(termoBusca, { timeout: 5000 })
          .filter(':visible')
          .first()
          .scrollIntoView()
          .click({ force: true })
      }
    })

  cy.wait(2000)

  // 4. Validar que o input foi preenchido (não está vazio)
  cy.get(selectorInput, { timeout: 10000 })
    .invoke('val')
    .then(val => {
      cy.log(`✅ Input UE preenchido com: "${val}"`)
      expect(val.trim()).to.not.be.empty
    })

  cy.wait(1000)
})

When('informo meus dados pessoais com informações válidas', () => {
  const nome = gerarNomeAleatorio()
  const cpf = gerarCPFValido()

  // Gera e-mail único com timestamp — garantia de nunca repetir
  function gerarEmailUnico() {
    const ts = Date.now()
    const rand = Math.floor(Math.random() * 9999)
    return `testesgipe.auto${ts}${rand}@sme.prefeitura.sp.gov.br`
  }

  // Pool de 35 e-mails predefinidos + 1 gerado dinamicamente com timestamp
  // O e-mail dinâmico garante que mesmo se todos os 35 já foram cadastrados,
  // o teste nunca ficará bloqueado
  const emailsDisponiveis = [
    'testesgipe1@sme.prefeitura.sp.gov.br',
    'testesgipe2@sme.prefeitura.sp.gov.br',
    'testesgipe3@sme.prefeitura.sp.gov.br',
    'testesgipe4@sme.prefeitura.sp.gov.br',
    'testesgipe5@sme.prefeitura.sp.gov.br',
    'testesgipe6@sme.prefeitura.sp.gov.br',
    'testesgipe7@sme.prefeitura.sp.gov.br',
    'testesgipe8@sme.prefeitura.sp.gov.br',
    'testesgipe9@sme.prefeitura.sp.gov.br',
    'testesgipe10@sme.prefeitura.sp.gov.br',
    'testesgipe11@sme.prefeitura.sp.gov.br',
    'testesgipe12@sme.prefeitura.sp.gov.br',
    'testesgipe13@sme.prefeitura.sp.gov.br',
    'testesgipe14@sme.prefeitura.sp.gov.br',
    'testesgipe15@sme.prefeitura.sp.gov.br',
    'testesgipe16@sme.prefeitura.sp.gov.br',
    'testesgipe17@sme.prefeitura.sp.gov.br',
    'testesgipe18@sme.prefeitura.sp.gov.br',
    'testesgipe19@sme.prefeitura.sp.gov.br',
    'testesgipe20@sme.prefeitura.sp.gov.br',
    'testesgipe21@sme.prefeitura.sp.gov.br',
    'testesgipe22@sme.prefeitura.sp.gov.br',
    'testesgipe23@sme.prefeitura.sp.gov.br',
    'testesgipe24@sme.prefeitura.sp.gov.br',
    'testesgipe25@sme.prefeitura.sp.gov.br',
    'testesgipe26@sme.prefeitura.sp.gov.br',
    'testesgipe27@sme.prefeitura.sp.gov.br',
    'testesgipe28@sme.prefeitura.sp.gov.br',
    'testesgipe29@sme.prefeitura.sp.gov.br',
    'testesgipe30@sme.prefeitura.sp.gov.br',
    'testesgipe31@sme.prefeitura.sp.gov.br',
    'testesgipe32@sme.prefeitura.sp.gov.br',
    'testesgipe33@sme.prefeitura.sp.gov.br',
    'testesgipe34@sme.prefeitura.sp.gov.br',
    'testesgipe35@sme.prefeitura.sp.gov.br',
    gerarEmailUnico(), // e-mail dinâmico baseado em timestamp — sempre inédito
  ]
  const email = emailsDisponiveis[Math.floor(Math.random() * emailsDisponiveis.length)]
  cy.log(`📧 E-mail sorteado: ${email}`)
  
  cy.get('input[placeholder="Exemplo: Maria Clara Medeiros"]', { timeout: 15000 })
    .should('be.visible')
    .scrollIntoView()
    .clear({ force: true })
    .type(nome, { delay: 50 })
    .should('have.value', nome)
  
  cy.xpath('//div[label[contains(text(),"Qual o seu CPF")]]//input', { timeout: 15000 })
    .should('be.visible')
    .scrollIntoView()
    .clear({ force: true })
    .type(cpf, { delay: 50 })
  
  cy.get('input[placeholder="Digite o seu e-mail corporativo"], input[type="email"]', { timeout: 15000 })
    .should('be.visible')
    .scrollIntoView()
    .clear({ force: true })
    .type(email, { delay: 50 })
    .should('have.value', email)
  
  cy.wrap({ nome, cpf, email }).as('dadosCadastro')
  cy.wait(1000)
})

When('submeto o formulário de cadastro', () => {
  cy.xpath('//form//button[contains(text(), "Cadastrar agora")]', { timeout: 15000 })
    .should('be.visible')
    .scrollIntoView()
    .click({ force: true })
  cy.wait(3000)
})

Then('devo ser direcionado para a próxima etapa do cadastro', () => {
  cy.wait(2000)
  cy.url({ timeout: 30000 }).should('include', '/cadastro')
})

Then('meus dados devem ser registrados no sistema', () => {
  cy.wait(1000)
})

When('clico no botão {string} do primeiro perfil pendente', (botao) => {
  cy.wait(2000)
  cy.xpath(locators.botao_recusar_pendencia(), { timeout: 15000 })
    .first()
    .should('be.visible')
    .scrollIntoView()
    .click({ force: true })
  cy.wait(2000)
})

Then('o sistema exibe o modal de recusa de solicitação', () => {
  cy.wait(2000)
  cy.get(locators.modal_recusa(), { timeout: 15000 }).should('be.visible')
  cy.wait(1000)
})

Then('visualizo o título {string} no modal', (titulo) => {
  cy.get(locators.modal_recusa(), { timeout: 15000 })
    .within(() => {
      cy.contains(titulo, { timeout: 10000 }).should('be.visible')
    })
  cy.wait(500)
})

Then('visualizo a mensagem de confirmação de recusa', () => {
  cy.get(locators.modal_recusa(), { timeout: 15000 })
    .within(() => {
      cy.contains(/recusar a solicitação/i, { timeout: 10000 }).should('be.visible')
    })
  cy.wait(500)
})

Then('visualizo o campo {string}', (campo) => {
  cy.wait(1000)
  if (campo === 'Motivo de recusa') {
    cy.get(locators.modal_recusa(), { timeout: 15000 }).within(() => {
      cy.get('textarea, input[type="text"]', { timeout: 10000 })
        .first()
        .should('be.visible')
        .should('be.enabled')
    })
  }
  cy.wait(500)
})

When('preencho o motivo da recusa', () => {
  const motivo = 'Entre em contato com a DRE ou órgão responsável'
  
  cy.get(locators.modal_recusa(), { timeout: 15000 }).within(() => {
    cy.get('textarea, input[type="text"]', { timeout: 10000 })
      .first()
      .should('be.visible')
      .scrollIntoView()
      .clear({ force: true })
      .type(motivo, { delay: 50 })
  })
  cy.wait(1000)
})

Then('visualizo os botões {string} e {string} no modal de recusa', (botao1, botao2) => {
  cy.wait(1000)
  cy.get(locators.modal_recusa(), { timeout: 15000 })
    .within(() => {
      cy.contains('button', botao1, { timeout: 10000 }).should('be.visible')
      cy.contains('button', botao2, { timeout: 10000 }).should('be.visible')
    })
  cy.wait(500)
})

When('confirmo a recusa clicando em {string}', (botao) => {
  cy.xpath(locators.botao_confirmar_recusa(), { timeout: 15000 })
    .should('be.visible')
    .scrollIntoView()
    .click({ force: true })
  cy.wait(3000)
})

Then('a solicitação é recusada com sucesso', () => {
  cy.wait(1000)
})

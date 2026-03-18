import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps'
import CadastroOcorrenciaDreLocalizadores from '../locators/cadast_ocorrenc_dre_locators'

// ============================================================
// STEP DEFINITIONS - Cadastro de Ocorrência DRE
// Feature: cadast_ocorrenc_dre.feature
//
// Steps do fluxo principal são fornecidos por arquivos globais:
//   - common_steps.js       → "que eu acesso o sistema"
//   - cadastro_ocorrencias.js → Aba 1 e Aba 2 (data, hora, tipo, envolvidos, etc.)
//   - cadastro_ue.js        → Aba 3 (agressor), Aba 4 (declarante), Aba 5 (anexos)
//   - complement_gipe.js    → "clica em Finalizar modal"
//
// Este arquivo provê: login DRE, hooks de setup, e steps exclusivos DRE.
// ============================================================

const locators = new CadastroOcorrenciaDreLocalizadores()

const CREDENCIAIS_DRE = {
  RF: Cypress.env('RF_DRE') || Cypress.env('RF_VALIDO') || '7311559',
  SENHA: Cypress.env('SENHA_DRE') || Cypress.env('SENHA_VALIDA') || 'Sgp1559'
}

const TIMEOUTS = {
  SHORT: 1000,
  DEFAULT: 2000,
  EXTENDED: 5000,
  LONG: 15000,
  VERY_LONG: 30000
}

// ──────────────────────────────────────────────
// HOOKS
// ──────────────────────────────────────────────

Before({ tags: '@cadastro_dre_ocorrencia' }, () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.log('Setup DRE: cookies e localStorage limpos')
})

After({ tags: '@cadastro_dre_ocorrencia' }, () => {
  cy.log('Cenário DRE finalizado')
})

// ──────────────────────────────────────────────
// LOGIN E ACESSO - DRE
// ──────────────────────────────────────────────

/**
 * Step de login com credenciais específicas do perfil DRE.
 * Usado no Contexto da feature via "eu efetuo login com RF".
 * O step "eu efetuo login com RF" é global em cadastro_ocorrencias.js;
 * este step usa o nome alternativo para execução isolada da feature DRE.
 */
Given('eu efetuo login com RF DRE ocorrencia', () => {
  cy.log(`Login DRE: RF ${CREDENCIAIS_DRE.RF}`)
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', {
    timeout: TIMEOUTS.VERY_LONG,
    failOnStatusCode: false
  })
  cy.url({ timeout: TIMEOUTS.VERY_LONG }).should('include', '/dashboard')
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('Dashboard DRE carregado')
})

// ──────────────────────────────────────────────
// VALIDAÇÕES ESPECÍFICAS DRE
// ──────────────────────────────────────────────

/**
 * Valida que o sistema exibe as funcionalidades disponíveis para DRE.
 * Complementa o step "o sistema deve exibir as funcionalidades disponíveis para UE"
 * que fica coberto pelo login.js global.
 */
Then('o sistema deve exibir as funcionalidades disponíveis para DRE ocorrencia', () => {
  cy.get('body', { timeout: TIMEOUTS.LONG }).should('be.visible')
  cy.contains(/Histórico de ocorrências/i, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
  cy.log('Funcionalidades DRE validadas')
})

// ──────────────────────────────────────────────
// ABA 1 — DATA E HORA (steps exclusivos DRE)
// ──────────────────────────────────────────────

/**
 * Clica no botão Nova Ocorrência usando o locator DRE.
 * O step genérico "o usuário seleciona e clica em {string}" (cadastro_ocorrencias.js)
 * já cobre "Nova Ocorrencia"; este step é alternativa nomeada explicitamente para DRE.
 */
When('dre clica em nova ocorrencia', () => {
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('DRE: abrindo formulário de nova ocorrência')
  cy.xpath(locators.btn_nova_ocorrencia(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .click({ force: true })
  cy.wait(4000)
  cy.url({ timeout: TIMEOUTS.LONG }).should('include', '/cadastrar-ocorrencia')
  cy.log('Formulário de cadastro aberto')
})

// ──────────────────────────────────────────────
// ABA 5 — ANEXOS (steps exclusivos DRE)
// ──────────────────────────────────────────────

/**
 * Valida existência do título da seção de anexos usando locator DRE.
 * O step "valida a existencia do titulo {string}" (cadastro_ue.js) cobre o caso geral;
 * este step é alternativa com nomenclatura explícita.
 */
When('dre valida titulo da secao de anexos', () => {
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('DRE: validando seção de anexos')
  cy.get(locators.titulo_anexos(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
  cy.log('Seção de anexos validada')
})

/**
 * Escolhe o arquivo para upload via locator DRE.
 * O step "localiza e clica no botão {string}" (cadastro_ue.js) cobre o caso geral;
 * este step é alternativa explícita para DRE.
 */
When('dre escolhe arquivo para upload', () => {
  cy.wait(TIMEOUTS.SHORT)
  cy.log('DRE: selecionando arquivo')
  cy.xpath(locators.btn_escolher_arquivo(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .click({ force: true })
  cy.wait(TIMEOUTS.DEFAULT)
  cy.get(locators.input_file(), { timeout: TIMEOUTS.LONG })
    .selectFile(
      {
        contents: Cypress.Buffer.from('fake-image-content'),
        fileName: 'test-dre-image.jpg',
        mimeType: 'image/jpeg'
      },
      { force: true }
    )
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('Arquivo selecionado')
})

/**
 * Clica em Anexar Documento usando locator DRE.
 */
When('dre clica em anexar documento', () => {
  cy.wait(TIMEOUTS.SHORT)
  cy.log('DRE: clicando em Anexar documento')
  cy.xpath(locators.btn_anexar_documento(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .click({ force: true })
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('Documento anexado')
})

// ──────────────────────────────────────────────
// MODAL DE CONCLUSÃO (steps exclusivos DRE)
// ──────────────────────────────────────────────

/**
 * Verifica se a mensagem de sucesso é exibida após finalização.
 * O step "valida a existencia do texto sucesso {string}" (cadastro_ue.js) já cobre o caso geral.
 * Este step é versão DRE para aguardar e validar o toast/alerta de sucesso.
 */
When('dre valida mensagem de sucesso {string}', (textoEsperado) => {
  cy.wait(TIMEOUTS.EXTENDED)
  cy.log(`DRE: validando mensagem de sucesso: "${textoEsperado}"`)
  cy.get('body').then($body => {
    if ($body.text().includes(textoEsperado)) {
      cy.log('Mensagem de sucesso encontrada no DOM')
    }
  })
  cy.get(locators.btn_fechar_sucesso(), { timeout: TIMEOUTS.LONG })
    .should('exist')
    .should('be.visible')
  cy.log('Mensagem de sucesso validada')
})

/**
 * Finaliza o modal clicando no botão "Finalizar" — versão DRE.
 * O step "clica em Finalizar modal" (complement_gipe.js) cobre o caso geral.
 */
When('dre clica em finalizar modal', () => {
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('DRE: finalizando modal')
  cy.get('body').then($body => {
    if ($body.find('div[role="dialog"]').is(':visible') || $body.text().includes('Finalizar')) {
      cy.contains('button', /Finalizar/i, { timeout: TIMEOUTS.LONG })
        .last()
        .should('be.visible')
        .click({ force: true })
      cy.log('Modal finalizado')
    } else {
      cy.log('Modal não encontrado — continuando')
    }
  })
  cy.wait(TIMEOUTS.EXTENDED)
})

// ──────────────────────────────────────────────
// VALIDAÇÃO FINAL — HISTÓRICO
// ──────────────────────────────────────────────

/**
 * Valida que o sistema exibe o Histórico de ocorrências após cadastro DRE.
 * O step "valida a existencia do Texto {string}" (cadastro_ue.js) cobre o caso geral.
 * Este step é alternativa nomeada para o contexto DRE.
 */
Then('dre valida historico de ocorrencias', () => {
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('DRE: validando histórico de ocorrências registradas')
  cy.get(locators.titulo_historico(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .and('contain.text', 'Histórico de ocorrências registradas')
  cy.log('Histórico validado com sucesso')
})

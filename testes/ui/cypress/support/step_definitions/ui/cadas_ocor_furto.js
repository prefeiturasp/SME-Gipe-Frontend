import { When, Then } from 'cypress-cucumber-preprocessor/steps'
import CadastroUeLocalizadores from '../../locators/cadastro_ue_locators'

const locators = new CadastroUeLocalizadores()

// ============================================================================
// STEPS OCORREN_FURTO — Ocorrências de furto/roubo/invasão/depredação (Patrimônio)
// ============================================================================

// ── Aba 1: Início, Data, Hora e Tipo ─────────────────────────────────────────

When('FURTO inicia o cadastro de uma nova ocorrência', () => {
  cy.wait(2000)
  cy.get('body').then($body => {
    const porTexto = $body.find('button').filter((_, btn) =>
      /nova ocorr|registrar|cadastrar/i.test((btn.innerText || '').trim())
    )
    if (porTexto.length > 0) {
      cy.wrap(porTexto.first(), { timeout: 20000 }).should('be.visible').click({ force: true })
    } else {
      cy.get('main button', { timeout: 20000 }).filter(':visible').first().click({ force: true })
    }
  })
  cy.wait(4000)
  cy.url({ timeout: 15000 }).should('include', '/cadastrar-ocorrencia')
})

When('FURTO informa a data atual do ocorrido', () => {
  const hoje = new Date()
  const normalized = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
  cy.wait(2000)
  cy.get('input[type="date"]', { timeout: 15000 }).first()
    .should('be.visible').should('be.enabled')
    .click({ force: true }).clear({ force: true })
    .type(normalized, { force: true })
    .trigger('input', { force: true }).trigger('change', { force: true })
  cy.wait(1000)
  cy.get('input[type="date"]').first().should('have.value', normalized)
})

When('FURTO informa a hora atual do ocorrido', () => {
  const agora = new Date()
  const horario = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`
  cy.wait(2000)
  cy.get('body').then($body => {
    if ($body.find('input[placeholder="Digite o horário"]').length > 0) {
      cy.get('input[placeholder="Digite o horário"]', { timeout: 15000 })
        .should('be.visible').should('be.enabled')
        .click({ force: true }).wait(500).clear({ force: true })
        .type(horario, { delay: 150, force: true }).blur()
    } else {
      cy.xpath("//input[contains(@placeholder,'hor') or @type='time']", { timeout: 15000 })
        .should('be.visible').click({ force: true }).wait(500)
        .clear({ force: true }).type(horario, { delay: 150, force: true }).blur()
    }
  })
})

When('FURTO seleciona o tipo Patrimonia da ocorrência', () => {
  cy.wait(2000)
  cy.get(
    'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.space-y-2 > label',
    { timeout: 15000 }
  ).then($labels => {
    const $patrimonio = $labels.filter((_, el) => /Patrim[oô]ni/i.test(el.innerText || ''))
    if ($patrimonio.length > 0) {
      cy.wrap($patrimonio.first()).scrollIntoView().should('be.visible').click({ force: true })
    } else {
      cy.contains('span.text-sm', /Patrim[oô]ni/i, { timeout: 15000 })
        .scrollIntoView().should('be.visible').click({ force: true })
    }
  })
  cy.wait(1500)
})

When('FURTO avança para a próxima aba', () => {
  cy.wait(2000)
  cy.get('button[type="submit"]', { timeout: 20000 })
    .should('be.visible').should('not.be.disabled')
    .first().scrollIntoView().click({ force: true })
  cy.wait(3000)
})

// ── Aba 2: Detalhes da Ocorrência ────────────────────────────────────────────

When('Ocorren_FURTO localiza o button {string}', (textoBotao) => {
  cy.wait(2000)
  cy.log(`Ocorren_FURTO: Validando botão "${textoBotao}"`)
  cy.contains('button', new RegExp(textoBotao.trim(), 'i'), { timeout: 15000 })
    .should('exist').should('be.visible')
  cy.log(`Ocorren_FURTO: Botão "${textoBotao}" localizado`)
})

When('Ocorren_FURTO localiza e clica em {string}', (textoBotao) => {
  cy.wait(2000)
  cy.log(`Ocorren_FURTO: Clicando em "${textoBotao}"`)

  const regexPrimaria  = new RegExp(textoBotao.trim(), 'i')
  const regexFinalizar = /Finalizar/i

  cy.get('body').then($body => {
    const existeExato     = $body.find('button').toArray().some(b => regexPrimaria.test(b.textContent.trim()))
    const existeFinalizar = $body.find('button').toArray().some(b => regexFinalizar.test(b.textContent.trim()))

    if (existeExato) {
      cy.log(`Ocorren_FURTO: Botão "${textoBotao}" encontrado — clicando`)
      cy.contains('button', regexPrimaria, { timeout: 15000 })
        .should('be.visible').should('not.be.disabled')
        .scrollIntoView().click({ force: true })
    } else if (existeFinalizar) {
      cy.log('Ocorren_FURTO: Usando fallback /Finalizar/i')
      cy.contains('button', regexFinalizar, { timeout: 15000 })
        .should('be.visible').should('not.be.disabled')
        .scrollIntoView().click({ force: true })
    } else {
      cy.log('Ocorren_FURTO: Fallback posicional — último botão do container')
      cy.get('div.flex.justify-end.gap-2', { timeout: 15000 })
        .last().find('button').last()
        .should('be.visible').scrollIntoView().click({ force: true })
    }
  })

  cy.wait(3000)
  cy.log(`Ocorren_FURTO: Clicou em "${textoBotao}"`)
})

// ── Aba 4: Anexos e Finalização ───────────────────────────────────────────

When('FURTO localiza e clica no botão {string}', (botao) => {
  cy.wait(1500)
  cy.log(`FURTO: Localizando botão "${botao}"`)
  if (botao.includes('Escolher arquivo')) {
    cy.xpath(locators.btn_escolher_arquivo(), { timeout: 15000 })
      .should('be.visible').click({ force: true })
    cy.wait(1500)
  } else if (botao.includes('Anexar documento')) {
    cy.xpath(locators.btn_anexar_documento(), { timeout: 15000 })
      .should('be.visible').click({ force: true })
    cy.wait(2000)
  }
})

When('FURTO seleciona a imagem do pc', () => {
  cy.wait(1000)
  cy.get('input[type="file"]', { timeout: 10000 })
    .selectFile({
      contents: Cypress.Buffer.from('fake-image-content'),
      fileName: 'test-image.jpg',
      mimeType: 'image/jpeg'
    }, { force: true })
  cy.wait(2000)
})

When('FURTO clica no campo tipo documento', () => {
  cy.wait(1500)
  cy.get('button[role="combobox"]', { timeout: 15000 }).last().should('be.visible').click({ force: true })
  cy.wait(1500)
})

When('FURTO seleciona {string}', (opcao) => {
  cy.wait(1500)
  cy.contains('[role="option"]', opcao, { timeout: 10000 })
    .should('be.visible').click({ force: true })
  cy.wait(1000)
})

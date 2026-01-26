Cypress.Commands.add('cadastro_gipe', () => {
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/cadastro')
})

Cypress.Commands.add('navegarGestãoPessoas', () => {
  cy.xpath('/html/body/div/div/div[1]/div[2]/div/div[2]/div/div/ul/li[3]/div[1]', { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(2000)
  
  cy.get('#radix-\\:rf\\: > ul > li:nth-child(1) > a > div > span', { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(3000)
})

Cypress.Commands.add('gerarCPF', () => {
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
})

Cypress.Commands.add('gerarRF', () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString()
})

Cypress.Commands.add('gerarEmailTeste', () => {
  const timestamp = new Date().getTime()
  return `teste.gipe.${timestamp}@sme.prefeitura.sp.gov.br`
})

Cypress.Commands.add('selecionarOpcaoDropdown', (textoOpcao) => {
  cy.wait(2000)
  cy.get('body').then($body => {
    const selector = $body.find('div[role="option"]').length > 0 
      ? 'div[role="option"]' 
      : 'span, div'
    
    cy.contains(selector, textoOpcao, { timeout: 15000 })
      .first()
      .should('be.visible')
      .click({ force: true })
  })
  cy.wait(1500)
})
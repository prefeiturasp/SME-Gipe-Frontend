import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

let response

// ==================== STEPS DE CONSULTA ====================

When('eu consulto os tipos de envolvidos', () => {
  cy.api_get('/envolvidos/').then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'GET', message: `Envolvidos - Status: ${res.status}` })
  })
})

When('eu tento acessar os tipos de envolvidos sem token', () => {
  cy.request({
    method: 'GET',
    url: 'https://qa-gipe.sme.prefeitura.sp.gov.br/api-intercorrencias/v1/envolvidos/',
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
  })
})

// ==================== VALIDAÇÕES GERAIS ====================

Then('a resposta deve ser uma lista de envolvidos', () => {
  cy.get('@response').then((res) => {
    expect(res.body).to.be.an('array')
    expect(res.body.length).to.be.greaterThan(0)
    Cypress.log({ name: 'Validação', message: `✅ Lista com ${res.body.length} tipos de envolvidos` })
  })
})

Then('cada envolvido deve ter os campos obrigatórios:', (dataTable) => {
  cy.get('@response').then((res) => {
    const camposObrigatorios = dataTable.hashes().map(row => row.campo)
    
    res.body.forEach((envolvido) => {
      camposObrigatorios.forEach((campo) => {
        expect(envolvido).to.have.property(campo)
        expect(envolvido[campo]).to.not.be.null
        expect(envolvido[campo]).to.not.be.empty
      })
    })
    
    Cypress.log({ name: 'Validação', message: `✅ Todos os ${res.body.length} envolvidos têm campos obrigatórios` })
  })
})

Then('a lista deve conter pelo menos {int} tipos de envolvidos', (quantidadeMinima) => {
  cy.get('@response').then((res) => {
    expect(res.body).to.be.an('array')
    expect(res.body.length).to.be.at.least(quantidadeMinima)
    Cypress.log({ name: 'Validação', message: `✅ Lista tem ${res.body.length} envolvidos (mínimo: ${quantidadeMinima})` })
  })
})

// ==================== VALIDAÇÕES DE PERFIS ====================

Then('devem existir os seguintes perfis:', (dataTable) => {
  cy.get('@response').then((res) => {
    const perfisEsperados = dataTable.hashes().map(row => row.perfil_dos_envolvidos)
    
    perfisEsperados.forEach((perfilEsperado) => {
      const perfilEncontrado = res.body.find(
        (envolvido) => envolvido.perfil_dos_envolvidos === perfilEsperado
      )
      expect(perfilEncontrado).to.exist
      Cypress.log({ name: 'Perfil', message: `✅ "${perfilEsperado}" encontrado` })
    })
    
    Cypress.log({ name: 'Validação', message: `✅ Todos os ${perfisEsperados.length} perfis esperados existem` })
  })
})

Then('o perfil {string} deve ter o UUID {string}', (perfil, uuidEsperado) => {
  cy.get('@response').then((res) => {
    const envolvido = res.body.find((item) => item.perfil_dos_envolvidos === perfil)
    
    expect(envolvido).to.exist
    expect(envolvido.uuid).to.equal(uuidEsperado)
    Cypress.log({ name: 'Validação', message: `✅ Perfil "${perfil}" tem UUID correto` })
  })
})

// ==================== VALIDAÇÕES DE UUID ====================

Then('todos os UUIDs devem estar no formato válido', () => {
  cy.get('@response').then((res) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    
    res.body.forEach((envolvido) => {
      expect(envolvido.uuid).to.match(uuidRegex)
    })
    
    Cypress.log({ name: 'Validação', message: `✅ Todos os ${res.body.length} UUIDs estão válidos` })
  })
})

// ==================== VALIDAÇÕES DE DUPLICAÇÃO ====================

Then('não devem existir perfis duplicados', () => {
  cy.get('@response').then((res) => {
    const perfis = res.body.map((envolvido) => envolvido.perfil_dos_envolvidos)
    const perfisUnicos = [...new Set(perfis)]
    
    expect(perfis.length).to.equal(perfisUnicos.length)
    Cypress.log({ name: 'Validação', message: `✅ Nenhum perfil duplicado (${perfisUnicos.length} únicos)` })
  })
})

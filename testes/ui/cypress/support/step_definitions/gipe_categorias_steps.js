import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

let response

// ==================== STEPS DE CONSULTA ====================

When('eu consulto as categorias disponíveis do GIPE', () => {
  cy.api_get('/gipe/categorias-disponiveis/').then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'GET', message: `Categorias GIPE - Status: ${res.status}` })
  })
})

When('eu tento acessar as categorias do GIPE sem token', () => {
  cy.request({
    method: 'GET',
    url: 'https://qa-gipe.sme.prefeitura.sp.gov.br/api-intercorrencias/v1/gipe/categorias-disponiveis/',
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
  })
})

// ==================== VALIDAÇÕES GERAIS ====================

Then('a resposta deve conter todas as categorias do GIPE', () => {
  cy.get('@response').then((res) => {
    expect(res.body).to.be.an('object')
    expect(res.body).to.have.property('envolve_arma_ou_ataque')
    expect(res.body).to.have.property('ameaca_foi_realizada_de_qual_maneira')
    expect(res.body).to.have.property('motivo_ocorrencia')
    expect(res.body).to.have.property('ciclo_aprendizagem')
    Cypress.log({ name: 'Validação', message: ' Todas as categorias principais encontradas' })
  })
})

Then('a resposta deve ter a estrutura correta de categorias', () => {
  cy.get('@response').then((res) => {
    expect(res.body).to.be.an('object')
    const categorias = Object.keys(res.body)
    expect(categorias.length).to.be.greaterThan(0)
    Cypress.log({ name: 'Validação', message: ` Estrutura válida com ${categorias.length} categorias` })
  })
})

Then('cada categoria deve ter campos value e label', () => {
  cy.get('@response').then((res) => {
    Object.values(res.body).forEach((categoria) => {
      expect(categoria).to.be.an('array')
      if (categoria.length > 0) {
        categoria.forEach((opcao) => {
          expect(opcao).to.have.property('value')
          expect(opcao).to.have.property('label')
        })
      }
    })
    Cypress.log({ name: 'Validação', message: ' Todas as opções têm value e label' })
  })
})

// ==================== VALIDAÇÕES DE CATEGORIAS ESPECÍFICAS ====================

Then('a categoria {string} deve existir', (nomeCategoria) => {
  cy.get('@response').then((res) => {
    expect(res.body).to.have.property(nomeCategoria)
    expect(res.body[nomeCategoria]).to.be.an('array')
    Cypress.log({ name: 'Validação', message: ` Categoria "${nomeCategoria}" existe` })
  })
})

Then('a categoria {string} deve ter as opções:', (nomeCategoria, dataTable) => {
  cy.get('@response').then((res) => {
    const categoria = res.body[nomeCategoria]
    expect(categoria).to.be.an('array')
    
    const opcoesEsperadas = dataTable.hashes()
    expect(categoria.length).to.equal(opcoesEsperadas.length)
    
    opcoesEsperadas.forEach((opcaoEsperada) => {
      const opcaoEncontrada = categoria.find(
        (opcao) => opcao.value === opcaoEsperada.value && opcao.label === opcaoEsperada.label
      )
      expect(opcaoEncontrada).to.exist
    })
    
    Cypress.log({ name: 'Validação', message: ` Categoria "${nomeCategoria}" tem todas as opções esperadas` })
  })
})

Then('a categoria {string} deve conter pelo menos {int} opções', (nomeCategoria, quantidadeMinima) => {
  cy.get('@response').then((res) => {
    const categoria = res.body[nomeCategoria]
    expect(categoria).to.be.an('array')
    expect(categoria.length).to.be.at.least(quantidadeMinima)
    Cypress.log({ name: 'Validação', message: ` Categoria "${nomeCategoria}" tem ${categoria.length} opções (mínimo: ${quantidadeMinima})` })
  })
})

Then('a categoria {string} deve conter a opção {string} com label {string}', (nomeCategoria, value, label) => {
  cy.get('@response').then((res) => {
    const categoria = res.body[nomeCategoria]
    const opcaoEncontrada = categoria.find((opcao) => opcao.value === value)
    
    expect(opcaoEncontrada).to.exist
    expect(opcaoEncontrada.label).to.equal(label)
    Cypress.log({ name: 'Validação', message: ` Opção "${value}" encontrada com label "${label}"` })
  })
})

Then('devem existir as seguintes categorias:', (dataTable) => {
  cy.get('@response').then((res) => {
    const categoriasEsperadas = dataTable.hashes()
    
    categoriasEsperadas.forEach((item) => {
      expect(res.body).to.have.property(item.categoria)
      expect(res.body[item.categoria]).to.be.an('array')
    })
    
    Cypress.log({ name: 'Validação', message: ` Todas as ${categoriasEsperadas.length} categorias principais existem` })
  })
})

Then('o status da resposta deve ser 401 ou 403', () => {
  cy.get('@response').then((res) => {
    expect([401, 403]).to.include(res.status)
    Cypress.log({ name: 'Validação', message: ` Acesso negado - Status: ${res.status}` })
  })
})

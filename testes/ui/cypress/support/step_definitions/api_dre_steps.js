import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

let response

// ==================== STEPS DE CONSULTA ====================

When('eu consulto a lista de intercorrências da DRE', () => {
  cy.api_get('/dre/').then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'GET', message: `Lista DRE - Status: ${res.status}` })
  })
})

When('eu consulto a intercorrência DRE com UUID {string}', (uuid) => {
  cy.api_get(`/dre/${uuid}/`).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.wrap(uuid).as('uuidConsultado')
    Cypress.log({ name: 'GET', message: `DRE UUID: ${uuid} - Status: ${res.status}` })
  })
})

When('eu tento acessar as intercorrências DRE sem token', () => {
  cy.request({
    method: 'GET',
    url: 'https://qa-gipe.sme.prefeitura.sp.gov.br/api-intercorrencias/v1/dre/',
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
  })
})

// ==================== STEPS DE ATUALIZAÇÃO (PUT) ====================

Given('que existe a intercorrência DRE {string}', (uuid) => {
  cy.api_get(`/dre/${uuid}/`).then((res) => {
    expect(res.status).to.equal(200)
    cy.wrap(uuid).as('uuidAtual')
    Cypress.log({ name: 'Setup', message: ` Intercorrência DRE ${uuid} encontrada` })
  })
})

When('eu atualizo a intercorrência DRE com os dados:', (dataTable) => {
  cy.get('@uuidAtual').then((uuid) => {
    const dadosAtualizacao = {}
    dataTable.hashes().forEach((row) => {
      const valor = row.valor === 'true' ? true : row.valor === 'false' ? false : row.valor
      dadosAtualizacao[row.campo] = valor
    })

    cy.api_put(`/dre/${uuid}/`, dadosAtualizacao).then((res) => {
      response = res
      cy.wrap(response).as('response')
      Cypress.log({ name: 'PUT', message: `Atualização DRE - Status: ${res.status}` })
    })
  })
})

// ==================== VALIDAÇÕES GERAIS ====================

Then('a resposta deve ser uma lista de intercorrências', () => {
  cy.get('@response').then((res) => {
    expect(res.body).to.be.an('array')
    expect(res.body.length).to.be.greaterThan(0)
    Cypress.log({ name: 'Validação', message: ` Lista com ${res.body.length} intercorrências` })
  })
})

Then('cada intercorrência DRE deve ter os campos obrigatórios:', (dataTable) => {
  cy.get('@response').then((res) => {
    const camposObrigatorios = dataTable.hashes().map(row => row.campo)
    
    res.body.forEach((intercorrencia) => {
      camposObrigatorios.forEach((campo) => {
        expect(intercorrencia).to.have.property(campo)
      })
    })
    
    Cypress.log({ name: 'Validação', message: ` Todas as ${res.body.length} intercorrências têm campos obrigatórios` })
  })
})

// ==================== VALIDAÇÕES DE CAMPOS ESPECÍFICOS ====================

Then('a resposta deve conter o UUID {string}', (uuidEsperado) => {
  cy.get('@response').then((res) => {
    expect(res.body.uuid).to.equal(uuidEsperado)
    Cypress.log({ name: 'Validação', message: ` UUID correto: ${uuidEsperado}` })
  })
})

Then('a resposta deve ter unidade_codigo_eol {string}', (codigoEol) => {
  cy.get('@response').then((res) => {
    expect(res.body.unidade_codigo_eol).to.equal(codigoEol)
    Cypress.log({ name: 'Validação', message: ` Código EOL: ${codigoEol}` })
  })
})

Then('a resposta deve ter dre_codigo_eol {string}', (dreCodigoEol) => {
  cy.get('@response').then((res) => {
    expect(res.body.dre_codigo_eol).to.equal(dreCodigoEol)
    Cypress.log({ name: 'Validação', message: ` DRE Código EOL: ${dreCodigoEol}` })
  })
})

Then('o campo {string} deve ser {string}', (campo, valorEsperado) => {
  cy.get('@response').then((res) => {
    const valor = valorEsperado === 'true' ? true : valorEsperado === 'false' ? false : valorEsperado
    expect(res.body[campo]).to.equal(valor)
    Cypress.log({ name: 'Validação', message: ` Campo "${campo}" = ${valor}` })
  })
})

Then('o campo {string} deve ser true', (campo) => {
  cy.get('@response').then((res) => {
    expect(res.body[campo]).to.be.true
    Cypress.log({ name: 'Validação', message: ` Campo "${campo}" = true` })
  })
})

Then('o campo {string} deve conter {string}', (campo, textoEsperado) => {
  cy.get('@response').then((res) => {
    expect(res.body[campo]).to.include(textoEsperado)
    Cypress.log({ name: 'Validação', message: ` Campo "${campo}" contém "${textoEsperado}"` })
  })
})

Then('o campo {string} deve ser booleano', (campo) => {
  cy.get('@response').then((res) => {
    expect(res.body[campo]).to.be.a('boolean')
    Cypress.log({ name: 'Validação', message: ` Campo "${campo}" é booleano` })
  })
})

Then('o campo {string} deve existir', (campo) => {
  cy.get('@response').then((res) => {
    expect(res.body).to.have.property(campo)
    Cypress.log({ name: 'Validação', message: ` Campo "${campo}" existe` })
  })
})

// ==================== VALIDAÇÕES DE STATUS ====================

Then('devem existir intercorrências com os seguintes status:', (dataTable) => {
  cy.get('@response').then((res) => {
    const statusEsperados = dataTable.hashes().map(row => row.status)
    const statusEncontrados = [...new Set(res.body.map(item => item.status))]
    
    statusEsperados.forEach((statusEsperado) => {
      expect(statusEncontrados).to.include(statusEsperado)
      Cypress.log({ name: 'Status', message: ` Status "${statusEsperado}" encontrado` })
    })
    
    Cypress.log({ name: 'Validação', message: ` Todos os ${statusEsperados.length} status esperados existem` })
  })
})

Then('devem existir os seguintes status_extra:', (dataTable) => {
  cy.get('@response').then((res) => {
    const statusExtraEsperados = dataTable.hashes().map(row => row.status_extra)
    const statusExtraEncontrados = [...new Set(res.body.map(item => item.status_extra))]
    
    statusExtraEsperados.forEach((statusExtra) => {
      expect(statusExtraEncontrados).to.include(statusExtra)
      Cypress.log({ name: 'Status Extra', message: ` "${statusExtra}" encontrado` })
    })
  })
})

// ==================== VALIDAÇÕES DE CÓDIGOS ====================

Then('devem existir intercorrências dos códigos DRE:', (dataTable) => {
  cy.get('@response').then((res) => {
    const codigosEsperados = dataTable.hashes().map(row => row.dre_codigo_eol)
    const codigosEncontrados = [...new Set(res.body.map(item => item.dre_codigo_eol))]
    
    codigosEsperados.forEach((codigo) => {
      expect(codigosEncontrados).to.include(codigo)
      Cypress.log({ name: 'DRE', message: ` Código DRE "${codigo}" encontrado` })
    })
  })
})

Then('devem existir intercorrências das unidades:', (dataTable) => {
  cy.get('@response').then((res) => {
    const unidadesEsperadas = dataTable.hashes().map(row => row.unidade_codigo_eol)
    const unidadesEncontradas = [...new Set(res.body.map(item => item.unidade_codigo_eol))]
    
    unidadesEsperadas.forEach((unidade) => {
      expect(unidadesEncontradas).to.include(unidade)
      Cypress.log({ name: 'Unidade', message: ` Unidade EOL "${unidade}" encontrada` })
    })
  })
})

Then('a lista deve conter pelo menos {int} intercorrências', (quantidadeMinima) => {
  cy.get('@response').then((res) => {
    expect(res.body.length).to.be.at.least(quantidadeMinima)
    Cypress.log({ name: 'Validação', message: ` Lista tem ${res.body.length} intercorrências (mínimo: ${quantidadeMinima})` })
  })
})

Then('todos os IDs devem ser numéricos', () => {
  cy.get('@response').then((res) => {
    res.body.forEach((item) => {
      expect(item.id).to.be.a('number')
      expect(item.id).to.be.greaterThan(0)
    })
    Cypress.log({ name: 'Validação', message: ` Todos os ${res.body.length} IDs são numéricos` })
  })
})

Then('cada intercorrência deve ter campos booleanos válidos', () => {
  cy.get('@response').then((res) => {
    const camposBooleanos = [
      'acionamento_seguranca_publica',
      'interlocucao_sts',
      'interlocucao_cpca',
      'interlocucao_supervisao_escolar',
      'interlocucao_naapa'
    ]
    
    res.body.forEach((intercorrencia, index) => {
      camposBooleanos.forEach((campo) => {
        expect(intercorrencia[campo], `Campo ${campo} na intercorrência ${index}`).to.be.a('boolean')
      })
    })
    
    Cypress.log({ name: 'Validação', message: ` Todas as ${res.body.length} intercorrências têm campos booleanos válidos` })
  })
})

Then('cada intercorrência deve ter status_extra válido', () => {
  cy.get('@response').then((res) => {
    const statusValidos = ['Incompleta', 'Em andamento', 'Concluída', 'Finalizada', '']
    
    res.body.forEach((intercorrencia, index) => {
      expect(intercorrencia).to.have.property('status_extra')
      if (intercorrencia.status_extra) {
        expect(intercorrencia.status_extra, `Status_extra na intercorrência ${index}`).to.be.a('string')
      }
    })
    
    Cypress.log({ name: 'Validação', message: ` Todas as ${res.body.length} intercorrências têm status_extra válido` })
  })
})

Then('cada intercorrência deve ter campos info_complementar opcionais', () => {
  cy.get('@response').then((res) => {
    const camposInfoComplementar = [
      'info_complementar_sts',
      'info_complementar_cpca',
      'info_complementar_supervisao_escolar',
      'info_complementar_naapa'
    ]
    
    res.body.forEach((intercorrencia, index) => {
      camposInfoComplementar.forEach((campo) => {
        expect(intercorrencia, `Intercorrência ${index} deve ter ${campo}`).to.have.property(campo)
      })
    })
    
    Cypress.log({ name: 'Validação', message: ` Todas as ${res.body.length} intercorrências têm campos info_complementar` })
  })
})

// ==================== STEPS USADOS PELO FEATURE (sem dataTable) ====================

Then('a resposta deve conter os campos obrigatórios da DRE', () => {
  cy.get('@response').then((res) => {
    const camposObrigatorios = ['uuid', 'status', 'status_extra', 'unidade_codigo_eol', 'dre_codigo_eol']
    const body = Array.isArray(res.body) ? res.body : [res.body]
    body.forEach((intercorrencia, index) => {
      camposObrigatorios.forEach((campo) => {
        expect(intercorrencia, `Intercorrência ${index} deve ter "${campo}"`).to.have.property(campo)
      })
    })
    Cypress.log({ name: 'Validação', message: ` Campos obrigatórios da DRE verificados em ${body.length} registros` })
  })
})

Then('os campos booleanos devem retornar true ou false', () => {
  cy.get('@response').then((res) => {
    const camposBooleanos = [
      'acionamento_seguranca_publica',
      'interlocucao_sts',
      'interlocucao_cpca',
      'interlocucao_supervisao_escolar',
      'interlocucao_naapa'
    ]
    const body = Array.isArray(res.body) ? res.body : [res.body]
    body.forEach((intercorrencia, index) => {
      camposBooleanos.forEach((campo) => {
        if (Object.prototype.hasOwnProperty.call(intercorrencia, campo)) {
          expect(intercorrencia[campo], `Campo "${campo}" na intercorrência ${index}`).to.be.a('boolean')
        }
      })
    })
    Cypress.log({ name: 'Validação', message: ` Campos booleanos verificados em ${body.length} registros` })
  })
})

Then('o campo status_extra deve estar presente nas intercorrências', () => {
  cy.get('@response').then((res) => {
    const body = Array.isArray(res.body) ? res.body : [res.body]
    body.forEach((intercorrencia, index) => {
      expect(intercorrencia, `Intercorrência ${index} deve ter "status_extra"`).to.have.property('status_extra')
    })
    Cypress.log({ name: 'Validação', message: ` Campo status_extra presente em ${body.length} registros` })
  })
})

Then('os campos info_complementar podem ser nulos ou vazios', () => {
  cy.get('@response').then((res) => {
    const camposInfoComplementar = [
      'info_complementar_sts',
      'info_complementar_cpca',
      'info_complementar_supervisao_escolar',
      'info_complementar_naapa'
    ]
    const body = Array.isArray(res.body) ? res.body : [res.body]
    body.forEach((intercorrencia, index) => {
      camposInfoComplementar.forEach((campo) => {
        if (Object.prototype.hasOwnProperty.call(intercorrencia, campo)) {
          const valor = intercorrencia[campo]
          expect(
            valor === null || valor === '' || typeof valor === 'string',
            `Campo "${campo}" na intercorrência ${index} deve ser nulo, vazio ou string`
          ).to.be.true
        }
      })
    })
    Cypress.log({ name: 'Validação', message: ` Campos info_complementar verificados em ${body.length} registros` })
  })
})

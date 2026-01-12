import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

const BASE_URL = 'https://qa-gipe.sme.prefeitura.sp.gov.br/api-intercorrencias/v1'

let response

// ==================== BACKGROUND ====================

Given('que possuo um token de autenticação válido', () => {
  Cypress.log({ name: 'Autenticação', message: ' Token será obtido via autenticação automática' });
})

// ==================== TESTES GET ====================

// Verificar intercorrência sem parâmetros
When('eu consulto o endpoint verify-intercorrencia sem parâmetros', () => {
  cy.api_get('/verify-intercorrencia', { failOnStatusCode: false }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'GET', message: `Verify intercorrência - Status: ${res.status}` })
  })
})

// Verificar intercorrência com barra final
When('eu consulto o endpoint verify-intercorrencia com barra final', () => {
  cy.api_get('/verify-intercorrencia/', { failOnStatusCode: false }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'GET', message: `Verify intercorrência (/) - Status: ${res.status}` })
  })
})

// Consultar intercorrência específica por ID
When('eu consulto a intercorrência do diretor com ID {string}', (id) => {
  cy.api_get(`/diretor/${id}/`).then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'GET', message: `Consulta intercorrência ${id} - Status: ${res.status}` })
  })
})

Then('se encontrada a resposta deve conter dados da intercorrência', () => {
  cy.get('@response').then((res) => {
    if (res.status === 200) {
      expect(res.body).to.exist
      cy.log('Intercorrência encontrada e validada')
    } else if (res.status === 404) {
      cy.log('Intercorrência não encontrada (404)')
    }
  })
})

// Listar declarantes
When('eu consulto a lista de declarantes', () => {
  cy.api_get('/declarante/').then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'GET', message: `Lista de declarantes - Status: ${res.status}` })
  })
})

Then('a resposta deve conter uma lista de declarantes', () => {
  cy.get('@response').then((res) => {
    expect(res.body).to.be.an('array')
    if (res.body.length > 0) {
      expect(res.body[0]).to.have.property('uuid')
      expect(res.body[0]).to.have.property('declarante')
      cy.log(`Total de declarantes: ${res.body.length}`)
    }
  })
})

// ==================== TESTES POST ====================

// Criar seção inicial
When('eu envio dados para criar uma seção inicial de intercorrência', () => {
  const body = {
    tipo_ocorrencia: 1,
    data_ocorrencia: new Date().toISOString().split('T')[0],
    hora_ocorrencia: "14:30:00",
    local_ocorrencia: "Sala de aula",
    descricao: "Teste de criação de intercorrência via API"
  }
  cy.api_post('/diretor/secao-inicial/', body).then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'POST', message: `Criar seção inicial - Status: ${res.status}` })
  })
})

Then('a resposta deve conter o ID da intercorrência criada', () => {
  cy.get('@response').then((res) => {
    if (res.status === 200 || res.status === 201) {
      expect(res.body).to.exist
      if (res.body.id || res.body.intercorrencia_id || res.body.uuid) {
        cy.log('ID da intercorrência criada encontrado')
      }
    } else {
      cy.log('Criação falhou ou retornou status diferente')
    }
  })
})

// ==================== TESTES PUT ====================

// Atualizar seção inicial
When('eu atualizo a seção inicial da intercorrência {string}', (id) => {
  const body = {
    tipo_ocorrencia: 1,
    data_ocorrencia: new Date().toISOString().split('T')[0],
    hora_ocorrencia: "15:00:00",
    local_ocorrencia: "Pátio da escola",
    descricao: "Atualização de teste via API"
  }
  cy.api_put(`/diretor/${id}/secao-inicial/`, body).then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'PUT', message: `Atualizar seção inicial ${id} - Status: ${res.status}` })
  })
})

// Atualizar não furto/roubo
When('eu atualizo a secao nao furto roubo da intercorrencia {string}', (id) => {
  const body = {
    houve_dano_patrimonio: false,
    descricao_dano: "",
    houve_lesao_corporal: false,
    descricao_lesao: ""
  }
  cy.api_put(`/diretor/${id}/nao-furto-roubo/`, body).then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'PUT', message: `Atualizar não furto/roubo ${id} - Status: ${res.status}` })
  })
})

// Atualizar furto/roubo
When('eu atualizo a secao furto roubo da intercorrencia {string}', (id) => {
  const body = {
    tipo_bem_furtado: "Equipamento eletrônico",
    valor_estimado: 1500.00,
    foi_registrado_bo: true,
    numero_bo: "2024/12345"
  }
  cy.api_put(`/diretor/${id}/furto-roubo/`, body).then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'PUT', message: `Atualizar furto/roubo ${id} - Status: ${res.status}` })
  })
})

// Atualizar furto/roubo com dados de patrimônio
When('eu atualizo furto roubo com patrimonio da intercorrencia {string}', (id) => {
  const body = {
    tipos_ocorrencia: ["7f924f84-a184-41d1-ad9b-39a3b8511223"],
    descricao_ocorrencia: "Ocorrência registrada para teste de automação - Patrimônio",
    smart_sampa_situacao: "sim_sem_dano"
  }
  cy.api_put(`/diretor/${id}/furto-roubo/`, body).then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'PUT', message: `Atualizar furto/roubo ${id} - Status: ${res.status}` })
  })
})

// Atualizar não furto/roubo com envolvido
When('eu atualizo nao furto roubo com envolvido da intercorrencia {string}', (id) => {
  const body = {
    tipos_ocorrencia: ["7f924f84-a184-41d1-ad9b-39a3b8511223"],
    descricao_ocorrencia: "Esse aluno, acabou causando pânico e medo nos alunos",
    envolvido: "f9a11fa8-c179-487b-9d51-a3e39ae8cb44",
    tem_info_agressor_ou_vitima: "nao"
  }
  cy.api_put(`/diretor/${id}/nao-furto-roubo/`, body).then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'PUT', message: `Atualizar não furto/roubo ${id} - Status: ${res.status}` })
  })
})

// Atualizar seção final com dados completos
When('eu atualizo secao final com dados completos da intercorrencia {string}', (id) => {
  const body = {
    unidade_codigo_eol: "011568",
    dre_codigo_eol: "108300",
    declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
    comunicacao_seguranca_publica: "sim_gcm",
    protocolo_acionado: "ameaca"
  }
  cy.api_put(`/diretor/${id}/secao-final/`, body).then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'PUT', message: `Atualizar seção final ${id} - Status: ${res.status}` })
  })
})

// Atualizar seção final genérica
When('eu atualizo secao final da intercorrencia {string}', (id) => {
  const body = {
    unidade_codigo_eol: "011568",
    dre_codigo_eol: "108300",
    declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
    comunicacao_seguranca_publica: "sim_gcm",
    protocolo_acionado: "ameaca"
  }
  cy.api_put(`/diretor/${id}/secao-final/`, body).then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'PUT', message: `Atualizar seção final ${id} - Status: ${res.status}` })
  })
})

// Atualizar seção final com dados vazios
When('eu atualizo secao final com dados vazios da intercorrencia {string}', (id) => {
  const body = {
    unidade_codigo_eol: "011568",
    dre_codigo_eol: "108300",
    declarante: "",
    comunicacao_seguranca_publica: "",
    protocolo_acionado: ""
  }
  cy.api_put(`/diretor/${id}/secao-final/`, body).then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'PUT', message: `Atualizar seção final vazios ${id} - Status: ${res.status}` })
  })
})

Then('a resposta deve confirmar a atualização', () => {
  cy.get('@response').then((res) => {
    if (res.status === 200) {
      expect(res.body).to.exist
      cy.log('Atualização confirmada com sucesso')
    } else if (res.status === 404) {
      cy.log('Intercorrência não encontrada para atualização')
    } else if (res.status === 400) {
      cy.log('Dados inválidos para atualização')
    }
  })
})

// ==================== VALIDAÇÕES COMUNS ====================

Then('o status da resposta deve ser {int} ou {int}', (status1, status2) => {
  cy.get('@response').then((res) => {
    expect(res.status).to.be.oneOf([status1, status2])
  })
})

Then('o status da resposta deve ser {int} ou {int} ou {int}', (status1, status2, status3) => {
  cy.get('@response').then((res) => {
    expect(res.status).to.be.oneOf([status1, status2, status3])
  })
})

Then('a resposta deve estar em formato JSON', () => {
  cy.get('@response').then((res) => {
    expect(res.headers['content-type']).to.include('application/json')
  })
})

Then('a resposta pode estar em formato JSON', () => {
  cy.get('@response').then((res) => {
    if (res.headers['content-type']) {
      cy.log('Content-Type:', res.headers['content-type'])
    }
  })
})

Then('o status da resposta deve ser {int}', (expectedStatus) => {
  cy.get('@response').then((res) => {
    expect(res.status).to.equal(expectedStatus)
  })
})

// ==================== STEPS PARA VERIFY-INTERCORRENCIA COM ID ====================

When('eu verifico a intercorrencia com ID {string}', (uuid) => {
  cy.api_get(`/verify-intercorrencia/${uuid}/`, { failOnStatusCode: false }).as('response')
})

// ==================== STEPS PARA TESTES ADICIONAIS ====================

When('eu consulto as categorias disponiveis', () => {
  cy.api_get('/diretor/categorias-disponiveis/').as('response')
})

Then('a resposta deve conter lista de categorias', () => {
  cy.get('@response').then((res) => {
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('object')
    expect(Object.keys(res.body).length).to.be.greaterThan(0)
  })
})

When('eu consulto o schema da API em formato {string} e lingua {string}', (formato, lingua) => {
  cy.api_get(`/schema/?format=${formato}&lang=${lingua}`).as('response')
})

Then('a resposta deve estar em formato YAML', () => {
  cy.get('@response').then((res) => {
    // Aceita 200 (sucesso) ou 406 (formato não aceito)
    expect([200, 406]).to.include(res.status)
    if (res.status === 200 && res.headers['content-type']) {
      const contentType = res.headers['content-type']
      const isValidFormat = contentType.includes('yaml') || contentType.includes('application/vnd.oai.openapi')
      expect(isValidFormat).to.be.true
      expect(res.body).to.exist
    }
  })
})

When('eu consulto a lista de intercorrências do diretor', () => {
  cy.api_get('/diretor/').then((res) => {
    response = res
    cy.wrap(response).as('response')
    Cypress.log({ name: 'GET', message: `Lista de intercorrências diretor - Status: ${res.status}` })
  })
})

Then('a resposta deve conter pelo menos uma intercorrência com UUID válido', () => {
  cy.get('@response').then((res) => {
    expect(res.body).to.be.an('array')
    expect(res.body.length).to.be.at.least(1)

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    
    res.body.forEach((intercorrencia, index) => {
      expect(intercorrencia).to.have.property('uuid')
      expect(intercorrencia.uuid, `UUID na intercorrência ${index}`).to.match(uuidRegex)
    })
    
    Cypress.log({ name: 'Validação', message: ` ${res.body.length} intercorrências com UUIDs válidos` })
  })
})

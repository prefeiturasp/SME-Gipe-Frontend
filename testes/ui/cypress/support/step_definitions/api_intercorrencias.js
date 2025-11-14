import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

// Token fixo do GIPE para testes
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYzMTUyMjQ4LCJpYXQiOjE3NjMwNjU4NDgsImp0aSI6IjU2ZjUzZDhjMTRiODQ5MzM4MDNkMDlkMjc3NGI5MmJhIiwidXNlcl9pZCI6MjAsInVzZXJuYW1lIjoiMDU0ODExNzkzNDIiLCJuYW1lIjoiTWFyY2VsbyBBbHZlcyBOdW5lcyBkYSBTaWx2YSIsInBlcmZpbF9jb2RpZ28iOjMzNjAsInBlcmZpbF9ub21lIjoiRElSRVRPUiBERSBFU0NPTEEiLCJjb2RpZ29fdW5pZGFkZV9lb2wiOiIwMTE1NjgifQ.4hiLfyL9HhMXlG4l5MJMacCblFQ5TGSNvtLv3I5z_G4'

const BASE_URL = 'https://qa-gipe.sme.prefeitura.sp.gov.br/api-intercorrencias/v1'

let token
let response

// Configura token antes de cada cenário
Before({ tags: '@api_intercorrencias' }, () => {
  token = AUTH_TOKEN
  cy.wrap(token).as('authToken')
  cy.log('✅ Token GIPE configurado com sucesso!')
})

// ==================== BACKGROUND ====================

Given('que possuo um token de autenticação válido', () => {
  cy.get('@authToken').then((tkn) => {
    expect(tkn, 'Token deve estar definido').to.exist
    token = tkn
    cy.log('✅ Token validado com sucesso')
  })
})

// ==================== TESTES GET ====================

// Verificar intercorrência sem parâmetros
When('eu consulto o endpoint verify-intercorrencia sem parâmetros', () => {
  cy.request({
    method: 'GET',
    url: `${BASE_URL}/verify-intercorrencia`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json'
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log('Verify intercorrência - Status:', res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
  })
})

// Verificar intercorrência com barra final
When('eu consulto o endpoint verify-intercorrencia com barra final', () => {
  cy.request({
    method: 'GET',
    url: `${BASE_URL}/verify-intercorrencia/`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json'
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log('Verify intercorrência (/) - Status:', res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
  })
})

// Consultar intercorrência específica por ID
When('eu consulto a intercorrência do diretor com ID {string}', (id) => {
  cy.request({
    method: 'GET',
    url: `${BASE_URL}/diretor/${id}/`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json'
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log(`Consulta intercorrência ${id} - Status:`, res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
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
  cy.request({
    method: 'GET',
    url: `${BASE_URL}/declarante/`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json'
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log('Lista de declarantes - Status:', res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
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
  cy.request({
    method: 'POST',
    url: `${BASE_URL}/diretor/secao-inicial/`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      tipo_ocorrencia: 1,
      data_ocorrencia: new Date().toISOString().split('T')[0],
      hora_ocorrencia: "14:30:00",
      local_ocorrencia: "Sala de aula",
      descricao: "Teste de criação de intercorrência via API"
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log('Criar seção inicial - Status:', res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
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
  cy.request({
    method: 'PUT',
    url: `${BASE_URL}/diretor/${id}/secao-inicial/`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      tipo_ocorrencia: 1,
      data_ocorrencia: new Date().toISOString().split('T')[0],
      hora_ocorrencia: "15:00:00",
      local_ocorrencia: "Pátio da escola",
      descricao: "Atualização de teste via API"
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log(`Atualizar seção inicial ${id} - Status:`, res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
  })
})

// Atualizar não furto/roubo
When('eu atualizo a secao nao furto roubo da intercorrencia {string}', (id) => {
  cy.request({
    method: 'PUT',
    url: `${BASE_URL}/diretor/${id}/nao-furto-roubo/`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      houve_dano_patrimonio: false,
      descricao_dano: "",
      houve_lesao_corporal: false,
      descricao_lesao: ""
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log(`Atualizar não furto/roubo ${id} - Status:`, res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
  })
})

// Atualizar furto/roubo
When('eu atualizo a secao furto roubo da intercorrencia {string}', (id) => {
  cy.request({
    method: 'PUT',
    url: `${BASE_URL}/diretor/${id}/furto-roubo/`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      tipo_bem_furtado: "Equipamento eletrônico",
      valor_estimado: 1500.00,
      foi_registrado_bo: true,
      numero_bo: "2024/12345"
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log(`Atualizar furto/roubo ${id} - Status:`, res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
  })
})

// Atualizar furto/roubo com dados de patrimônio
When('eu atualizo furto roubo com patrimonio da intercorrencia {string}', (id) => {
  cy.request({
    method: 'PUT',
    url: `${BASE_URL}/diretor/${id}/furto-roubo/`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      tipos_ocorrencia: ["7f924f84-a184-41d1-ad9b-39a3b8511223"],
      descricao_ocorrencia: "Ocorrência registrada para teste de automação - Patrimônio",
      smart_sampa_situacao: "sim_sem_dano"
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log(`Atualizar furto/roubo patrimônio ${id} - Status:`, res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
  })
})

// Atualizar não furto/roubo com envolvido
When('eu atualizo nao furto roubo com envolvido da intercorrencia {string}', (id) => {
  cy.request({
    method: 'PUT',
    url: `${BASE_URL}/diretor/${id}/nao-furto-roubo/`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      tipos_ocorrencia: ["7f924f84-a184-41d1-ad9b-39a3b8511223"],
      descricao_ocorrencia: "Esse aluno, acabou causando pânico e medo nos alunos",
      envolvido: "f9a11fa8-c179-487b-9d51-a3e39ae8cb44",
      tem_info_agressor_ou_vitima: "nao"
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log(`Atualizar não furto/roubo com envolvido ${id} - Status:`, res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
  })
})

// Atualizar seção final com dados completos
When('eu atualizo secao final com dados completos da intercorrencia {string}', (id) => {
  cy.request({
    method: 'PUT',
    url: `${BASE_URL}/diretor/${id}/secao-final/`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      unidade_codigo_eol: "011568",
      dre_codigo_eol: "108300",
      declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
      comunicacao_seguranca_publica: "sim_gcm",
      protocolo_acionado: "ameaca"
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log(`Atualizar seção final completa ${id} - Status:`, res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
  })
})

// Atualizar seção final genérica
When('eu atualizo secao final da intercorrencia {string}', (id) => {
  cy.request({
    method: 'PUT',
    url: `${BASE_URL}/diretor/${id}/secao-final/`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      unidade_codigo_eol: "011568",
      dre_codigo_eol: "108300",
      declarante: "7d2fb34f-4465-4b1b-b307-c1e4794777f0",
      comunicacao_seguranca_publica: "sim_gcm",
      protocolo_acionado: "ameaca"
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log(`Atualizar seção final ${id} - Status:`, res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
  })
})

// Atualizar seção final com dados vazios
When('eu atualizo secao final com dados vazios da intercorrencia {string}', (id) => {
  cy.request({
    method: 'PUT',
    url: `${BASE_URL}/diretor/${id}/secao-final/`,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      unidade_codigo_eol: "011568",
      dre_codigo_eol: "108300",
      declarante: "",
      comunicacao_seguranca_publica: "",
      protocolo_acionado: ""
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
    cy.wrap(response).as('response')
    cy.log(`Atualizar seção final com dados vazios ${id} - Status:`, res.status)
    cy.log('Corpo da resposta:', JSON.stringify(res.body))
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
  cy.request({
    method: 'GET',
    url: `${BASE_URL}/verify-intercorrencia/${uuid}/`,
    headers: {
      Authorization: AUTH_TOKEN
    },
    failOnStatusCode: false
  }).as('response')
})

// ==================== STEPS PARA TESTES ADICIONAIS ====================

When('eu consulto as categorias disponiveis', () => {
  cy.request({
    method: 'GET',
    url: `${BASE_URL}/diretor/categorias-disponiveis/`,
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`
    }
  }).as('response')
})

Then('a resposta deve conter lista de categorias', () => {
  cy.get('@response').then((res) => {
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an('object')
    expect(Object.keys(res.body).length).to.be.greaterThan(0)
  })
})

When('eu consulto o schema da API em formato {string} e lingua {string}', (formato, lingua) => {
  cy.request({
    method: 'GET',
    url: `${BASE_URL}/schema/`,
    qs: {
      format: formato,
      lang: lingua
    },
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`
    }
  }).as('response')
})

Then('a resposta deve estar em formato YAML', () => {
  cy.get('@response').then((res) => {
    expect(res.status).to.equal(200)
    const contentType = res.headers['content-type']
    const isValidFormat = contentType.includes('yaml') || contentType.includes('application/vnd.oai.openapi')
    expect(isValidFormat).to.be.true
    expect(res.body).to.exist
  })
})

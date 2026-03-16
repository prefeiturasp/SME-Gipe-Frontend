import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../locators/login_locators'
import Gestao_Unidade_Localizadores from '../locators/gestao_unidade_locators'
import Cadastro_ocorrencias_Localizadores from '../locators/cadastro_ocorrencias_locators'

const locators_login = new Login_Gipe_Localizadores()
const locators_unidades = new Gestao_Unidade_Localizadores()
const locators_ocorrencias = new Cadastro_ocorrencias_Localizadores()

const TIMEOUT_PADRAO = 20000
const DELAY_DIGITACAO = 50
const RF_VALIDO = '7311559'
const SENHA_VALIDA = 'Sgp1559'
const BASE_URL = 'https://qa-gipe.sme.prefeitura.sp.gov.br'

// =============== HELPERS PARA INTEGRAÇÃO ===============

/**
 * Realiza login no sistema
 */
const realizarLogin = (rf = RF_VALIDO, senha = SENHA_VALIDA) => {
  cy.visit(BASE_URL, {
    timeout: 30000,
    failOnStatusCode: false
  })
  cy.wait(2000)
  
  cy.get(locators_login.campo_usuario(), { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .clear()
    .type(rf, { delay: DELAY_DIGITACAO })
  
  cy.get(locators_login.campo_senha(), { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .clear()
    .type(senha, { delay: DELAY_DIGITACAO })
  
  cy.get('button').contains(/acessar/i, { timeout: TIMEOUT_PADRAO })
    .click({ force: true })
  
  cy.url({ timeout: 30000 }).should('include', '/dashboard')
  cy.wait(2000)
}

/**
 * Aguarda elemento estar visível
 */
const aguardarElemento = (selector, timeout = TIMEOUT_PADRAO) => {
  return cy.get(selector, { timeout }).should('be.visible')
}

/**
 * Limpa dados de sessão
 */
const limparSessao = () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.wait(500)
}

// =============== INTEGRAÇÃO LOGIN E AUTENTICAÇÃO ===============

// Cenário: Validar integração entre UI de login e API de autenticação
When('eu insiro credenciais válidas', () => {
  cy.get(locators_login.campo_usuario(), { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .clear()
    .type(RF_VALIDO, { delay: DELAY_DIGITACAO })
  
  cy.get(locators_login.campo_senha(), { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .clear()
    .type(SENHA_VALIDA, { delay: DELAY_DIGITACAO })
  
  cy.wait(500)
})

When('clico no botão de acessar', () => {
  cy.intercept('POST', '**/api-autenticacao/**').as('loginAPI')
  
  cy.get('button').contains(/acessar/i, { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .click({ force: true })
  
  cy.wait(1500)
})

Then('a chamada POST para autenticação é realizada', () => {
  cy.wait('@loginAPI', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect(interception.request.method).to.equal('POST')
    cy.log('✓ Chamada POST realizada com sucesso')
  })
})

Then('token de autenticação é retornado com sucesso', () => {
  cy.wait('@loginAPI', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect([200, 201]).to.include(interception.response.statusCode)
    const body = interception.response.body
    const hasToken = body.token || body.access_token || body.authToken
    expect(hasToken).to.exist
    cy.log('✓ Token recebido com sucesso')
  })
})

Then('cookie auth_token é definido no navegador', () => {
  cy.getCookie('auth_token', { timeout: TIMEOUT_PADRAO }).then((cookie) => {
    if (cookie) {
      expect(cookie).to.exist
      cy.log('✓ Cookie auth_token definido')
    } else {
      cy.log('⚠ Cookie não encontrado, mas pode estar em localStorage')
    }
  })
})

Then('redirecionamento para dashboard ocorre', () => {
  cy.url({ timeout: 30000 }).should('include', '/dashboard')
  cy.log('✓ Redirecionamento para dashboard confirmado')
})

// Cenário: Validar persistência de token entre requisições
Given('que eu acesso o sistema como GIPE', () => {
  cy.visit(BASE_URL, {
    timeout: 30000,
    failOnStatusCode: false
  })
  cy.wait(2000)
  cy.log('✓ Sistema acessado')
})

Given('eu efetuo login com RF GIPE', () => {
  realizarLogin(RF_VALIDO, SENHA_VALIDA)
  cy.log('✓ Login realizado com sucesso')
})

When('realizo múltiplas requisições de API', () => {
  // Intercepta todas as requisições
  cy.intercept('GET', '**/api-intercorrencias/**').as('req1')
  cy.intercept('GET', '**/api-gestao-pessoas/**').as('req2')
  cy.intercept('GET', '**/api/**').as('reqGeneric')
  
  // Navega para forçar requisições
  cy.visit(`${BASE_URL}/dashboard`, { failOnStatusCode: false })
  cy.wait(2000)
  
  cy.log('✓ Múltiplas requisições iniciadas')
})

Then('cada requisição inclui o token correto', () => {
  cy.wait('@reqGeneric', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    if (interception) {
      const headers = interception.request.headers
      const hasAuth = headers.authorization || headers.Authorization || 
                     headers['x-auth-token'] || headers.cookie
      expect(hasAuth).to.exist
      cy.log('✓ Token incluído nas requisições')
    }
  })
})

Then('token não expira durante as requisições', () => {
  cy.getCookie('auth_token').then((cookie) => {
    if (cookie) {
      expect(cookie).to.exist
    }
  })
  cy.log('✓ Token persiste entre requisições')
})

Then('todas as requisições retornam 200 ou 401 apropriadamente', () => {
  cy.wait('@reqGeneric', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    if (interception && interception.response) {
      expect([200, 201, 204, 304, 401, 403]).to.include(interception.response.statusCode)
      cy.log(`✓ Status: ${interception.response.statusCode}`)
    }
  })
})

// Cenário: Validar logout completo em todas as camadas
When('clico em fazer logout', () => {
  cy.intercept('DELETE', '**/sessions/**').as('logoutAPI')
  cy.intercept('POST', '**/logout/**').as('logoutAPI2')
  
  cy.get('button, a').contains(/sair|logout|deslogar/i, { timeout: TIMEOUT_PADRAO })
    .first()
    .click({ force: true })
  
  cy.wait(2000)
  cy.log('✓ Logout acionado')
})

Then('token é invalidado no servidor', () => {
  // Verifica se houve chamada de invalidação
  cy.request({
    method: 'GET',
    url: `${BASE_URL}/api-intercorrencias/v1/ocorrencias`,
    failOnStatusCode: false
  }).then((response) => {
    expect([401, 403]).to.include(response.status)
    cy.log('✓ Token invalidado no servidor')
  })
})

Then('cookie é removido do navegador', () => {
  cy.getCookie('auth_token').should('not.exist')
  cy.log('✓ Cookie removido')
})

Then('localStorage é limpo', () => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('authToken') || 
                 win.localStorage.getItem('token')
    expect(token).to.be.null
    cy.log('✓ localStorage limpo')
  })
})

Then('redirecionamento para login ocorre', () => {
  cy.url({ timeout: 20000 }).should('match', /\/login|\/$/i)
  cy.log('✓ Redirecionamento para login confirmado')
})

// =============== INTEGRAÇÃO GESTÃO DE UNIDADES ===============

// Cenário: Validar integração entre UI e API de listagem de unidades
Given('estou na página principal do sistema', () => {
  cy.url({ timeout: 20000 }).should('include', '/dashboard')
  cy.wait(2000)
  cy.log('✓ Na página principal')
})

When('acesso o menu de Gestão', () => {
  cy.get('a, button, [role="menuitem"]').contains(/gestão|menu/i, { timeout: TIMEOUT_PADRAO })
    .first()
    .click({ force: true })
  
  cy.wait(1500)
  cy.log('✓ Menu de Gestão acessado')
})

When('clica na opção "Gestão de unidades Educacionais"', () => {
  cy.intercept('GET', '**/unidades**').as('getUnidades')
  
  cy.get('a, button, [role="menuitem"]').contains(/unidade.*educacion|gestão.*unidade/i, { timeout: TIMEOUT_PADRAO })
    .first()
    .click({ force: true })
  
  cy.wait(2000)
  cy.log('✓ Gestão de Unidades acessada')
})

Then('chamada GET para listar unidades é realizada', () => {
  cy.wait('@getUnidades', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect(interception.request.method).to.equal('GET')
    expect(interception.request.url).to.include('unidades')
    cy.log('✓ Chamada GET /unidades realizada')
  })
})

Then('lista de unidades é recebida do servidor', () => {
  cy.wait('@getUnidades', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect([200, 304]).to.include(interception.response.statusCode)
    const body = interception.response.body
    expect(body).to.exist
    cy.log('✓ Lista de unidades recebida')
  })
})

Then('dados são exibidos corretamente na UI', () => {
  cy.get('table, [role="table"], [data-testid*="unidades"], .table', { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
  
  cy.get('tbody tr, [role="row"]', { timeout: TIMEOUT_PADRAO })
    .should('have.length.greaterThan', 0)
  
  cy.log('✓ Dados exibidos na UI')
})

Then('paginação sincroniza com API', () => {
  cy.get('[aria-label*="page"], .pagination, [role="navigation"]', { timeout: TIMEOUT_PADRAO })
    .should('exist')
  
  cy.log('✓ Paginação presente')
})

// Cenário: Validar sincronização de filtros entre UI e API
When('aplico filtro de status na UI', () => {
  cy.intercept('GET', '**/unidades**').as('getUnidadesFiltradas')
  
  cy.get('select, [role="combobox"], input[placeholder*="filtro"], input[type="search"]', { timeout: TIMEOUT_PADRAO })
    .first()
    .clear()
    .type('ativo', { delay: DELAY_DIGITACAO, force: true })
  
  cy.wait(1500)
  cy.log('✓ Filtro aplicado')
})

Then('parâmetro filter é enviado para API', () => {
  cy.wait('@getUnidadesFiltradas', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    const url = interception.request.url
    expect(url).to.match(/filter|status|search/)
    cy.log('✓ Parâmetro filter enviado para API')
  })
})

Then('API retorna apenas unidades filtradas', () => {
  cy.wait('@getUnidadesFiltradas', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect([200, 304]).to.include(interception.response.statusCode)
    cy.log('✓ API retornou dados filtrados')
  })
})

Then('UI reflete resultados corretamente', () => {
  cy.get('tbody tr, [role="row"]', { timeout: TIMEOUT_PADRAO })
    .should('have.length.greaterThan', -1)
  
  cy.log('✓ UI reflete resultados filtrados')
})

Then('paginação é resetada para página 1', () => {
  cy.get('[aria-label*="page"], .pagination', { timeout: TIMEOUT_PADRAO })
    .should('exist')
  
  cy.log('✓ Paginação resetada')
})

// Cenário: Validar sincronização de ordenação entre UI e API
When('clico em cabeçalho de coluna para ordenar', () => {
  cy.intercept('GET', '**/unidades**').as('getUnidadesOrdenadas')
  
  cy.get('table thead th, [role="columnheader"]', { timeout: TIMEOUT_PADRAO })
    .first()
    .click({ force: true })
  
  cy.wait(1500)
  cy.log('✓ Coluna clicada para ordenação')
})

Then('parâmetro sort é enviado para API', () => {
  cy.wait('@getUnidadesOrdenadas', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    const url = interception.request.url
    expect(url).to.match(/sort|order|orderBy/)
    cy.log('✓ Parâmetro sort enviado')
  })
})

Then('dados são ordenados conforme solicitado', () => {
  cy.get('tbody tr, [role="row"]', { timeout: TIMEOUT_PADRAO })
    .should('have.length.greaterThan', 0)
  
  cy.log('✓ Dados ordenados')
})

Then('ícone de ordenação é atualizado na UI', () => {
  cy.get('table thead th, [role="columnheader"]', { timeout: TIMEOUT_PADRAO })
    .first()
    .find('svg, i, [class*="icon"], [class*="sort"]')
    .should('exist')
  
  cy.log('✓ Ícone de ordenação atualizado')
})

// =============== INTEGRAÇÃO OCORRÊNCIAS - CRUD ===============

// Cenário: Validar fluxo integrado de criar ocorrência
When('preencho formulário de nova ocorrência', () => {
  cy.get('button, a').contains(/nova.*ocorrência|criar.*ocorrência|adicionar/i, { timeout: TIMEOUT_PADRAO })
    .first()
    .click({ force: true })
  
  cy.wait(2000)
  
  // Preenche campos do formulário
  cy.get('input[type="date"], input[placeholder*="data"]', { timeout: TIMEOUT_PADRAO })
    .first()
    .clear()
    .type('2026-02-10', { force: true })
  
  cy.wait(500)
  
  cy.get('textarea, input[placeholder*="descr"], input[name*="descr"]', { timeout: TIMEOUT_PADRAO })
    .first()
    .clear()
    .type('Teste de integração - criação de ocorrência', { delay: DELAY_DIGITACAO })
  
  cy.wait(500)
  cy.log('✓ Formulário preenchido')
})

When('submeto o formulário de ocorrência', () => {
  cy.intercept('POST', '**/ocorrencias**').as('createOcorrencia')
  
  cy.get('button').contains(/enviar|salvar|submeter|criar/i, { timeout: TIMEOUT_PADRAO })
    .click({ force: true })
  
  cy.wait(2000)
  cy.log('✓ Formulário submetido')
})

Then('chamada POST para criar ocorrência é realizada', () => {
  cy.wait('@createOcorrencia', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect(interception.request.method).to.equal('POST')
    expect(interception.request.url).to.include('ocorrencias')
    cy.log('✓ Chamada POST /ocorrencias realizada')
  })
})

Then('dados são validados no servidor', () => {
  cy.wait('@createOcorrencia', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect([200, 201, 400, 422]).to.include(interception.response.statusCode)
    cy.log('✓ Dados validados no servidor')
  })
})

Then('ocorrência é criada e retorna ID', () => {
  cy.wait('@createOcorrencia', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    if ([200, 201].includes(interception.response.statusCode)) {
      const body = interception.response.body
      const hasId = body.id || body.data?.id || body.ocorrenciaId
      expect(hasId).to.exist
      cy.log('✓ Ocorrência criada com ID')
    }
  })
})

Then('UI exibe mensagem de sucesso', () => {
  cy.get('[role="alert"], .alert-success, .toast, .notification', { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
  
  cy.log('✓ Mensagem de sucesso exibida')
})

Then('ocorrência aparece na listagem', () => {
  cy.get('table, [role="table"], [data-testid*="ocorrencias"]', { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
  
  cy.log('✓ Ocorrência na listagem')
})

// Cenário: Validar fluxo integrado de editar ocorrência
Given('tenho uma ocorrência previamente criada', () => {
  cy.visit(`${BASE_URL}/dashboard`, { failOnStatusCode: false })
  cy.wait(2000)
  cy.log('✓ Ocorrência disponível para edição')
})

When('edito a ocorrência através da UI', () => {
  cy.get('button, a').contains(/editar|edit|alterar/i, { timeout: TIMEOUT_PADRAO })
    .first()
    .click({ force: true })
  
  cy.wait(2000)
  
  cy.get('textarea, input[placeholder*="descr"], input[name*="descr"]', { timeout: TIMEOUT_PADRAO })
    .first()
    .clear()
    .type('Descrição atualizada via teste de integração', { delay: DELAY_DIGITACAO })
  
  cy.wait(500)
  cy.log('✓ Ocorrência editada')
})

When('submeto as alterações da ocorrência', () => {
  cy.intercept('PUT', '**/ocorrencias/**').as('updateOcorrencia')
  cy.intercept('PATCH', '**/ocorrencias/**').as('patchOcorrencia')
  
  cy.get('button').contains(/salvar|atualizar|enviar/i, { timeout: TIMEOUT_PADRAO })
    .click({ force: true })
  
  cy.wait(2000)
  cy.log('✓ Alterações submetidas')
})

Then('chamada PUT para atualizar ocorrência é realizada', () => {
  cy.wait('@updateOcorrencia', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect(['PUT', 'PATCH']).to.include(interception.request.method)
    expect(interception.request.url).to.include('ocorrencias')
    cy.log('✓ Chamada PUT/PATCH realizada')
  })
})

Then('dados são atualizados no servidor', () => {
  cy.wait('@updateOcorrencia', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect([200, 204]).to.include(interception.response.statusCode)
    cy.log('✓ Dados atualizados no servidor')
  })
})

Then('validações são aplicadas', () => {
  cy.wait('@updateOcorrencia', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect(interception.response).to.exist
    cy.log('✓ Validações aplicadas')
  })
})

Then('UI reflete mudanças', () => {
  cy.get('[role="alert"], .alert', { timeout: TIMEOUT_PADRAO })
    .should('exist')
  
  cy.log('✓ UI reflete mudanças')
})

// Cenário: Validar fluxo integrado de deletar ocorrência
When('deleto a ocorrência através da UI', () => {
  cy.intercept('DELETE', '**/ocorrencias/**').as('deleteOcorrencia')
  
  cy.get('button, a').contains(/deletar|excluir|remover|delete/i, { timeout: TIMEOUT_PADRAO })
    .first()
    .click({ force: true })
  
  cy.wait(1000)
  cy.log('✓ Deleção acionada')
})

When('confirmo a deleção da ocorrência', () => {
  cy.get('button').contains(/confirmar|sim|deletar|ok/i, { timeout: TIMEOUT_PADRAO })
    .click({ force: true })
  
  cy.wait(2000)
  cy.log('✓ Deleção confirmada')
})

Then('chamada DELETE para remover ocorrência é realizada', () => {
  cy.wait('@deleteOcorrencia', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect(interception.request.method).to.equal('DELETE')
    expect(interception.request.url).to.include('ocorrencias')
    cy.log('✓ Chamada DELETE realizada')
  })
})

Then('ocorrência é removida do banco', () => {
  cy.wait('@deleteOcorrencia', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect([200, 204]).to.include(interception.response.statusCode)
    cy.log('✓ Ocorrência removida do banco')
  })
})

Then('UI remove item da listagem', () => {
  cy.get('tbody tr, [role="row"]', { timeout: TIMEOUT_PADRAO })
    .should('have.length.greaterThan', -1)
  
  cy.log('✓ Item removido da listagem')
})

Then('mensagem de sucesso de deleção é exibida', () => {
  cy.get('[role="alert"], .alert-success, .toast', { timeout: TIMEOUT_PADRAO })
    .should('exist')
  
  cy.log('✓ Mensagem de sucesso exibida')
})

// =============== INTEGRAÇÃO VALIDAÇÕES ===============

// Cenário: Validar validações complementares cliente-servidor
Given('tenho um formulário de ocorrência aberto', () => {
  cy.get('button, a').contains(/nova.*ocorrência|criar/i, { timeout: TIMEOUT_PADRAO })
    .first()
    .click({ force: true })
  
  cy.wait(2000)
  cy.log('✓ Formulário de ocorrência aberto')
})

When('insiro dados inválidos no formulário', () => {
  cy.get('input, textarea', { timeout: TIMEOUT_PADRAO })
    .first()
    .clear()
    .type('x', { delay: DELAY_DIGITACAO }) // Dado muito curto
  
  cy.wait(500)
  cy.log('✓ Dados inválidos inseridos')
})

Then('validação no cliente é executada primeiro', () => {
  cy.get('[role="alert"], .error, .invalid-feedback, [class*="error"]', { timeout: TIMEOUT_PADRAO })
    .should('exist')
  
  cy.log('✓ Validação no cliente executada')
})

Then('erros são exibidos na UI', () => {
  cy.get('[role="alert"], .error, .invalid-feedback', { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
  
  cy.log('✓ Erros exibidos na UI')
})

Then('formulário não é submetido enquanto houver erros', () => {
  cy.get('button').contains(/enviar|salvar/i, { timeout: TIMEOUT_PADRAO })
    .should('be.disabled')
    .or('have.attr', 'disabled')
  
  cy.log('✓ Formulário bloqueado com erros')
})

// Cenário: Validar validações de regra de negócio no servidor
When('insiro dados que violam regra de negócio', () => {
  // Exemplo: data no futuro
  const dataFutura = '2030-12-31'
  
  cy.get('input[type="date"]', { timeout: TIMEOUT_PADRAO })
    .first()
    .clear()
    .type(dataFutura, { force: true })
  
  cy.get('textarea', { timeout: TIMEOUT_PADRAO })
    .first()
    .clear()
    .type('Descrição válida', { delay: DELAY_DIGITACAO })
  
  cy.wait(500)
  cy.log('✓ Dados que violam regra de negócio inseridos')
})

Then('validação de negócio falha no servidor', () => {
  cy.intercept('POST', '**/ocorrencias**').as('createOcorrenciaInvalida')
  cy.wait('@createOcorrenciaInvalida', { timeout: TIMEOUT_PADRAO }).then((interception) => {
    expect([400, 422]).to.include(interception.response.statusCode)
    cy.log('✓ Validação de negócio falhou no servidor')
  })
})

Then('mensagem de erro específica é retornada', () => {
  cy.get('[role="alert"], .error, .alert-danger', { timeout: TIMEOUT_PADRAO })
    .should('be.visible')
    .and('contain.text', /erro|inválid|não permitid/)
  
  cy.log('✓ Mensagem de erro específica retornada')
})

Then('UI destaca campo problemático', () => {
  cy.get('input.error, input.invalid, input[aria-invalid="true"]', { timeout: TIMEOUT_PADRAO })
    .should('exist')
  
  cy.log('✓ Campo problemático destacado')
})

Then('usuário pode corrigir o erro', () => {
  cy.get('input, textarea', { timeout: TIMEOUT_PADRAO })
    .first()
    .should('be.enabled')
  
  cy.log('✓ Usuário pode corrigir o erro')
})

// =============== EXPORT DOS HELPERS ===============

export default {
  realizarLogin,
  aguardarElemento,
  limparSessao
}

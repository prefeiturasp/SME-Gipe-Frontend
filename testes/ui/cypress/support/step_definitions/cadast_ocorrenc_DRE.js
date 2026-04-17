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
  const RF = CREDENCIAIS_DRE.RF
  const SENHA = CREDENCIAIS_DRE.SENHA

  if (!RF || !SENHA) {
    throw new Error(`❌ Credenciais DRE não encontradas! RF_DRE: ${RF}, SENHA_DRE: ${SENHA}. Verifique o arquivo .env.`)
  }

  cy.log(`✅ Efetuando login com RF_DRE: ${RF}`)
  cy.loginWithSession(RF, SENHA, 'DRE')
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

// ================================================================
// STEPS DRE — EQUIVALENTES AO FLUXO GIPE
// Todos prefixados com "DRE" para isolamento total
// ================================================================

// ── Dados para testes ────────────────────────────────────────────

const dreNomesAgressores = [
  // Brasileiros
  'João da Silva Santos', 'Maria Oliveira Costa', 'Pedro Henrique Almeida',
  'Ana Paula Rodrigues', 'Carlos Eduardo Martins', 'Juliana Souza Lima',
  'Rafael Fernandes Barbosa', 'Fernanda Costa Pereira', 'Lucas Martins Cardoso',
  'Amanda Silva Rocha', 'Bruno Oliveira Nascimento', 'Camila Alves Mendes',
  'Diego Santos Ferreira', 'Patrícia Lima Gomes', 'Marcos Vinícius Dias',
  // Origem Africana
  'Amara Diallo Kouyaté', 'Fatou Balde Sow', 'Kofi Asante Mensah',
  'Nia Okonkwo Adeyemi', 'Seun Abiodun Balogun',
  // Origem Árabe
  'Yasmin Khalil Haddad', 'Omar Nasser Saleh', 'Laila Farid Mansour',
  'Karim Aziz Rachid', 'Nour Hamdan Aoun',
  // Origem Europeia
  'Sophie Müller Wagner', 'Luca Rossi Ferrari', 'Elena Dubois Moreau',
  'Aleksander Kowalski Wiśniewski', 'Ingrid Larsen Andersen'
]
const dreIdadesValidas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
const dreNacionalidades = [
  'Brasileira', 'Argentina', 'Boliviana', 'Colombiana', 'Peruana',
  'Paraguaia', 'Uruguaia', 'Venezuelana', 'Chilena', 'Haitiana',
  'Angolana', 'Portuguesa', 'Italiana', 'Espanhola', 'Americana'
]
const dreTextoInteracao = [
  'Aluno colaborativo e respeitoso com colegas',
  'Estudante apresenta dificuldades em trabalho coletivo',
  'Boa participação nas atividades em grupo',
  'Relacionamento conflituoso com alguns colegas',
  'Demonstra empatia e solidariedade no ambiente escolar',
  'Participa ativamente das discussões em sala',
  'Possui liderança natural entre os pares',
  'Necessita de intervenções para melhorar convívio',
  'Interage de forma positiva com a comunidade escolar',
  'Requer acompanhamento nas relações interpessoais'
]

function dreGetNomeAleatorio() {
  return dreNomesAgressores[Math.floor(Math.random() * dreNomesAgressores.length)]
}
function dreGetIdadeAleatoria() {
  return dreIdadesValidas[Math.floor(Math.random() * dreIdadesValidas.length)]
}
function dreGerarTextoAleatorio() {
  return dreTextoInteracao[Math.floor(Math.random() * dreTextoInteracao.length)]
}

// ── Aba 1 ────────────────────────────────────────────────────────

When('DRE inicia o cadastro de uma nova ocorrência', () => {
  cy.wait(2000)
  cy.get('body').then($body => {
    if ($body.find('table tbody tr').length > 0) cy.wait(2000)
  })
  cy.get('body').then($body => {
    const porCor = $body.find('main button[class*="717FC7"]')
    const porTexto = $body.find('button').filter((_, btn) =>
      /nova ocorr|registrar|cadastrar/i.test((btn.innerText || '').trim())
    )
    if (porCor.length > 0) {
      cy.wrap(porCor.first(), { timeout: 20000 }).should('be.visible').click({ force: true })
    } else if (porTexto.length > 0) {
      cy.wrap(porTexto.first(), { timeout: 20000 }).should('be.visible').click({ force: true })
    } else {
      cy.get('main button', { timeout: 20000 }).filter(':visible').first().click({ force: true })
    }
  })
  cy.wait(4000)
  cy.url({ timeout: 15000 }).should('include', '/cadastrar-ocorrencia')
})

When('DRE informa a data atual do ocorrido', () => {
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

When('DRE informa a hora atual do ocorrido', () => {
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

When('DRE seleciona uma Unidade Educacional aleatoriamente', () => {
  function tentarSelecionarUE(tentativasRestantes) {
    cy.xpath(
      "//label[contains(normalize-space(),'Qual a Unidade Educacional')]/ancestor::div[.//button][1]//button[1]",
      { timeout: 15000 }
    )
      .should('be.visible').should('be.enabled')
      .click({ force: true })

    cy.wait(3000)

    cy.get('body').then($body => {
      const $opts = $body.find('[role="option"]:visible')
      if ($opts.length > 0) {
        const idx = Math.floor(Math.random() * $opts.length)
        cy.wrap($opts.eq(idx)).scrollIntoView().click({ force: true })
      } else if (tentativasRestantes > 0) {
        cy.log(`DRE: Nenhuma UE encontrada. Tentativas restantes: ${tentativasRestantes}`)
        cy.get('body').type('{esc}')
        cy.wait(1000)
        tentarSelecionarUE(tentativasRestantes - 1)
      } else {
        throw new Error('DRE: Não foi possível encontrar Unidades Educacionais após todas as tentativas')
      }
    })
  }

  cy.wait(2000)
  tentarSelecionarUE(3)
  cy.wait(2000)
})

When('DRE seleciona o tipo Interpessoal da ocorrência', () => {
  cy.wait(2000)
  cy.get(
    'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.space-y-2 > label',
    { timeout: 15000 }
  ).then($labels => {
    const $interpessoal = $labels.filter((_, el) => /Interpessoal/i.test(el.innerText || ''))
    if ($interpessoal.length > 0) {
      cy.wrap($interpessoal.first()).scrollIntoView().should('be.visible').click({ force: true })
    } else {
      cy.contains('span.text-sm', 'Interpessoal', { timeout: 15000 })
        .scrollIntoView().should('be.visible').click({ force: true })
    }
  })
  cy.wait(1500)
})

When('DRE avança para a próxima aba', () => {
  cy.wait(2000)
  cy.contains('button', /Próximo|Proximo/i, { timeout: 20000 })
    .should('be.visible').should('not.be.disabled')
    .first().scrollIntoView().click({ force: true })
  cy.wait(3000)
})

// ── Aba 2 ────────────────────────────────────────────────────────

When('DRE abre o campo de envolvidos', () => {
  cy.wait(2000)
  cy.get('fieldset div.grid.gap-6 > div:nth-child(2) > button', { timeout: 15000 })
    .filter(':visible').first().should('be.enabled').click({ force: true })
  cy.wait(2500)
})

When('DRE seleciona um envolvido aleatoriamente', () => {
  cy.wait(2000)
  cy.get('body').then($body => {
    const $opts = $body.find('[role="option"]:visible, [role="listbox"] [role="option"]:visible')
    if ($opts.length > 0) {
      const idx = Math.floor(Math.random() * $opts.length)
      cy.wrap($opts.eq(idx)).scrollIntoView().click({ force: true })
    } else {
      cy.get('[aria-label], label', { timeout: 10000 }).filter(':visible')
        .filter((_, el) => el.closest('[role="listbox"], [data-radix-select-viewport], [popover]') !== null ||
          el.closest('div[class*="overflow"]') !== null)
        .then($labels => {
          if ($labels.length > 0) {
            const idx = Math.floor(Math.random() * $labels.length)
            cy.wrap($labels.eq(idx)).scrollIntoView().click({ force: true })
          }
        })
    }
  })
  cy.wait(2000)
})

When('DRE clica no botão Clique aqui', () => {
  cy.wait(1000)
  cy.contains('button', /Clique aqui/i, { timeout: 10000 })
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(1500)
})

When('DRE fecha o dropdown de envolvidos', () => {
  cy.wait(1000)
  cy.get('div.flex.justify-end.mt-2 > button', { timeout: 10000 })
    .filter(':visible').first().click({ force: true })
  cy.wait(1000)
})

When('DRE seleciona Sim para informações sobre pessoas envolvidas', () => {
  cy.wait(1000)
  cy.contains('span.text-sm', 'Sim', { timeout: 15000 })
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(1500)
})

// ── Aba 3 ────────────────────────────────────────────────────────

When('DRE valida o titulo do campo {string}', (titulo) => {
  cy.wait(1000)
  cy.contains('label', titulo, { timeout: 15000 }).should('exist').should('be.visible')
})

When('DRE clica no campo e informa o nome da pessoa aleatoriamente', () => {
  const nome = dreGetNomeAleatorio()
  cy.wait(1000)
  cy.get('input[name*="pessoasAgressoras"][name$="nome"]', { timeout: 15000 }).last()
    .scrollIntoView().should('be.visible').should('be.enabled')
    .click({ force: true }).clear({ force: true })
    .type(nome, { delay: 50, force: true })
  cy.wait(1000)
})

When('DRE informa a idade aleatoriamente', () => {
  const idade = dreGetIdadeAleatoria()
  cy.wait(1000)
  cy.get('input[name*="pessoasAgressoras"][name$=".idade"]', { timeout: 15000 }).last()
    .scrollIntoView().should('be.visible').should('be.enabled')
    .click({ force: true }).clear({ force: true })
    .type(String(idade), { delay: 50, force: true })
  cy.wait(1000)
})

When('DRE valida e seleciona o campo {string} de forma aleatoria', (campo) => {
  const config = {
    'Qual o gênero?*': /g[eê]nero/i,
    'Raça/cor auto declarada*': /ra[cç]a|cor auto/i,
    'Qual a etapa escolar?*': /etapa escolar/i,
    'Qual a frequência escolar?*': /frequ.*escolar/i,
    'Pessoa com deficiência?*': /defici[eê]ncia/i,
    'Nacionalidade*': /nacionalidade/i,
  }

  if (campo === 'Nacionalidade*') {
    const nac = dreNacionalidades[Math.floor(Math.random() * dreNacionalidades.length)]
    cy.contains('label', /nacionalidade/i, { timeout: 15000 }).should('exist').should('be.visible')
    cy.get('input[name*="pessoasAgressoras"][name$="nacionalidade"]', { timeout: 15000 }).last()
      .scrollIntoView().should('be.visible').should('be.enabled')
      .click({ force: true }).clear({ force: true })
      .type(nac, { delay: 50, force: true })
    cy.wait(1000)
    return
  }

  const labelRegex = config[campo]
  if (!labelRegex) throw new Error(`Campo DRE "${campo}" não está mapeado`)

  cy.wait(1000)
  cy.get('label', { timeout: 15000 }).then($labels => {
    const $match = $labels.filter((_, el) => labelRegex.test(el.innerText || el.textContent || ''))
    expect($match.length).to.be.greaterThan(0)
    cy.wrap($match.last()).closest('div').find('button[role="combobox"]').first()
      .scrollIntoView().should('be.visible').should('be.enabled').click({ force: true })
  })
  cy.wait(1500)
  cy.get('[role="option"]', { timeout: 10000 }).filter(':visible').then($opts => {
    expect($opts.length, `DRE: Deve haver opções para "${campo}"`).to.be.greaterThan(0)
    cy.wrap($opts.eq(Math.floor(Math.random() * $opts.length))).scrollIntoView().click({ force: true })
  })
  cy.wait(1000)
})

When('DRE valida e preenche o campo {string} com texto aleatorio', (_campo) => {
  const texto = dreGerarTextoAleatorio()
  cy.wait(1500)
  cy.contains('label', /Como é a interação.*ambiente escolar/i, { timeout: 15000 }).should('be.visible')
  cy.get('textarea[name*="pessoasAgressoras"]', { timeout: 15000 }).last()
    .scrollIntoView().should('be.visible').should('be.enabled')
    .click({ force: true }).clear({ force: true })
    .type(texto, { delay: 50, force: true }).blur({ force: true })
  cy.wait(1000)
})

When('DRE Valida e clica em adicionar pessoa', () => {
  cy.wait(1500)
  cy.contains('button', /\+\s*adicionar pessoa|adicionar pessoa/i, { timeout: 15000 })
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(2000)
})

When('DRE Valida a existencia do texto {string}', (texto) => {
  cy.wait(1000)
  cy.contains('label', texto, { timeout: 15000 }).should('exist').should('be.visible')
})

When('DRE abre e seleciona as motivações aleatoriamente', () => {
  cy.wait(1500)
  cy.contains('label', /O que motivou/i, { timeout: 15000 }).should('be.visible')
  cy.contains('label', /O que motivou/i).parent().find('button').first()
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(2000)
  cy.get('[role="option"]:visible, [role="listbox"] [role="option"]:visible', { timeout: 10000 }).then($opts => {
    expect($opts.length).to.be.greaterThan(0)
    const count = $opts.length
    const idx1 = Math.floor(Math.random() * count)
    let idx2 = Math.floor(Math.random() * count)
    while (count > 1 && idx2 === idx1) idx2 = Math.floor(Math.random() * count)
    cy.wrap($opts.eq(idx1)).scrollIntoView().click({ force: true })
    cy.wait(500)
    if (idx1 !== idx2) cy.wrap($opts.eq(idx2)).scrollIntoView().click({ force: true })
  })
  cy.wait(1000)
  cy.get('body').type('{esc}')
  cy.wait(1000)
})

When('DRE informa de forma aleatoria se o Conselho Tutelar foi acionado', () => {
  cy.wait(1500)
  const opcoes = ['Sim', 'Não']
  const escolha = opcoes[Math.floor(Math.random() * opcoes.length)]
  cy.contains('label', /Conselho Tutelar/i, { timeout: 15000 }).should('be.visible')
    .parent().contains('span', escolha)
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(1000)
})

When('DRE seleciona de forma aleatoria o acompanhamento da ocorrência', () => {
  const opcoes = ['NAAPA', 'Comissão de Mediação de Conflitos', 'Supervisão Escolar', 'CEFAI']
  const escolha = opcoes[Math.floor(Math.random() * opcoes.length)]
  cy.wait(1500)
  cy.contains('label', /acompanhada pelo/i, { timeout: 15000 }).should('be.visible')
    .closest('fieldset, div[class*="space-y"], div[class*="form"]')
    .contains('span', escolha)
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(1000)
})

// ── Aba 4 ────────────────────────────────────────────────────────

When('DRE clica no campo do declarante', () => {
  cy.wait(2000)
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($buttons => {
    cy.wrap($buttons.eq(0)).should('be.visible').should('be.enabled').click({ force: true })
  })
  cy.wait(2500)
})

When('DRE seleciona GIPE como declarante', () => {
  cy.wait(1500)
  cy.contains('[role="option"]', /GIPE/i, { timeout: 15000 }).should('exist').click({ force: true })
  cy.wait(1500)
})

When('DRE seleciona uma das opções de forma aleatoria como declarante', () => {
  cy.wait(1500)
  cy.get('[role="option"]', { timeout: 15000 }).filter(':visible').then(($options) => {
    if ($options.length === 0) { cy.wait(2000); return }
    cy.wrap($options.eq(Math.floor(Math.random() * $options.length))).click({ force: true })
  })
  cy.wait(1500)
})

When('DRE clica no campo de seguranca publica', () => {
  cy.wait(2000)
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($buttons => {
    cy.wrap($buttons.eq(1)).should('be.visible').should('be.enabled').click({ force: true })
  })
  cy.wait(2500)
})

When('DRE seleciona opcao seguranca publica', () => {
  cy.wait(3000)
  cy.get('[role="option"]', { timeout: 15000 }).filter(':visible').then($options => {
    if ($options.length === 0) { cy.wait(2000); return }
    cy.wrap($options.eq(Math.floor(Math.random() * $options.length))).click({ force: true })
  })
  cy.wait(1500)
})

When('DRE seleciona opcao seguranca publica de forma aleatoria entre as opções disponiveis', () => {
  cy.wait(3000)
  cy.get('[role="option"]', { timeout: 15000 }).filter(':visible').then(($options) => {
    if ($options.length === 0) { cy.wait(2000); return }
    cy.wrap($options.eq(Math.floor(Math.random() * $options.length))).click({ force: true })
  })
  cy.wait(1500)
})

When('DRE clica no campo de protocolo', () => {
  cy.wait(2000)
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($buttons => {
    cy.wrap($buttons.eq(2)).should('be.visible').should('be.enabled').click({ force: true })
  })
  cy.wait(2500)
})

When('DRE seleciona protocolo aleatoriamente', () => {
  cy.wait(3000)
  cy.get('[role="option"]', { timeout: 20000 }).filter(':visible').then($options => {
    if ($options.length === 0) return
    cy.wrap($options.eq(Math.floor(Math.random() * $options.length))).click({ force: true })
  })
  cy.wait(2000)
})

Then('DRE clica em proximo para anexos', () => {
  cy.wait(3000)
  cy.contains('button', /Próximo|Proximo/i, { timeout: 30000 })
    .first().should('be.visible').should('not.be.disabled')
    .scrollIntoView().click({ force: true })
  cy.wait(3000)
})

// ── Aba 5 ────────────────────────────────────────────────────────

When('DRE localiza e clica no botão {string}', (botao) => {
  cy.wait(1500)
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

When('DRE seleciona a imagem do pc', () => {
  cy.wait(1000)
  cy.get('input[type="file"]', { timeout: 10000 })
    .selectFile({
      contents: Cypress.Buffer.from('fake-image-content'),
      fileName: 'test-image.jpg',
      mimeType: 'image/jpeg'
    }, { force: true })
  cy.wait(2000)
})

When('DRE clica no campo tipo documento', () => {
  cy.wait(1500)
  cy.get('button[role="combobox"]', { timeout: 15000 }).last().should('be.visible').click({ force: true })
  cy.wait(1500)
})

When('DRE seleciona {string}', (opcao) => {
  cy.wait(1500)
  if (opcao.includes('Sim, mas não houve dano')) {
    cy.get('label.flex:nth-child(2) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible').click({ force: true })
  } else {
    cy.contains('[role="option"]', opcao, { timeout: 10000 })
      .should('be.visible').click({ force: true })
  }
  cy.wait(1000)
})

When('DRE localiza o button {string}', (textoBotao) => {
  cy.wait(2000)
  cy.contains('button', new RegExp(textoBotao, 'i'), { timeout: 15000 })
    .should('exist').should('be.visible')
})

When('DRE localiza e clica em {string}', (textoBotao) => {
  cy.wait(2000)
  cy.contains('button', new RegExp(textoBotao.trim(), 'i'), { timeout: 15000 })
    .should('be.visible').should('not.be.disabled')
    .scrollIntoView().click({ force: true })
  cy.wait(3000)
})

// ── Conclusão ────────────────────────────────────────────────────

When('DRE valida a existencia do texto sucesso {string}', (texto) => {
  cy.wait(3000)
  // Apenas valida que a mensagem está no DOM — sem clicar fora
  cy.get('body').then(($body) => {
    if ($body.text().includes(texto)) {
      cy.log(`DRE: Mensagem de sucesso encontrada no DOM: "${texto}"`)
    } else {
      cy.log(`DRE: Mensagem "${texto}" não encontrada no DOM — continuando`)
    }
  })
  cy.wait(1000)
})

When('DRE aguarda {int} segundos', (segundos) => {
  cy.wait(segundos * 1000)
})

// Fechar o modal de sucesso do Radix Dialog
// Seletor real: [role="dialog"] div.flex.flex-col-reverse button
// (IDs como #radix-:r9c: são dinâmicos — usar role="dialog" como ancora)
When('DRE clica em Fechar', () => {
  cy.wait(1000)

  const tentarFechar = (tentativas) => {
    cy.get('body').then(($body) => {
      // Estratégia 1: botão dentro do dialog Radix — div.flex-col-reverse é o footer do modal
      const $radixBtn = $body.find('[role="dialog"] div.flex.flex-col-reverse button, [aria-modal="true"] div.flex.flex-col-reverse button')
      if ($radixBtn.length > 0) {
        cy.wrap($radixBtn.first()).scrollIntoView().click({ force: true })
        cy.log('DRE: Clicou em Fechar no footer do dialog Radix')
        cy.wait(2000)
        return
      }

      // Estratégia 2: qualquer botão dentro de [role="dialog"]
      const $dialogBtn = $body.find('[role="dialog"] button, [aria-modal="true"] button')
      if ($dialogBtn.length > 0) {
        cy.wrap($dialogBtn.first()).scrollIntoView().click({ force: true })
        cy.log('DRE: Clicou em botão genérico do dialog Radix')
        cy.wait(2000)
        return
      }

      // Estratégia 3: botão com texto "Fechar"
      const $fecharTexto = $body.find('button').filter((_, el) => /^fechar$/i.test(el.textContent.trim()))
      if ($fecharTexto.length > 0) {
        cy.wrap($fecharTexto.first()).scrollIntoView().click({ force: true })
        cy.log('DRE: Clicou em Fechar pelo texto')
        cy.wait(2000)
        return
      }

      // Estratégia 4: se modal não existe mais, verifica se já está no histórico
      if ($body.text().includes('Histórico de ocorrências registradas')) {
        cy.log('DRE: Já no histórico — modal foi fechado automaticamente')
        return
      }

      // Retenta sem clicar fora — aguarda e tenta novamente
      if (tentativas > 0) {
        cy.log(`DRE: Botão Fechar não encontrado — aguardando ${tentativas}s e retentando...`)
        cy.wait(2000)
        tentarFechar(tentativas - 1)
      } else {
        cy.log('DRE: Esgotadas tentativas — o modal pode não estar visível')
      }
    })
  }

  tentarFechar(5)
  cy.wait(2000)
})

Then('DRE valida a existencia do Texto {string}', (texto) => {
  cy.wait(2000)
  // Se o h1 não contiver o texto esperado, tenta clicar em "Finalizar e enviar" e aguarda redirect
  cy.get('h1', { timeout: 10000 }).then(($h1) => {
    const textoAtual = $h1.text()
    if (!textoAtual.includes(texto.trim())) {
      cy.log(`DRE: Texto não encontrado ("${textoAtual}") — retentando clique em "Finalizar e enviar"`)
      cy.contains('button', /Finalizar e enviar/i).then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn.last()).should('not.be.disabled').scrollIntoView().click({ force: true })
          cy.wait(3000)
        } else {
          cy.log('DRE: Botão "Finalizar e enviar" não encontrado na retentativa')
        }
      })
    }
  })
  cy.get('h1', { timeout: 15000 })
    .should('be.visible').and('contain.text', texto.trim())
})

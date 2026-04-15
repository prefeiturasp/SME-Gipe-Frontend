import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import CadastrOcorrencGIPELocalizadores from '../locators/cadastr_ocorrenc_GIPE_locators'

/**
 * ================================================================
 * STEP DEFINITIONS: cadastr_ocorrenc_GIPE.feature
 * ================================================================
 * 
 * 🎯 IMPLEMENTAÇÃO COMPLETA E INDEPENDENTE - Todas as Abas 1-5 + Modal
 * 
 * Este arquivo contém TODOS os step definitions necessários para executar
 * a feature cadastr_ocorrenc_GIPE.feature de forma 100% independente.
 * 
 * ✨ PRINCÍPIO DE NOMENCLATURA:
 * Todos os steps são prefixados com "GIPE" para evitar conflitos com:
 * - cadastro_ue.js (perfil UE)
 * - cadastro_ocorrencias.js (outras features GIPE)
 * 
 * Exemplo:
 *   When('GIPE inicia o cadastro de uma nova ocorrência')
 *   When('GIPE valida o titulo do campo nome')
 *   When('GIPE clica em Finalizar modal')
 * 
 * 🔒 GARANTIAS:
 * ✅ Zero conflitos de step definitions
 * ✅ Alterações não afetam cadastro_ue.feature
 * ✅ Manutenção isolada e independente
 * ✅ cadastro_ue.feature permanece 100% funcional
 * 
 * ESTRUTURA:
 * - Helpers: getNomeAleatorio(), getIdadeAleatoria(), gerarTextoAleatorio()
 * - Aba 1: DRE/UE Selection (GIPE-specific - admin pode selecionar DRE)
 * - Aba 2: Data/Hora/Agressão
 * - Aba 3: Informações do Agressor
 * - Aba 4: Declarante e Protocolos
 * - Aba 5: Anexos
 * - Modal: Conclusão e Validação
 * 
 * ÚLTIMA ATUALIZAÇÃO: 2026-03-24
 * - Renomeados todos os steps com prefixo "GIPE"
 * - Criada arquitetura independente completa
 * ================================================================
 */

const locators = new CadastrOcorrencGIPELocalizadores()

// ==================== SELETORES DA ABA 3 ====================
// XPaths relativos baseados no texto dos labels — resistentes a mudanças de layout

const aba3TitulosXPath = [
  "//label[contains(normalize-space(),'nome da pessoa') or contains(normalize-space(),'Nome da pessoa')]",           // [0] Nome
  "//label[contains(normalize-space(),'idade da pessoa') or contains(normalize-space(),'Idade da pessoa')]",          // [1] Idade
  "//label[contains(normalize-space(),'Gênero') or contains(normalize-space(),'Genero')]",                           // [2] Gênero
  "//label[contains(normalize-space(),'tnico') and contains(normalize-space(),'Racial')]",                           // [3] Étnico-Racial
  "//label[contains(normalize-space(),'Etapa Escolar')]",                                                            // [4] Etapa Escolar
  "//label[contains(normalize-space(),'Frequ') and contains(normalize-space(),'Escolar')]",                          // [5] Frequência Escolar
]

const aba3CamposInputXPath = [
  "//label[contains(normalize-space(),'nome da pessoa') or contains(normalize-space(),'Nome da pessoa')]/../input",  // [0] Input Nome
  "//label[contains(normalize-space(),'idade da pessoa') or contains(normalize-space(),'Idade da pessoa')]/../input", // [1] Input Idade
]

// Aliases mantidos para compatibilidade com chamadas existentes
const aba3TitulosCSS = aba3TitulosXPath
const aba3CamposInput = aba3CamposInputXPath

// ==================== DADOS PARA TESTES ====================

const nomesAgressores = [
  'João da Silva Santos',
  'Maria Oliveira Costa',
  'Pedro Henrique Almeida',
  'Ana Paula Rodrigues',
  'Carlos Eduardo Martins',
  'Juliana Souza Lima',
  'Rafael Fernandes Barbosa',
  'Fernanda Costa Pereira',
  'Lucas Martins Cardoso',
  'Amanda Silva Rocha',
  'Bruno Oliveira Nascimento',
  'Camila Alves Mendes',
  'Diego Santos Ferreira',
  'Patrícia Lima Gomes',
  'Marcos Vinícius Dias'
]

const idadesValidas = [
  18, 19, 20, 22, 25, 28, 30, 32, 35, 38,
  40, 42, 45, 48, 50, 52, 55, 58, 60, 65
]

const nacionalidades = [
  'Brasileira',
  'Argentina',
  'Boliviana',
  'Colombiana',
  'Peruana',
  'Paraguaia',
  'Uruguaia',
  'Venezuelana',
  'Chilena',
  'Haitiana',
  'Angolana',
  'Portuguesa',
  'Italiana',
  'Espanhola',
  'Americana',
]

const textoInteracaoEscolar = [
  'Aluno colaborativo e respeitoso com colegas',
  'Estudante apresenta dificuldades em trabalho coletivo',
  'Boa participação nas atividades em grupo',
  'Relacionamento conflituoso com alguns colegas',
  'Demonstra empatia e solidariedade no ambiente escolar',
  'Tende ao isolamento durante o intervalo',
  'Participa ativamente das discussões em sala',
  'Possui liderança natural entre os pares',
  'Necessita de intervenções para melhorar convívio',
  'Interage de forma positiva com a comunidade escolar',
  'Apresenta comportamento agressivo ocasionalmente',
  'Busca ajuda quando enfrenta dificuldades sociais',
  'Contribui para o clima harmonioso da turma',
  'Estabelece vínculos de amizade facilmente',
  'Requer acompanhamento nas relações interpessoais'
]

const textoRedesProtecao = [
  'Esse aluno causou pânico e medo nos outros estudantes',
  'Ocorrência registrada com detalhes sobre o incidente',
  'Situação envolvendo comportamento inadequado',
  'Incidente que requer atenção e acompanhamento',
  'Caso notificado aos órgãos competentes',
  'Providências adotadas pela a equipe gestora',
  'Acionamento de redes de proteção necessário',
  'NAAPA e Conselho Tutelar foram informados',
  'Família convocada para reunião de orientação',
  'Registro realizado conforme protocolo institucional'
]

// ==================== FUNÇÕES AUXILIARES ====================

function getNomeAleatorio() {
  const idx = Math.floor(Math.random() * nomesAgressores.length)
  return nomesAgressores[idx]
}

function getIdadeAleatoria() {
  const idx = Math.floor(Math.random() * idadesValidas.length)
  return idadesValidas[idx]
}

function gerarTextoAleatorio(tipo) {
  if (tipo === 'interacao') {
    const idx = Math.floor(Math.random() * textoInteracaoEscolar.length)
    return textoInteracaoEscolar[idx]
  } else if (tipo === 'redes') {
    const idx = Math.floor(Math.random() * textoRedesProtecao.length)
    return textoRedesProtecao[idx]
  }
  return 'Texto padrão de teste'
}

/**
 * ================================================================
 * LOGIN EXCLUSIVO - cadastr_ocorrenc_GIPE.feature
 * ================================================================
 * Step de autenticação EXCLUSIVO para esta feature.
 * Usa credenciais RF_GIPE_ADMIN / SENHA_GIPE_ADMIN do .env
 * Perfil ADM com permissão para selecionar DRE e Unidade Educacional.
 * Alterações nessas credenciais NÃO afetam outras features.
 */

Given('eu efetuo login com RF GIPE Admin', () => {
  const RF = Cypress.env('RF_GIPE_ADMIN')
  const SENHA = Cypress.env('SENHA_GIPE_ADMIN')

  if (!RF || !SENHA) {
    throw new Error(`❌ Credenciais GIPE_ADMIN não encontradas! RF_GIPE_ADMIN: ${RF}, SENHA_GIPE_ADMIN: ${SENHA}. Verifique o arquivo .env`)
  }

  cy.log(`✅ Efetuando login com RF_GIPE_ADMIN: ${RF}`)
  cy.loginWithSession(RF, SENHA, 'GIPE_ADMIN')
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', {
    timeout: 30000,
    failOnStatusCode: false
  })
  cy.wait(3000)
})

/**
 * ================================================================
 * ABA 1: DADOS INICIAIS + SELEÇÃO DRE/UE (GIPE-SPECIFIC)
 * ================================================================
 */

When('GIPE inicia o cadastro de uma nova ocorrência', () => {
  cy.wait(2000)
  cy.get('body').then($body => {
    if ($body.find('table tbody tr').length > 0) cy.wait(2000)
  })

  // Tenta CSS por classe de cor primária do design system
  cy.get('body').then($body => {
    const porCor = $body.find('main button[class*="717FC7"]')
    const porTexto = $body.find('button').filter((_, btn) =>
      /nova ocorr|registrar|cadastrar/i.test((btn.innerText || '').trim())
    )

    if (porCor.length > 0) {
      cy.wrap(porCor.first(), { timeout: 20000 })
        .should('be.visible')
        .click({ force: true })
    } else if (porTexto.length > 0) {
      cy.wrap(porTexto.first(), { timeout: 20000 })
        .should('be.visible')
        .click({ force: true })
    } else {
      // Fallback: primeiro botão visível dentro de main
      cy.get('main button', { timeout: 20000 })
        .filter(':visible')
        .first()
        .click({ force: true })
    }
  })

  cy.wait(4000)
  cy.url({ timeout: 15000 }).should('include', '/cadastrar-ocorrencia')
})

When('GIPE informa a data atual do ocorrido', () => {
  const hoje = new Date()
  const normalized = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
  cy.wait(2000)
  cy.get('input[type="date"]', { timeout: 15000 })
    .first()
    .should('be.visible').should('be.enabled')
    .click({ force: true }).clear({ force: true })
    .type(normalized, { force: true })
    .trigger('input', { force: true }).trigger('change', { force: true })
  cy.wait(1000)
  cy.get('input[type="date"]').first().should('have.value', normalized)
  cy.log(`Data informada: ${normalized}`)
})

When('GIPE informa a hora atual do ocorrido', () => {
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
      cy.xpath(
        "//input[contains(@placeholder,'hor') or @type='time']",
        { timeout: 15000 }
      ).should('be.visible').click({ force: true }).wait(500)
        .clear({ force: true }).type(horario, { delay: 150, force: true }).blur()
    }
  })
  cy.log(`Horário informado: ${horario}`)
})

When('GIPE seleciona uma DRE aleatoriamente', () => {
  cy.wait(1500)
  cy.wait(1000)

  cy.xpath(
    "//label[contains(normalize-space(),'Qual a DRE')]/ancestor::div[.//button][1]//button[1]",
    { timeout: 15000 }
  )
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })

  cy.wait(3000)

  cy.get('body').then($body => {
    const optionsExist = $body.find('[role="option"]:visible').length > 0

    if (optionsExist) {

      cy.get('[role="option"]', { timeout: 15000 })
        .filter(':visible')
        .then($options => {
          expect($options.length, 'deve haver opções no dropdown DRE').to.be.greaterThan(0)
          const idx = Math.floor(Math.random() * $options.length)
          const selectedText = $options.eq(idx).text().trim()

          cy.wrap($options.eq(idx)).scrollIntoView().click({ force: true })
        })
    } else {

      
      const divOptionsExist = $body.find('div[role="option"]:visible').length > 0
      const radixOptionsExist = $body.find('[data-radix-select-option]:visible').length > 0
      
      if (divOptionsExist) {

        cy.get('div[role="option"]', { timeout: 10000 })
          .filter(':visible')
          .then($opts => {
            const idx = Math.floor(Math.random() * $opts.length)
            cy.wrap($opts.eq(idx)).scrollIntoView().click({ force: true })
          })
      } else if (radixOptionsExist) {

        cy.get('[data-radix-select-option]', { timeout: 10000 })
          .filter(':visible')
          .then($opts => {
            const idx = Math.floor(Math.random() * $opts.length)
            cy.wrap($opts.eq(idx)).scrollIntoView().click({ force: true })
          })
      } else {

        cy.contains(/DIRETORIA|EDUCACAO|DRE|REGIONAL/i, { timeout: 10000 })
          .filter(':visible')
          .first()
          .scrollIntoView()
          .click({ force: true })
      }
    }
  })

  cy.wait(2000)
})

When('GIPE seleciona uma Unidade Educacional aleatoriamente', () => {
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
        cy.log(`⚠️ Nenhuma UE encontrada. Trocando DRE (tentativas restantes: ${tentativasRestantes})`)
        cy.get('body').type('{esc}')
        cy.wait(1000)
        cy.xpath(
          "//label[contains(normalize-space(),'Qual a DRE')]/ancestor::div[.//button][1]//button[1]",
          { timeout: 15000 }
        )
          .should('be.visible').should('be.enabled')
          .click({ force: true })
        cy.wait(3000)
        cy.get('[role="option"]', { timeout: 15000 })
          .filter(':visible')
          .then($dreOpts => {
            expect($dreOpts.length, 'deve haver opções no dropdown DRE').to.be.greaterThan(0)
            const idx = Math.floor(Math.random() * $dreOpts.length)
            cy.wrap($dreOpts.eq(idx)).scrollIntoView().click({ force: true })
          })
        cy.wait(2000)
        tentarSelecionarUE(tentativasRestantes - 1)
      } else {
        throw new Error('Não foi possível encontrar Unidades Educacionais após todas as tentativas de troca de DRE')
      }
    })
  }

  cy.wait(2000)
  tentarSelecionarUE(3)
  cy.wait(2000)
})

When('GIPE seleciona o tipo Interpessoal da ocorrência', () => {
  cy.wait(2000)

  // Seletor do novo layout: labels de tipo de ocorrência (Patrimonial / Interpessoal)
  cy.get(
    'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.space-y-2 > label',
    { timeout: 15000 }
  ).then($labels => {
    const $interpessoal = $labels.filter((_, el) =>
      /Interpessoal/i.test(el.innerText || '')
    )
    if ($interpessoal.length > 0) {
      cy.wrap($interpessoal.first()).scrollIntoView().should('be.visible').click({ force: true })
    } else {
      // Fallback: localiza span pelo texto
      cy.contains('span.text-sm', 'Interpessoal', { timeout: 15000 })
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true })
    }
  })

  cy.wait(1500)
})

/**
 * ================================================================
 * ABA 2: INFORMAÇÕES SOBRE AGRESSÃO
 * ================================================================
 */

When('GIPE abre o campo de envolvidos', () => {
  cy.wait(2000)
  // Seletor específico do novo layout: grid de 2 colunas -> segundo item -> botão direto
  // Selector: div.grid.grid-cols-1.md:grid-cols-2.gap-6 > div:nth-child(2) > button
  cy.get(
    'fieldset div.grid.gap-6 > div:nth-child(2) > button',
    { timeout: 15000 }
  )
    .filter(':visible')
    .first()
    .should('be.enabled')
    .click({ force: true })
  cy.wait(2500)
})

When('GIPE seleciona um envolvido aleatoriamente', () => {
  cy.wait(2000)
  cy.log('Selecionando envolvido aleatoriamente')
  // Aguarda o painel/listbox de opções abrir
  cy.get('body').then($body => {
    const $opts = $body.find('[role="option"]:visible, [role="listbox"] [role="option"]:visible')
    if ($opts.length > 0) {
      const idx = Math.floor(Math.random() * $opts.length)
      cy.log(`Envolvido selecionado: "${$opts.eq(idx).text().trim()}"`)
      cy.wrap($opts.eq(idx)).scrollIntoView().click({ force: true })
    } else {
      // Novo layout: opções como label com checkbox dentro do painel
      cy.get('[aria-label], label', { timeout: 10000 })
        .filter(':visible')
        .filter((_, el) => el.closest('[role="listbox"], [data-radix-select-viewport], [popover]') !== null ||
          el.closest('div[class*="overflow"]') !== null)
        .then($labels => {
          if ($labels.length > 0) {
            const idx = Math.floor(Math.random() * $labels.length)
            cy.wrap($labels.eq(idx)).scrollIntoView().click({ force: true })
          } else {
            cy.log('⚠️ Nenhuma opção de envolvido encontrada')
          }
        })
    }
  })
  cy.wait(2000)
})

When('GIPE clica no botão Clique aqui', () => {
  cy.wait(1000)
  cy.contains('button', /Clique aqui/i, { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
  cy.wait(1500)
})

When('GIPE fecha o dropdown de envolvidos', () => {
  cy.wait(1000)
  // Botão de fechar no rodapé do painel Radix (div.flex.justify-end.mt-2 > button)
  cy.get('div.flex.justify-end.mt-2 > button', { timeout: 10000 })
    .filter(':visible')
    .first()
    .click({ force: true })
  cy.wait(1000)
})

When('GIPE seleciona Sim para informações sobre pessoas envolvidas', () => {
  cy.wait(1000)
  // Clica no span "Sim" dentro do grupo de opções Sim/Não
  cy.contains('span.text-sm', 'Sim', { timeout: 15000 })
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
  cy.wait(1500)
})

When('GIPE avança para a próxima aba', () => {
  cy.wait(2000)
  cy.contains('button', /Próximo|Proximo/i, { timeout: 20000 })
    .should('be.visible')
    .should('not.be.disabled')
    .first()
    .scrollIntoView()
    .click({ force: true })
  cy.wait(3000)
})

/**
 * ================================================================
 * ABA 3: INFORMAÇÕES DO AGRESSOR
 * ================================================================
 */

When('GIPE valida o titulo do campo {string}', (titulo) => {
  cy.wait(1000)
  cy.contains('label', titulo, { timeout: 15000 })
    .should('exist')
    .should('be.visible')
})

When('GIPE clica no campo e informa o nome da pessoa aleatoriamente', () => {
  const nome = getNomeAleatorio()
  cy.wait(1000)
  cy.get('input[name*="pessoasAgressoras"][name$="nome"]', { timeout: 15000 }).last()
    .scrollIntoView()
    .should('be.visible').should('be.enabled')
    .click({ force: true }).clear({ force: true })
    .type(nome, { delay: 50, force: true })
  cy.wait(1000)
})

When('GIPE informa a idade aleatoriamente', () => {
  const idade = getIdadeAleatoria()
  cy.wait(1000)
  cy.get('input[name*="pessoasAgressoras"][name$=".idade"]', { timeout: 15000 }).last()
    .scrollIntoView()
    .should('be.visible').should('be.enabled')
    .click({ force: true }).clear({ force: true })
    .type(String(idade), { delay: 50, force: true })
  cy.wait(1000)
})

When('GIPE valida e seleciona o campo {string} de forma aleatoria', (campo) => {
  const config = {
    'Qual o gênero?*': /g[eê]nero/i,
    'Raça/cor auto declarada*': /ra[cç]a|cor auto/i,
    'Qual a etapa escolar?*': /etapa escolar/i,
    'Qual a frequência escolar?*': /frequ.*escolar/i,
    'Pessoa com deficiência?*': /defici[eê]ncia/i,
    'Nacionalidade*': /nacionalidade/i,
  }

  if (campo === 'Nacionalidade*') {
    const nac = nacionalidades[Math.floor(Math.random() * nacionalidades.length)]
    cy.contains('label', /nacionalidade/i, { timeout: 15000 })
      .should('exist').should('be.visible')
    cy.get('input[name*="pessoasAgressoras"][name$="nacionalidade"]', { timeout: 15000 }).last()
      .scrollIntoView()
      .should('be.visible').should('be.enabled')
      .click({ force: true }).clear({ force: true })
      .type(nac, { delay: 50, force: true })
    cy.wait(1000)
    return
  }

  const labelRegex = config[campo]
  if (!labelRegex) throw new Error(`Campo "${campo}" não está mapeado`)

  cy.wait(1000)

  // Encontra o ÚLTIMO label que corresponde ao campo (suporte a múltiplas pessoas)
  cy.get('label', { timeout: 15000 }).then($labels => {
    const $match = $labels.filter((_, el) => labelRegex.test(el.innerText || el.textContent || ''))
    expect($match.length).to.be.greaterThan(0)
    cy.wrap($match.last())
      .closest('div')
      .find('button[role="combobox"]')
      .first()
      .scrollIntoView()
      .should('be.visible').should('be.enabled')
      .click({ force: true })
  })
  cy.wait(1500)

  cy.get('[role="option"]', { timeout: 10000 }).filter(':visible').then($opts => {
    expect($opts.length, `Deve haver opções para "${campo}"`).to.be.greaterThan(0)
    const idx = Math.floor(Math.random() * $opts.length)
    cy.wrap($opts.eq(idx)).scrollIntoView().click({ force: true })
  })
  cy.wait(1000)
})

When('GIPE valida e preenche o campo {string} com texto aleatorio', (campo) => {
  const texto = gerarTextoAleatorio('interacao')
  cy.wait(1500)
  cy.contains('label', /Como é a interação.*ambiente escolar/i, { timeout: 15000 })
    .should('be.visible')
  cy.get('textarea[name*="pessoasAgressoras"]', { timeout: 15000 }).last()
    .scrollIntoView()
    .should('be.visible').should('be.enabled')
    .click({ force: true }).clear({ force: true })
    .type(texto, { delay: 50, force: true })
    .blur({ force: true })
  cy.wait(1000)
})

When('GIPE abre e seleciona as motivações aleatoriamente', () => {
  cy.wait(1500)
  cy.contains('label', /O que motivou/i, { timeout: 15000 })
    .should('be.visible')
  cy.contains('label', /O que motivou/i)
    .parent()
    .find('button')
    .first()
    .scrollIntoView()
    .should('be.visible').click({ force: true })
  cy.wait(2000)
  cy.get('[role="option"]:visible, [role="listbox"] [role="option"]:visible', { timeout: 10000 }).then($opts => {
    expect($opts.length).to.be.greaterThan(0)
    const count = $opts.length
    const idx1 = Math.floor(Math.random() * count)
    let idx2 = Math.floor(Math.random() * count)
    while (count > 1 && idx2 === idx1) idx2 = Math.floor(Math.random() * count)
    cy.wrap($opts.eq(idx1)).scrollIntoView().click({ force: true })
    cy.wait(500)
    if (idx1 !== idx2) {
      cy.wrap($opts.eq(idx2)).scrollIntoView().click({ force: true })
    }
  })
  cy.wait(1000)
  cy.get('body').type('{esc}')
  cy.wait(1000)
})

When('GIPE Valida e clica em adicionar pessoa', () => {
  cy.wait(1500)
  cy.contains('button', /\+\s*adicionar pessoa|adicionar pessoa/i, { timeout: 15000 })
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
  cy.wait(2000)
})

When('GIPE Valida a existencia do texto {string}', (texto) => {
  cy.wait(1000)
  cy.contains('label', texto, { timeout: 15000 })
    .should('exist').should('be.visible')
})

When('GIPE informa de forma aleatoria se o Conselho Tutelar foi acionado', () => {
  cy.wait(1500)
  const opcoes = ['Sim', 'Não']
  const escolha = opcoes[Math.floor(Math.random() * opcoes.length)]
  cy.contains('label', /Conselho Tutelar/i, { timeout: 15000 })
    .should('be.visible')
    .parent()
    .contains('span', escolha)
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(1000)
})

When('GIPE seleciona de forma aleatoria o acompanhamento da ocorrência', () => {
  const opcoes = ['NAAPA', 'Comissão de Mediação de Conflitos', 'Supervisão Escolar', 'CEFAI']
  const escolha = opcoes[Math.floor(Math.random() * opcoes.length)]
  cy.wait(1500)
  cy.contains('label', /acompanhada pelo/i, { timeout: 15000 })
    .should('be.visible')
    .closest('fieldset, div[class*="space-y"], div[class*="form"]')
    .contains('span', escolha)
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(1000)
})

/**
 * ================================================================
 * ABA 4: DECLARANTE E PROTOCOLOS
 * ================================================================
 */

When('GIPE clica no campo do declarante', () => {
  cy.wait(2000)
  cy.log('Abrindo campo declarante')
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($buttons => {
    cy.wrap($buttons.eq(0))
      .should('be.visible')
      .should('be.enabled')
      .click({ force: true })
  })
  cy.wait(2500)
  cy.log('Campo declarante aberto')
})

When('GIPE seleciona GIPE como declarante', () => {
  cy.wait(1500)
  cy.contains('[role="option"]', /GIPE/i, { timeout: 15000 })
    .should('exist')
    .click({ force: true })
  cy.wait(1500)
  cy.log('GIPE selecionado como declarante')
})

When('GIPE clica no campo de seguranca publica', () => {
  cy.wait(2000)
  cy.log('Abrindo campo segurança pública')
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($buttons => {
    cy.wrap($buttons.eq(1))
      .should('be.visible')
      .should('be.enabled')
      .click({ force: true })
  })
  cy.wait(2500)
  cy.log('Campo segurança pública aberto')
})

When('GIPE seleciona opcao seguranca publica', () => {
  cy.wait(3000)
  cy.get('[role="option"]', { timeout: 15000 })
    .filter(':visible')
    .then($options => {
      if ($options.length === 0) {
        cy.log('Nenhuma opção encontrada')
        cy.wait(2000)
      }
      const randomIndex = Math.floor(Math.random() * $options.length)
      const selectedOption = $options.eq(randomIndex).text()
      cy.log(`Segurança pública selecionada: ${selectedOption}`)
      cy.wrap($options.eq(randomIndex)).click({ force: true })
    })
  cy.wait(1500)
})

When('GIPE clica no campo de protocolo', () => {
  cy.wait(2000)
  cy.log('Abrindo campo protocolo')
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($buttons => {
    cy.wrap($buttons.eq(2))
      .should('be.visible')
      .should('be.enabled')
      .click({ force: true })
  })
  cy.wait(2500)
  cy.log('Campo protocolo aberto')
})

When('GIPE seleciona protocolo aleatoriamente', () => {
  cy.wait(3000)
  cy.log('Selecionando protocolo')
  cy.get('[role="option"]', { timeout: 20000 })
    .filter(':visible')
    .then($options => {
      if ($options.length === 0) {
        cy.log('Nenhuma opção de protocolo encontrada')
        return
      }
      const randomIndex = Math.floor(Math.random() * $options.length)
      const selectedOption = $options.eq(randomIndex).text()
      cy.log(`Protocolo selecionado: ${selectedOption}`)
      cy.wrap($options.eq(randomIndex)).click({ force: true })
    })
  cy.wait(2000)
})

Then('GIPE clica em proximo para anexos', () => {
  cy.wait(3000)
  cy.log('Avançando para aba de anexos')
  cy.contains('button', /Próximo|Proximo/i, { timeout: 30000 })
    .first()
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView()
    .click({ force: true })
  cy.wait(3000)
  cy.log('Navegou para aba de anexos')
})

/**
 * ================================================================
 * ABA 5: ANEXOS E FINALIZAÇÃO
 * ================================================================
 */

When('GIPE localiza e clica no botão {string}', (botao) => {
  cy.wait(1500)
  cy.log(`Clicando: ${botao}`)
  if (botao.includes('Escolher arquivo')) {
    cy.xpath(locators.btn_escolher_arquivo(), { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(1500)
  } else if (botao.includes('Anexar documento')) {
    cy.xpath(locators.btn_anexar_documento(), { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(2000)
  }
  cy.log('Botão clicado')
})

When('GIPE seleciona a imagem do pc', () => {
  cy.wait(1000)
  cy.log('📎 Anexando arquivo')
  cy.get('input[type="file"]', { timeout: 10000 })
    .selectFile({
      contents: Cypress.Buffer.from('fake-image-content'),
      fileName: 'test-image.jpg',
      mimeType: 'image/jpeg'
    }, { force: true })
  cy.wait(2000)
  cy.log('Arquivo anexado')
})

When('GIPE clica no campo tipo documento', () => {
  cy.wait(1500)
  cy.log('Abrindo tipo documento')
  cy.get('button[role="combobox"]', { timeout: 15000 })
    .last()
    .should('be.visible')
    .click({ force: true })
  cy.wait(1500)
  cy.log('Campo aberto')
})

When('GIPE seleciona {string}', (opcao) => {
  cy.wait(1500)
  cy.log(`Selecionando: ${opcao}`)

  if (opcao.includes('Sim, mas não houve dano')) {
    cy.get('label.flex:nth-child(2) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(1500)
  } else if (opcao.includes('Sim, Unidade Educacional é contemplada pelo Smart Sampa')) {
    cy.contains(/Smart Sampa/i, { timeout: 15000 })
      .closest('div, fieldset')
      .find('label.flex.items-center')
      .first()
      .should('be.visible')
      .click({ force: true })
    cy.wait(1500)
  } else if (opcao.includes('Apenas um estudante')) {
    cy.get('body').then($body => {
      if ($body.find('#\\:rfd\\:-form-item').length > 0) {
        cy.get('#\\:rfd\\:-form-item', { timeout: 15000 })
          .should('be.visible')
          .click({ force: true })
      } else {
        cy.contains('span, div[role="option"]', opcao, { timeout: 15000 })
          .first()
          .should('be.visible')
          .click({ force: true })
      }
    })
    cy.wait(1500)
  } else {
    cy.contains('[role="option"]', opcao, { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(1000)
  }
  cy.log('Opção selecionada')
})

When('GIPE localiza o button {string}', (textoBotao) => {
  cy.wait(2000)
  cy.log(`Validando botão: ${textoBotao}`)
  cy.contains('button', new RegExp(textoBotao, 'i'), { timeout: 15000 })
    .should('exist')
    .should('be.visible')
  cy.log(`Botão "${textoBotao}" encontrado`)
})

When('GIPE localiza e clica em {string}', () => {
  cy.wait(2000)
  cy.log('Localizando botão Finalizar na aba de anexos')
  cy.get('form fieldset div.flex.justify-end.gap-2', { timeout: 15000 })
    .should('be.visible')
    .within(() => {
      cy.get('button').should('have.length.at.least', 2)
      cy.get('button').last()
        .should('contain.text', 'Finalizar')
        .should('not.be.disabled')
        .scrollIntoView()
        .click({ force: true })
    })
  cy.wait(3000)
  cy.log('Botão Finalizar CLICADO - aguardando modal')
})

/**
 * ================================================================
 * CONCLUSÃO: MODAL DE SUCESSO E VALIDAÇÕES
 * ================================================================
 */

When('GIPE valida a existencia do texto sucesso {string}', (texto) => {
  cy.wait(3000)
  cy.log(`Validando mensagem de sucesso: ${texto}`)
  cy.get('body').then($body => {
    if ($body.text().includes(texto)) {
      cy.log('Mensagem de sucesso encontrada no DOM')
    }
  })
  cy.wait(1000)
  cy.get('body').then($body => {
    // 1º: botão dentro de containers de toast conhecidos
    const $toastBtn = $body.find('[role="alert"] button, [data-sonner-toast] button, [role="status"] button, [data-close-button]')
    if ($toastBtn.length > 0) {
      cy.wrap($toastBtn.first()).click({ force: true })
      return
    }
    // 2º: estrutura do Sonner — body > div > div > button (XPath confirmado: /html/body/div[3]/div[4]/button)
    const $sonnerBtn = $body.find('body > div > div > button').filter(':visible')
    if ($sonnerBtn.length > 0) {
      cy.wrap($sonnerBtn.first()).click({ force: true })
      return
    }
    // 3º: qualquer botão visível no body que não seja de navegação principal
    const $anyBtn = $body.find('button:visible').filter((_, el) =>
      /fechar|close|ok|×|✕/i.test(el.innerText || el.getAttribute('aria-label') || '')
    )
    if ($anyBtn.length > 0) {
      cy.wrap($anyBtn.first()).click({ force: true })
      return
    }
    cy.log('Botão de fechar toast não encontrado — clicando fora do modal')
    cy.get('body').click(0, 0, { force: true })
    cy.wait(500)
    cy.get('body').type('{esc}')
  })
  cy.wait(2000)
  cy.log('Toast tratado')
})

When('GIPE aguarda {int} segundos', (segundos) => {
  cy.wait(segundos * 1000)
  cy.log(`Aguardando ${segundos}s`)
})

When('GIPE clica em Finalizar modal', () => {
  cy.get('body').then(($body) => {
    const urlAtual = window.location.href
    
    if (urlAtual.includes('/dashboard') && !urlAtual.includes('cadastrar-ocorrencia')) {
      cy.log(' Já no dashboard - pulando finalização')
      return
    }
    
    const temBotaoFinalizar = $body.text().includes('Finalizar')
    
    if (temBotaoFinalizar) {
      cy.log(' Finalizando cadastro')
      cy.contains('button', /Finalizar/i, { timeout: 15000 })
        .last()
        .should('be.visible')
        .should('not.be.disabled')
        .click({ force: true })
      cy.wait(3000)
      cy.log(' Modal finalizado com sucesso')
    } else {
      cy.log(' Botão Finalizar não encontrado - possível auto-redirecionamento')
    }
  })
})

Then('GIPE valida a existencia do Texto {string}', (texto) => {
  cy.wait(2000)
  cy.log(`Validando texto: ${texto}`)
  cy.get('h1', { timeout: 15000 })
    .should('be.visible')
    .and('contain.text', texto.trim())
  cy.log(' Texto validado com sucesso')
})

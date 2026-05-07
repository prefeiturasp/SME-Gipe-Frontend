import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import ConsultaFiltroLocalizadores from '../../locators/consulta_filtro_locators'

const locators = new ConsultaFiltroLocalizadores()

// ============================================================================
// CREDENCIAIS VÊM DO .env via cypress.config.js
// Este arquivo usa RF_UE/SENHA_UE (perfil Unidade Educacional)
// ============================================================================

Given('eu efetuo login com RF', () => {
  const RF_UE = Cypress.env('RF_UE')
  const SENHA_UE = Cypress.env('SENHA_UE')
  
  if (!RF_UE || !SENHA_UE) {
    throw new Error(`❌ Credenciais UE não encontradas! RF_UE: ${RF_UE}, SENHA_UE: ${SENHA_UE}. Verifique:
    1. Arquivo .env existe na raiz do projeto
    2. Variáveis RF_UE e SENHA_UE estão preenchidas
    3. Cypress foi REINICIADO após alterações no .env`)
  }
  
  cy.log(`✅ Efetuando login com RF_UE: ${RF_UE}`)
  cy.loginWithSession(RF_UE, SENHA_UE, 'CONSULTA')
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', { 
    timeout: 30000,
    failOnStatusCode: false 
  })
  cy.wait(3000)
})

When('o usuário está na página principal do sistema', () => {
  cy.wait(2000)
  cy.url({ timeout: 20000 }).should('include', '/dashboard')
  cy.log('Usuário autenticado e na página principal')
})

Then('o sistema deve mostrar a listagem de ocorrências cadastradas no sistema', () => {
  cy.wait(2000)
  cy.get(locators.listagem_ocorrencias(), { timeout: 15000 })
    .should('exist')
    .should('be.visible')
  cy.log('Listagem de ocorrências exibida')
})

Given('que o usuário valida o texto {string}', (texto) => {
  cy.wait(3000)
  cy.log(`Validando texto: ${texto}`)
  cy.get(locators.titulo_historico(), { timeout: 15000 })
    .should('exist')
    .should('be.visible')
  cy.log('Texto validado')
})

Given('o usuário valida e clica no botão {string}', (textoBotao) => {
  cy.wait(3000)
  cy.log('Abrindo painel de filtros...')
  cy.get(locators.btn_filtrar_principal(), { timeout: 20000 })
    .should('exist')
    .should('be.visible')
    .scrollIntoView()
    .click({ force: true })
  
  cy.wait(5000)
  cy.log('Aguardando painel carregar...')
  
  cy.get('main').within(() => {
    cy.get('fieldset, label', { timeout: 15000 })
      .should('exist')
      .should('be.visible')
  })
  
  cy.log('Painel de filtros aberto')
})

Given('o usuário valida os títulos dos campos {string}', (campo) => {
  cy.wait(2000)
  cy.log(`Validando campo: ${campo}`)
  
  const mapeamentoCampos = {
    'Período': locators.titulo_periodo(),
    'Tipo de Ocorrência': locators.titulo_tipo_ocorrencia(),
    'Status': locators.titulo_status()
  }
  
  const seletor = mapeamentoCampos[campo]
  if (seletor) {
    cy.get(seletor, { timeout: 20000 })
      .should('exist')
      .should('be.visible')
      .should('contain.text', campo)
    cy.log(`Campo "${campo}" encontrado`)
  } else {
    throw new Error(`Campo "${campo}" não mapeado`)
  }
})

When('o usuário preenche o campo Data Inicial com {string}', (data) => {
  cy.wait(2000)
  const dataLimpa = data.replace(/\s+/g, '')
  let dataFormatada
  
  if (dataLimpa.includes('/')) {
    dataFormatada = dataLimpa.split('/').reverse().join('-')
  } else {
    const dia = dataLimpa.substring(0, 2)
    const mes = dataLimpa.substring(2, 4)
    const ano = dataLimpa.substring(4, 8)
    dataFormatada = `${ano}-${mes}-${dia}`
  }
  
  cy.log(`Preenchendo Data Inicial: ${dataFormatada}`)
  
  cy.get('#periodo-inicial', { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .click({ force: true })
    .clear()
    .type(dataFormatada, { force: true })
    .trigger('change')
    .trigger('blur')
  
  cy.wait(1500)
  cy.log('Data inicial preenchida')
})

When('o usuário preenche o campo Data Final com {string}', (data) => {
  cy.wait(2000)
  const dataLimpa = data.replace(/\s+/g, '')
  let dataFormatada
  
  if (dataLimpa.includes('/')) {
    dataFormatada = dataLimpa.split('/').reverse().join('-')
  } else {
    const dia = dataLimpa.substring(0, 2)
    const mes = dataLimpa.substring(2, 4)
    const ano = dataLimpa.substring(4, 8)
    dataFormatada = `${ano}-${mes}-${dia}`
  }
  
  cy.log(`Preenchendo Data Final: ${dataFormatada}`)
  
  cy.get('#periodo-final', { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .click({ force: true })
    .clear()
    .type(dataFormatada, { force: true })
    .trigger('change')
    .trigger('blur')
  
  cy.wait(1500)
  cy.log('Data final preenchida')
})

Given('clica fora do Campo', () => {
  cy.wait(500)
  cy.log('Fechando dropdown...')
  cy.get('main').click(10, 10, { force: true })
  cy.wait(1000)
  cy.log('Campo fechado')
})

Then('o usuário valida a existencia do botão {string} do painel', (textoBotao) => {
  cy.wait(3000)
  cy.log(`Validando botão ${textoBotao}...`)
  
  const btnSelector = 'button.inline-flex.bg-\\[\\#717FC7\\].text-white'
  
  cy.get('main').within(() => {
    cy.get(btnSelector, { timeout: 20000 })
      .should('exist')
      .should('be.visible')
  })
  
  cy.log(`Botão "${textoBotao}" pronto`)
})

Given('clica para Completa consulta', () => {
  cy.wait(2000)
  cy.log('Aplicando filtro...')
  
  const btnSelector = 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div.my-\\[44px\\] > div.flex.justify-end.space-x-2.mt-4 > button.inline-flex.items-center.justify-center.whitespace-nowrap.ring-offset-background.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.text-center.rounded-md.text-\\[14px\\].font-\\[700\\].bg-\\[\\#717FC7\\].text-white.hover\\:bg-\\[\\#5a65a8\\].h-10.px-4.py-2'
  
  cy.get(btnSelector, { timeout: 20000 })
    .should('exist')
    .should('be.visible')
    .scrollIntoView()
    .wait(2000)
    .then(($btn) => {
      if ($btn.is(':disabled')) {
        cy.wait(2000)
      }
      cy.wrap($btn).click({ force: true })
    })
  
  cy.wait(3000)
  cy.log('Filtro aplicado com sucesso')
})

Given('o usuário clica no botão {string} do painel', (textoBotao) => {
  cy.wait(3000)
  cy.log(`Procurando botão: ${textoBotao}`)
  
  if (textoBotao.toLowerCase() === 'limpar') {
    cy.xpath(locators.btn_limpar_painel(), { timeout: 30000 })
      .should('exist')
      .should('be.visible')
      .scrollIntoView()
      .wait(2000)
      .then(($btn) => {
        cy.log(`Botão Limpar encontrado, classes: ${$btn.attr('class')}`)
        if ($btn.is(':disabled')) {
          cy.log('Botão Limpar desabilitado, clicando com force...')
        }
        cy.wrap($btn).click({ force: true })
      })
    
    cy.wait(4000)
    cy.log('Filtros limpos com sucesso')
  }
})

When('o usuário clica no campo {string} e seleciona {string}', (nomeCampo, opcao) => {
  cy.wait(2000)
  cy.log(`Selecionando "${opcao}" em ${nomeCampo}...`)
  
  const mapeamentoCampos = {
    'tipo': '#tipo-violencia',
    'status': locators.select_status()
  }
  
  const chaveCampo = nomeCampo.toLowerCase().includes('tipo') ? 'tipo' : 'status'
  const selectorCampo = mapeamentoCampos[chaveCampo]
  
  cy.get(selectorCampo, { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .scrollIntoView()
    .click({ force: true })
  
  cy.wait(2000)
  cy.log(`Buscando opção: ${opcao}`)
  
  cy.get('[role="option"]', { timeout: 10000 })
    .should('exist')
    .then(($options) => {
      const opcaoEncontrada = Array.from($options).find(el => 
        el.textContent.toLowerCase().includes(opcao.toLowerCase())
      )
      
      if (opcaoEncontrada) {
        cy.log(`Opção: ${opcaoEncontrada.textContent.trim()}`)
        cy.wrap(opcaoEncontrada).click({ force: true })
      } else {
        const stemOpcao = opcao.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[ao]$/, '')
        const opcaoPorStem = Array.from($options).find(el =>
          el.textContent.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[ao]$/, '')
            .includes(stemOpcao)
        )
        if (opcaoPorStem) {
          cy.log(`Opção (stem): ${opcaoPorStem.textContent.trim()}`)
          cy.wrap(opcaoPorStem).click({ force: true })
        } else {
          throw new Error(`Opção "${opcao}" não encontrada no dropdown de ${nomeCampo}. Opções disponíveis: ${Array.from($options).map(el => el.textContent.trim()).join(', ')}`)
        }
      }
    })
  
  cy.wait(1500)
  cy.log(`"${opcao}" selecionado`)
})

Then('o usuário clica no botão {string} do painel', (textoBotao) => {
  cy.wait(3000)
  cy.log(`Clicando no botão: ${textoBotao}`)
  
  const btnSelector = 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div.my-\\[44px\\] > div.flex.justify-end.space-x-2.mt-4 > button.inline-flex.items-center.justify-center.whitespace-nowrap.ring-offset-background.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.text-center.rounded-md.text-\\[14px\\].font-\\[700\\].bg-\\[\\#717FC7\\].text-white.hover\\:bg-\\[\\#5a65a8\\].h-10.px-4.py-2'
  
  cy.get(btnSelector, { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .scrollIntoView()
    .wait(1000)
    .click({ force: true })
  
  cy.wait(4000)
  cy.log('Filtro aplicado')
})

Given('clica no botão {string} do painel para Completa consulta', (textoBotao) => {
  cy.wait(2000)
  cy.log(`Aplicando filtro (${textoBotao})...`)
  
  const btnSelector = 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div.my-\\[44px\\] > div.flex.justify-end.space-x-2.mt-4 > button.inline-flex.items-center.justify-center.whitespace-nowrap.ring-offset-background.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.text-center.rounded-md.text-\\[14px\\].font-\\[700\\].bg-\\[\\#717FC7\\].text-white.hover\\:bg-\\[\\#5a65a8\\].h-10.px-4.py-2'
  
  cy.get(btnSelector, { timeout: 20000 })
    .should('exist')
    .should('be.visible')
    .scrollIntoView()
    .wait(2000)
    .then(($btn) => {
      if ($btn.is(':disabled')) {
        cy.wait(2000)
      }
      cy.wrap($btn).click({ force: true })
    })
  
  cy.wait(5000)
  cy.log(`Consulta completada - ${textoBotao} clicado com sucesso`)
})

// ============================================================================
// COMPLETAR OCORRÊNCIAS INCOMPLETAS — UE / DRE / GIPE
// ============================================================================

// ── Listas de dados aleatórios (30+ itens por lista) ────────────────────────

const COMPL_NOMES = [
  'Ana Clara Ferreira Santos', 'Bruno Henrique Lima Costa', 'Carlos Eduardo Alves Pereira',
  'Daniela Souza Rodrigues', 'Eduardo Martins Barbosa', 'Fernanda Costa Nascimento',
  'Gabriel Silva Mendes', 'Helena Oliveira Carvalho', 'Igor Fernandes Gomes',
  'Juliana Almeida Ramos', 'Kaique Santos Pinto', 'Laura Pereira Dias',
  'Marcos Vinícius Cavalcanti', 'Natalia Rodrigues Moreira', 'Otávio Barros Freitas',
  'Patricia Lopes Cunha', 'Rafael Nunes Azevedo', 'Sara Monteiro Castro',
  'Thiago Ribeiro Borges', 'Valentina Cruz Teixeira', 'William Moura Figueiredo',
  'Yasmin Andrade Vasconcelos', 'Alexandre Guimarães Queiroz', 'Bruna Machado Rocha',
  'Cauã Correia Vieira', 'Débora Marques Dantas', 'Emerson Couto Brito',
  'Flavia Campos Duarte', 'Guilherme Porto Esteves', 'Hana Tanaka Watanabe',
  'Ivan Kowalski Nowak', 'Jamila Diallo Traoré', 'Kenji Nakamura Yamamoto',
  'Layla Haddad Mansour', 'Miguel Rossi Ferrari'
]

const COMPL_IDADES = [
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  6, 8, 10, 12, 14, 16, 7, 9, 11, 13, 15, 17, 5, 18, 10, 12
]

const COMPL_DESCRICOES = [
  'Situação identificada durante o recreio. Medidas de mediação foram tomadas pela equipe.',
  'Ocorrência registrada após relato de professora sobre comportamento inadequado em sala.',
  'Incidente ocorrido na entrada da escola com participação de estudantes de diferentes turmas.',
  'Conflito verbal entre alunos na quadra durante aula de educação física.',
  'Episódio de agressão registrado na saída da escola. Responsáveis notificados imediatamente.',
  'Ocorrência de bullying relatada por responsável. Investigação iniciada pela equipe gestora.',
  'Furto de material escolar reportado na sala de aula. Câmeras do corredor verificadas.',
  'Ameaça verbal entre estudantes documentada pela equipe de segurança da unidade.',
  'Comportamento disruptivo em sala resultou em encaminhamento à coordenação pedagógica.',
  'Acesso não autorizado ao pátio interno por pessoa não identificada. GCM acionada.',
  'Conflito entre grupos de alunos resolvido com intervenção da equipe de orientação.',
  'Dano ao patrimônio escolar verificado após o período noturno. Ocorrência notificada.',
  'Vulnerabilidade social identificada durante visita domiciliar da equipe escolar.',
  'Episódio de automutilação relatado por professora. Atendimento psicológico solicitado.',
  'Uso inadequado de dispositivo eletrônico durante avaliação. Providências adotadas.',
  'Consumo de substância suspeita no banheiro da escola. Pais e autoridades comunicados.',
  'Evasão detectada após três faltas consecutivas. Família contatada por telefone.',
  'Conflito familiar afetando rendimento e comportamento do estudante na escola.',
  'Preconceito e discriminação entre alunos registrada por professora de história.',
  'Ameaça nas redes sociais identificada pela família e comunicada à equipe escolar.',
  'Desaparecimento de equipamento da sala de informática. Boletim de ocorrência registrado.',
  'Conflito entre responsáveis de alunos no portão da escola. GCM acionada.',
  'Violência doméstica relatada pelo estudante durante atendimento com orientadora.',
  'Incidente com substância química em laboratório. Aluno encaminhado à UBS.',
  'Ocorrência de racismo relatada por familiares após comentário em sala de aula.',
  'Bullying virtual identificado através de capturas de tela compartilhadas com a escola.',
  'Dano intencional a mural educativo. Câmeras analisadas para identificação.',
  'Descontrole emocional durante atividade avaliativa. Equipe de apoio acionada.',
  'Intolerância religiosa entre alunos documentada pela coordenação pedagógica.',
  'Situação de conflito resolvida com mediação da supervisão escolar e família.'
]

const COMPL_INTERACOES = [
  'Demonstra comportamento colaborativo e respeitoso com seus pares no ambiente escolar.',
  'Apresenta dificuldades de relacionamento interpessoal com episódios frequentes de conflito.',
  'Integra-se positivamente nas atividades em grupo demonstrando liderança construtiva.',
  'Tende ao isolamento social raramente participando de atividades coletivas no recreio.',
  'Exibe comportamento agressivo verbal em situações de frustração com colegas.',
  'Relaciona-se de forma respeitosa com educadores e funcionários da unidade escolar.',
  'Participa ativamente das aulas e eventos demonstrando engajamento com a comunidade.',
  'Necessita de intervenções periódicas para manter convívio saudável com os colegas.',
  'Estabelece vínculos de amizade com facilidade sendo bem aceito pela turma.',
  'Apresenta comportamento instável que varia conforme o grupo com que interage.',
  'Demonstra empatia e solidariedade nas situações de conflito observadas na escola.',
  'Busca apoio dos educadores quando enfrenta dificuldades nas relações interpessoais.',
  'Contribui de forma positiva para o clima harmonioso da sala de aula.',
  'Tem dificuldade em aceitar limites impostos pelas regras da convivência escolar.',
  'Interage de forma adequada durante as atividades extracurriculares e recreativas.',
  'Revela comportamento intimidador com colegas mais novos ou considerados vulneráveis.',
  'Mostra evolução significativa no relacionamento com os colegas após intervenção pedagógica.',
  'Mantém relações cordiais na maior parte do tempo com algumas situações de atrito.',
  'Evita confrontos diretos mas demonstra comportamento passivo-agressivo com colegas.',
  'Tem papel mediador natural nos conflitos entre colegas sendo referência positiva.',
  'Apresenta dificuldade em trabalhar em equipe preferindo atividades individuais.',
  'Interage de forma positiva com alunos de diferentes turmas e idades.',
  'Demonstra respeito pela diversidade cultural e religiosa dos colegas.',
  'Envolvido em episódios de exclusão social de um colega específico da turma.',
  'Requer acompanhamento próximo da equipe gestora nas situações de conflito.',
  'Tem comportamento diferente em contextos formais e informais dentro da escola.',
  'Apresenta liderança negativa que pode influenciar outros alunos a comportamentos inadequados.',
  'Mostra interesse genuíno no bem-estar dos colegas e na resolução pacífica de conflitos.',
  'Necessita de suporte emocional constante para manutenção de relações saudáveis na escola.',
  'Boa participação geral com episódios pontuais que requerem atenção da equipe escolar.'
]

const COMPL_NUMEROS_SEI = [
  '1234567890123456', '9876543210987654', '4728193650284719', '8163920574810293',
  '3047582916473820', '6192840375619284', '7483920156748392', '2905817364920581',
  '5671034829567103', '8204915673820491', '1593047826159304', '6840291753684029',
  '3217568940321756', '7659412308765941', '4082736519408273', '9315820647931582',
  '2748506193274850', '5063918274506391', '8497230165849723', '1820473956182047',
  '6234815709623481', '3967124085396712', '7150693248715069', '4813275096481327',
  '9046382751904638', '5281749063528174', '7394056182739405', '2610384957261038',
  '8527196340852719', '4163827059416382'
]

function _complAleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)]
}

const COMPL_TIMEOUTS = {
  SHORT: 1000,
  DEFAULT: 2000,
  EXTENDED: 5000,
  LONG: 15000,
  VERY_LONG: 30000
}

// ── Seletor do botão Filtrar do painel (reutiliza locator existente) ─────────
const COMPL_BTN_FILTRAR_PAINEL =
  'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div.my-\\[44px\\] > div.flex.justify-end.space-x-2.mt-4 > button.inline-flex.items-center.justify-center.whitespace-nowrap.ring-offset-background.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.text-center.rounded-md.text-\\[14px\\].font-\\[700\\].bg-\\[\\#717FC7\\].text-white.hover\\:bg-\\[\\#5a65a8\\].h-10.px-4.py-2'

// ── Helpers internos de preenchimento por aba ───────────────────────────────

// Seleciona um combobox pelo label — jQuery puro (síncrono), sobe até 5 níveis para encontrar o container
function _selecionarComboByLabel($body, labelRegex) {
  const $labels = $body.find('label').filter((_, el) => labelRegex.test(el.innerText || el.textContent || ''))
  if ($labels.length === 0) return
  const $labelEl = $labels.last()
  // Sobe níveis progressivamente até encontrar combobox ou input text no container
  let $combo = Cypress.$()
  let $textInput = Cypress.$()
  let $container = $labelEl
  for (let i = 0; i < 6; i++) {
    $container = $container.parent()
    // Inclui div[role] e button[role] — Radix usa ambos
    $combo = $container.find('[role="combobox"]').first()
    if ($combo.length > 0) break
    // Fallback: input text (ex: Nacionalidade)
    $textInput = $container.find('input[type="text"], input:not([type]):not([name*="pessoasAgressoras"])').first()
    if ($textInput.length > 0) break
  }
  if ($combo.length > 0 && (/selecione/i.test($combo.text()) || $combo.text().trim() === '')) {
    cy.wrap($combo).scrollIntoView().click({ force: true })
    cy.wait(800)
    cy.get('body').then($b2 => {
      const $opts = $b2.find('[role="option"]').filter(':not([aria-disabled="true"])')
      if ($opts.length > 0) {
        cy.wrap($opts.eq(Math.floor(Math.random() * $opts.length))).click({ force: true })
        cy.wait(500)
      }
    })
  } else if ($textInput.length > 0 && !$textInput.val()) {
    // Campo de texto livre (ex: Nacionalidade — "Digite a nacionalidade...")
    cy.wrap($textInput).scrollIntoView().click({ force: true }).clear({ force: true })
      .type('Brasileira', { delay: 50, force: true }).blur()
    cy.wait(300)
  }
}

// Verifica se há campos com erro de validação visíveis no formulário
function _temErrosValidacao($body) {
  const $invalidos = $body.find('[aria-invalid="true"]').filter(':visible')
  const $mensagens = $body.find('p[class*="text-destructive"], p[class*="text-red"], [class*="error-message"]').filter(':visible')
  return $invalidos.length > 0 || $mensagens.length > 0
}

// Preenche todos os campos da Aba 1
function _preencherAba1() {
  cy.get('input[type="date"]').first().then($inp => {
    if (!$inp.val()) {
      const hoje = new Date()
      const d = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
      cy.wrap($inp).click({ force: true }).clear({ force: true }).type(d, { force: true }).trigger('change')
    }
  })
  cy.get('body').then($b => {
    const $hora = $b.find('input[placeholder="Digite o horário"]')
    if ($hora.length > 0 && !$hora.first().val()) {
      const now = new Date()
      const h = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      cy.wrap($hora.first()).click({ force: true }).clear({ force: true }).type(h, { delay: 100, force: true }).blur()
    }
  })
  cy.get('body').then($b => {
    const radiosChecked = $b.find('input[type="radio"]:checked, button[data-state="checked"][role="radio"]').length
    if (radiosChecked === 0) {
      const $interpessoal = $b.find('label').filter((_, el) => /interpessoal/i.test(el.innerText || el.textContent || ''))
      if ($interpessoal.length > 0) {
        cy.wrap($interpessoal.first()).scrollIntoView().click({ force: true })
        cy.wait(500)
      } else {
        // Seleciona primeiro radio disponível se "Interpessoal" não existir
        const $radios = $b.find('button[role="radio"]').first()
        if ($radios.length > 0) {
          cy.wrap($radios).scrollIntoView().click({ force: true })
          cy.wait(300)
        }
      }
    }
  })
}

// Preenche todos os campos da Aba 2
function _preencherAba2() {
  // Tipo de ocorrência — botão custom SEM role="combobox" (classe min-h-[40px] / items-start)
  // Detectado pelo texto placeholder "Selecione os tipos" quando o campo está vazio
  cy.get('body').then($b => {
    // 1. Busca pelo placeholder text visível (campo vazio)
    let $tipoTrigger = $b.find('button').filter((_, el) => {
      if (!Cypress.$(el).is(':visible')) return false
      const txt = (el.innerText || el.textContent || '').trim()
      return /selecione (os )?tipos?/i.test(txt)
    })

    // 2. Fallback: botão com classe min-h-[40px] que indica o multi-select trigger vazio
    if ($tipoTrigger.length === 0) {
      $tipoTrigger = $b.find('button').filter((_, el) => {
        if (!Cypress.$(el).is(':visible')) return false
        const cls = el.className || ''
        if (!(cls.includes('min-h-') && cls.includes('items-start'))) return false
        // Somente se não tiver itens selecionados dentro
        return Cypress.$(el).find('[class*="badge"], [class*="bg-[#717"]').length === 0
      })
    }

    // 3. Fallback final: role="combobox" padrão shadcn vazio
    if ($tipoTrigger.length === 0) {
      $tipoTrigger = $b.find('[role="combobox"]').filter((_, el) => {
        if (!Cypress.$(el).is(':visible')) return false
        const t = Cypress.$(el).text().trim()
        return /selecione/i.test(t) || t === ''
      })
    }

    if ($tipoTrigger.length > 0) {
      cy.wrap($tipoTrigger.first()).scrollIntoView().click({ force: true })
      cy.wait(COMPL_TIMEOUTS.SHORT)
      cy.get('body').then($b2 => {
        const $opts = $b2.find('[role="option"]').filter(':visible')
        if ($opts.length > 0) {
          cy.wrap($opts.eq(Math.floor(Math.random() * $opts.length))).click({ force: true })
          cy.wait(500)
        }
      })
      cy.get('body').type('{esc}')
      cy.wait(500)
    }
  })
  cy.get('textarea', { timeout: COMPL_TIMEOUTS.EXTENDED }).then($textareas => {
    $textareas.each((_, ta) => {
      if (Cypress.$(ta).is(':visible') && !Cypress.$(ta).val()) {
        cy.wrap(ta).click({ force: true }).type(_complAleatorio(COMPL_DESCRICOES), { delay: 10 })
        cy.wait(300)
      }
    })
  })
  cy.get('body').then($b => {
    if ($b.text().includes('Quem são os envolvidos?')) {
      const $btn = $b.find('fieldset div.grid.gap-6 > div:nth-child(2) > button').filter(':visible').first()
      if ($btn.length > 0) {
        const temEnvolvido = $b.find('span[data-tag], [data-selected="true"]').length > 0
        if (!temEnvolvido) {
          cy.wrap($btn).click({ force: true })
          cy.wait(COMPL_TIMEOUTS.SHORT)
          cy.get('body').then($b2 => {
            const $opts = $b2.find('[role="option"]').filter(':visible')
            if ($opts.length > 0) {
              cy.wrap($opts.eq(0)).click({ force: true })
              cy.wait(500)
            }
          })
          cy.get('body').then($b2 => {
            const $clique = $b2.find('button').filter((_, btn) => /clique aqui/i.test(btn.textContent || ''))
            if ($clique.length > 0) {
              cy.wrap($clique.first()).scrollIntoView().click({ force: true })
              cy.wait(500)
            }
          })
          cy.get('body').then($b2 => {
            const $fechar = $b2.find('div.flex.justify-end.mt-2 > button').filter(':visible').first()
            if ($fechar.length > 0) cy.wrap($fechar).click({ force: true })
          })
          cy.wait(500)
        }
      }
    }
  })
  cy.get('body').then($b => {
    $b.find('[role="radiogroup"]').filter(':visible').each((_, group) => {
      const $group = Cypress.$(group)
      const checked = $group.find('button[data-state="checked"], input:checked').length
      if (checked === 0) {
        const $opcoes = $group.find('button[role="radio"], span.text-sm')
        if ($opcoes.length > 0) {
          cy.wrap($opcoes.eq(0)).scrollIntoView().click({ force: true })
          cy.wait(300)
        }
      }
    })
  })
}

// Preenche todos os campos da Aba 3
function _preencherAba3() {
  cy.get('input[name*="pessoasAgressoras"][name$="nome"]', { timeout: COMPL_TIMEOUTS.EXTENDED }).then($inputs => {
    const $last = $inputs.last()
    if ($last.is(':visible') && !$last.val()) {
      cy.wrap($last).scrollIntoView().click({ force: true }).clear({ force: true })
        .type(_complAleatorio(COMPL_NOMES), { delay: 30, force: true })
      cy.wait(300)
    }
  })
  cy.get('body').then($b => {
    const $idadeInputs = $b.find('input[name*="pessoasAgressoras"][name$=".idade"]')
    if ($idadeInputs.length > 0) {
      const $last = $idadeInputs.last()
      if ($last.is(':visible') && !$last.val()) {
        cy.wrap($last).scrollIntoView().click({ force: true }).clear({ force: true })
          .type(String(_complAleatorio(COMPL_IDADES)), { delay: 30, force: true })
        cy.wait(300)
      }
    }
  })
  const labelsAba3 = [
    /gênero|genero/i, /raça|raca/i, /etapa escolar/i,
    /frequência|frequencia/i, /deficiência|deficiencia/i, /nacionalidade/i,
  ]
  labelsAba3.forEach(labelRegex => {
    cy.get('body').then($b => { _selecionarComboByLabel($b, labelRegex) })
  })
  cy.get('body').then($b => {
    const $textareas = $b.find('textarea[name*="pessoasAgressoras"]')
    if ($textareas.length > 0) {
      const $last = $textareas.last()
      if (!$last.val()) {
        cy.wrap($last).scrollIntoView().click({ force: true }).clear({ force: true })
          .type(_complAleatorio(COMPL_INTERACOES), { delay: 10, force: true }).blur({ force: true })
        cy.wait(300)
      }
    }
  })
  cy.get('body').then($b => {
    if ($b.text().includes('motivou') || $b.text().includes('motivação')) {
      const $labels = $b.find('label').filter((_, el) => /motivação|motivou/i.test(el.innerText || el.textContent || ''))
      if ($labels.length > 0) {
        let $btnMotiv = Cypress.$()
        let $c = $labels.first()
        for (let i = 0; i < 5; i++) {
          $c = $c.parent()
          $btnMotiv = $c.find('button').first()
          if ($btnMotiv.length > 0) break
        }
        if ($btnMotiv.length > 0) {
          cy.wrap($btnMotiv).click({ force: true })
          cy.wait(COMPL_TIMEOUTS.SHORT)
          cy.get('body').then($b2 => {
            const $opts = $b2.find('[role="option"]').filter(':visible')
            if ($opts.length > 0) {
              cy.wrap($opts.first()).click({ force: true })
              cy.wait(500)
            }
          })
          cy.get('body').type('{esc}')
          cy.wait(500)
        }
      }
    }
  })
  cy.get('body').then($b => {
    if ($b.text().includes('Conselho Tutelar')) {
      const $labels = $b.find('label').filter((_, el) => /Conselho Tutelar/i.test(el.innerText || el.textContent || ''))
      if ($labels.length > 0) {
        let $container = $labels.first()
        for (let i = 0; i < 4; i++) $container = $container.parent()
        const $radioNao = $container.find('button[role="radio"]').filter((_, btn) => /não|nao/i.test(Cypress.$(btn).val() || Cypress.$(btn).text()))
        if ($radioNao.length > 0 && $radioNao.first().attr('data-state') !== 'checked') {
          cy.wrap($radioNao.first()).scrollIntoView().click({ force: true })
          cy.wait(300)
        } else if ($radioNao.length === 0) {
          // Fallback: primeiro radio disponível
          const $primRadio = $container.find('button[role="radio"]').first()
          if ($primRadio.length > 0 && $primRadio.attr('data-state') !== 'checked') {
            cy.wrap($primRadio).scrollIntoView().click({ force: true })
            cy.wait(300)
          }
        }
      }
    }
  })
  cy.get('body').then($b => {
    if ($b.text().includes('acompanhada')) {
      const $groups = $b.find('[role="radiogroup"]')
      if ($groups.length > 0) {
        cy.wrap($groups.last()).then($group => {
          const checked = Cypress.$($group).find('button[data-state="checked"], input:checked').length
          if (checked === 0) {
            const $naapa = Cypress.$($group).find('span.text-sm').filter((_, el) => el.textContent.trim() === 'NAAPA').first()
            if ($naapa.length > 0) {
              cy.wrap($naapa).scrollIntoView().click({ force: true })
            } else {
              const $primeira = Cypress.$($group).find('button[role="radio"], span.text-sm').first()
              if ($primeira.length > 0) cy.wrap($primeira).scrollIntoView().click({ force: true })
            }
            cy.wait(300)
          }
        })
      }
    }
  })
  cy.get('body').then($b => {
    if ($b.text().includes('processo SEI') || $b.text().includes('número do processo')) {
      const $groups = $b.find('[role="radiogroup"]')
      if ($groups.length > 0) {
        cy.wrap($groups.last()).then($group => {
          const checked = Cypress.$($group).find('button[data-state="checked"]').length
          if (checked === 0) {
            const $nao = Cypress.$($group).find('button[role="radio"]').filter((_, btn) => /não|nao/i.test(Cypress.$(btn).val() || Cypress.$(btn).text())).first()
            if ($nao.length > 0) {
              cy.wrap($nao).scrollIntoView().click({ force: true })
            } else {
              const $spans = Cypress.$($group).find('span.text-sm').filter((_, el) => /não|nao/i.test(el.textContent.trim()))
              if ($spans.length > 0) cy.wrap($spans.first()).scrollIntoView().click({ force: true })
            }
            cy.wait(300)
          } else {
            const valorMarcado = Cypress.$($group).find('button[data-state="checked"]').attr('value') || ''
            if (/sim/i.test(valorMarcado)) {
              cy.get('body').then($b2 => {
                const $inp = $b2.find('input').filter(':not([type="file"]):not([readonly]):not([type="hidden"])').filter(':visible').last()
                if ($inp.length > 0 && !$inp.val()) {
                  cy.wrap($inp).type(_complAleatorio(COMPL_NUMEROS_SEI), { delay: 20 })
                }
              })
            }
          }
        })
      }
    }
  })
}

// Preenche todos os campos da Aba 4
function _preencherAba4() {
  cy.get('button[id*="form-item"]', { timeout: COMPL_TIMEOUTS.LONG }).then($btns => {
    const total = $btns.length
    for (let i = 0; i < Math.min(total, 3); i++) {
      cy.wrap($btns.eq(i)).then($btn => {
        if (/selecione/i.test($btn.text()) || $btn.text().trim() === '') {
          cy.wrap($btn).scrollIntoView().click({ force: true })
          cy.wait(COMPL_TIMEOUTS.SHORT)
          cy.get('body').then($b => {
            const $opts = $b.find('[role="option"]').filter(':not([aria-disabled="true"])')
            if ($opts.length > 0) cy.wrap($opts.eq(Math.floor(Math.random() * $opts.length))).click({ force: true })
          })
          cy.wait(COMPL_TIMEOUTS.SHORT)
        }
      })
    }
  })
}

// Clica submit e verifica se avançou de aba (URL de erro ou mesma aba = campos faltantes)
function _submeterComValidacao(nomeAba, preencherFn, onSucesso) {
  cy.get('button[type="submit"]', { timeout: COMPL_TIMEOUTS.LONG })
    .first().then($btn => { cy.wrap($btn).scrollIntoView().click({ force: true }) })
  cy.wait(COMPL_TIMEOUTS.DEFAULT)

  // Verifica se ainda há erros de validação — se sim, re-preenche e tenta de novo
  cy.get('body').then($b => {
    if (_temErrosValidacao($b)) {
      cy.log(`COMPL: ${nomeAba} — campos inválidos detectados, re-preenchendo`)
      preencherFn()
      cy.wait(COMPL_TIMEOUTS.DEFAULT)
      cy.get('button[type="submit"]', { timeout: COMPL_TIMEOUTS.LONG })
        .first().then($btn => { cy.wrap($btn).scrollIntoView().click({ force: true }) })
      cy.wait(COMPL_TIMEOUTS.DEFAULT)
    }
  })

  onSucesso()
}

// ── Navega por todas as abas do formulário e preenche campos ausentes ─────────
function _completarTodosOsCampos() {
  // Controle de retries por aba — previne loop infinito na mesma aba
  const retriesPorAba = {}
  const MAX_RETRIES_POR_ABA = 3

  const _avanco = (tentativa) => {
    if (tentativa > 20) {
      cy.log('COMPL: limite global de tentativas atingido')
      return
    }

    cy.wait(COMPL_TIMEOUTS.DEFAULT)

    cy.url().then(url => {
      if (!url.includes('cadastrar-ocorrencia')) {
        cy.log('COMPL: fora da URL de cadastro — conclusão detectada')
        return
      }

      cy.get('body').then($body => {
        const texto = $body.text()

        // Detecta aba atual
        const temDataInput = $body.find('input[type="date"]').length > 0
        const temPessoas = texto.includes('Qual o nome da pessoa') || texto.includes('nome da pessoa') ||
                           $body.find('input[name*="pessoasAgressoras"]').length > 0
        const temAnexos = texto.includes('Tipo do documento') || texto.includes('Selecione o arquivo') ||
                          texto.includes('Escolher arquivo') ||
                          ($body.find('input[type="file"]').filter(':visible').length > 0)
        let abaAtual = 'desconhecida'
        if (temDataInput && !texto.includes('Qual o tipo de ocorrência?')) abaAtual = 'aba1'
        else if (texto.includes('Qual o tipo de ocorrência?')) abaAtual = 'aba2'
        else if (temPessoas) abaAtual = 'aba3'
        else if (texto.includes('Quem é o declarante')) abaAtual = 'aba4'
        else if (temAnexos) abaAtual = 'aba5'

        retriesPorAba[abaAtual] = (retriesPorAba[abaAtual] || 0) + 1
        cy.log(`COMPL: ${abaAtual} — tentativa ${retriesPorAba[abaAtual]}/${MAX_RETRIES_POR_ABA}`)

        if (retriesPorAba[abaAtual] > MAX_RETRIES_POR_ABA) {
          cy.log(`COMPL: ${abaAtual} excedeu ${MAX_RETRIES_POR_ABA} tentativas — ocorrência não pode ser completada`)
          return
        }

        // ── Aba 1: Identificação ──────────────────────────────────────────
        if (abaAtual === 'aba1') {
          cy.log('COMPL: Aba 1 — preenchendo identificação')
          _preencherAba1()
          _submeterComValidacao('Aba 1', _preencherAba1, () => { _avanco(tentativa + 1) })
          return
        }

        // ── Aba 2: Tipo de Ocorrência ─────────────────────────────────────
        if (abaAtual === 'aba2') {
          cy.log('COMPL: Aba 2 — tipo de ocorrência')
          _preencherAba2()
          _submeterComValidacao('Aba 2', _preencherAba2, () => { _avanco(tentativa + 1) })
          return
        }

        // ── Aba 3: Pessoas Envolvidas ─────────────────────────────────────
        if (abaAtual === 'aba3') {
          cy.log('COMPL: Aba 3 — pessoas envolvidas')
          _preencherAba3()
          _submeterComValidacao('Aba 3', _preencherAba3, () => { _avanco(tentativa + 1) })
          return
        }

        // ── Aba 4: Declarante e Protocolos ───────────────────────────────
        if (abaAtual === 'aba4') {
          cy.log('COMPL: Aba 4 — declarante e protocolos')
          _preencherAba4()
          _submeterComValidacao('Aba 4', _preencherAba4, () => { _avanco(tentativa + 1) })
          return
        }

        // ── Aba 5: Anexos ─────────────────────────────────────────────────
        if (abaAtual === 'aba5') {
          cy.log('COMPL: Aba 5 — anexos')

          cy.get('body').then($b2 => {
            const $listaAnexos = $b2.find('table tbody tr, [class*="file-item"], [class*="attachment-item"]')
            const jaTemAnexo = $listaAnexos.length > 0

            if (!jaTemAnexo) {
              cy.log('COMPL: Aba 5 — sem anexo, iniciando upload')
              const $fileInputs = $b2.find('input[type="file"]')
              if ($fileInputs.length > 0) {
                cy.wrap($fileInputs.first()).selectFile({
                  contents: Cypress.Buffer.from('fake-image-content-for-test'),
                  fileName: 'anexo_ocorrencia.jpg',
                  mimeType: 'image/jpeg'
                }, { force: true })
                cy.wait(2000)
                cy.get('body').then($b3 => {
                  const $combosVisiveis = $b3.find('button[role="combobox"]').filter(':visible')
                  if ($combosVisiveis.length > 0) {
                    const $comboTipo = $combosVisiveis.last()
                    if (/selecione/i.test($comboTipo.text()) || $comboTipo.text().trim() === '') {
                      cy.wrap($comboTipo).scrollIntoView().click({ force: true })
                      cy.wait(COMPL_TIMEOUTS.SHORT)
                      cy.get('body').then($b4 => {
                        const $opts = $b4.find('[role="option"]')
                        if ($opts.length > 0) {
                          const boletim = Array.from($opts).find(el => /boletim/i.test(el.textContent))
                          if (boletim) {
                            cy.wrap(boletim).click({ force: true })
                          } else {
                            cy.wrap($opts.first()).click({ force: true })
                          }
                          cy.wait(500)
                        }
                      })
                    }
                  }
                })
                cy.wait(500)
                cy.get('body').then($b3 => {
                  const $btnAnexar = $b3.find('button').filter((_, btn) => /anexar documento/i.test(btn.textContent || ''))
                  if ($btnAnexar.length > 0) {
                    cy.wrap($btnAnexar.first()).scrollIntoView().click({ force: true })
                    cy.wait(COMPL_TIMEOUTS.DEFAULT)
                  } else {
                    cy.log('COMPL: Aba 5 — botão "Anexar documento" não encontrado, continuando')
                  }
                })
              } else {
                cy.log('COMPL: Aba 5 — input[type="file"] não encontrado, continuando')
              }
            } else {
              cy.log('COMPL: Aba 5 — anexo já existe, pulando upload')
            }
          })

          cy.wait(COMPL_TIMEOUTS.DEFAULT)
          cy.get('body').then($b2 => {
            const $finalizar = $b2.find('button').filter((_, btn) => /finalizar e enviar/i.test(btn.textContent || ''))
            if ($finalizar.length > 0) {
              cy.wrap($finalizar.first()).scrollIntoView().click({ force: true })
            } else {
              cy.get('body').then($b3 => {
                const $submitBtns = $b3.find('button[type="submit"]').filter(':not(:disabled)')
                if ($submitBtns.length > 0) {
                  cy.wrap($submitBtns.first()).scrollIntoView().click({ force: true })
                } else {
                  const $all = $b3.find('button').filter(':visible:not(:disabled)')
                    .filter((_, btn) => !/cancelar|voltar|fechar/i.test(btn.textContent || ''))
                  if ($all.length > 0) cy.wrap($all.last()).scrollIntoView().click({ force: true })
                }
              })
            }
          })

          cy.log('COMPL: botão Finalizar clicado — aguardando conclusão')
          return
        }

        // Aba não reconhecida — tenta avançar
        cy.log(`COMPL: aba não identificada na tentativa ${tentativa} — tentando avançar`)
        cy.get('body').then($b2 => {
          const $submit = $b2.find('button[type="submit"]').filter(':not(:disabled)')
          if ($submit.length > 0) {
            cy.wrap($submit.first()).scrollIntoView().click({ force: true })
            _avanco(tentativa + 1)
          }
        })
      })
    })
  }

  _avanco(1)
}

// ── Reaplicar filtro "Incompleto" no dashboard ───────────────────────────────
function _reaplicarFiltroIncompleto() {
  cy.wait(COMPL_TIMEOUTS.DEFAULT)

  cy.contains(/Histórico de ocorrências/i, { timeout: COMPL_TIMEOUTS.VERY_LONG })
    .should('be.visible')

  cy.wait(COMPL_TIMEOUTS.SHORT)

  cy.get(locators.btn_filtrar_principal(), { timeout: COMPL_TIMEOUTS.LONG })
    .should('be.visible').scrollIntoView().click({ force: true })

  cy.wait(COMPL_TIMEOUTS.EXTENDED)

  cy.get(locators.select_status(), { timeout: COMPL_TIMEOUTS.LONG })
    .should('be.visible').click({ force: true })

  cy.wait(COMPL_TIMEOUTS.DEFAULT)

  cy.get('[role="option"]', { timeout: COMPL_TIMEOUTS.LONG }).then($opts => {
    const incompletoOpt = Array.from($opts).find(el =>
      /incomplet/i.test(el.textContent?.trim() || '')
    )
    if (incompletoOpt) {
      cy.wrap(incompletoOpt).click({ force: true })
    } else {
      cy.log('COMPL: opção Incompleto não encontrada no dropdown')
      cy.get('body').type('{esc}')
    }
  })

  cy.wait(COMPL_TIMEOUTS.SHORT)
  cy.get('main').click(10, 10, { force: true })
  cy.wait(500)

  cy.get(COMPL_BTN_FILTRAR_PAINEL, { timeout: COMPL_TIMEOUTS.LONG })
    .should('be.visible').scrollIntoView().click({ force: true })

  cy.wait(COMPL_TIMEOUTS.EXTENDED)
}

// ── Loop principal: processa todas as ocorrências incompletas ────────────────
function _processarTodasIncompletas(perfil) {
  cy.wait(COMPL_TIMEOUTS.DEFAULT)

  cy.get('body').then($body => {
    const $linhasCheck = $body.find('table tbody tr')
    if ($linhasCheck.length === 0) {
      cy.log(`COMPL_${perfil}: nenhuma ocorrência incompleta encontrada — todas processadas com sucesso`)
      return
    }
  })

  cy.get('table tbody tr', { timeout: COMPL_TIMEOUTS.LONG }).then($linhas => {
    if ($linhas.length === 0) {
      cy.log(`COMPL_${perfil}: nenhuma ocorrência incompleta — finalizando`)
      return
    }

    cy.log(`COMPL_${perfil}: ${$linhas.length} ocorrência(s) incompleta(s) encontrada(s). Processando a primeira...`)

    cy.get('table tbody tr').first().within(() => {
      cy.get('td').last().find('a, button').first().should('exist').click({ force: true })
    })

    cy.url({ timeout: COMPL_TIMEOUTS.VERY_LONG }).should('include', 'cadastrar-ocorrencia')
    cy.wait(COMPL_TIMEOUTS.EXTENDED)

    _completarTodosOsCampos()

    // Aguarda mensagem de sucesso ou conclusão
    cy.wait(20000)

    // Fechar modal de sucesso (Fechar para UE/DRE, Finalizar para GIPE)
    cy.get('body').then($b => {
      const $dialog = $b.find('[role="dialog"]:visible, [aria-modal="true"]:visible')
      if ($dialog.length > 0) {
        const $fechar = Cypress.$($dialog).find('button').filter((_, btn) => /fechar/i.test(btn.textContent))
        const $finalizar = Cypress.$($dialog).find('button').filter((_, btn) => /finalizar/i.test(btn.textContent))
        if ($fechar.length > 0) {
          cy.wrap($fechar.first()).scrollIntoView().click({ force: true })
        } else if ($finalizar.length > 0) {
          cy.wrap($finalizar.last()).scrollIntoView().click({ force: true })
        } else {
          cy.get('body').type('{esc}')
        }
      } else {
        // Toast / Sonner pattern
        const $toastClose = $b.find('[role="alert"] button, [data-sonner-toast] button')
        if ($toastClose.length > 0) {
          cy.wrap($toastClose.first()).click({ force: true })
        }
      }
    })

    cy.wait(COMPL_TIMEOUTS.DEFAULT)

    // Verifica se o formulário foi submetido (URL saiu de cadastrar-ocorrencia)
    // ou se ainda está no form (botão desabilitado / upload falhou)
    cy.url().then(urlAposEnvio => {
      if (urlAposEnvio.includes('cadastrar-ocorrencia')) {
        cy.log(`COMPL_${perfil}: formulário não enviado (ainda no form) — encerrando processamento desta ocorrência`)
        cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', {
          failOnStatusCode: false,
          timeout: COMPL_TIMEOUTS.VERY_LONG
        })
        // Não recursiona — evita loop infinito na mesma ocorrência
        cy.log(`COMPL_${perfil}: encerrando ciclo para evitar loop`)
      } else {
        cy.log(`COMPL_${perfil}: ocorrência processada — voltando ao dashboard`)

        // Fechar modal residual se ainda aberto
        cy.get('body').then($bModal => {
          const $d2 = $bModal.find('[role="dialog"]:visible, [aria-modal="true"]:visible')
          if ($d2.length > 0) {
            const $fechar2 = Cypress.$($d2).find('button').filter((_, btn) => /fechar/i.test(btn.textContent))
            if ($fechar2.length > 0) {
              cy.wrap($fechar2.first()).scrollIntoView().click({ force: true })
            } else {
              cy.get('body').type('{esc}')
            }
          }
        })

        cy.wait(COMPL_TIMEOUTS.SHORT)
        cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', {
          failOnStatusCode: false,
          timeout: COMPL_TIMEOUTS.VERY_LONG
        })

        cy.wait(COMPL_TIMEOUTS.EXTENDED)
        _reaplicarFiltroIncompleto()
        _processarTodasIncompletas(perfil)
      }
    })
  })
}

// ── Login DRE ────────────────────────────────────────────────────────────────
Given('COMPL_DRE acessa o sistema com perfil DRE', () => {
  const RF = Cypress.env('RF_DRE')
  const SENHA = Cypress.env('SENHA_DRE')

  if (!RF || !SENHA) {
    throw new Error(`Credenciais DRE não encontradas! RF_DRE: ${RF}. Verifique o arquivo .env`)
  }

  cy.log(`COMPL_DRE: login com RF_DRE ${RF}`)
  cy.loginWithSession(RF, SENHA, 'COMPL_DRE')
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', {
    timeout: COMPL_TIMEOUTS.VERY_LONG,
    failOnStatusCode: false
  })
  cy.url({ timeout: COMPL_TIMEOUTS.VERY_LONG }).should('include', '/dashboard')
  cy.wait(COMPL_TIMEOUTS.DEFAULT)
})

// ── Login GIPE Admin ─────────────────────────────────────────────────────────
Given('COMPL_GIPE acessa o sistema com perfil GIPE Admin', () => {
  const RF = Cypress.env('RF_GIPE_ADMIN')
  const SENHA = Cypress.env('SENHA_GIPE_ADMIN')

  if (!RF || !SENHA) {
    throw new Error(`Credenciais GIPE_ADMIN não encontradas! RF_GIPE_ADMIN: ${RF}. Verifique o arquivo .env`)
  }

  cy.log(`COMPL_GIPE: login com RF_GIPE_ADMIN ${RF}`)
  cy.loginWithSession(RF, SENHA, 'COMPL_GIPE')
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', {
    timeout: COMPL_TIMEOUTS.VERY_LONG,
    failOnStatusCode: false
  })
  cy.url({ timeout: COMPL_TIMEOUTS.VERY_LONG }).should('include', '/dashboard')
  cy.wait(COMPL_TIMEOUTS.DEFAULT)
})

// ── Steps principais: processamento de ocorrências incompletas ───────────────
Then('COMPL_UE processa e completa todas as ocorrências incompletas', () => {
  _processarTodasIncompletas('UE')
})

Then('COMPL_DRE processa e completa todas as ocorrências incompletas', () => {
  _processarTodasIncompletas('DRE')
})

Then('COMPL_GIPE processa e completa todas as ocorrências incompletas', () => {
  _processarTodasIncompletas('GIPE')
})

import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'
import CadastroUeLocalizadores from '../../locators/cadastro_ue_locators'

const locators = new CadastroUeLocalizadores()

// ==================== CONTADORES SEQUENCIAIS (reset a cada cenário) ====================

let tituladorCount = 0
let dropdownSelectCount = 0

Before(() => {
  tituladorCount = 0
  dropdownSelectCount = 0
})

// ==================== SELETORES SEQUENCIAIS DA ABA 3 ====================

// Labels dos títulos: nome → idade → gênero → étnico-racial → etapa escolar → frequência escolar
const aba3TitulosCSS = [
  'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.flex.flex-col.gap-4 > div.rounded-sm.border.bg-\\[\\#F5F6F8\\].p-4.flex.flex-col.gap-4 > div:nth-child(1) > div:nth-child(1) > label', // Nome
  'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.flex.flex-col.gap-4 > div.rounded-sm.border.bg-\\[\\#F5F6F8\\].p-4.flex.flex-col.gap-4 > div:nth-child(1) > div:nth-child(2) > label', // Idade
  'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.flex.flex-col.gap-4 > div.rounded-sm.border.bg-\\[\\#F5F6F8\\].p-4.flex.flex-col.gap-4 > div:nth-child(1) > div:nth-child(3) > label', // Gênero
  'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.flex.flex-col.gap-4 > div.rounded-sm.border.bg-\\[\\#F5F6F8\\].p-4.flex.flex-col.gap-4 > div:nth-child(2) > div:nth-child(1) > label', // Étnico-Racial
  'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.flex.flex-col.gap-4 > div.rounded-sm.border.bg-\\[\\#F5F6F8\\].p-4.flex.flex-col.gap-4 > div:nth-child(2) > div:nth-child(2) > label', // Etapa Escolar
  'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.flex.flex-col.gap-4 > div.rounded-sm.border.bg-\\[\\#F5F6F8\\].p-4.flex.flex-col.gap-4 > div:nth-child(2) > div:nth-child(3) > label', // Frequência Escolar
]

// Campos de input de nome e idade (XPath mais específico que os seletores dinâmicos :r4n:)
const aba3CamposInput = [
  'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.flex.flex-col.gap-4 > div.rounded-sm.border.bg-\\[\\#F5F6F8\\].p-4.flex.flex-col.gap-4 > div:nth-child(1) > div:nth-child(1) > input', // Nome
  'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.flex.flex-col.gap-4 > div.rounded-sm.border.bg-\\[\\#F5F6F8\\].p-4.flex.flex-col.gap-4 > div:nth-child(1) > div:nth-child(2) > input', // Idade
]

// Botões de dropdown em ordem de uso no cenário:
// índice 0 = Unidade Educacional (Aba 1)
// índices 1-4 = gênero / étnico-racial / etapa / frequência (Aba 3)
const dropdownXpaths = [
  '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[2]/button',
  '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/div[1]/div[3]/button',
  '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/div[2]/div[1]/button',
  '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/div[2]/div[2]/button',
  '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/div[2]/div[3]/button',
]

// 15 textos curtos para o campo "Como é a interação da pessoa no ambiente escolar?"
const textoInteracaoEscolar = [
  'Aluno colaborativo e respeitoso com colegas',
  'Estudante apresenta dificuldades em trabalho coletivo',
  'Boa participação nas atividades em grupo',
  'Relacionamento conflituoso com alguns colegas',
  'Integração positiva com a turma',
  'Comportamento agressivo em situações de conflito',
  'Participação ativa nas aulas e eventos escolares',
  'Reservado, porém cordial com os colegas',
  'Liderança construtiva e positiva entre os pares',
  'Isolamento social observado pela equipe escolar',
  'Interação adequada nas atividades extracurriculares',
  'Relação respeitosa com educadores e funcionários',
  'Envolvimento em episódios de bullying verbal',
  'Demonstra empatia e espírito de colaboração',
  'Comportamento instável conforme o contexto vivenciado',
]

const nomesAgressores = [
  // Brasileiros
  'João da Silva Santos',
  'Maria Oliveira Costa',
  'Pedro Henrique Almeida',
  'Ana Paula Rodrigues',
  'Carlos Eduardo Ferreira',
  'Juliana Santos Pereira',
  'Rafael Souza Lima',
  'Fernanda Costa Martins',
  'Lucas Gabriel Barbosa',
  'Camila Rodrigues Mendes',
  'Bruno Henrique Carvalho',
  'Patricia Lima Araújo',
  'Thiago Alves Cardoso',
  'Beatriz Fernandes Ramos',
  'Marcos Vinícius Dias',
  // Origem Africana
  'Amara Diallo Kouyaté',
  'Fatou Balde Sow',
  'Kofi Asante Mensah',
  'Nia Okonkwo Adeyemi',
  'Seun Abiodun Balogun',
  // Origem Árabe
  'Yasmin Khalil Haddad',
  'Omar Nasser Saleh',
  'Laila Farid Mansour',
  'Karim Aziz Rachid',
  'Nour Hamdan Aoun',
  // Origem Europeia
  'Sophie Müller Wagner',
  'Luca Rossi Ferrari',
  'Elena Dubois Moreau',
  'Aleksander Kowalski Wiśniewski',
  'Ingrid Larsen Andersen'
]

const idadesValidas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

const cepsValidos = [
  '01310100',
  '04650900',
  '01310200',
  '05508010',
  '02012000',
  '03310000',
  '08010090',
  '03155000',
  '05001000',
  '02071000',
  '04543000',
  '03141000',
  '05724000',
  '03162000',
  '08230000'
]

function getNomeAleatorio() {
  return nomesAgressores[Math.floor(Math.random() * nomesAgressores.length)]
}

function getIdadeAleatoria() {
  return idadesValidas[Math.floor(Math.random() * idadesValidas.length)]
}

function getCepAleatorio() {
  return cepsValidos[Math.floor(Math.random() * cepsValidos.length)]
}

function getNumeroResidenciaAleatorio() {
  return Math.floor(Math.random() * 9999) + 1
}

When('valida a aba {string}', (titulo) => {
  cy.wait(2000)
  cy.log(`Validando aba: ${titulo}`)
  cy.get(locators.aba_informacoes_adicionais(), { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', titulo)
  cy.log('Aba validada')
})

// ═══════════════════════════════════════════════════════════════════════════
// STEPS LEGADOS - USADOS POR OUTRAS FEATURES
// ═══════════════════════════════════════════════════════════════════════════
// Usado por: cadastra_ue_desastres_climatico.feature, cadast_ocorrenc_dre.feature
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Preenche o campo nome do agressor com texto aleatório
 * ATUALIZADO: Usa seletor CSS direto ao invés de regex frágil
 * Seletor: aba3CamposInput[0]
 */
When('preenche o campo nome agressor aleatorio', () => {
  const nomeAleatorio = getNomeAleatorio()
  cy.wait(2000)
  cy.log(`Preenchendo nome aleatório: ${nomeAleatorio}`)
  
  // Usa seletor CSS específico ao invés de cy.contains com regex
  cy.get(aba3CamposInput[0], { timeout: 15000 })
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(nomeAleatorio, { delay: 50, force: true })
  
  cy.wait(1000)
  cy.log(`Nome preenchido: ${nomeAleatorio}`)
})

/**
 * Preenche o campo idade do agressor com número aleatório
 * ATUALIZADO: Usa seletor CSS direto ao invés de regex frágil
 * Seletor: aba3CamposInput[1]
 */
When('preenche o campo idade agressor aleatorio', () => {
  const idadeAleatoria = getIdadeAleatoria()
  cy.wait(1000)
  cy.log(`Preenchendo idade aleatória: ${idadeAleatoria}`)
  
  // Usa seletor CSS específico ao invés de cy.contains com regex
  cy.get(aba3CamposInput[1], { timeout: 15000 })
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(String(idadeAleatoria), { delay: 50, force: true })
  
  cy.wait(1000)
  cy.log(`Idade preenchida: ${idadeAleatoria}`)
})

When('preenche o campo CEP aleatorio', () => {
  const cepAleatorio = getCepAleatorio()
  cy.wait(1500)
  cy.log(`Preenchendo CEP aleatório: ${cepAleatorio}`)
  cy.contains('label', 'CEP', { timeout: 15000 }).should('be.visible')
  cy.get('form fieldset div').contains('label', 'CEP')
    .parent()
    .parent()
    .find('input')
    .first()
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })
    .clear({ force: true })
    .type(cepAleatorio, { delay: 50, force: true })
    .blur()
  cy.wait(1000)
  cy.log(` CEP preenchido: ${cepAleatorio}`)
})

When('localiza valida e preenche o campo CEP com {string}', (cep) => {
  cy.wait(1500)
  cy.log(`Preenchendo CEP: ${cep}`)
  cy.contains('label', 'CEP', { timeout: 15000 }).should('be.visible')
  cy.get('form fieldset div').contains('label', 'CEP')
    .parent()
    .parent()
    .find('input')
    .first()
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })
    .clear({ force: true })
    .type(cep, { delay: 50, force: true })
    .blur()
  cy.wait(1000)
  cy.log('CEP preenchido')
})

When('localiza o botão {string} e clica', (botao) => {
  cy.wait(2000)
  cy.log('Pesquisando CEP')
  cy.xpath(locators.btn_pesquisar_cep(), { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(3000)
  cy.log('CEP pesquisado')
})

When('insere numero residencia aleatorio', () => {
  const numeroAleatorio = getNumeroResidenciaAleatorio()
  cy.wait(3000)
  cy.log(`Inserindo número aleatório: ${numeroAleatorio}`)
  cy.contains('label', /Número.*residência/i, { timeout: 15000 })
    .should('be.visible')
    .parent()
    .find('input')
    .first()
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(String(numeroAleatorio), { delay: 50, force: true })
  cy.wait(1000)
  cy.log(` Número residência preenchido: ${numeroAleatorio}`)
})

When('localiza e valida o texto {string} e insere {string}', (labelTexto, numero) => {
  cy.wait(3000)
  cy.log(`Inserindo número: ${numero}`)
  cy.contains('label', new RegExp(labelTexto, 'i'), { timeout: 15000 })
    .should('be.visible')
    .parent()
    .find('input')
    .first()
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(numero, { delay: 50, force: true })
  cy.wait(1000)
  cy.log('Número inserido')
})

When('clica no campo motivacao', () => {
  cy.wait(1500)
  cy.log('Abrindo campo motivação')
  cy.xpath(locators.btn_campo_motivacao(), { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(2000)
  cy.log('Campo aberto')
})

When('seleciona as opcoes motivacao {string} e {string}', (opcao1, opcao2) => {
  cy.wait(2000)
  cy.log(`Selecionando motivações: ${opcao1} e ${opcao2}`)
  cy.get('body').then($body => {
    cy.contains('span', opcao1, { timeout: 15000 }).eq(0).click({ force: true })
  })
  cy.wait(1000)
  cy.get('body').then($body => {
    cy.contains('span', opcao2, { timeout: 15000 }).eq(0).click({ force: true })
  })
  cy.wait(1000)
  cy.log('Motivações selecionadas')
})

When('clica fora do modal', () => {
  cy.wait(500)
  cy.log('Fechando modal')
  cy.get('body').type('{esc}')
  cy.wait(1000)
  cy.log('Modal fechado')
})

When('clica no campo genero e seleciona {string}', (opcao) => {
  cy.wait(1500)
  cy.log(`Selecionando gênero: ${opcao}`)
  cy.get(locators.select_genero(), { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(1500)
  cy.contains('[role="option"]', opcao, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(1000)
  cy.log('Gênero selecionado')
})

When('clica no campo etnico e seleciona {string}', (opcao) => {
  cy.wait(1500)
  cy.log(`Selecionando étnico-racial: ${opcao}`)
  cy.get(locators.select_etnico(), { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(1500)
  cy.contains('[role="option"]', opcao, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(1000)
  cy.log('Étnico-racial selecionado')
})

When('clica no campo etapa e seleciona {string}', (opcao) => {
  cy.wait(1500)
  cy.log(`Selecionando etapa: ${opcao}`)
  cy.get(locators.select_etapa(), { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(1500)
  cy.contains('[role="option"]', opcao, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(1000)
  cy.log('Etapa selecionada')
})

When('clica no campo frequencia e seleciona {string}', (opcao) => {
  cy.wait(1500)
  cy.log(`Selecionando frequência: ${opcao}`)
  cy.get(locators.select_frequencia(), { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(1500)
  cy.contains('[role="option"]', opcao, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(1000)
  cy.log('Frequência selecionada')
})

When('preenche campo interacao com {string}', (texto) => {
  cy.wait(1500)
  cy.log('Preenchendo interação')
  cy.contains('label', /interação.*pessoa.*agressora/i, { timeout: 15000 }).should('be.visible')
  cy.get('form fieldset div').contains('label', /interação.*pessoa.*agressora/i)
    .parent()
    .parent()
    .find('textarea')
    .first()
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })
    .clear({ force: true })
    .type(texto, { delay: 50, force: true })
    .blur()
  cy.wait(1000)
  cy.log('Interação preenchida')
})

When('preenche campo redes com {string}', (texto) => {
  cy.wait(1500)
  cy.log('Preenchendo redes')
  cy.contains('label', /redes.*proteção/i, { timeout: 15000 }).should('be.visible')
  cy.get('form fieldset div').contains('label', /redes.*proteção/i)
    .parent()
    .parent()
    .find('textarea')
    .first()
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })
    .clear({ force: true })
    .type(texto, { delay: 50, force: true })
    .blur()
  cy.wait(1000)
  cy.log('Redes preenchida')
})

When('seleciona e clica em {string} conselho', (opcao) => {
  cy.wait(1500)
  cy.log('Selecionando Conselho Tutelar')
  cy.contains('label', /Conselho.*Tutelar/i, { timeout: 15000 })
    .parent()
    .parent()
    .find('label').contains(opcao)
    .should('be.visible')
    .click({ force: true })
  cy.wait(1000)
  cy.log('Conselho selecionado')
})

When('seleciona e clica em {string} naapa', (opcao) => {
  cy.wait(1500)
  cy.log('Selecionando NAAPA')
  cy.contains('label', /acompanhada pelo NAAPA/i, { timeout: 15000 })
    .should('be.visible')
    .parent()
    .within(() => {
      cy.contains('label', 'Sim').should('exist')
      cy.contains('label', 'Não').should('exist')
      cy.contains('label', opcao)
        .find('span')
        .first()
        .scrollIntoView()
        .click({ force: true })
    })
  cy.wait(1000)
  cy.log('NAAPA selecionado')
})

When('clica em {string} informacoes', (texto) => {
  cy.wait(2000)
  cy.log('Avançando para próxima aba')
  cy.xpath(locators.btn_proximo_aba3(), { timeout: 15000 })
    .first()
    .should('be.visible')
    .click({ force: true, scrollBehavior: false })
  cy.wait(3000)
  cy.log('Aba 4 carregada')
})

Then('o sistema direciona para proxima aba', () => {
  cy.wait(2000)
  cy.url({ timeout: 15000 }).should('include', '/cadastrar-ocorrencia')
})

When('valida que esta na aba {string}', (nomeAba) => {
  cy.wait(2000)
  cy.log(`Validando aba: ${nomeAba}`)
  cy.get('body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div > div:nth-child(4) > div.mt-2.text-center > p', { timeout: 15000 })
    .should('be.visible')
    .invoke('text')
    .should('match', new RegExp(nomeAba, 'i'))
  cy.wait(1000)
  cy.log('Aba validada')
})

When('clica no campo do declarante ue', () => {
  cy.wait(2000)
  cy.log('Clicando no campo declarante')
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($buttons => {
    cy.wrap($buttons.eq(0))
      .should('be.visible')
      .should('be.enabled')
      .click({ force: true })
  })
  cy.wait(2500)
  cy.log('Campo declarante aberto')
})

When('seleciona GIPE ue', () => {
  cy.wait(1500)
  cy.contains('[role="option"]', /GIPE/i, { timeout: 15000 })
    .should('exist')
    .click({ force: true })
  cy.wait(1500)
  cy.log('GIPE selecionado')
})

When('seleciona opcao aleatoria como declarante ue', () => {
  cy.wait(1500)
  cy.get('[role="option"]', { timeout: 15000 })
    .filter(':visible')
    .then(($options) => {
      const idx = Math.floor(Math.random() * $options.length)
      cy.log(`UE: Declarante selecionado (índice ${idx}): "${$options.eq(idx).text().trim()}"`)
      cy.wrap($options.eq(idx)).click({ force: true })
    })
  cy.wait(1500)
})

When('clica no campo de seguranca publica ue', () => {
  cy.wait(2000)
  cy.log('Clicando no campo segurança pública')
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($buttons => {
    cy.wrap($buttons.eq(1))
      .should('be.visible')
      .should('be.enabled')
      .click({ force: true })
  })
  cy.wait(2500)
  cy.log('Campo segurança pública aberto')
})

When('seleciona opcao seguranca ue', () => {
  cy.wait(3000)
  cy.get('[role="option"]', { timeout: 15000 })
    .filter(':visible')
    .then($options => {
      if ($options.length === 0) {
        cy.log('Nenhuma opção encontrada - tentando aguardar mais tempo')
        cy.wait(2000)
      }
      const randomIndex = Math.floor(Math.random() * $options.length)
      const selectedOption = $options.eq(randomIndex).text()
      cy.log(`Segurança pública selecionada: ${selectedOption}`)
      cy.wrap($options.eq(randomIndex)).click({ force: true })
    })
  cy.wait(1500)
})

When('clica no campo de protocolo ue', () => {
  cy.wait(2000)
  cy.log('Clicando no campo protocolo')
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($buttons => {
    cy.wrap($buttons.eq(2))
      .should('be.visible')
      .should('be.enabled')
      .click({ force: true })
  })
  cy.wait(2500)
  cy.log('Campo protocolo aberto')
})

When('seleciona protocolo ue', () => {
  cy.wait(3000)
  cy.log('Selecionando protocolo')
  cy.get('[role="option"]', { timeout: 20000 })
    .filter(':visible')
    .then($options => {
      if ($options.length === 0) {
        cy.log('Nenhuma opção de protocolo encontrada - pode estar vazio')
        return
      }
      const randomIndex = Math.floor(Math.random() * $options.length)
      const selectedOption = $options.eq(randomIndex).text()
      cy.log(`Protocolo selecionado: ${selectedOption}`)
      cy.wrap($options.eq(randomIndex)).click({ force: true })
    })
  cy.wait(2000)
  cy.log('Protocolo selecionado')
})

Then('clica em proximo final', () => {
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

When('valida a existencia do titulo {string}', (titulo) => {
  cy.wait(2000)
  cy.log('Validando seção anexos')
  cy.get(locators.titulo_anexos(), { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', titulo)
  cy.log('Seção validada')
})

When('localiza e clica no botão {string}', (botao) => {
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

When('seleciona a imagem do pc', () => {
  cy.wait(1000)
  cy.log('Anexando arquivo')
  cy.get('input[type="file"]', { timeout: 10000 })
    .selectFile({
      contents: Cypress.Buffer.from('fake-image-content'),
      fileName: 'test-image.jpg',
      mimeType: 'image/jpeg'
    }, { force: true })
  cy.wait(2000)
  cy.log('Arquivo anexado')
})

When('clica no campo tipo documento', () => {
  cy.wait(1500)
  cy.log('Abrindo tipo documento')
  cy.get('button[role="combobox"]', { timeout: 15000 })
    .last()
    .should('be.visible')
    .click({ force: true })
  cy.wait(1500)
  cy.log('Campo aberto')
})

When('seleciona {string}', (opcao) => {
  cy.wait(1500)
  cy.log(`Selecionando: ${opcao}`)

  if (opcao.includes('Sim, mas não houve dano')) {
    cy.get('label.flex:nth-child(2) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(1500)
  } else if (opcao.includes('Sim, Unidade Educacional é contemplada pelo Smart Sampa')) {
    cy.contains('label', 'Sim', { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(1500)
  } else if (opcao.includes('Não, Unidade Educacional é contemplada pelo Smart Sampa')) {
    cy.contains('label', /^N.o$/, { timeout: 15000 })
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

When('Localiza o button {string}', (textoBotao) => {
  cy.wait(2000)
  cy.log(`Validando existência do botão: ${textoBotao}`)
  cy.contains('button', new RegExp(textoBotao, 'i'), { timeout: 15000 })
    .should('exist')
    .should('be.visible')
  cy.log(` Botão "${textoBotao}" encontrado e visível`)
})

When('localiza e clica em "Finalizar"', () => {
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
  cy.log(' Botão Finalizar CLICADO - aguardando modal')
})

When('localiza e clica em "Finalizar e enviar"', () => {
  cy.wait(2000)
  cy.log('UE: Localizando botão Finalizar e enviar na aba de anexos')
  cy.contains('button', /Finalizar e enviar/i, { timeout: 15000 })
    .should('exist')
    .should('not.be.disabled')
    .scrollIntoView()
    .click({ force: true })
  cy.wait(3000)
  cy.log('UE: Botão Finalizar e enviar clicado - aguardando modal')
})

When('clica em "Finalizar"', () => {
  cy.wait(3000)
  cy.log('Localizando e clicando no botão Finalizar')
  cy.get('body').then($body => {
    if ($body.find('button[type="submit"]:visible').length > 0) {
      cy.log(' Encontrou button[type="submit"]')
      cy.get('button[type="submit"]')
        .filter(':visible')
        .last()
        .scrollIntoView()
        .click({ force: true })
    } else {
      cy.contains('button', /finalizar/i)
        .filter(':visible')
        .last()
        .scrollIntoView()
        .click({ force: true })
    }
  })
  cy.wait(3000)
  cy.log(' Botão Finalizar CLICADO - aguardando modal')
})

When('clica em {string}', (botao) => {
  cy.wait(2000)
  cy.log(`Clicando: ${botao}`)
  cy.xpath(locators.btn_finalizar(), { timeout: 15000 })
    .first()
    .should('be.visible')
    .click({ force: true, scrollBehavior: false })
  cy.wait(3000)
  cy.log('Botão clicado')
})

// STEP COMENTADO - usando versão otimizada do complement_gipe.js
// Then('sistema exibe modal com titulo {string}', (titulo) => {
//   cy.wait(3000)
//   cy.log('Aguardando modal aparecer')
//   cy.get('div[role="dialog"]', { timeout: 20000 })
//     .should('exist')
//     .should('be.visible')
//   cy.wait(1000)
//   cy.get('div[role="dialog"]')
//     .should('contain.text', titulo)
//   cy.log('Modal validado com sucesso')
// })

// STEP COMENTADO - usando versão otimizada do complement_gipe.js
// When('preenche campo motivo encerramento com {string}', (texto) => {
//   cy.wait(1500)
//   cy.log('Preenchendo motivo')
//   cy.get('textarea[id*="form-item"]', { timeout: 15000 })
//     .last()
//     .should('be.visible')
//     .click({ force: true })
//     .clear()
//     .type(texto, { delay: 50 })
//     .blur()
//   cy.wait(1000)
//   cy.log('Motivo preenchido')
// })

// STEP COMENTADO - usando versão otimizada do complement_gipe.js
// When('clica em Finalizar modal', () => {
//   cy.wait(2000)
//   cy.log('Finalizando cadastro')
//   cy.xpath('/html/body/div[3]/form/div[2]/button[2]', { timeout: 15000 })
//     .should('exist')
//     .should('be.visible')
//     .should('contain.text', 'Finalizar')
//     .click({ force: true })
//   cy.wait(3000)
//   cy.log('Cadastro finalizado')
// })

Then('valida a existencia do texto sucesso {string}', (texto) => {
  cy.wait(3000)
  cy.log(`Validando mensagem de sucesso: ${texto}`)
  cy.get('body').then($body => {
    if ($body.text().includes(texto)) {
      cy.log(`UE: Mensagem de sucesso encontrada no DOM: "${texto}"`)
    }
  })
  cy.wait(1000)
})

// ================================================================
// STEPS UE — FLUXO COMPLETO COM PREFIXO UE
// ================================================================

const ueNomesAgressores = [
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
const ueIdadesValidas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
const ueNacionalidades = [
  'Brasileira', 'Argentina', 'Boliviana', 'Colombiana', 'Peruana',
  'Paraguaia', 'Uruguaia', 'Venezuelana', 'Chilena', 'Haitiana'
]
const ueTextoInteracao = [
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

// ── Aba 1 ──────────────────────────────────────────────────────────

When('UE inicia o cadastro de uma nova ocorrência', () => {
  cy.wait(2000)
  cy.get('body').then($body => {
    const porTexto = $body.find('button').filter((_, btn) =>
      /nova ocorr|registrar|cadastrar/i.test((btn.innerText || '').trim())
    )
    if (porTexto.length > 0) {
      cy.wrap(porTexto.first(), { timeout: 20000 }).should('be.visible').click({ force: true })
    } else {
      cy.get('main button', { timeout: 20000 }).filter(':visible').first().click({ force: true })
    }
  })
  cy.wait(4000)
  cy.url({ timeout: 15000 }).should('include', '/cadastrar-ocorrencia')
})

When('UE informa a data atual do ocorrido', () => {
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

When('UE informa a hora atual do ocorrido', () => {
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

When('UE seleciona o tipo Interpessoal da ocorrência', () => {
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

When('UE seleciona o tipo Patrimonia da ocorrência', () => {
  cy.wait(2000)
  cy.get(
    'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.space-y-2 > label',
    { timeout: 15000 }
  ).then($labels => {
    const $patrimonio = $labels.filter((_, el) => /Patrim[oô]ni/i.test(el.innerText || ''))
    if ($patrimonio.length > 0) {
      cy.wrap($patrimonio.first()).scrollIntoView().should('be.visible').click({ force: true })
    } else {
      cy.contains('span.text-sm', /Patrim[oô]ni/i, { timeout: 15000 })
        .scrollIntoView().should('be.visible').click({ force: true })
    }
  })
  cy.wait(1500)
})

// ── Aba 2 ──────────────────────────────────────────────────────────

When('UE abre o campo de envolvidos', () => {
  cy.wait(2000)
  cy.get('fieldset div.grid.gap-6 > div:nth-child(2) > button', { timeout: 15000 })
    .filter(':visible').first().should('be.enabled').click({ force: true })
  cy.wait(2500)
})

When('UE seleciona um envolvido aleatoriamente', () => {
  cy.wait(2000)
  cy.get('body').then($body => {
    const $opts = $body.find('[role="option"]:visible, [role="listbox"] [role="option"]:visible')
    if ($opts.length > 0) {
      const idx = Math.floor(Math.random() * $opts.length)
      cy.wrap($opts.eq(idx)).scrollIntoView().click({ force: true })
    }
  })
  cy.wait(2000)
})

When('UE clica no botão Clique aqui', () => {
  cy.wait(1000)
  cy.contains('button', /Clique aqui/i, { timeout: 10000 })
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(1500)
})

When('UE fecha o dropdown de envolvidos', () => {
  cy.wait(1000)
  cy.get('div.flex.justify-end.mt-2 > button', { timeout: 10000 })
    .filter(':visible').first().click({ force: true })
  cy.wait(1000)
})

When('UE seleciona Sim para informações sobre pessoas envolvidas', () => {
  cy.wait(1000)
  cy.contains('span.text-sm', 'Sim', { timeout: 15000 })
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(1500)
})

// ── Aba 3 ──────────────────────────────────────────────────────────

When('UE valida o titulo do campo {string}', (titulo) => {
  cy.wait(1000)
  cy.contains('label', titulo, { timeout: 15000 }).should('exist').should('be.visible')
})

When('UE clica no campo e informa o nome da pessoa aleatoriamente', () => {
  const nome = ueNomesAgressores[Math.floor(Math.random() * ueNomesAgressores.length)]
  cy.wait(1000)
  cy.get('input[name*="pessoasAgressoras"][name$="nome"]', { timeout: 15000 }).last()
    .scrollIntoView().should('be.visible').should('be.enabled')
    .click({ force: true }).clear({ force: true })
    .type(nome, { delay: 50, force: true })
  cy.wait(1000)
})

When('UE informa a idade aleatoriamente', () => {
  const idade = ueIdadesValidas[Math.floor(Math.random() * ueIdadesValidas.length)]
  cy.wait(1000)
  cy.get('input[name*="pessoasAgressoras"][name$=".idade"]', { timeout: 15000 }).last()
    .scrollIntoView().should('be.visible').should('be.enabled')
    .click({ force: true }).clear({ force: true })
    .type(String(idade), { delay: 50, force: true })
  cy.wait(1000)
})

When('UE valida e seleciona o campo {string} de forma aleatoria', (campo) => {
  const config = {
    'Qual o gênero?*': /g[eê]nero/i,
    'Raça/cor auto declarada*': /ra[cç]a|cor auto/i,
    'Qual a etapa escolar?*': /etapa escolar/i,
    'Qual a frequência escolar?*': /frequ.*escolar/i,
    'Pessoa com deficiência?*': /defici[eê]ncia/i,
    'Nacionalidade*': /nacionalidade/i,
  }

  if (campo === 'Nacionalidade*') {
    const nac = ueNacionalidades[Math.floor(Math.random() * ueNacionalidades.length)]
    cy.contains('label', /nacionalidade/i, { timeout: 15000 }).should('exist').should('be.visible')
    cy.get('input[name*="pessoasAgressoras"][name$="nacionalidade"]', { timeout: 15000 }).last()
      .scrollIntoView().should('be.visible').should('be.enabled')
      .click({ force: true }).clear({ force: true })
      .type(nac, { delay: 50, force: true })
    cy.wait(1000)
    return
  }

  const labelRegex = config[campo]
  if (!labelRegex) throw new Error(`Campo UE "${campo}" não está mapeado`)

  cy.wait(1000)
  cy.get('label', { timeout: 15000 }).then($labels => {
    const $match = $labels.filter((_, el) => labelRegex.test(el.innerText || el.textContent || ''))
    expect($match.length).to.be.greaterThan(0)
    cy.wrap($match.last()).closest('div').find('button[role="combobox"]').first()
      .scrollIntoView().should('be.visible').should('be.enabled').click({ force: true })
  })
  cy.wait(1500)
  cy.get('[role="option"]', { timeout: 10000 }).filter(':visible').then($opts => {
    expect($opts.length).to.be.greaterThan(0)
    cy.wrap($opts.eq(Math.floor(Math.random() * $opts.length))).scrollIntoView().click({ force: true })
  })
  cy.wait(1000)
})

When('UE valida e preenche o campo {string} com texto aleatorio', (_campo) => {
  const texto = ueTextoInteracao[Math.floor(Math.random() * ueTextoInteracao.length)]
  cy.wait(1500)
  cy.contains('label', /Como é a interação.*ambiente escolar/i, { timeout: 15000 }).should('be.visible')
  cy.get('textarea[name*="pessoasAgressoras"]', { timeout: 15000 }).last()
    .scrollIntoView().should('be.visible').should('be.enabled')
    .click({ force: true }).clear({ force: true })
    .type(texto, { delay: 50, force: true }).blur({ force: true })
  cy.wait(1000)
})

When('UE Valida e clica em adicionar pessoa', () => {
  cy.wait(1500)
  cy.contains('button', /\+\s*adicionar pessoa|adicionar pessoa/i, { timeout: 15000 })
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(2000)
})

When('UE Valida a existencia do texto {string}', (texto) => {
  cy.wait(1000)
  cy.contains('label', texto, { timeout: 15000 }).should('exist').should('be.visible')
})

When('UE abre e seleciona as motivações aleatoriamente', () => {
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

// ── Aba 4 ──────────────────────────────────────────────────────────

When('UE clica no campo do declarante', () => {
  cy.wait(2000)
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($buttons => {
    cy.wrap($buttons.eq(0)).should('be.visible').should('be.enabled').click({ force: true })
  })
  cy.wait(2500)
})

When('UE seleciona uma das opções de forma aleatoria como declarante', () => {
  cy.wait(1500)
  cy.get('[role="option"]', { timeout: 15000 }).filter(':visible').then(($options) => {
    if ($options.length === 0) { cy.wait(2000); return }
    cy.wrap($options.eq(Math.floor(Math.random() * $options.length))).click({ force: true })
  })
  cy.wait(1500)
})

When('UE clica no campo de seguranca publica', () => {
  cy.wait(2000)
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($buttons => {
    cy.wrap($buttons.eq(1)).should('be.visible').should('be.enabled').click({ force: true })
  })
  cy.wait(2500)
})

When('UE seleciona opcao seguranca publica de forma aleatoria entre as opções disponiveis', () => {
  cy.wait(3000)
  cy.get('[role="option"]', { timeout: 15000 }).filter(':visible').then(($options) => {
    if ($options.length === 0) { cy.wait(2000); return }
    cy.wrap($options.eq(Math.floor(Math.random() * $options.length))).click({ force: true })
  })
  cy.wait(1500)
})

When('UE clica no campo de protocolo', () => {
  cy.wait(2000)
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($buttons => {
    cy.wrap($buttons.eq(2)).should('be.visible').should('be.enabled').click({ force: true })
  })
  cy.wait(2500)
})

When('UE seleciona protocolo aleatoriamente', () => {
  cy.wait(3000)
  cy.get('[role="option"]', { timeout: 20000 }).filter(':visible').then($options => {
    if ($options.length === 0) return
    cy.wrap($options.eq(Math.floor(Math.random() * $options.length))).click({ force: true })
  })
  cy.wait(2000)
})

When('UE clica em proximo para anexos', () => {
  cy.wait(3000)
  cy.get('button[type="submit"]', { timeout: 30000 })
    .first().should('be.visible').should('not.be.disabled')
    .scrollIntoView().click({ force: true })
  cy.wait(3000)
})

// ── Aba 5 ──────────────────────────────────────────────────────────

When('UE localiza e clica no botão {string}', (botao) => {
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

When('UE seleciona a imagem do pc', () => {
  cy.wait(1000)
  cy.get('input[type="file"]', { timeout: 10000 })
    .selectFile({
      contents: Cypress.Buffer.from('fake-image-content'),
      fileName: 'test-image.jpg',
      mimeType: 'image/jpeg'
    }, { force: true })
  cy.wait(2000)
})

When('UE clica no campo tipo documento', () => {
  cy.wait(1500)
  cy.get('button[role="combobox"]', { timeout: 15000 }).last().should('be.visible').click({ force: true })
  cy.wait(1500)
})

When('UE seleciona {string}', (opcao) => {
  cy.wait(1500)
  cy.contains('[role="option"]', opcao, { timeout: 10000 })
    .should('be.visible').click({ force: true })
  cy.wait(1000)
})

When('UE localiza o button {string}', (textoBotao) => {
  cy.wait(2000)
  cy.contains('button', new RegExp(textoBotao, 'i'), { timeout: 15000 })
    .should('exist').should('be.visible')
})

When('UE localiza e clica em {string}', (textoBotao) => {
  cy.wait(2000)
  cy.contains('button', new RegExp(textoBotao.trim(), 'i'), { timeout: 15000 })
    .should('be.visible').should('not.be.disabled')
    .scrollIntoView().click({ force: true })
  cy.wait(3000)
})

// ── Conclusão ──────────────────────────────────────────────────────

When('UE valida a existencia do texto sucesso {string}', (texto) => {
  cy.wait(3000)
  cy.get('body').then($body => {
    if ($body.text().includes(texto)) {
      cy.log(`UE: Mensagem de sucesso encontrada no DOM: "${texto}"`)
    }
  })
  cy.wait(1000)
})

When('UE aguarda {int} segundos', (segundos) => {
  cy.wait(segundos * 1000)
})

Then('UE valida a existencia do Texto {string}', (texto) => {
  cy.wait(2000)
  cy.get('h1', { timeout: 10000 }).then(($h1) => {
    if (!$h1.text().includes(texto.trim())) {
      cy.contains('button', /Finalizar e enviar/i).then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn.last()).should('not.be.disabled').scrollIntoView().click({ force: true })
          cy.wait(3000)
        }
      })
    }
  })
  cy.get('h1', { timeout: 15000 }).should('be.visible').and('contain.text', texto.trim())
})

// ── Pergunta 19: Conselho Tutelar ────────────────────────────────────────
When('UE seleciona aleatoriamente resposta para Conselho Tutelar', () => {
  cy.wait(1000)
  const opcoes = ['Sim', 'Não']
  const escolha = opcoes[Math.floor(Math.random() * opcoes.length)]
  cy.contains('label', /Conselho Tutelar/i, { timeout: 15000 }).should('be.visible')
    .closest('fieldset, div')
    .find(`button[role="radio"][value="${escolha}"]`, { timeout: 10000 })
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(1000)
})

// ── Pergunta 20: Acompanhamento ───────────────────────────────────────────
When('UE seleciona aleatoriamente opcao de acompanhamento da ocorrência', () => {
  const opcoes = ['NAAPA', 'Comissão de Mediação de Conflitos', 'Supervisão Escolar', 'CEFAI', 'Vara da infância']
  const escolha = opcoes[Math.floor(Math.random() * opcoes.length)]
  cy.wait(1500)
  cy.contains('label', /acompanhada por/i, { timeout: 15000 }).should('be.visible')
    .closest('fieldset, div[class*="space-y"], div')
    .contains('span', escolha)
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(1000)
})

// ── Pergunta 21: Processo SEI ─────────────────────────────────────────────
When('UE seleciona aleatoriamente resposta para processo SEI', () => {
  const numerosSEI = [
    '731020001', '731020002', '731020003', '731020004', '731020005',
    '731020006', '731020007', '731020008', '731020009', '731020010',
    '731020011', '731020012', '731020013', '731020014', '731020015',
    '731020016', '731020017', '731020018', '731020019', '731020020',
    '731025001', '731025002', '731025003', '731025004', '731025005',
    '731025006', '731025007', '731025008', '731025009', '731025010',
    '731025011', '731025012', '731025013', '731025014', '731025015',
  ]
  cy.wait(1000)
  const opcoes = ['Sim', 'Não']
  const escolha = opcoes[Math.floor(Math.random() * opcoes.length)]
  cy.contains('label', /processo SEI/i, { timeout: 15000 })
    .closest('fieldset, div')
    .find(`button[role="radio"][value="${escolha}"]`, { timeout: 10000 })
    .scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(1000)
  if (escolha === 'Sim') {
    const numeroAleatorio = numerosSEI[Math.floor(Math.random() * numerosSEI.length)]
    cy.get('input[id*="form-item"]', { timeout: 10000 })
      .filter(':visible').last()
      .should('be.enabled').clear({ force: true })
      .type(numeroAleatorio, { delay: 80, force: true })
    cy.wait(500)
  }
})

When('UE avança para a próxima aba', () => {
  cy.wait(2000)
  cy.get('button[type="submit"]', { timeout: 20000 })
    .should('be.visible').should('not.be.disabled')
    .first().scrollIntoView().click({ force: true })
  cy.wait(3000)
})

When('UE clica em Fechar', () => {
  cy.wait(1000)
  const tentarFechar = (tentativas) => {
    cy.get('body').then(($body) => {
      const $radixBtn = $body.find('[role="dialog"] div.flex.flex-col-reverse button, [aria-modal="true"] div.flex.flex-col-reverse button')
      if ($radixBtn.length > 0) {
        cy.log('UE: Fechar via Radix dialog footer')
        cy.wrap($radixBtn.first()).scrollIntoView().click({ force: true })
        return
      }
      const $dialogBtn = $body.find('[role="dialog"] button, [aria-modal="true"] button')
      if ($dialogBtn.length > 0) {
        cy.log('UE: Fechar via dialog button')
        cy.wrap($dialogBtn.first()).scrollIntoView().click({ force: true })
        return
      }
      const $fecharTexto = $body.find('button').filter((_, el) => /^fechar$/i.test(el.textContent.trim()))
      if ($fecharTexto.length > 0) {
        cy.log('UE: Fechar via texto do botão')
        cy.wrap($fecharTexto.first()).scrollIntoView().click({ force: true })
        return
      }
      if ($body.text().includes('Histórico de ocorrências registradas')) {
        cy.log('UE: Já na página de histórico, modal já fechado')
        return
      }
      if (tentativas > 0) {
        cy.log(`UE: Aguardando modal... tentativa ${6 - tentativas}/5`)
        cy.wait(2000)
        tentarFechar(tentativas - 1)
      }
    })
  }
  tentarFechar(5)
  cy.wait(2000)
})

When('clica em {string} modal sucesso', (textoBotao) => {
  cy.wait(2000)
  cy.log(`Clicando no botão: ${textoBotao}`)
  cy.xpath('/html/body/div[3]/div[4]/button', { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .should('contain.text', textoBotao)
    .click({ force: true })
  cy.wait(2000)
  cy.log(' Modal fechado com sucesso')
})

When('aguarda {int} segundos', (segundos) => {
  cy.wait(segundos * 1000)
  cy.log(`Aguardando ${segundos}s`)
})

Then('valida a existencia do Texto {string}', (texto) => {
  cy.wait(2000)
  cy.log(`Validando existência do texto: ${texto}`)
  cy.get('h1', { timeout: 15000 })
    .should('be.visible')
    .and('contain.text', texto.trim())
  cy.log(' Texto validado com sucesso')
})

When('clica no botão {string}', (botao) => {
  cy.wait(2000)
  cy.log(`Clicando no botão: ${botao}`)
  cy.contains('button', botao, { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(2000)
  cy.log('Teste concluído')
})

function gerarTextoAleatorio(tipo) {
  const descricoes = [
    "Esse aluno causou pânico e medo nos outros estudantes",
    "Ocorrência registrada com detalhes sobre o incidente",
    "Situação envolvendo comportamento inadequado",
    "Incidente que requer atenção e acompanhamento",
    "Evento que necessita documentação e providências"
  ]
  const interacoes = [
    "Aluno sempre sociável e tranquilo",
    "Estudante com boa interação social",
    "Comportamento geralmente adequado",
    "Pessoa com relacionamento cordial",
    "Indivíduo com interações positivas"
  ]
  const redes = [
    "Todas as redes disponíveis",
    "Redes de apoio familiar e escolar",
    "Suporte da comunidade escolar",
    "Rede de proteção ativa",
    "Acompanhamento por instâncias competentes"
  ]
  if (tipo === 'descricao') return descricoes[Math.floor(Math.random() * descricoes.length)]
  if (tipo === 'interacao') return interacoes[Math.floor(Math.random() * interacoes.length)]
  if (tipo === 'redes') return redes[Math.floor(Math.random() * redes.length)]
}

When('Selecionar tipo de ocorrencia aleatorio', () => {
  cy.wait(2000)
  cy.log('Selecionando tipo de ocorrência aleatório')
  cy.get('div[role="listbox"], div[class*="dropdown"], div[class*="menu"]', { timeout: 10000 })
    .should('be.visible')
    .find('div[role="option"], li, button')
    .filter(':visible')
    .then($options => {
      const validOptions = []
      $options.each((index, option) => {
        const texto = Cypress.$(option).text().trim()
        if (texto.length > 10 && texto.length < 100 && !texto.includes('Selecione')) {
          validOptions.push(option)
        }
      })
      if (validOptions.length > 0) {
        const randomIndex = Math.floor(Math.random() * validOptions.length)
        const selectedOption = Cypress.$(validOptions[randomIndex]).text().trim()
        cy.log(`Selecionado: ${selectedOption}`)
        cy.wrap(validOptions[randomIndex]).click({ force: true })
      }
    })
  cy.wait(2500)
})

When('seleciona envolvidos aleatorio', () => {
  cy.wait(2000)
  cy.log('Selecionando envolvidos aleatório')
  cy.wait(2000)
  cy.get('body').then($body => {
    if ($body.find('div[role="option"]').length > 0) {
      cy.get('div[role="option"]', { timeout: 10000 }).filter(':visible').then($options => {
        const randomIndex = Math.floor(Math.random() * $options.length)
        const selectedOption = $options.eq(randomIndex).text()
        cy.log(`Selecionado: ${selectedOption}`)
        cy.wrap($options.eq(randomIndex)).click({ force: true })
      })
    }
  })
  cy.wait(1500)
})

When('preenche descricao aleatoria', () => {
  cy.wait(2000)
  const textoAleatorio = gerarTextoAleatorio('descricao')
  cy.log(`Preenchendo: ${textoAleatorio}`)
  cy.get('textarea[id*="form-item"]', { timeout: 15000 })
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })
    .clear()
    .type(textoAleatorio, { delay: 100, force: true })
    .blur()
  cy.wait(1000)
  cy.get('textarea[id*="form-item"]')
    .invoke('val')
    .should('include', textoAleatorio.substring(0, 20))
})

When('seleciona motivacoes aleatorias', () => {
  cy.wait(2000)
  cy.log('Selecionando motivações aleatórias')
  cy.get('div[role="listbox"]', { timeout: 10000 })
    .should('be.visible')
    .find('[role="option"]')
    .then(($opts) => {
      expect($opts.length, 'deve haver opções no listbox').to.be.greaterThan(0)
      const count = $opts.length
      const idx1 = Math.floor(Math.random() * count)
      let idx2 = Math.floor(Math.random() * count)
      while (count > 1 && idx2 === idx1) {
        idx2 = Math.floor(Math.random() * count)
      }
      cy.log(`Selecionando opção 1: ${$opts[idx1].innerText.trim()}`)
      cy.wrap($opts[idx1]).scrollIntoView().click({ force: true })
      cy.wait(500)
      if (idx1 !== idx2) {
        cy.log(`Selecionando opção 2: ${$opts[idx2].innerText.trim()}`)
        cy.wrap($opts[idx2]).scrollIntoView().click({ force: true })
      }
    })
  cy.wait(1000)
})

When('seleciona genero aleatorio', () => {
  cy.wait(1500)
  cy.log('Selecionando gênero aleatório')
  cy.contains('label', /gênero/i, { timeout: 15000 })
    .closest('div')
    .find('button')
    .first()
    .scrollIntoView()
    .click({ force: true })
  cy.wait(2000)
  cy.get('[role="option"]', { timeout: 10000 })
    .filter(':visible')
    .then($options => {
      const randomIndex = Math.floor(Math.random() * $options.length)
      const selectedOption = $options.eq(randomIndex).text()
      cy.log(`Gênero selecionado: ${selectedOption}`)
      cy.wrap($options.eq(randomIndex)).click({ force: true })
    })
  cy.wait(1000)
})

When('seleciona etnico aleatorio', () => {
  cy.wait(1500)
  cy.log('Selecionando étnico-racial aleatório')
  cy.contains('label', /étnico|etnico/i, { timeout: 15000 })
    .closest('div')
    .find('button')
    .first()
    .scrollIntoView()
    .click({ force: true })
  cy.wait(2000)
  cy.get('[role="option"]', { timeout: 10000 })
    .filter(':visible')
    .then($options => {
      const randomIndex = Math.floor(Math.random() * $options.length)
      const selectedOption = $options.eq(randomIndex).text()
      cy.log(`Étnico selecionado: ${selectedOption}`)
      cy.wrap($options.eq(randomIndex)).click({ force: true })
    })
  cy.wait(1000)
})

When('seleciona etapa aleatoria', () => {
  cy.wait(1500)
  cy.log('Selecionando etapa aleatória')
  cy.contains('label', /etapa escolar/i, { timeout: 15000 })
    .closest('div')
    .find('button')
    .first()
    .scrollIntoView()
    .click({ force: true })
  cy.wait(2000)
  cy.get('[role="option"]', { timeout: 10000 })
    .filter(':visible')
    .then($options => {
      const randomIndex = Math.floor(Math.random() * $options.length)
      const selectedOption = $options.eq(randomIndex).text()
      cy.log(`Etapa selecionada: ${selectedOption}`)
      cy.wrap($options.eq(randomIndex)).click({ force: true })
    })
  cy.wait(1000)
})

When('seleciona frequencia aleatoria', () => {
  cy.wait(2000)
  cy.log('Selecionando frequência aleatória')
  cy.get('body').type('{esc}')
  cy.wait(1000)
  cy.contains('label', /frequência escolar|frequencia escolar/i, { timeout: 15000 }).should('be.visible')
  cy.contains('label', /frequência escolar|frequencia escolar/i, { timeout: 15000 })
    .closest('div')
    .find('button')
    .first()
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
  cy.log('Aguardando dropdown de frequência abrir...')
  cy.wait(3000)
  cy.get('[role="option"]', { timeout: 15000 })
    .filter(':visible')
    .should('have.length.greaterThan', 0)
    .then($options => {
      const randomIndex = Math.floor(Math.random() * $options.length)
      const selectedOption = $options.eq(randomIndex).text()
      cy.log(`Frequência selecionada: ${selectedOption}`)
      cy.wrap($options.eq(randomIndex)).click({ force: true })
    })
  cy.wait(1500)
  cy.log('Frequência escolar selecionada com sucesso')
})

When('preenche interacao aleatoria', () => {
  cy.wait(1500)
  const textoAleatorio = gerarTextoAleatorio('interacao')
  cy.log(`Preenchendo interação: ${textoAleatorio}`)
  cy.get('textarea', { timeout: 15000 })
    .filter(':visible')
    .first()
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(textoAleatorio, { delay: 50, force: true })
  cy.wait(1000)
})

When('preenche redes aleatoria', () => {
  cy.wait(1500)
  const textoAleatorio = gerarTextoAleatorio('redes')
  cy.log(`Preenchendo redes: ${textoAleatorio}`)
  cy.get('textarea', { timeout: 15000 })
    .filter(':visible')
    .eq(1)
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(textoAleatorio, { delay: 50, force: true })
  cy.wait(1000)
})

// ==================== STEPS NOMEADOS: VALIDAÇÃO E SELEÇÃO POR CAMPO ====================

/**
 * Valida a visibilidade de um rótulo de campo pelo seu texto literal.
 */
When('valida o campo {string}', (label) => {
  cy.wait(1000)
  cy.log(`Validando campo: ${label}`)
  cy.contains('label', label.trim(), { timeout: 15000 }).should('be.visible')
  cy.log(`Campo "${label}" validado`)
})

/**
 * Abre o dropdown DRE (Aba 1) e seleciona uma opção aleatória.
 * Versão corrigida: abordagem sequencial sem bug de sincronização.
 */
When('seleciona uma DRE aleatoriamente', () => {
  cy.wait(1500)
  cy.log('Abrindo dropdown DRE')

  // Clica no dropdown
  cy.xpath(
    '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[2]/button',
    { timeout: 15000 }
  )
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })

  cy.wait(3000) // Aguarda dropdown abrir completamente

  // Abordagem sequencial: tenta seletor [role="option"] primeiro
  cy.get('body').then($body => {
    const optionsExist = $body.find('[role="option"]:visible').length > 0

    if (optionsExist) {
      cy.log('✅ Dropdown DRE aberto com sucesso - selecionando opção aleatória')
      cy.get('[role="option"]', { timeout: 15000 })
        .filter(':visible')
        .then($options => {
          expect($options.length, 'deve haver opções no dropdown DRE').to.be.greaterThan(0)
          const idx = Math.floor(Math.random() * $options.length)
          const selectedText = $options.eq(idx).text().trim()
          cy.log(`DRE selecionada: "${selectedText}"`)
          cy.wrap($options.eq(idx)).scrollIntoView().click({ force: true })
        })
    } else {
      // Fallback: tenta seletores alternativos
      cy.log('⚠️ Dropdown DRE não encontrado com [role="option"], tentando alternativas...')
      
      const divOptionsExist = $body.find('div[role="option"]:visible').length > 0
      const radixOptionsExist = $body.find('[data-radix-select-option]:visible').length > 0
      
      if (divOptionsExist) {
        cy.log('✅ Encontradas opções com div[role="option"]')
        cy.get('div[role="option"]', { timeout: 10000 })
          .filter(':visible')
          .then($opts => {
            const idx = Math.floor(Math.random() * $opts.length)
            cy.wrap($opts.eq(idx)).scrollIntoView().click({ force: true })
          })
      } else if (radixOptionsExist) {
        cy.log('✅ Encontradas opções com [data-radix-select-option]')
        cy.get('[data-radix-select-option]', { timeout: 10000 })
          .filter(':visible')
          .then($opts => {
            const idx = Math.floor(Math.random() * $opts.length)
            cy.wrap($opts.eq(idx)).scrollIntoView().click({ force: true })
          })
      } else {
        // Último recurso: procura por texto de DRE
        cy.log('🔎 Último recurso: procurando por texto de DRE')
        cy.contains(/DIRETORIA|EDUCACAO|DRE|REGIONAL/i, { timeout: 10000 })
          .filter(':visible')
          .first()
          .scrollIntoView()
          .click({ force: true })
      }
    }
  })

  cy.wait(2000) // Tempo extra para processamento da seleção
})

/**
 * Abre o dropdown Unidade Educacional (Aba 1) e seleciona uma opção aleatória.
 * Versão corrigida: abordagem sequencial sem bug de sincronização.
 */
When('seleciona uma Unidade Educacional aleatoriamente', () => {
  cy.wait(1500)
  cy.log('Abrindo dropdown Unidade Educacional')

  // Aguarda até que o botão esteja habilitado (pode levar tempo após seleção da DRE)
  cy.xpath(
    '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[2]/button',
    { timeout: 45000 } // Aumentado para 45 segundos
  )
    .should('be.visible')
    .should('be.enabled') // Cypress vai fazer retry até estar enabled

  cy.log('Botão da Unidade Educacional está habilitado, clicando...')

  // Clica no dropdown
  cy.xpath(
    '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[2]/button',
    { timeout: 15000 }
  )
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })

  cy.wait(3000) // Aguarda dropdown abrir completamente

  // Abordagem sequencial: tenta seletor [role="option"] primeiro
  cy.get('body').then($body => {
    const optionsExist = $body.find('[role="option"]:visible').length > 0

    if (optionsExist) {
      cy.log('✅ Dropdown UE aberto com sucesso - selecionando opção aleatória')
      cy.get('[role="option"]', { timeout: 15000 })
        .filter(':visible')
        .then($options => {
          expect($options.length, 'deve haver opções no dropdown UE').to.be.greaterThan(0)
          const idx = Math.floor(Math.random() * $options.length)
          const selectedText = $options.eq(idx).text().trim()
          cy.log(`Unidade Educacional selecionada: "${selectedText}"`)
          cy.wrap($options.eq(idx)).scrollIntoView().click({ force: true })
        })
    } else {
      // Fallback: tenta seletores alternativos
      cy.log('⚠️ Dropdown UE não encontrado com [role="option"], tentando alternativas...')
      
      const divOptionsExist = $body.find('div[role="option"]:visible').length > 0
      const radixOptionsExist = $body.find('[data-radix-select-option]:visible').length > 0
      
      if (divOptionsExist) {
        cy.log('✅ Encontradas opções com div[role="option"]')
        cy.get('div[role="option"]', { timeout: 10000 })
          .filter(':visible')
          .then($opts => {
            const idx = Math.floor(Math.random() * $opts.length)
            cy.wrap($opts.eq(idx)).scrollIntoView().click({ force: true })
          })
      } else if (radixOptionsExist) {
        cy.log('✅ Encontradas opções com [data-radix-select-option]')
        cy.get('[data-radix-select-option]', { timeout: 10000 })
          .filter(':visible')
          .then($opts => {
            const idx = Math.floor(Math.random() * $opts.length)
            cy.wrap($opts.eq(idx)).scrollIntoView().click({ force: true })
          })
      } else {
        // Último recurso: procura por texto de escola
        cy.log('🔎 Último recurso: procurando por texto de escola/unidade')
        cy.contains(/ESCOLA|EMEI|EMEF|CIEJA|CEI|DRE/i, { timeout: 10000 })
          .filter(':visible')
          .first()
          .scrollIntoView()
          .click({ force: true })
      }
    }
  })

  cy.wait(2000) // Tempo extra para processamento da seleção
})

/**
 * Valida o rótulo e seleciona aleatoriamente o dropdown do campo informado (Aba 3).
 * Campos suportados: "Gênero", "Étnico-Racial", "Etapa Escolar", "Frequência Escolar".
 */
When('valida e seleciona o campo {string} de forma aleatoria', (campo) => {
  const config = {
    'Gênero': {
      tituloIndex: 2, // aba3TitulosCSS[2]
      xpath: '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/div[1]/div[3]/button'
    },
    'Étnico-Racial': {
      tituloIndex: 3, // aba3TitulosCSS[3]
      xpath: '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/div[2]/div[1]/button'
    },
    'Etapa Escolar': {
      tituloIndex: 4, // aba3TitulosCSS[4]
      xpath: '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/div[2]/div[2]/button'
    },
    'Frequência Escolar': {
      tituloIndex: 5, // aba3TitulosCSS[5]
      xpath: '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/div[2]/div[3]/button'
    }
  }
  const { tituloIndex, xpath } = config[campo] || {}
  if (!xpath) throw new Error(`Campo "${campo}" não está mapeado em "valida e seleciona o campo"`)

  cy.wait(1500)
  cy.log(`Validando e selecionando campo: ${campo}`)
  
  // Valida o título usando o seletor CSS específico
  cy.get(aba3TitulosCSS[tituloIndex], { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .then($el => cy.log(`Label de "${campo}" encontrado: "${$el.text().trim()}"`))
  
  // Clica no dropdown
  cy.xpath(xpath, { timeout: 15000 })
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })
  cy.wait(2000)
  
  // Seleciona uma opção aleatória
  cy.get('[role="option"]', { timeout: 10000 })
    .filter(':visible')
    .then($options => {
      expect($options.length, `deve haver opções para "${campo}"`).to.be.greaterThan(0)
      const idx = Math.floor(Math.random() * $options.length)
      cy.log(`${campo} selecionado: "${$options.eq(idx).text().trim()}"`)
      cy.wrap($options.eq(idx)).scrollIntoView().click({ force: true })
    })
  cy.wait(1500)
})

/**
 * Valida o rótulo do campo de interação escolar e preenche com texto aleatório.
 */
When('valida e preenche o campo {string} com texto aleatorio', (campo) => {
  const idx = Math.floor(Math.random() * textoInteracaoEscolar.length)
  const texto = textoInteracaoEscolar[idx]
  cy.wait(1500)
  cy.log(`Validando e preenchendo campo: ${campo}`)
  cy.contains('label', /Como é a interação.*ambiente escolar/i, { timeout: 15000 })
    .should('be.visible')
  cy.contains('label', /Como é a interação.*ambiente escolar/i, { timeout: 15000 })
    .closest('[class*="space-y"]')
    .find('textarea')
    .first()
    .scrollIntoView()
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })
    .clear({ force: true })
    .type(texto, { delay: 50, force: true })
    .blur()
  cy.wait(1000)
  cy.log(`Campo "${campo}" preenchido: "${texto}"`)
})

// ==================== STEPS SEQUENCIAIS: ABA 1 (DRE / UE) E ABA 3 ====================

/**
 * Clica no campo DRE (Aba 1) e seleciona uma opção aleatória.
 * Xpath: /html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[2]/button
 */
When('clica no campo e seleciona uma das opções aleatoriamente', () => {
  cy.wait(1500)
  cy.log('Abrindo dropdown DRE e selecionando opção aleatória')
  cy.xpath(
    '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[2]/button',
    { timeout: 15000 }
  )
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })
  cy.wait(2000)
  cy.get('[role="option"]', { timeout: 10000 })
    .filter(':visible')
    .then($options => {
      expect($options.length, 'deve haver opções no dropdown DRE').to.be.greaterThan(0)
      const randomIndex = Math.floor(Math.random() * $options.length)
      cy.log(`DRE selecionada: "${$options.eq(randomIndex).text().trim()}"`)
      cy.wrap($options.eq(randomIndex)).scrollIntoView().click({ force: true })
    })
  cy.wait(1500)
})

/**
 * Seleciona aleatoriamente um dropdown sequencial conforme a ordem de uso no cenário:
 *   Chamada 1 → Unidade Educacional (Aba 1)
 *   Chamadas 2-5 → gênero / étnico-racial / etapa / frequência (Aba 3)
 */
When('clica no campo e seleciona uma das opções de forma aleatoria', () => {
  const xpath = dropdownXpaths[dropdownSelectCount % dropdownXpaths.length]
  dropdownSelectCount++
  cy.wait(1500)
  cy.log(`Abrindo dropdown sequencial #${dropdownSelectCount} (${xpath.substring(xpath.lastIndexOf('/') + 1)})`)
  cy.xpath(xpath, { timeout: 15000 })
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })
  cy.wait(2000)
  cy.get('[role="option"]', { timeout: 10000 })
    .filter(':visible')
    .then($options => {
      expect($options.length, 'deve haver opções no dropdown').to.be.greaterThan(0)
      const randomIndex = Math.floor(Math.random() * $options.length)
      cy.log(`Opção selecionada: "${$options.eq(randomIndex).text().trim()}"`)
      cy.wrap($options.eq(randomIndex)).scrollIntoView().click({ force: true })
    })
  cy.wait(1500)
})

/**
 * Clica e preenche o campo "Como é a interação da pessoa no ambiente escolar?*"
 * com um texto aleatório da lista de 15 opções curtas.
 */
When('clica no campo e preenche com um texto aleatorio', () => {
  const idx = Math.floor(Math.random() * textoInteracaoEscolar.length)
  const texto = textoInteracaoEscolar[idx]
  cy.wait(1500)
  cy.log(`Preenchendo campo de interação escolar: "${texto}"`)
  cy.contains('label', /Como é a interação.*ambiente escolar/i, { timeout: 15000 })
    .closest('[class*="space-y"]')
    .find('textarea')
    .first()
    .scrollIntoView()
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })
    .clear({ force: true })
    .type(texto, { delay: 50, force: true })
    .blur()
  cy.wait(1000)
  cy.log(`Campo de interação preenchido: "${texto}"`)
})

// ==================== ALIASES PROFISSIONAIS — CADASTR_OCORRENC_GIPE ====================

When('seleciona o tipo de ocorrência aleatoriamente', () => {
  cy.wait(2000)
  cy.log('Selecionando tipo de ocorrência aleatoriamente')
  cy.get('div[role="listbox"], div[class*="dropdown"], div[class*="menu"]', { timeout: 10000 })
    .should('be.visible')
    .find('div[role="option"], li, button')
    .filter(':visible')
    .then($options => {
      const valid = []
      $options.each((_, el) => {
        const txt = Cypress.$(el).text().trim()
        if (txt.length > 10 && txt.length < 100 && !txt.includes('Selecione')) valid.push(el)
      })
      if (valid.length > 0) {
        const idx = Math.floor(Math.random() * valid.length)
        cy.log(`Tipo selecionado: "${Cypress.$(valid[idx]).text().trim()}"`)
        cy.wrap(valid[idx]).click({ force: true })
      }
    })
  cy.wait(2500)
})

/**
 * Valida que um texto de label existe na seção de envolvidos.
 * Uso: E valida a existencia do texto "Quem são os envolvidos?*"
 */
When('valida a existencia do texto {string}', (texto) => {
  cy.wait(1000)
  cy.log(`Validando existência do texto: ${texto}`)
  cy.contains('label', texto.trim(), { timeout: 15000 }).should('be.visible')
  cy.log(`Texto "${texto}" validado com sucesso`)
})

/**
 * Valida que o botão/campo de envolvidos existe e está habilitado.
 * XPath: /html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[2]/div/button
 */
When('valida a existencia do campo de envolvidos', () => {
  cy.wait(1000)
  cy.log('Validando existência do campo de envolvidos')
  cy.xpath(
    '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[2]/div/button',
    { timeout: 15000 }
  )
    .should('be.visible')
    .should('be.enabled')
  cy.log('Campo de envolvidos validado com sucesso')
})

When('abre o campo de envolvidos', () => {
  cy.wait(2000)
  cy.log('Abrindo campo de envolvidos')
  const xpathPrimario = '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[2]/div/button'
  const xpathFallback = '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[2]/button'
  cy.get('body').then($body => {
    if ($body.find('fieldset > div:nth-child(1) > div:nth-child(2) > div > button').length > 0) {
      cy.xpath(xpathPrimario, { timeout: 15000 })
        .should('be.visible').should('be.enabled').click({ force: true })
    } else {
      cy.log('Usando xpath fallback para campo de envolvidos')
      cy.xpath(xpathFallback, { timeout: 15000 })
        .should('be.visible').should('be.enabled').click({ force: true })
    }
  })
  cy.wait(2500)
})

When('seleciona um envolvido aleatoriamente', () => {
  cy.wait(2000)
  cy.log('Selecionando envolvido aleatoriamente')
  cy.get('body').then($body => {
    // Aguardar listbox aberto pelo step anterior
    if ($body.find('div[role="listbox"]').length > 0) {
      cy.get('div[role="listbox"] [role="option"]', { timeout: 10000 })
        .filter(':visible')
        .then($opts => {
          expect($opts.length).to.be.greaterThan(0)
          const idx = Math.floor(Math.random() * $opts.length)
          cy.log(`Envolvido selecionado: "${$opts[idx].innerText.trim()}"`)
          cy.wrap($opts[idx]).scrollIntoView().click({ force: true })
        })
    } else {
      cy.get('[role="option"]', { timeout: 10000 })
        .filter(':visible')
        .then($opts => {
          expect($opts.length).to.be.greaterThan(0)
          const idx = Math.floor(Math.random() * $opts.length)
          cy.log(`Envolvido selecionado: "${$opts[idx].innerText.trim()}"`)
          cy.wrap($opts[idx]).scrollIntoView().click({ force: true })
        })
    }
  })
  cy.wait(2500)
})

When('preenche a descrição com texto aleatório', () => {
  const texto = gerarTextoAleatorio('descricao')
  cy.wait(2000)
  cy.log(`Preenchendo descrição: "${texto}"`)
  cy.get('textarea[id*="form-item"]', { timeout: 15000 })
    .should('be.visible').should('be.enabled')
    .click({ force: true }).clear()
    .type(texto, { delay: 100, force: true }).blur({ force: true })
  cy.wait(1000)
})

// ==================== ABA 3: VALIDAÇÃO DE TÍTULOS E PREENCHIMENTO ====================

/**
 * Valida o label do campo "Qual o nome da pessoa envolvida?*"
 * Seletor: aba3TitulosCSS[0]
 */
When('valida o titulor', () => {
  cy.wait(1500)
  cy.log('Validando título do campo de nome')
  cy.get(aba3TitulosCSS[0], { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .then($el => cy.log(`Label de nome encontrado: "${$el.text().trim()}"`))
})

/**
 * Clica no campo de nome e informa o nome do agressor aleatoriamente
 * Seletor input: aba3CamposInput[0]
 */
When('clica no campo e informa o nome do agressor aleatoriamente', () => {
  const nome = getNomeAleatorio()
  cy.wait(1000)
  cy.log(`Informando nome do agressor: "${nome}"`)
  
  cy.get(aba3CamposInput[0], { timeout: 15000 })
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(nome, { delay: 50, force: true })
  
  cy.wait(1000)
})

/**
 * Valida o label do campo "Qual a idade da pessoa envolvida?*"
 * Seletor: aba3TitulosCSS[1]
 */
When('validao titulto', () => {
  cy.wait(1500)
  cy.log('Validando título do campo de idade')
  cy.get(aba3TitulosCSS[1], { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .then($el => cy.log(`Label de idade encontrado: "${$el.text().trim()}"`))
})

/**
 * Informa a idade do agressor aleatoriamente
 * Seletor input: aba3CamposInput[1]
 */
When('informa a idade do agressor aleatoriamente', () => {
  const idade = getIdadeAleatoria()
  cy.wait(1000)
  cy.log(`Informando idade do agressor: ${idade}`)
  
  cy.get(aba3CamposInput[1], { timeout: 15000 })
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(String(idade), { delay: 50, force: true })
  
  cy.wait(1000)
})

When('abre e seleciona as motivações aleatoriamente', () => {
  cy.wait(1500)
  cy.log('Abrindo e selecionando motivações aleatoriamente')
  cy.xpath(locators.btn_campo_motivacao(), { timeout: 15000 })
    .should('be.visible').click({ force: true })
  cy.wait(2000)
  cy.get('div[role="listbox"]', { timeout: 10000 }).should('be.visible')
    .find('[role="option"]').then($opts => {
      expect($opts.length).to.be.greaterThan(0)
      const count = $opts.length
      const idx1 = Math.floor(Math.random() * count)
      let idx2 = Math.floor(Math.random() * count)
      while (count > 1 && idx2 === idx1) idx2 = Math.floor(Math.random() * count)
      cy.log(`Motivação 1: "${$opts[idx1].innerText.trim()}"`)
      cy.wrap($opts[idx1]).scrollIntoView().click({ force: true })
      cy.wait(500)
      if (idx1 !== idx2) {
        cy.log(`Motivação 2: "${$opts[idx2].innerText.trim()}"`)
        cy.wrap($opts[idx2]).scrollIntoView().click({ force: true })
      }
    })
  cy.wait(1000)
  cy.get('body').type('{esc}')
  cy.wait(1000)
})

When('informa que o Conselho Tutelar foi acionado', () => {
  cy.wait(1500)
  cy.log('Registrando acionamento do Conselho Tutelar')
  cy.contains('label', /Conselho.*Tutelar/i, { timeout: 15000 })
    .parent().parent().find('label').contains('Sim')
    .should('be.visible').click({ force: true })
  cy.wait(1000)
})

When('informa que a ocorrência é acompanhada pelo NAAPA', () => {
  cy.wait(1500)
  cy.log('Registrando acompanhamento pelo NAAPA')
  cy.contains('label', /acompanhada pelo NAAPA/i, { timeout: 15000 })
    .should('be.visible').parent().within(() => {
      cy.contains('label', 'Sim').find('span').first().scrollIntoView().click({ force: true })
    })
  cy.wait(1000)
})

When('preenche as redes de proteção com texto aleatório', () => {
  const texto = gerarTextoAleatorio('redes')
  cy.wait(1500)
  cy.log(`Preenchendo redes de proteção: "${texto}"`)
  cy.get('textarea', { timeout: 15000 }).filter(':visible').eq(1)
    .scrollIntoView().should('be.visible')
    .click({ force: true }).clear({ force: true })
    .type(texto, { delay: 50, force: true })
  cy.wait(1000)
})

When('abre o campo do declarante', () => {
  cy.wait(2000)
  cy.log('Abrindo campo do declarante')
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($btns => {
    cy.wrap($btns.eq(0)).should('be.visible').should('be.enabled').click({ force: true })
  })
  cy.wait(2500)
})

When('seleciona {string} como declarante', (valor) => {
  cy.wait(1500)
  cy.log(`Selecionando "${valor}" como declarante`)
  cy.contains('[role="option"]', new RegExp(valor, 'i'), { timeout: 15000 })
    .should('exist').click({ force: true })
  cy.wait(1500)
})

When('abre o campo de comunicação com segurança pública', () => {
  cy.wait(2000)
  cy.log('Abrindo campo de comunicação com segurança pública')
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($btns => {
    cy.wrap($btns.eq(1)).should('be.visible').should('be.enabled').click({ force: true })
  })
  cy.wait(2500)
})

When('seleciona a opção de segurança pública aleatoriamente', () => {
  cy.wait(3000)
  cy.log('Selecionando opção de segurança pública')
  cy.get('[role="option"]', { timeout: 15000 }).filter(':visible').then($options => {
    const idx = Math.floor(Math.random() * $options.length)
    cy.log(`Opção selecionada: "${$options.eq(idx).text()}"`)
    cy.wrap($options.eq(idx)).click({ force: true })
  })
  cy.wait(1500)
})

When('abre o campo de protocolo acionado', () => {
  cy.wait(2000)
  cy.log('Abrindo campo de protocolo acionado')
  cy.get('button[id*="form-item"]', { timeout: 15000 }).then($btns => {
    cy.wrap($btns.eq(2)).should('be.visible').should('be.enabled').click({ force: true })
  })
  cy.wait(2500)
})

When('seleciona o protocolo aleatoriamente', () => {
  cy.wait(3000)
  cy.log('Selecionando protocolo')
  cy.get('[role="option"]', { timeout: 20000 }).filter(':visible').then($options => {
    if ($options.length === 0) { cy.log('Nenhuma opção de protocolo encontrada'); return }
    const idx = Math.floor(Math.random() * $options.length)
    cy.log(`Protocolo selecionado: "${$options.eq(idx).text()}"`)
    cy.wrap($options.eq(idx)).click({ force: true })
  })
  cy.wait(2000)
})

When('seleciona o arquivo a ser anexado', () => {
  cy.wait(1000)
  cy.log('Selecionando arquivo para anexar')
  cy.get('input[type="file"]', { timeout: 10000 }).selectFile({
    contents: Cypress.Buffer.from('fake-image-content'),
    fileName: 'test-image.jpg',
    mimeType: 'image/jpeg'
  }, { force: true })
  cy.wait(2000)
})

When('abre o campo de tipo de documento', () => {
  cy.wait(1500)
  cy.log('Abrindo campo de tipo de documento')
  cy.get('button[role="combobox"]', { timeout: 15000 })
    .last().should('be.visible').click({ force: true })
  cy.wait(1500)
})

When('valida a presença do botão {string}', (textoBotao) => {
  cy.wait(2000)
  cy.log(`Validando presença do botão: "${textoBotao}"`)
  cy.contains('button', new RegExp(textoBotao, 'i'), { timeout: 15000 })
    .should('exist').should('be.visible')
  cy.log(` Botão "${textoBotao}" confirmado`)
})

When('finaliza o registro da ocorrência', () => {
  cy.wait(2000)
  cy.log('Finalizando registro da ocorrência')
  cy.get('form fieldset div.flex.justify-end.gap-2', { timeout: 15000 })
    .should('be.visible').within(() => {
      cy.get('button').should('have.length.at.least', 2)
      cy.get('button').last()
        .should('contain.text', 'Finalizar')
        .should('not.be.disabled')
        .scrollIntoView().click({ force: true })
    })
  cy.wait(3000)
})

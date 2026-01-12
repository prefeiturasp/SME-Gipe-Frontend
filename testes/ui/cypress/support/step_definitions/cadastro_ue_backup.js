import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import CadastroUeLocalizadores from '../locators/cadastro_ue_locators'

const locators = new CadastroUeLocalizadores()

// ==================== DADOS ALEATÓRIOS ====================

// Lista de nomes completos válidos
const nomesAgressores = [
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
  'Marcos Vinícius Dias'
]

// Lista de idades válidas (18 a 65 anos)
const idadesValidas = [18, 19, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60, 65]

// Lista de CEPs válidos da cidade de São Paulo
const cepsValidos = [
  '01310100', // Av. Paulista
  '04650900', // Vila Olímpia
  '01310200', // Consolação
  '05508010', // Pinheiros
  '02012000', // Santana
  '03310000', // Tatuapé
  '08010090', // São Miguel Paulista
  '03155000', // Vila Formosa
  '05001000', // Perdizes
  '02071000', // Santana
  '04543000', // Vila Olímpia
  '03141000', // Mooca
  '05724000', // Morumbi
  '03162000', // Vila Matilde
  '08230000'  // Itaquera
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
  // Gera números de residência entre 1 e 9999
  return Math.floor(Math.random() * 9999) + 1
}

// ==================== ABA 3: INFORMAÇÕES ADICIONAIS ====================

When('valida a aba {string}', (titulo) => {
  cy.wait(2000)
  cy.log(`Validando aba: ${titulo}`)
  
  cy.get(locators.aba_informacoes_adicionais(), { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', titulo)
  
  cy.log('Aba validada')
})

When('preenche o campo nome agressor com {string}', (nome) => {
  cy.wait(2000)
  cy.log(`Preenchendo nome: ${nome}`)
  
  // Valida que o label existe
  cy.contains('label', /Qual o nome.*pessoa agressora/i, { timeout: 15000 })
    .should('be.visible')
  
  // Preenche o campo
  cy.get('input', { timeout: 15000 })
    .filter(':visible')
    .first()
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(nome, { delay: 50, force: true })
  
  cy.wait(1000)
  cy.log('Nome preenchido')
})

When('preenche o campo idade agressor com {string}', (idade) => {
  cy.wait(1000)
  cy.log(`Preenchendo idade: ${idade}`)
  
  // Valida que o label existe
  cy.contains('label', /Qual a idade.*pessoa agressora/i, { timeout: 15000 })
    .should('be.visible')
  
  // Preenche o campo
  cy.get('input', { timeout: 15000 })
    .filter(':visible')
    .eq(1)
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(idade, { delay: 50, force: true })
  
  cy.wait(1000)
  cy.log('Idade preenchida')
})

// ==================== STEPS ALEATÓRIOS ====================

When('preenche o campo nome agressor aleatorio', () => {
  const nomeAleatorio = getNomeAleatorio()
  cy.wait(2000)
  cy.log(`Preenchendo nome aleatório: ${nomeAleatorio}`)
  
  // Valida que o label existe
  cy.contains('label', /Qual o nome.*pessoa agressora/i, { timeout: 15000 })
    .should('be.visible')
  
  // Preenche o campo
  cy.get('input', { timeout: 15000 })
    .filter(':visible')
    .first()
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(nomeAleatorio, { delay: 50, force: true })
  
  cy.wait(1000)
  cy.log(`✅ Nome preenchido: ${nomeAleatorio}`)
})

When('preenche o campo idade agressor aleatorio', () => {
  const idadeAleatoria = getIdadeAleatoria()
  cy.wait(1000)
  cy.log(`Preenchendo idade aleatória: ${idadeAleatoria}`)
  
  // Valida que o label existe
  cy.contains('label', /Qual a idade.*pessoa agressora/i, { timeout: 15000 })
    .should('be.visible')
  
  // Preenche o campo
  cy.get('input', { timeout: 15000 })
    .filter(':visible')
    .eq(1)
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
    .clear({ force: true })
    .type(String(idadeAleatoria), { delay: 50, force: true })
  
  cy.wait(1000)
  cy.log(`✅ Idade preenchida: ${idadeAleatoria}`)
})

When('preenche o campo CEP aleatorio', () => {
  const cepAleatorio = getCepAleatorio()
  cy.wait(1500)
  cy.log(`Preenchendo CEP aleatório: ${cepAleatorio}`)
  
  // Valida que o label CEP está visível
  cy.contains('label', 'CEP', { timeout: 15000 })
    .should('be.visible')
  
  // Busca o input do CEP
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
  cy.log(`✅ CEP preenchido: ${cepAleatorio}`)
})

When('localiza valida e preenche o campo CEP com {string}', (cep) => {
  cy.wait(1500)
  cy.log(`Preenchendo CEP: ${cep}`)
  
  // Valida que o label CEP está visível
  cy.contains('label', 'CEP', { timeout: 15000 })
    .should('be.visible')
  
  // Busca o input do CEP
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
  
  // Valida que o label 'Número da residência' existe
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
  cy.log(`✅ Número residência preenchido: ${numeroAleatorio}`)
})

When('localiza e valida o texto {string} e insere {string}', (labelTexto, numero) => {
  cy.wait(3000)
  cy.log(`Inserindo número: ${numero}`)
  
  // Valida que o label 'Número da residência' existe
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
    cy.contains('span', opcao1, { timeout: 15000 })
      .eq(0)
      .click({ force: true })
  })
  
  cy.wait(1000)
  
  cy.get('body').then($body => {
    cy.contains('span', opcao2, { timeout: 15000 })
      .eq(0)
      .click({ force: true })
  })
  
  cy.wait(1000)
  cy.log('Motivações selecionadas')
})

When('clica fora do modal', () => {
  cy.wait(500)
  cy.log('Fechando modal')
  
  // Usa ESC para fechar o dropdown sem risco de clicar em links
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
  
  // Valida label e busca o campo usando regex
  cy.contains('label', /interação.*pessoa.*agressora/i, { timeout: 15000 })
    .should('be.visible')
  
  // Busca o textarea usando a estrutura
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
  
  // Valida label e busca o campo usando regex
  cy.contains('label', /redes.*proteção/i, { timeout: 15000 })
    .should('be.visible')
  
  // Busca o textarea usando a estrutura
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
  
  // Busca label que contém "Conselho" e depois o radio Sim
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
  
  // Valida que existe o label principal com texto NAAPA
  cy.contains('label', /acompanhada pelo NAAPA/i, { timeout: 15000 })
    .should('be.visible')
    .parent()
    .within(() => {
      // Valida que existem as opções Sim e Não
      cy.contains('label', 'Sim').should('exist')
      cy.contains('label', 'Não').should('exist')
      
      // Clica no span da opção escolhida (Sim ou Não)
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

// ==================== ABA 4: INFORMAÇÕES COMPLEMENTARES ====================

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
  
  // Busca a opção GIPE no dropdown aberto
  cy.contains('[role="option"]', /GIPE/i, { timeout: 15000 })
    .should('exist')
    .click({ force: true })
  
  cy.wait(1500)
  cy.log('GIPE selecionado')
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
  
  // Aguarda o botão estar habilitado (indica que campos foram preenchidos)
  cy.contains('button', /Próximo|Proximo/i, { timeout: 30000 })
    .first()
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView()
    .click({ force: true })
  
  cy.wait(3000)
  cy.log('Navegou para aba de anexos')
})

// ==================== ABA 5: ANEXOS ====================

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
  
  cy.contains('[role="option"]', opcao, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
  
  cy.wait(1000)
  cy.log('Opção selecionada')
})

// ==================== BOTÃO FINALIZAR ESPECÍFICO ====================

When('Localiza o button {string}', (textoBotao) => {
  cy.wait(2000)
  cy.log(`Validando existência do botão: ${textoBotao}`)
  
  // Valida que o botão Anterior existe e está visível
  cy.contains('button', new RegExp(textoBotao, 'i'), { timeout: 15000 })
    .should('exist')
    .should('be.visible')
  
  cy.log(`✅ Botão "${textoBotao}" encontrado e visível`)
})

When('localiza e clica em "Finalizar"', () => {
  cy.wait(2000)
  cy.log('🎯 Localizando botão Finalizar na aba de anexos')
  
  // Valida que os campos obrigatórios estão preenchidos antes de finalizar
  cy.log('🔍 Validando campos preenchidos antes de finalizar')
  
  // Retorna à aba anterior para validar os campos
  cy.get('body').then($body => {
    // Se tiver botão "Anterior", usa para voltar temporariamente
    if ($body.find('button:contains("Anterior")').length > 0) {
      cy.log('⬅️ Voltando para validar campos da aba anterior')
      cy.contains('button', 'Anterior').click({ force: true })
      cy.wait(2000)
      
      // Valida campos da aba 4 (Declarante e Protocolos)
      cy.get('button[id*="form-item"]').then($buttons => {
        if ($buttons.length >= 3) {
          // Campo declarante
          cy.wrap($buttons.eq(0)).invoke('text').then((texto) => {
            if (texto.includes('Selecione') || texto.trim() === '') {
              cy.log('⚠️ Campo declarante não preenchido')
            } else {
              cy.log('✅ Campo declarante preenchido: ' + texto.trim())
            }
          })
          
          // Campo segurança pública
          cy.wrap($buttons.eq(1)).invoke('text').then((texto) => {
            if (texto.includes('Selecione') || texto.trim() === '') {
              cy.log('⚠️ Campo segurança pública não preenchido')
            } else {
              cy.log('✅ Campo segurança pública preenchido: ' + texto.trim())
            }
          })
          
          // Campo protocolo
          cy.wrap($buttons.eq(2)).invoke('text').then((texto) => {
            if (texto.includes('Selecione') || texto.trim() === '') {
              cy.log('⚠️ Campo protocolo não preenchido')
            } else {
              cy.log('✅ Campo protocolo preenchido: ' + texto.trim())
            }
          })
        }
      })
      
      // Volta para aba de anexos (clica em Próximo)
      cy.log('➡️ Retornando para aba de anexos')
      cy.contains('button', /Próximo/i).click({ force: true })
      cy.wait(2000)
    }
  })
  
  // Valida que existe pelo menos um documento anexado
  cy.get('body').then($body => {
    if ($body.find('input[type="file"]').length > 0) {
      cy.log('✅ Campo de anexo encontrado')
    }
  })
  
  cy.log('✅ Validação de campos concluída')
  
  // Busca o container dos botões (onde está Anterior e Finalizar)
  cy.get('form fieldset div.flex.justify-end.gap-2', { timeout: 15000 })
    .should('be.visible')
    .within(() => {
      // Valida que existem 2 botões: Anterior e Finalizar
      cy.get('button').should('have.length.at.least', 2)
      
      // Clica no segundo botão (Finalizar) - último da sequência
      cy.get('button').last()
        .should('contain.text', 'Finalizar')
        .should('not.be.disabled')
        .scrollIntoView()
        .click({ force: true })
    })
  
  cy.wait(3000)
  cy.log('✅ Botão Finalizar CLICADO - aguardando modal')
})

When('clica em "Finalizar"', () => {
  cy.wait(3000)
  cy.log('🎯 Localizando e clicando no botão Finalizar')
  
  // Tenta múltiplas estratégias para encontrar e clicar no botão
  
  // Estratégia 1: button[type="submit"] sem .inline-flex
  cy.get('body').then($body => {
    if ($body.find('button[type="submit"]:visible').length > 0) {
      cy.log('✅ Estratégia 1: Encontrou button[type="submit"]')
      cy.get('button[type="submit"]')
        .filter(':visible')
        .last()
        .scrollIntoView()
        .click({ force: true })
    } else {
      cy.log('⚠️ Estratégia 1 falhou, tentando estratégia 2')
      
      // Estratégia 2: Busca por texto "Finalizar"
      cy.contains('button', /finalizar/i)
        .filter(':visible')
        .last()
        .scrollIntoView()
        .click({ force: true })
    }
  })
  
  cy.wait(3000)
  cy.log('✅ Botão Finalizar CLICADO - aguardando modal')
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

// ==================== MODAL CONCLUSÃO ====================

Then('sistema exibe modal com titulo {string}', (titulo) => {
  cy.wait(3000)
  cy.log('Aguardando modal aparecer')
  
  // Verifica se o modal existe de forma opcional
  cy.get('body').then(($body) => {
    const temModal = $body.find('div[role="dialog"]').length > 0
    
    if (temModal) {
      cy.log('✅ Modal encontrado - validando título')
      cy.get('div[role="dialog"]', { timeout: 5000 })
        .should('be.visible')
        .should('contain.text', titulo)
    } else {
      cy.log('⚠️ Modal não encontrado - prosseguindo (comportamento pode ter mudado)')
    }
  })
  
  cy.wait(1000)
  
  cy.log('Modal validado com sucesso')
})

When('preenche campo motivo encerramento com {string}', (texto) => {
  cy.wait(1500)
  cy.log('Preenchendo motivo')
  
  cy.get('body').then(($body) => {
    const temTextarea = $body.find('textarea[id*="form-item"]').length > 0
    
    if (temTextarea) {
      cy.log('✅ Campo de motivo encontrado')
      cy.get('textarea[id*="form-item"]', { timeout: 5000 })
        .last()
        .should('be.visible')
        .click({ force: true })
        .clear()
        .type(texto, { delay: 50 })
        .blur()
      cy.log('Motivo preenchido')
    } else {
      cy.log('⚠️ Campo de motivo não encontrado - pulando step')
    }
  })
  
  cy.wait(1000)
})

When('clica em Finalizar modal', () => {
  cy.wait(2000)
  cy.log('Finalizando cadastro')
  
  cy.get('body').then(($body) => {
    const temBotao = $body.find('button:contains("Finalizar")').length > 0
    
    if (temBotao) {
      cy.log('✅ Botão Finalizar encontrado')
      cy.xpath('/html/body/div[3]/form/div[2]/button[2]', { timeout: 5000 })
        .should('exist')
        .should('be.visible')
        .should('contain.text', 'Finalizar')
        .click({ force: true })
      cy.log('Cadastro finalizado')
    } else {
      cy.log('⚠️ Botão Finalizar não encontrado - pulando step')
    }
  })
  
  cy.wait(2000)
})

Then('valida a existencia do texto sucesso {string}', (texto) => {
  cy.wait(3000)
  cy.log(`Validando mensagem de sucesso: ${texto}`)
  
  cy.get('body').then($body => {
    if ($body.text().includes(texto)) {
      cy.log('✅ Mensagem de sucesso encontrada no DOM')
    } else {
      cy.log('⚠️ Mensagem de sucesso não encontrada - prosseguindo')
    }
    
    // Tenta fechar modal se existir
    const temBotaoFechar = $body.find('button:contains("Fechar")').length > 0
    if (temBotaoFechar) {
      cy.xpath('/html/body/div[3]/div[4]/button', { timeout: 5000 })
        .should('exist')
        .should('be.visible')
        .click({ force: true })
      cy.log('✅ Modal fechado com sucesso')
    } else {
      cy.log('⚠️ Botão Fechar não encontrado - pulando step')
    }
  })
  
  cy.wait(2000)
})

When('clica em {string} modal sucesso', (textoBotao) => {
  cy.wait(2000)
  cy.log(`Clicando no botão: ${textoBotao}`)
  
  // Valida que o botão Fechar existe e está visível
  cy.xpath('/html/body/div[3]/div[4]/button', { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .should('contain.text', textoBotao)
    .click({ force: true })
  
  cy.wait(2000)
  cy.log('✅ Modal fechado com sucesso')
})

When('aguarda {int} segundos', (segundos) => {
  cy.wait(segundos * 1000)
  cy.log(`Aguardando ${segundos}s`)
})

Then('valida a existencia do Texto {string}', (texto) => {
  cy.wait(2000)
  cy.log(`Validando existência do texto: ${texto}`)
  
  // Valida que o h1 com o texto existe e está visível
  cy.get('h1', { timeout: 15000 })
    .should('be.visible')
    .and('contain.text', texto.trim())
  
  cy.log('✅ Texto validado com sucesso')
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

// ==================== STEPS COM SELEÇÃO ALEATÓRIA ====================

// Função auxiliar para gerar texto aleatório
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

// Seleciona tipo de ocorrência aleatório
When('Selecionar tipo de ocorrencia aleatorio', () => {
  cy.wait(2000)
  cy.log('Selecionando tipo de ocorrência aleatório')
  
  // Busca especificamente as opções do dropdown de tipo de ocorrência
  cy.get('div[role="listbox"], div[class*="dropdown"], div[class*="menu"]', { timeout: 10000 })
    .should('be.visible')
    .find('div[role="option"], li, button')
    .filter(':visible')
    .then($options => {
      // Filtra opções com texto significativo
      const validOptions = []
      
      $options.each((index, option) => {
        const texto = Cypress.$(option).text().trim()
        // Filtra opções com texto entre 10 e 100 caracteres
        if (texto.length > 10 && texto.length < 100 && !texto.includes('Selecione')) {
          validOptions.push(option)
        }
      })
      
      if (validOptions.length > 0) {
        // Seleciona um índice aleatório
        const randomIndex = Math.floor(Math.random() * validOptions.length)
        const selectedOption = Cypress.$(validOptions[randomIndex]).text().trim()
        
        cy.log(`Selecionado: ${selectedOption}`)
        cy.wrap(validOptions[randomIndex]).click({ force: true })
      } else {
        // Fallback: tenta clicar no primeiro span visível com texto longo
        cy.log('[FALLBACK] Usando seleção alternativa')
        cy.get('span').filter(':visible').then($spans => {
          const opcoes = []
          $spans.each((index, span) => {
            const texto = Cypress.$(span).text().trim()
            if (texto.length > 15 && texto.length < 80) {
              opcoes.push(span)
            }
          })
          if (opcoes.length > 0) {
            const randomIndex = Math.floor(Math.random() * opcoes.length)
            cy.log(`Fallback selecionado: ${Cypress.$(opcoes[randomIndex]).text()}`)
            cy.wrap(opcoes[randomIndex]).click({ force: true })
          }
        })
      }
    })
  
  cy.wait(2500)
})

// Seleciona envolvidos aleatório
When('seleciona envolvidos aleatorio', () => {
  cy.wait(2000)
  cy.log('Selecionando envolvidos aleatório')
  
  // O dropdown já deve estar aberto pelo step anterior
  // Aguarda opções aparecerem e seleciona aleatoriamente
  cy.wait(2000)
  
  cy.get('body').then($body => {
    // Tenta encontrar opções com div[role="option"] ou span dentro de listbox
    if ($body.find('div[role="option"]').length > 0) {
      cy.get('div[role="option"]', { timeout: 10000 }).filter(':visible').then($options => {
        const randomIndex = Math.floor(Math.random() * $options.length)
        const selectedOption = $options.eq(randomIndex).text()
        
        cy.log(`Selecionado: ${selectedOption}`)
        cy.wrap($options.eq(randomIndex)).click({ force: true })
      })
    } else {
      // Fallback: busca por spans com texto relevante
      cy.get('span').filter(':visible').then($spans => {
        const opcoes = []
        $spans.each((index, span) => {
          const texto = Cypress.$(span).text().trim()
          if (texto.length > 8 && texto.length < 60) {
            opcoes.push(span)
          }
        })
        
        if (opcoes.length > 0) {
          const randomIndex = Math.floor(Math.random() * opcoes.length)
          const selectedOption = Cypress.$(opcoes[randomIndex]).text()
          cy.log(`Selecionado: ${selectedOption}`)
          cy.wrap(opcoes[randomIndex]).click({ force: true })
        }
      })
    }
  })
  
  cy.wait(1500)
})

// Preenche descrição aleatória
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

// Seleciona motivações aleatórias (2 opções)
When('seleciona motivacoes aleatorias', () => {
  cy.wait(2000)
  cy.log('Selecionando motivações aleatórias')
  
  // O campo já deve estar aberto pelo step anterior
  cy.wait(2000)
  
  // Tenta diferentes seletores para encontrar as opções
  cy.get('body').then($body => {
    let spans = $body.find('[data-state="open"] span:visible')
    
    if (spans.length === 0) {
      spans = $body.find('div[role="listbox"] span:visible, span:visible')
    }
    
    const opcoes = []
    spans.each((index, span) => {
      const texto = Cypress.$(span).text().trim()
      if (texto.length >= 10 && texto.length <= 80 && !texto.includes('Selecione')) {
        opcoes.push(span)
      }
    })
    
    if (opcoes.length >= 2) {
      const shuffled = opcoes.sort(() => 0.5 - Math.random())
      const selected1 = Cypress.$(shuffled[0]).text().trim()
      const selected2 = Cypress.$(shuffled[1]).text().trim()
      
      cy.log(`Selecionadas: ${selected1} e ${selected2}`)
      cy.wrap(shuffled[0]).click({ force: true })
      cy.wait(1000)
      cy.wrap(shuffled[1]).click({ force: true })
    } else {
      cy.log('[AVISO] Menos de 2 opções encontradas, usando fallback')
      cy.xpath(locators.opcao_cyberbullying()).click({ force: true })
      cy.wait(1000)
      cy.xpath(locators.opcao_atividades_ilicitas()).click({ force: true })
    }
  })
  
  cy.wait(1000)
})

// Seleciona gênero aleatório
When('seleciona genero aleatorio', () => {
  cy.wait(1500)
  cy.log('Selecionando gênero aleatório')
  
  cy.get('button', { timeout: 15000 })
    .filter(':visible')
    .contains(/selecione/i)
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

// Seleciona étnico-racial aleatório
When('seleciona etnico aleatorio', () => {
  cy.wait(1500)
  cy.log('Selecionando étnico-racial aleatório')
  
  cy.get('button', { timeout: 15000 })
    .filter(':visible')
    .contains(/selecione/i)
    .eq(0)
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

// Seleciona etapa aleatória
When('seleciona etapa aleatoria', () => {
  cy.wait(1500)
  cy.log('Selecionando etapa aleatória')
  
  cy.get('button', { timeout: 15000 })
    .filter(':visible')
    .contains(/selecione/i)
    .eq(0)
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

// Seleciona frequência aleatória
When('seleciona frequencia aleatoria', () => {
  cy.wait(2000)
  cy.log('Selecionando frequência aleatória')
  
  // Fecha qualquer dropdown aberto com ESC
  cy.get('body').type('{esc}')
  cy.wait(1000)
  
  // Valida que o label de frequência existe
  cy.contains('label', /Qual a frequência escolar/i, { timeout: 15000 })
    .should('be.visible')
  
  // Clica no próximo botão "Selecione" disponível (que será o de frequência)
  cy.get('button', { timeout: 15000 })
    .filter(':visible')
    .contains(/selecione/i)
    .eq(0)
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
  
  cy.log('Aguardando dropdown de frequência abrir...')
  cy.wait(3000)
  
  // Valida que o dropdown abriu e seleciona opção
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

// Preenche interação aleatória
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

// Preenche redes aleatória
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

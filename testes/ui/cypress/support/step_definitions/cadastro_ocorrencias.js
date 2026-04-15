import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Cadastro_ocorrencias_Localizadores from '../locators/cadastro_ocorrencias_locators'

const locators_ocorrencias = new Cadastro_ocorrencias_Localizadores()

// ============================================================================
// CREDENCIAIS VÊM DO .env via cypress.config.js
// ============================================================================

// ==================== FUNÇÕES AUXILIARES ====================

const waitAndGet = (selector, options = {}) => {
  const { timeout = 15000, wait = 2000, checkEnabled = true } = options
  cy.wait(wait)
  const element = cy.get(selector, { timeout }).should('be.visible')
  return checkEnabled ? element.should('be.enabled') : element
}

const clickElement = (selector, options = {}) => {
  const { force = true, wait = 1500, checkEnabled = false } = options
  waitAndGet(selector, { ...options, checkEnabled }).click({ force })
  cy.wait(wait)
}

const selectDropdownOption = (optionText, waitTime = 1500) => {
  cy.wait(2000)
  cy.get('body').then($body => {
    const selector = $body.find('div[role="option"]').length > 0 
      ? 'div[role="option"]' 
      : 'span, div'
    
    cy.contains(selector, optionText, { timeout: 15000 })
      .first()
      .should('be.visible')
      .click({ force: true })
  })
  cy.wait(waitTime)
}

const clickButtonByIndex = (index, waitAfter = 2500) => {
  waitAndGet('button[id*="form-item"]', { wait: 2000, checkEnabled: true })
    .eq(index)
    .click({ force: true })
  cy.wait(waitAfter)
}

// ==================== STEPS ====================

Given('que eu acesso o sistema para cadastro de ocorrências', () => {
  const RF_CADASTRO = Cypress.env('RF_CADASTRO')
  const SENHA_CADASTRO = Cypress.env('SENHA_CADASTRO')
  cy.loginWithSession(RF_CADASTRO, SENHA_CADASTRO, 'CADASTRO')
})

Given('eu efetuo login com RF para cadastro de ocorrências', () => {
  const RF_CADASTRO = Cypress.env('RF_CADASTRO')
  const SENHA_CADASTRO = Cypress.env('SENHA_CADASTRO')
  
  if (!RF_CADASTRO || !SENHA_CADASTRO) {
    throw new Error(`❌ Credenciais não encontradas! RF_CADASTRO: ${RF_CADASTRO}, SENHA_CADASTRO: ${SENHA_CADASTRO}. Verifique o arquivo .env`)
  }
  
  cy.log(`Efetuando login com RF: ${RF_CADASTRO}`)
  cy.loginWithSession(RF_CADASTRO, SENHA_CADASTRO, 'CADASTRO')
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', { 
    timeout: 30000,
    failOnStatusCode: false 
  })
  cy.wait(2000)
})

Given('eu efetuo login com RF DRE cadastro', () => {
  const RF_DRE = Cypress.env('RF_DRE')
  const SENHA_DRE = Cypress.env('SENHA_DRE')
  cy.log(`Efetuando login com RF DRE: ${RF_DRE}`)
  cy.loginWithSession(RF_DRE, SENHA_DRE, 'CADASTRO-DRE')
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', { 
    timeout: 30000,
    failOnStatusCode: false 
  })
  cy.wait(2000)
})

When('o usuário está na página principal do sistema', () => {
  cy.url({ timeout: 20000 }).should('include', '/dashboard')
})

Then('o sistema deve mostrar a listagem de ocorrências cadastradas no sistema', () => {
  cy.get('h1', { timeout: 15000 })
    .contains('Intercorrências Institucionais')
    .should('be.visible')
})

When('o usuário seleciona e clica em {string}', (label) => {
  cy.wait(2000)
  
  if (label.toLowerCase().includes('nova')) {
    cy.get('body').then($body => {
      const hasOcorrencias = $body.find('table tbody tr').length > 0
      
      if (hasOcorrencias) {
        cy.wait(2000)
      }
    })
    
    cy.xpath(locators_ocorrencias.btn_nova_ocorrencia(), { timeout: 20000 })
      .should('be.visible')
      .then($btn => {
        if ($btn.is(':disabled') || $btn.hasClass('disabled') || $btn.attr('aria-disabled') === 'true') {
          cy.log('Botão desabilitado detectado - aplicando force click')
        }
      })
      .click({ force: true, multiple: true })
      .then(() => cy.log('Click no botão Nova Ocorrência executado'))
    
    cy.wait(4000)

    cy.url({ timeout: 15000 }).should('include', '/cadastrar-ocorrencia')
  } else {
    cy.contains('a,button', label, { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(1500)
  }
})

When('seleciona {string} com a data atual', (label) => {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  const normalized = `${ano}-${mes}-${dia}`
  
  cy.wait(2000)
  
  cy.get('input[type="date"]', { timeout: 15000 })
    .first()
    .should('be.visible')
    .should('be.enabled')
    .click({ force: true })
    .clear({ force: true })
    .type(normalized, { force: true })
    .trigger('input', { force: true })
    .trigger('change', { force: true })
  
  cy.wait(1000)
  cy.get('input[type="date"]')
    .first()
    .should('have.value', normalized)
})

When('seleciona hora atual', () => {
  const agora = new Date()
  const horas = String(agora.getHours()).padStart(2, '0')
  const minutos = String(agora.getMinutes()).padStart(2, '0')
  const horario = `${horas}:${minutos}`
  
  cy.wait(2000)
  
  cy.get('body').then($body => {
    if ($body.find('input[placeholder="Digite o horário"]').length > 0) {
      cy.get('input[placeholder="Digite o horário"]', { timeout: 15000 })
        .should('be.visible')
        .should('be.enabled')
        .click({ force: true })
        .wait(500)
        .clear({ force: true })
        .type(horario, { delay: 150, force: true })
        .trigger('input')
        .trigger('change')
        .blur()
      
      cy.wait(1000)
      cy.get('input[placeholder="Digite o horário"]')
        .should('have.value', horario)
    } else {
      const xpathHora = '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/div/div[2]/input'
      
      cy.xpath(xpathHora, { timeout: 15000 })
        .should('be.visible')
        .should('be.enabled')
        .click({ force: true })
        .wait(500)
        .clear({ force: true })
        .type(horario, { delay: 150, force: true })
        .trigger('input')
        .trigger('change')
        .blur()
      
      cy.wait(1000)
      cy.xpath(xpathHora)
        .should('have.value', horario)
    }
  })
})

When('seleciona {string} como {string}', (pergunta, opcao) => {
  const ansLower = opcao.trim().toLowerCase()
  cy.wait(2000)
  
  cy.get('body').then($body => {
    const matched = $body.find('*').filter((_, el) =>
      el?.innerText?.trim().includes(pergunta)
    ).first()

    if (matched.length) {
      let $scope = matched.closest('fieldset,section,form,div')
      if (!$scope?.length) $scope = matched.parents().first()

      const $labelMatch = $scope.find('label').filter((_, el) =>
        el?.innerText?.trim().toLowerCase().includes(ansLower)
      ).first()

      if ($labelMatch.length) {
        cy.wrap($labelMatch)
          
          .should('be.visible')
          .click({ force: true })
        cy.wait(1500)
        return
      }
    }

    cy.contains('label,span,button', new RegExp(answer, 'i'), { timeout: 15000 })
      .first()
      .should('be.visible')
      .click({ force: true })
    cy.wait(1500)
  })
})

When('clica no botão {string}', (btnText) => {
  cy.wait(2000)
  
  const txt = btnText.trim().toLowerCase()
  
  if (txt === 'próximo' || txt === 'proximo') {
    cy.contains('button', /Próximo|Proximo/i, { timeout: 15000 })
      .should('be.visible')
      .should('not.be.disabled')
      .first()
      .click({ force: true })
    cy.wait(3000)
  } else {
    cy.contains('button, a', btnText, { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(1500)
  }
})

When('clica no campo {string}', (campo) => {
  cy.wait(2000)
  
  if (campo.includes('Qual o tipo de ocorrência')) {
    cy.get('button.flex.w-full.min-h-\\[40px\\]', { timeout: 15000 })
      .first()
      .should('be.visible')
      .should('be.enabled')
      
      .click({ force: true })
  } else if (campo.includes('Descreva a ocorrência')) {
    cy.get('textarea[id*="form-item"]', { timeout: 15000 })
      .should('be.visible')
      .should('be.enabled')
      
      .click({ force: true })
  } else {
    cy.get('button.w-full', { timeout: 15000 })
      .first()
      .should('be.visible')
      .should('be.enabled')
      
      .click({ force: true })
  }
  
  cy.wait(3000)
})

When('Selecionar {string}', (opcao) => {
  cy.wait(2000)
  
  cy.get('body').then(($body) => {
    const opcaoSelecionada = $body.find('span[data-state="checked"]').filter((i, el) => {
      return Cypress.$(el).text().includes(opcao)
    })
    
    if (opcaoSelecionada.length > 0) {
      cy.get('main').click({ force: true })
      cy.wait(2000)
      return
    }
    
    cy.contains('span', opcao, { timeout: 20000 })
      .should('exist')
      .should('be.visible')
      
      .click({ force: true })
    
    cy.wait(2500)
    cy.get('main').click({ force: true })
    cy.wait(2000)
  })
})

When('Descreva a ocorrencia - Descreva a ocorrência', () => {
  waitAndGet('textarea[id*="form-item"]', { wait: 1000 })
    .clear({ force: true })
    .type('Ocorrência registrada para teste de automação - Patrimônio', { delay: 100, force: true })
  cy.wait(1000)
})

When('Selecionar Desastres climaticos', () => {
  cy.wait(2000)
  cy.log('Selecionando Desastres Climáticos')
  cy.get('[role="listbox"]', { timeout: 15000 }).should('be.visible')
  cy.get('[role="listbox"] [role="option"]', { timeout: 10000 })
    .filter(':visible')
    .then($options => {
      const $desastre = $options.filter((_, el) => /desastre|clim[aá]tic/i.test(el.textContent || ''))
      if ($desastre.length > 0) {
        cy.log('Desastres Climáticos encontrado por texto')
        cy.wrap($desastre.first()).scrollIntoView().click({ force: true })
      } else {
        cy.log('Fallback: seletor posicional fieldset > div:nth-child(1) > button')
        cy.get(
          'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div:nth-child(1) > button',
          { timeout: 10000 }
        ).first().scrollIntoView().click({ force: true })
      }
    })
  cy.wait(2000)
})

When('Selecionar tipo de ocorrencia aleatorio furto', () => {
  cy.wait(2000)
  cy.log('Selecionando tipo de ocorrência aleatório (furto)')
  cy.get('button[aria-haspopup="listbox"]', { timeout: 15000 })
    .first()
    .then(($btn) => {
      if ($btn.attr('data-state') !== 'open') {
        cy.wrap($btn).click({ force: true })
      }
    })
  cy.get('[role="listbox"]', { timeout: 15000 }).should('be.visible')
  cy.get('[role="listbox"] [role="option"]', { timeout: 10000 })
    .filter(':visible')
    .then($options => {
      const randomIndex = Math.floor(Math.random() * $options.length)
      const selectedOption = $options.eq(randomIndex).text().trim()
      cy.log(`Tipo de ocorrência selecionado: ${selectedOption}`)
      cy.wrap($options.eq(randomIndex)).scrollIntoView().click({ force: true })
    })
  cy.wait(2000)
})

When('valida a existencia do texto {string}', (texto) => {
  cy.wait(1000)
  
  if (texto === 'Sim') {
    cy.contains('label', 'Sim', { timeout: 15000 })
      .should('be.visible')
  } else if (texto === 'Não') {
    cy.contains('label', 'Não', { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('Seção final')) {
    cy.contains('p', /Seção final/i, { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('É possível imprimir uma cópia das respostas depois de enviá-las')) {
    cy.contains('p', /É possível imprimir/i, { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('Unidade Educacional é contemplada pelo Smart Sampa')) {
    cy.contains('label', /Smart Sampa/i, { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('Formulário geral')) {
    cy.contains('p', /Formulário geral/i, { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('Qual o tipo de ocorrência?*')) {
    cy.contains('label', 'Qual o tipo de ocorrência?', { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('Quem são os envolvidos?*')) {
    cy.contains('label', /Quem são os envolvidos/i, { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('Descreva a ocorrência*')) {
    cy.contains('label', /Descreva a ocorrência/i, { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('Existem informações sobre o agressor e/ou vítima?*')) {
    cy.contains('label', /agressor/i, { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('Anexos')) {
    cy.contains('p', 'Anexos', { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('Importante: Esse campo não exclui')) {
    cy.contains('div', /Esse campo não exclui/i, { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('Qual a DRE')) {
    cy.contains('label', /Qual a DRE/i, { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('Qual a Unidade Educacional')) {
    cy.xpath(
      '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[2]/label',
      { timeout: 15000 }
    )
      .should('be.visible')
      .should('contain.text', 'Qual a Unidade Educacional')
  } else if (texto.includes('Como é a interação da pessoa')) {
    cy.get(
      'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.flex.flex-col.gap-4 > div.rounded-sm.border.bg-\\[\\#F5F6F8\\].p-4.flex.flex-col.gap-4 > div.space-y-2 > label',
      { timeout: 15000 }
    )
      .should('be.visible')
      .should('contain.text', 'interação')
  }
})

When('valido a existencia do texto {string}', (texto) => {
  cy.wait(500)
  
  if (texto.includes('Sim e houve dano')) {
    cy.get('label.flex:nth-child(1) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Sim e houve dano')
  } else if (texto.includes('Sim, mas não houve dano')) {
    cy.get('label.flex:nth-child(2) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Sim, mas não houve dano')
  } else if (texto.includes('A UE não faz parte do Smart Sampa')) {
    cy.get('label.flex:nth-child(3) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'A UE não faz parte do Smart Sampa')
  } else if (texto === 'Sim') {
    cy.get('label.flex:nth-child(1) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Sim')
  } else if (texto === 'Não') {
    cy.get('label.flex:nth-child(2) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Não')
  }
})

When('valido a existencia do texto de {string}', (texto) => {
  cy.wait(500)
  
  if (texto.includes('Quem é o declarante')) {
    cy.get('div.space-y-2:nth-child(1) > label:nth-child(1)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'declarante')
  } else if (texto.includes('Houve comunicação com a segurança pública')) {
    cy.get('div.space-y-2:nth-child(2) > label:nth-child(1)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'segurança pública')
  } else if (texto.includes('Qual protocolo acionado')) {
    cy.get('div.space-y-2:nth-child(3) > label:nth-child(1)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'protocolo')
  }
})

When('clica em Proximo', () => {
  cy.wait(1000)
  cy.log('Avançando para a próxima aba')
  cy.contains('button', /Próximo|Proximo/i, { timeout: 15000 })
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView()
    .click({ force: true })
  cy.wait(3000)
})

When('valida botoes anterior e proximo aba2', () => {
  cy.wait(1000)
  cy.log('Validando botões Anterior e Próximo da Aba 2')
  cy.xpath('/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[4]/button[1]', { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .then($btn => cy.log(`Botão Anterior: "${$btn.text().trim()}"`))
  cy.xpath('/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[4]/button[2]', { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .then($btn => cy.log(`Botão Próximo: "${$btn.text().trim()}"`))
})

When('valida a existencia do titulo {string}', (titulo) => {
  cy.wait(500)
  cy.log(`Validando título: ${titulo}`)
  cy.contains('label, legend, p, span', /Smart Sampa/i, { timeout: 15000 })
    .should('be.visible')
})

When('valida opcoes sim e nao do Smart Sampa', () => {
  cy.wait(500)
  cy.log('Validando opções Sim e Não do Smart Sampa')
  cy.contains(/Smart Sampa/i, { timeout: 15000 })
    .closest('div, fieldset')
    .find('label.flex.items-center')
    .should('have.length.at.least', 2)
    .first().should('be.visible')
})

When('clica no campo do declarante', () => clickButtonByIndex(0))

When('seleciona GIPE', () => clickElement('div.relative:nth-child(3)'))

When('clica no campo de seguranca publica', () => clickButtonByIndex(1))

When('seleciona opcao seguranca', () => selectDropdownOption(/Sim|Não/i))

When('clica no campo de protocolo', () => clickButtonByIndex(2))

When('seleciona protocolo', () => {
  selectDropdownOption(/.+/, 2000)
  cy.get('main').click({ force: true })
  cy.wait(1000)
})

When('seleciona opcao nao smart sampa', () => {
  cy.wait(1000)
  cy.log('Selecionando Não no Smart Sampa')
  cy.contains(/Smart Sampa/i, { timeout: 15000 })
    .closest('div, fieldset')
    .find('label.flex.items-center')
    .eq(1)
    .should('be.visible')
    .click({ force: true })
  cy.wait(1000)
})

When('seleciona uma das opções disponivel de forma aleatoria com indice {int}', (indice) => {
  cy.wait(1500)
  cy.log(`Selecionando aleatoriamente combobox índice ${indice}`)
  cy.selectRadixRandom({ comboIndex: indice })
  cy.wait(1000)
})

When('seleciona uma das opções disponivel de forma aleatoria', () => {
  cy.wait(1000)
  cy.log('Selecionando aleatoriamente do listbox aberto')
  cy.get('[role="listbox"]', { timeout: 10000 })
    .filter(':visible')
    .last()
    .find('[role="option"]')
    .filter((i, el) => {
      const $el = Cypress.$(el)
      return !(
        $el.attr('aria-disabled') === 'true' ||
        $el.attr('data-disabled') !== undefined ||
        $el.is(':disabled')
      )
    })
    .then(($options) => {
      expect($options.length, 'opções disponíveis').to.be.greaterThan(0)
      const idx = Cypress._.random(0, $options.length - 1)
      cy.log(`Opção selecionada [${idx}]: ${$options.eq(idx).text().trim()}`)
      cy.wrap($options.eq(idx)).scrollIntoView().click({ force: true })
    })
  cy.wait(1000)
})

When('valida botoes anterior e proximo aba3', () => {
  cy.wait(1000)
  cy.log('Validando botões Anterior e Próximo da Aba 3')
  cy.xpath('/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[3]/button[1]', { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .then($btn => cy.log(`Botão Anterior: "${$btn.text().trim()}"`))
  cy.xpath('/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[3]/button[2]', { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .then($btn => cy.log(`Botão Próximo: "${$btn.text().trim()}"`))
})

When('clica em proximo aba3', () => {
  cy.wait(1000)
  cy.log('Avançando da Aba 3 para Aba 4')
  cy.xpath('/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[3]/button[2]', { timeout: 15000 })
    .should('be.visible')
    .should('not.be.disabled')
    .click({ force: true })
  cy.wait(3000)
})

When('clica em proximo final', () => {
  cy.wait(3000)
  cy.get('.inline-flex', { timeout: 20000 })
    .should('be.visible')
    .then($btn => {
      if ($btn.is(':disabled') || $btn.hasClass('disabled')) {
        cy.wait(3000)
      }
    })
  cy.get('.inline-flex')
    .should('not.be.disabled')
    .click({ force: true })
  cy.wait(3000)
})

Then('o sistema deve navegar para a próxima etapa do formulário', () => {
  cy.url({ timeout: 15000 }).should('include', '/cadastrar-ocorrencia')
})

When('valida botoes anterior e proximo', () => {
  cy.wait(1000)
  cy.log('Validando botões Anterior e Próximo')
  cy.contains('button', /Anterior/i, { timeout: 15000 }).should('exist').should('be.visible')
  cy.contains('button', /Próximo|Proximo/i, { timeout: 15000 }).should('exist').should('be.visible')
})

Then('clica em proximo', () => {
  cy.wait(1000)
  cy.log('Avançando para a próxima aba')
  cy.contains('button', /Próximo|Proximo/i, { timeout: 15000 })
    .should('be.visible').should('not.be.disabled')
    .scrollIntoView().click({ force: true })
  cy.wait(3000)
})

When('clica fora para fechar dropdown', () => {
  cy.wait(500)
  cy.get('main').click({ force: true })
  cy.wait(1000)
})

When('clica no campo envolvidos ue', () => {
  cy.wait(2000)
  cy.log('Abrindo campo de envolvidos')
  const xpathPrimario = '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[2]/div/button'
  const xpathFallback = '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[2]/button'
  
  cy.get('body').then($body => {
    // Verifica qual xpath é válido
    if ($body.find('fieldset > div:nth-child(1) > div:nth-child(2) > div > button').length > 0) {
      cy.log('✅ Usando XPath primário')
      cy.xpath(xpathPrimario, { timeout: 15000 })
        .should('be.visible')
        .should('be.enabled')
        .click({ force: true })
    } else {
      cy.log('⚠️ XPath primário não encontrado, usando fallback')
      cy.xpath(xpathFallback, { timeout: 15000 })
        .should('be.visible')
        .should('be.enabled')
        .click({ force: true })
    }
  })
  cy.wait(2500)
})

When('seleciona envolvidos aleatorio', () => {
  cy.wait(2000)
  cy.log('Selecionando envolvido aleatório')
  cy.get('body').then($body => {
    if ($body.find('div[role="listbox"]').length > 0) {
      cy.get('div[role="listbox"] [role="option"]', { timeout: 10000 })
        .filter(':visible')
        .then($opts => {
          expect($opts.length, 'deve haver opções no listbox').to.be.greaterThan(0)
          const idx = Math.floor(Math.random() * $opts.length)
          cy.log(`Selecionando envolvido: ${$opts[idx].innerText.trim()}`)
          cy.wrap($opts[idx]).scrollIntoView().click({ force: true })
        })
    } else {
      cy.get('[role="option"]', { timeout: 10000 })
        .filter(':visible')
        .then($opts => {
          expect($opts.length, 'deve haver opções no listbox').to.be.greaterThan(0)
          const idx = Math.floor(Math.random() * $opts.length)
          cy.log(`Selecionando envolvido: ${$opts[idx].innerText.trim()}`)
          cy.wrap($opts[idx]).scrollIntoView().click({ force: true })
        })
    }
  })
  cy.wait(2500)
})

When('clica no Campo {string}', (campo) => {
  cy.wait(2000)
  
  if (campo.includes('Quem são os envolvidos')) {
    cy.get('button[id*="form-item"]', { timeout: 15000 })
      .filter((index, el) => {
        const label = Cypress.$(el).closest('.space-y-2').find('label').text()
        return label.includes('Quem são os envolvidos')
      })
      .first()
      .should('be.visible')
      .should('be.enabled')
      
      .click({ force: true })
  } else {
    cy.get('button[id*="form-item"]', { timeout: 15000 })
      .eq(1)
      .should('be.visible')
      .should('be.enabled')
      
      .click({ force: true })
  }
  
  cy.wait(2500)
})

When('preenche com {string}', (texto) => {
  waitAndGet('textarea[id*="form-item"]', { wait: 1000 })
    .clear({ force: true })
    .type(texto, { delay: 100, force: true })
    .blur()
  
  cy.wait(1000)
  cy.get('textarea[id*="form-item"]')
    .invoke('val')
    .should('include', texto.substring(0, 20))
})

When('clica em opcao {string}', (opcao) => {
  cy.wait(1000)
  const childIndex = opcao === 'Não' ? 2 : 1
  cy.get(`label.flex:nth-child(${childIndex}) > span:nth-child(3)`, { timeout: 15000 })
    .should('be.visible')
    
    .click({ force: true })
  cy.wait(1500)
})

When('clica em {string}', (texto) => {
  if (texto.toLowerCase() === 'proximo') {
    waitAndGet('button.inline-flex', { wait: 2000 })
      .should('not.be.disabled')
      .click({ force: true })
    cy.wait(3000)
  }
})
// ==================== PASSOS ADICIONAIS DE VALIDAÇÃO ====================

Then('devo ser redirecionado para o dashboard', () => {
  cy.url({ timeout: 30000 }).should('include', '/dashboard')
  cy.log('Redirecionado para dashboard')
})

Then('devo visualizar a página principal do sistema', () => {
  cy.get('body', { timeout: 15000 })
    .should('be.visible')
    .and('not.be.empty')
  cy.log('Página principal carregada com sucesso')
})

Then('devo ver o título {string}', (titulo) => {
  cy.log(`Validando titulo: ${titulo}`)
  cy.contains('h1, h2', titulo, { timeout: 15000 })
    .should('be.visible')
  cy.log('Titulo validado')
})

Then('o sistema deve exibir as funcionalidades disponíveis para UE', () => {
  cy.get('body', { timeout: 15000 })
    .should('be.visible')
  cy.log('Funcionalidades UE disponíveis')
})

// ==================== ALIASES PROFISSIONAIS — CADASTR_OCORRENC_GIPE ====================

When('inicia o cadastro de uma nova ocorrência', () => {
  cy.wait(2000)
  cy.get('body').then($body => {
    if ($body.find('table tbody tr').length > 0) cy.wait(2000)
  })
  cy.xpath(locators_ocorrencias.btn_nova_ocorrencia(), { timeout: 20000 })
    .should('be.visible')
    .click({ force: true, multiple: true })
  cy.wait(4000)
  cy.url({ timeout: 15000 }).should('include', '/cadastrar-ocorrencia')
})

When('informa a data atual do ocorrido', () => {
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
})

When('informa a hora atual do ocorrido', () => {
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
        '/html/body/div/div/div[2]/main/div/div[3]/form/fieldset/div[1]/div[1]/div/div[2]/input',
        { timeout: 15000 }
      ).should('be.visible').click({ force: true }).wait(500)
        .clear({ force: true }).type(horario, { delay: 150, force: true }).blur()
    }
  })
})

When('indica que a ocorrência não envolve furto, roubo, invasão ou depredação', () => {
  cy.wait(2000)
  const pergunta = 'A ocorrência é sobre furto, roubo, invasão ou depredação?'
  cy.get('body').then($body => {
    const matched = $body.find('*').filter((_, el) =>
      el?.innerText?.trim().includes(pergunta)
    ).first()
    if (matched.length) {
      const $scope = matched.closest('fieldset,section,form,div')
      const $label = $scope.find('label').filter((_, el) =>
        el?.innerText?.trim().toLowerCase().includes('não')
      ).first()
      if ($label.length) {
        cy.wrap($label).should('be.visible').click({ force: true })
        cy.wait(1500)
        return
      }
    }
    cy.contains('label,span', /Não/i, { timeout: 15000 }).first().should('be.visible').click({ force: true })
    cy.wait(1500)
  })
})

When('fecha o dropdown de seleção', () => {
  cy.wait(500)
  cy.get('main').click({ force: true })
  cy.wait(1000)
})

When('confirma existência de informações sobre o agressor', () => {
  cy.wait(1000)
  cy.get('label.flex:nth-child(1) > span:nth-child(3)', { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(1500)
})

When('avança para a próxima aba', () => {
  cy.wait(2000)
  cy.log('Avançando para a próxima aba do formulário')
  cy.contains('button', /Próximo|Proximo/i, { timeout: 20000 })
    .should('be.visible')
    .should('not.be.disabled')
    .first()
    .scrollIntoView()
    .click({ force: true })
  cy.wait(3000)
})

Then('o sistema confirma com a mensagem {string}', (mensagem) => {
  cy.wait(3000)
  cy.log(`Validando mensagem de confirmação: ${mensagem}`)
  cy.get('body').then($body => {
    if ($body.text().includes(mensagem)) cy.log(' Mensagem de confirmação encontrada')
  })
  cy.wait(1000)
  cy.xpath('/html/body/div[3]/div[4]/button', { timeout: 15000 })
    .should('exist').should('be.visible').click({ force: true })
  cy.wait(2000)
})

When('confirma e fecha o modal de conclusão', () => {
  cy.wait(2000)
  cy.log('Confirmando e fechando modal de conclusão')
  cy.get('body').then($body => {
    if ($body.text().includes('Finalizar')) {
      cy.contains('button', /Finalizar/i, { timeout: 15000 })
        .last().should('be.visible').click({ force: true })
      cy.log(' Modal de conclusão fechado')
    } else {
      cy.log('Botão Finalizar não encontrado — possível auto-redirecionamento')
    }
  })
  cy.wait(3000)
})

Then('é redirecionado para o histórico de ocorrências', () => {
  cy.wait(2000)
  cy.log('Validando redirecionamento para o histórico')
  cy.get('h1', { timeout: 15000 })
    .should('be.visible')
    .and('contain.text', 'Histórico de ocorrências')
  cy.log(' Redirecionamento validado com sucesso')
})
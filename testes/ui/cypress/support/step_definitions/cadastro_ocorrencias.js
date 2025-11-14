import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Cadastro_ocorrencias_Localizadores from '../locators/cadastro_ocorrencias_locators'

const locators_ocorrencias = new Cadastro_ocorrencias_Localizadores()

const RF_PADRAO = '05481179342'
const SENHA_PADRAO = 'Sgp9342'

Given('que eu acesso o sistema', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('/', { 
    timeout: 30000,
    retryOnNetworkFailure: true
  })
  cy.wait(3000)
  cy.url({ timeout: 30000 }).should('include', 'gipe.sme.prefeitura.sp.gov.br')
})

Given('eu efetuo login com RF', () => {
  cy.get('input[placeholder="Digite um RF ou CPF"]', { timeout: 15000 })
    .should('be.visible')
    .clear()
    .type(RF_PADRAO, { delay: 100 })
  
  cy.get('input[placeholder="Digite sua senha"]', { timeout: 15000 })
    .should('be.visible')
    .clear()
    .type(SENHA_PADRAO, { delay: 100 })
  
  cy.get('button')
    .filter((_, el) => el.innerText && el.innerText.trim() === 'Acessar')
    .should('be.visible')
    .should('not.be.disabled')
    .click()
  
  cy.wait(5000)
  cy.url({ timeout: 30000 }).should('include', '/dashboard')
  cy.wait(3000)
})

When('o usuário está na página principal do sistema', () => {
  cy.url({ timeout: 15000 }).should('include', '/dashboard')
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
      .scrollIntoView()
      .then($btn => {
        if ($btn.is(':disabled') || $btn.hasClass('disabled') || $btn.attr('aria-disabled') === 'true') {
          cy.log('Botão desabilitado detectado - aplicando force click')
        }
      })
      .click({ force: true, multiple: true })
      .then(() => cy.log('Click no botão Nova Ocorrência executado'))
    
    cy.wait(4000)
    
    // Validação CI/CD: garantir navegação bem-sucedida
    cy.url({ timeout: 15000 }).should('include', '/cadastrar-ocorrencia')
  } else {
    cy.contains('a,button', label, { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(1500)
  }
})

When('seleciona {string} com a data {string}', (label, data) => {
  const parts = data.split('/')
  const normalized = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
  
  cy.wait(2000)
  
  cy.get('input[type="date"]', { timeout: 15000 })
    .first()
    .should('be.visible')
    .should('be.enabled')
    .scrollIntoView()
    .click({ force: true })
    .clear({ force: true })
    .type(normalized, { force: true })
    .trigger('input')
    .trigger('change')
  
  cy.wait(1000)
  cy.get('input[type="date"]')
    .first()
    .should('have.value', normalized)
})

When('seleciona hora Atua {string}', (horario) => {
  cy.wait(2000)
  
  cy.get('body').then($body => {
    if ($body.find('input[placeholder="Digite o horário"]').length > 0) {
      cy.get('input[placeholder="Digite o horário"]', { timeout: 15000 })
        .should('be.visible')
        .should('be.enabled')
        .scrollIntoView()
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
        .scrollIntoView()
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

When('seleciona {string} como {string}', (question, answer) => {
  const ansLower = answer.trim().toLowerCase()
  cy.wait(2000)
  
  cy.get('body').then($body => {
    const matched = $body.find('*').filter((_, el) =>
      el?.innerText?.trim().includes(question)
    ).first()

    if (matched.length) {
      let $scope = matched.closest('fieldset,section,form,div')
      if (!$scope?.length) $scope = matched.parents().first()

      const $labelMatch = $scope.find('label').filter((_, el) =>
        el?.innerText?.trim().toLowerCase().includes(ansLower)
      ).first()

      if ($labelMatch.length) {
        cy.wrap($labelMatch)
          .scrollIntoView()
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
      .scrollIntoView()
      .click({ force: true })
  } else if (campo.includes('Descreva a ocorrência')) {
    cy.get('textarea[id*="form-item"]', { timeout: 15000 })
      .should('be.visible')
      .should('be.enabled')
      .scrollIntoView()
      .click({ force: true })
  } else {
    cy.get('button.w-full', { timeout: 15000 })
      .first()
      .should('be.visible')
      .should('be.enabled')
      .scrollIntoView()
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
      .scrollIntoView()
      .click({ force: true })
    
    cy.wait(2500)
    cy.get('main').click({ force: true })
    cy.wait(2000)
  })
})

When('Descreva a ocorrencia - Descreva a ocorrência', () => {
  cy.wait(1000)
  
  cy.get('textarea').filter((_, el) => {
    const id = Cypress.$(el).attr('id')
    return id && id.includes('form-item')
  }).first()
    .should('be.visible')
    .should('be.enabled')
    .clear({ force: true })
    .type('Ocorrência registrada para teste de automação - Patrimônio', { delay: 100, force: true })
  
  cy.wait(1000)
})

When('valida a existencia do texto {string}', (texto) => {
  cy.wait(1000)
  
  if (texto === 'Sim') {
    cy.get('label.flex:nth-child(1) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Sim')
  } else if (texto === 'Não') {
    cy.get('label.flex:nth-child(2) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Não')
  } else if (texto.includes('Seção final')) {
    cy.get('div.items-center:nth-child(3) > div:nth-child(2) > p:nth-child(1)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Seção final')
  } else if (texto.includes('É possível imprimir uma cópia das respostas depois de enviá-las')) {
    cy.get('p.text-\\[14px\\]:nth-child(1)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'É possível imprimir')
  } else if (texto.includes('Unidade Educacional é contemplada pelo Smart Sampa')) {
    cy.get('div.space-y-2:nth-child(3) > label:nth-child(1)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Smart Sampa')
  } else if (texto.includes('Formulário geral')) {
    cy.get('div.justify-start:nth-child(2) > div:nth-child(2) > p:nth-child(1)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Formulário geral')
  } else if (texto.includes('Qual o tipo de ocorrência?*')) {
    cy.contains('label', 'Qual o tipo de ocorrência?', { timeout: 15000 })
      .should('be.visible')
  } else if (texto.includes('Quem são os envolvidos?*')) {
    cy.get('.grid > div:nth-child(2) > label:nth-child(1)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Quem são os envolvidos')
  } else if (texto.includes('Descreva a ocorrência*')) {
    cy.get('.contents > div:nth-child(2) > label:nth-child(1)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Descreva a ocorrência')
  } else if (texto.includes('Existem informações sobre o agressor e/ou vítima?*')) {
    cy.get('div.space-y-2:nth-child(3) > label:nth-child(1)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'agressor')
  } else if (texto.includes('Anexos')) {
    cy.get('div.flex:nth-child(4) > div:nth-child(2) > p:nth-child(1)', { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Anexos')
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

When('seleciona {string}', (opcao) => {
  cy.wait(2000)
  
  if (opcao.includes('Sim, mas não houve dano')) {
    cy.get('label.flex:nth-child(2) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true })
    cy.wait(1500)
  } else if (opcao.includes('Apenas um estudante')) {
    cy.get('body').then(($body) => {
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
    cy.contains('span,label', opcao, { timeout: 15000 })
      .first()
      .should('be.visible')
      .click({ force: true })
    cy.wait(1500)
  }
})

When('clica em Proximo', () => {
  cy.wait(2000)
  
  cy.get('button.inline-flex', { timeout: 15000 })
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView()
    .click({ force: true })
  
  cy.wait(3000)
})

When('clica no campo do declarante', () => {
  cy.wait(2000)
  
  cy.get('button[id*="form-item"]', { timeout: 15000 })
    .first()
    .should('be.visible')
    .should('be.enabled')
    .scrollIntoView()
    .click({ force: true })
  
  cy.wait(2500)
})

When('seleciona GIPE', () => {
  cy.wait(2000)
  
  cy.get('div.relative:nth-child(3)', { timeout: 15000 })
    .should('be.visible')
    .scrollIntoView()
    .click({ force: true })
  
  cy.wait(1500)
})

When('clica no campo de seguranca publica', () => {
  cy.wait(2000)
  
  cy.get('button[id*="form-item"]', { timeout: 15000 })
    .eq(1)
    .should('be.visible')
    .should('be.enabled')
    .scrollIntoView()
    .click({ force: true })
  
  cy.wait(2500)
})

When('seleciona opcao seguranca', () => {
  cy.wait(2000)
  
  cy.get('body').then(($body) => {
    if ($body.find('div[role="option"]').length > 0) {
      cy.get('div[role="option"]', { timeout: 15000 })
        .first()
        .should('be.visible')
        .click({ force: true })
    } else {
      cy.contains('span, div', /Sim|Não/i, { timeout: 15000 })
        .first()
        .should('be.visible')
        .click({ force: true })
    }
  })
  
  cy.wait(1500)
})

When('clica no campo de protocolo', () => {
  cy.wait(2000)
  
  cy.get('button[id*="form-item"]', { timeout: 15000 })
    .eq(2)
    .should('be.visible')
    .should('be.enabled')
    .scrollIntoView()
    .click({ force: true })
  
  cy.wait(2500)
})

When('seleciona protocolo', () => {
  cy.wait(2000)
  
  cy.get('body').then(($body) => {
    if ($body.find('div[role="option"]').length > 0) {
      cy.get('div[role="option"]', { timeout: 15000 })
        .first()
        .should('be.visible')
        .click({ force: true })
    } else {
      cy.contains('span, div', /.+/, { timeout: 15000 })
        .first()
        .should('be.visible')
        .click({ force: true })
    }
  })
  
  cy.wait(2000)
  
  // Clicar fora para fechar o dropdown e validar seleção
  cy.get('main').click({ force: true })
  cy.wait(1000)
})

When('clica em proximo final', () => {
  cy.wait(3000)
  
  // Aguardar botão ficar habilitado
  cy.get('.inline-flex', { timeout: 20000 })
    .should('be.visible')
    .then($btn => {
      // Se ainda estiver desabilitado, aguardar mais tempo
      if ($btn.is(':disabled') || $btn.hasClass('disabled')) {
        cy.wait(3000)
      }
    })
  
  cy.get('.inline-flex')
    .should('not.be.disabled')
    .scrollIntoView()
    .click({ force: true })
  
  cy.wait(3000)
})

Then('o sistema deve navegar para a próxima etapa do formulário', () => {
  cy.url({ timeout: 15000 }).should('include', '/cadastrar-ocorrencia')
})

When('clica fora para fechar dropdown', () => {
  cy.wait(500)
  cy.get('main').click({ force: true })
  cy.wait(1000)
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
      .scrollIntoView()
      .click({ force: true })
  } else {
    cy.get('button[id*="form-item"]', { timeout: 15000 })
      .eq(1)
      .should('be.visible')
      .should('be.enabled')
      .scrollIntoView()
      .click({ force: true })
  }
  
  cy.wait(2500)
})

When('preenche com {string}', (texto) => {
  cy.wait(1000)
  
  cy.get('textarea[id*="form-item"]', { timeout: 15000 })
    .should('be.visible')
    .should('be.enabled')
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
  
  if (opcao === 'Não') {
    cy.get('label.flex:nth-child(2) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true })
  } else if (opcao === 'Sim') {
    cy.get('label.flex:nth-child(1) > span:nth-child(3)', { timeout: 15000 })
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true })
  }
  
  cy.wait(1500)
})

When('clica em {string}', (texto) => {
  cy.wait(2000)
  
  if (texto.toLowerCase() === 'proximo') {
    cy.get('button.inline-flex', { timeout: 15000 })
      .should('be.visible')
      .should('not.be.disabled')
      .scrollIntoView()
      .click({ force: true })
    cy.wait(3000)
  }
})

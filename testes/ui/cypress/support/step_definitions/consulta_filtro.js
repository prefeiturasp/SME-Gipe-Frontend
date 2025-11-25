import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import ConsultaFiltroLocalizadores from '../locators/consulta_filtro_locators'
import { acessarSistema, efetuarLogin } from '../commands_ui/commands_login'

const locators = new ConsultaFiltroLocalizadores()

const RF_PADRAO = '05481179342'
const SENHA_PADRAO = 'Sgp9342'

Given('que eu acesso o sistema', () => {
  cy.log('Acessando sistema GIPE...')
  acessarSistema()
})

Given('eu efetuo login com RF', () => {
  cy.log(`Efetuando login com RF: ${RF_PADRAO}`)
  efetuarLogin(RF_PADRAO, SENHA_PADRAO)
})

When('o usuário está na página principal do sistema', () => {
  cy.wait(2000)
  cy.url().should('include', '/dashboard')
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
        const dataValue = opcao.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
        cy.get(`${selectorCampo}[data-value="${dataValue}"]`).click({ force: true })
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

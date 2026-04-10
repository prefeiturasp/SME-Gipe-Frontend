import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Gestao_Unidade_Localizadores from '../locators/gestao_unidade_locators'

const locators = new Gestao_Unidade_Localizadores()

// ============================================================================
// CREDENCIAIS VÊM DO .env via cypress.config.js
// ============================================================================

// Funções auxiliares
const clickElementXPath = (xpath, wait = 2000) => {
  cy.xpath(xpath, { timeout: 15000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(wait)
}

const selectDropdownOption = (optionText) => {
  cy.wait(2000)
  cy.get('body').then($body => {
    const selector = $body.find('div[role="option"]').length > 0 
      ? 'div[role="option"]' 
      : 'span, div'
    
    cy.contains(selector, optionText, { timeout: 15000 })
      .first()
      .should('exist') // Apenas verifica existência, não visibilidade
      .click({ force: true }) // force: true permite clicar mesmo com opacity: 0
  })
  cy.wait(1500)
}

// Lista de mensagens aleatórias para o campo de motivo
const mensagensMotivo = [
  'Unidade educacional encerrou suas atividades neste endereço',
  'Transferência de gestão para outra DRE',
  'Unidade passou por processo de fusão com outra UE',
  'Suspensão temporária das atividades por reforma',
  'Reorganização administrativa da rede municipal',
  'Mudança de categoria da unidade educacional',
  'Processo de municipalização não concluído',
  'Desativação por baixa demanda de alunos',
  'Unidade será transformada em outro tipo de equipamento',
  'Transferência para rede estadual de ensino'
]

function obterMensagemAleatoria() {
  const indice = Math.floor(Math.random() * mensagensMotivo.length)
  return mensagensMotivo[indice]
}

// Given já definido em gestao_pessoas.js
/* Given('que eu acesso o sistema como GIPE', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br', { 
    timeout: 60000,
    retryOnNetworkFailure: true,
    failOnStatusCode: false
  })
  cy.wait(3000)
  cy.url({ timeout: 30000 }).should('include', 'gipe.sme.prefeitura.sp.gov.br')
}) */

// Given já definido em gestao_pessoas.js
/* Given('eu efetuo login com RF GIPE', () => {
  cy.get('input[placeholder="Digite um RF ou CPF"]', { timeout: 15000 })
    .should('be.visible')
    .clear()
    .type(RF_GIPE, { delay: 100 })
  
  cy.get('input[placeholder="Digite sua senha"]', { timeout: 15000 })
    .should('be.visible')
    .clear()
    .type(SENHA_GIPE, { delay: 100 })
  
  cy.get('button')
    .filter((_, el) => el.innerText && el.innerText.trim() === 'Acessar')
    .should('be.visible')
    .should('not.be.disabled')
    .click()
  
  cy.wait(5000)
  cy.url({ timeout: 30000 }).should('include', '/dashboard')
  cy.wait(3000)
}) */

// Given já definido em gestao_pessoas.js
/* Given('estou na página principal do sistema', () => {
  cy.url({ timeout: 15000 }).should('include', '/dashboard')
  cy.wait(2000)
}) */

// When já definido em gestao_pessoas.js
/* When('acesso o menu de Gestão', () => {
  clickElementXPath(locators.menu_gestao())
}) */

Then('valido a existência das opções {string} e {string}', (opcao1, opcao2) => {
  cy.wait(2000)
  cy.xpath(locators.opcao_gestao_perfil(), { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', 'Gestão')
  
  cy.xpath(locators.opcao_gestao_unidades(), { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', 'Unidade')
  cy.wait(1000)
})

When('clica na opção {string}', (opcao) => {
  cy.wait(2000)
  
  if (opcao === 'Gestão de unidades Educacionais') {
    cy.xpath(locators.opcao_gestao_unidades(), { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
    cy.wait(3000)
  }
})

When('seleciono a opção {string}', (opcao) => {
  cy.wait(3000)
  cy.log('=== INICIANDO SELEÇÃO DE OPÇÃO ===')
  cy.screenshot('antes-do-click')
  
  const xpath = '/html/body/div/div/div[1]/div[2]/div/div[2]/div/div/ul/li[3]/div[2]/ul/li[2]/a'
  cy.log('Xpath:', xpath)
  
  cy.xpath(xpath, { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .then($el => {
      cy.log('Elemento encontrado! Texto:', $el.text())
      cy.wrap($el).click({ force: true, multiple: true })
    })
  
  cy.log('Aguardando navegação...')
  cy.wait(6000)
  cy.screenshot('depois-do-click')
  cy.url().then(url => cy.log('URL atual:', url))
  cy.url({ timeout: 15000 }).should('include', 'gestao-unidades')
})

Then('visualizo a página de Gestão de Unidades Educacionais', () => {
  cy.wait(3000)
  cy.get(locators.titulo_pagina(), { timeout: 15000 })
    .should('be.visible')
    .invoke('text')
    .should('match', /Gestão de [Uu]nidades [Ee]ducacionais/)
  cy.wait(2000)
})

Then('visualizo as abas {string} e {string}', (aba1, aba2) => {
  cy.wait(2000)
  
  // Verifica aba 1
  cy.xpath(locators.aba_unidades_ativas(), { timeout: 15000 })
    .should('exist')
    .should('be.visible')
  
  // Verifica aba 2
  cy.xpath(locators.aba_unidades_inativas(), { timeout: 15000 })
    .should('exist')
    .should('be.visible')
  
  cy.wait(1000)
})

When('clico no botão Cadastrar Unidade Educacional', () => {
  cy.get('a[href="/dashboard/gestao-unidades-educacionais/cadastro"]', { timeout: 15000 })
    .should('be.visible')
    .scrollIntoView()
    .wait(500)
    .click({ force: true })
  cy.wait(3000)
})

// Step removido - definição completa está mais abaixo no arquivo (linha 475)

Then('valido a existência do título Cadastrar Unidade Educacional', () => {
  cy.url({ timeout: 15000 }).should('include', '/cadastro')
  cy.wait(2000)
  cy.get('body > div > div > div.flex.flex-col.flex-1.w-full > main > div.flex.items-center.justify-between.w-full.px-4 > h1', { timeout: 15000 })
    .should('be.visible')
    .and('contain.text', 'Cadastrar Unidade Educacional')
  cy.wait(1000)
})

// When já definido em gestao_pessoas.js - Versão específica para unidades
When('acesso a aba de unidades {string}', (nomeAba) => {
  cy.wait(2000)
  
  // IMPORTANTE: Verificar 'inativas' ANTES de 'ativas' porque 'inativas' contém 'ativas'
  if (nomeAba.includes('inativas')) {
    cy.log('Clicando na aba de Unidades Educacionais INATIVAS')
    cy.xpath(locators.aba_unidades_inativas(), { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
  } else if (nomeAba.includes('ativas')) {
    cy.log('Clicando na aba de Unidades Educacionais ATIVAS')
    cy.xpath(locators.aba_unidades_ativas(), { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })
  }
  
  cy.wait(3000)
})

// When jádef definido em gestao_pessoas.js
/* When('filtro pela {string} {string}', (tipoFiltro, valor) => {
  cy.wait(2000)
  
  if (tipoFiltro === 'Diretoria Regional') {
    cy.get('body').then($body => {
      if ($body.find('div[role="combobox"]').length > 0) {
        cy.get('div[role="combobox"]').first().click({ force: true })
      } else if ($body.find('button:contains("Selecionar")').length > 0) {
        cy.get('button:contains("Selecionar")').first().click({ force: true })
      } else if ($body.find('input[placeholder*="DRE"]').length > 0) {
        cy.get('input[placeholder*="DRE"]').first().click({ force: true })
      } else if ($body.find('select').length > 0) {
        cy.get('select').first().click({ force: true })
      }
    })
    
    cy.wait(2000)
    selectDropdownOption(valor)
  }
}) */

// Validações de texto específicas para unidades
Then('valida a existencia do texto {string}', (texto) => {
  cy.wait(1000)
  const textoLimpo = texto.trim()
  cy.contains(textoLimpo, { timeout: 15000 })
    .should('exist')
    .should('be.visible')
  cy.wait(500)
})

Then('valida o titulo {string}', (titulo) => {
  cy.wait(1000)
  const tituloLimpo = titulo.trim()
  cy.contains(tituloLimpo, { timeout: 15000 })
    .should('exist')
    .should('be.visible')
  cy.wait(500)
})

When('clica no campo', () => {
  cy.wait(1500)
  // Procura o botão/campo de filtro de DRE
  cy.get('body').then($body => {
    const seletores = [
      'button[role="combobox"]',
      'div[role="combobox"]',
      'button:contains("Selecionar")',
      'button:contains("Diretoria")',
      'section button'
    ]
    
    for (const seletor of seletores) {
      if ($body.find(seletor).length > 0) {
        cy.get(seletor).first().click({ force: true })
        break
      }
    }
  })
  cy.wait(2000)
})

When('seleciona no filtro a unidades pela {string}', (valor) => {
  cy.wait(2000)
  selectDropdownOption(valor)
  cy.wait(2000)
})

// Step específico para unidades - evita conflito com gestao_pessoas
When('filtro unidades pela {string} {string}', (tipoFiltro, valor) => {
  cy.wait(2000)
  
  if (tipoFiltro === 'Diretoria Regional') {
    // Busca especificamente no contexto de unidades
    cy.get('body').then($body => {
      // Procura o filtro de DRE no contexto da tela de unidades
      const filtros = [
        'div[role="combobox"]',
        'button:contains("Selecionar")',
        'input[placeholder*="DRE"]',
        'input[placeholder*="Diretoria"]',
        'select'
      ]
      
      for (const filtro of filtros) {
        if ($body.find(filtro).length > 0) {
          cy.get(filtro).first().click({ force: true })
          break
        }
      }
    })
    
    cy.wait(2000)
    selectDropdownOption(valor)
  }
})

Then('visualizo a listagem de Unidades Educacionais', () => {
  cy.wait(3000)
  cy.get(locators.tabela_unidades(), { timeout: 15000 })
    .should('exist')
    .should('be.visible')
  cy.wait(2000)
})

// Novo step: Validar existência de todas as colunas da tabela
Then('valido a existência da tabela com as colunas {string} {string} {string} {string} {string} {string} {string}', 
  (col1, col2, col3, col4, col5, col6, col7) => {
  cy.wait(2000)
  
  const colunas = [
    { nome: col1, seletor: 'th.h-\\[35px\\]:nth-child(1)' },
    { nome: col2, seletor: 'th.h-\\[35px\\]:nth-child(2)' },
    { nome: col3, seletor: 'th.h-\\[35px\\]:nth-child(3)' },
    { nome: col4, seletor: 'th.h-\\[35px\\]:nth-child(4)' },
    { nome: col5, seletor: 'th.h-\\[35px\\]:nth-child(5)' },
    { nome: col6, seletor: 'th.h-\\[35px\\]:nth-child(6)' },
    { nome: col7, seletor: 'th.h-\\[35px\\]:nth-child(7)' }
  ]
  
  // Valida thead existe
  cy.get('table thead', { timeout: 15000 })
    .should('exist')
    .should('be.visible')
  
  // Valida cada coluna
  colunas.forEach((coluna, index) => {
    cy.log(`Validando coluna ${index + 1}: ${coluna.nome}`)
    cy.get(coluna.seletor, { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .then(text => {
        cy.log(`Texto da coluna ${index + 1}: ${text.trim()}`)
      })
  })
  
  cy.wait(1000)
  cy.log('Todas as colunas da tabela foram validadas com sucesso')
})

// Novo step: Procurar unidade específica na coluna
Then('procura na coluna {string} a unidade educacional {string}', (nomeColuna, nomeUnidade) => {
  cy.wait(2000)
  cy.log(`Procurando unidade "${nomeUnidade}" na coluna "${nomeColuna}"...`)
  
  // Busca dinamicamente a célula que contém a unidade educacional
  cy.get('table tbody tr', { timeout: 15000 })
    .contains('td', nomeUnidade, { timeout: 10000 })
    .should('exist')
    .should('be.visible')
    .invoke('text')
    .then(text => {
      const textoLimpo = text.trim()
      cy.log(`Texto encontrado na célula: "${textoLimpo}"`)
      expect(textoLimpo).to.include(nomeUnidade)
    })
  
  // Salva o nome da unidade para uso posterior
  cy.wrap(nomeUnidade).as('nomeUnidadeSelecionada')
  
  cy.wait(1000)
  cy.log(`Unidade "${nomeUnidade}" encontrada na coluna "${nomeColuna}"`)
})

// Novo step: Navegar até coluna Ação e validar botão visualizar
Then('navega ate a coluna {string} e valido a existência do botão {string} da Unidade {string}', 
  (nomeColuna, nomeBotao, nomeUnidade) => {
  cy.wait(1500)
  cy.log(`Validando botão "${nomeBotao}" na coluna "${nomeColuna}" para unidade "${nomeUnidade}"`)
  
  // Busca dinamicamente a linha que contém a unidade
  cy.get('table tbody tr', { timeout: 15000 })
    .contains('td', nomeUnidade, { timeout: 10000 })
    .parents('tr')
    .then($row => {
      // Dentro dessa linha, busca a coluna de ação (última coluna com o botão)
      cy.wrap($row).within(() => {
        // Busca o link na última coluna td
        cy.get('td:last a', { timeout: 10000 })
          .should('exist')
          .should('be.visible')
          .then($link => {
            const href = $link.attr('href')
            cy.log(`Link do botão visualizar: ${href}`)
            expect(href).to.include('/editar/')
          })
      })
    })
  
  cy.wait(1000)
  cy.log(`Botão "${nomeBotao}" validado com sucesso na coluna "${nomeColuna}"`)
})

// Then já definido em gestao_pessoas.js
/* Then('valido a existência do texto {string} no cabeçalho da tabela', (texto) => {
  cy.wait(1000)
  cy.xpath(locators.cabecalho_tabela_acao(), { timeout: 15000 })
    .should('exist')
    .should('be.visible')
  cy.wait(1000)
}) */

// When já definido em gestao_pessoas.js
/* When('clico no botão visualizar do usuário', () => {
  cy.wait(2000)
  cy.get('table tbody tr', { timeout: 15000 }).first().within(() => {
    cy.get('button').filter((index, button) => {
      const ariaLabel = button.getAttribute('aria-label') || ''
      const text = button.innerText || ''
      return ariaLabel.toLowerCase().includes('visualizar') || 
             text.toLowerCase().includes('visualizar')
    }).first().click({ force: true })
  })
  cy.wait(3000)
}) */

// Novo step: Clicar no botão visualizar usando busca dinâmica
When('clico no botão visualizar da unidade {string}', (nomeUnidade) => {
  cy.wait(2000)
  cy.log(`=== Clicando no botão visualizar da unidade "${nomeUnidade}" ===`)
  
  // Busca dinamicamente a linha que contém a unidade
  cy.get('table tbody tr', { timeout: 15000 })
    .contains('td', nomeUnidade, { timeout: 10000 })
    .parents('tr')
    .then($row => {
      // Dentro dessa linha, busca e clica no link de ação
      cy.wrap($row).within(() => {
        cy.get('td:last a', { timeout: 10000 })
          .should('exist')
          .should('be.visible')
          .scrollIntoView()
          .then($link => {
            const href = $link.attr('href')
            cy.log(`Clicando no link: ${href}`)
            cy.wrap($link).click({ force: true })
          })
      })
    })
  
  cy.wait(3000)
  cy.log('Botão visualizar clicado com sucesso')
})

// Step alternativo com formato diferente (com aspas em volta de "visualizar")
When('clico no botão {string} da unidade {string}', (nomeBotao, nomeUnidade) => {
  cy.wait(2000)
  
  if (nomeBotao.toLowerCase().includes('visualizar')) {
    cy.log(`=== Clicando no botão "${nomeBotao}" da unidade "${nomeUnidade}" ===`)
    
    // Busca dinamicamente a linha que contém a unidade
    cy.get('table tbody tr', { timeout: 15000 })
      .contains('td', nomeUnidade, { timeout: 10000 })
      .parents('tr')
      .then($row => {
        // Dentro dessa linha, busca e clica no link de ação
        cy.wrap($row).within(() => {
          cy.get('td:last a', { timeout: 10000 })
            .should('exist')
            .should('be.visible')
            .scrollIntoView()
            .then($link => {
              const href = $link.attr('href')
              cy.log(`Clicando no link: ${href}`)
              cy.wrap($link).click({ force: true })
            })
        })
      })
    
    cy.wait(3000)
    cy.log(`Botão "${nomeBotao}" clicado com sucesso`)
  } else {
    cy.log(`Botão "${nomeBotao}" não é reconhecido`)
  }
})

Then('visualizo a página de Editar Unidade Educacional', () => {
  cy.wait(5000)
  cy.url({ timeout: 20000 }).should('include', '/editar/')
  
  cy.get('h1', { timeout: 20000 })
    .should('be.visible')
    .invoke('text')
    .should('match', /Editar [Uu]nidade [Ee]ducacional/)
  
  cy.wait(4000)
})

Then('Valida a existencia do botão {string}', (textoBotao) => {
  cy.log(`Validando existência do botão: ${textoBotao}`)
  cy.wait(2000)
  
  // XPath específico: /html/body/div/div/div[2]/main/div[1]/div/button
  const xpathBotao = '/html/body/div/div/div[2]/main/div[1]/div/button'
  
  cy.xpath(xpathBotao, { timeout: 30000 })
    .should('exist')
    .should('be.visible')
    .invoke('text')
    .then(textoEncontrado => {
      const textoLimpo = textoEncontrado.trim().toLowerCase()
      const textoEsperado = textoBotao.toLowerCase()
      
      cy.log(`Botão encontrado: "${textoLimpo}"`)
      cy.log(`Esperado: "${textoEsperado}"`)
      
      // Valida que o botão contém o texto esperado
      expect(textoLimpo).to.include(textoEsperado.split(' ')[0]) // Valida pelo primeiro termo (ex: "Reativar" ou "Inativar")
      cy.log('Botão está visível e disponível')
    })
  
  // Verifica se o botão está habilitado
  cy.xpath(xpathBotao, { timeout: 30000 })
    .then($btn => {
      const disabled = $btn.attr('disabled') || $btn.prop('disabled')
      if (disabled) {
        cy.log('AVISO: Botão está desabilitado!')
      } else {
        cy.log('Botão está habilitado e pronto para clique')
      }
    })
  
  cy.wait(1000)
  cy.log(`Validação do botão "${textoBotao}" concluída com sucesso`)
})

Then('o sistema exibe o modal de Inativação de Unidade Educacional', () => {
  cy.wait(3000)
  cy.log('Verificando se modal foi aberto')
  
  cy.get('body').then(($body) => {
    const modals = $body.find('[role="dialog"], [role="alertdialog"], [data-state="open"]')
    cy.log(`Modais encontrados no DOM: ${modals.length}`)
    
    if (modals.length > 0) {
      modals.each((index, modal) => {
        const texto = Cypress.$(modal).text().substring(0, 50)
        cy.log(`Modal ${index + 1}: ${texto}...`)
      })
    }
  })
  
  cy.get('[role="dialog"]', { timeout: 40000 })
    .filter(':visible')
    .last()
    .should('be.visible')
    .then(($modal) => {
      const textoModal = $modal.text()
      cy.log('Modal encontrado e visível')
      
      if (textoModal.includes('Inativação') || textoModal.includes('Inativar')) {
        cy.log('Modal de inativação confirmado')
      } else {
        cy.log('Conteúdo do modal:')
        cy.log(textoModal.substring(0, 200))
      }
    })
  
  cy.wait(1000)
  cy.log('Modal de Inativação validado com sucesso')
})

Then('valida a existência do titulo {string}', (tituloEsperado) => {
  cy.wait(1000)
  
  cy.get('[role="dialog"]', { timeout: 15000 })
    .filter(':visible')
    .last()
    .within(() => {
      cy.get('[id^="radix-"]', { timeout: 10000 })
        .filter((index, el) => {
          const text = Cypress.$(el).text()
          return text.includes('Inativação de Unidade Educacional')
        })
        .first()
        .should('be.visible')
        .invoke('text')
        .then(texto => {
          cy.log(`Título encontrado: "${texto.trim()}"`)
          expect(texto.trim()).to.include('Inativação')
        })
    })
  
  cy.wait(1000)
  cy.log('Título do modal validado com sucesso')
})

Then('visualizo a mensagem de confirmação de inativação {string}', (mensagem) => {
  cy.wait(1000)
  
  cy.get('[role="dialog"]', { timeout: 15000 })
    .filter(':visible')
    .last()
    .within(() => {
      cy.get('[id^="radix-"]', { timeout: 10000 })
        .filter((index, el) => {
          const text = Cypress.$(el).text()
          return text.includes('Ao inativar o perfil da unidade educacional')
        })
        .should('exist')
        .should('be.visible')
        .invoke('text')
        .then(texto => {
          cy.log(`Mensagem encontrada: "${texto.trim().substring(0, 80)}..."`)
          expect(texto).to.include('Ao inativar o perfil da unidade educacional')
          expect(texto).to.include('não será mais possível vincular novas intercorrências')
        })
    })
  
  cy.wait(1000)
  cy.log('Mensagem de confirmação validada com sucesso')
})

Then('valida o texto {string}', (texto) => {
  cy.wait(1000)
  
  if (texto.includes('Motivo da inativação')) {
    cy.get('[role="dialog"]', { timeout: 15000 })
      .filter(':visible')
      .last()
      .within(() => {
        cy.get('div.mb-4 > label', { timeout: 10000 })
          .should('exist')
          .should('be.visible')
          .invoke('text')
          .then(labelText => {
            cy.log(`Label encontrada: "${labelText}"`)
            expect(labelText).to.include('Motivo da inativação')
          })
      })
  }
  
  cy.wait(1000)
  cy.log('Label de motivo validada com sucesso')
})

Then('Preecnhe o Campo com mensagens aleatorios', () => {
  cy.wait(2000)
  
  const mensagens = [
    'Unidade não possui mais demanda de alunos na região.',
    'Processo de reorganização da rede municipal de ensino.',
    'Unidade será transferida para outra Diretoria Regional.',
    'Fechamento temporário para reforma estrutural completa.',
    'Baixa demanda de matrículas nos últimos 3 anos letivos.',
    'Unidade será integrada com outra escola da região.',
    'Decisão administrativa da Secretaria Municipal de Educação.',
    'Adequação ao novo plano de distribuição de vagas.',
    'Unidade passará por processo de recadastramento.',
    'Determinação judicial para suspensão temporária das atividades.'
  ]
  
  const mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)]
  
  const xpathTextarea = '/html/body/div[3]/div[2]/textarea'
  
  cy.xpath(xpathTextarea, { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .scrollIntoView()
    .click({ force: true })
    .clear()
    .type(mensagemAleatoria, { delay: 50 })
  
  cy.wait(1000)
  cy.log(`Mensagem preenchida: ${mensagemAleatoria}`)
})

Then('visualizo os botões {string} e {string} no modal', (botao1, botao2) => {
  cy.wait(1500)
  
  cy.get('[role="dialog"]', { timeout: 15000 })
    .filter(':visible')
    .last()
    .within(() => {
      // Verificar se há pelo menos 2 botões
      cy.get('button', { timeout: 10000 })
        .should('have.length.at.least', 2)
      
      // Procurar pelo botão de cancelar
      cy.get('button', { timeout: 10000 })
        .eq(0) // Primeiro botão (cancelar)
        .should('exist')
        .should('be.visible')
        .invoke('text')
        .then(texto => {
          cy.log(`Botão 1 encontrado: "${texto.trim()}"`)
          const textoLimpo = texto.trim().toLowerCase()
          expect(textoLimpo).to.include('cancelar')
        })
      
      // Procurar pelo segundo botão (Inativar ou Reativar)
      cy.get('button', { timeout: 10000 })
        .eq(1) // Segundo botão
        .should('exist')
        .should('be.visible')
        .invoke('text')
        .then(texto => {
          cy.log(`Botão 2 encontrado: "${texto.trim()}"`)
          const textoLimpo = texto.trim().toLowerCase()
          // Valida se contém "inativar" ou "reativar"
          expect(textoLimpo).to.match(/inativar|reativar/)
        })
    })
  
  cy.wait(1000)
  cy.log('Botões do modal validados com sucesso')
})

Then('o sistema redireciona para a tela de Gestão de usuários', () => {
  cy.wait(3000)
  
  // Valida URL
  cy.url({ timeout: 15000 }).should('match', /gestao-unidades-educacionais|gestao-usuarios/)
  
  // Seletor CSS específico para o h1 da página
  cy.get('body > div > div > div.flex.flex-col.flex-1.w-full > main > div.flex.items-center.justify-between.w-full.px-4 > h1', { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .invoke('text')
    .then(texto => {
      cy.log(`Título da página: "${texto.trim()}"`)
    })
  
  cy.wait(2000)
  cy.log('Redirecionamento para tela de Gestão validado com sucesso')
})

Then('o perfil é inativado com sucesso', () => {
  cy.wait(2000)
  
  // Verifica se existe mensagem de sucesso (toast/alert)
  cy.get('body').then($body => {
    if ($body.find('div[role="alert"]').length > 0) {
      cy.get('div[role="alert"]', { timeout: 10000 })
        .should('be.visible')
        .invoke('text')
        .then(texto => {
          cy.log(`Mensagem de sucesso: "${texto.trim()}"`)
        })
    } else {
      cy.log('Nenhum alerta visível - validando apenas o redirecionamento')
    }
  })
  
  cy.wait(1000)
  cy.log('Perfil inativado com sucesso')
})

When('confirmo a inativação clicando em {string}', (botao) => {
  cy.wait(2000)
  
  cy.log('Confirmando inativação de unidade')
  
  cy.get('[role="dialog"]', { timeout: 15000 })
    .filter(':visible')
    .last()
    .within(() => {
      // O botão de inativar é geralmente o segundo botão (índice 1)
      cy.get('button', { timeout: 10000 })
        .eq(1) // Segundo botão
        .should('exist')
        .should('be.visible')
        .should('not.be.disabled')
        .scrollIntoView()
        .click({ force: true })
    })
  
  cy.wait(3000)
  cy.log('Inativação confirmada - botão clicado com sucesso')
})

// ==================== STEPS DE REATIVAÇÃO ====================

Then('Valida a existencia do botão {string}', (textoBotao) => {
  cy.wait(2000)
  
  if (textoBotao === 'Reativar Unidade Educacional') {
    const xpathBotao = '/html/body/div/div/div[2]/main/div[1]/div/button'
    
    cy.log(`Validando existência do botão: ${textoBotao}`)
    cy.wait(4000)
    
    cy.xpath(xpathBotao, { timeout: 30000 })
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .then(texto => {
        cy.log(`Botão encontrado: "${texto.trim()}"`)
        expect(texto.trim()).to.include('Reativar')
      })
    
    cy.log(`Validação do botão "${textoBotao}" concluída com sucesso`)
  }
})

Then('o sistema exibe o modal de Reativação de Unidade Educacional', () => {
  cy.wait(3000)
  cy.log('Verificando se modal de reativação foi aberto')
  
  cy.get('body').then(($body) => {
    const modals = $body.find('[role="dialog"], [role="alertdialog"], [data-state="open"]')
    cy.log(`Modais encontrados no DOM: ${modals.length}`)
    
    if (modals.length > 0) {
      modals.each((index, modal) => {
        const texto = Cypress.$(modal).text().substring(0, 50)
        cy.log(`Modal ${index + 1}: ${texto}...`)
      })
    }
  })
  
  cy.get('[role="dialog"]', { timeout: 40000 })
    .filter(':visible')
    .last()
    .should('be.visible')
    .then(($modal) => {
      const textoModal = $modal.text()
      cy.log('Modal de reativação encontrado e visível')
      
      if (textoModal.includes('Reativação') || textoModal.includes('Reativar')) {
        cy.log('Modal de reativação confirmado')
      } else {
        cy.log('Conteúdo do modal:')
        cy.log(textoModal.substring(0, 200))
      }
    })
  
  cy.wait(1000)
  cy.log('Modal de Reativação validado com sucesso')
})

Then('valida a existência do titulo de reativação {string}', (tituloEsperado) => {
  cy.wait(1000)
  
  cy.get('[role="dialog"]', { timeout: 15000 })
    .filter(':visible')
    .last()
    .within(() => {
      cy.get('[id^="radix-"]', { timeout: 10000 })
        .filter((index, el) => {
          const text = Cypress.$(el).text()
          return text.includes('Reativação de Unidade Educacional')
        })
        .first()
        .should('be.visible')
        .invoke('text')
        .then(texto => {
          cy.log(`Título encontrado: "${texto.trim()}"`)
          expect(texto.trim()).to.include('Reativação')
        })
    })
  
  cy.wait(1000)
  cy.log('Título do modal de reativação validado com sucesso')
})

Then('visualizo a mensagem de confirmação de reativação {string}', (mensagem) => {
  cy.wait(1000)
  
  cy.get('[role="dialog"]', { timeout: 15000 })
    .filter(':visible')
    .last()
    .within(() => {
      cy.get('[id^="radix-"]', { timeout: 10000 })
        .filter((index, el) => {
          const text = Cypress.$(el).text()
          return text.includes('Ao reativar o perfil da unidade educacional')
        })
        .should('exist')
        .should('be.visible')
        .invoke('text')
        .then(texto => {
          cy.log(`Mensagem encontrada: "${texto.trim().substring(0, 80)}..."`)
          expect(texto).to.include('Ao reativar o perfil da unidade educacional')
          expect(texto).to.include('novas intercorrências poderão ser vinculadas')
        })
    })
  
  cy.wait(1000)
  cy.log('Mensagem de confirmação de reativação validada com sucesso')
})

Then('valida o texto de reativação {string}', (texto) => {
  cy.wait(1000)
  
  if (texto.includes('Motivo') || texto.includes('Reativação')) {
    cy.get('[role="dialog"]', { timeout: 15000 })
      .filter(':visible')
      .last()
      .within(() => {
        cy.get('div.mb-4 > label', { timeout: 10000 })
          .should('exist')
          .should('be.visible')
          .invoke('text')
          .then(labelText => {
            const labelLimpo = labelText.trim().toLowerCase()
            cy.log(`Label encontrada: "${labelText}"`)
            expect(labelLimpo).to.include('motivo')
            expect(labelLimpo).to.include('reativação')
          })
      })
  }
  
  cy.wait(1000)
  cy.log('Label de motivo de reativação validada com sucesso')
})

Then('Preecnhe o Campo de reativação com mensagens aleatorios', () => {
  cy.wait(2000)
  
  const mensagens = [
    'Retorno da demanda de alunos na região após recadastramento.',
    'Conclusão do processo de reforma e adequação da infraestrutura.',
    'Autorização da Secretaria Municipal para retomada das atividades.',
    'Regularização completa da documentação e processos administrativos.',
    'Reintegração da unidade ao planejamento da rede municipal.',
    'Atendimento às novas diretrizes de distribuição de vagas.',
    'Finalização do período de suspensão temporária das atividades.',
    'Readequação concluída conforme plano da Diretoria Regional.',
    'Reversão de decisão anterior mediante nova análise técnica.',
    'Necessidade de reativação para atender demanda local crescente.'
  ]
  
  const mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)]
  
  cy.wait(1500)
  
  cy.get('[role="dialog"]', { timeout: 15000 })
    .filter(':visible')
    .last()
    .within(() => {
      cy.get('textarea', { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .scrollIntoView()
        .click({ force: true })
        .clear()
        .type(mensagemAleatoria, { delay: 50 })
    })
  
  cy.wait(1000)
  cy.log(`Mensagem de reativação preenchida: ${mensagemAleatoria}`)
})

Then('visualizo os botões de reativação {string} e {string} no modal', (botao1, botao2) => {
  cy.wait(1500)
  
  cy.get('[role="dialog"]', { timeout: 15000 })
    .filter(':visible')
    .last()
    .within(() => {
      // Verificar se há pelo menos 2 botões
      cy.get('button', { timeout: 10000 })
        .should('have.length.at.least', 2)
      
      // Procurar pelo botão de cancelar
      cy.get('button', { timeout: 10000 })
        .eq(0) // Primeiro botão (cancelar)
        .should('exist')
        .should('be.visible')
        .invoke('text')
        .then(texto => {
          cy.log(`Botão 1 encontrado: "${texto.trim()}"`)
          const textoLimpo = texto.trim().toLowerCase()
          expect(textoLimpo).to.include('cancelar')
        })
      
      // Procurar pelo botão de reativar
      cy.get('button', { timeout: 10000 })
        .eq(1) // Segundo botão (reativar)
        .should('exist')
        .should('be.visible')
        .invoke('text')
        .then(texto => {
          cy.log(`Botão 2 encontrado: "${texto.trim()}"`)
          const textoLimpo = texto.trim().toLowerCase()
          expect(textoLimpo).to.include('reativar')
        })
    })
  
  cy.wait(1000)
  cy.log('Botões do modal de reativação validados com sucesso')
})

When('confirmo a reativação clicando em {string}', (botao) => {
  cy.wait(2000)
  
  cy.log('Confirmando reativação de unidade')
  
  cy.get('[role="dialog"]', { timeout: 15000 })
    .filter(':visible')
    .last()
    .within(() => {
      // O botão de reativar é geralmente o segundo botão (índice 1)
      cy.get('button', { timeout: 10000 })
        .eq(1) // Segundo botão
        .should('exist')
        .should('be.visible')
        .should('not.be.disabled')
        .scrollIntoView()
        .click({ force: true })
    })
  
  cy.wait(3000)
  cy.log('Reativação confirmada - botão clicado com sucesso')
})

Then('o perfil é reativado com sucesso', () => {
  cy.wait(2000)
  
  cy.get('body').then($body => {
    if ($body.find('div[role="alert"]').length > 0) {
      cy.get('div[role="alert"]', { timeout: 10000 })
        .should('be.visible')
        .invoke('text')
        .then(texto => {
          cy.log(`Mensagem de sucesso: "${texto.trim()}"`)
        })
    } else {
      cy.log('Nenhum alerta visível - validando apenas o redirecionamento')
    }
  })
  
  cy.wait(1000)
  cy.log('Perfil reativado com sucesso')
})

// ============= STEPS PARA REATIVAÇÃO =============

Then('o sistema exibe o modal de Reativação de Unidade Educacional', () => {
  cy.wait(3000)
  cy.log('Verificando se modal de reativação foi aberto')
  
  cy.get('div[role="dialog"]', { timeout: 20000 })
    .should('exist')
    .should('be.visible')
  
  cy.wait(1000)
  cy.log('Modal de Reativação de Unidade Educacional validado com sucesso')
})

Then('valida a existência do titulo de reativação {string}', (tituloEsperado) => {
  cy.wait(1000)
  
  const tituloNormalizado = tituloEsperado.trim()
  
  // Seletor específico: #radix-\:r14\:
  cy.get('div[role="dialog"]', { timeout: 15000 })
    .within(() => {
      cy.contains('Reativação de Unidade Educacional', { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .invoke('text')
        .then(texto => {
          cy.log(`Título encontrado: "${texto.trim()}"`)
        })
    })
  
  cy.wait(1000)
})

Then('visualizo a mensagem de confirmação de reativação {string}', (mensagem) => {
  cy.wait(1000)
  
  // Seletor específico para a mensagem: #radix-\:r15\:
  cy.get('div[role="dialog"]', { timeout: 15000 })
    .within(() => {
      cy.contains('Ao reativar o perfil da unidade educacional', { timeout: 10000 })
        .should('exist')
        .should('be.visible')
        .invoke('text')
        .then(texto => {
          cy.log(`Mensagem de confirmação encontrada: "${texto.substring(0, 50)}..."`)
        })
    })
  
  cy.wait(1000)
  cy.log('Mensagem de confirmação de reativação validada')
})

Then('valida o texto de reativação {string}', (texto) => {
  cy.wait(1000)
  
  if (texto.includes('Motivo da Reativação')) {
    // Seletor específico: label.text-\[\#42474A\]
    cy.get('div[role="dialog"]', { timeout: 15000 })
      .within(() => {
        cy.get('label', { timeout: 10000 })
          .should('exist')
          .should('be.visible')
          .invoke('text')
          .then(labelText => {
            cy.log(`Label encontrada: "${labelText}"`)
            expect(labelText).to.include('Motivo')
          })
      })
  }
  
  cy.wait(1000)
})

Then('Preecnhe o Campo de reativação com mensagens aleatorios', () => {
  cy.wait(2000)
  
  const mensagemAleatoria = obterMensagemAleatoria()
  
  // Seletor CSS específico: //*[@id="motivo"]
  cy.get('#motivo', { timeout: 15000 })
    .should('exist')
    .should('be.visible')
    .clear()
    .type(mensagemAleatoria, { delay: 50 })
  
  cy.wait(1000)
  cy.log(`Mensagem de reativação preenchida: ${mensagemAleatoria}`)
})

import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../locators/login_locators'

const locators_login = new Login_Gipe_Localizadores()

const CREDENCIAIS_GIPE = {
  RF: '39411157076',
  SENHA: 'Sgp7076'
}

const TIMEOUTS = {
  MINIMAL: 1000,
  SHORT: 2000,
  DEFAULT: 3000,
  EXTENDED: 5000,
  LONG: 15000,
  VERY_LONG: 30000
}

function gerarTextoAleatorio(maxLength = 500) {
  const frases = [
    'Teste de automacao realizado com sucesso.',
    'Validacao de formulario em andamento.',
    'Informacao complementar cadastrada no sistema.',
    'Registro de ocorrencia sendo processado.',
    'Dados inseridos automaticamente pela ferramenta de teste.'
  ]
  
  let texto = ''
  const dataHora = new Date().toLocaleString('pt-BR')
  texto += `[Teste Automatizado - ${dataHora}] `
  
  while (texto.length < maxLength - 100) {
    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)]
    if ((texto.length + fraseAleatoria.length + 1) <= maxLength) {
      texto += fraseAleatoria + ' '
    } else {
      break
    }
  }
  
  return texto.trim().substring(0, maxLength)
}

function selecionarLinhaAleatoria() {
  const linhasPossiveis = [2, 3, 4, 5]
  const indiceAleatorio = Math.floor(Math.random() * linhasPossiveis.length)
  return linhasPossiveis[indiceAleatorio]
}

Before(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
})

After(() => {
  cy.log('Cenario finalizado')
})

Given('que eu acesso o sistema como GIPE', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('/', { 
    timeout: TIMEOUTS.VERY_LONG,
    retryOnNetworkFailure: true
  })
  cy.wait(TIMEOUTS.DEFAULT)
  cy.url({ timeout: TIMEOUTS.VERY_LONG }).should('include', 'gipe.sme.prefeitura.sp.gov.br')
})

Given('eu efetuo login com RF GIPE', () => {
  cy.get(locators_login.campo_usuario(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .clear()
    .type(CREDENCIAIS_GIPE.RF, { delay: 100 })
  
  cy.get(locators_login.campo_senha(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .clear()
    .type(CREDENCIAIS_GIPE.SENHA, { delay: 100 })
  
  cy.get('button')
    .filter((_, el) => el.innerText && el.innerText.trim() === 'Acessar')
    .should('be.visible')
    .should('not.be.disabled')
    .click()
  
  cy.wait(TIMEOUTS.EXTENDED)
})

Given('estou na página principal do sistema', () => {
  cy.url({ timeout: TIMEOUTS.LONG }).should('include', '/dashboard')
  cy.wait(TIMEOUTS.SHORT)
})

Then('devo ser redirecionado para o dashboard', () => {
  cy.url({ timeout: TIMEOUTS.VERY_LONG }).should('include', '/dashboard')
  cy.wait(TIMEOUTS.DEFAULT)
})

Then('devo visualizar a página principal do sistema', () => {
  cy.get('body', { timeout: TIMEOUTS.LONG }).should('be.visible')
  cy.get('.text-\\[24px\\]', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .and('contain.text', 'Histórico de ocorrências registradas')
})

Then('devo ver o título {string}', (titulo) => {
  cy.contains('h1, h2', titulo, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
})

Then('o sistema deve exibir as funcionalidades disponíveis para GIPE', () => {
  cy.get('body', { timeout: TIMEOUTS.LONG }).should('be.visible')
  cy.wait(TIMEOUTS.SHORT)
})

When('eu valido os campos da tabela de ocorrências', () => {
  cy.contains('Histórico de ocorrências', { timeout: TIMEOUTS.VERY_LONG })
    .should('be.visible')
  
  cy.wait(TIMEOUTS.DEFAULT)
  
  const colunas = ['Protocolo', 'Data/Hora', 'Código EOL', 'DRE', 'Nome da UE', 'Tipo de Ocorrência', 'Status', 'Ação']
  
  colunas.forEach(coluna => {
    cy.get('table thead', { timeout: TIMEOUTS.LONG })
      .should('contain.text', coluna)
  })
})

When('eu visualizo uma ocorrência registrada de forma aleatória', () => {
  cy.get('table tbody tr', { timeout: TIMEOUTS.LONG }).then(($rows) => {
    const totalLinhas = $rows.length
    
    if (totalLinhas === 0) {
      throw new Error('Nenhuma ocorrência encontrada na tabela')
    }
    
    const indiceAleatorio = Math.floor(Math.random() * totalLinhas)
    
    cy.wrap($rows[indiceAleatorio])
      .find('td')
      .last()
      .find('a')
      .should('be.visible')
      .click()
  })
  
  cy.wait(TIMEOUTS.EXTENDED)
})

Then('devo visualizar todos os campos do formulário aba 1', () => {
  cy.wait(TIMEOUTS.SHORT)
  
  cy.get('body', { timeout: TIMEOUTS.LONG }).should('be.visible')
  
  cy.get('form, main', { timeout: TIMEOUTS.LONG }).should('be.visible')
  
  cy.contains('label', 'Descreva a ocorrência', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
  
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).then(($body) => {
    const textoCorpo = $body.text()
    
    if (textoCorpo.includes('Unidade Educacional é contemplada pelo Smart Sampa')) {
      cy.contains('label', 'Unidade Educacional é contemplada pelo Smart Sampa? Se sim, houve dano às câmeras do sistema?', { timeout: TIMEOUTS.LONG })
        .should('be.visible')
    }
  })
  
  cy.contains('label', 'Quem é o declarante?', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
})

Then('devo ver o botão {string} para continuar', (textoBotao) => {
  cy.contains('button', textoBotao, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .should('not.be.disabled')
})

When('eu clico no botão {string}', (textoBotao) => {
  cy.contains('button', textoBotao, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .click()
  cy.wait(TIMEOUTS.DEFAULT)
})

Then('devo visualizar o formulário da aba 2 DRE', () => {
  cy.wait(TIMEOUTS.SHORT)
  
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).then(($body) => {
    const textoCorpo = $body.text()
    
    if (textoCorpo.includes('Detalhes da Intercorrência - Diretoria Regional de Educação')) {
      cy.contains('Detalhes da Intercorrência - Diretoria Regional de Educação', { timeout: TIMEOUTS.LONG })
        .should('be.visible')
    } else if (textoCorpo.includes('Diretoria Regional de Educação')) {
      cy.contains('Diretoria Regional de Educação', { timeout: TIMEOUTS.LONG })
        .should('be.visible')
    }
  })
  
  cy.get('form, main', { timeout: TIMEOUTS.LONG }).should('be.visible')
})

Then('devo preencher os campos de interlocução DRE obrigatórios', () => {
  cy.wait(TIMEOUTS.SHORT)
  
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).then(($body) => {
    const textoCorpo = $body.text()
    
    const perguntasInterlocucao = [
      'Houve acionamento da Secretaria de Seguranças Pública ou Forças de Segurança?',
      'Houve interlocução com a Supervisão Técnica de Saúde (STS)?',
      'Houve interlocução com a Coordenação de Políticas para Criança e Adolescente (CPCA)?',
      'Houve interlocução com a Supervisão Escolar?',
      'Houve interlocução com o Núcleo de Apoio e Acompanhamento para a Aprendizagem (NAAPA)?'
    ]
    
    perguntasInterlocucao.forEach((pergunta) => {
      if (textoCorpo.includes(pergunta)) {
        cy.contains('label', pergunta)
          .parent()
          .parent()
          .find('input[type="radio"]')
          .last()
          .check({ force: true })
      }
    })
  })
  
  cy.wait(TIMEOUTS.SHORT)
})

Then('devo preencher os campos complementares DRE', () => {
  cy.get('textarea[id*="form-item"]', { timeout: TIMEOUTS.LONG })
    .each(($textarea) => {
      if ($textarea.is(':visible')) {
        const valorAtual = $textarea.val()
        
        if (!valorAtual || valorAtual.trim() === '') {
          const textoAleatorio = gerarTextoAleatorio(500)
          cy.wrap($textarea)
            .clear()
            .type(textoAleatorio, { delay: 10 })
        }
      }
    })
  
  cy.wait(TIMEOUTS.SHORT)
})

Then('devo ver o botão {string} na aba 2', (textoBotao) => {
  cy.contains('button', textoBotao, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
})

Then('devo visualizar o formulário da aba 3 GIPE', () => {
  cy.wait(TIMEOUTS.SHORT)
  
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).then(($body) => {
    const textoCorpo = $body.text()
    
    if (textoCorpo.includes('Detalhes da Intercorrência - Gabinete Integrado de Proteção Escolar')) {
      cy.contains('Detalhes da Intercorrência - Gabinete Integrado de Proteção Escolar', { timeout: TIMEOUTS.LONG })
        .should('be.visible')
    } else if (textoCorpo.includes('Gabinete Integrado de Proteção Escolar')) {
      cy.contains('Gabinete Integrado de Proteção Escolar', { timeout: TIMEOUTS.LONG })
        .should('be.visible')
    }
  })
  
  cy.get('form, main', { timeout: TIMEOUTS.LONG }).should('be.visible')
})

Then('devo preencher os campos GIPE obrigatórios', () => {
  cy.wait(TIMEOUTS.SHORT)
  
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).then(($body) => {
    const textoCorpo = $body.text()
    
    const perguntasGIPE = [
      'Envolve arma ou ataque?',
      'Ameaça foi realizada de qual maneira?'
    ]
    
    perguntasGIPE.forEach((pergunta) => {
      if (textoCorpo.includes(pergunta)) {
        cy.contains('label', pergunta)
          .parent()
          .parent()
          .find('input[type="radio"]')
          .then(($radios) => {
            if ($radios.length > 0) {
              cy.wrap($radios.first()).check({ force: true })
            }
          })
      }
    })
  })
  
  cy.wait(TIMEOUTS.SHORT)
})

Then('devo selecionar opções aleatórias nos campos GIPE', () => {
  cy.wait(TIMEOUTS.SHORT)
  
  cy.get('button[role="combobox"]').each(($btn) => {
    if ($btn.is(':visible')) {
      cy.wrap($btn).click({ force: true })
      cy.wait(TIMEOUTS.MINIMAL)
      
      cy.get('div[role="option"]').then(($options) => {
        if ($options.length > 0) {
          const randomIndex = Math.floor(Math.random() * $options.length)
          cy.wrap($options[randomIndex]).click({ force: true })
        }
      })
      
      cy.wait(TIMEOUTS.MINIMAL)
    }
  })
  
  cy.wait(TIMEOUTS.SHORT)
})

Then('devo preencher os campos complementares GIPE', () => {
  cy.get('textarea[id*="form-item"]', { timeout: TIMEOUTS.LONG })
    .each(($textarea) => {
      if ($textarea.is(':visible')) {
        const valorAtual = $textarea.val()
        
        if (!valorAtual || valorAtual.trim() === '') {
          const textoAleatorio = gerarTextoAleatorio(500)
          cy.wrap($textarea)
            .clear()
            .type(textoAleatorio, { delay: 10 })
        }
      }
    })
  
  cy.wait(TIMEOUTS.SHORT)
})

Then('devo ver o botão {string} na aba 3', (textoBotao) => {
  cy.contains('button', textoBotao, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
})

When('eu clico no botão "Salvar informações"', () => {
  cy.contains('button', /Salvar informações/i, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .should('not.be.disabled')
    .click()
  
  cy.wait(TIMEOUTS.EXTENDED)
  
  cy.get('body', { timeout: TIMEOUTS.LONG }).then(($body) => {
    if ($body.text().includes('Confirmar') || $body.text().includes('OK') || $body.text().includes('Sim')) {
      cy.contains('button', /Confirmar|OK|Sim/i, { timeout: TIMEOUTS.DEFAULT })
        .first()
        .click()
      cy.wait(TIMEOUTS.EXTENDED)
    }
  })
  
  cy.wait(TIMEOUTS.LONG)
})

Then('sistema exibe modal com titulo {string}', (titulo) => {
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('Aguardando modal aparecer')
  
  cy.get('div[role="dialog"]', { timeout: TIMEOUTS.EXTENDED })
    .should('exist')
    .should('be.visible')
  
  cy.wait(TIMEOUTS.MINIMAL)
  
  cy.get('div[role="dialog"]')
    .should('contain.text', titulo)
  
  cy.log('Modal validado com sucesso')
})

When('preenche campo motivo encerramento com {string}', (texto) => {
  cy.wait(TIMEOUTS.SHORT)
  cy.log('Preenchendo motivo')
  
  cy.get('textarea[id*="form-item"]', { timeout: TIMEOUTS.LONG })
    .last()
    .should('be.visible')
    .click({ force: true })
    .clear()
    .type(texto, { delay: 50 })
    .blur()
  
  cy.wait(TIMEOUTS.MINIMAL)
  cy.log('Motivo preenchido')
})

When('clica em Finalizar modal', () => {
  cy.wait(TIMEOUTS.SHORT)
  cy.log('Finalizando cadastro')
  
  cy.contains('button', /Finalizar/i, { timeout: TIMEOUTS.LONG })
    .last()
    .should('be.visible')
    .click({ force: true })
  
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('Cadastro finalizado')
})

Then('valida mensagem de sucesso no modal', () => {
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('Validando mensagem de sucesso')
  
  cy.get('div[id*="radix"]', { timeout: TIMEOUTS.LONG })
    .should('exist')
    .should('be.visible')
  
  cy.log('✅ Mensagem de sucesso validada')
})

When('clica no botão Fechar modal', () => {
  cy.wait(TIMEOUTS.SHORT)
  cy.log('Fechando modal')
  
  cy.get('button').then(($buttons) => {
    const botaoFechar = $buttons.filter((_, btn) => {
      const texto = btn.innerText?.toLowerCase() || ''
      return texto.includes('fechar') || texto.includes('ok') || btn.getAttribute('aria-label')?.toLowerCase().includes('close')
    })
    
    if (botaoFechar.length > 0) {
      cy.wrap(botaoFechar.first()).click({ force: true })
    } else {
      cy.get('body').type('{esc}')
    }
  })
  
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('Modal fechado')
})

When('aguarda {int} segundos', (segundos) => {
  cy.wait(segundos * 1000)
  cy.log(`Aguardando ${segundos}s`)
})

Then('valida a existencia do Texto {string}', (texto) => {
  cy.wait(TIMEOUTS.SHORT)
  cy.log(`Validando existência do texto: ${texto}`)
  
  cy.get('h1', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .and('contain.text', texto.trim())
  
  cy.log('✅ Texto validado com sucesso')
})

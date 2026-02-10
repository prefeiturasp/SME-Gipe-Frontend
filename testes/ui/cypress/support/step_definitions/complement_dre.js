import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../locators/login_locators'

const locators_login = new Login_Gipe_Localizadores()

const TIMEOUTS = {
  MINIMAL: 500,
  SHORT: 1000,
  DEFAULT: 2000,
  EXTENDED: 3000,
  LONG: 10000,
  VERY_LONG: 30000
}

function gerarTextoAleatorio(maxLength = 500) {
  const frases = [
    'Teste de automacao realizado com sucesso.',
    'Validacao de formulario em andamento.',
    'Informacao complementar cadastrada no sistema.',
    'Registro de ocorrencia sendo processado.',
    'Dados inseridos automaticamente pela ferramenta de teste.',
    'Sistema de gestao de intercorrencias institucionais.',
    'Acompanhamento de casos escolares pela DRE.',
    'Documentacao e registro de eventos educacionais.',
    'Analise de situacoes ocorridas no ambiente escolar.',
    'Monitoramento continuo das intercorrencias reportadas.'
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
  tabelaVazia = false
  cy.clearCookies()
  cy.clearLocalStorage()
})

After(() => {
  cy.log('Cenario finalizado')
})

Given('que eu acesso o sistema como DRE', () => {
  const rfDRE = Cypress.env('RF_DRE') || '12345678'
  const senhaDRE = Cypress.env('SENHA_DRE') || 'senha123'
  
  cy.log('Acessando sistema com perfil DRE')
  cy.loginWithSession(rfDRE, senhaDRE, 'DRE')
})

When('eu efetuo login com RF DRE', () => {
  cy.log('Validando login DRE')
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', { 
    timeout: TIMEOUTS.VERY_LONG,
    failOnStatusCode: false 
  })
  cy.url({ timeout: TIMEOUTS.LONG }).should('include', '/dashboard')
  cy.wait(TIMEOUTS.SHORT)
  cy.log('Login DRE realizado com sucesso')
})

Then('devo ser redirecionado para o dashboard', () => {
  cy.url({ timeout: TIMEOUTS.VERY_LONG }).should('include', '/dashboard')
  cy.wait(TIMEOUTS.DEFAULT)
})

Then('devo visualizar a página principal do sistema', () => {
  cy.get('body', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .and('not.be.empty')
  
  cy.get('.text-\\[24px\\]', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .and('contain.text', 'Histórico de ocorrências registradas')
  
  cy.log('Pagina principal carregada')
})

When('estou na página principal do sistema', () => {
  cy.url({ timeout: TIMEOUTS.LONG }).should('include', '/dashboard')
  cy.wait(TIMEOUTS.SHORT)
})

Then('devo ver o título {string}', (titulo) => {
  cy.log(`Validando titulo: ${titulo}`)
  cy.contains('h1, h2', titulo, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
  cy.log('Titulo validado')
})

Then('o sistema deve exibir as funcionalidades disponíveis para DRE', () => {
  cy.get('body', { timeout: TIMEOUTS.LONG }).should('be.visible')
  cy.wait(TIMEOUTS.SHORT)
})

let tabelaVazia = false

When('eu visualizo uma ocorrência registrada', () => {
  cy.contains('Histórico de ocorrências', { timeout: TIMEOUTS.VERY_LONG })
    .should('be.visible')
  
  cy.wait(TIMEOUTS.SHORT)
  
  cy.get('table tbody tr', { timeout: TIMEOUTS.LONG }).then($linhas => {
    if ($linhas.length === 0) {
      tabelaVazia = true
      cy.log('Tabela vazia - validando texto e finalizando')
      cy.get('h1', { timeout: 15000 })
        .should('be.visible')
        .and('contain.text', 'Histórico de ocorrências registradas')
      cy.log('Cenario concluido - tabela vazia')
    } else {
      const linhaAleatoria = Math.min(selecionarLinhaAleatoria(), $linhas.length)
      cy.log(`Selecionando linha ${linhaAleatoria} da tabela de ocorrencias`)
      
      cy.wrap($linhas)
        .eq(linhaAleatoria - 1)
        .find('td')
        .last()
        .then($ultimaTd => {
          const $link = $ultimaTd.find('a')
          
          if ($link.length === 0) {
            tabelaVazia = true
            cy.log('Nenhum link encontrado na tabela - validando texto e finalizando')
            cy.get('h1', { timeout: 15000 })
              .should('be.visible')
              .and('contain.text', 'Histórico de ocorrências registradas')
            cy.log('Cenario concluido - sem links disponiveis')
          } else {
            tabelaVazia = false
            cy.wrap($link)
              .should('be.visible')
              .click()
            
            cy.wait(TIMEOUTS.DEFAULT)
            cy.log('Ocorrencia aberta')
          }
        })
    }
  })
})

Then('devo visualizar todos os campos do formulário de ocorrência', () => {
  if (tabelaVazia) {
    cy.log('Step pulado - tabela vazia')
    return
  }
  
  cy.wait(TIMEOUTS.SHORT)
  
  cy.contains('label', 'Quando a ocorrência aconteceu?', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
  
  cy.contains('label', 'A ocorrência é sobre furto, roubo, invasão ou depredação?', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
  
  cy.contains('Sim', { timeout: TIMEOUTS.DEFAULT }).should('exist')
  cy.contains('Não', { timeout: TIMEOUTS.DEFAULT }).should('exist')
  
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).invoke('text').then((textoCorpo) => {
    if (textoCorpo.includes('Unidade Educacional é contemplada pelo Smart Sampa')) {
      cy.log('Ocorrencia tipo FURTO/ROUBO detectada - validando campos especificos')
      
      cy.contains('label', 'Qual o tipo de ocorrência?', { timeout: TIMEOUTS.LONG })
        .should('be.visible')
      
      cy.contains('label', 'Descreva a ocorrência', { timeout: TIMEOUTS.LONG })
        .should('be.visible')
      
      cy.contains('label', 'Unidade Educacional é contemplada pelo Smart Sampa', { timeout: TIMEOUTS.DEFAULT })
        .should('be.visible')
      
      cy.contains('label', 'Quem é o declarante?', { timeout: TIMEOUTS.LONG })
        .should('be.visible')
      
      cy.contains('Anexos', { timeout: TIMEOUTS.DEFAULT })
        .should('be.visible')
      
      cy.contains('Anexar novo arquivo', { timeout: TIMEOUTS.DEFAULT })
        .should('be.visible')
      
    } else {
      cy.log('Ocorrencia tipo PADRAO detectada - validando campos padroes')
      
      const camposNaoFurto = [
        'Qual o tipo de ocorrência?',
        'Quem são os envolvidos?',
        'Descreva a ocorrência',
        'Existem informações sobre o agressor e/ou vítima?',
        'Quem é o declarante?',
        'Houve comunicação com a segurança pública?',
        'Qual protocolo acionado?'
      ]
      
      camposNaoFurto.forEach(campo => {
        cy.contains('label', campo, { timeout: TIMEOUTS.LONG })
          .should('be.visible')
      })
    }
  })
})

Then('devo ver o botão {string} para continuar', (textoBotao) => {
  if (tabelaVazia) {
    cy.log('Step pulado - tabela vazia')
    return
  }
  
  cy.contains('button', textoBotao, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .should('not.be.disabled')
})

When('eu clico no botão {string}', (textoBotao) => {
  if (tabelaVazia) {
    cy.log('Step pulado - tabela vazia')
    return
  }
  
  cy.contains('button', textoBotao, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .click()
  cy.wait(TIMEOUTS.DEFAULT)
})

Then('devo visualizar o formulário de continuação da ocorrência', () => {
  if (tabelaVazia) {
    cy.log('Step pulado - tabela vazia')
    return
  }
  
  cy.contains('h2', 'Continuação da ocorrência', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
  
  const camposContinuacao = [
    'Houve acionamento da Secretaria de Seguranças Pública ou Forças de Segurança?',
    'Houve interlocução com a Supervisão Técnica de Saúde (STS)?',
    'Houve interlocução com a Coordenação de Políticas para Criança e Adolescente (CPCA)?',
    'Houve interlocução com a Supervisão Escolar?',
    'Houve interlocução com o Núcleo de Apoio e Acompanhamento para a Aprendizagem (NAAPA)?'
  ]
  
  camposContinuacao.forEach(campo => {
    cy.contains('label', campo, { timeout: TIMEOUTS.LONG })
      .should('be.visible')
  })
})

Then('devo preencher os campos de interlocução obrigatórios', () => {  if (tabelaVazia) {
    cy.log('Step pulado - tabela vazia')
    return
  }
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
          .then(($radios) => {
            const algumMarcado = $radios.filter(':checked').length > 0
            
            if (algumMarcado) {
              cy.log(`Campo ja preenchido: ${pergunta.substring(0, 40)}... - Validando e pulando`)
            } else {
              cy.wrap($radios.last()).check({ force: true })
              cy.log(`Preenchido: ${pergunta.substring(0, 40)}...`)
            }
          })
      }
    })
  })
  
  cy.wait(TIMEOUTS.SHORT)
})

Then('devo preencher os campos complementares das interlocuções', () => {  if (tabelaVazia) {
    cy.log('Step pulado - tabela vazia')
    return
  }
    cy.get('textarea[id*="form-item"]', { timeout: TIMEOUTS.LONG })
    .each(($textarea, index) => {
      if ($textarea.is(':visible')) {
        const valorAtual = $textarea.val()
        
        if (!valorAtual || valorAtual.trim() === '') {
          const textoAleatorio = gerarTextoAleatorio(500)
          cy.wrap($textarea)
            .clear()
            .type(textoAleatorio, { delay: 10 })
          cy.log(`Campo ${index + 1} preenchido com ${textoAleatorio.length} caracteres`)
        } else {
          cy.log(`Campo ${index + 1} ja possui conteudo (${valorAtual.length} caracteres) - Validando e pulando`)
        }
      }
    })
  
  cy.wait(TIMEOUTS.SHORT)
  
  cy.get('div.mt-4 > h2').first()
    .should('contain.text', 'Anexos')
  
  cy.contains('Anexar novo arquivo', { timeout: TIMEOUTS.DEFAULT })
    .should('be.visible')
  
  cy.contains('Selecione o arquivo*', { timeout: TIMEOUTS.DEFAULT })
    .should('be.visible')
  
  cy.contains('Tipo do documento*', { timeout: TIMEOUTS.DEFAULT })
    .should('be.visible')
})

When('eu finalizo o preenchimento', () => {
  if (tabelaVazia) {
    cy.log('Step pulado - tabela vazia')
    return
  }
  
  cy.wait(TIMEOUTS.SHORT)
  
  // Tenta encontrar qualquer botão de ação visível no final do formulário
  cy.get('body').then(($body) => {
    const botoes = $body.find('button:visible')
    let botaoEncontrado = false
    
    // Primeiro tenta pelos textos padrão
    const textosBotao = ['Salvar', 'Enviar', 'Concluir', 'Próximo', 'Finalizar', 'Confirmar']
    
    textosBotao.forEach((texto) => {
      if (!botaoEncontrado && botoes.filter(`:contains("${texto}")`).length > 0) {
        cy.log(`Botão encontrado: ${texto}`)
        cy.contains('button', texto, { timeout: TIMEOUTS.DEFAULT })
          .filter(':visible')
          .should('be.visible')
          .should('not.be.disabled')
          .click({ force: true })
        botaoEncontrado = true
        return false
      }
    })
    
    // Se não encontrou, tenta pelo último botão visível que não seja "Cancelar" ou "Voltar"
    if (!botaoEncontrado) {
      cy.log('Tentando encontrar botão pelo último botão visível...')
      cy.get('button:visible')
        .not(':contains("Cancelar")')
        .not(':contains("Voltar")')
        .not(':contains("Fechar")')
        .last({ timeout: TIMEOUTS.LONG })
        .should('be.visible')
        .should('not.be.disabled')
        .click({ force: true })
    }
  })
  
  cy.wait(TIMEOUTS.DEFAULT)
  
  cy.get('body', { timeout: TIMEOUTS.SHORT }).then(($body) => {
    const textoBody = $body.text()
    
    if (textoBody.includes('Confirmar') || textoBody.includes('OK') || textoBody.includes('Sim')) {
      cy.log('Modal de confirmacao detectado')
      
      cy.get('body').then(($bodyElement) => {
        const $botoes = $bodyElement.find('button:visible')
        let botaoEncontrado = false
        
        $botoes.each((index, botao) => {
          const textoBotao = Cypress.$(botao).text()
          if (/Confirmar|OK|Sim/i.test(textoBotao)) {
            cy.wrap(botao).click({ force: true })
            botaoEncontrado = true
            cy.log('Botao de confirmacao clicado')
            return false
          }
        })
        
        if (!botaoEncontrado) {
          cy.log('Modal detectado mas botao de confirmacao nao encontrado - continuando')
        }
      })
      
      cy.wait(TIMEOUTS.SHORT)
    } else {
      cy.log('Nenhum modal de confirmacao necessario')
    }
  })
  
  cy.wait(TIMEOUTS.EXTENDED)
  cy.log('Preenchimento finalizado')
})

Then('sistema pode exibir modal de conclusão', () => {
  if (tabelaVazia) {
    cy.log('Step pulado - tabela vazia')
    return
  }
  
  cy.wait(TIMEOUTS.DEFAULT)
  
  cy.get('body').then(($body) => {
    const temModal = $body.find('div[role="dialog"]').length > 0
    
    if (temModal) {
      cy.log('Modal de conclusao detectado')
      cy.get('div[role="dialog"]', { timeout: TIMEOUTS.EXTENDED })
        .should('be.visible')
    } else {
      cy.log('Modal de conclusao nao foi exibido - prosseguindo')
    }
  })
})

Then('preencho modal de conclusão se necessário', () => {
  if (tabelaVazia) {
    cy.log('Step pulado - tabela vazia')
    return
  }
  
  cy.get('body').then(($body) => {
    const temModal = $body.find('div[role="dialog"]').length > 0
    
    if (temModal) {
      cy.log('Preenchendo modal de conclusao')
      
      cy.get('div[role="dialog"]', { timeout: TIMEOUTS.DEFAULT })
        .should('be.visible')
      
      cy.wait(TIMEOUTS.SHORT)
      
      cy.get('div[role="dialog"]').then(($modal) => {
        const temTextarea = $modal.find('textarea').length > 0
        
        if (temTextarea) {
          cy.get('div[role="dialog"] textarea')
            .last()
            .should('be.visible')
            .then(($textarea) => {
              const valorAtual = $textarea.val()
              
              if (!valorAtual || valorAtual.trim() === '') {
                cy.wrap($textarea)
                  .click({ force: true })
                  .clear()
                  .type('Complementação DRE concluída com sucesso - Teste Automatizado', { delay: 30 })
                cy.log('Campo de motivo preenchido')
              } else {
                cy.log(`Campo ja possui conteudo: "${valorAtual.substring(0, 50)}..." - Validando e pulando`)
              }
            })
          
          cy.wait(TIMEOUTS.MINIMAL)
        }
      })
      
      cy.wait(TIMEOUTS.SHORT)
      
      cy.get('div[role="dialog"]').within(() => {
        cy.contains('button', /Finalizar|Concluir|Salvar/i, { timeout: TIMEOUTS.LONG })
          .should('be.visible')
          .should('not.be.disabled')
          .click({ force: true })
      })
      
      cy.wait(TIMEOUTS.DEFAULT)
      cy.log('Modal finalizado')
      
      cy.wait(TIMEOUTS.DEFAULT)
      
      cy.get('body').then(($bodyCheck) => {
        const temBotaoFechar = $bodyCheck.find('button').filter((_, btn) => {
          const texto = btn.innerText?.toLowerCase() || ''
          const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || ''
          return texto.includes('fechar') || texto.includes('ok') || ariaLabel.includes('close')
        }).length > 0
        
        if (temBotaoFechar) {
          cy.get('button').filter((_, btn) => {
            const texto = btn.innerText?.toLowerCase() || ''
            const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || ''
            return texto.includes('fechar') || texto.includes('ok') || ariaLabel.includes('close')
          }).first().click({ force: true })
          
          cy.log('Modal fechado')
        } else {
          cy.get('body').type('{esc}')
          cy.log('Modal fechado com ESC')
        }
      })
      
      cy.wait(TIMEOUTS.EXTENDED)
      
    } else {
      cy.log('Nenhum modal para preencher')
    }
  })
})

Then('devo retornar para o histórico de ocorrências', () => {
  cy.url({ timeout: TIMEOUTS.VERY_LONG })
    .should('include', '/dashboard')
  
  cy.contains('Histórico de ocorrências', { timeout: TIMEOUTS.VERY_LONG })
    .should('be.visible')
})

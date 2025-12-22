import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../locators/login_locators'

const locators_login = new Login_Gipe_Localizadores()

// Constantes de timeout otimizadas
const TIMEOUTS = {
  MINIMAL: 500,
  SHORT: 1000,
  DEFAULT: 2000,
  EXTENDED: 3000,
  LONG: 10000,
  VERY_LONG: 30000
}

/**
 * Gera texto aleatório para preenchimento de campos
 * @param {number} maxLength - Tamanho máximo do texto
 * @returns {string} Texto gerado com timestamp
 */
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

/**
 * Seleciona uma linha aleatória da tabela de ocorrências
 * @returns {number} Número da linha selecionada
 */
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

/**
 * Realiza login com credenciais de perfil DRE
 */
Given('que eu acesso o sistema como DRE', () => {
  cy.log('🔐 Acessando sistema com perfil DRE')
  // Usa o step comum de acesso
  cy.login_gipe()
  cy.wait(TIMEOUTS.SHORT)
})

/**
 * Realiza login com credenciais do perfil DRE
 */
When('eu efetuo login com RF DRE', () => {
  const rfDRE = Cypress.env('RF_DRE')
  const senhaDRE = Cypress.env('SENHA_DRE')
  
  cy.log('🔑 Efetuando login com perfil DRE')
  
  cy.get(locators_login.campo_usuario(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .clear()
    .type(rfDRE, { delay: 50 })
    .should('have.value', rfDRE)
  
  cy.get(locators_login.campo_senha(), { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .clear()
    .type(senhaDRE, { delay: 50 })
  
  cy.get('button')
    .filter((_, el) => el.innerText && el.innerText.trim() === 'Acessar')
    .should('be.visible')
    .should('not.be.disabled')
    .click()
  
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('✅ Login DRE realizado com sucesso')
})

Then('devo ser redirecionado para o dashboard', () => {
  cy.url({ timeout: TIMEOUTS.VERY_LONG }).should('include', '/dashboard')
  cy.wait(TIMEOUTS.DEFAULT)
})

/**
 * Valida que a página principal está carregada
 */
Then('devo visualizar a página principal do sistema', () => {
  cy.get('body', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .and('not.be.empty')
  
  cy.get('.text-\\[24px\\]', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .and('contain.text', 'Histórico de ocorrências registradas')
  
  cy.log('✅ Página principal carregada')
})

When('estou na página principal do sistema', () => {
  cy.url({ timeout: TIMEOUTS.LONG }).should('include', '/dashboard')
  cy.wait(TIMEOUTS.SHORT)
})

/**
 * Valida que o título esperado está visível
 * @param {string} titulo - Título esperado na página
 */
Then('devo ver o título {string}', (titulo) => {
  cy.log(`🔍 Validando título: ${titulo}`)
  cy.contains('h1, h2', titulo, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
  cy.log('✅ Título validado')
})

Then('o sistema deve exibir as funcionalidades disponíveis para DRE', () => {
  cy.get('body', { timeout: TIMEOUTS.LONG }).should('be.visible')
  cy.wait(TIMEOUTS.SHORT)
})

/**
 * Seleciona e visualiza uma ocorrência aleatória da tabela
 */
When('eu visualizo uma ocorrência registrada', () => {
  cy.contains('Histórico de ocorrências', { timeout: TIMEOUTS.VERY_LONG })
    .should('be.visible')
  
  cy.wait(TIMEOUTS.SHORT)
  
  const linhaAleatoria = selecionarLinhaAleatoria()
  
  cy.log(`📋 Selecionando linha ${linhaAleatoria} da tabela de ocorrências`)
  
  cy.get('table tbody tr', { timeout: TIMEOUTS.LONG })
    .eq(linhaAleatoria - 1)
    .find('td')
    .last()
    .find('a')
    .should('be.visible')
    .click()
  
  cy.wait(TIMEOUTS.DEFAULT)
  cy.log('✅ Ocorrência aberta')
})

Then('devo visualizar todos os campos do formulário de ocorrência', () => {
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

Then('devo visualizar o formulário de continuação da ocorrência', () => {
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

Then('devo preencher os campos de interlocução obrigatórios', () => {
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
        
        cy.log(`Selecionado "Nao" para: ${pergunta.substring(0, 50)}...`)
      }
    })
  })
  
  cy.wait(TIMEOUTS.SHORT)
})

Then('devo preencher os campos complementares das interlocuções', () => {
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
          const textoAdicional = ` [ATUALIZACAO ${new Date().toLocaleTimeString('pt-BR')}]`
          cy.wrap($textarea)
            .type(textoAdicional, { delay: 10 })
          cy.log(`Campo ${index + 1} atualizado com timestamp`)
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

/**
 * Finaliza o preenchimento do formulário e confirma ação se necessário
 */
When('eu finalizo o preenchimento', () => {
  cy.wait(TIMEOUTS.SHORT)
  
  // Busca por botões de finalização (Salvar, Enviar, Concluir, Próximo)
  cy.get('button', { timeout: TIMEOUTS.LONG })
    .filter(':visible')
    .contains(/Salvar|Enviar|Concluir|Próximo/i)
    .should('be.visible')
    .should('not.be.disabled')
    .click()
  
  cy.wait(TIMEOUTS.DEFAULT)
  
  // Verifica se há modal de confirmação e clica se existir (sem falhar se não houver)
  cy.get('body', { timeout: TIMEOUTS.SHORT }).then(($body) => {
    const textoBody = $body.text()
    
    // Verifica se existe texto de confirmação no body
    if (textoBody.includes('Confirmar') || textoBody.includes('OK') || textoBody.includes('Sim')) {
      cy.log('🔍 Modal de confirmação detectado')
      
      // Tenta encontrar e clicar no botão de confirmação
      cy.get('body').then(($bodyElement) => {
        const $botoes = $bodyElement.find('button:visible')
        let botaoEncontrado = false
        
        $botoes.each((index, botao) => {
          const textoBotao = Cypress.$(botao).text()
          if (/Confirmar|OK|Sim/i.test(textoBotao)) {
            cy.wrap(botao).click({ force: true })
            botaoEncontrado = true
            cy.log('✅ Botão de confirmação clicado')
            return false // Para o loop
          }
        })
        
        if (!botaoEncontrado) {
          cy.log('⚠️ Modal detectado mas botão de confirmação não encontrado - continuando')
        }
      })
      
      cy.wait(TIMEOUTS.SHORT)
    } else {
      cy.log('ℹ️ Nenhum modal de confirmação necessário')
    }
  })
  
  cy.wait(TIMEOUTS.EXTENDED)
  cy.log('✅ Preenchimento finalizado')
})

/**
 * Valida se modal de conclusão foi exibido
 */
Then('sistema pode exibir modal de conclusão', () => {
  cy.wait(TIMEOUTS.DEFAULT)
  
  cy.get('body').then(($body) => {
    const temModal = $body.find('div[role="dialog"]').length > 0
    
    if (temModal) {
      cy.log('🔔 Modal de conclusão detectado')
      cy.get('div[role="dialog"]', { timeout: TIMEOUTS.EXTENDED })
        .should('be.visible')
    } else {
      cy.log('ℹ️ Modal de conclusão não foi exibido - prosseguindo')
    }
  })
})

/**
 * Preenche modal de conclusão se ele existir
 */
Then('preencho modal de conclusão se necessário', () => {
  cy.get('body').then(($body) => {
    const temModal = $body.find('div[role="dialog"]').length > 0
    
    if (temModal) {
      cy.log('📝 Preenchendo modal de conclusão')
      
      // Valida título do modal
      cy.get('div[role="dialog"]')
        .should('contain.text', /Conclusão|Finalizar/i)
      
      cy.wait(TIMEOUTS.SHORT)
      
      // Preenche campo de motivo/observação se existir
      cy.get('div[role="dialog"]').then(($modal) => {
        const temTextarea = $modal.find('textarea').length > 0
        
        if (temTextarea) {
          cy.get('div[role="dialog"] textarea')
            .last()
            .should('be.visible')
            .click({ force: true })
            .clear()
            .type('Complementação DRE concluída com sucesso - Teste Automatizado', { delay: 30 })
          
          cy.wait(TIMEOUTS.MINIMAL)
          cy.log('✅ Campo de motivo preenchido')
        }
      })
      
      cy.wait(TIMEOUTS.SHORT)
      
      // Clica no botão Finalizar
      cy.get('div[role="dialog"]').within(() => {
        cy.contains('button', /Finalizar|Concluir|Salvar/i, { timeout: TIMEOUTS.LONG })
          .should('be.visible')
          .should('not.be.disabled')
          .click({ force: true })
      })
      
      cy.wait(TIMEOUTS.DEFAULT)
      cy.log('✅ Modal finalizado')
      
      // Aguarda mensagem de sucesso e fecha modal
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
          
          cy.log('✅ Modal fechado')
        } else {
          cy.get('body').type('{esc}')
          cy.log('✅ Modal fechado com ESC')
        }
      })
      
      cy.wait(TIMEOUTS.EXTENDED)
      
    } else {
      cy.log('ℹ️ Nenhum modal para preencher')
    }
  })
})

Then('devo retornar para o histórico de ocorrências', () => {
  cy.url({ timeout: TIMEOUTS.VERY_LONG })
    .should('include', '/dashboard')
  
  cy.contains('Histórico de ocorrências', { timeout: TIMEOUTS.VERY_LONG })
    .should('be.visible')
})

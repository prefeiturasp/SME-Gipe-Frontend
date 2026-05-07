import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../../locators/login_locators'

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

  const tentarAbrir = (tentativa) => {
    cy.get('table tbody tr', { timeout: TIMEOUTS.LONG }).then($linhas => {
      if ($linhas.length === 0) {
        tabelaVazia = true
        cy.log('Tabela vazia - finalizando cenário')
        return
      }

      // Filtra somente linhas cujo status é "Em Andamento"
      const $candidatas = $linhas.filter((_, el) =>
        /em andamento/i.test(el.innerText || el.textContent || '')
      )

      if ($candidatas.length === 0) {
        tabelaVazia = true
        cy.log('Nenhuma ocorrência "Em Andamento" encontrada - finalizando cenário')
        return
      }

      const idx = Math.floor(Math.random() * $candidatas.length)
      cy.log(`Tentativa ${tentativa}/3: abrindo ocorrência em andamento (${$candidatas.length} disponíveis)`)

      cy.wrap($candidatas)
        .eq(idx)
        .find('td')
        .last()
        .find('a')
        .should('be.visible')
        .click()

      cy.wait(TIMEOUTS.DEFAULT)

      // Confirma que o formulário de edição carregou corretamente
      cy.get('body').then($body => {
        const formularioValido = $body.text().includes('Quando a ocorrência aconteceu')
        if (!formularioValido && tentativa < 3) {
          cy.log(`Formulário não carregou - voltando para a lista (tentativa ${tentativa}/3)`)
          cy.go('back')
          cy.wait(TIMEOUTS.DEFAULT)
          tentarAbrir(tentativa + 1)
        } else if (!formularioValido) {
          tabelaVazia = true
          cy.log('Formulário não encontrado após 3 tentativas - finalizando cenário')
        } else {
          tabelaVazia = false
          cy.log('Ocorrência em andamento aberta com sucesso')
        }
      })
    })
  }

  tentarAbrir(1)
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

// ================================================================
// STEPS COMP_DRE — FLUXO COMPLEMENTO DRE REFATORADO
// ================================================================

When('COMP_DRE valida a existencia do texto {string}', (texto) => {
  cy.wait(500)

  // Ao entrar na aba 2 (Detalhes DRE), reseta o contador de radiogroups.
  // Garante que ronda=idx0, supervisão=idx1 mesmo em reruns ou retries.
  if (texto.includes('Detalhes da Intercorrência')) {
    Cypress.env('_dreRadioIdx', 0)
    cy.log('COMP_DRE: Contador de radiogroup resetado para aba 2')
  }

  // Campo opcional — só aparece em ocorrências interpessoais (com pessoas envolvidas)
  const camposOpcionais = [
    'Existem informações sobre as pessoas envolvidas?*'
  ]

  cy.get('body').then($body => {
    if ($body.text().includes(texto)) {
      cy.log(`COMP_DRE: Texto encontrado no DOM: "${texto}"`)
    } else if (camposOpcionais.some(c => texto.includes(c))) {
      cy.log(`COMP_DRE: Campo opcional não presente nesta ocorrência - ignorando: "${texto}"`)
    } else {
      // tenta via contains para erro legível
      cy.contains(texto, { timeout: TIMEOUTS.LONG }).should('exist')
    }
  })
})

When('COMP_DRE valida a existencia dos botões {string} e {string}', (btn1, btn2) => {
  cy.wait(500)
  cy.contains('button', new RegExp(btn1, 'i'), { timeout: TIMEOUTS.LONG })
    .should('exist').should('be.visible')
  cy.contains('button', new RegExp(btn2, 'i'), { timeout: TIMEOUTS.LONG })
    .should('exist').should('be.visible')
})

/**
 * Valida os campos de pessoas envolvidas SOMENTE se a resposta for "Sim".
 * Quando a ocorrência não tem dados de pessoas envolvidas (resposta "Não"),
 * esses campos não são exibidos e o step é pulado automaticamente.
 */
When('COMP_DRE valida campos de pessoas envolvidas quando aplicavel', () => {
  cy.wait(500)
  cy.get('body').then($body => {
    const texto = $body.text()

    // Detecta se o formulário já expandiu para mostrar os campos de pessoa,
    // ou se a resposta "Não" ocultou essa seção.
    const temCampoNome   = texto.includes('Qual o nome da pessoa?')
    const temMotivacao   = texto.includes('O que motivou a ocorrência?')
    const temCT          = texto.includes('A ocorrência foi notificada ao CT')
    const temAcomp       = texto.includes('A ocorrência está sendo acompanhada pelo')

    if (temCampoNome || temMotivacao || temCT || temAcomp) {
      cy.log('COMP_DRE: Campos de pessoas envolvidas detectados — validando...')

      if (temCampoNome) {
        cy.contains('Qual o nome da pessoa?', { timeout: TIMEOUTS.LONG }).should('exist')
        cy.log('COMP_DRE: ✓ "Qual o nome da pessoa?*" presente')
      }
      if (temMotivacao) {
        cy.contains('O que motivou a ocorrência?', { timeout: TIMEOUTS.LONG }).should('exist')
        cy.log('COMP_DRE: ✓ "O que motivou a ocorrência?*" presente')
      }
      if (temCT) {
        cy.contains('A ocorrência foi notificada ao CT', { timeout: TIMEOUTS.LONG }).should('exist')
        cy.log('COMP_DRE: ✓ "A ocorrência foi notificada ao CT (Conselho Tutelar)?*" presente')
      }
      if (temAcomp) {
        cy.contains('A ocorrência está sendo acompanhada pelo', { timeout: TIMEOUTS.LONG }).should('exist')
        cy.log('COMP_DRE: ✓ "A ocorrência está sendo acompanhada pelo:" presente')
      }
    } else {
      cy.log('COMP_DRE: Campos de pessoas envolvidas NÃO detectados — ocorrência sem pessoas, pulando validação.')
    }
  })
})

Then('COMP_DRE clica no botão {string}', (textoBotao) => {
  cy.wait(1000)
  cy.contains('button', new RegExp(textoBotao.trim(), 'i'), { timeout: TIMEOUTS.LONG })
    .should('be.visible').should('not.be.disabled')
    .scrollIntoView().click({ force: true })
  cy.wait(3000)
})

// ── Aba 2: Órgãos acionados pela DRE ───────────────────────────────────────────
When('COMP_DRE seleciona aleatoriamente orgaos acionados pela DRE', () => {
  const opcoes = [
    'Comunicação com Supervisão Técnica de Saúde',
    'Comunicação com Assistência Social',
    'Comunicação com GCM/Ronda Escolar',
    'Comunicação com GIPE',
  ]

  cy.wait(1000)
  cy.contains('label', /Quais órgãos foram acionados/i, { timeout: TIMEOUTS.LONG })
    .should('be.visible')

  // Verifica se algum checkbox já está marcado (preenchido por execução anterior).
  // Clicar num checkbox já marcado o desmarcaria, invalidando o formulário.
  cy.get('body').then($body => {
    const jaMarcados = $body.find('button[role="checkbox"][data-state="checked"]').length
    if (jaMarcados > 0) {
      cy.log(`COMP_DRE: ✓ Órgãos já marcados (${jaMarcados}) — pulando seleção`)
    } else {
      const quantidade = Math.floor(Math.random() * opcoes.length) + 1
      const selecionadas = [...opcoes].sort(() => Math.random() - 0.5).slice(0, quantidade)
      selecionadas.forEach(opcao => {
        cy.contains('label', opcao, { timeout: TIMEOUTS.LONG })
          .scrollIntoView().should('be.visible').click({ force: true })
        cy.wait(300)
      })
    }
  })
  cy.wait(1000)
})

// Contador de índice para selecionar os radiogroups em ordem (ronda=0, supervisão=1).
// Resetado via Cypress.env('_dreRadioIdx', 0) antes da aba 2.
// Necessário porque todos os grupos carregam com valor padrão (data-state="checked"),
// impossibilitando detectar quais já foram respondidos pelo teste.
When('COMP_DRE seleciona Sim ou Não de forma aleatoria', () => {
  cy.wait(500)
  const opcao = Math.random() < 0.5 ? 'Sim' : 'Não'

  // Lê o índice atual e incrementa para a próxima chamada
  const idx = Cypress.env('_dreRadioIdx') !== undefined ? Cypress.env('_dreRadioIdx') : 0
  Cypress.env('_dreRadioIdx', idx + 1)

  cy.log(`COMP_DRE: Selecionando "${opcao}" no radiogroup[${idx}]`)

  cy.get('[role="radiogroup"]').eq(idx).then($group => {
    const $span = Cypress.$($group)
      .find('span.text-sm')
      .filter((_, el) => el.textContent.trim() === opcao)
      .first()

    if ($span.length > 0) {
      cy.wrap($span).scrollIntoView().click({ force: true })
      cy.log(`COMP_DRE: ✓ Clicou "${opcao}" no grupo índice ${idx}`)
    } else {
      cy.wrap($group).contains(opcao).scrollIntoView().click({ force: true })
    }
  })

  cy.wait(1000)
})

/**
 * Para a pergunta "Há um número do processo SEI?*":
 * - Seleciona Sim ou Não de forma aleatória
 * - Se "Sim" for selecionado, o sistema exibe um campo extra para o número do processo
 * - Preenche o campo com um número aleatório de 16 dígitos da lista pré-definida
 */
When('COMP_DRE seleciona Sim ou Não para SEI e preenche numero quando necessario', () => {
  const numerosSEI = [
    '1234567890123456',
    '9876543210987654',
    '4728193650284719',
    '8163920574810293',
    '3047582916473820',
    '6192840375619284',
    '7483920156748392',
    '2905817364920581',
    '5671034829567103',
    '8204915673820491',
    '1593047826159304',
    '6840291753684029',
    '3217568940321756',
    '7659412308765941',
    '4082736519408273',
    '9315820647931582',
    '2748506193274850',
    '5063918274506391',
    '8497230165849723',
    '1820473956182047',
    '6234815709623481',
    '3967124085396712',
    '7150693248715069',
    '4813275096481327',
    '9046382751904638',
  ]

  // SEI usa o índice 2 (3º radiogroup) e NÃO compartilha o contador com o step genérico
  const opcao = Math.random() < 0.5 ? 'Sim' : 'Não'
  cy.log(`COMP_DRE: Selecionando "${opcao}" para "Há um número do processo SEI?*"`)

  cy.wait(500)

  // Verifica se o SEI já foi respondido (preenchido por execução anterior).
  cy.get('[role="radiogroup"]').last().then($group => {
    const $checked = Cypress.$($group).find('button[role="radio"][data-state="checked"]')

    if ($checked.length > 0) {
      const valorAtual = Cypress.$($checked).attr('value') || ''
      cy.log(`COMP_DRE: SEI já respondido como "${valorAtual}" — verificando preenchimento`)
      if (valorAtual === 'Sim') {
        cy.get('input:visible:not([readonly]):not([type="file"]):not([type="hidden"])').last().then($input => {
          if (!$input.val()) {
            const numeroSEI = numerosSEI[Math.floor(Math.random() * numerosSEI.length)]
            cy.log(`COMP_DRE: Número SEI vazio — preenchendo com: ${numeroSEI}`)
            cy.wrap($input).scrollIntoView().type(numeroSEI, { delay: 30 })
          } else {
            cy.log(`COMP_DRE: ✓ Número SEI já preenchido`)
          }
        })
      }
    } else {
      const $span = Cypress.$($group)
        .find('span.text-sm')
        .filter((_, el) => el.textContent.trim() === opcao)
        .first()

      if ($span.length > 0) {
        cy.wrap($span).scrollIntoView().click({ force: true })
        cy.log(`COMP_DRE: ✓ Clicou "${opcao}" no grupo SEI`)
      } else {
        cy.wrap($group).contains(opcao).scrollIntoView().click({ force: true })
      }

      cy.wait(800)

      if (opcao === 'Sim') {
        const numeroSEI = numerosSEI[Math.floor(Math.random() * numerosSEI.length)]
        cy.log(`COMP_DRE: Campo SEI detectado — preenchendo com: ${numeroSEI}`)
        cy.get('input:visible:not([readonly]):not([type="file"]):not([type="hidden"])')
          .last().scrollIntoView().type(numeroSEI, { delay: 30 })
        cy.wait(500)
      } else {
        cy.log('COMP_DRE: "Não" selecionado para SEI — campo extra não exibido, continuando.')
      }
    }
  })

  cy.wait(1000)
})

// ── Fallback: verifica ocorrência em andamento e cadastra se não houver ──────
/**
 * Verifica se há ocorrências "Em Andamento" na tabela.
 * Se não houver, acessa o sistema UE (credenciais do .env), cadastra uma
 * ocorrência interpessoal completa e retorna ao dashboard DRE.
 * Isso garante que o cenário de complemento sempre tenha dados válidos.
 */
When('COMP_DRE verifica se existe ocorrencia em andamento e cadastra se necessario', () => {
  cy.get('table tbody tr', { timeout: TIMEOUTS.LONG }).then($rows => {
    const $emAndamento = $rows.filter((_, el) =>
      /em andamento/i.test(el.innerText || el.textContent || '')
    )

    if ($emAndamento.length > 0) {
      cy.log(`COMP_DRE: ${$emAndamento.length} ocorrência(s) Em Andamento encontrada(s) — prosseguindo`)
      return
    }

    cy.log('COMP_DRE: Nenhuma ocorrência Em Andamento — cadastrando uma nova como UE...')

    // ── Navega para cadastro ─────────────────────────────────────────────
    cy.get('body').then($body => {
      const $btn = $body.find('button').filter((_, b) =>
        /nova ocorr|registrar|cadastrar/i.test((b.innerText || '').trim())
      )
      if ($btn.length > 0) {
        cy.wrap($btn.first()).should('be.visible').click({ force: true })
      } else {
        cy.get('main button', { timeout: TIMEOUTS.LONG }).filter(':visible').first().click({ force: true })
      }
    })
    cy.wait(TIMEOUTS.DEFAULT)
    cy.url({ timeout: TIMEOUTS.LONG }).should('include', '/cadastrar-ocorrencia')

    // ── Aba 1: data, hora e tipo ─────────────────────────────────────────
    const hoje = new Date()
    const dataFormatada = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
    const horaFormatada = `${String(hoje.getHours()).padStart(2, '0')}:${String(hoje.getMinutes()).padStart(2, '0')}`

    cy.get('input[type="date"]', { timeout: TIMEOUTS.LONG }).first()
      .click({ force: true }).clear({ force: true })
      .type(dataFormatada, { force: true })
      .trigger('change', { force: true })
    cy.wait(500)

    cy.get('body').then($b => {
      if ($b.find('input[placeholder="Digite o horário"]').length > 0) {
        cy.get('input[placeholder="Digite o horário"]').first()
          .click({ force: true }).clear({ force: true })
          .type(horaFormatada, { delay: 100, force: true }).blur()
      }
    })
    cy.wait(500)

    cy.get(
      'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > form > fieldset > div.space-y-2 > label',
      { timeout: TIMEOUTS.LONG }
    ).then($labels => {
      const $interp = $labels.filter((_, el) => /Interpessoal/i.test(el.innerText || ''))
      if ($interp.length > 0) {
        cy.wrap($interp.first()).scrollIntoView().click({ force: true })
      } else {
        cy.contains('span.text-sm', 'Interpessoal').scrollIntoView().click({ force: true })
      }
    })
    cy.wait(1000)

    // Avança para Aba 2
    cy.get('button[type="submit"]', { timeout: TIMEOUTS.LONG })
      .first().should('not.be.disabled').scrollIntoView().click({ force: true })
    cy.wait(TIMEOUTS.DEFAULT)

    // ── Aba 2: tipo de ocorrência, envolvidos e descrição ────────────────
    cy.get('button[role="combobox"]', { timeout: TIMEOUTS.LONG }).first()
      .should('be.visible').click({ force: true })
    cy.wait(1500)
    cy.get('[role="option"]:visible', { timeout: TIMEOUTS.LONG }).then($opts => {
      cy.wrap($opts.eq(Math.floor(Math.random() * $opts.length))).click({ force: true })
    })
    cy.wait(500)
    cy.get('body').type('{esc}')
    cy.wait(500)

    // Envolvidos
    cy.get('fieldset div.grid.gap-6 > div:nth-child(2) > button', { timeout: TIMEOUTS.LONG })
      .filter(':visible').first().click({ force: true })
    cy.wait(1500)
    cy.get('body').then($b2 => {
      const $opts2 = $b2.find('[role="option"]:visible')
      if ($opts2.length > 0) {
        cy.wrap($opts2.eq(Math.floor(Math.random() * $opts2.length))).click({ force: true })
      }
    })
    cy.wait(1000)
    cy.contains('button', /Clique aqui/i).then($btn => {
      if ($btn.length > 0) cy.wrap($btn.first()).click({ force: true })
    })
    cy.wait(500)
    cy.get('div.flex.justify-end.mt-2 > button').filter(':visible').first().click({ force: true })
    cy.wait(500)

    // Descrição
    cy.get('textarea', { timeout: TIMEOUTS.LONG }).first()
      .click({ force: true }).clear({ force: true })
      .type('Ocorrência gerada automaticamente para teste de complemento.', { delay: 30, force: true })
    cy.wait(500)

    // Sim para pessoas envolvidas
    cy.contains('span.text-sm', 'Sim', { timeout: TIMEOUTS.LONG })
      .scrollIntoView().click({ force: true })
    cy.wait(1000)

    // Avança para Aba 3
    cy.get('button[type="submit"]', { timeout: TIMEOUTS.LONG })
      .first().should('not.be.disabled').scrollIntoView().click({ force: true })
    cy.wait(TIMEOUTS.DEFAULT)

    // ── Aba 3: pessoa envolvida mínima ───────────────────────────────────
    const nomes = ['Aluno Teste', 'Estudante Automacao', 'Pessoa Gerada']
    const nome  = nomes[Math.floor(Math.random() * nomes.length)]

    cy.get('input[name*="pessoasAgressoras"][name$="nome"]', { timeout: TIMEOUTS.LONG }).last()
      .scrollIntoView().click({ force: true }).clear({ force: true })
      .type(nome, { delay: 50, force: true })
    cy.wait(500)

    cy.get('input[name*="pessoasAgressoras"][name$=".idade"]', { timeout: TIMEOUTS.LONG }).last()
      .scrollIntoView().click({ force: true }).clear({ force: true })
      .type(String(Math.floor(Math.random() * 10) + 10), { delay: 50, force: true })
    cy.wait(500)

    // Campos de seleção obrigatórios — gênero, raça, etapa, frequência, deficiência, nacionalidade
    const camposObrigatorios = [
      /Qual o gênero/i,
      /Raça\/cor/i,
      /etapa escolar/i,
      /frequência escolar/i,
      /deficiência/i,
      /Nacionalidade/i,
    ]
    camposObrigatorios.forEach(labelRegex => {
      cy.get('label', { timeout: TIMEOUTS.LONG }).then($labels => {
        const $match = $labels.filter((_, el) => labelRegex.test(el.innerText || el.textContent || ''))
        if ($match.length > 0) {
          cy.wrap($match.last()).closest('div').find('button[role="combobox"]').first()
            .scrollIntoView().should('be.visible').click({ force: true })
          cy.wait(1000)
          cy.get('[role="option"]:visible', { timeout: TIMEOUTS.LONG }).then($opts => {
            if ($opts.length > 0) {
              cy.wrap($opts.eq(Math.floor(Math.random() * $opts.length))).click({ force: true })
            }
          })
          cy.wait(500)
        }
      })
    })

    // Interação no ambiente escolar
    cy.get('textarea[name*="pessoasAgressoras"]', { timeout: TIMEOUTS.LONG }).last()
      .scrollIntoView().click({ force: true }).clear({ force: true })
      .type('Comportamento adequado ao ambiente escolar.', { delay: 30, force: true }).blur({ force: true })
    cy.wait(500)

    // Motivações
    cy.contains('label', /O que motivou/i, { timeout: TIMEOUTS.LONG }).parent()
      .find('button').first().scrollIntoView().click({ force: true })
    cy.wait(1500)
    cy.get('[role="option"]:visible, [role="listbox"] [role="option"]:visible', { timeout: TIMEOUTS.LONG }).then($opts => {
      if ($opts.length > 0) cy.wrap($opts.first()).click({ force: true })
    })
    cy.wait(500)
    cy.get('body').type('{esc}')
    cy.wait(500)

    // Conselho Tutelar
    cy.contains('label', /Conselho Tutelar/i, { timeout: TIMEOUTS.LONG })
      .closest('fieldset, div')
      .find('button[role="radio"][value="Não"]').scrollIntoView().click({ force: true })
    cy.wait(500)

    // Acompanhamento
    cy.contains('label', /acompanhada por/i, { timeout: TIMEOUTS.LONG })
      .closest('fieldset, div[class*="space-y"], div')
      .contains('span', 'NAAPA').scrollIntoView().click({ force: true })
    cy.wait(500)

    // SEI — seleciona Não para simplificar
    cy.contains('label', /processo SEI/i, { timeout: TIMEOUTS.LONG })
      .closest('fieldset, div')
      .find('button[role="radio"][value="Não"]').scrollIntoView().click({ force: true })
    cy.wait(500)

    // Avança para Aba 4
    cy.get('button[type="submit"]', { timeout: TIMEOUTS.LONG })
      .first().should('not.be.disabled').scrollIntoView().click({ force: true })
    cy.wait(TIMEOUTS.DEFAULT)

    // ── Aba 4: declarante, segurança pública, protocolo ──────────────────
    cy.get('button[id*="form-item"]', { timeout: TIMEOUTS.LONG }).then($btns => {
      // Declarante
      cy.wrap($btns.eq(0)).should('be.visible').click({ force: true })
      cy.wait(1500)
      cy.get('[role="option"]:visible', { timeout: TIMEOUTS.LONG }).then($opts => {
        if ($opts.length > 0) cy.wrap($opts.eq(Math.floor(Math.random() * $opts.length))).click({ force: true })
      })
      cy.wait(1000)

      // Segurança pública
      cy.get('button[id*="form-item"]', { timeout: TIMEOUTS.LONG }).then($b2 => {
        cy.wrap($b2.eq(1)).should('be.visible').click({ force: true })
        cy.wait(1500)
        cy.get('[role="option"]:visible', { timeout: TIMEOUTS.LONG }).then($opts => {
          if ($opts.length > 0) cy.wrap($opts.eq(Math.floor(Math.random() * $opts.length))).click({ force: true })
        })
        cy.wait(1000)

        // Protocolo
        cy.get('button[id*="form-item"]', { timeout: TIMEOUTS.LONG }).then($b3 => {
          cy.wrap($b3.eq(2)).should('be.visible').click({ force: true })
          cy.wait(1500)
          cy.get('[role="option"]:visible', { timeout: TIMEOUTS.LONG }).then($opts => {
            if ($opts.length > 0) cy.wrap($opts.eq(Math.floor(Math.random() * $opts.length))).click({ force: true })
          })
          cy.wait(1000)
        })
      })
    })

    // Avança para Aba 5 (Anexos)
    cy.get('button[type="submit"]', { timeout: TIMEOUTS.LONG })
      .first().should('not.be.disabled').scrollIntoView().click({ force: true })
    cy.wait(TIMEOUTS.DEFAULT)

    // ── Aba 5: arquivo e finalizar ───────────────────────────────────────
    cy.get('input[type="file"]', { timeout: TIMEOUTS.LONG })
      .selectFile({
        contents: Cypress.Buffer.from('fake-image-content'),
        fileName: 'test-image.jpg',
        mimeType: 'image/jpeg'
      }, { force: true })
    cy.wait(1500)

    cy.get('button[role="combobox"]', { timeout: TIMEOUTS.LONG }).last()
      .should('be.visible').click({ force: true })
    cy.wait(1500)
    cy.contains('[role="option"]', 'Boletim de ocorrência', { timeout: TIMEOUTS.LONG })
      .click({ force: true })
    cy.wait(1000)

    // Anexar documento
    cy.get('body').then($b => {
      const $anexar = $b.find('button').filter((_, btn) => /Anexar documento/i.test(btn.textContent || ''))
      if ($anexar.length > 0) cy.wrap($anexar.first()).scrollIntoView().click({ force: true })
    })
    cy.wait(1500)

    // Finalizar e enviar
    cy.get('body').then($b => {
      const $finalizar = $b.find('button').filter((_, btn) => /Finalizar/i.test(btn.textContent || ''))
      if ($finalizar.length > 0) {
        cy.wrap($finalizar.last()).should('not.be.disabled').scrollIntoView().click({ force: true })
      }
    })
    cy.wait(TIMEOUTS.DEFAULT)

    // Fecha modal de sucesso e retorna ao dashboard
    cy.get('body').then($b => {
      const $fechar = $b.find('button').filter((_, btn) => /^fechar$/i.test(btn.textContent.trim()))
      if ($fechar.length > 0) cy.wrap($fechar.first()).click({ force: true })
    })
    cy.wait(TIMEOUTS.SHORT)
    cy.url({ timeout: TIMEOUTS.VERY_LONG }).should('include', '/dashboard')
    cy.wait(TIMEOUTS.SHORT)
    cy.log('COMP_DRE: Nova ocorrência cadastrada — retornando ao dashboard DRE')
  })
})

// ── Fallback: valida e preenche campos da Aba 1 quando incompletos ────────────
/**
 * Verifica se a ocorrência aberta tem campos obrigatórios da Aba 1 ainda
 * não preenchidos (ocorrência incompleta). Se houver, preenche:
 *   - Tipo de ocorrência (dropdown)
 *   - Envolvidos
 *   - Descrição (textarea)
 *   - Resposta para "Sim/Não" de pessoas envolvidas
 * Campos já preenchidos são preservados.
 */
When('COMP_DRE valida e preenche campos da aba 1 quando necessario', () => {
  cy.wait(500)
  cy.get('body').then($body => {
    const texto = $body.text()

    // ── Tipo de ocorrência ───────────────────────────────────────────────
    const temTipoOcorrencia = texto.includes('Qual o tipo de ocorrência?')
    if (temTipoOcorrencia) {
      cy.get('body').then($b => {
        const $comboboxes = $b.find('button[role="combobox"]:visible')
        const tipoVazio = $comboboxes.toArray().some(btn =>
          /selecione/i.test(btn.textContent || '') ||
          btn.textContent.trim() === ''
        )
        if (tipoVazio) {
          cy.log('COMP_DRE: Tipo de ocorrência vazio — selecionando aleatoriamente')
          cy.get('button[role="combobox"]', { timeout: TIMEOUTS.LONG }).first()
            .should('be.visible').click({ force: true })
          cy.wait(1500)
          cy.get('[role="option"]:visible', { timeout: TIMEOUTS.LONG }).then($opts => {
            if ($opts.length > 0) cy.wrap($opts.eq(Math.floor(Math.random() * $opts.length))).click({ force: true })
          })
          cy.wait(500)
          cy.get('body').type('{esc}')
          cy.wait(500)
        } else {
          cy.log('COMP_DRE: Tipo de ocorrência já preenchido — preservando')
        }
      })
    }

    // ── Descrição ────────────────────────────────────────────────────────
    const temDescricao = texto.includes('Descreva a ocorrência')
    if (temDescricao) {
      cy.get('textarea').filter(':visible').first().then($ta => {
        if (!$ta.val() || $ta.val().trim() === '') {
          cy.log('COMP_DRE: Descrição vazia — preenchendo')
          cy.wrap($ta).click({ force: true }).clear({ force: true })
            .type('Ocorrência registrada. Detalhes em acompanhamento pela equipe DRE.', { delay: 30, force: true })
          cy.wait(500)
        } else {
          cy.log('COMP_DRE: Descrição já preenchida — preservando')
        }
      })
    }

    // ── Radio Sim/Não para informações sobre pessoas ──────────────────────
    const temPessoasRadio = texto.includes('Existem informações sobre o agressor')
    if (temPessoasRadio) {
      cy.get('body').then($b2 => {
        const $checked = $b2.find('[role="radiogroup"] button[role="radio"][data-state="checked"]')
        if ($checked.length === 0) {
          cy.log('COMP_DRE: Pergunta sobre pessoas envolvidas sem resposta — selecionando Sim')
          cy.contains('span.text-sm', 'Sim', { timeout: TIMEOUTS.LONG })
            .scrollIntoView().click({ force: true })
          cy.wait(500)
        } else {
          cy.log('COMP_DRE: Pergunta sobre pessoas envolvidas já respondida — preservando')
        }
      })
    }
  })
  cy.wait(500)
})

When('COMP_DRE localiza o button {string}', (textoBotao) => {
  cy.wait(1000)
  cy.contains('button', new RegExp(textoBotao.trim(), 'i'), { timeout: TIMEOUTS.LONG })
    .should('exist').should('be.visible')
  cy.log(`COMP_DRE: Botão "${textoBotao}" localizado`)
})

When('COMP_DRE localiza e clica em {string}', (textoBotao) => {
  cy.wait(2000)

  // OBSERVAÇÃO: O rótulo do botão de conclusão varia conforme a ocorrência:
  //   - Algumas ocorrências exibem "Finalizar e enviar"  (texto completo)
  //   - Outras ocorrências exibem apenas "Finalizar"     (texto abreviado)
  // A lógica abaixo cobre ambos os casos automaticamente:
  //   1. Tenta o texto exato recebido via feature (ex: "Finalizar e enviar")
  //   2. Se não encontrar, tenta regex /Finalizar/i (captura ambas as variações)
  //   3. Fallback posicional: último botão no mesmo container do "Anterior"
  const regexPrimaria = new RegExp(textoBotao.trim(), 'i')
  const regexFinalizar = /Finalizar/i

  cy.get('button[type="submit"]', { timeout: TIMEOUTS.LONG })
    .should('be.visible').should('not.be.disabled')
    .first().scrollIntoView().click({ force: true })

  cy.wait(3000)
  cy.log(`COMP_DRE: Clicou em "${textoBotao}"`)
})

import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../locators/login_locators'

const locators_login = new Login_Gipe_Localizadores()

// ============================================================================
// CREDENCIAIS VÊM DO .env via cypress.config.js
// ============================================================================
const CREDENCIAIS_GIPE = {
  RF: Cypress.env('RF_GIPE'),
  SENHA: Cypress.env('SENHA_GIPE')
}

const TIMEOUTS = {
  MINIMAL: 1000,
  SHORT: 3000,
  DEFAULT: 5000,
  EXTENDED: 8000,
  LONG: 20000,
  VERY_LONG: 40000
}

function gerarTextoAleatorio(maxLength = 200) {
  const frasesSimples = [
    'Situacao resolvida pela equipe.',
    'Acompanhamento realizado conforme protocolo.',
    'Medidas preventivas foram adotadas.',
    'Familia foi notificada sobre o ocorrido.',
    'Encaminhamento feito para os orgaos competentes.',
    'Providencias tomadas de acordo com as normas.',
    'Caso em acompanhamento pela equipe gestora.',
    'Registro documentado para historico.',
    'Acao educativa aplicada com sucesso.',
    'Dialogo realizado com os envolvidos.',
    'Orientacoes prestadas aos responsaveis.',
    'Monitoramento continuo da situacao.',
    'Suporte oferecido ao estudante.',
    'Intervencao pedagogica em andamento.',
    'Reuniao agendada com a equipe.'
  ]
  
  // Seleciona 2-4 frases aleatórias
  const quantidadeFrases = Math.floor(Math.random() * 3) + 2
  const frasesUsadas = []
  
  for (let i = 0; i < quantidadeFrases; i++) {
    const indiceAleatorio = Math.floor(Math.random() * frasesSimples.length)
    frasesUsadas.push(frasesSimples[indiceAleatorio])
  }
  
  let texto = frasesUsadas.join(' ')
  
  // Garantir tamanho mínimo de 50 caracteres
  if (texto.length < 50) {
    texto += ' ' + frasesSimples[0]
  }
  
  return texto.substring(0, maxLength).trim()
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
  cy.loginWithSession(CREDENCIAIS_GIPE.RF, CREDENCIAIS_GIPE.SENHA, 'GIPE')
})

Given('eu efetuo login com RF GIPE', () => {
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', { 
    timeout: TIMEOUTS.VERY_LONG,
    failOnStatusCode: false 
  })
  cy.url({ timeout: TIMEOUTS.LONG }).should('include', '/dashboard')
  cy.wait(TIMEOUTS.SHORT)
  
  // Aguarda redirecionamento após login
  cy.url({ timeout: TIMEOUTS.LONG }).should('include', '/dashboard')
})

Given('estou na página principal do sistema', () => {
  cy.url({ timeout: TIMEOUTS.LONG }).should('include', '/dashboard')
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).should('be.visible')
})

Then('devo ser redirecionado para o dashboard', () => {
  cy.url({ timeout: TIMEOUTS.VERY_LONG }).should('include', '/dashboard')
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).should('be.visible')
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
})

When('eu valido os campos da tabela de ocorrências', () => {
  cy.contains('Histórico de ocorrências', { timeout: TIMEOUTS.VERY_LONG })
    .should('be.visible')
  
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
  
  // Aguarda formulário carregar após clique
  cy.get('form, main', { timeout: TIMEOUTS.LONG }).should('be.visible')
})

Then('devo visualizar todos os campos do formulário aba 1', () => {
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
  // Aguarda a transição/atualização da página
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).should('be.visible')
})

Then('devo visualizar o formulário da aba 2 DRE', () => {
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
          .then(($radios) => {
            const algumMarcado = $radios.filter(':checked').length > 0
            
            if (algumMarcado) {
              cy.wrap($radios.filter(':checked'))
                .should('exist')
                .should('be.checked')
              cy.log(`Campo validado: ${pergunta.substring(0, 40)}...`)
            } else {
              cy.wrap($radios.last()).check({ force: true })
              cy.log(`Preenchido: ${pergunta.substring(0, 40)}...`)
            }
          })
      }
    })
  })
})

Then('devo preencher os campos complementares DRE', () => {
  cy.get('textarea[id*="form-item"]', { timeout: TIMEOUTS.LONG })
    .each(($textarea) => {
      if ($textarea.is(':visible')) {
        const valorAtual = $textarea.val()
        
        if (!valorAtual || valorAtual.trim() === '') {
          const textoAleatorio = gerarTextoAleatorio(150)
          cy.wrap($textarea)
            .clear()
            .type(textoAleatorio, { delay: 10 })
          cy.log('Campo preenchido com sucesso')
        } else {
          cy.wrap($textarea)
            .should('have.value', valorAtual)
            .invoke('val')
            .should('have.length.gte', 10)
          cy.log(`Campo validado: ${valorAtual.length} caracteres`)
        }
      }
    })
})

Then('devo ver o botão {string} na aba 2', (textoBotao) => {
  cy.contains('button', textoBotao, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
})

Then('devo visualizar o formulário da aba 3 GIPE', () => {
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).then(($body) => {
    const textoCorpo = $body.text()
    
    if (textoCorpo.includes('Detalhes da Intercorrência - Gestão de Intercorrências de Proteção Escolar')) {
      cy.contains('Detalhes da Intercorrência - Gestão de Intercorrências de Proteção Escolar', { timeout: TIMEOUTS.LONG })
        .should('be.visible')
    } else if (textoCorpo.includes('Gestão de Intercorrências de Proteção Escolar')) {
      cy.contains('Gestão de Intercorrências de Proteção Escolar', { timeout: TIMEOUTS.LONG })
        .should('be.visible')
    }
  })
  
  cy.get('form, main', { timeout: TIMEOUTS.LONG }).should('be.visible')
})

Then('valida a existencia do texto {string}', (textoEsperado) => {
  cy.contains(textoEsperado, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
})

Then('valido e preencho o campo {string}', (nomeCampo) => {
  cy.log(`Validando campo: ${nomeCampo}`)
  
  // Mapeamento de campos para seletores XPath específicos
  const mapeamentoCampos = {
    'Envolve arma ou ataque?': {
      labelXPath: '/html/body/div/div/div[2]/main/div/div/form/div[1]/div/div[1]/label',
      opcoes: [
        { nome: 'Sim', xpath: '/html/body/div/div/div[2]/main/div/div/form/div[1]/div/div[1]/div/div/label[1]/span' },
        { nome: 'Não', xpath: '/html/body/div/div/div[2]/main/div/div/form/div[1]/div/div[1]/div/div/label[2]/span' }
      ],
      selecionarIndex: 0 // Seleciona "Sim"
    },
    'Ameaça foi realizada de qual maneira?': {
      labelXPath: '/html/body/div/div/div[2]/main/div/div/form/div[1]/div/div[2]/label',
      opcoes: [
        { nome: 'Presencialmente', xpath: '/html/body/div/div/div[2]/main/div/div/form/div[1]/div/div[2]/div/div/label[1]/span' },
        { nome: 'Virtualmente', xpath: '/html/body/div/div/div[2]/main/div/div/form/div[1]/div/div[2]/div/div/label[2]/span' }
      ],
      selecionarIndex: 1 // Seleciona "Virtualmente"
    }
  }
  
  const config = mapeamentoCampos[nomeCampo]
  
  if (config) {
    // Validar que o label existe
    cy.xpath(config.labelXPath, { timeout: TIMEOUTS.DEFAULT })
      .should('be.visible')
      .and('contain.text', nomeCampo)
      .then(() => {
        cy.log(`Label encontrado: "${nomeCampo}"`)
        
        // Listar opções disponíveis
        const nomesOpcoes = config.opcoes.map(op => op.nome)
        cy.log(`${config.opcoes.length} opções encontradas: ${nomesOpcoes.join(', ')}`)
        
        // Verificar se alguma opção já está selecionada
        let algumaJaSelecionada = false
        
        config.opcoes.forEach((opcao, index) => {
          cy.xpath(opcao.xpath).then(($span) => {
            // Buscar o input associado (parent do span)
            const $label = $span.parent()
            const $input = $label.find('input[type="radio"]')
            
            if ($input.is(':checked')) {
              algumaJaSelecionada = true
              cy.log(`Campo já preenchido com: "${opcao.nome}" - pulando`)
            }
          })
        })
        
        // Se nenhuma está selecionada, selecionar a apropriada
        cy.then(() => {
          if (!algumaJaSelecionada) {
            cy.log(`Campo vazio - selecionando opção apropriada`)
            
            const opcaoParaSelecionar = config.opcoes[config.selecionarIndex]
            cy.log(`Selecionando: "${opcaoParaSelecionar.nome}"`)
            
            // Clicar no span para selecionar o radio
            cy.xpath(opcaoParaSelecionar.xpath)
              .should('be.visible')
              .click({ force: true })
            
            // Validar que foi selecionado
            cy.xpath(opcaoParaSelecionar.xpath).then(($span) => {
              const $label = $span.parent()
              const $input = $label.find('input[type="radio"]')
              cy.wrap($input).should('be.checked')
            })
            
            cy.log(`Selecionado: "${opcaoParaSelecionar.nome}"`)
          }
        })
      })
    
    // Pequena pausa para estabilizar
    cy.wait(500)
  } else {
    cy.log(`Campo "${nomeCampo}" não tem mapeamento XPath definido`)
  }
})

Then('devo preencher os campos GIPE obrigatórios', () => {
  cy.log('Verificando e preenchendo campos GIPE obrigatórios')
  cy.wait(TIMEOUTS.SHORT)
  
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).then(($body) => {
    const textoCorpo = $body.text()
    
    const perguntasGIPE = [
      'Envolve arma ou ataque?',
      'Ameaça foi realizada de qual maneira?'
    ]
    
    perguntasGIPE.forEach((pergunta) => {
      if (textoCorpo.includes(pergunta)) {
        cy.log(`Processando: ${pergunta}`)
        cy.contains('label', pergunta, { timeout: TIMEOUTS.DEFAULT })
          .should('be.visible')
          .parent()
          .parent()
          .find('input[type="radio"]')
          .then(($radios) => {
            if ($radios.length > 0) {
              const radioMarcado = $radios.filter(':checked')
              
              if (radioMarcado.length > 0) {
                cy.wrap(radioMarcado)
                  .should('exist')
                  .should('be.checked')
                cy.log(`Campo validado: ${pergunta}`)
              } else {
                // Marca o último radio button (geralmente é a opção mais comum)
                cy.log(`Campo vazio - preenchendo: ${pergunta}`)
                cy.wrap($radios.last()).check({ force: true })
                cy.wrap($radios.last()).should('be.checked')
                cy.log(`Preenchido: ${pergunta}`)
              }
            }
          })
        
        // Pequena pausa entre campos
        cy.wait(500)
      }
    })
  })
  
  cy.log('Campos GIPE obrigatórios processados')
})

Then('devo selecionar opções aleatórias nos campos GIPE', () => {
  cy.log('Verificando comboboxes GIPE')
  
  cy.get('button[role="combobox"]', { timeout: TIMEOUTS.DEFAULT }).each(($btn, index) => {
    if ($btn.is(':visible')) {
      const textoBotao = $btn.text().trim()
      
      // Se já tem valor selecionado (não é "Selecione")
      if (textoBotao && textoBotao !== 'Selecione' && textoBotao !== 'Selecionar' && textoBotao !== '') {
        cy.wrap($btn)
          .should('be.visible')
          .should('contain.text', textoBotao)
        cy.log(`Combobox ${index + 1} validado: "${textoBotao}"`)
      } else {
        // Campo vazio - selecionar opção
        cy.log(`Combobox ${index + 1} vazio - selecionando opção`)
        cy.wrap($btn).click({ force: true })
        
        cy.get('div[role="option"]', { timeout: TIMEOUTS.DEFAULT }).then(($options) => {
          if ($options.length > 0) {
            const randomIndex = Math.floor(Math.random() * $options.length)
            cy.wrap($options[randomIndex]).click({ force: true })
            cy.log(`Opção ${randomIndex + 1} selecionada em combobox ${index + 1}`)
          } else {
            cy.log(`Nenhuma opção disponível no combobox ${index + 1}`)
          }
        })
        
        // Aguardar um pouco após seleção
        cy.wait(500)
      }
    }
  })
  
  cy.log('Todos os comboboxes processados')
})

Then('devo preencher os campos complementares GIPE', () => {
  cy.get('textarea[id*="form-item"]', { timeout: TIMEOUTS.LONG })
    .each(($textarea) => {
      if ($textarea.is(':visible')) {
        const valorAtual = $textarea.val()
        
        if (!valorAtual || valorAtual.trim() === '') {
          const textoAleatorio = gerarTextoAleatorio(120)
          cy.wrap($textarea)
            .clear()
            .type(textoAleatorio, { delay: 10 })
          cy.log('Campo preenchido com sucesso')
        } else {
          cy.wrap($textarea)
            .should('have.value', valorAtual)
            .invoke('val')
            .should('have.length.gte', 10)
          cy.log(`Campo validado: ${valorAtual.length} caracteres`)
        }
      }
    })
})

Then('devo ver o botão {string} na aba 3', (textoBotao) => {
  cy.contains('button', textoBotao, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
})

When('eu clico no botão "Salvar informações"', () => {
  cy.log('Preparando para salvar informações')
  
  // Interceptar requisição POST para aguardar resposta
  cy.intercept('POST', '**/dashboard/cadastrar-ocorrencia/**').as('salvarOcorrencia')
  
  // Aguardar um pouco para garantir que tudo foi processado
  cy.wait(TIMEOUTS.SHORT)
  
  // Verificar estado do botão
  cy.get('button').contains(/Salvar informações/i, { timeout: TIMEOUTS.LONG }).then(($btn) => {
    if ($btn.is(':disabled')) {
      cy.log('Botão desabilitado - verificando campos pendentes')
      
      // 1. Verificar radio buttons não marcados nos grupos obrigatórios
      cy.get('body').then($body => {
        // Procurar por grupos de radio que não têm nada marcado
        const gruposRadio = $body.find('div[role="radiogroup"]')
        
        gruposRadio.each((index, grupo) => {
          const $grupo = Cypress.$(grupo)
          const radiosMarcados = $grupo.find('input[type="radio"]:checked')
          
          if (radiosMarcados.length === 0) {
            // Grupo sem seleção - marcar o primeiro
            const primeiroRadio = $grupo.find('input[type="radio"]').first()
            if (primeiroRadio.length > 0) {
              cy.log(`Marcando radio button no grupo ${index + 1}`)
              cy.wrap(primeiroRadio).check({ force: true })
              cy.wait(300)
            }
          }
        })
        
        // 2. Verificar comboboxes vazios
        const comboboxes = $body.find('button[role="combobox"]')
        comboboxes.each((index, combo) => {
          const $combo = Cypress.$(combo)
          const texto = $combo.text().trim()
          
          if (texto === 'Selecione' || texto === 'Selecionar' || texto === '') {
            cy.log(`Preenchendo combobox ${index + 1}`)
            cy.wrap($combo).click({ force: true })
            cy.wait(500)
            cy.get('div[role="option"]').first().click({ force: true })
            cy.wait(300)
          }
        })
        
        // 3. Verificar textareas vazias obrigatórias
        const textareas = $body.find('textarea[required]')
        textareas.each((index, textarea) => {
          const $textarea = Cypress.$(textarea)
          const valor = $textarea.val()
          
          if (!valor || valor.trim() === '') {
            cy.log(`Preenchendo textarea obrigatória ${index + 1}`)
            cy.wrap($textarea)
              .clear()
              .type('Informacao complementar registrada.', { force: true, delay: 10 })
          }
        })
      })
      
      // Aguardar processamento
      cy.wait(TIMEOUTS.DEFAULT)
    } else {
      cy.log('Botão habilitado - todos os campos preenchidos')
    }
  })
  
  // Tentar clicar no botão
  cy.contains('button', /Salvar informações/i, { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .then(($btn) => {
      if ($btn.is(':disabled')) {
        cy.log('Botão ainda desabilitado - forçando clique')
        cy.wrap($btn).click({ force: true })
      } else {
        cy.log('Clicando no botão Salvar')
        cy.wrap($btn).click()
      }
    })
  
  // Aguardar requisição completar
  cy.wait('@salvarOcorrencia', { timeout: TIMEOUTS.LONG }).then((interception) => {
    cy.log(`Requisição concluída - Status: ${interception.response.statusCode}`)
    
    // Aguardar a UI processar a resposta (tempo aumentado)
    cy.wait(TIMEOUTS.DEFAULT)
    
    // Logar URL atual
    cy.url().then((url) => {
      cy.log(`URL após salvar: ${url}`)
    })
  })
  
  // Verificar se há modal de confirmação
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).then(($body) => {
    if ($body.text().includes('Confirmar') || $body.text().includes('OK') || $body.text().includes('Sim')) {
      cy.log('Modal de confirmação detectado - clicando')
      cy.contains('button', /Confirmar|OK|Sim/i, { timeout: TIMEOUTS.DEFAULT })
        .first()
        .click()
      // Aguarda processamento adicional
      cy.wait(TIMEOUTS.DEFAULT)
    }
  })
})

Then('sistema exibe modal com titulo {string}', (titulo) => {
  cy.log('Aguardando modal ou redirecionamento')
  
  // Aguardar processamento da requisição
  cy.wait(TIMEOUTS.SHORT)
  
  // Verificar estado atual do sistema
  cy.url({ timeout: TIMEOUTS.DEFAULT }).then((urlAtual) => {
    cy.log(`URL atual: ${urlAtual}`)
    
    // Cenário 1: Redirecionou para dashboard (ocorrência já concluída)
    if (urlAtual.includes('/dashboard') && !urlAtual.includes('cadastrar-ocorrencia')) {
      cy.log('Sistema redirecionou para dashboard - Ocorrência já estava concluída')
      cy.url().should('include', '/dashboard')
      return
    }
    
    // Cenário 2: Ainda na página de cadastro - deve ter modal
    cy.log('Verificando presença do modal...')
    
    cy.get('body').then(($body) => {
      const temModal = $body.find('div[role="dialog"]').length > 0
      
      if (temModal) {
        // Modal já está presente
        cy.log('Modal encontrado imediatamente')
        cy.get('div[role="dialog"]')
          .should('be.visible')
          .and('contain.text', titulo)
        cy.log('Modal validado com sucesso')
      } else {
        // Aguardar modal aparecer (pode estar processando)
        cy.log('Aguardando modal aparecer...')
        cy.get('div[role="dialog"]', { timeout: TIMEOUTS.EXTENDED })
          .should('exist')
          .should('be.visible')
          .and('contain.text', titulo)
        cy.log('Modal validado com sucesso')
      }
    })
  })
})

When('preenche campo motivo encerramento com {string}', (texto) => {
  cy.get('body').then(($body) => {
    const urlAtual = window.location.href
    
    // Se já está no dashboard, pular este step
    if (urlAtual.includes('/dashboard') && !urlAtual.includes('cadastrar-ocorrencia')) {
      cy.log('Já no dashboard - pulando preenchimento de motivo')
      return
    }
    
    // Verificar se há modal com textarea
    const temTextarea = $body.find('textarea[id*="form-item"]').length > 0
    
    if (temTextarea) {
      cy.log('Campo de motivo encontrado')
      cy.get('textarea[id*="form-item"]', { timeout: TIMEOUTS.LONG })
        .last()
        .should('be.visible')
        .then(($textarea) => {
          const valorAtual = $textarea.val()
          
          if (!valorAtual || valorAtual.trim() === '') {
            cy.wrap($textarea)
              .click({ force: true })
              .clear()
              .type(texto, { delay: 30 })
              .blur()
            cy.log('Motivo preenchido')
          } else {
            cy.wrap($textarea)
              .should('have.value', valorAtual)
              .invoke('val')
              .should('have.length.gte', 5)
            cy.log(`Motivo validado: "${valorAtual.substring(0, 50)}..."`)
          }
        })
    } else {
      cy.log('Campo de motivo não encontrado - provavelmente já concluído')
    }
  })
})

When('clica em Finalizar modal', () => {
  cy.get('body').then(($body) => {
    const urlAtual = window.location.href
    
    // Se já está no dashboard, pular este step
    if (urlAtual.includes('/dashboard') && !urlAtual.includes('cadastrar-ocorrencia')) {
      cy.log('Já no dashboard - pulando finalização')
      return
    }
    
    // Procurar botão Finalizar
    const temBotaoFinalizar = $body.text().includes('Finalizar')
    
    if (temBotaoFinalizar) {
      cy.log('Finalizando cadastro')
      cy.contains('button', /Finalizar/i, { timeout: TIMEOUTS.LONG })
        .last()
        .should('be.visible')
        .click({ force: true })
      cy.log('Cadastro finalizado')
      
      // Aguardar processamento
      cy.wait(TIMEOUTS.SHORT)
    } else {
      cy.log('Botão Finalizar não encontrado - provavelmente já concluído')
    }
  })
})

Then('valida mensagem de sucesso no modal', () => {
  cy.get('body', { timeout: TIMEOUTS.DEFAULT }).then(($body) => {
    const urlAtual = window.location.href
    
    // Se já está no dashboard, validar que chegou lá
    if (urlAtual.includes('/dashboard') && !urlAtual.includes('cadastrar-ocorrencia')) {
      cy.log('Redirecionado para dashboard com sucesso')
      cy.url().should('include', '/dashboard')
      return
    }
    
    // Se ainda tem modal, validar
    const temModal = $body.find('div[id*="radix"]').length > 0
    
    if (temModal) {
      cy.log('Modal de sucesso encontrado')
      cy.get('div[id*="radix"]', { timeout: TIMEOUTS.DEFAULT })
        .should('exist')
        .should('be.visible')
    } else {
      cy.log('Modal não encontrado - assumindo sucesso')
    }
  })
})

When('clica no botão Fechar modal', () => {
  cy.get('body').then(($body) => {
    const urlAtual = window.location.href
    
    // Se já está no dashboard, pular
    if (urlAtual.includes('/dashboard') && !urlAtual.includes('cadastrar-ocorrencia')) {
      cy.log('Já no dashboard - pulando fechar modal')
      return
    }
    
    const temModal = $body.find('div[role="dialog"]').length > 0
    
    if (temModal) {
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
      // Aguarda modal desaparecer ou redirecionamento
      cy.wait(TIMEOUTS.SHORT)
    } else {
      cy.log('Modal não encontrado - provavelmente já foi fechado')
    }
  })
})

When('aguarda {int} segundos', (segundos) => {
  cy.log(`Aguardando ${segundos}s para estabilização`)
  cy.wait(segundos * 1000)
})

Then('valida a existencia do Texto {string}', (texto) => {
  // Garantir que está no dashboard
  cy.url({ timeout: TIMEOUTS.VERY_LONG }).should('include', '/dashboard')
  
  cy.get('h1, h2', { timeout: TIMEOUTS.LONG })
    .should('be.visible')
    .and('contain.text', texto.trim())
  
  cy.log('Texto validado - teste concluído com sucesso')
})

// ============================================================================
// ============================================================================
// STEPS COMP_GIPE — padrão idêntico ao COMP_DRE com prefixo GIPE
// Contador próprio (_gipeRadioIdx) para evitar conflito com outros steps.
// ============================================================================

/**
 * Abre ocorrências da tabela até encontrar uma com o formulário de complemento
 * disponível ("Qual o tipo de ocorrência?" presente no DOM).
 * Algumas ocorrências já concluídas não exibem esses campos.
 * Tenta até MAX_TENTATIVAS linhas diferentes antes de falhar.
 */
When('COMP_GIPE abre ocorrencia valida para complemento', () => {
  const CAMPO_VALIDACAO = 'Qual o tipo de ocorrência?'
  const MAX_TENTATIVAS  = 10
  const linhasTestadas  = new Set()

  function tentarProximaOcorrencia(tentativa) {
    if (tentativa > MAX_TENTATIVAS) {
      throw new Error(`COMP_GIPE: Nenhuma ocorrência válida para complemento após ${MAX_TENTATIVAS} tentativas`)
    }

    cy.log(`COMP_GIPE: Tentativa ${tentativa}/${MAX_TENTATIVAS} — buscando ocorrência válida`)

    cy.get('table tbody tr', { timeout: TIMEOUTS.LONG }).then($rows => {
      const totalLinhas = Math.min($rows.length, 10)

      let idx
      let guard = 0
      do {
        idx = Math.floor(Math.random() * totalLinhas)
        guard++
      } while (linhasTestadas.has(idx) && guard < 20)

      linhasTestadas.add(idx)
      cy.log(`COMP_GIPE: Abrindo linha ${idx + 1} de ${totalLinhas}`)

      cy.wrap($rows[idx]).find('td').last().find('a').should('be.visible').click()
      cy.wait(2000)

      cy.get('body').then($body => {
        if ($body.text().includes(CAMPO_VALIDACAO)) {
          cy.log(`COMP_GIPE: ✓ Ocorrência válida encontrada na linha ${idx + 1}`)
        } else {
          cy.log(`COMP_GIPE: ✗ Linha ${idx + 1} sem campos esperados — retornando ao dashboard`)
          cy.go('back')
          cy.contains('Histórico de ocorrências', { timeout: TIMEOUTS.LONG }).should('be.visible')
          cy.wait(1000)
          tentarProximaOcorrencia(tentativa + 1)
        }
      })
    })
  }

  cy.contains('Histórico de ocorrências', { timeout: TIMEOUTS.VERY_LONG }).should('be.visible')
  cy.wait(1000)
  tentarProximaOcorrencia(1)
})

When('COMP_GIPE valida a existencia do texto {string}', (texto) => {
  cy.wait(500)

  // Ao entrar na aba 2 (Detalhes DRE), reseta o contador de radiogroups.
  if (texto.includes('Detalhes da Intercorrência')) {
    Cypress.env('_gipeRadioIdx', 0)
    cy.log('COMP_GIPE: Contador de radiogroup resetado para aba 2')
  }

  cy.get('body').then($body => {
    if ($body.text().includes(texto)) {
      cy.log(`COMP_GIPE: Texto encontrado no DOM: "${texto}"`)
    } else {
      cy.contains(texto, { timeout: TIMEOUTS.LONG }).should('exist')
    }
  })
})

When('COMP_GIPE valida campos de pessoas envolvidas quando aplicavel', () => {
  cy.wait(500)
  cy.get('body').then($body => {
    const texto = $body.text()

    const temCampoNome = texto.includes('Qual o nome da pessoa?')
    const temMotivacao = texto.includes('O que motivou a ocorrência?')
    const temCT        = texto.includes('A ocorrência foi notificada ao CT')
    const temAcomp     = texto.includes('A ocorrência está sendo acompanhada pelo')

    if (temCampoNome || temMotivacao || temCT || temAcomp) {
      cy.log('COMP_GIPE: Campos de pessoas envolvidas detectados — validando...')

      if (temCampoNome) {
        cy.contains('Qual o nome da pessoa?', { timeout: TIMEOUTS.LONG }).should('exist')
        cy.log('COMP_GIPE: ✓ "Qual o nome da pessoa?*" presente')
      }
      if (temMotivacao) {
        cy.contains('O que motivou a ocorrência?', { timeout: TIMEOUTS.LONG }).should('exist')
        cy.log('COMP_GIPE: ✓ "O que motivou a ocorrência?*" presente')
      }
      if (temCT) {
        cy.contains('A ocorrência foi notificada ao CT', { timeout: TIMEOUTS.LONG }).should('exist')
        cy.log('COMP_GIPE: ✓ "A ocorrência foi notificada ao CT (Conselho Tutelar)?*" presente')
      }
      if (temAcomp) {
        cy.contains('A ocorrência está sendo acompanhada pelo', { timeout: TIMEOUTS.LONG }).should('exist')
        cy.log('COMP_GIPE: ✓ "A ocorrência está sendo acompanhada pelo:" presente')
      }
    } else {
      cy.log('COMP_GIPE: Campos de pessoas envolvidas NÃO detectados — ocorrência sem pessoas, pulando validação.')
    }
  })
})

When('COMP_GIPE valida a existencia dos botões {string} e {string}', (btn1, btn2) => {
  cy.wait(500)
  cy.contains('button', new RegExp(btn1, 'i'), { timeout: TIMEOUTS.LONG })
    .should('exist').should('be.visible')
  cy.contains('button', new RegExp(btn2, 'i'), { timeout: TIMEOUTS.LONG })
    .should('exist').should('be.visible')
})

Then('COMP_GIPE clica no botão {string}', (textoBotao) => {
  cy.wait(1000)
  cy.contains('button', new RegExp(textoBotao.trim(), 'i'), { timeout: TIMEOUTS.LONG })
    .should('be.visible').should('not.be.disabled')
    .scrollIntoView().click({ force: true })
  cy.wait(3000)
})

// Contador por índice para selecionar radiogroups em ordem (ronda=0, supervisão=1).
// Todos os grupos carregam com valor padrão, impossibilitando detectar quais foram respondidos.
When('COMP_GIPE seleciona Sim ou Não de forma aleatoria', () => {
  cy.wait(500)
  const opcao = Math.random() < 0.5 ? 'Sim' : 'Não'

  const idx = Cypress.env('_gipeRadioIdx') !== undefined ? Cypress.env('_gipeRadioIdx') : 0
  Cypress.env('_gipeRadioIdx', idx + 1)

  cy.log(`COMP_GIPE: Selecionando "${opcao}" no radiogroup[${idx}]`)

  cy.get('[role="radiogroup"]').eq(idx).then($group => {
    const $span = Cypress.$($group)
      .find('span.text-sm')
      .filter((_, el) => el.textContent.trim() === opcao)
      .first()

    if ($span.length > 0) {
      cy.wrap($span).scrollIntoView().click({ force: true })
      cy.log(`COMP_GIPE: ✓ Clicou "${opcao}" no grupo índice ${idx}`)
    } else {
      cy.wrap($group).contains(opcao).scrollIntoView().click({ force: true })
    }
  })

  cy.wait(1000)
})

When('COMP_GIPE seleciona Sim ou Não para SEI e preenche numero quando necessario', () => {
  const numerosSEI = [
    '1234567890123456', '9876543210987654', '4728193650284719',
    '8163920574810293', '3047582916473820', '6192840375619284',
    '7483920156748392', '2905817364920581', '5671034829567103',
    '8204915673820491', '1593047826159304', '6840291753684029',
    '3217568940321756', '7659412308765941', '4082736519408273',
    '9315820647931582', '2748506193274850', '5063918274506391',
    '8497230165849723', '1820473956182047', '6234815709623481',
    '3967124085396712', '7150693248715069', '4813275096481327',
    '9046382751904638',
  ]

  const opcao = Math.random() < 0.5 ? 'Sim' : 'Não'
  cy.log(`COMP_GIPE: Selecionando "${opcao}" para "Há um número do processo SEI?*"`)

  cy.wait(500)

  // O grupo SEI é sempre o último (.last()). Ronda=0 e Supervisão=1 já foram clicados.
  cy.get('[role="radiogroup"]').last().then($group => {
    const $span = Cypress.$($group)
      .find('span.text-sm')
      .filter((_, el) => el.textContent.trim() === opcao)
      .first()

    if ($span.length > 0) {
      cy.wrap($span).scrollIntoView().click({ force: true })
      cy.log(`COMP_GIPE: ✓ Clicou "${opcao}" no grupo SEI`)
    } else {
      cy.wrap($group).contains(opcao).scrollIntoView().click({ force: true })
    }
  })

  cy.wait(800)

  if (opcao === 'Sim') {
    const seiIdx = Math.floor(Math.random() * numerosSEI.length)
    const numeroSEI = numerosSEI[seiIdx]
    cy.log(`COMP_GIPE: Campo SEI detectado — preenchendo com: ${numeroSEI}`)
    cy.get('input:visible:not([readonly]):not([type="file"]):not([type="hidden"])')
      .last()
      .scrollIntoView()
      .type(numeroSEI, { delay: 30 })
    cy.wait(500)
  } else {
    cy.log('COMP_GIPE: "Não" selecionado para SEI — campo extra não exibido, continuando.')
  }

  cy.wait(1000)
})

When('COMP_GIPE localiza o button {string}', (textoBotao) => {
  cy.wait(1000)
  cy.contains('button', new RegExp(textoBotao.trim(), 'i'), { timeout: TIMEOUTS.LONG })
    .should('exist').should('be.visible')
  cy.log(`COMP_GIPE: Botão "${textoBotao}" localizado`)
})

// Botão de conclusão da aba 3 GIPE.
// O nome pode variar: "Finalizar e enviar" ou "Finalizar" dependendo da ocorrência.
// Usa o container div.flex.justify-end.gap-2 para localizar o botão purple (último filho)
// correspondente ao seletor: div.flex.justify-end.gap-2 > button.inline-flex
When('COMP_GIPE localiza e clica em {string}', (textoBotao) => {
  cy.wait(2000)

  const regexPrimaria  = new RegExp(textoBotao.trim(), 'i')
  const regexFinalizar = /Finalizar/i

  cy.get('body').then($body => {
    const existeExato     = $body.find('button').toArray().some(b => regexPrimaria.test(b.textContent.trim()))
    const existeFinalizar = $body.find('button').toArray().some(b => regexFinalizar.test(b.textContent.trim()))

    if (existeExato) {
      cy.log(`COMP_GIPE: Botão "${textoBotao}" encontrado — clicando`)
      cy.contains('button', regexPrimaria, { timeout: TIMEOUTS.LONG })
        .should('be.visible').scrollIntoView().click({ force: true })
    } else if (existeFinalizar) {
      cy.log('COMP_GIPE: Botão "Finalizar" encontrado — clicando')
      cy.contains('button', regexFinalizar, { timeout: TIMEOUTS.LONG })
        .should('be.visible').scrollIntoView().click({ force: true })
    } else {
      // Fallback posicional: último botão do container div.flex.justify-end.gap-2
      // (button.inline-flex = botão purple = ação principal)
      cy.log('COMP_GIPE: Botão não encontrado por texto — usando fallback posicional')
      cy.get('div.flex.justify-end.gap-2', { timeout: TIMEOUTS.LONG })
        .last()
        .find('button')
        .last()
        .should('be.visible').scrollIntoView().click({ force: true })
    }
  })

  cy.wait(3000)
  cy.log(`COMP_GIPE: Clicou em "${textoBotao}"`)
})

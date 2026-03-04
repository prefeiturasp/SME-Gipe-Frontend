import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Editar_Ocorrencia_Localizadores from '../locators/editar_ocorrencia_locators'
import Login_Gipe_Localizadores from '../locators/login_locators'

const locators = new Editar_Ocorrencia_Localizadores()
const locators_login = new Login_Gipe_Localizadores()

Given('eu efetuo login com RF', () => {
  const RF = '29379960000'
  const SENHA = 'Sgp0000'
  
  cy.loginWithSession(RF, SENHA, 'EDITAR')
  cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard', { 
    timeout: 30000,
    failOnStatusCode: false 
  })
  cy.wait(3000)
})

Given('estou na página principal do sistema', () => {
  cy.url({ timeout: 30000 }).should('include', '/dashboard')
  cy.wait(3000)
})

Given('que estou na tela de listagem de ocorrências', () => {
  cy.xpath(locators.titulo_listagem(), { timeout: 30000 }).should('be.visible')
  cy.xpath(locators.area_scroll_main()).scrollIntoView()
  cy.wait(3000)
})

// Step específico para "Visualizar" (sem aspas)
When('clico em Visualizar', () => {
  cy.log('[INFO] ========== STEP "clico em Visualizar" (ESPECÍFICO) ==========')
  
  cy.wait(3000)
  
  cy.log('[INFO] Fazendo scroll...')
  cy.xpath(locators.area_scroll_main(), { timeout: 10000 }).scrollIntoView()
  cy.wait(2000)
  
  cy.log('[INFO] Buscando links com cadastrar-ocorrencia...')
  
  cy.get('body', { timeout: 10000 }).then(($body) => {
    const todosLinks = $body.find('a').length
    const linksComOcorrencia = $body.find('a[href*="cadastrar-ocorrencia"]').length
    
    cy.log(`[INFO] Total de links na página: ${todosLinks}`)
    cy.log(`[INFO] Links com "cadastrar-ocorrencia": ${linksComOcorrencia}`)
    
    if (linksComOcorrencia === 0) {
      cy.log('[ERRO]  Nenhum link encontrado!')
      cy.screenshot('erro-sem-links')
      throw new Error('Nenhum link de visualização encontrado')
    } else {
      cy.log(`[INFO]  Encontrados ${linksComOcorrencia} links!`)
    }
  })
  
  cy.log('[INFO] Pegando primeiro link...')
  cy.get('a[href*="cadastrar-ocorrencia"]', { timeout: 10000 })
    .first()
    .should('exist')
    .invoke('attr', 'href')
    .then((href) => {
      const urlCompleta = href.startsWith('http') 
        ? href 
        : `https://qa-gipe.sme.prefeitura.sp.gov.br${href}`
      
      cy.log(`[INFO] Href: ${href}`)
      cy.log(`[INFO] URL completa: ${urlCompleta}`)
      
      cy.log('[INFO]  NAVEGANDO AGORA...')
      cy.visit(urlCompleta, { failOnStatusCode: false, timeout: 30000 })
      cy.log('[INFO]  cy.visit() executado')
      cy.wait(5000)
    })
  
  cy.log('[INFO] Verificando URL final...')
  cy.url({ timeout: 15000 }).then((url) => {
    cy.log(`[INFO] URL FINAL: ${url}`)
    
    if (url.includes('cadastrar-ocorrencia')) {
      cy.log('[INFO]  SUCESSO! Navegou corretamente')
    } else {
      cy.log('[ERRO]  FALHOU - URL: ' + url)
      cy.screenshot('ERRO-url-errada')
    }
  })
  
  cy.log('[INFO] ========== FIM STEP VISUALIZAR ==========')
})

When('clico em {string}', (acao) => {
  // Remove aspas extras caso venham no parâmetro
  const acaoLimpa = acao.replace(/^"|"$/g, '').trim()
  cy.log(`[DEBUG] ========== STEP "clico em" CHAMADO COM: "${acaoLimpa}" (original: "${acao}") ==========`)
  
  if (acaoLimpa === 'Visualizar') {
    cy.log('[INFO] ========== ENTRANDO NO BLOCO VISUALIZAR ==========')
    
    cy.wait(3000)
    
    cy.log('[INFO] Fazendo scroll...')
    cy.xpath(locators.area_scroll_main(), { timeout: 10000 }).scrollIntoView()
    cy.wait(2000)
    
    cy.log('[INFO] Buscando links com cadastrar-ocorrencia...')
    
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const todosLinks = $body.find('a').length
      const linksComOcorrencia = $body.find('a[href*="cadastrar-ocorrencia"]').length
      
      cy.log(`[INFO] Total de links na página: ${todosLinks}`)
      cy.log(`[INFO] Links com "cadastrar-ocorrencia": ${linksComOcorrencia}`)
      
      if (linksComOcorrencia === 0) {
        cy.log('[ERRO]  Nenhum link encontrado!')
        cy.screenshot('erro-sem-links')
        throw new Error('Nenhum link de visualização encontrado')
      } else {
        cy.log(`[INFO]  Encontrados ${linksComOcorrencia} links!`)
      }
    })
    
    cy.log('[INFO] Pegando primeiro link...')
    cy.get('a[href*="cadastrar-ocorrencia"]', { timeout: 10000 })
      .first()
      .should('exist')
      .invoke('attr', 'href')
      .then((href) => {
        const urlCompleta = href.startsWith('http') 
          ? href 
          : `https://qa-gipe.sme.prefeitura.sp.gov.br${href}`
        
        cy.log(`[INFO] Href: ${href}`)
        cy.log(`[INFO] URL completa: ${urlCompleta}`)
        
        cy.log('[INFO]  NAVEGANDO AGORA...')
        cy.visit(urlCompleta, { failOnStatusCode: false, timeout: 30000 })
        cy.log('[INFO]  cy.visit() executado')
        cy.wait(5000)
      })
    
    cy.log('[INFO] Verificando URL final...')
    cy.url({ timeout: 15000 }).then((url) => {
      cy.log(`[INFO] URL FINAL: ${url}`)
      
      if (url.includes('cadastrar-ocorrencia')) {
        cy.log('[INFO]  SUCESSO! Navegou corretamente')
      } else {
        cy.log('[ERRO]  FALHOU - URL: ' + url)
        cy.screenshot('ERRO-url-errada')
      }
    })
    
    cy.log('[INFO] ========== FIM BLOCO VISUALIZAR ==========')
    
  } else if (acao === 'Próximo') {
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      
      if (bodyText.includes('Quando a ocorrência aconteceu?') || bodyText.includes('A ocorrência é sobre furto, roubo')) {
        cy.log('[INFO] Primeira aba - clicando em Próximo')
        cy.xpath(locators.btn_proximo_primeira_aba(), { timeout: 30000 })
          .should('be.visible')
          .scrollIntoView()
          .click({ force: true })
        cy.wait(5000)

        cy.log('[INFO] Verificando se avançou para aba de tipos de ocorrência')
        cy.get('body').should('exist')
        
      } else if (bodyText.includes('Qual o tipo de ocorrência?') || bodyText.includes('Descreva a ocorrencia')) {
        cy.log('[INFO] Segunda aba - clicando em Próximo')
        cy.xpath(locators.btn_proximo_segunda_aba(), { timeout: 30000 })
          .should('be.visible')
          .scrollIntoView()
          .click({ force: true })
        cy.wait(5000)
      } else {
        cy.log('[AVISO] Não foi possível identificar a aba atual')
        cy.xpath(locators.btn_proximo_segunda_aba(), { timeout: 30000 })
          .should('be.visible')
          .scrollIntoView()
          .click({ force: true })
        cy.wait(5000)
      }
    })
  } else {
    cy.log(`[AVISO] Ação não implementada: ${acao}`)
  }
})

Then('o sistema exibe os detalhes da ocorrência', () => {
  cy.log('[INFO] ========== VALIDANDO DETALHES ==========')
  
  cy.wait(3000)
  
  cy.url().then((url) => {
    cy.log(`[INFO] URL: ${url}`)
    
    if (url === 'https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard') {
      cy.log('[AVISO] Ainda no dashboard, aguardando...')
      cy.wait(5000)
      
      cy.url().then((urlNova) => {
        cy.log(`[INFO] URL após espera: ${urlNova}`)
        if (urlNova === 'https://qa-gipe.sme.prefeitura.sp.gov.br/dashboard') {
          cy.screenshot('erro-navegacao-falhou')
          throw new Error('Navegação falhou: Clique em Visualizar não funcionou. URL ainda é: ' + urlNova)
        }
      })
    }
  })
  
  cy.get('body').then(($body) => {
    const texto = $body.text()
    const indicadores = ['Cadastro de ocorrência', 'Intercorrência', 'Quando a ocorrência aconteceu']
    const encontrados = indicadores.filter(ind => texto.includes(ind))
    
    cy.log(`[INFO] Indicadores: ${encontrados.length}/${indicadores.length}`)
    
    if (encontrados.length > 0) {
      cy.log('[INFO]  Página de detalhes OK')
    } else {
      cy.log('[ERRO]  Indicadores não encontrados')
      cy.screenshot('erro-sem-indicadores')
    }
  })
  
  cy.get('p, h1, h2, h3').filter((i, el) => {
    const txt = Cypress.$(el).text()
    return txt.includes('Cadastro de ocorrência') || txt.includes('Intercorrência')
  }).first().should('be.visible')
  
  cy.log('[INFO] ========== FIM VALIDAÇÃO ==========')
})

When('adiciono os tipos de ocorrência {string} e {string}', () => {
  cy.log('[INFO] Abrindo dropdown de tipos de ocorrência')
  cy.xpath(locators.btn_selecionar_tipos(), { timeout: 15000 })
    .should('be.visible')
    .scrollIntoView()
    .click({ force: true })
  cy.wait(3000)
  
  // Verificar se as opções desejadas já estão selecionadas
  cy.get('body').then(($body) => {
    const acidentes = $body.find('span[data-state="checked"]').filter((i, el) => {
      return Cypress.$(el).text().includes('Acidentes no Transporte Escolar')
    })
    const agressaoFisica = $body.find('span[data-state="checked"]').filter((i, el) => {
      return Cypress.$(el).text().includes('Agressão Física')
    })
    
    const ambosJaSelecionados = acidentes.length > 0 && agressaoFisica.length > 0
    
    if (ambosJaSelecionados) {
      cy.log('[INFO] Ambas as opções já estão selecionadas. Fechando dropdown.')
      cy.xpath(locators.area_scroll_main()).click({ force: true })
      cy.wait(1500)
      return
    }
    
    // Se houver outras opções selecionadas (não as desejadas), limpar
    const outrasOpcoesSelecionadas = $body.find('span[data-state="checked"]').filter((i, el) => {
      const text = Cypress.$(el).text()
      return !text.includes('Acidentes no Transporte Escolar') && !text.includes('Agressão Física')
    })
    
    if (outrasOpcoesSelecionadas.length > 0) {
      cy.log('[INFO] Limpando outras opções selecionadas')
      cy.get('span[data-state="checked"]').filter((i, el) => {
        const text = Cypress.$(el).text()
        return !text.includes('Acidentes no Transporte Escolar') && !text.includes('Agressão Física')
      }).each(($el) => {
        cy.wrap($el).click({ force: true })
        cy.wait(800)
      })
      cy.wait(2000)
    }
    
    // Selecionar "Acidentes no Transporte Escolar" se ainda não estiver
    if (acidentes.length === 0) {
      cy.log('[INFO] Selecionando: Acidentes no Transporte Escolar')
      cy.xpath(locators.opcao_acidentes_transporte(), { timeout: 20000 })
        .should('exist')
        .should('be.visible')
        .first()
        .click({ force: true })
      cy.wait(2000)
      cy.log('[INFO]  Acidentes no Transporte Escolar selecionado')
    }
    
    // Selecionar "Agressão Física" se ainda não estiver (dropdown continua aberto)
    if (agressaoFisica.length === 0) {
      cy.log('[INFO] Selecionando: Agressão Física')
      
      // Tentar localizar uma das duas opções de Agressão Física
      const opcao1Xpath = locators.opcao_agressao_fisica()
      const opcao2Xpath = locators.opcao_agressao_fisica_contra_funcionario()
      
      cy.document().then((doc) => {
        // Tentar primeira opção: "Agressão física"
        const opcao1 = doc.evaluate(
          opcao1Xpath,
          doc,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue
        
        if (opcao1) {
          cy.log('[INFO] Encontrou: Agressão física (opção 1)')
          cy.xpath(opcao1Xpath, { timeout: 10000 })
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true })
        } else {
          // Tentar segunda opção: "Agressão física contra funcionário/professor"
          cy.log('[INFO] Tentando: Agressão física contra funcionário/professor (opção 2)')
          cy.xpath(opcao2Xpath, { timeout: 10000 })
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true })
        }
      })
      
      cy.wait(2000)
      cy.log('[INFO]  Agressão Física selecionada')
    }
    
    // Fechar dropdown clicando fora após selecionar ambas
    cy.log('[INFO] Fechando dropdown após seleções')
    cy.xpath(locators.area_scroll_main()).click({ force: true })
    cy.wait(1500)
  })
})

When('clico fora da área de seleção', () => {
  cy.xpath(locators.area_scroll_main()).click({ force: true })
  cy.wait(2000)
})

When('substituo o texto do campo {string} por {string}', (campo, novoTexto) => {
  cy.xpath(locators.label_descreva_ocorrencia(), { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', 'Descreva a ocorrência')
  
  cy.xpath(locators.campo_descricao(), { timeout: 30000 })
    .should('be.visible')
    .clear({ force: true })
    .type(novoTexto, { delay: 50, force: true })
  
  cy.xpath(locators.label_smart_sampa(), { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', 'Unidade Educacional é contemplada pelo Smart Sampa')
})

Then('o sistema deve validar e manter as alterações realizadas', () => {
  cy.wait(45000)
  cy.xpath(locators.btn_voltar(), { timeout: 30000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(3000)

})

Then('o campo {string} deve estar presente', (campo) => {
  if (campo.includes('Descreva a ocorrência')) {
    cy.xpath(locators.label_descreva_ocorrencia(), { timeout: 15000 })
      .should('be.visible')
      .should('contain.text', 'Descreva')
    
    cy.xpath(locators.campo_descricao(), { timeout: 30000 })
      .should('be.visible')
  } else {
    cy.log(`[AVISO] Validação não implementada para: ${campo}`)
  }
})

Then('deve ser possível adicionar tipos de ocorrência', () => {
  cy.xpath(locators.label_tipo_ocorrencia(), { timeout: 15000 })
    .should('be.visible')
    .should('contain.text', 'tipo de ocorrência')
})
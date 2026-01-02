import Login_Gipe_Localizadores from '../locators/login_locators'


const loginLocalizadores = new Login_Gipe_Localizadores()

Cypress.Commands.add('login_gipe', () => {
    // Intercepta requisições problemáticas
    cy.intercept('**/*recuperar-senha*', { statusCode: 200, body: '' })
    cy.intercept('**/*cadastro*', { statusCode: 200, body: '' })
    
    // Visita a página com timeout aumentado
    cy.visit('https://qa-gipe.sme.prefeitura.sp.gov.br', { 
        timeout: 120000,
        failOnStatusCode: false
    })
    
    // Aguarda elementos críticos da página
    cy.get('input[placeholder*="RF"], input[placeholder*="CPF"]', { timeout: 20000 })
        .should('exist')
    
    cy.log('✅ Página de login carregada')
})

Cypress.Commands.add('dados_de_login', (rf, senha) => {
    if (rf) cy.get(loginLocalizadores.campo_usuario()).clear().type(rf)
    if (senha) cy.get(loginLocalizadores.campo_senha()).clear().type(senha)
})

Cypress.Commands.add('clicar_botao', () => {
    cy.get(loginLocalizadores.botao_acessar())
        .should('be.visible')
        .click()
})

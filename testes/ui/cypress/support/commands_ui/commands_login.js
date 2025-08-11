import Login_Gipe_Localizadores from '../locators/login_locators'


const loginLocalizadores = new Login_Gipe_Localizadores()

Cypress.Commands.add('login_gipe', () => {
    cy.visit('/')
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

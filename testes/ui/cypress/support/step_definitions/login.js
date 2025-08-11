import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../locators/login_locators'

const locators = new Login_Gipe_Localizadores()

Given('que eu acesso o sistema', () => {
    cy.login_gipe()
})

When('eu insiro o RF {string} e senha {string} válidos', (rf, senha) => {
    cy.get(locators.campo_usuario()).type(rf)
    cy.get(locators.campo_senha()).type(senha)
})

When('clico no botão de acessar', () => {
    cy.get('button').filter((_, el) => el.innerText.trim() === 'Acessar').click()
})

Then('o resultado esperado para {string} deve ser exibido', (cenario) => {
    if (cenario === 'Login válido padrão') {
        // Valida login com sucesso
        cy.url().should('include', '/dashboard')
    } else if (cenario === 'Login inválido') {
        // Valida mensagem de erro
        cy.get('div').filter((_, el) => el.innerText.trim() === 'Usuário e/ou senha inválida')
          .should('be.visible')
    } else {
        throw new Error(`Cenário não tratado: ${cenario}`)
    }
})

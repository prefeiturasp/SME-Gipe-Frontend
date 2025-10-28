import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../locators/login_locators'
import Cadastro_ocorrencias_Localizadores from '../locators/cadastro_ocorrencias_locators'

const locators = new Login_Gipe_Localizadores()
const locators_ocorrencias = new Cadastro_ocorrencias_Localizadores()

Given("que o usuário realizou o login com sucesso", () => {
  cy.login_gipe()
  cy.get(locators.campo_usuario()).type('39411157076')
  cy.get(locators.campo_senha()).type('Ruby@142107')
  cy.get('button').filter((_, el) => el.innerText.trim() === 'Acessar').click()
  cy.url().should("include", "/dashboard");
});

Given("o usuário está na página principal do sistema", () => {
  cy.url().should("include", "/dashboard");
});

Then("o sistema deve mostrar a listagem de ocorrências cadastradas no sistema", () => {
  cy.get('h1').contains('Intercorrências Institucionais').should('be.visible');
});

Given("que o usuário está na página de listagem de ocorrências", () => {
  cy.url().should("include", "/dashboard");
});

When("o usuário clica no botão nova ocorrência", () => {
  cy.xpath(locators_ocorrencias.btn_nova_ocorrencia()).click()
  
});

When("o usuário preenche os campos da ocorrência", () => {
  cy.get(locators_ocorrencias.input_data_ocorrencia()).type('2025-10-07')
});

Then("o sistema deve cadastrar uma nova ocorrência no sistema", () => {
  cy.url().should("include", "/dashboard");
});
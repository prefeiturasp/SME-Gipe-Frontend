import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import Login_Gipe_Localizadores from '../locators/login_locators'
import Alterar_Senha_Localizadores from '../locators/alterar_senha_locators';

const locators = new Login_Gipe_Localizadores()
const locators_alterar_senha = new Alterar_Senha_Localizadores()

Given("que o usuário realizou o login com sucesso", () => {
  cy.login_gipe()
  cy.get(locators.campo_usuario()).type('7210418')
  cy.get(locators.campo_senha()).type('Sgp0418')
  cy.get('button').filter((_, el) => el.innerText.trim() === 'Acessar').click()
  cy.url().should("include", "/dashboard");
});

Given("o usuário está na página principal do sistema", () => {
  cy.url().should("include", "/dashboard");
});

When("o usuário clica no botão {string}", () => {
  cy.xpath(locators_alterar_senha.link_alterar_senha()).click();
});

When("clica no botão {string}", () => {
  cy.xpath(locators_alterar_senha.botao_alterar_senha()).click();
});

When("o usuário preenche o campo Senha atual com {string}", (valor) => {
  cy.get(locators_alterar_senha.input_senha_atual(valor))
    .type(valor, { delay: 0 });
});

When("o usuário preenche o campo Nova senha com {string}", (valor) => {
  cy.get(locators_alterar_senha.input_nova_senha(valor))
    .type(valor, { delay: 0 });
});

When("o usuário preenche o campo Confirmação da nova senha com {string}", (valor) => {
  cy.get(locators_alterar_senha.input_confirmar_nova_senha(valor))
    .type(valor, { delay: 0 });
});

When("o usuário clica no botão Salvar Senha", () => {
    cy.xpath(locators_alterar_senha.button_salvar_senha()).click();
});

Then("o sistema cadastrar uma nova senha para o usuário", () => {
    cy.xpath(locators_alterar_senha.alerta_mensagem(), { timeout: 20000 })
    .should("be.visible");
});


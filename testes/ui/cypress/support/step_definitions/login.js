import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import Cadastro_Localizadores from '../locators/cadastro_locators';

const locators = new Cadastro_Localizadores();

// -------- Contexto --------
Given('que o usuário está na página de cadastro', () => {
  cy.visit('/cadastro');
});

When('o usuário seleciona o campo "Selecione a DRE" com {string}', (dre) => {
  cy.xpath(locators.select_dre()).click();
  cy.contains(dre).click();
});

When('o usuário seleciona o campo "Digite o nome da UE" com {string}', (ue) => {
  cy.xpath(locators.select_ue()).click();
  cy.contains(ue).click();
});

// -------- Preenchimento --------
When('o usuário preenche o campo "Qual o seu nome completo" com {string}', (nome) => {
  cy.get(locators.input_nome_completo()).type(nome);
});

When('o usuário preenche o campo "Qual o seu CPF" com {string}', (cpf) => {
  cy.xpath(locators.input_cpf()).type(cpf);
});

When('o usuário clica no botão Avançar', () => {
  cy.xpath(locators.proxima_etapa_form()).click();
});

When('o usuário preenche o campo "Qual o seu e-mail?" com {string}', (email) => {
  cy.get(locators.input_email()).type(email);
});

When('o usuário preenche o campo "Nova Senha" com {string}', (senha) => {
  cy.get(locators.input_nova_senha()).type(senha);
});

When('o usuário preenche o campo "Confirmação da nova senha" com {string}', (senha) => {
  cy.get(locators.input_confirmacao_senha()).type(senha);
});

When('clica no botão "Cadastrar agora" na tela de cadastro', () => {
  cy.xpath(locators.cadastrar_agora_form()).click();
});

// -------- Validações --------
Then('o sistema deve exibir a mensagem {string}', (mensagem) => {
  if (mensagem === 'Já existe uma conta com este CPF.') {
    cy.xpath(locators.CPF_ja_cadastrado()).should('be.visible');
  } else if (mensagem === 'Este e-mail já está cadastrado.') {
    cy.xpath(locators.mensagem_email_ja_cadastrado()).should('be.visible');
  } else {
    throw new Error(`Mensagem não tratada: ${mensagem}`);
  }
});
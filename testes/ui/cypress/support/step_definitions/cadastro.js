import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import Cadastro_Localizadores from '../locators/cadastro_locators';

const loc = new Cadastro_Localizadores();

// ------------------------
// DRE (mantido igual)
// ------------------------
function selecionarDropdownDRE(botaoXPath, valor) {
  cy.xpath(botaoXPath).click({ force: true });

  cy.xpath(botaoXPath)
    .type(valor.charAt(0), { force: true });

  cy.get('body')
    .contains('option', valor, { timeout: 15000 })
    .then($opt => {
      if ($opt.length) {
        cy.wrap($opt).click({ force: true });
      } else {
        throw new Error(`Opção "${valor}" não encontrada no dropdown DRE.`);
      }
    });
}

// ------------------------
// UE (nova lógica usando data-value)
// ------------------------
function selecionarDropdownUE(botaoXPath, valor) {
  cy.xpath(botaoXPath).click({ force: true });

  cy.get('div[data-state="open"]', { timeout: 15000 })
    .should('be.visible')
    .within(() => {
      cy.get(`[data-value="${valor}"]`, { timeout: 15000 })
        .should('be.visible')
        .click({ force: true })
        .should('have.attr', 'data-value', valor);
    });
}

// ------------------------
// Steps do Cucumber
// ------------------------
Given('que o usuário está na página de cadastro', () => {
  cy.cadastro_gipe();
});

When('o usuário seleciona o campo {string} com {string}', (campo, valor) => {
  switch (campo) {
    case 'Selecione a DRE':
      selecionarDropdownDRE(loc.select_dre(), valor);
      break;
    case 'Digite o nome da UE':
      selecionarDropdownUE(loc.select_ue(), valor);
      break;
    default:
      throw new Error(`Campo de seleção não mapeado: ${campo}`);
  }
});

When('o usuário preenche o campo {string} com {string}', (campo, valor) => {
  switch (campo) {
    case 'Qual o seu nome completo':
      cy.get(loc.input_nome_completo())
        .scrollIntoView()
        .should('be.visible')
        .clear()
        .type(valor);
      break;

    case 'Qual o seu CPF':
      cy.xpath(loc.input_cpf())
        .scrollIntoView()
        .should('be.visible')
        .clear()
        .type(valor, { delay: 50 });
      break;

    default:
      throw new Error(`Campo de texto não mapeado: ${campo}`);
  }
});

When('o usuário clica no botão Avançar', () => {
  cy.xpath(loc.proxima_etapa_form())
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true });
});

Then('o sistema deve mostrar a próxima tela para continuar o cadastro', () => {
  cy.url().should('include', '/cadastro');
});
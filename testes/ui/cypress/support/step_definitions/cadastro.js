import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import Cadastro_Localizadores from '../locators/cadastro_locators';

const loc = new Cadastro_Localizadores();

// ---------- Funções de apoio ----------
function selecionarDropdownDRE(botaoXPath, valor) {
  cy.xpath(botaoXPath).click({ force: true });
  cy.xpath(botaoXPath).type(valor.charAt(0), { force: true });

  cy.get('body')
    .contains('option', valor, { timeout: 15000 })
    .then($opt => {
      if ($opt.length) cy.wrap($opt).click({ force: true });
      else throw new Error(`Opção "${valor}" não encontrada no dropdown DRE.`);
    });
}

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

function digitaCSS(selector, valor, timeout = 30000) {
  cy.get(selector, { timeout })
    .should('exist')
    .should('be.visible')
    .scrollIntoView()
    .clear({ force: true })
    .type(valor, { delay: 0 });
}

function digitaXPath(xpath, valor, timeout = 30000) {
  cy.xpath(xpath, { timeout })
    .should('exist')
    .should('be.visible')
    .scrollIntoView()
    .clear({ force: true })
    .type(valor, { delay: 0 });
}

Given('que o usuário está na página de cadastro', () => {
  cy.cadastro_gipe();
  cy.timeout(30000);
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
      digitaCSS(loc.input_nome_completo(), valor);
      break;

    case 'Qual o seu CPF':
      digitaXPath(loc.input_cpf(), valor, 30000);
      break;

    case 'Qual o seu e-mail?':
      digitaCSS(loc.input_email(), valor, 45000);
      break;

    case 'Nova Senha':
      digitaCSS(loc.input_nova_senha(), valor, 45000);
      break;

    case 'Confirmação da nova senha':
      digitaCSS(loc.input_confirmacao_senha(), valor, 45000);
      break;

    default:
      throw new Error(`Campo de texto não mapeado: ${campo}`);
  }
});

When('o usuário clica no botão Avançar', () => {
  cy.xpath(loc.proxima_etapa_form(), { timeout: 20000 })
    .should('be.visible')
    .click({ force: true });

  cy.get(loc.input_email(), { timeout: 45000 }).should('exist');
});

Then('o sistema deve mostrar a próxima tela para continuar o cadastro', () => {
  cy.url({ timeout: 30000 }).should('include', '/cadastro');
});
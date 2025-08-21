import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import Cadastro_Localizadores from '../locators/cadastro_locators';

const loc = new Cadastro_Localizadores();

// ---------- Funções de apoio ----------

function selecionarDropdownDRE(botaoXPath, valor) {
  const tentarSelecionar = () => {
    cy.xpath(botaoXPath, { timeout: 60000 })
      .should('be.visible')
      .click({ force: true });

    cy.xpath(botaoXPath).type(valor.charAt(0), { force: true });

    cy.get('body', { timeout: 60000 })
      .contains('option', valor)
      .then($opt => {
        if ($opt.length) {
          cy.wrap($opt).scrollIntoView().click({ force: true });
          cy.xpath(botaoXPath).should('contain.text', valor);
        } else {
          // tenta abrir novamente se não encontrou
          cy.xpath(botaoXPath, { timeout: 60000 })
            .click({ force: true });
          cy.get('body', { timeout: 60000 })
            .contains('option', valor)
            .scrollIntoView()
            .click({ force: true });
          cy.xpath(botaoXPath).should('contain.text', valor);
        }
      });
  };

  tentarSelecionar();
}

function selecionarDropdownUE(botaoXPath, valor) {
  const tentarSelecionar = () => {
    cy.xpath(botaoXPath, { timeout: 60000 })
      .should('be.visible')
      .then(($btn) => {
        if ($btn.attr('data-state') === 'closed') {
          cy.wrap($btn).click({ force: true });
        }
      });

    cy.get(`[data-value="${valor}"]`, { timeout: 100000 })
      .then($opt => {
        if ($opt.length && $opt.is(':visible')) {
          cy.wrap($opt).scrollIntoView().click({ force: true });
        } else {
          // tenta abrir novamente se não encontrou
          cy.xpath(botaoXPath, { timeout: 100000 })
            .click({ force: true });
          cy.get(`[data-value="${valor}"]`, { timeout: 100000 })
            .scrollIntoView()
            .click({ force: true });
        }
      });

    cy.xpath(botaoXPath)
      .should('contain.text', valor);
  };

  tentarSelecionar();
}

function digitaCSS(selector, valor, timeout = 60000) {
  cy.get(selector, { timeout })
    .should('exist')
    .should('be.visible')
    .scrollIntoView()
    .clear({ force: true })
    .type(valor, { delay: 0 });
}

function digitaXPath(xpath, valor, timeout = 60000) {
  cy.xpath(xpath, { timeout })
    .should('exist')
    .should('be.visible')
    .scrollIntoView()
    .clear({ force: true })
    .type(valor, { delay: 0 });
}

Given('que o usuário está na página de cadastro', () => {
  cy.cadastro_gipe();
});

When('o usuário seleciona o campo {string} com {string}', (campo, valor) => {
  switch (campo) {
    case 'Selecione a DRE':
      cy.wait(2000)
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
      digitaXPath(loc.input_cpf(), valor, 60000);
      break;

    case 'Qual o seu e-mail?':
      digitaCSS(loc.input_email(), valor, 60000);
      break;

    case 'Nova Senha':
      digitaCSS(loc.input_nova_senha(), valor, 60000);
      break;

    case 'Confirmação da nova senha':
      digitaCSS(loc.input_confirmacao_senha(), valor, 60000);
      break;

    default:
      throw new Error(`Campo de texto não mapeado: ${campo}`);
  }
});

When('o usuário clica no botão Avançar', () => {
  cy.xpath(loc.proxima_etapa_form(), { timeout: 60000 })
    .should('be.visible')
    .click({ force: true });

  cy.get(loc.input_email(), { timeout: 60000 }).should('exist');
});

Then('o sistema deve mostrar a próxima tela para continuar o cadastro', () => {
  cy.url({ timeout: 60000 }).should('include', '/cadastro');
});
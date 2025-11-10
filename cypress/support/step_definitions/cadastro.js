import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps';
import Cadastro_Localizadores from '../locators/cadastro_locators';

const loc = new Cadastro_Localizadores();

// ---------- Hooks ----------

Before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.log('🔄 Iniciando cenário - ambiente limpo');
});

After(() => {
  cy.log('✅ Cenário finalizado');
});

// ---------- Funções de apoio ----------

function selecionarDropdownDRE(botaoXPath, valor) {
  cy.xpath(botaoXPath, { timeout: 60000 })
    .should('be.visible')
    .click({ force: true });

  cy.xpath(botaoXPath).type(valor.charAt(0), { force: true });

  cy.get('body', { timeout: 60000 })
    .contains('option', valor)
    .then($opt => {
      if ($opt.length) {
        cy.wrap($opt).scrollIntoView().click({ force: true });
      } else {
        cy.xpath(botaoXPath, { timeout: 60000 }).click({ force: true });
        cy.get('body', { timeout: 60000 })
          .contains('option', valor)
          .scrollIntoView()
          .click({ force: true });
      }
    });

  cy.xpath(botaoXPath).should('contain.text', valor);
}

function selecionarDropdownUE(botaoXPath, valor) {
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
        cy.xpath(botaoXPath, { timeout: 100000 }).click({ force: true });
        cy.get(`[data-value="${valor}"]`, { timeout: 100000 })
          .scrollIntoView()
          .click({ force: true });
      }
    });

  cy.xpath(botaoXPath).should('contain.text', valor);
}

function digitaCSS(selector, valor, timeout = 60000) {
  cy.get(selector, { timeout })
    .should('be.visible')
    .scrollIntoView()
    .clear({ force: true })
    .type(valor, { delay: 0 });
}

function digitaXPath(xpath, valor, timeout = 60000) {
  cy.xpath(xpath, { timeout })
    .should('be.visible')
    .scrollIntoView()
    .clear({ force: true })
    .type(valor, { delay: 0 });
}

// ---------- Steps ----------

Given('que o usuário está na página de cadastro', () => {
  cy.cadastro_gipe();
});

When('o usuário seleciona o campo {string} com {string}', (campo, valor) => {
  switch (campo) {
    case 'Selecione a DRE':
      cy.wait(2000);
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
      digitaXPath(loc.input_cpf(), valor);
      break;
    case 'Qual o seu e-mail?':
      digitaCSS(loc.input_email(), valor);
      break;
    case 'Nova Senha':
      digitaCSS(loc.input_nova_senha(), valor);
      break;
    case 'Confirmação da nova senha':
      digitaCSS(loc.input_confirmacao_senha(), valor);
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

When('clica no botão "Cadastrar agora" na tela de cadastro', () => {
  cy.xpath(loc.cadastrar_agora_form(), { timeout: 60000 })
    .should('be.visible')
    .click({ force: true });

  cy.get(loc.input_email(), { timeout: 60000 }).should('exist');
});

Then('o sistema deve mostrar a próxima tela para continuar o cadastro', () => {
  cy.url({ timeout: 60000 }).should('include', '/cadastro');
});

// -------- Validações --------
Then('o sistema deve exibir a mensagem {string}', (mensagem) => {
  if (mensagem === 'Já existe uma conta com este CPF.') {
    cy.xpath(loc.CPF_ja_cadastrado()).should('be.visible');
  } else if (mensagem === 'Este e-mail já está cadastrado.') {
    cy.xpath(loc.mensagem_email_ja_cadastrado()).should('be.visible');
  } else {
    throw new Error(`Mensagem não tratada: ${mensagem}`);
  }
});

// ---------- Steps adicionais ----------
When('o usuário preenche o campo "email" com {string}', (valor) => {
  digitaCSS(loc.input_campo_email(), valor);
});

When('o usuário clica no botão cadastrar agora', () => {
  cy.xpath(loc.cadastrar_agora_form(), { timeout: 60000 })
    .should('be.visible')
    .click({ force: true });

  cy.get(loc.input_email(), { timeout: 60000 }).should('exist');
});
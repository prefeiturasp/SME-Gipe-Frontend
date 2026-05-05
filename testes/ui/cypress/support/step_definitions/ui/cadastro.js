import { Given, When, Then, Before, After } from 'cypress-cucumber-preprocessor/steps';
import Cadastro_Localizadores from '../../locators/cadastro_locators';

const loc = new Cadastro_Localizadores();

// ---------- Hooks ----------

Before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.log(' Iniciando cenário - ambiente limpo');
});

After(() => {
  cy.log(' Cenário finalizado');
});

// ---------- Funções de apoio ----------

function selecionarDropdownDRE(botaoCSS, valor) {
  // 1. Clicar no botão para abrir o dropdown
  cy.get(botaoCSS, { timeout: 60000 })
    .should('be.visible')
    .click({ force: true });

  cy.wait(3000); // Aguardar dropdown abrir completamente

  // 2. Clicar diretamente no span/texto da opção desejada
  //    O span dentro do dropdown contém o texto exato da DRE
  cy.get('body')
    .find('span, li')
    .filter(':visible')
    .then($elements => {
      // Filtrar apenas elementos cujo texto é EXATAMENTE o valor
      const alvo = [...$elements].find(el => {
        const txt = Cypress.$(el).text().trim().toUpperCase();
        return txt === valor.toUpperCase();
      });

      if (alvo) {
        cy.log(`✅ Clicando na opção: ${valor}`);
        cy.wrap(alvo).scrollIntoView().click({ force: true });
        cy.wait(1000); // Aguardar seleção ser aplicada
      } else {
        // Fallback: usar cy.contains com o seletor do span interno da opção
        cy.log(`⚠️ Tentando cy.contains com span...`);
        cy.get('body > div > div.w-full.md\\:w-1\\/2.flex.flex-col.bg-white.overflow-y-auto.justify-center > div > form > div.space-y-2.mb-4.mt-4 > button > span')
          .parent()
          .siblings()
          .contains(valor)
          .click({ force: true });
      }
    });

  // 3. Validar que o botão agora mostra a DRE selecionada
  cy.wait(2000);
  cy.get('body > div > div.w-full.md\\:w-1\\/2.flex.flex-col.bg-white.overflow-y-auto.justify-center > div > form > div.space-y-2.mb-4.mt-4 > button > span', { timeout: 10000 })
    .invoke('text')
    .then(texto => {
      const textoLimpo = texto.trim().toUpperCase();
      cy.log(`✅ DRE selecionada: ${textoLimpo}`);
      expect(textoLimpo).to.include('IPIRANGA');
    });
}

function selecionarDropdownUE(_ignorado, valor) {
  const termoBusca = valor.split(',')[0].trim(); // ex: 'ABRAO HUCK, DR.' → 'ABRAO HUCK'
  cy.log(`🔍 Buscando UE com termo: "${termoBusca}"`);

  // Localizar o campo UE pelo label — robusto, independe de nth-child
  cy.contains('label', 'Digite o nome da UE', { timeout: 20000 })
    .should('be.visible')
    .closest('div')
    .then($div => {
      const $btn = $div.find('button');
      const $input = $div.find('input');

      if ($btn.length > 0) {
        // Campo é um button que abre combobox — clicar para abrir opções
        cy.log('📦 Campo UE é um button (combobox). Clicando para abrir...');
        cy.wrap($btn.first()).scrollIntoView().click({ force: true });
        cy.wait(3000);

        // Verificar se apareceu input de busca no combobox e digitar
        cy.get('body').then($body => {
          // Procurar input dentro de um portal do combobox
          const $searchInput = $body.find('[cmdk-input], [role="combobox"] input, [aria-label*="buscar"], [aria-label*="Search"], [placeholder*="EMEF"], [placeholder*="buscar"], [placeholder*="Buscar"]');
          if ($searchInput.filter(':visible').length > 0) {
            cy.wrap($searchInput.filter(':visible').first())
              .type(termoBusca, { delay: 80 });
            cy.wait(2000);
          }
        });

        // Clicar na opção visível que contenha o termo
        cy.get('body')
          .find('li, [role="option"], [cmdk-item], [data-value]')
          .filter(':visible')
          .then($els => {
            const alvo = [...$els].find(el => {
              const txt = Cypress.$(el).text().trim().toUpperCase();
              return txt.includes(termoBusca.toUpperCase());
            });
            if (alvo) {
              cy.log(`✅ Clicando na opção UE: ${Cypress.$(alvo).text().trim()}`);
              cy.wrap(alvo).scrollIntoView().click({ force: true });
            } else {
              cy.log(`⚠️ Fallback cy.contains("${termoBusca}")`);
              cy.contains(termoBusca, { timeout: 5000 }).filter(':visible').first().scrollIntoView().click({ force: true });
            }
          });

        // Validar que o button agora exibe o valor selecionado
        cy.wait(2000);
        cy.contains('label', 'Digite o nome da UE')
          .closest('div')
          .find('button')
          .invoke('text')
          .then(txt => {
            const textoLimpo = txt.trim().toUpperCase();
            cy.log(`✅ UE selecionada: ${textoLimpo}`);
            expect(textoLimpo).to.not.be.empty;
          });

      } else if ($input.length > 0) {
        // Campo é input de autocomplete — digitar diretamente
        cy.log('✏️ Campo UE é um input (autocomplete). Digitando...');
        cy.wrap($input.first()).scrollIntoView().clear().type(termoBusca, { delay: 80 });
        cy.wait(3000);

        cy.get('body')
          .find('li, [role="option"], [cmdk-item]')
          .filter(':visible')
          .then($els => {
            const alvo = [...$els].find(el => Cypress.$(el).text().trim().toUpperCase().includes(termoBusca.toUpperCase()));
            if (alvo) {
              cy.wrap(alvo).scrollIntoView().click({ force: true });
            } else {
              cy.contains(termoBusca, { timeout: 5000 }).filter(':visible').first().click({ force: true });
            }
          });

        cy.wait(2000);
        cy.wrap($input.first()).invoke('val').then(val => {
          cy.log(`✅ UE no input: "${val}"`);
          expect(val.trim()).to.not.be.empty;
        });

      } else {
        throw new Error('❌ Campo UE não encontrado: nenhum button ou input dentro do div da label "Digite o nome da UE"');
      }
    });
}

function digitaCSS(selector, valor, timeout = 60000) {
  cy.wait(500);
  cy.get(selector, { timeout })
    .should('be.visible')
    .scrollIntoView()
    .clear({ force: true })
    .type(valor, { delay: 50 }); // delay 50ms entre teclas
}

function digitaXPath(xpath, valor, timeout = 60000) {
  cy.wait(500);
  cy.xpath(xpath, { timeout })
    .should('be.visible')
    .scrollIntoView()
    .clear({ force: true })
    .type(valor, { delay: 50 }); // delay 50ms entre teclas
}

// ---------- Steps ----------

Given('que o usuário está na página de cadastro', () => {
  cy.cadastro_gipe();
});

When('o usuário valida a existência do campo {string}', (campo) => {
  switch (campo) {
    case 'Selecione a DRE':
      cy.get(loc.label_dre(), { timeout: 60000 })
        .should('be.visible')
        .and('contain.text', 'Selecione a DRE');
      cy.log('✅ Campo "Selecione a DRE" validado');
      break;
    case 'Digite o nome da UE':
      cy.contains('label', loc.label_ue(), { timeout: 15000 })
        .should('be.visible');
      cy.log('✅ Campo "Digite o nome da UE" validado');
      break;
    default:
      throw new Error(`Validação de campo não mapeada: ${campo}`);
  }
});

When('o usuário seleciona o campo {string} com {string}', (campo, valor) => {
  switch (campo) {
    case 'Selecione a DRE':
      cy.wait(3000);
      selecionarDropdownDRE(loc.select_dre(), valor);
      cy.wait(1500);
      break;
    case 'Digite o nome da UE':
      cy.wait(2000);
      selecionarDropdownUE(loc.select_ue(), valor);
      cy.wait(1500);
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
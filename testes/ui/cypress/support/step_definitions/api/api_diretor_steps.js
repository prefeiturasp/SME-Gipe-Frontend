/// <reference types="cypress" />

import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

// ============================================================================
// STEPS ESPECÍFICOS PARA API DIRETOR
// ============================================================================

Then('a resposta deve conter intercorrências com campos obrigatórios:', (dataTable) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);

    const campos = dataTable.rawTable.slice(1).map(row => row[0]);
    const primeiraIntercorrencia = response.body[0];

    campos.forEach(campo => {
      expect(primeiraIntercorrencia).to.have.property(campo);
    });
  });
});

Then('a intercorrência deve ter uuid {string}', (expectedUuid) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('uuid', expectedUuid);
  });
});

Then('a intercorrência deve ter o campo {string}', (campo) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property(campo);
  });
});

Then('a intercorrência deve ter campo {string}', (campo) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property(campo);
  });
});

Then('as intercorrências devem ter status válidos:', (dataTable) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');

    const statusValidos = dataTable.rawTable.slice(1).map(row => row[0]);

    response.body.forEach(intercorrencia => {
      if (intercorrencia.status) {
        expect(statusValidos).to.include(intercorrencia.status);
      }
    });
  });
});

Then('as intercorrências com envolvidos devem ter:', (dataTable) => {
  const campos = dataTable.rawTable.slice(1).map((row) => row[0].trim());

  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200);
    const lista = Array.isArray(response.body) ? response.body : [];
    const comEnvolvidos = lista.filter(
      (item) => Array.isArray(item?.envolvidos) && item.envolvidos.length > 0
    );
    if (comEnvolvidos.length === 0) {
      cy.log('⚠️ Nenhuma intercorrência com envolvidos encontrada - pulando validação');
      return;
    }
    comEnvolvidos.forEach((item) => {
      item.envolvidos.forEach((env) => {
        campos.forEach((campo) => {
          const chave = campo.replace('envolvido.', '');
          expect(env, `Campo ${chave} no envolvido`).to.have.property(chave);
        });
      });
    });
  });
});

Then('cada intercorrência deve ter tipos_ocorrencia como array', () => {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200);
    const lista = Array.isArray(response.body) ? response.body : [];
    lista.forEach((intercorrencia) => {
      expect(intercorrencia).to.have.property('tipos_ocorrencia');
      expect(intercorrencia.tipos_ocorrencia).to.be.an('array');
    });
  });
});

Then('os tipos_ocorrencia devem ter os campos:', (dataTable) => {
  const campos = dataTable.rawTable.slice(1).map((row) => row[0].trim());
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200);
    const lista = Array.isArray(response.body) ? response.body : [];
    lista.forEach((intercorrencia) => {
      if (intercorrencia.tipos_ocorrencia && intercorrencia.tipos_ocorrencia.length > 0) {
        intercorrencia.tipos_ocorrencia.forEach((tipo) => {
          campos.forEach((campo) => {
            expect(tipo).to.have.property(campo);
          });
        });
      }
    });
  });
});

Then('as intercorrências com declarante devem ter:', (dataTable) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');

    const campos = dataTable.rawTable.slice(1).map(row => row[0]);

    response.body.forEach(intercorrencia => {
      if (intercorrencia.declarante_detalhes) {
        campos.forEach(campoPath => {
          const partes = campoPath.split('.');
          let valor = intercorrencia;

          partes.forEach(parte => {
            expect(valor).to.have.property(parte);
            valor = valor[parte];
          });
        });
      }
    });
  });
});

Then('os campos booleanos devem ter valores válidos:', (dataTable) => {
  cy.get('@response').then((response) => {
    const campos = dataTable.rawTable.slice(1).map(row => row[0]);

    campos.forEach(campo => {
      if (
        response.body[campo] !== null &&
        response.body[campo] !== undefined &&
        response.body[campo] !== ''
      ) {
        expect(response.body[campo]).to.be.a('boolean');
      }
    });
  });
});

Then('a resposta deve conter categorias disponíveis', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('object');
    expect(Object.keys(response.body).length).to.be.greaterThan(0);
  });
});

Then('a intercorrência deve ter {string} igual a {string}', (campo, valorEsperado) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property(campo);
    expect(response.body[campo]).to.equal(valorEsperado);
  });
});

Then('a intercorrência deve ter {string} igual a true', (campo) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property(campo, true);
  });
});

Then('a intercorrência deve ter status {string}', (expectedStatus) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('status', expectedStatus);
  });
});

Then('o protocolo deve começar com {string}', (prefixo) => {
  cy.get('@response').then((response) => {
    expect(response.body.protocolo_da_intercorrencia).to.include(prefixo);
  });
});

Then('o campo {string} deve ser um array', (campo) => {
  cy.get('@response').then((response) => {
    expect(response.body[campo]).to.be.an('array');
  });
});

Then('as motivações devem ter estrutura:', (dataTable) => {
  cy.get('@response').then((response) => {
    const campos = dataTable.rawTable.slice(1).map(row => row[0]);

    if (
      response.body.motivacao_ocorrencia_display &&
      response.body.motivacao_ocorrencia_display.length > 0
    ) {
      response.body.motivacao_ocorrencia_display.forEach(motivacao => {
        campos.forEach(campo => {
          expect(motivacao).to.have.property(campo);
        });
      });
    }
  });
});

Then('a intercorrência deve ter campos de endereço:', (dataTable) => {
  cy.get('@response').then((response) => {
    const campos = dataTable.rawTable.slice(1).map(row => row[0]);

    campos.forEach(campo => {
      expect(response.body).to.have.property(campo);
    });
  });
});

Then('as intercorrências devem ter valores válidos de comunicacao_seguranca_publica:', (dataTable) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');

    const valoresValidos = dataTable.rawTable.slice(1).map(row => row[0]);

    response.body.forEach(intercorrencia => {
      if (
        intercorrencia.comunicacao_seguranca_publica &&
        intercorrencia.comunicacao_seguranca_publica !== ''
      ) {
        expect(valoresValidos).to.include(intercorrencia.comunicacao_seguranca_publica);
      }
    });
  });
});

Then('as intercorrências devem ter valores válidos de protocolo_acionado:', (dataTable) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');

    const valoresValidos = dataTable.rawTable.slice(1).map(row => row[0]);

    response.body.forEach(intercorrencia => {
      if (intercorrencia.protocolo_acionado && intercorrencia.protocolo_acionado !== '') {
        expect(valoresValidos).to.include(intercorrencia.protocolo_acionado);
      }
    });
  });
});

Then('o status code da resposta deve ser {int} ou {int}', (status1, status2) => {
  cy.get('@response').then((response) => {
    expect([status1, status2]).to.include(response.status);
  });
});

When('eu tento acessar {string} sem token', (endpoint) => {
  const url = `${Cypress.env('API_BASE_URL') || 'https://qa-gipe.sme.prefeitura.sp.gov.br/api-intercorrencias/v1'}${endpoint}`;

  cy.request({
    method: 'GET',
    url: url,
    failOnStatusCode: false,
    timeout: 90000
  }).as('response');
});

Then('o status da resposta deve ser {int} ou {int}', (status1, status2) => {
  cy.get('@response').then((response) => {
    expect([status1, status2]).to.include(response.status);
  });
});

Then('a resposta deve conter pelo menos {int} intercorrências', (quantidadeMinima) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.at.least(quantidadeMinima);
  });
});

Then('os campos de timestamp devem ter formato ISO 8601:', (dataTable) => {
  cy.get('@response').then((response) => {
    const campos = dataTable.rawTable.slice(1).map(row => row[0]);
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

    campos.forEach(campo => {
      if (response.body[campo]) {
        expect(response.body[campo]).to.match(isoRegex);
      }
    });
  });
});

Then('cada intercorrência deve ter códigos EOL válidos', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');

    response.body.forEach(intercorrencia => {
      if (intercorrencia.unidade_codigo_eol) {
        expect(intercorrencia.unidade_codigo_eol).to.be.a('string');
      }
      if (intercorrencia.dre_codigo_eol) {
        expect(intercorrencia.dre_codigo_eol).to.be.a('string');
      }
    });
  });
});

Then('o código DRE deve ter {int} dígitos', (digitos) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');

    response.body.forEach(intercorrencia => {
      if (intercorrencia.dre_codigo_eol) {
        expect(intercorrencia.dre_codigo_eol.length).to.equal(digitos);
      }
    });
  });
});

Then('o código unidade deve ter {int} dígitos', (digitos) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');

    response.body.forEach(intercorrencia => {
      if (intercorrencia.unidade_codigo_eol) {
        expect(intercorrencia.unidade_codigo_eol.length).to.equal(digitos);
      }
    });
  });
});

Then('as intercorrências devem ter status_extra válidos:', (dataTable) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');

    const statusValidos = dataTable.rawTable.slice(1).map(row => row[0]);

    response.body.forEach(intercorrencia => {
      if (intercorrencia.status_extra) {
        expect(statusValidos).to.include(intercorrencia.status_extra);
      }
    });
  });
});

Then('a intercorrência deve ter todos os campos principais:', (dataTable) => {
  cy.get('@response').then((response) => {
    const campos = dataTable.rawTable.slice(1).map(row => row[0]);

    campos.forEach(campo => {
      expect(response.body).to.have.property(campo);
    });
  });
});

Given('que não estou autenticado', () => {
  Cypress.env('authToken', null);
  Cypress.log({ name: 'Autenticação', message: '🚫 Token removido - sem autenticação' });
});

// ============================================================================
// STEPS PARA PUT - DADOS DE ATUALIZAÇÃO
// ============================================================================

Given('que tenho dados completos para atualização de intercorrência', () => {
  cy.wrap({
    descricao_ocorrencia: 'Atualização completa da intercorrência - teste automatizado'
  }).as('dadosAtualizacao');
});

Given('que tenho dados parciais para atualização', () => {
  cy.wrap({
    descricao_ocorrencia: 'Descrição atualizada via teste automatizado',
    data_ocorrencia: '2024-01-20'
  }).as('dadosAtualizacao');
});

Given('que tenho dados para marcar como furto/roubo', () => {
  cy.wrap({
    sobre_furto_roubo_invasao_depredacao: true,
    smart_sampa_situacao: 'BO registrado',
    descricao_ocorrencia: 'Ocorrência de furto/roubo atualizada'
  }).as('dadosAtualizacao');
});

Given('que tenho informações do agressor para atualizar', () => {
  cy.wrap({
    tem_info_agressor_ou_vitima: 'sim',
    nome_pessoa_agressora: 'João Silva Teste',
    idade_pessoa_agressora: 18,
    genero_pessoa_agressora: 'Masculino',
    motivacao_ocorrencia: ['Conflito entre estudantes', 'Bullying']
  }).as('dadosAtualizacao');
});

Given('que tenho dados de comunicação de segurança', () => {
  cy.wrap({
    comunicacao_seguranca_publica: 'Guarda Civil Metropolitana',
    protocolo_acionado: 'GCM-2024-TESTE-001'
  }).as('dadosAtualizacao');
});

Given('que tenho dados de endereço completo', () => {
  cy.wrap({
    cep: '04538-133',
    logradouro: 'Avenida Brigadeiro Faria Lima',
    numero_residencia: '3477',
    complemento: 'Torre Norte',
    bairro: 'Itaim Bibi',
    cidade: 'São Paulo',
    estado: 'SP'
  }).as('dadosAtualizacao');
});

Given('que tenho dados para atualização', () => {
  cy.wrap({
    descricao_ocorrencia: 'Teste de atualização'
  }).as('dadosAtualizacao');
});

Given('que tenho dados inválidos para atualização', () => {
  cy.wrap({
    data_ocorrencia: 'data-invalida',
    idade_pessoa_agressora: 'não é número',
    sobre_furto_roubo_invasao_depredacao: 'não é booleano'
  }).as('dadosAtualizacao');
});

// ============================================================================
// STEPS PARA PUT - REQUISIÇÕES
// ============================================================================

When('eu faço uma requisição PUT para {string}', (endpoint) => {
  cy.get('@dadosAtualizacao').then((dados) => {
    cy.api_put(endpoint, dados).then((response) => {
      cy.wrap(response).as('response');
    });
  });
});

When('eu tento fazer PUT em {string} sem token', (endpoint) => {
  const tokenOriginal = Cypress.env('authToken');
  Cypress.env('authToken', null);

  cy.get('@dadosAtualizacao').then((dados) => {
    cy.api_put(endpoint, dados).then((response) => {
      cy.wrap(response).as('response');
      Cypress.env('authToken', tokenOriginal);
    });
  });
});

// ============================================================================
// STEPS PARA PUT - VALIDAÇÕES
// ============================================================================

Then('a resposta deve conter o uuid da intercorrência', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('uuid');
    expect(response.body.uuid).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});

Then('a intercorrência deve ter os dados atualizados', () => {
  cy.get('@response').then((response) => {
    cy.get('@dadosAtualizacao').then((dadosEnviados) => {
      Object.keys(dadosEnviados).forEach(campo => {
        expect(response.body).to.have.property(campo);
      });
    });
  });
});

Then('a descrição deve estar atualizada', () => {
  cy.get('@response').then((response) => {
    cy.get('@dadosAtualizacao').then((dados) => {
      expect(response.body.descricao_ocorrencia).to.equal(dados.descricao_ocorrencia);
    });
  });
});

Then('o campo {string} deve ser true', (campo) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property(campo);
    expect(response.body[campo]).to.be.true;
  });
});

Then('deve ter campo {string}', (campo) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property(campo);
    expect(response.body[campo]).to.not.be.null;
  });
});

Then('o campo {string} deve ser {string}', (campo, valorEsperado) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property(campo);

    let valorComparar = valorEsperado;
    if (valorEsperado === 'true') valorComparar = true;
    if (valorEsperado === 'false') valorComparar = false;

    expect(response.body[campo]).to.equal(valorComparar);
  });
});

Then('deve ter o nome do agressor preenchido', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('nome_pessoa_agressora');
    expect(response.body.nome_pessoa_agressora).to.be.a('string');
    expect(response.body.nome_pessoa_agressora.length).to.be.greaterThan(0);
  });
});

Then('deve ter a idade do agressor preenchida', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('idade_pessoa_agressora');
    expect(response.body.idade_pessoa_agressora).to.be.a('number');
    expect(response.body.idade_pessoa_agressora).to.be.greaterThan(0);
  });
});

Then('o campo {string} deve estar atualizado', (campo) => {
  cy.get('@response').then((response) => {
    cy.get('@dadosAtualizacao').then((dados) => {
      expect(response.body).to.have.property(campo);
      if (dados[campo] !== undefined) {
        expect(response.body[campo]).to.equal(dados[campo]);
      }
    });
  });
});

Then('todos os campos de endereço devem estar preenchidos', () => {
  cy.get('@response').then((response) => {
    const camposEndereco = ['cep', 'logradouro', 'numero_residencia', 'bairro', 'cidade', 'estado'];

    camposEndereco.forEach(campo => {
      expect(response.body).to.have.property(campo);
      expect(response.body[campo]).to.not.be.null;
      expect(response.body[campo].toString().length).to.be.greaterThan(0);
    });
  });
});

Then('o status code da resposta deve ser 400 ou 404', () => {
  cy.get('@response').then((response) => {
    expect([400, 404]).to.include(response.status);
  });
});

Then('o status da resposta deve ser 401 ou 403', () => {
  cy.get('@response').then((response) => {
    expect([401, 403]).to.include(response.status);
  });
});

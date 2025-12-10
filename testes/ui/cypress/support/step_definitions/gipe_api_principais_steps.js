/// <reference types="cypress" />

import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

// ============================================================================
// STEPS ESPECÍFICOS PARA GIPE API PRINCIPAIS
// ============================================================================

// ============================================================================
// VALIDAÇÕES DE ESTRUTURA - ARRAY
// ============================================================================

Then('a resposta deve ser um array', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
  });
});

Then('a resposta deve ser um array válido', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(Array.isArray(response.body)).to.be.true;
  });
});

Then('o array não deve estar vazio', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
  });
});

Then('o array de intercorrências não deve estar vazio', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    cy.log(`📊 Total de intercorrências: ${response.body.length}`);
  });
});

// ============================================================================
// VALIDAÇÕES DE ESTRUTURA - OBJETO
// ============================================================================

Then('a resposta deve ser um objeto único', () => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('object');
    expect(Array.isArray(response.body)).to.be.false;
  });
});

Then('o objeto não deve ser um array', () => {
  cy.get('@response').then((response) => {
    expect(Array.isArray(response.body)).to.be.false;
  });
});

Then('o objeto deve conter o campo {string}', (campo) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property(campo);
    cy.log(`✅ Campo "${campo}" encontrado: ${response.body[campo]}`);
  });
});

Then('o valor do campo {string} deve corresponder ao UUID buscado', function(campo) {
  cy.get('@response').then((response) => {
    expect(response.body[campo]).to.equal(this.testData.uuid);
  });
});

// ============================================================================
// VALIDAÇÕES DE ESTRUTURA - DECLARANTE
// ============================================================================

Then('cada item deve ter a estrutura de declarante', (dataTable) => {
  cy.get('@response').then((response) => {
    if (response.body.length > 0) {
      const campos = dataTable.hashes();
      const primeiroItem = response.body[0];
      
      campos.forEach((row) => {
        expect(primeiroItem).to.have.property(row.campo);
        
        const valor = primeiroItem[row.campo];
        switch(row.tipo) {
          case 'string':
            expect(valor).to.be.a('string');
            break;
          case 'number':
            expect(valor).to.be.a('number');
            break;
          case 'boolean':
            expect(valor).to.be.a('boolean');
            break;
        }
        
        cy.log(`✅ Campo ${row.campo} (${row.tipo}): OK`);
      });
    }
  });
});

Then('se houver declarantes cada um deve conter todos os campos necessários', () => {
  cy.get('@response').then((response) => {
    if (response.body.length > 0) {
      const camposNecessarios = ['uuid', 'nome', 'cpf', 'telefone', 'email'];
      
      response.body.forEach((declarante, index) => {
        camposNecessarios.forEach((campo) => {
          expect(declarante).to.have.property(campo);
        });
        
        if (index === 0) {
          cy.log(`✅ Declarante ${index + 1}: Estrutura validada`);
        }
      });
      
      cy.log(`📊 Total validados: ${response.body.length} declarantes`);
    }
  });
});

Then('os campos de declarante devem ter tipos corretos', () => {
  cy.get('@response').then((response) => {
    if (response.body.length > 0) {
      const primeiroDeclarante = response.body[0];
      
      expect(primeiroDeclarante.uuid).to.be.a('string');
      expect(primeiroDeclarante.nome).to.be.a('string');
      expect(primeiroDeclarante.cpf).to.be.a('string');
      expect(primeiroDeclarante.telefone).to.be.a('string');
      expect(primeiroDeclarante.email).to.be.a('string');
      
      cy.log('✅ Todos os tipos de campo estão corretos');
    }
  });
});

// ============================================================================
// VALIDAÇÕES DE ESTRUTURA - ENVOLVIDOS
// ============================================================================

Then('cada item deve ter a estrutura de envolvido', (dataTable) => {
  cy.get('@response').then((response) => {
    if (response.body.length > 0) {
      const campos = dataTable.hashes();
      const primeiroItem = response.body[0];
      
      campos.forEach((row) => {
        expect(primeiroItem).to.have.property(row.campo);
        
        const valor = primeiroItem[row.campo];
        switch(row.tipo) {
          case 'string':
            expect(valor).to.be.a('string');
            break;
          case 'number':
            expect(valor).to.be.a('number');
            break;
          case 'boolean':
            expect(valor).to.be.a('boolean');
            break;
        }
        
        cy.log(`✅ Campo ${row.campo} (${row.tipo}): OK`);
      });
    }
  });
});

Then('se houver envolvidos cada um deve conter todos os campos necessários', () => {
  cy.get('@response').then((response) => {
    if (response.body.length > 0) {
      const camposNecessarios = ['uuid', 'nome', 'tipo_envolvimento', 'necessita_atendimento'];
      
      response.body.forEach((envolvido, index) => {
        camposNecessarios.forEach((campo) => {
          expect(envolvido).to.have.property(campo);
        });
        
        if (index === 0) {
          cy.log(`✅ Envolvido ${index + 1}: Estrutura validada`);
        }
      });
      
      cy.log(`📊 Total validados: ${response.body.length} envolvidos`);
    }
  });
});

Then('os campos de envolvido devem ter tipos corretos', () => {
  cy.get('@response').then((response) => {
    if (response.body.length > 0) {
      const primeiroEnvolvido = response.body[0];
      
      expect(primeiroEnvolvido.uuid).to.be.a('string');
      expect(primeiroEnvolvido.nome).to.be.a('string');
      expect(primeiroEnvolvido.tipo_envolvimento).to.be.a('string');
      expect(primeiroEnvolvido.necessita_atendimento).to.be.a('boolean');
      
      cy.log('✅ Todos os tipos de campo estão corretos');
    }
  });
});

// ============================================================================
// VALIDAÇÕES DE ESTRUTURA - INTERCORRÊNCIAS
// ============================================================================

Then('se houver intercorrências cada item deve ter os campos principais', (dataTable) => {
  cy.get('@response').then((response) => {
    if (response.body.length > 0) {
      const campos = dataTable.hashes();
      const primeiroItem = response.body[0];
      
      campos.forEach((row) => {
        expect(primeiroItem).to.have.property(row.campo);
        
        const valor = primeiroItem[row.campo];
        switch(row.tipo) {
          case 'string':
            expect(valor).to.be.a('string');
            break;
          case 'number':
            expect(valor).to.be.a('number');
            break;
          case 'boolean':
            expect(valor).to.be.a('boolean');
            break;
        }
        
        cy.log(`✅ Campo ${row.campo} (${row.tipo}): OK`);
      });
      
      cy.log(`📊 Total de intercorrências com estrutura validada: ${response.body.length}`);
    }
  });
});

// ============================================================================
// VALIDAÇÕES DE ESTRUTURA - TIPOS DE OCORRÊNCIA
// ============================================================================

Then('cada tipo de ocorrência deve ter os campos obrigatórios', (dataTable) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.be.greaterThan(0);
    
    const campos = dataTable.hashes();
    const primeiroItem = response.body[0];
    
    campos.forEach((row) => {
      expect(primeiroItem).to.have.property(row.campo);
      
      const valor = primeiroItem[row.campo];
      switch(row.tipo) {
        case 'string':
          expect(valor).to.be.a('string');
          expect(valor).to.not.be.empty;
          break;
        case 'number':
          expect(valor).to.be.a('number');
          break;
        case 'boolean':
          expect(valor).to.be.a('boolean');
          break;
      }
      
      cy.log(`✅ Campo ${row.campo} (${row.tipo}): ${valor}`);
    });
    
    cy.log(`📊 Total de tipos de ocorrência: ${response.body.length}`);
  });
});

// ============================================================================
// STEPS PARA BUSCA POR UUID
// ============================================================================

When('eu busco uma intercorrência com UUID {string}', (uuid) => {
  cy.api_get(`/diretor/${uuid}/`).as('response');
});

// ============================================================================
// STEPS PARA TESTES SEM AUTENTICAÇÃO
// ============================================================================

Given('que não estou autenticado', () => {
  Cypress.env('authToken', null);
  cy.log('🔓 Token removido - usuário não autenticado');
});

When('eu tento acessar o endpoint {string} sem token', (endpoint) => {
  cy.request({
    method: 'GET',
    url: `${Cypress.env('API_BASE_URL') || 'https://hom-gipe.sme.prefeitura.sp.gov.br/api'}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    failOnStatusCode: false
  }).as('response');
});

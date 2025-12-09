// ============================================================================
// EXEMPLO DE USO DO SISTEMA DE GERENCIAMENTO DE TOKEN
// ============================================================================

describe('Exemplo - Sistema de Token Automático', () => {
  
  // ============================================================================
  // EXEMPLO 1: Uso Básico com Autenticação Automática
  // ============================================================================
  it('Exemplo 1: Autenticação automática', () => {
    // O comando api_autenticar() faz TUDO automaticamente:
    // 1. Verifica se existe token.json
    // 2. Valida o token
    // 3. Se expirado, obtém novo via UI
    // 4. Configura o token no Cypress
    
    cy.api_autenticar().then((token) => {
      cy.log(`✅ Token pronto: ${token.substring(0, 50)}...`)
      
      // Agora pode fazer requisições à API
      cy.api_get('/diretor/').then((response) => {
        expect(response.status).to.equal(200)
      })
    })
  })

  // ============================================================================
  // EXEMPLO 2: Forçar Obtenção de Novo Token
  // ============================================================================
  it('Exemplo 2: Forçar renovação de token', () => {
    // Se você precisa garantir um token novo (não do cache)
    cy.api_obter_token_via_ui().then((novoToken) => {
      cy.log(`✅ Novo token obtido: ${novoToken.substring(0, 50)}...`)
      
      // O token já está salvo em token.json e token.txt
      // E já está configurado no Cypress
      
      cy.api_get('/declarante/').then((response) => {
        expect(response.status).to.equal(200)
      })
    })
  })

  // ============================================================================
  // EXEMPLO 3: Verificar Token Existente
  // ============================================================================
  it('Exemplo 3: Verificar token do arquivo', () => {
    cy.api_carregar_token_arquivo().then((token) => {
      if (token) {
        cy.log(`📂 Token carregado do arquivo`)
        
        const isValid = cy.api_validar_token(token)
        
        if (isValid) {
          cy.log('✅ Token ainda é válido!')
          Cypress.env('authToken', token)
        } else {
          cy.log('⚠️ Token expirado, obtendo novo...')
          cy.api_obter_token_via_ui()
        }
      } else {
        cy.log('⚠️ Nenhum token encontrado, obtendo novo...')
        cy.api_obter_token_via_ui()
      }
    })
  })

  // ============================================================================
  // EXEMPLO 4: Uso em Feature File (BDD)
  // ============================================================================
  // No arquivo .feature:
  /*
    Contexto:
      Dado que possuo credenciais válidas de autenticação
      E que estou autenticado na API
    
    Cenário: Listar declarantes
      Quando eu faço uma requisição GET para "/declarante/"
      Então o status code da resposta deve ser 200
  */
  
  // A step definition já faz tudo automaticamente:
  it('Exemplo 4: Como é implementado no step definition', function() {
    // Este é o código dentro do step "que estou autenticado na API"
    cy.log('🔐 Iniciando processo de autenticação...')
    
    cy.api_autenticar().then((token) => {
      if (!this.testData) {
        this.testData = {}
      }
      this.testData.token = token
      cy.wrap(token).as('token')
      cy.log('✅ Token configurado e pronto para uso')
    })
  })

  // ============================================================================
  // EXEMPLO 5: Validação Manual de Token
  // ============================================================================
  it('Exemplo 5: Validar token manualmente', () => {
    const tokenExemplo = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY1MDI2NDM3LCJpYXQiOjE3NjQ5NDAwMzcsImp0aSI6ImQzNjZmN2YwMTYzNTRlZDI5MWMwZGQzNTBhNWQ0MjM2IiwidXNlcl9pZCI6MjB9.WNJpaIfBRxRKhIThfKxj75diT8NnIy9p3AOSllY187I'
    
    const isValid = cy.api_validar_token(tokenExemplo)
    
    if (isValid) {
      cy.log('✅ Token válido - pode ser usado')
    } else {
      cy.log('❌ Token inválido ou expirado')
    }
  })

  // ============================================================================
  // EXEMPLO 6: Fluxo Completo de Teste de API
  // ============================================================================
  it('Exemplo 6: Fluxo completo de teste', () => {
    // Passo 1: Autenticar (automático)
    cy.api_autenticar()
    
    // Passo 2: Fazer requisições
    cy.api_get('/diretor/').then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('array')
      
      if (response.body.length > 0) {
        const primeiraIntercorrencia = response.body[0]
        const uuid = primeiraIntercorrencia.uuid
        
        // Passo 3: Buscar detalhes
        cy.api_get(`/diretor/${uuid}/`).then((detalhes) => {
          expect(detalhes.status).to.equal(200)
          expect(detalhes.body).to.have.property('uuid', uuid)
          cy.log('✅ Teste completo executado com sucesso!')
        })
      }
    })
  })

  // ============================================================================
  // EXEMPLO 7: Verificar Informações do Token
  // ============================================================================
  it('Exemplo 7: Extrair informações do token', () => {
    cy.api_autenticar().then((token) => {
      // Decodificar payload do JWT
      const parts = token.split('.')
      const payload = JSON.parse(atob(parts[1]))
      
      cy.log('📋 Informações do Token:')
      cy.log(`   Usuario ID: ${payload.user_id}`)
      cy.log(`   Username: ${payload.username}`)
      cy.log(`   Nome: ${payload.name}`)
      cy.log(`   Perfil: ${payload.perfil_nome}`)
      cy.log(`   Expira em: ${new Date(payload.exp * 1000).toLocaleString('pt-BR')}`)
      
      const now = Math.floor(Date.now() / 1000)
      const minutosRestantes = Math.floor((payload.exp - now) / 60)
      cy.log(`   ⏱️ Tempo restante: ${minutosRestantes} minutos`)
    })
  })

})

// ============================================================================
// RESUMO DO FLUXO
// ============================================================================
/*

FLUXO AUTOMÁTICO DE TOKEN:

┌─────────────────────────────────────┐
│   cy.api_autenticar()               │
└───────────┬─────────────────────────┘
            │
            ▼
┌─────────────────────────────────────┐
│   Existe token.json?                │
└───────┬─────────────────┬───────────┘
        │ SIM             │ NÃO
        ▼                 ▼
┌─────────────┐    ┌─────────────────┐
│ Carregar    │    │ Obter novo      │
│ do arquivo  │    │ via UI          │
└──────┬──────┘    └────────┬────────┘
       │                    │
       ▼                    │
┌─────────────┐             │
│ Token       │             │
│ válido?     │             │
└──┬──────┬───┘             │
   │ SIM  │ NÃO             │
   │      └─────────────────┘
   ▼
┌─────────────────────────────────────┐
│   Configurar no Cypress             │
│   Cypress.env('authToken', token)   │
└─────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────┐
│   Token pronto para uso! ✅         │
└─────────────────────────────────────┘

*/

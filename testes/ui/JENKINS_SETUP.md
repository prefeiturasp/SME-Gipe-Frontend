# 🚀 Configuração Jenkins - Testes API GIPE

## ❌ Problema Identificado

Todos os testes API estão falhando no Jenkins devido a **falta de autenticação válida**.

```
Tests: 95 total
Passing: 0
Failing: 95
Duration: ~15 minutos
```

## 🔧 Solução: Variáveis de Ambiente

### Opção 1: Usar Token Fixo (Recomendado para início rápido)

Adicionar nas variáveis de ambiente do Jenkins:

```bash
API_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SEU_TOKEN_VALIDO_AQUI
```

#### Como obter um token válido:

1. Acesse: https://qa-gipe.sme.prefeitura.sp.gov.br/
2. Faça login com credenciais válidas
3. Abra DevTools (F12) → Application → Cookies
4. Copie o valor do cookie `auth_token`
5. Configure no Jenkins

**⚠️ Atenção:** Tokens JWT expiram! Precisa renovar periodicamente.

---

### Opção 2: Usar Credenciais (Recomendado para produção)

Adicionar nas variáveis de ambiente do Jenkins:

```bash
API_USERNAME=05481179342
API_PASSWORD=Aa123456@
CI=true
```

**Vantagem:** O sistema renovará o token automaticamente quando expirar.

---

## 📋 Passo a Passo - Configurar Jenkins

### 1. Acessar Configurações do Job

```
Jenkins > Seu Job > Configurar > Build Environment
```

### 2. Marcar opção

```
☑ Use secret text(s) or file(s)
```

### 3. Adicionar Bindings

Clique em **Add** e escolha **Secret text** para cada variável:

#### Binding 1: Token de Autenticação
```
Variable: API_AUTH_TOKEN
Credentials: [Criar novo] → Secret text
Secret: [Colar o token JWT aqui]
ID: gipe-api-token
Description: Token de autenticação GIPE API
```

#### Binding 2: Usuário API (opcional)
```
Variable: API_USERNAME  
Credentials: [Criar novo] → Secret text
Secret: 05481179342
ID: gipe-api-username
Description: Usuário para autenticação GIPE
```

#### Binding 3: Senha API (opcional)
```
Variable: API_PASSWORD
Credentials: [Criar novo] → Secret text
Secret: Aa123456@
ID: gipe-api-password
Description: Senha para autenticação GIPE
```

#### Binding 4: Flag CI
```
Variable: CI
Credentials: [Criar novo] → Secret text
Secret: true
ID: ci-flag
Description: Identifica ambiente CI/CD
```

---

## 🧪 Script Jenkins (Jenkinsfile)

```groovy
pipeline {
    agent any
    
    environment {
        API_AUTH_TOKEN = credentials('gipe-api-token')
        API_USERNAME = credentials('gipe-api-username')
        API_PASSWORD = credentials('gipe-api-password')
        CI = 'true'
    }
    
    stages {
        stage('Install') {
            steps {
                dir('testes/ui') {
                    sh 'npm ci'
                }
            }
        }
        
        stage('Run API Tests') {
            steps {
                dir('testes/ui') {
                    sh 'npx cypress run --spec "cypress/e2e/api/**/*.feature" --browser chrome'
                }
            }
        }
    }
    
    post {
        always {
            dir('testes/ui') {
                // Publicar screenshots de falhas
                archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true
                
                // Publicar relatórios Allure (se configurado)
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            }
        }
    }
}
```

---

## ✅ Verificação

Após configurar, os testes devem passar:

```
✔  api_diretor.feature          20 passing
✔  api_dre.feature               15 passing  (6 pending)
✔  api_envolvidos.feature        11 passing
✔  api_intercorrencias_.feature  16 passing
✔  gipe_api_principais.feature   15 passing
✔  gipe_categorias.feature       10 passing
✔  validacao_api.feature          8 passing
───────────────────────────────────────────
   95 passing in ~20 seconds
```

---

## 🔍 Troubleshooting

### Problema: Token expirado

**Sintoma:** Todos os testes falham com 401/403

**Solução:** Gerar novo token e atualizar credential no Jenkins

### Problema: Variável não reconhecida

**Sintoma:** `Cypress.env('API_AUTH_TOKEN')` retorna `undefined`

**Solução:** 
1. Verificar nome exato da variável (case-sensitive)
2. Confirmar que credential está vinculado corretamente
3. Rebuild do job após mudanças

### Problema: Testes lentos

**Sintoma:** Execução demora mais de 5 minutos

**Solução:**
- Aumentar recursos do agente Jenkins
- Executar em paralelo (cypress-cloud ou cypress-split)
- Verificar conectividade com ambiente QA

---

## 📞 Contato

Dúvidas sobre configuração: [Equipe de Automação]

Token expirado ou problemas de acesso: [Equipe de Infraestrutura]

# Fluxo de GitFlow + Instalação Manual do Cypress

## 📌 Fluxo GitFlow Definido

### Branches principais:

- **main**: Automações da esteira de CI/CD (somente merges de aprovados)
- **develop**: branch de integração e desenvolvimento contínuo

### Branches de apoio:

- **feature/**: novas funcionalidades a partir de `develop`
- **Exemplo de feature/**: feature/127000-nova-funcionalidade (Nro do card antes da descrição)
- **bugfix/**: correções de bugs identificados em `develop`

### Exemplo de fluxo:

```bash
# Nova funcionalidade
 git checkout develop
 git pull origin develop
 git checkout -b feature/nova-funcionalidade
 ...
 git commit -m "feat: nova funcionalidade"
 git push origin feature/nova-funcionalidade
```

```bash
# Corrigir bug em develop
 git checkout develop
 git pull origin develop
 git checkout -b bugfix/corrige-tela-login
 ...
 git commit -m "fix: tela de login não carregava"
 git push origin bugfix/corrige-tela-login
```

---

## ✅ Solução manual para instalar o Cypress (sem erro de certificado)

### 📥 1. Baixe o instalador manualmente

Buscar a versão desejada para instalação. No exemplo abaixo, está sendo utilizada a versão 13.7.0
👉 [Download Cypress 13.17.0 (Windows 64-bit)](https://download.cypress.io/desktop/13.17.0?platform=win32\&arch=x64)

### 📁 2. Crie o caminho esperado no cache

Crie a seguinte pasta na sua máquina:

```
C:\Users\<SEU_USUÁRIO>\AppData\Local\Cypress\Cache\13.17.0
```

Ou execute no terminal:

```cmd
mkdir %LOCALAPPDATA%\Cypress\Cache\13.17.0
```

### 📦 3. Extraia o arquivo baixado na pasta

O download será um `.zip` contendo o Cypress.

Extraia **todo o conteúdo** do `.zip` dentro da pasta:

```
C:\Users\<SEU_USUÁRIO>\AppData\Local\Cypress\Cache\13.17.0
```

⚠️ Importante: Após a extração, **dentro da pasta** `13.17.0` **deve conter a pasta** `Cypress`.

### 🔁 4. Reinstale o Cypress sem tentar baixar novamente

Volte ao terminal e execute:

```bash
npm install cypress@13.17.0 --save-dev
```

O `npm` vai identificar que a versão já está em cache e **não tentará baixar novamente da internet**, evitando o erro de certificado.

### 🧪 5. Teste a instalação

```bash
npx cypress open
```

Se tudo estiver certo, a **interface do Cypress** vai abrir normalmente.

---

## 🔐 Configuração de Credenciais (.env)

### ⚠️ IMPORTANTE: Segurança de Credenciais

As credenciais de teste **NÃO estão mais hardcoded** no código. Elas devem ser configuradas via arquivo `.env` para garantir segurança.

### 📋 Setup Inicial (Obrigatório)

**1. Copie o template de exemplo:**

```bash
cp .env.example .env
```

**2. Preencha o arquivo `.env` com as credenciais reais:**

Obtenha as credenciais com a equipe e preencha o arquivo `.env` seguindo a estrutura:

```env
# Perfil GIPE (Padrão) - Gestão/Admin
RF_GIPE=seu_rf_aqui
SENHA_GIPE=sua_senha_aqui

# Perfil UE - Unidade Educacional
RF_UE=seu_rf_ue_aqui
SENHA_UE=sua_senha_ue_aqui

# Perfil Cadastro Ocorrências
RF_CADASTRO=seu_rf_cadastro_aqui
SENHA_CADASTRO=sua_senha_cadastro_aqui

# ... etc (veja .env.example para estrutura completa)
```

**3. Verifique se `.env` está no `.gitignore` (já configurado):**

O arquivo `.env` **NUNCA deve ser versionado** no Git. O `.gitignore` já está configurado para ignorá-lo.

### 🚫 Projeto NÃO executará sem `.env`

Por design de segurança, **os testes falharão** se o arquivo `.env` não existir ou estiver incompleto.

**Erro esperado se `.env` não estiver configurado:**

```
TypeError: Cannot read property 'RF_GIPE' of undefined
```

### 📦 Estrutura de Credenciais por Perfil

O sistema GIPE usa **múltiplos perfis** de usuário. Cada perfil tem credenciais específicas:

| Perfil | Variável ENV | Usado por |
|--------|-------------|-----------|
| **GIPE (Admin)** | `RF_GIPE` / `SENHA_GIPE` | gestao_pessoas.js, gestao_unidade.js, API, complement_gipe.js |
| **UE (Unidade Educacional)** | `RF_UE` / `SENHA_UE` | consulta_filtro.js, cadastro_ue.feature, alterar_senha.js, alteracao_email.js, gipe_extra.js |
| **Cadastro Ocorrências** | `RF_CADASTRO` / `SENHA_CADASTRO` | cadastro_ocorrencias.js |
| **DRE (Diretoria Regional)** | `RF_DRE` / `SENHA_DRE` | cadastro DRE, complement_dre.js, cadast_ocorrenc_DRE.js |
| **Carga (Performance)** | `CPF_CARGA` / `SENHA_CARGA` | gipe_carga.feature (testes de carga/stress) |
| **Credenciais Inválidas** | `RF_INVALIDO` / `SENHA_INVALIDA` | Testes negativos |

### 🔑 Token de Autenticação API

O arquivo `.env` também contém um `AUTH_TOKEN` JWT para testes de API.

**Token expira em:** 2025-12-26 (epoch: 1764179802)

**Para renovar o token:**

```bash
npm run cy:token
```

### 📝 Arquivos Atualizados

Os seguintes arquivos foram migrados para usar `.env`:

- ✅ `cypress.config.js` - carrega do `process.env` + validação obrigatória
- ✅ `cypress/support/api/config.js` - credenciais e token API
- ✅ `cypress/support/step_definitions/cadastro_ocorrencias.js`
- ✅ `cypress/support/step_definitions/consulta_filtro.js`
- ✅ `cypress/support/step_definitions/gestao_pessoas.js`
- ✅ `cypress/support/step_definitions/gestao_unidade.js`
- ✅ `cypress/support/step_definitions/complement_gipe.js`
- ✅ `cypress/support/step_definitions/complement_dre.js`
- ✅ `cypress/support/step_definitions/gipe_extra.js`
- ✅ `cypress/support/step_definitions/alterar_senha.js`
- ✅ `cypress/support/step_definitions/alteracao_email.js`
- ✅ `cypress/support/step_definitions/gipe_carga.js`

**Total:** 12 arquivos migrados + 2 arquivos de configuração (.env, .env.example)

---

## 🧪 Executando os Testes

Após configurar o `.env`, você pode executar:

```bash
# Todos os testes
npm test

# Apenas testes de UI
npm run test:ui

# Apenas testes de API
npm run test:api

# Abrir interface do Cypress
npx cypress open
```




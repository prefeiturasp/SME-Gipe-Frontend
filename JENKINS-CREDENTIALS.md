# 🔐 Credenciais para Configurar no Jenkins

## 📍 Como Acessar

1. Acesse o Jenkins: `http://jenkins2.sme.prefeitura.sp.gov.br`
2. Clique em **"Manage Jenkins"** (Gerenciar Jenkins)
3. Clique em **"Credentials"** (Credenciais)
4. Clique em **"System"**
5. Clique em **"Global credentials (unrestricted)"**
6. Clique em **"Add Credentials"** (Adicionar Credenciais)

---

## 📋 Credenciais a Serem Criadas

Para cada credencial abaixo, você deve criar uma entrada do tipo **"Secret text"**:

### 1️⃣ Perfil GIPE (Gestão/Admin)

**Credencial 1:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DO_RF_GIPE]`
- **ID:** `gipe-rf-gipe`
- **Description:** RF do usuário GIPE (Gestão/Admin)

**Credencial 2:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DA_SENHA_GIPE]`
- **ID:** `gipe-senha-gipe`
- **Description:** Senha do usuário GIPE (Gestão/Admin)

---

### 2️⃣ Perfil GIPE Admin

**Credencial 3:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DO_RF_GIPE_ADMIN]`
- **ID:** `gipe-rf-gipe-admin`
- **Description:** RF do usuário GIPE Admin

**Credencial 4:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DA_SENHA_GIPE_ADMIN]`
- **ID:** `gipe-senha-gipe-admin`
- **Description:** Senha do usuário GIPE Admin

---

### 3️⃣ Perfil UE (Unidade Educacional)

**Credencial 5:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DO_RF_UE]`
- **ID:** `gipe-rf-ue`
- **Description:** RF do usuário UE (Unidade Educacional)

**Credencial 6:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DA_SENHA_UE]`
- **ID:** `gipe-senha-ue`
- **Description:** Senha do usuário UE (Unidade Educacional)

---

### 4️⃣ Perfil Cadastro de Ocorrências

**Credencial 7:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DO_RF_CADASTRO]`
- **ID:** `gipe-rf-cadastro`
- **Description:** RF do usuário Cadastro de Ocorrências

**Credencial 8:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DA_SENHA_CADASTRO]`
- **ID:** `gipe-senha-cadastro`
- **Description:** Senha do usuário Cadastro de Ocorrências

---

### 5️⃣ Perfil DRE (Diretoria Regional)

**Credencial 9:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DO_RF_DRE]`
- **ID:** `gipe-rf-dre`
- **Description:** RF do usuário DRE (Diretoria Regional)

**Credencial 10:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DA_SENHA_DRE]`
- **ID:** `gipe-senha-dre`
- **Description:** Senha do usuário DRE (Diretoria Regional)

---

### 6️⃣ Perfil Carga (Performance/Stress Tests)

**Credencial 11:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DO_CPF_CARGA]`
- **ID:** `gipe-cpf-carga`
- **Description:** CPF do usuário Carga (testes de performance)

**Credencial 12:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DA_SENHA_CARGA]`
- **ID:** `gipe-senha-carga`
- **Description:** Senha do usuário Carga (testes de performance)

---

### 7️⃣ Credenciais Inválidas (Testes Negativos)

**Credencial 13:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DO_RF_INVALIDO]`
- **ID:** `gipe-rf-invalido`
- **Description:** RF inválido para testes negativos

**Credencial 14:**
- **Kind:** Secret text
- **Scope:** Global
- **Secret:** `[VALOR_DA_SENHA_INVALIDA]`
- **ID:** `gipe-senha-invalida`
- **Description:** Senha inválida para testes negativos

---

## 📝 Onde Encontrar os Valores?

Os valores reais dessas credenciais podem estar em:

1. **Arquivo `.env` local** (testes/ui/.env) - se você tem acesso
2. **Documentação da equipe QA** 
3. **OneNote/Confluence** da equipe
4. **Falar com o responsável pelos testes** (Wilson Santos - SPASSU, conforme log do Jenkins)
5. **Ambiente de homologação QA** (`https://qa-gipe.sme.prefeitura.sp.gov.br`)

---

## ✅ Verificação

Após criar todas as credenciais, você deve ter **14 credentials** no total:

```
✓ gipe-rf-gipe
✓ gipe-senha-gipe
✓ gipe-rf-gipe-admin
✓ gipe-senha-gipe-admin
✓ gipe-rf-ue
✓ gipe-senha-ue
✓ gipe-rf-cadastro
✓ gipe-senha-cadastro
✓ gipe-rf-dre
✓ gipe-senha-dre
✓ gipe-cpf-carga
✓ gipe-senha-carga
✓ gipe-rf-invalido
✓ gipe-senha-invalida
```

---

## 🚨 Importante

- ✅ Todas as credenciais devem ter **Scope: Global**
- ✅ Todos os IDs devem ser **exatamente** como especificado (copie e cole)
- ✅ Não coloque espaços extras nos IDs
- ✅ O Jenkinsfile agora é **resiliente**: funciona com ou sem as credenciais
- ⚠️ Se alguma credencial não for criada, o pipeline continua, mas aquele teste específico pode falhar

---

## 🎯 Após Configurar

1. Execute o pipeline manualmente no Jenkins
2. Observe os logs - deve aparecer: `Credenciais carregadas: RF_GIPE, SENHA_GIPE, ...`
3. Se aparecer: `⚠️ Credential 'X' não encontrada`, verifique o ID e scope

---

**Data de criação:** 16/04/2026  
**Projeto:** SME-GIPE-Frontend  
**Pipeline:** SME-GIPE-Testes  
**Branch:** test_qa

# Configuração de Vídeo e Screenshots

## 📹 Gravação de Vídeo

Os vídeos são gravados automaticamente para **todas as execuções** dos testes.

### Configurações:
- ✅ **Vídeo habilitado**: `video: true`
- 📁 **Pasta de vídeos**: `cypress/videos/`
- 🗜️ **Compressão**: 32 (padrão Cypress para boa qualidade/tamanho)
- 🎬 **Upload apenas falhas**: `videoUploadOnPasses: false`

### Localização dos vídeos:
```
testes/ui/cypress/videos/
└── editar_ocorrencia.feature.mp4
└── consulta_ocorrencia.feature.mp4
└── cadastro.feature.mp4
```

---

## 📸 Captura de Screenshots

Screenshots são capturados **automaticamente em caso de erro/falha**.

### Configurações:
- ✅ **Screenshot em falha**: `screenshotOnRunFailure: true`
- 📁 **Pasta de screenshots**: `cypress/screenshots/`
- 🖼️ **Captura**: Página completa (fullPage)
- 🗑️ **Limpeza**: Assets limpos antes de cada execução

### Localização dos screenshots:
```
testes/ui/cypress/screenshots/
└── editar_ocorrencia/
    └── editar_ocorrencia-editar-ocorrencia-visualizada-erro.png
└── consulta_ocorrencia/
    └── consulta_ocorrencia-validar-campo-acao-erro.png
```

---

## 🎯 Hooks Customizados

### 1. **Screenshot em falha de teste**
```javascript
afterEach(function() {
  if (this.currentTest.state === 'failed') {
    cy.screenshot(`${specName}-${testName}-erro`, {
      capture: 'fullPage'
    })
  }
})
```

### 2. **Screenshot em erro não capturado**
```javascript
Cypress.on('fail', (error, runnable) => {
  cy.screenshot(`falha-${runnable.parent.title}-${runnable.title}`, {
    capture: 'fullPage'
  })
  throw error
})
```

---

## 🚀 Como Executar

### Modo headless (gera vídeo + screenshots):
```bash
npx cypress run --spec "cypress/e2e/ui/editar_ocorrencia.feature"
```

### Modo headed (sem vídeo, apenas screenshots em erro):
```bash
npx cypress run --spec "cypress/e2e/ui/editar_ocorrencia.feature" --headed
```

### Desabilitar vídeo temporariamente:
```bash
npx cypress run --spec "cypress/e2e/ui/editar_ocorrencia.feature" --config video=false
```

---

## 📊 Exemplo de Estrutura Após Execução

```
cypress/
├── videos/
│   ├── editar_ocorrencia.feature.mp4          # Vídeo completo da execução
│   ├── consulta_ocorrencia.feature.mp4
│   └── cadastro.feature.mp4
├── screenshots/
│   ├── editar_ocorrencia.feature/
│   │   ├── Editar ocorrência visualizada -- Quando clico em Visualizar (failed).png
│   │   └── falha-editar-ocorrencia-1730187234567.png
│   └── consulta_ocorrencia.feature/
│       └── Validar campo Ação -- Então valido campo Ação (failed).png
└── downloads/
```

---

## 🔧 Ajustes de Configuração

### Aumentar qualidade do vídeo:
```javascript
// cypress.config.js
video: true,
videoCompression: 15  // Menor = melhor qualidade (mas arquivo maior)
```

### Manter vídeos mesmo em testes passados:
```javascript
videoUploadOnPasses: true
```

### Capturar apenas viewport (não página inteira):
```javascript
cy.screenshot('nome', {
  capture: 'viewport'  // Padrão, ou 'fullPage' para página completa
})
```

---

## 📝 Notas Importantes

1. ⚠️ **Vídeos ocupam espaço**: Limpe periodicamente a pasta `cypress/videos/`
2. 🎬 **Vídeos não são gravados em modo interativo** (`cypress open`)
3. 📸 **Screenshots são sempre capturados em falhas**, independente do modo
4. 🗑️ **Assets são limpos automaticamente** antes de cada nova execução completa

# Instruções rápidas para agentes AI — SME-Gipe-Frontend (UI tests)

Objetivo curto
- Este diretório contém automações E2E em Cypress + Cucumber (feature files) com relatórios Allure.

Arquitetura e componentes importantes
- `cypress.config.js`: configuração central (baseUrl, timeouts, specPattern, setupNodeEvents). Veja que plugins usados: `@shelex/cypress-allure-plugin`, `cypress-cucumber-preprocessor`, `cypress-cloud`.
- `cypress/e2e/**/*.feature`: cenários Gherkin (pt-BR). Use `cypress-cucumber-preprocessor` para mapear steps.
- `cypress/support/step_definitions/`: implementações dos steps (import de `..../locators`).
- `cypress/support/locators/`: classes que expõem seletores (métodos que retornam strings). Prefira reutilizar locators existentes.
- `cypress/support/commands_ui/`: comandos customizados (ex.: `login_gipe`, `dados_de_login`, `cadastro_gipe`).
- `allure-report/` e `allure-results/`: relatórios gerados (não tocar salvo instrução).

Padrões e convenções do projeto
- Locators centralizados: cada página/fluxo tem uma classe (ex.: `Cadastro_ocorrencias_Localizadores`) com métodos que retornam strings CSS ou XPath. Example: `btn_nova_ocorrencia()` retorna an XPath '/html/body/...'.
- Steps usam `cypress-cucumber-preprocessor/steps` (Given/When/Then). Reuse `cy.commands` implementados em `commands_ui` quando disponível.
- Prefer CSS quando possível; o projeto usa muito XPath para dropdowns e botões — tratar como frágil e propor `data-*` alternativas quando possível.
- Data inputs: alguns campos usam `type="date"` — para esses insira `YYYY-MM-DD` (ou use `invoke('val', 'YYYY-MM-DD')` seguido de `trigger('input')`).

Fluxos e comandos úteis (exemplos reais)
- Rodar uma feature a partir da pasta `testes/ui`:
  - cd ui
  - npx cypress run --spec "cypress/e2e/ui/<file>.feature"
- Rodar apontando projeto sem mudar cwd:
  - npx cypress run --project ui --spec "ui/cypress/e2e/ui/<file>.feature"
- Gerar e abrir relatório Allure:
  - npm run test:allure (ver `package.json`)

Erros e armadilhas conhecidas (para priorizar PRs/patches)
- Parsers de Gherkin: features devem ser texto puro (sem fences ```). Cucumber lançará CompositeParserException se houver fences.
- Seletor frágil: evite XPaths absolutos `/html/body/...`; prefira `data-testid` ou seletores CSS estáveis.
- Timeouts: `cypress.config.js` já usa timeouts altos (defaultCommandTimeout=60000, pageLoadTimeout=300000). Use esses valores como referência ao adicionar retries.
- Execução do Cypress deve ser feita dentro da pasta que contém `cypress.config.js` e `package.json` (pasta `ui`).

O que procurar em mudanças de código
- Mudanças nos arquivos de `locators/` frequentemente requerem updates nas `step_definitions/`.
- Qualquer alteração em `cypress.config.js` pode afetar execução (timeous, plugins). Preferir alterações incrementais.

Como o agente deve agir (boas práticas específicas)
- Antes de editar um locator, verifique todos os usos via busca (ex.: `grep`/semantic search) e atualize os step_definitions correspondentes.
- Ao criar novos steps, reutilize `commands_ui` quando houver comandos já definidos (ex.: login). Use `cy.xpath()` apenas se necessário e documente por que.
- Ao adicionar testes que interagem com campos de data, converta formatos DD/MM/YYYY -> YYYY-MM-DD para compatibilidade com `type="date"`.
- Ao propor substituição de seletores, adicione um comentário no locator explicando a motivação e exemplo de uso no step.

Arquivos chave para referência rápida
- `cypress.config.js`
- `package.json` (scripts: `test:allure`, `e2e`, `test:ui`)
- `cypress/support/locators/` (ex.: `cadastro_locators.js`, `cadastro_ocorrencias_locators.js`)
- `cypress/support/step_definitions/` (ex.: `cadastro.js`, `login.js`)

Se algo não estiver claro
- Peça ao mantenedor para fornecer `data-*` attributes ou exemplos de HTML (outerHTML) dos elementos. Isso facilita migração de XPaths para seletores mais robustos.

Se quiser, eu atualizo este arquivo com exemplos adicionais após você me enviar um outerHTML de elementos problemáticos (botão "Próximo", botões Sim/Não, input de data).

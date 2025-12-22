/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require('cypress')
const { cloudPlugin } = require('cypress-cloud/plugin')
const dotenv = require('dotenv')
const cucumber = require('cypress-cucumber-preprocessor').default
const allureWriter = require('@shelex/cypress-allure-plugin/writer')

dotenv.config()

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
}

module.exports = defineConfig({
  e2e: {
    supportFile: 'cypress/support/e2e.js',
    watchForFileChanges: true,
    baseUrl: 'https://qa-gipe.sme.prefeitura.sp.gov.br',
    viewportWidth: 1600,
    viewportHeight: 1050,
    video: false,
    screenshotOnRunFailure: false,
    trashAssetsBeforeRuns: true,
    chromeWebSecurity: false,
    experimentalRunAllSpecs: true,
    failOnStatusCode: false,
    specPattern: 'cypress/e2e/**/*.{feature,cy.js,cy.jsx}',
    // Ajustes de timeout para lidar com carregamento mais lento em QA
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    execTimeout: 60000,
    pageLoadTimeout: 300000,
    waitForAnimations: true,
    animationDistanceThreshold: 5,

    env: {
      TAGS: 'not @skip', // Ignora cenários marcados como @wip por padrão
      
      // Credenciais de Teste - Login
      RF_VALIDO: '29379960000',
      SENHA_VALIDA: 'Sgp0000',
      RF_INVALIDO: '6913261',
      SENHA_INVALIDA: 'Sgp326',
      
      // Credenciais de Teste - Perfil DRE
      RF_DRE: '7311559',
      SENHA_DRE: 'Sgp1559',
      
      // Configurações GIPE Estudantes
      GIPE_ESTUDANTES_BASE_URL: 'https://qa-gipe.sme.prefeitura.sp.gov.br',
      ALUNO_RA: '5937723',
      DATA_NASC: '14062011',
      DISPOSITIVO: 'WEB',
      
      // IDs para testes GIPE Estudantes
      PROVA_TAI_ID: 1,
      QUESTAO_ID: 1,
      QUESTAO_LEGADO_ID: 1,
      ALTERNATIVA_ID: 96034121,
      DISPOSITIVO_ID: 1,
      
      // Dados de submissão GIPE Estudantes
      STATUS: 1,
      TIPO_DISPOSITIVO: 1,
      DATA_INICIO: Date.now(),
      DATA_FIM: 'null',
      RESPOSTA: 'A',
      DATA_HORA_RESPOSTA_TICKS: Date.now(),
      TEMPO_RESPOSTA_ALUNO: 30
    },

    setupNodeEvents(on, config) {
      // Vídeo e screenshots habilitados conforme configuração principal
      // Removida lógica condicional para permitir gravação em todos os modos

      // Allure
      allureWriter(on, config)

      // Cucumber
      on('file:preprocessor', cucumber())

      // Cypress Cloud (opcional)
      return cloudPlugin(on, config).then((enhancedConfig) => {
        enhancedConfig.env = enhancedConfig.env || {}
        enhancedConfig.env.db = dbConfig
        return enhancedConfig
      })
    },
  },
})
// (duplicated block removed)
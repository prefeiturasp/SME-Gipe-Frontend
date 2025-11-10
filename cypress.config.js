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
    baseUrl: 'https://qa-gipe.sme.prefeitura.sp.gov.br/',
    viewportWidth: 1600,
    viewportHeight: 1050,
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    retries: {
      runMode: 2,
      openMode: 0,
    },
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
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
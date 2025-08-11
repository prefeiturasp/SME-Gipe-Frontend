const { defineConfig } = require("cypress")
const allureWriter = require('@shelex/cypress-allure-plugin/writer')
const dotenv = require('dotenv')
require('dotenv').config()

const cucumber = require('cypress-cucumber-preprocessor').default
const postgreSQL = require('cypress-postgresql')
const pg = require('pg')
dotenv.config()

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE
}

module.exports = defineConfig({
  e2e: {
    watchForFileChanges: true,
    setupNodeEvents(on, config) {
      allureWriter(on, config)
      on('file:preprocessor', cucumber())
    },
    // aguardando a publicação do ambiente de qa.
    baseUrl: 'https://qa-gipe.sme.prefeitura.sp.gov.br/',
    viewportWidth: 1600,
    viewportHeight: 1050,
    video: false,
    videoCompression: 0,
    retries: {
      runMode: 2,
      openMode: 0
    },
    screenshotOnRunFailure: false,
    chromeWebSecurity: false,
    experimentalRunAllSpecs: true,
    failOnStatusCode: false,
    specPattern: 'cypress/e2e/**/**/*.{feature,cy.{js,jsx}}',
    defaultCommandTimeout: 60000, 
    requestTimeout: 60000,       
    execTimeout: 60000,          
    pageLoadTimeout: 60000,     
    waitForAnimations: true,     
    animationDistanceThreshold: 5 
  },
})
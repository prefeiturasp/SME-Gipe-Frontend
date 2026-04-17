/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require('cypress')
const { cloudPlugin } = require('cypress-cloud/plugin')
const dotenv = require('dotenv')
const path = require('path')
const cucumber = require('cypress-cucumber-preprocessor').default
const allureWriter = require('@shelex/cypress-allure-plugin/writer')

const envPath = path.resolve(__dirname, '.env')
dotenv.config({ path: envPath })

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
}

const requiredEnvVars = [
  'RF_GIPE', 'SENHA_GIPE',
  'RF_GIPE_ADMIN', 'SENHA_GIPE_ADMIN',
  'RF_UE', 'SENHA_UE',
  'RF_CADASTRO', 'SENHA_CADASTRO',
  'RF_DRE', 'SENHA_DRE',
  'CPF_CARGA', 'SENHA_CARGA',
  'RF_INVALIDO', 'SENHA_INVALIDA'
]

// Detecta ambiente CI/CD (Jenkins injeta JENKINS_HOME; Docker pode injetar CI=true)
const isCI = !!(process.env.JENKINS_HOME || process.env.CI || process.env.CI_BUILD_ID)

const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  if (isCI) {
    // Em CI/CD as variáveis devem ser injetadas pelo Jenkins via secrets (-e VAR=valor no docker run)
    // Apenas avisa para não abortar o Cypress — testes falharão individualmente se credenciais ausentes
    console.warn('AVISO CI: Variáveis não encontradas (devem ser injetadas como secrets no Jenkins):', missingVars.join(', '))
  } else {
    // Em ambiente local, exige o arquivo .env preenchido
    console.error('ERRO: Variáveis obrigatórias não encontradas no .env:', missingVars.join(', '))
    console.error('Arquivo .env:', envPath)
    console.error('Copie o .env.example para .env e preencha as credenciais.')
    throw new Error(`Variáveis obrigatórias não encontradas no .env: ${missingVars.join(', ')}`)
  }
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
    trashAssetsBeforeRuns: false,
    chromeWebSecurity: false,
    experimentalRunAllSpecs: true,
    failOnStatusCode: false,
    specPattern: 'cypress/e2e/**/*.{feature,cy.js,cy.jsx}',
    defaultCommandTimeout: 120000,
    requestTimeout: 120000,
    execTimeout: 120000,
    pageLoadTimeout: 300000,
    waitForAnimations: true,
    animationDistanceThreshold: 5,

    env: {
      TAGS: 'not @skip',
      
      // Perfil GIPE (Padrão)
      RF_VALIDO: process.env.RF_GIPE,
      SENHA_VALIDA: process.env.SENHA_GIPE,
      RF_GIPE: process.env.RF_GIPE,
      SENHA_GIPE: process.env.SENHA_GIPE,
      
      // Perfil GIPE Admin
      RF_GIPE_ADMIN: process.env.RF_GIPE_ADMIN,
      SENHA_GIPE_ADMIN: process.env.SENHA_GIPE_ADMIN,
      
      RF_UE: process.env.RF_UE,
      SENHA_UE: process.env.SENHA_UE,
      
      // Perfil Cadastro
      RF_CADASTRO: process.env.RF_CADASTRO,
      SENHA_CADASTRO: process.env.SENHA_CADASTRO,
      
      // Perfil DRE
      RF_DRE: process.env.RF_DRE,
      SENHA_DRE: process.env.SENHA_DRE,
      
      // Perfil Carga
      CPF_CARGA: process.env.CPF_CARGA,
      SENHA_CARGA: process.env.SENHA_CARGA,
      
      // Credenciais Inválidas
      RF_INVALIDO: process.env.RF_INVALIDO,
      SENHA_INVALIDA: process.env.SENHA_INVALIDA,
      
      ALUNO_RA: process.env.ALUNO_RA,
      DATA_NASC: process.env.DATA_NASC,
      EMAIL: process.env.EMAIL,
      
      PROVA_TAI_ID: process.env.PROVA_TAI_ID,
      PROVA_TAEB_ID: process.env.PROVA_TAEB_ID,
      PROVA_TAM_ID: process.env.PROVA_TAM_ID,
      
      ALUNO_UUID: process.env.ALUNO_UUID,
      ALUNO_ESCOLA_UUID: process.env.ALUNO_ESCOLA_UUID,
      
      AUTH_TOKEN: process.env.AUTH_TOKEN,
      API_USERNAME: process.env.RF_GIPE,
      API_PASSWORD: process.env.SENHA_GIPE,
      
      GIPE_ESTUDANTES_BASE_URL: 'https://qa-gipe.sme.prefeitura.sp.gov.br',
      DISPOSITIVO: 'WEB',
      
      QUESTAO_ID: 1,
      QUESTAO_LEGADO_ID: 1,
      ALTERNATIVA_ID: 96034121,
      DISPOSITIVO_ID: 1,
      STATUS: 1,
      TIPO_DISPOSITIVO: 1,
      DATA_INICIO: Date.now(),
      DATA_FIM: 'null',
      RESPOSTA: 'A',
      DATA_HORA_RESPOSTA_TICKS: Date.now(),
      TEMPO_RESPOSTA_ALUNO: 30
    },

    setupNodeEvents(on, config) {
      allureWriter(on, config)
      on('file:preprocessor', cucumber())
      on('task', {
        lerArquivoSeguro(caminho) {
          try {
            const fs = require('fs')
            const path = require('path')
            const caminhoAbsoluto = path.isAbsolute(caminho) ? caminho : path.join(process.cwd(), caminho)
            if (fs.existsSync(caminhoAbsoluto)) {
              return fs.readFileSync(caminhoAbsoluto, 'utf8')
            }
            return null
          } catch (e) {
            return null
          }
        }
      })
      return cloudPlugin(on, config).then((enhancedConfig) => {
        enhancedConfig.env = enhancedConfig.env || {}
        enhancedConfig.env.db = dbConfig
        return enhancedConfig
      })
    },
  },
})
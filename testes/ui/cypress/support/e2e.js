import '@shelex/cypress-allure-plugin'
import "cypress-cloud/support"
import './commands_ui/commands_login'
import './commands_ui/commands_cadastro'
import 'cypress-xpath'
import 'cypress-plugin-tab'

// PostgreSQL
const postgreSQL = require('cypress-postgresql');

// Carrega os comandos de banco
postgreSQL.loadDBCommands();




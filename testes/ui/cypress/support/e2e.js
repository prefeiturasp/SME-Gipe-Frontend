import '@shelex/cypress-allure-plugin'
import "cypress-cloud/support";
import './commands_ui/commands_login'

// PostgreSQL
const postgreSQL = require('cypress-postgresql');

// Carrega os comandos de banco
postgreSQL.loadDBCommands();




import '@shelex/cypress-allure-plugin'
import "cypress-cloud/support"
import './commands_ui/commands_login'
import './commands_ui/commands_cadastro'
import 'cypress-xpath'
import 'cypress-plugin-tab'

import postgreSQL from 'cypress-postgresql';

postgreSQL.loadDBCommands();

// Import API commands
import './api/commands'




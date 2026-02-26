# language: pt

@skip @gipe_integracao @integracao @api-ui
Funcionalidade: Testes de Integração entre Componentes do GIPE
  Como tester de sistema
  Eu quero testar fluxos críticos entre módulos
  Para garantir que as funcionalidades principais trabalham juntas corretamente

  # ====== INTEGRAÇÃO LOGIN E AUTENTICAÇÃO ======

  @integracao @login @api @smoke
  Cenário: Validar integração entre UI de login e API de autenticação
    Dado que eu acesso o sistema
    Quando eu insiro credenciais válidas
    E clico no botão de acessar
    Então a chamada POST para autenticação é realizada
    E token de autenticação é retornado com sucesso
    E cookie auth_token é definido no navegador
    E redirecionamento para dashboard ocorre

  @integracao @login @persistencia @critical
  Cenário: Validar persistência de token entre requisições
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando realizo múltiplas requisições de API
    Então cada requisição inclui o token correto
    E token não expira durante as requisições
    E todas as requisições retornam 200 ou 401 apropriadamente

  @integracao @autenticacao @logout @critical
  Cenário: Validar logout completo em todas as camadas
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando clico em fazer logout
    Então token é invalidado no servidor
    E cookie é removido do navegador
    E localStorage é limpo
    E redirecionamento para login ocorre

  # ====== INTEGRAÇÃO GESTÃO DE UNIDADES ======

  @integracao @unidades @api-listagem @smoke
  Cenário: Validar integração entre UI e API de listagem de unidades
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E estou na página principal do sistema
    Quando acesso o menu de Gestão
    E clica na opção "Gestão de unidades Educacionais"
    Então chamada GET para listar unidades é realizada
    E lista de unidades é recebida do servidor
    E dados são exibidos corretamente na UI
    E paginação sincroniza com API

  @integracao @unidades @filtros @high
  Cenário: Validar sincronização de filtros entre UI e API
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando acesso o menu de Gestão
    E clica na opção "Gestão de unidades Educacionais"
    E aplico filtro de status na UI
    Então parâmetro filter é enviado para API
    E API retorna apenas unidades filtradas
    E UI reflete resultados corretamente
    E paginação é resetada para página 1

  @integracao @unidades @ordenacao @medium
  Cenário: Validar sincronização de ordenação entre UI e API
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando acesso o menu de Gestão
    E clica na opção "Gestão de unidades Educacionais"
    E clico em cabeçalho de coluna para ordenar
    Então parâmetro sort é enviado para API
    E dados são ordenados conforme solicitado
    E ícone de ordenação é atualizado na UI

  # ====== INTEGRAÇÃO OCORRÊNCIAS - CRUD ======

  @integracao @ocorrencias @criar @smoke
  Cenário: Validar fluxo integrado de criar ocorrência
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando preencho formulário de nova ocorrência
    E submeto o formulário de ocorrência
    Então chamada POST para criar ocorrência é realizada
    E dados são validados no servidor
    E ocorrência é criada e retorna ID
    E UI exibe mensagem de sucesso
    E ocorrência aparece na listagem

  @integracao @ocorrencias @editar @high
  Cenário: Validar fluxo integrado de editar ocorrência
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E tenho uma ocorrência previamente criada
    Quando edito a ocorrência através da UI
    E submeto as alterações da ocorrência
    Então chamada PUT para atualizar ocorrência é realizada
    E dados são atualizados no servidor
    E validações são aplicadas
    E UI reflete mudanças

  @integracao @ocorrencias @deletar @high
  Cenário: Validar fluxo integrado de deletar ocorrência
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E tenho uma ocorrência previamente criada
    Quando deleto a ocorrência através da UI
    E confirmo a deleção da ocorrência
    Então chamada DELETE para remover ocorrência é realizada
    E ocorrência é removida do banco
    E UI remove item da listagem
    E mensagem de sucesso de deleção é exibida

  # ====== INTEGRAÇÃO VALIDAÇÕES ======

  @integracao @validacao @client-server @critical
  Cenário: Validar validações complementares cliente-servidor
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E tenho um formulário de ocorrência aberto
    Quando insiro dados inválidos no formulário
    Então validação no cliente é executada primeiro
    E erros são exibidos na UI
    E formulário não é submetido enquanto houver erros

  @integracao @validacao @negocio @high
  Cenário: Validar validações de regra de negócio no servidor
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E tenho um formulário de ocorrência aberto
    Quando insiro dados que violam regra de negócio
    E submeto o formulário de ocorrência
    Então validação de negócio falha no servidor
    E mensagem de erro específica é retornada
    E UI destaca campo problemático
    E usuário pode corrigir o erro

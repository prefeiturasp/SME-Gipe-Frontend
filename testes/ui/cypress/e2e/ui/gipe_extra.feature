# language: pt

@gipe_extra @automatizacao @valor
Funcionalidade: Fluxos Avançados e Validações Complementares do GIPE
  Como usuário do sistema GIPE
  Eu quero validar fluxos combinados e casos de borda do sistema
  Para garantir a qualidade e robustez da solução em cenários complexos

  Contexto: Sistema limpo e acessível
    Dado que eu acesso o sistema

  # ====== TESTES DE AUTENTICAÇÃO AVANÇADA ======
  
  @autenticacao @fluxo-combinado @regressao
  Cenário: Validar fluxo completo de autenticação e logout
    Quando eu insiro credenciais válidas
    E clico no botão de acessar
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema
    E devo ver o título "Intercorrências Institucionais"

  @autenticacao @validacao @seguranca
  Cenário: Validar persistência de sessão após autenticação
    Quando eu insiro credenciais válidas
    E clico no botão de acessar
    Então devo ser redirecionado para o dashboard
    Quando navego para outra página do sistema
    Então devo permanecer autenticado no sistema
    E não devo ser redirecionado para o login

  @autenticacao @tentativas @seguranca
  Cenário: Validar bloqueio após múltiplas tentativas de login falhas
    Quando eu insiro credenciais inválidas
    E clico no botão de acessar
    Então devo visualizar mensagem de erro de autenticação
    Quando eu insiro credenciais inválidas novamente
    E clico no botão de acessar
    Então devo visualizar mensagem de erro de autenticação
    E o sistema deve manter as tentativas registradas

  # ====== TESTES DE VALIDAÇÃO DE CAMPOS ======

  @validacao @campos @obrigatoriedade
  Cenário: Validar todos os campos obrigatórios do login
    Quando clico no botão de acessar sem preencher nenhum campo
    Então devo visualizar mensagens de validação para campos obrigatórios
    Quando eu insiro apenas o RF sem senha
    E clico no botão de acessar
    Então devo visualizar validação de senha obrigatória
    Quando eu insiro apenas a senha sem RF
    E clico no botão de acessar
    Então devo visualizar mensagem indicando RF obrigatório

  @validacao @formato @rf
  Cenário: Validar aceitação de diferentes formatos de RF
    Quando eu insiro credenciais válidas com RF formatado
    E clico no botão de acessar
    Então devo ser redirecionado para o dashboard

  @validacao @performance @timeout
  Cenário: Validar comportamento do sistema em operações de longa duração
    Quando eu insiro credenciais válidas
    E clico no botão de acessar
    Então devo ser redirecionado para o dashboard dentro do timeout esperado
    E o sistema deve responder de forma consistente

  # ====== TESTES DE GESTÃO DE UNIDADES COMBINADOS ======

  @gestao_unidades @consulta @fluxo-completo
  Cenário: Validar fluxo completo de consulta de unidades educacionais
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E estou na página principal do GIPE
    Quando acesso o menu de Gestão do sistema
    E clica na opção "Gestão de unidades Educacionais"
    Então visualizo a página de Gestão de Unidades Educacionais
    E visualizo as abas "Unidades Educacionais ativas" e "Unidades Educacionais inativas"
    Quando alterno entre as abas de unidades
    Então a listagem de unidades é exibida corretamente
    E os filtros funcionam conforme esperado

  @gestao_unidades @validacao @dados
  Cenário: Validar integridade dos dados de unidades educacionais
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E estou na página principal do GIPE
    Quando acesso o menu de Gestão do sistema
    E clica na opção "Gestão de unidades Educacionais"
    Então os dados das unidades devem estar completos
    E as colunas obrigatórias devem estar visíveis
    E as datas devem estar no formato correto

  # ====== TESTES DE OCORRÊNCIAS AVANÇADOS ======

  @skip @ocorrencias @consulta @listagem-completa
  Cenário: Validar consulta completa de ocorrências com diferentes filtros
    Dado que eu acesso o sistema para cadastro de ocorrências
    E o usuário está na página principal do GIPE
    Então o sistema deve mostrar a listagem de ocorrências cadastradas no sistema
    Quando localizo e valido o título "Histórico de ocorrências registradas"
    E localizo e valido o campo "Ação"
    Então devo visualizar as colunas esperadas na tabela
    E devo visualizar os botões de ação disponíveis

  @skip @ocorrencias @validacao @tabela
  Cenário: Validar estrutura da tabela de ocorrências
    Dado que eu acesso o sistema para cadastro de ocorrências
    E o usuário está na página principal do GIPE
    Então o sistema deve mostrar a listagem de ocorrências cadastradas no sistema
    Quando valido a estrutura da tabela
    Então devo visualizar colunas obrigatórias: ID, Data, Tipo, Status
    E devo visualizar ações disponíveis em cada linha
    E a paginação deve estar funcionando corretamente

  @skip @ocorrencias @pesquisa @filtros
  Cenário: Validar funcionalidade de pesquisa e filtros de ocorrências
    Dado que eu acesso o sistema para cadastro de ocorrências
    E o usuário está na página principal do GIPE
    Quando utilizo o campo de pesquisa
    Então os resultados devem ser filtrados corretamente
    Quando aplico filtros de data
    Então as ocorrências são exibidas dentro do intervalo selecionado
    Quando aplico filtro de tipo de ocorrência
    Então apenas ocorrências do tipo selecionado são exibidas

  # ====== TESTES DE NAVEGAÇÃO ======

  @navegacao @menu @acessibilidade
  Cenário: Validar acessibilidade do menu principal após autenticação
    Dado que eu acesso o sistema
    Quando eu insiro credenciais válidas
    E clico no botão de acessar
    Então devo ser redirecionado para o dashboard
    Quando valido a estrutura do menu
    Então todos os itens do menu devem estar visíveis
    E todos os links devem estar habilitados e responsivos

  @navegacao @breadcrumb @rastreamento
  Cenário: Validar rastreamento de navegação via breadcrumb
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E estou na página principal do GIPE
    Quando acesso o menu de Gestão do sistema
    E clica na opção "Gestão de unidades Educacionais"
    Então o breadcrumb deve mostrar o caminho completo de navegação
    Quando clico no breadcrumb anterior
    Então sou redirecionado para a página anterior
    E o estado da aplicação é mantido

  # ====== TESTES DE RECUPERAÇÃO DE ERRO ======

  @recuperacao @erro @tratamento
  Cenário: Validar tratamento e recuperação de erros de validação
    Dado que eu acesso o sistema
    Quando eu insiro credenciais inválidas
    E clico no botão de acessar
    Então devo visualizar mensagem de erro de autenticação
    Quando limpo os campos
    E insiro credenciais válidas
    E clico no botão de acessar
    Então devo ser redirecionado para o dashboard
    E o erro anterior deve ser removido

  @recuperacao @rede @offline
  Cenário: Validar comportamento em cenários de conectividade
    Dado que eu acesso o sistema
    Quando eu insiro credenciais válidas
    E clico no botão de acessar
    Então devo ser redirecionado para o dashboard
    Quando o sistema tenta carregar recursos
    Então as operações devem ser tratadas corretamente
    E o usuário deve receber feedback apropriado

  # ====== TESTES DE RESPONSIVIDADE ======

  @responsividade @desktop @visual
  Cenário: Validar layout responsivo em modo desktop
    Dado que eu acesso o sistema
    Quando valido o layout da página de login
    Então os elementos devem estar posicionados corretamente
    E o formulário deve ocupar o espaço apropriado
    E os botões devem estar acessíveis

  # ====== TESTES DE PERFORMANCE ======

  @skip @performance @carregamento @smoke
  Cenário: Validar tempo de carregamento das páginas principais
    Dado que eu acesso o sistema
    Quando eu insiro credenciais válidas
    E clico no botão de acessar
    Então o dashboard deve carregar em tempo aceitável
    Quando acesso o menu de Gestão do sistema
    Então a página deve responder rapidamente
    E não deve haver travamentos visíveis

  @skip @performance @requisicoes @dados-grande
  Cenário: Validar performance com grande volume de dados
    Dado que eu acesso o sistema para cadastro de ocorrências
    E o usuário está na página principal do GIPE
    Quando o sistema carrega a listagem de ocorrências
    Então todos os registros devem ser exibidos sem travamentos
    E a paginação deve funcionar suavemente
    E o desempenho deve ser aceitável

  # ====== TESTES DE SEGURANÇA ======

  @seguranca @injecao @sanitizacao
  Cenário: Validar proteção contra injeção de código
    Dado que eu acesso o sistema
    Quando eu insiro credenciais com caracteres especiais
    E clico no botão de acessar
    Então o sistema deve processar seguramente os caracteres especiais
    E não deve permitir execução de código não autorizado

  @seguranca @sessao @timeout
  Cenário: Validar comportamento de timeout de sessão
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E estou na página principal do GIPE
    Quando o tempo de inatividade exceder o limite de sessão
    Então o usuário deve ser desconectado
    E redirecionado para a página de login
    E uma mensagem de aviso deve ser exibida

  # ====== TESTES DE FLUXO COMBINADO COMPLETO ======

  @skip @fluxo-critico @integracao @end-to-end
  Cenário: Validar fluxo crítico completo do sistema
    Dado que eu acesso o sistema
    Quando eu insiro credenciais válidas
    E clico no botão de acessar
    Então devo ser redirecionado para o dashboard
    Quando acesso o menu de Gestão do sistema
    E clica na opção "Gestão de unidades Educacionais"
    Então visualizo a página de Gestão de Unidades Educacionais
    Quando retorno para o dashboard
    Então permaneço autenticado
    E o estado da aplicação é mantido corretamente
    Quando valido a listagem de ocorrências
    Então todos os elementos visuais estão presentes
    E o sistema responde a todas as ações de usuário

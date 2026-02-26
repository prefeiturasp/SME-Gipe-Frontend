# language: pt

@skip @gipe_seguranca @security @critico
Funcionalidade: Testes Avançados de Segurança do Sistema GIPE
  Como administrador de segurança
  Eu quero validar todos os aspectos de segurança do sistema
  Para garantir que dados sensíveis estão protegidos e vulnerabilidades sejam mitigadas

  # ====== SQL INJECTION ======

  @seguranca @sql-injection @critico
  Cenário: Validar proteção contra SQL Injection no campo RF
    Dado que eu acesso o sistema
    Quando eu insiro SQL injection no campo RF
    Então o sistema deve rejeitar a entrada maliciosa
    E não deve retornar dados sensíveis
    E devo visualizar mensagem de validação

  @seguranca @sql-injection @critico
  Cenário: Validar proteção contra SQL Injection na senha
    Dado que eu acesso o sistema
    Quando eu insiro SQL injection no campo de senha
    Então o sistema deve rejeitar a entrada
    E a validação deve ser executada no servidor
    E nenhuma query maliciosa deve ser executada

  @seguranca @sql-injection @critico
  Cenário: Validar proteção contra SQL Injection em campos de pesquisa
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando utilizo o campo de pesquisa com SQL injection
    Então o sistema deve escapar caracteres especiais
    E os resultados devem estar vazios ou normalizados
    E nenhum dado não autorizado deve ser retornado

  # ====== XSS (Cross Site Scripting) ======

  @seguranca @xss @critico
  Cenário: Validar proteção contra XSS em campo RF
    Dado que eu acesso o sistema
    Quando eu insiro script malicioso no campo RF
    Então o script não deve ser executado
    E o navegador não deve abrir pop-ups não autorizados
    E o código deve ser renderizado como texto

  @seguranca @xss @critico
  Cenário: Validar proteção contra XSS em campo de descrição de ocorrência
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando eu preenchemos um formulário com XSS payload
    Então o payload não deve ser armazenado como código executável
    E o sistema deve sanitizar a entrada
    E a exibição deve mostrar texto seguro

  @seguranca @xss @critico
  Cenário: Validar proteção contra XSS em busca e filtros
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando utilizo filtros com caracteres XSS
    Então o sistema deve codificar a saída corretamente
    E nenhum script deve ser executado
    E o estado da aplicação deve permanecer consistente

  @seguranca @xss @critico
  Cenário: Validar sanitização de dados exibidos na página
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando visualizo dados de ocorrências
    Então todo conteúdo deve estar sanitizado
    E nenhuma tag HTML maliciosa deve ser renderizada
    E entidades especiais devem estar escapadas

  # ====== CSRF (Cross-Site Request Forgery) ======

  @seguranca @csrf @critico
  Cenário: Validar proteção contra CSRF em formulários
    Dado que eu acesso o sistema
    Quando eu envio um formulário
    Então o sistema deve incluir token CSRF
    E o token deve ser validado no servidor
    E requisições sem token válido devem ser rejeitadas

  @seguranca @csrf @critico
  Cenário: Validar proteção CSRF em múltiplas abas
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E estou na página principal do sistema
    Quando abro o formulário em múltiplas abas
    Então cada aba deve ter seu próprio token CSRF
    E tokens não devem ser compartilhados entre abas
    E submissões devem validar o token correto

  # ====== AUTENTICAÇÃO E AUTORIZAÇÃO ======

  @seguranca @autenticacao @critico
  Cenário: Validar que URLs protegidas exigem autenticação
    Dado que não estou autenticado
    Quando eu tento acessar /dashboard diretamente
    Então sou redirecionado para a página de login
    E não consigo acessar a página protegida
    E uma mensagem de sessão expirada deve aparecer

  @seguranca @autenticacao @critico
  Cenário: Validar que sessão não pode ser reutilizada
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando eu faço logout
    Então a sessão anterior não pode ser reutilizada
    E cookie de sessão deve ser invalidado
    E redirecionamento para login deve ocorrer

  @seguranca @autorizacao @critico
  Cenário: Validar que usuário não pode acessar recursos de outro perfil
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando tento acessar páginas administrativas não autorizado
    Então recebo erro 403 (Forbidden)
    E os dados não são exibidos
    E a tentativa é registrada

  @seguranca @autorizacao @critico
  Cenário: Validar isolamento de dados por perfil de usuário
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando visualizo dados de unidades
    Então vejo apenas dados autorizados para meu perfil
    E dados de outros perfis não aparecem
    E APIs retornam apenas dados permitidos

  # ====== CONTROLE DE ACESSO ======

  @seguranca @acesso @critico
  Cenário: Validar que endpoints não devem ser acessíveis sem autenticação
    Dado que não estou autenticado
    Quando eu tento chamar API diretamente
    Então recebo erro 401 (Unauthorized)
    E nenhum dado é retornado
    E a requisição é rejeitada no servidor

  @seguranca @acesso @critico
  Cenário: Validar que token expirado invalida a sessão
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando o token de autenticação expira
    Então a próxima ação dispara re-autenticação
    E usuário é redirecionado para login
    E estado anterior é descartado

  @seguranca @acesso @critico
  Cenário: Validar que múltiplas sessões do mesmo usuário são tratadas
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE em uma aba
    Quando eu abro uma segunda sessão em outra aba
    Então ambas as sessões devem ser válidas
    E a sessão anterior deve ser invalidada
    E o sistema deve definir o comportamento consistentemente

  # ====== VALIDAÇÃO E SANITIZAÇÃO ======

  @seguranca @validacao @entrada
  Cenário: Validar rejeição de caracteres inválidos em RF
    Dado que eu acesso o sistema
    Quando eu insiro caracteres especiais no RF
    Então o sistema deve aceitar apenas números
    E caracteres não numéricos devem ser ignorados
    E mensagem de validação deve aparecer

  @seguranca @validacao @entrada
  Cenário: Validar limites de comprimento de entrada
    Dado que eu acesso o sistema
    Quando eu insiro texto muito longo em campos
    Então o sistema deve truncar ou rejeitar
    E nenhum buffer overflow deve ocorrer
    E validação deve ser feita no cliente e servidor

  @seguranca @validacao @entrada
  Cenário: Validar rejeição de tipos de arquivo perigosos
    Dado que eu acesso o sistema como GIPE
    E estou em um formulário com upload
    Quando eu tento fazer upload de arquivo executável
    Então o sistema deve rejeitar o arquivo
    E validação deve ocorrer no servidor
    E mensagem de tipo de arquivo inválido deve aparecer

  @seguranca @sanitizacao @output
  Cenário: Validar codificação de caracteres especiais na exibição
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando visualizo dados com caracteres especiais
    Então os caracteres devem estar codificados corretamente
    E não deve haver corrupção de dados
    E a exibição deve respeitar encoding UTF-8

  # ====== CRIPTOGRAFIA E COMUNICAÇÃO SEGURA ======

  @seguranca @https @critico
  Cenário: Validar que todas as páginas usam HTTPS
    Dado que eu acesso qualquer página do sistema
    Quando a página carrega
    Então a conexão deve ser HTTPS
    E o certificado SSL deve ser válido
    E navegador não deve exibir avisos de segurança

  @seguranca @https @critico
  Cenário: Validar que senhas são transmitidas criptografadas
    Dado que eu acesso o sistema
    Quando eu insiro senha e submeto o formulário
    Então a senha deve ser transmitida via HTTPS
    E a senha não deve aparecer em logs do cliente
    E requisição deve estar criptografada

  @seguranca @headers @critico
  Cenário: Validar headers de segurança HTTP
    Dado que eu acesso qualquer página do sistema
    Quando a página carrega
    Então headers de segurança devem estar presentes
    E X-Frame-Options deve prevenir clickjacking
    E X-Content-Type-Options deve estar configurado
    E Content-Security-Policy deve estar ativo

  # ====== TIMEOUT E RECURSOS ======

  @seguranca @timeout @critico
  Cenário: Validar timeout de sessão por inatividade
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando permaneço inativo por período definido
    Então a sessão deve expirar
    E redirecionamento para login deve ocorrer
    E dados não commitados devem ser descartados

  @seguranca @recursos @ddos
  Cenário: Validar proteção contra requisições em excesso
    Dado que eu acesso o sistema
    Quando envio múltiplas requisições rapidamente
    Então o sistema deve implementar rate limiting
    E requisições em excesso devem ser rejeitadas
    E IP pode ser temporariamente bloqueado

  @seguranca @recursos @memoria
  Cenário: Validar que recursos são liberados após logout
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    Quando eu faço logout
    Então memória do cliente deve ser limpa
    E dados sensíveis devem ser removidos
    E cookies devem ser deletados

  # ====== LOGGING E AUDITORIA ======

  @seguranca @auditoria @critico
  Cenário: Validar registro de eventos de segurança
    Dado que eu acesso o sistema
    Quando falho em fazer login múltiplas vezes
    Então tentativas devem ser registradas
    E alertas de segurança devem ser gerados
    E logs devem conter IP e timestamp

  @seguranca @auditoria @critico
  Cenário: Validar que senhas não são armazenadas em logs
    Dado que qualquer evento é registrado
    Quando os logs são consultados
    Então senhas nunca devem aparecer em texto plano
    E dados sensíveis devem estar ofuscados
    E apenas hashes ou tokens devem ser registrados

  @seguranca @auditoria @critico
  Cenário: Validar timestamp correto dos eventos de segurança
    Dado que eventos de segurança ocorrem
    Quando são registrados
    Então timestamps devem estar sincronizados com servidor
    E horário deve ser em UTC ou TZ consistente
    E eventos devem ser ordenáveis cronologicamente

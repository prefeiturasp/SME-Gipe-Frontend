#language: pt
 @skip @api @gestao_pessoas
Funcionalidade: API Gestão de Pessoas - Gestão de Usuários
  Como Gestão de Usuário
  Quero visualizar a lista de Usuários Ativos
  Para gerenciar e consultar usuários no sistema GIPE

  Contexto:
    Dado que possuo credenciais válidas de autenticação
    E que estou autenticado na API

  @gestao_usuarios @smoke @listagem
  Cenário: Listar usuários com formato API
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E a lista não deve estar vazia

  @gestao_usuarios @validacao @estrutura
  Cenário: Validar estrutura de dados de usuários
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E a resposta deve conter usuários com campos obrigatórios:
      | campo                  |
      | uuid                   |
      | perfil                 |
      | username               |
      | nome                   |
      | data_solicitacao       |
      | rf_ou_cpf              |
      | rede                   |
      | diretoria_regional     |
      | unidade_educacional    |
      | is_validado            |
      | is_active              |

  @gestao_usuarios @validacao @tipos_campo
  Cenário: Validar tipos de dados dos campos de usuário
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E o primeiro usuário deve ter campos com tipos corretos

  @gestao_usuarios @validacao @campos_nulos
  Cenário: Validar campos que podem ser nulos
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve conter usuários com email que pode ser nulo

  @gestao_usuarios @validacao @campos_obrigatorios
  Cenário: Validar que todos os campos obrigatórios estão preenchidos
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E todos os usuários devem ter os campos obrigatórios preenchidos

  @gestao_usuarios @validacao @rf_cpf_formato
  Cenário: Validar formato de RF ou CPF
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E todos os usuários devem ter rf_ou_cpf não vazio

  @gestao_usuarios @validacao @uuid_unico
  Cenário: Validar que todos os UUIDs são únicos
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E todos os UUIDs devem ser únicos na lista

  @gestao_usuarios @validacao @username_formato
  Cenário: Validar formato do campo username
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E todos os usernames devem ter formato válido

  @gestao_usuarios @validacao @consistencia_dados
  Cenário: Validar consistência entre campos de localização
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E todos os usuários devem ter rede, diretoria regional e unidade educacional preenchidos

  @gestao_usuarios @performance @sla
  Cenário: Validar tempo de resposta da API (SLA)
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E o tempo de resposta deve ser menor que 3000 milissegundos

  @gestao_usuarios @security @dados_sensiveis
  Cenário: Validar que não retorna dados sensíveis
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta não deve conter campos sensíveis como senha

  @gestao_usuarios @contract @schema_validation
  Cenário: Validar contrato da API não quebra estrutura
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve seguir o schema esperado do contrato

  @gestao_usuarios @data_quality @nomes_validos
  Cenário: Validar qualidade dos dados de nome
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E todos os nomes devem ter formato válido sem caracteres especiais indevidos

  @gestao_usuarios @headers @content_type
  Cenário: Validar headers HTTP da resposta
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E o header Content-Type deve ser "application/json"
    E o header deve conter informações de segurança

  @gestao_usuarios @advanced @data_quality_report
  Cenário: Gerar relatório de qualidade de dados
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E devo gerar relatório de qualidade dos dados retornados

  @gestao_usuarios @advanced @field_distribution
  Cenário: Analisar distribuição de perfis no sistema
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E devo analisar a distribuição de perfis com métricas detalhadas

  @gestao_usuarios @advanced @uuid_format_validation
  Cenário: Validar formato UUID v4 de todos os usuários
    Quando eu faço uma requisição GET para "https://qa-gipe.sme.prefeitura.sp.gov.br/api/users/gestao-usuarios/?format=json"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E todos os UUIDs devem estar em formato UUID v4 válido

#language: pt
@api @dre
Funcionalidade: API DRE - Gestão de Intercorrências
  Como usuário da DRE
  Quero gerenciar intercorrências através da API
  Para acompanhar ocorrências das unidades escolares

  Contexto:
    Dado que possuo credenciais válidas de autenticação
    E que estou autenticado na API

  @smoke @listagem
  Cenário: Listar todas as intercorrências da DRE
    Quando eu faço uma requisição GET para "/dre/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E a lista não deve estar vazia

  @validacao @estrutura
  Cenário: Validar estrutura de resposta das intercorrências DRE
    Quando eu faço uma requisição GET para "/dre/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter os campos obrigatórios da DRE

  @validacao @booleanos
  Cenário: Validar que campos booleanos retornam valores corretos
    Quando eu faço uma requisição GET para "/dre/"
    Então o status code da resposta deve ser 200
    E os campos booleanos devem retornar true ou false

  @negativo @uuid_invalido
  Cenário: Tentar buscar intercorrência DRE com UUID inválido
    Quando eu faço uma requisição GET para "/dre/uuid-invalido/"
    Então o status da resposta deve ser 404 ou 400

  @negativo @sem_autenticacao
  Cenário: Tentar acessar intercorrências DRE sem autenticação
    Dado que não estou autenticado
    Quando eu tento acessar "/dre/" sem token
    Então o status da resposta deve ser 401 ou 403

  @performance
  Cenário: Validar tempo de resposta do endpoint DRE
    Quando eu faço uma requisição GET para "/dre/"
    Então o status code da resposta deve ser 200
    E o tempo de resposta deve ser menor que 5000 milissegundos

  @validacao @status_extra
  Cenário: Validar campo status_extra
    Quando eu faço uma requisição GET para "/dre/"
    Então o status code da resposta deve ser 200
    E o campo status_extra deve estar presente nas intercorrências

  @validacao @quantidade_minima
  Cenário: Validar quantidade mínima de intercorrências
    Quando eu faço uma requisição GET para "/dre/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter pelo menos 1 intercorrências

  @validacao @info_complementar
  Cenário: Validar que campos info_complementar podem estar vazios
    Quando eu faço uma requisição GET para "/dre/"
    Então o status code da resposta deve ser 200
    E os campos info_complementar podem ser nulos ou vazios

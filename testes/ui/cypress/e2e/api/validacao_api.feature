#language: pt
@skip @api @validacao
Funcionalidade: Validação de Configuração da API

  Contexto:
    Dado que possuo credenciais válidas de autenticação

  @smoke
  Cenário: Validar token de autenticação
    Dado que estou autenticado na API
    Quando eu faço uma requisição GET para "/declarante/"
    Então o status code da resposta deve ser 200

  @smoke
  Cenário: Validar listagem de tipos de ocorrência
    Dado que estou autenticado na API
    Quando eu faço uma requisição GET para "/tipos-ocorrencia/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de tipos de ocorrência

  @smoke
  Cenário: Validar estrutura de resposta de intercorrências
    Dado que estou autenticado na API
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de intercorrências

  @smoke
  Cenário: Validar acesso a envolvidos com token válido
    Dado que estou autenticado na API
    Quando eu faço uma requisição GET para "/envolvidos/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de envolvidos

  @validacao_headers
  Cenário: Validar headers de resposta da API
    Dado que estou autenticado na API
    Quando eu faço uma requisição GET para "/declarante/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array

  @validacao_tempo
  Cenário: Validar tempo de resposta para listagem
    Dado que estou autenticado na API
    Quando eu faço uma requisição GET para "/tipos-ocorrencia/"
    Então o status code da resposta deve ser 200
    E o tempo de resposta deve ser menor que 5000ms

  @validacao_multiplas
  Cenário: Validar múltiplos endpoints em sequência
    Dado que estou autenticado na API
    Quando eu faço uma requisição GET para "/declarante/"
    Então o status code da resposta deve ser 200
    Quando eu faço uma requisição GET para "/envolvidos/"
    Então o status code da resposta deve ser 200
    Quando eu faço uma requisição GET para "/tipos-ocorrencia/"
    Então o status code da resposta deve ser 200

  @validacao_estrutura
  Cenário: Validar que todas as listagens retornam arrays
    Dado que estou autenticado na API
    Quando eu faço uma requisição GET para "/declarante/"
    Então a resposta deve ser um array
    Quando eu faço uma requisição GET para "/diretor/"
    Então a resposta deve ser um array
    Quando eu faço uma requisição GET para "/envolvidos/"
    Então a resposta deve ser um array

#language: pt
@skip @api @validacao_configuracao
Funcionalidade: Validação de Configuração da API

  # ============================================================================
  # FLUXO DE AUTENTICAÇÃO AUTOMÁTICA:
  # 1. Verifica se existe token.json no diretório
  # 2. Valida se o token está válido (não expirado)
  # 3. Se válido: usa o token existente
  # 4. Se inválido/inexistente: acessa a interface web, faz login e captura novo token
  # 5. Salva o novo token em token.json e token.txt
  # 
  # O token é renovado automaticamente antes de cada execução de testes!
  # ============================================================================

  Contexto:
    Dado que possuo credenciais válidas de autenticação
    E que estou autenticado na API

  @smoke
  Cenário: Validar token de autenticação
    Quando eu faço uma requisição GET para "/declarante/"
    Então o status code da resposta deve ser 200

  @smoke
  Cenário: Validar listagem de tipos de ocorrência
    Quando eu faço uma requisição GET para "/tipos-ocorrencia/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de tipos de ocorrência

  @smoke
  Cenário: Validar estrutura de resposta de intercorrências
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de intercorrências

  @smoke
  Cenário: Validar acesso a envolvidos com token válido
    Quando eu faço uma requisição GET para "/envolvidos/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de envolvidos

  @validacao_headers
  Cenário: Validar headers de resposta da API
    Quando eu faço uma requisição GET para "/declarante/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array

  @validacao_multiplas
  Cenário: Validar múltiplos endpoints em sequência
    Quando eu faço uma requisição GET para "/declarante/"
    Então o status code da resposta deve ser 200
    Quando eu faço uma requisição GET para "/envolvidos/"
    Então o status code da resposta deve ser 200
    Quando eu faço uma requisição GET para "/tipos-ocorrencia/"
    Então o status code da resposta deve ser 200

  @validacao_estrutura
  Cenário: Validar que todas as listagens retornam arrays
    Quando eu faço uma requisição GET para "/declarante/"
    Então a resposta deve ser um array
    Quando eu faço uma requisição GET para "/diretor/"
    Então a resposta deve ser um array
    Quando eu faço uma requisição GET para "/envolvidos/"
    Então a resposta deve ser um array
    Quando eu faço uma requisição GET para "/tipos-ocorrencia/"
    Então a resposta deve ser um array

  @performance
  Cenário: Validar tempo de resposta para listagem
    Quando eu faço uma requisição GET para "/declarante/"
    Então o status code da resposta deve ser 200
    E o tempo de resposta deve ser menor que 5000 milissegundos
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E o tempo de resposta deve ser menor que 5000 milissegundos
    Quando eu faço uma requisição GET para "/envolvidos/"
    Então o status code da resposta deve ser 200
    E o tempo de resposta deve ser menor que 5000 milissegundos
    Quando eu faço uma requisição GET para "/tipos-ocorrencia/"
    Então o status code da resposta deve ser 200
    E o tempo de resposta deve ser menor que 5000 milissegundos

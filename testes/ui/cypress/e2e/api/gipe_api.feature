#language: pt
@skip @api @gipe_api_legacy
Funcionalidade: API GIPE - Testes Legacy (Mantidos para compatibilidade)
  # ⚠️ FEATURE DESABILITADA - Cenários duplicados em gipe_api_principais.feature
  # Esta feature contém testes legados. Para novos testes, use gipe_api_principais.feature
  # Mantida apenas para referência histórica e compatibilidade

  Contexto:
    Dado que possuo credenciais válidas de autenticação
    E que estou autenticado na API

  @declarante @smoke
  Cenário: Listar todos os declarantes
    Quando eu faço uma requisição GET para "/declarante/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de declarantes

  @diretor @smoke
  Cenário: Listar intercorrências do diretor
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de intercorrências

  @diretor
  Cenário: Buscar intercorrência por UUID
    Dado que existe uma intercorrência cadastrada
    Quando eu faço uma requisição GET para "/diretor/{uuid}/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter os dados da intercorrência

  @envolvidos @smoke
  Cenário: Listar todos os envolvidos
    Quando eu faço uma requisição GET para "/envolvidos/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de envolvidos

  @tipos_ocorrencia @smoke
  Cenário: Listar todos os tipos de ocorrência
    Quando eu faço uma requisição GET para "/tipos-ocorrencia/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de tipos de ocorrência

  @declarante @validacao
  Cenário: Validar estrutura de dados de declarante
    Quando eu faço uma requisição GET para "/declarante/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de declarantes
    E a resposta deve ser um array

  @diretor @validacao
  Cenário: Validar que intercorrências retornam array
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array

  @envolvidos @validacao
  Cenário: Validar estrutura de resposta de envolvidos
    Quando eu faço uma requisição GET para "/envolvidos/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de envolvidos
    E a resposta deve ser um array

  @tipos_ocorrencia @validacao
  Cenário: Validar que tipos de ocorrência tem conteúdo
    Quando eu faço uma requisição GET para "/tipos-ocorrencia/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E a lista não deve estar vazia

  @diretor @busca
  Cenário: Verificar que busca por UUID retorna objeto único
    Dado que existe uma intercorrência cadastrada
    Quando eu faço uma requisição GET para "/diretor/{uuid}/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um objeto
    E o objeto deve ter o campo uuid

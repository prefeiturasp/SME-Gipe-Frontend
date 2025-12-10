#language: pt
@skip @api @api_gipe_principais
Funcionalidade: API GIPE - Testes Principais
  Como usuário do sistema GIPE
  Quero validar os principais endpoints da API
  Para garantir o funcionamento correto do sistema de intercorrências

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

  @busca @uuid @smoke
  Cenário: Buscar intercorrência por UUID
    Dado que existe uma intercorrência cadastrada
    Quando eu faço uma requisição GET para "/diretor/{uuid}/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter os dados da intercorrência
    E a resposta deve ser um objeto único
    E o objeto deve conter o campo "uuid"

  @diretor @listagem @smoke
  Cenário: Listar intercorrências do diretor
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de intercorrências
    E a resposta deve ser um array
    E o array de intercorrências não deve estar vazio

  @declarante @listagem @smoke
  Cenário: Listar todos os declarantes
    Quando eu faço uma requisição GET para "/declarante/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de declarantes
    E a resposta deve ser um array

  @envolvidos @listagem @smoke
  Cenário: Listar todos os envolvidos
    Quando eu faço uma requisição GET para "/envolvidos/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de envolvidos
    E a resposta deve ser um array

  @tipos_ocorrencia @listagem @smoke
  Cenário: Listar todos os tipos de ocorrência
    Quando eu faço uma requisição GET para "/tipos-ocorrencia/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter uma lista de tipos de ocorrência
    E a resposta deve ser um array
    E o array não deve estar vazio

  @declarante @validacao @estrutura
  Cenário: Validar estrutura de dados de declarante
    Quando eu faço uma requisição GET para "/declarante/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array

  @envolvidos @validacao @estrutura
  Cenário: Validar estrutura de resposta de envolvidos
    Quando eu faço uma requisição GET para "/envolvidos/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array

  @diretor @validacao @estrutura
  Cenário: Validar que intercorrências retornam array
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array

  @tipos_ocorrencia @validacao @conteudo
  Cenário: Validar que tipos de ocorrência tem conteúdo
    Quando eu faço uma requisição GET para "/tipos-ocorrencia/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E o array não deve estar vazio

  @busca @uuid @validacao
  Cenário: Verificar que busca por UUID retorna objeto único
    Dado que existe uma intercorrência cadastrada
    Quando eu faço uma requisição GET para "/diretor/{uuid}/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um objeto único
    E o objeto deve conter o campo "uuid"
    E o valor do campo "uuid" deve corresponder ao UUID buscado
    E o objeto não deve ser um array

  @diretor @validacao @negativo
  Cenário: Buscar intercorrência com UUID inválido
    Quando eu busco uma intercorrência com UUID "00000000-0000-0000-0000-000000000000"
    Então o status code da resposta deve ser 404

  @diretor @validacao @negativo
  Cenário: Buscar intercorrência com UUID inexistente
    Quando eu busco uma intercorrência com UUID "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
    Então o status code da resposta deve ser 404

  @autenticacao @seguranca @negativo
  Cenário: Acessar endpoint sem autenticação
    Dado que não estou autenticado
    Quando eu tento acessar o endpoint "/diretor/" sem token
    Então o status code da resposta deve ser 401

  @declarante @validacao @completa
  Cenário: Validação completa de estrutura de declarante
    Quando eu faço uma requisição GET para "/declarante/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array válido

  @envolvidos @validacao @completa
  Cenário: Validação completa de estrutura de envolvidos
    Quando eu faço uma requisição GET para "/envolvidos/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array válido

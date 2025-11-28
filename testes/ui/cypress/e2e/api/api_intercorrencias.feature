# language: pt
@skip @api_intercorrencias
Funcionalidade: API GIPE - Testes de Intercorrências do Diretor
  Como diretor de escola
  Quero validar os endpoints de intercorrências
  Para garantir o funcionamento correto do sistema

  Contexto:
    Dado que possuo um token de autenticação válido 

  # ==================== TESTES GET ====================

  Cenário: Consultar intercorrência específica por ID
    Quando eu consulto a intercorrência do diretor com ID "728c33bf-bf05-4260-9526-592724c3e688"
    Então o status da resposta deve ser 200
    E se encontrada a resposta deve conter dados da intercorrência

  # ==================== TESTES PUT ====================

  Cenário: Atualizar furto roubo com dados patrimonio primeira intercorrencia
    Quando eu atualizo furto roubo com patrimonio da intercorrencia "728c33bf-bf05-4260-9526-592724c3e688"
    Então o status da resposta deve ser 200
    E a resposta deve confirmar a atualização

  Cenário: Atualizar furto roubo com dados patrimonio segunda intercorrencia
    Quando eu atualizo furto roubo com patrimonio da intercorrencia "1984c91d-36f5-4c8b-be17-7c0862171f3d"
    Então o status da resposta deve ser 200
    E a resposta deve confirmar a atualização

  Cenário: Atualizar nao furto roubo com envolvido e sem info agressor
    Quando eu atualizo nao furto roubo com envolvido da intercorrencia "61cc6825-b1cb-412c-a175-0e58259aacc9"
    Então o status da resposta deve ser 200
    E a resposta deve confirmar a atualização

  Cenário: Atualizar secao final com declarante e protocolo primeira intercorrencia
    Quando eu atualizo secao final com dados completos da intercorrencia "61cc6825-b1cb-412c-a175-0e58259aacc9"
    Então o status da resposta deve ser 200
    E a resposta deve confirmar a atualização

  Cenário: Atualizar secao final segunda intercorrencia
    Quando eu atualizo secao final da intercorrencia "728c33bf-bf05-4260-9526-592724c3e688"
    Então o status da resposta deve ser 200
    E a resposta deve confirmar a atualização

  Cenário: Atualizar secao final terceira intercorrencia
    Quando eu atualizo secao final da intercorrencia "5fa876a1-f87f-4bb8-bac1-50550921a357"
    Então o status da resposta deve ser 200
    E a resposta deve confirmar a atualização

  # ==================== NOVOS TESTES GET ====================

  Cenário: Listar todos os declarantes disponiveis
    Quando eu consulto a lista de declarantes
    Então o status da resposta deve ser 200
    E a resposta deve conter uma lista de declarantes

  Cenário: Consultar intercorrencia especifica ID c2235f88
    Quando eu consulto a intercorrência do diretor com ID "c2235f88-a80d-48e6-b51a-cf88c3f6d28a"
    Então o status da resposta deve ser 200
    E se encontrada a resposta deve conter dados da intercorrência

  Cenário: Consultar intercorrencia especifica ID 0214e317
    Quando eu consulto a intercorrência do diretor com ID "0214e317-d428-49be-a11f-52b9b12c2f1b"
    Então o status da resposta deve ser 200
    E se encontrada a resposta deve conter dados da intercorrência

  Cenário: Consultar intercorrencia especifica ID a0451c9f
    Quando eu consulto a intercorrência do diretor com ID "a0451c9f-f59a-4d81-88af-c27d5ff00705"
    Então o status da resposta deve ser 200
    E se encontrada a resposta deve conter dados da intercorrência

  Cenário: Consultar intercorrencia especifica ID 232b2761
    Quando eu consulto a intercorrência do diretor com ID "232b2761-dbfb-49b8-872b-df7b647eca06"
    Então o status da resposta deve ser 200
    E se encontrada a resposta deve conter dados da intercorrência

  # ==================== TESTES VERIFY-INTERCORRENCIA COM ID ====================

  Cenário: Verificar intercorrencia por ID bebadc5c segunda verificacao
    Quando eu verifico a intercorrencia com ID "bebadc5c-1bdb-4714-a602-78f1e14e993e"
    Então o status da resposta deve ser 200 ou 403 ou 404
    E a resposta pode estar em formato JSON

  # ==================== TESTES ADICIONAIS GET ====================

  Cenário: Listar categorias disponiveis para intercorrencias
    Quando eu consulto as categorias disponiveis
    Então o status da resposta deve ser 200
    E a resposta deve conter lista de categorias

  Cenário: Obter schema da API em formato YAML lingua afrikaans
    Quando eu consulto o schema da API em formato "yaml" e lingua "af"
    Então o status da resposta deve ser 200
    E a resposta deve estar em formato YAML

  Cenário: Obter schema da API em formato YAML lingua ingles
    Quando eu consulto o schema da API em formato "yaml" e lingua "en"
    Então o status da resposta deve ser 200
    E a resposta deve estar em formato YAML

# language: pt
@api_intercorrencias
Funcionalidade: API GIPE - Testes de Intercorrências do Diretor
  Como diretor de escola
  Quero validar os endpoints de intercorrências
  Para garantir o funcionamento correto do sistema

  Contexto:
    Dado que possuo um token de autenticação válido

  # ==================== TESTES GET ====================

  Cenário: Verificar intercorrência sem parâmetros
    Quando eu consulto o endpoint verify-intercorrencia sem parâmetros
    Então o status da resposta deve ser 200 ou 400 ou 404
    E a resposta pode estar em formato JSON

  Cenário: Verificar intercorrência com barra final
    Quando eu consulto o endpoint verify-intercorrencia com barra final
    Então o status da resposta deve ser 200 ou 400 ou 404
    E a resposta pode estar em formato JSON

  Cenário: Consultar intercorrência específica por ID
    Quando eu consulto a intercorrência do diretor com ID "728c33bf-bf05-4260-9526-592724c3e688"
    Então o status da resposta deve ser 200 ou 404
    E se encontrada a resposta deve conter dados da intercorrência

  # ==================== TESTES POST ====================

  Cenário: Criar seção inicial de intercorrência
    Quando eu envio dados para criar uma seção inicial de intercorrência
    Então o status da resposta deve ser 200 ou 201 ou 400
    E a resposta deve conter o ID da intercorrência criada

  # ==================== TESTES PUT ====================

  Cenário: Atualizar seção inicial de intercorrência existente
    Quando eu atualizo a seção inicial da intercorrência "2eaa4b98-4cb6-4fa3-82d7-8910d2c2d1c6"
    Então o status da resposta deve ser 200 ou 400 ou 404
    E a resposta deve confirmar a atualização

  Cenário: Atualizar secao nao furto roubo de intercorrencia
    Quando eu atualizo a secao nao furto roubo da intercorrencia "2eaa4b98-4cb6-4fa3-82d7-8910d2c2d1c6"
    Então o status da resposta deve ser 200 ou 400 ou 404
    E a resposta deve confirmar a atualização

  Cenário: Atualizar secao furto roubo de intercorrencia
    Quando eu atualizo a secao furto roubo da intercorrencia "588b1e8c-b67a-4c24-8826-cac09ac61f0c"
    Então o status da resposta deve ser 200 ou 400 ou 404
    E a resposta deve confirmar a atualização

  Cenário: Atualizar furto roubo com dados patrimonio primeira intercorrencia
    Quando eu atualizo furto roubo com patrimonio da intercorrencia "728c33bf-bf05-4260-9526-592724c3e688"
    Então o status da resposta deve ser 200 ou 400 ou 404
    E a resposta deve confirmar a atualização

  Cenário: Atualizar furto roubo com dados patrimonio segunda intercorrencia
    Quando eu atualizo furto roubo com patrimonio da intercorrencia "1984c91d-36f5-4c8b-be17-7c0862171f3d"
    Então o status da resposta deve ser 200 ou 400 ou 404
    E a resposta deve confirmar a atualização

  Cenário: Atualizar nao furto roubo com envolvido e sem info agressor
    Quando eu atualizo nao furto roubo com envolvido da intercorrencia "61cc6825-b1cb-412c-a175-0e58259aacc9"
    Então o status da resposta deve ser 200 ou 400 ou 404
    E a resposta deve confirmar a atualização

  Cenário: Atualizar secao final com declarante e protocolo primeira intercorrencia
    Quando eu atualizo secao final com dados completos da intercorrencia "61cc6825-b1cb-412c-a175-0e58259aacc9"
    Então o status da resposta deve ser 200 ou 400 ou 404
    E a resposta deve confirmar a atualização

  Cenário: Atualizar secao final segunda intercorrencia
    Quando eu atualizo secao final da intercorrencia "728c33bf-bf05-4260-9526-592724c3e688"
    Então o status da resposta deve ser 200 ou 400 ou 404
    E a resposta deve confirmar a atualização

  Cenário: Atualizar secao final terceira intercorrencia
    Quando eu atualizo secao final da intercorrencia "5fa876a1-f87f-4bb8-bac1-50550921a357"
    Então o status da resposta deve ser 200 ou 400 ou 404
    E a resposta deve confirmar a atualização

  Cenário: Atualizar secao final com dados vazios quarta intercorrencia
    Quando eu atualizo secao final com dados vazios da intercorrencia "bebadc5c-1bdb-4714-a602-78f1e14e993e"
    Então o status da resposta deve ser 200 ou 400 ou 404
    E a resposta deve confirmar a atualização

  # ==================== NOVOS TESTES GET ====================

  Cenário: Listar todos os declarantes disponiveis
    Quando eu consulto a lista de declarantes
    Então o status da resposta deve ser 200
    E a resposta deve conter uma lista de declarantes

  Cenário: Consultar intercorrencia especifica ID c2235f88
    Quando eu consulto a intercorrência do diretor com ID "c2235f88-a80d-48e6-b51a-cf88c3f6d28a"
    Então o status da resposta deve ser 200 ou 404
    E se encontrada a resposta deve conter dados da intercorrência

  Cenário: Consultar intercorrencia especifica ID 0214e317
    Quando eu consulto a intercorrência do diretor com ID "0214e317-d428-49be-a11f-52b9b12c2f1b"
    Então o status da resposta deve ser 200 ou 404
    E se encontrada a resposta deve conter dados da intercorrência

  Cenário: Consultar intercorrencia especifica ID a0451c9f
    Quando eu consulto a intercorrência do diretor com ID "a0451c9f-f59a-4d81-88af-c27d5ff00705"
    Então o status da resposta deve ser 200 ou 404
    E se encontrada a resposta deve conter dados da intercorrência

  Cenário: Consultar intercorrencia especifica ID 232b2761
    Quando eu consulto a intercorrência do diretor com ID "232b2761-dbfb-49b8-872b-df7b647eca06"
    Então o status da resposta deve ser 200 ou 404
    E se encontrada a resposta deve conter dados da intercorrência

  # ==================== TESTES VERIFY-INTERCORRENCIA COM ID ====================

  Cenário: Verificar intercorrencia por ID 728c33bf
    Quando eu verifico a intercorrencia com ID "728c33bf-bf05-4260-9526-592724c3e688"
    Então o status da resposta deve ser 200 ou 403 ou 404
    E a resposta pode estar em formato JSON

  Cenário: Verificar intercorrencia por ID 5fa876a1
    Quando eu verifico a intercorrencia com ID "5fa876a1-f87f-4bb8-bac1-50550921a357"
    Então o status da resposta deve ser 200 ou 403 ou 404
    E a resposta pode estar em formato JSON

  Cenário: Verificar intercorrencia por ID 1984c91d primeira verificacao
    Quando eu verifico a intercorrencia com ID "1984c91d-36f5-4c8b-be17-7c0862171f3d"
    Então o status da resposta deve ser 200 ou 403 ou 404
    E a resposta pode estar em formato JSON

  Cenário: Verificar intercorrencia por ID bebadc5c primeira verificacao
    Quando eu verifico a intercorrencia com ID "bebadc5c-1bdb-4714-a602-78f1e14e993e"
    Então o status da resposta deve ser 200 ou 403 ou 404
    E a resposta pode estar em formato JSON

  Cenário: Verificar intercorrencia por ID ba9a8a29 primeira verificacao
    Quando eu verifico a intercorrencia com ID "ba9a8a29-fdbf-48c2-90c7-620f4284f45e"
    Então o status da resposta deve ser 200 ou 403 ou 404
    E a resposta pode estar em formato JSON

  Cenário: Verificar intercorrencia por ID 34376aec
    Quando eu verifico a intercorrencia com ID "34376aec-3bfc-4085-8390-64ed13fb96b0"
    Então o status da resposta deve ser 200 ou 403 ou 404
    E a resposta pode estar em formato JSON

  Cenário: Verificar intercorrencia por ID 61cc6825
    Quando eu verifico a intercorrencia com ID "61cc6825-b1cb-412c-a175-0e58259aacc9"
    Então o status da resposta deve ser 200 ou 403 ou 404
    E a resposta pode estar em formato JSON

  Cenário: Verificar intercorrencia por ID bebadc5c segunda verificacao
    Quando eu verifico a intercorrencia com ID "bebadc5c-1bdb-4714-a602-78f1e14e993e"
    Então o status da resposta deve ser 200 ou 403 ou 404
    E a resposta pode estar em formato JSON

  Cenário: Verificar intercorrencia por ID ba9a8a29 segunda verificacao
    Quando eu verifico a intercorrencia com ID "ba9a8a29-fdbf-48c2-90c7-620f4284f45e"
    Então o status da resposta deve ser 200 ou 403 ou 404
    E a resposta pode estar em formato JSON

  Cenário: Verificar intercorrencia por ID 1984c91d segunda verificacao
    Quando eu verifico a intercorrencia com ID "1984c91d-36f5-4c8b-be17-7c0862171f3d"
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

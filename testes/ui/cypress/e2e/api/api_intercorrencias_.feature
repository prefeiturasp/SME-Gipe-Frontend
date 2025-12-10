# language: pt
@skip @api 
Funcionalidade: API  Intercorrências 
  Como diretor de escola
  Quero validar os endpoints de intercorrências
  Para garantir o funcionamento correto do sistema

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

  # ==================== TESTES GET ====================

  Cenário: Consultar intercorrência específica por ID
    Quando eu consulto a intercorrência do diretor com ID "b6534347-d7f1-487a-8d2f-9d7e113cbd27"
    Então o status da resposta deve ser 200
    E se encontrada a resposta deve conter dados da intercorrência

  # ==================== TESTES PUT ====================

  Cenário: Atualizar furto roubo com dados patrimonio primeira intercorrencia
    Quando eu atualizo furto roubo com patrimonio da intercorrencia "8c919ca4-a646-42c9-8f70-978d663106fd"
    Então o status da resposta deve ser 200
    E a resposta deve confirmar a atualização

  Cenário: Atualizar furto roubo com dados patrimonio segunda intercorrencia
    Quando eu atualizo furto roubo com patrimonio da intercorrencia "5ef2e927-561c-4c20-aa13-143c969e3a3f"
    Então o status da resposta deve ser 200 ou 404
    E a resposta deve confirmar a atualização

  Cenário: Atualizar nao furto roubo com envolvido e sem info agressor
    Quando eu atualizo nao furto roubo com envolvido da intercorrencia "ddd6777c-854f-4e90-b1cc-7562b1134572"
    Então o status da resposta deve ser 200
    E a resposta deve confirmar a atualização

  Cenário: Atualizar secao final com declarante e protocolo primeira intercorrencia
    Quando eu atualizo secao final com dados completos da intercorrencia "dd05c9d0-ab68-4330-9b3c-bb5a47a8f91d"
    Então o status da resposta deve ser 200 ou 400
    E a resposta deve confirmar a atualização

  Cenário: Atualizar secao final segunda intercorrencia
    Quando eu atualizo secao final da intercorrencia "b6534347-d7f1-487a-8d2f-9d7e113cbd27"
    Então o status da resposta deve ser 200 ou 400
    E a resposta deve confirmar a atualização

  Cenário: Atualizar secao final terceira intercorrencia
    Quando eu atualizo secao final da intercorrencia "8c919ca4-a646-42c9-8f70-978d663106fd"
    Então o status da resposta deve ser 200 ou 400
    E a resposta deve confirmar a atualização

  # ==================== NOVOS TESTES GET ====================

  Cenário: Listar todos os declarantes disponiveis
    Quando eu consulto a lista de declarantes
    Então o status da resposta deve ser 200
    E a resposta deve conter uma lista de declarantes

  Cenário: Consultar intercorrencia especifica ID 1fc9d190
    Quando eu consulto a intercorrência do diretor com ID "1fc9d190-35a2-41b4-8427-1f40cbebd42b"
    Então o status da resposta deve ser 200 ou 404
    E se encontrada a resposta deve conter dados da intercorrência

  Cenário: Consultar intercorrencia especifica ID 3a2987a5
    Quando eu consulto a intercorrência do diretor com ID "3a2987a5-0292-4984-8b9a-32fb19e3e7b3"
    Então o status da resposta deve ser 200 ou 404
    E se encontrada a resposta deve conter dados da intercorrência

  Cenário: Consultar intercorrencia especifica ID 41fa0311
    Quando eu consulto a intercorrência do diretor com ID "41fa0311-456c-4fbd-bbfa-aea6087d42aa"
    Então o status da resposta deve ser 200 ou 404
    E se encontrada a resposta deve conter dados da intercorrência

  Cenário: Consultar intercorrencia especifica ID 9b0dfe8e
    Quando eu consulto a intercorrência do diretor com ID "9b0dfe8e-8ed6-4310-8e92-becc4eebb6ad"
    Então o status da resposta deve ser 200 ou 404
    E se encontrada a resposta deve conter dados da intercorrência

  # ==================== TESTES VERIFY-INTERCORRENCIA COM ID ====================

  Cenário: Verificar intercorrencia por ID b6534347 segunda verificacao
    Quando eu verifico a intercorrencia com ID "b6534347-d7f1-487a-8d2f-9d7e113cbd27"
    Então o status da resposta deve ser 200 ou 403 ou 404
    E a resposta pode estar em formato JSON

  # ==================== TESTES ADICIONAIS GET ====================

  Cenário: Listar categorias disponiveis para intercorrencias
    Quando eu consulto as categorias disponiveis
    Então o status da resposta deve ser 200
    E a resposta deve conter lista de categorias

  Cenário: Obter schema da API em formato YAML lingua afrikaans
    Quando eu consulto o schema da API em formato "yaml" e lingua "af"
    Então o status da resposta deve ser 200 ou 406
    E a resposta deve estar em formato YAML

  Cenário: Obter schema da API em formato YAML lingua ingles
    Quando eu consulto o schema da API em formato "yaml" e lingua "en"
    Então o status da resposta deve ser 200 ou 406
    E a resposta deve estar em formato YAML

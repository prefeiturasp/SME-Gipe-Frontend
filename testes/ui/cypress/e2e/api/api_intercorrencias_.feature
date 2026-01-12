# language: pt
@skip @api @intercorrencias
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

  Cenário: Listar todos os declarantes disponiveis
    Quando eu consulto a lista de declarantes
    Então o status da resposta deve ser 200
    E a resposta deve conter uma lista de declarantes

  Cenário: Consultar intercorrencia especifica existente
    Quando eu consulto a lista de intercorrências do diretor
    Então o status da resposta deve ser 200
    E a resposta deve conter pelo menos uma intercorrência com UUID válido

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

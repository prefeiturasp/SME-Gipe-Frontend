#language: pt
 @skip @api @envolvidos
Funcionalidade: API GIPE - Tipos de Envolvidos
  Como usuário do sistema GIPE
  Quero validar o endpoint de tipos de envolvidos
  Para garantir que os perfis estão corretos e acessíveis

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

  @smoke @listagem
  Cenário: Listar todos os tipos de envolvidos
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E a resposta deve ser uma lista de envolvidos

  @validacao @estrutura
  Cenário: Validar estrutura de resposta dos envolvidos
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E cada envolvido deve ter os campos obrigatórios:
      | campo                  |
      | uuid                   |
      | perfil_dos_envolvidos  |

  @validacao @quantidade
  Cenário: Validar quantidade mínima de tipos de envolvidos
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E a lista deve conter pelo menos 12 tipos de envolvidos

  @validacao @perfis_especificos
  Cenário: Validar perfis específicos de envolvidos
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E devem existir os seguintes perfis:
      | perfil_dos_envolvidos       |
      | Apenas um estudante         |
      | Mais de um estudante        |
      | Diretor/Vice-diretor        |
      | Coordenador pedagogico      |
      | Orientador Educacional      |
      | Funcionários                |
      | Estagiarios/monitores       |
      | Familiares                  |
      | Pessoas externas            |

  @validacao @uuid_especifico
  Cenário: Validar UUID de perfil específico - Apenas um estudante
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E o perfil "Apenas um estudante" deve ter o UUID "f9a11fa8-c179-487b-9d51-a3e39ae8cb44"

  @validacao @uuid_especifico
  Cenário: Validar UUID de perfil específico - Mais de um estudante
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E o perfil "Mais de um estudante" deve ter o UUID "609fc5d8-8e41-420c-9511-b39b6f4317b6"

  @validacao @uuid_especifico
  Cenário: Validar UUID de perfil específico - Diretor/Vice-diretor
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E o perfil "Diretor/Vice-diretor" deve ter o UUID "e46a6d7a-305d-400e-9cc4-9eacfc03018f"

  @validacao @formato_uuid
  Cenário: Validar formato UUID de todos os envolvidos
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E todos os UUIDs devem estar no formato válido

  @validacao @perfis_unicos
  Cenário: Validar que não há perfis duplicados
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E não devem existir perfis duplicados

  @negativo @sem_autenticacao
  Cenário: Tentar acessar tipos de envolvidos sem autenticação
    Quando eu tento acessar os tipos de envolvidos sem token
    Então o status da resposta deve ser 401 ou 403

  @performance
  Cenário: Validar tempo de resposta do endpoint de envolvidos
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E o tempo de resposta deve ser menor que 3000ms

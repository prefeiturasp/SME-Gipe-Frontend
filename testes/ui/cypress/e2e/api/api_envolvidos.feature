#language: pt
 @api @envolvidos
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
    E a lista deve conter pelo menos 11 tipos de envolvidos

  @validacao @uuid_especifico
  Cenário: Validar UUID de perfil específico - Um estudante
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E o perfil "Um estudante" deve ter UUID no formato válido

  @validacao @uuid_especifico
  Cenário: Validar UUID de perfil específico - Entre estudantes
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E o perfil "Entre estudantes" deve ter UUID no formato válido

  @validacao @uuid_especifico
  Cenário: Validar UUID de perfil específico - Diretor/Assistente de diretor
    Quando eu consulto os tipos de envolvidos
    Então o status da resposta deve ser 200
    E o perfil "Diretor/Assistente de diretor" deve ter UUID no formato válido

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

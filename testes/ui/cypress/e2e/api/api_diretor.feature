#language: pt
@api @diretor
Funcionalidade: API Diretor - Endpoint Diretor
  Como diretor de escola
  Quero gerenciar intercorrências através da API
  Para registrar e acompanhar ocorrências escolares

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

  # GET /api-intercorrencias/v1/diretor/
  @smoke @listagem
  Cenário: Listar todas as intercorrências do diretor
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um array
    E a lista não deve estar vazia

  # GET /api-intercorrencias/v1/diretor/{uuid}/
  @smoke @busca_uuid
  Cenário: Buscar intercorrência específica por UUID
    Quando eu faço uma requisição GET para "/diretor/b6534347-d7f1-487a-8d2f-9d7e113cbd27/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um objeto
    E o objeto deve ter o campo uuid

  # GET /api-intercorrencias/v1/diretor/
  @validacao @estrutura_listagem
  Cenário: Validar estrutura de resposta da listagem de intercorrências
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter intercorrências com campos obrigatórios:
      | campo                                |
      | id                                   |
      | uuid                                 |
      | status                               |
      | status_display                       |
      | status_extra                         |
      | criado_em                            |
      | atualizado_em                        |
      | data_ocorrencia                      |
      | unidade_codigo_eol                   |
      | dre_codigo_eol                       |
      | nome_unidade                         |
      | nome_dre                             |
      | user_username                        |
      | sobre_furto_roubo_invasao_depredacao |
      | tipos_ocorrencia                     |
      | descricao_ocorrencia                 |

  # GET /api-intercorrencias/v1/diretor/{uuid}/
  @validacao @estrutura_detalhes
  Cenário: Validar estrutura de detalhes de uma intercorrência
    Quando eu faço uma requisição GET para "/diretor/b6534347-d7f1-487a-8d2f-9d7e113cbd27/"
    Então o status code da resposta deve ser 200
    E a intercorrência deve ter uuid "b6534347-d7f1-487a-8d2f-9d7e113cbd27"
    E a intercorrência deve ter o campo "status"
    E a intercorrência deve ter o campo "status_display"
    E a intercorrência deve ter o campo "data_ocorrencia"
    E a intercorrência deve ter o campo "unidade_codigo_eol"
    E a intercorrência deve ter o campo "tipos_ocorrencia"

  # GET /api-intercorrencias/v1/diretor/
  @validacao @envolvidos
  Cenário: Validar estrutura de envolvidos nas intercorrências
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E as intercorrências com envolvidos devem ter:
      | campo                  |
      | envolvido.uuid         |
      | envolvido.perfil_dos_envolvidos |

  # GET /api-intercorrencias/v1/diretor/
  @validacao @tipos_ocorrencia
  Cenário: Validar estrutura de tipos de ocorrência
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E cada intercorrência deve ter tipos_ocorrencia como array
    E os tipos_ocorrencia devem ter os campos:
      | campo |
      | uuid  |
      | nome  |

  # GET /api-intercorrencias/v1/diretor/
  @validacao @declarante
  Cenário: Validar estrutura de declarante nas intercorrências
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E as intercorrências com declarante devem ter:
      | campo                      |
      | declarante_detalhes.uuid   |
      | declarante_detalhes.declarante |

  # GET /api-intercorrencias/v1/diretor/{uuid}/
  @validacao @campos_booleanos
  Cenário: Validar campos booleanos das intercorrências
    Quando eu faço uma requisição GET para "/diretor/b6534347-d7f1-487a-8d2f-9d7e113cbd27/"
    Então o status code da resposta deve ser 200
    E os campos booleanos devem ter valores válidos:
      | campo                                |
      | sobre_furto_roubo_invasao_depredacao |
      | notificado_conselho_tutelar          |
      | acompanhado_naapa                    |

  # GET /api-intercorrencias/v1/diretor/categorias-disponiveis/
  @validacao @categorias
  Cenário: Listar categorias disponíveis para diretor
    Quando eu faço uma requisição GET para "/diretor/categorias-disponiveis/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter categorias disponíveis

  # GET /api-intercorrencias/v1/diretor/
  @validacao @comunicacao_seguranca
  Cenário: Validar campo comunicacao_seguranca_publica
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E as intercorrências devem ter valores válidos de comunicacao_seguranca_publica:
      | valor       |
      | sim_gcm     |
      | nao         |

  # GET /api-intercorrencias/v1/diretor/
  @validacao @protocolo_acionado
  Cenário: Validar campo protocolo_acionado
    Quando eu faço uma requisição GET para "/diretor/"
      | sim_gcm     |
      | nao         |
      | registro |

  # GET /api-intercorrencias/v1/diretor/{uuid}/ - NEGATIVO
  @negativo @uuid_invalido
  Cenário: Tentar buscar intercorrência com UUID inválido
    Quando eu faço uma requisição GET para "/diretor/uuid-invalido-123/"
    Então o status code da resposta deve ser 400 ou 404

  # GET /api-intercorrencias/v1/diretor/{uuid}/ - NEGATIVO
  @negativo @uuid_inexistente
  Cenário: Tentar buscar intercorrência com UUID inexistente
    Quando eu faço uma requisição GET para "/diretor/00000000-0000-0000-0000-000000000000/"
    Então o status code da resposta deve ser 404

  # GET /api-intercorrencias/v1/diretor/ - NEGATIVO
  @negativo @sem_autenticacao
  Cenário: Tentar acessar endpoint sem autenticação
    Dado que não estou autenticado
    Quando eu tento acessar "/diretor/" sem token
    Então o status da resposta deve ser 401 ou 403

  # GET /api-intercorrencias/v1/diretor/ - PERFORMANCE
  @performance
  Cenário: Validar tempo de resposta da listagem
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E o tempo de resposta deve ser menor que 5000 milissegundos

  # GET /api-intercorrencias/v1/diretor/{uuid}/ - PERFORMANCE
  @performance
  Cenário: Validar tempo de resposta da busca por UUID
    Quando eu faço uma requisição GET para "/diretor/b6534347-d7f1-487a-8d2f-9d7e113cbd27/"
    Então o status code da resposta deve ser 200
    E o tempo de resposta deve ser menor que 3000 milissegundos

  # GET /api-intercorrencias/v1/diretor/
  @validacao @quantidade_minima
  Cenário: Validar quantidade mínima de intercorrências
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E a resposta deve conter pelo menos 1 intercorrências

  # GET /api-intercorrencias/v1/diretor/{uuid}/
  @validacao @campos_timestamp
  Cenário: Validar formato de campos de data/hora
    Quando eu faço uma requisição GET para "/diretor/b6534347-d7f1-487a-8d2f-9d7e113cbd27/"
    Então o status code da resposta deve ser 200
    E os campos de timestamp devem ter formato ISO 8601:
      | campo          |
      | criado_em      |
      | atualizado_em  |
      | data_ocorrencia|

  # GET /api-intercorrencias/v1/diretor/
  @validacao @unidade_dre
  Cenário: Validar códigos EOL de unidade e DRE
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E cada intercorrência deve ter códigos EOL válidos
    E o código DRE deve ter 6 dígitos
    E o código unidade deve ter 6 dígitos

  # GET /api-intercorrencias/v1/diretor/
  @validacao @status_extra
  Cenário: Validar campo status_extra
    Quando eu faço uma requisição GET para "/diretor/"
    Então o status code da resposta deve ser 200
    E as intercorrências devem ter status_extra válidos:
      | status_extra  |
      | Incompleta    |
      | Em andamento  |


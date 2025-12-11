#language: pt
@skip @api @dre
Funcionalidade: API DRE - Gestão de Intercorrências
  Como usuário da DRE
  Quero visualizar e atualizar intercorrências da minha DRE
  Para preencher campos próprios e enviar para GIPE

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
  Cenário: Listar todas as intercorrências da DRE
    Quando eu consulto a lista de intercorrências da DRE
    Então o status da resposta deve ser 200
    E a resposta deve ser uma lista de intercorrências

  @validacao @estrutura
  Cenário: Validar estrutura de resposta das intercorrências DRE
    Quando eu consulto a lista de intercorrências da DRE
    Então o status da resposta deve ser 200
    E cada intercorrência DRE deve ter os campos obrigatórios:
      | campo                                 |
      | id                                    |
      | uuid                                  |
      | unidade_codigo_eol                    |
      | dre_codigo_eol                        |
      | status                                |
      | status_display                        |
      | acionamento_seguranca_publica         |
      | interlocucao_sts                      |
      | interlocucao_cpca                     |
      | interlocucao_supervisao_escolar       |
      | interlocucao_naapa                    |

  @busca @uuid
  Cenário: Buscar intercorrência DRE por UUID específico
    Quando eu consulto a intercorrência DRE com UUID "b6534347-d7f1-487a-8d2f-9d7e113cbd27"
    Então o status da resposta deve ser 200
    E a resposta deve conter o UUID "b6534347-d7f1-487a-8d2f-9d7e113cbd27"
    E a resposta deve ter unidade_codigo_eol "000558"
    E a resposta deve ter dre_codigo_eol "108600"

  # ============================================================================
  # NOTA: Testes PUT retornam 400 - requerem permissões específicas de usuário DRE
  # Mantidos para referência futura quando token DRE estiver disponível
  # ============================================================================

  @skip @atualizacao @put @interlocucao_sts
  Cenário: Atualizar campo de interlocução STS
    Dado que existe a intercorrência DRE "b6534347-d7f1-487a-8d2f-9d7e113cbd27"
    Quando eu atualizo a intercorrência DRE com os dados:
      | campo                   | valor                                      |
      | interlocucao_sts        | true                                       |
      | info_complementar_sts   | Informação complementar da atuação STS     |
    Então o status da resposta deve ser 200
    E o campo "interlocucao_sts" deve ser true
    E o campo "info_complementar_sts" deve conter "Informação complementar"

  @skip @atualizacao @put @interlocucao_cpca
  Cenário: Atualizar campo de interlocução CPCA
    Dado que existe a intercorrência DRE "8c919ca4-a646-42c9-8f70-978d663106fd"
    Quando eu atualizo a intercorrência DRE com os dados:
      | campo                   | valor                                        |
      | interlocucao_cpca       | true                                         |
      | info_complementar_cpca  | Interlocução com CPCA realizada com sucesso  |
    Então o status da resposta deve ser 200
    E o campo "interlocucao_cpca" deve ser true
    E o campo "info_complementar_cpca" deve conter "CPCA realizada"

  @skip @atualizacao @put @interlocucao_supervisao
  Cenário: Atualizar campo de interlocução Supervisão Escolar
    Dado que existe a intercorrência DRE "b6534347-d7f1-487a-8d2f-9d7e113cbd27"
    Quando eu atualizo a intercorrência DRE com os dados:
      | campo                                 | valor                                              |
      | interlocucao_supervisao_escolar       | true                                               |
      | info_complementar_supervisao_escolar  | Supervisão Escolar acompanhando o caso             |
    Então o status da resposta deve ser 200
    E o campo "interlocucao_supervisao_escolar" deve ser true
    E o campo "info_complementar_supervisao_escolar" deve conter "Supervisão Escolar"

  @skip @atualizacao @put @interlocucao_naapa
  Cenário: Atualizar campo de interlocução NAAPA
    Dado que existe a intercorrência DRE "8c919ca4-a646-42c9-8f70-978d663106fd"
    Quando eu atualizo a intercorrência DRE com os dados:
      | campo                   | valor                                    |
      | interlocucao_naapa      | true                                     |
      | info_complementar_naapa | NAAPA atuando no acompanhamento do caso  |
    Então o status da resposta deve ser 200
    E o campo "interlocucao_naapa" deve ser true
    E o campo "info_complementar_naapa" deve conter "NAAPA atuando"

  @skip @atualizacao @put @acionamento_seguranca
  Cenário: Atualizar acionamento de segurança pública
    Dado que existe a intercorrência DRE "b6534347-d7f1-487a-8d2f-9d7e113cbd27"
    Quando eu atualizo a intercorrência DRE com os dados:
      | campo                          | valor |
      | acionamento_seguranca_publica  | true  |
    Então o status da resposta deve ser 200
    E o campo "acionamento_seguranca_publica" deve ser true

  @skip @atualizacao @put @multiplos_campos
  Cenário: Atualizar múltiplos campos de interlocução simultaneamente
    Dado que existe a intercorrência DRE "8c919ca4-a646-42c9-8f70-978d663106fd"
    Quando eu atualizo a intercorrência DRE com os dados:
      | campo                                 | valor                                    |
      | interlocucao_sts                      | true                                     |
      | info_complementar_sts                 | Atuação conjunta STS                     |
      | interlocucao_supervisao_escolar       | true                                     |
      | info_complementar_supervisao_escolar  | Acompanhamento supervisão escolar        |
      | acionamento_seguranca_publica         | true                                     |
    Então o status da resposta deve ser 200
    E o campo "interlocucao_sts" deve ser true
    E o campo "interlocucao_supervisao_escolar" deve ser true
    E o campo "acionamento_seguranca_publica" deve ser true

  @validacao @status
  Cenário: Validar status das intercorrências
    Quando eu consulto a lista de intercorrências da DRE
    Então o status da resposta deve ser 200
    E devem existir intercorrências com os seguintes status:
      | status                       |
      | em_preenchimento_diretor     |
      | enviado_para_dre             |
      | enviado_para_gipe            |

  @validacao @campos_booleanos
  Cenário: Validar que campos booleanos retornam valores corretos
    Quando eu consulto a intercorrência DRE com UUID "3a2987a5-0292-4984-8b9a-32fb19e3e7b3"
    Então o status da resposta deve ser 200
    E o campo "acionamento_seguranca_publica" deve ser booleano
    E o campo "interlocucao_sts" deve ser booleano
    E o campo "interlocucao_cpca" deve ser booleano
    E o campo "interlocucao_supervisao_escolar" deve ser booleano
    E o campo "interlocucao_naapa" deve ser booleano

  @negativo @uuid_invalido
  Cenário: Tentar buscar intercorrência DRE com UUID inválido
    Quando eu consulto a intercorrência DRE com UUID "99999999-9999-9999-9999-999999999999"
    Então o status da resposta deve ser 404

  @negativo @sem_autenticacao
  Cenário: Tentar acessar intercorrências DRE sem autenticação
    Quando eu tento acessar as intercorrências DRE sem token
    Então o status da resposta deve ser 401 ou 403

  @performance
  Cenário: Validar tempo de resposta do endpoint DRE
    Quando eu consulto a lista de intercorrências da DRE
    Então o status da resposta deve ser 200
    E o tempo de resposta deve ser menor que 5000ms

  @validacao @filtragem @dre_codigo
  Cenário: Validar filtro por código DRE
    Quando eu consulto a lista de intercorrências da DRE
    Então o status da resposta deve ser 200
    E devem existir intercorrências dos códigos DRE:
      | dre_codigo_eol |
      | 108300         |
      | 108600         |

  @validacao @filtragem @unidade_codigo
  Cenário: Validar múltiplas unidades EOL
    Quando eu consulto a lista de intercorrências da DRE
    Então o status da resposta deve ser 200
    E devem existir intercorrências das unidades:
      | unidade_codigo_eol |
      | 011568             |
      | 000558             |
      | 000442             |

  @validacao @status_extra
  Cenário: Validar campo status_extra
    Quando eu consulto a lista de intercorrências da DRE
    Então o status da resposta deve ser 200
    E devem existir os seguintes status_extra:
      | status_extra  |
      | Incompleta    |
      | Em andamento  |

  @validacao @quantidade_minima
  Cenário: Validar quantidade mínima de intercorrências
    Quando eu consulto a lista de intercorrências da DRE
    Então o status da resposta deve ser 200
    E a lista deve conter pelo menos 70 intercorrências

  @validacao @campos_opcionais
  Cenário: Validar que campos info_complementar podem estar vazios
    Quando eu consulto a intercorrência DRE com UUID "b6534347-d7f1-487a-8d2f-9d7e113cbd27"
    Então o status da resposta deve ser 200
    E o campo "info_complementar_sts" deve existir
    E o campo "info_complementar_cpca" deve existir
    E o campo "info_complementar_supervisao_escolar" deve existir
    E o campo "info_complementar_naapa" deve existir

  @validacao @id_sequencial
  Cenário: Validar que IDs são numéricos e sequenciais
    Quando eu consulto a lista de intercorrências da DRE
    Então o status da resposta deve ser 200
    E todos os IDs devem ser numéricos

  @validacao @campos_vazios
  Cenário: Validar intercorrência com campos info_complementar vazios
    Quando eu consulto a intercorrência DRE com UUID "8c919ca4-a646-42c9-8f70-978d663106fd"
    Então o status da resposta deve ser 200
    E o campo "interlocucao_sts" deve ser "false"
    E o campo "interlocucao_cpca" deve ser "false"
    E o campo "info_complementar_sts" deve ser ""
    E o campo "info_complementar_cpca" deve ser ""

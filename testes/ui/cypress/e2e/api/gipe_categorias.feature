#language: pt
 @skip @api @gipe_categorias
Funcionalidade: API GIPE - Categorias Disponíveis
  Como usuário do GIPE
  Quero validar o endpoint de categorias disponíveis
  Para garantir que os choices estão corretos e acessíveis

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
  Cenário: Listar todas as categorias disponíveis para GIPE
    Quando eu consulto as categorias disponíveis do GIPE
    Então o status da resposta deve ser 200
    E a resposta deve conter todas as categorias do GIPE

  @validacao @estrutura
  Cenário: Validar estrutura de resposta das categorias
    Quando eu consulto as categorias disponíveis do GIPE
    Então o status da resposta deve ser 200
    E a resposta deve ter a estrutura correta de categorias
    E cada categoria deve ter campos value e label

  @validacao @envolve_arma
  Cenário: Validar categoria envolve_arma_ou_ataque
    Quando eu consulto as categorias disponíveis do GIPE
    Então o status da resposta deve ser 200
    E a categoria "envolve_arma_ou_ataque" deve existir
    E a categoria "envolve_arma_ou_ataque" deve ter as opções:
      | value | label |
      | sim   | Sim   |
      | nao   | Não   |

  @validacao @ameaca
  Cenário: Validar categoria ameaca_foi_realizada_de_qual_maneira
    Quando eu consulto as categorias disponíveis do GIPE
    Então o status da resposta deve ser 200
    E a categoria "ameaca_foi_realizada_de_qual_maneira" deve existir
    E a categoria "ameaca_foi_realizada_de_qual_maneira" deve ter as opções:
      | value            | label            |
      | presencialmente  | Presencialmente  |
      | virtualmente     | Virtualmente     |

  @validacao @motivo
  Cenário: Validar categoria motivo_ocorrencia
    Quando eu consulto as categorias disponíveis do GIPE
    Então o status da resposta deve ser 200
    E a categoria "motivo_ocorrencia" deve existir
    E a categoria "motivo_ocorrencia" deve conter pelo menos 10 opções

  @validacao @motivo_especifico
  Cenário: Validar opções específicas de motivo_ocorrencia
    Quando eu consulto as categorias disponíveis do GIPE
    Então o status da resposta deve ser 200
    E a categoria "motivo_ocorrencia" deve conter a opção "bullying" com label "Bullying"
    E a categoria "motivo_ocorrencia" deve conter a opção "cyberbullying" com label "Cyberbullying"
    E a categoria "motivo_ocorrencia" deve conter a opção "racismo" com label "Racismo"
    E a categoria "motivo_ocorrencia" deve conter a opção "homofobia" com label "Homofobia"

  @validacao @ciclo
  Cenário: Validar categoria ciclo_aprendizagem
    Quando eu consulto as categorias disponíveis do GIPE
    Então o status da resposta deve ser 200
    E a categoria "ciclo_aprendizagem" deve existir
    E a categoria "ciclo_aprendizagem" deve ter as opções:
      | value            | label                             |
      | alfabetizacao    | Alfabetização (1º ao 3º ano)      |
      | interdisciplinar | Interdisciplinar (4º ao 6º ano)   |
      | autoral          | Autoral (7º ao 9º ano)            |

  @validacao @completo
  Cenário: Validar todas as categorias principais estão presentes
    Quando eu consulto as categorias disponíveis do GIPE
    Então o status da resposta deve ser 200
    E devem existir as seguintes categorias:
      | categoria                               |
      | envolve_arma_ou_ataque                  |
      | ameaca_foi_realizada_de_qual_maneira    |
      | motivo_ocorrencia                       |
      | ciclo_aprendizagem                      |

  @negativo @sem_autenticacao
  Cenário: Tentar acessar categorias sem autenticação
    Dado que não estou autenticado
    Quando eu tento acessar as categorias do GIPE sem token
    Então o status da resposta deve ser 401 ou 403

  @performance
  Cenário: Validar tempo de resposta do endpoint de categorias
    Quando eu consulto as categorias disponíveis do GIPE
    Então o status da resposta deve ser 200
    E o tempo de resposta deve ser menor que 3000 milissegundos

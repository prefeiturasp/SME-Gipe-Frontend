#language: pt
@api @categorias
Funcionalidade: API GIPE - Categorias Disponíveis
  Como usuário da API GIPE
  Quero consultar as categorias disponíveis
  Para classificar corretamente as intercorrências

  Contexto:
    Dado que possuo credenciais válidas de autenticação
    E que estou autenticado na API

  @validacao @estrutura
  Cenário: Validar estrutura de resposta das categorias
    Quando eu faço uma requisição GET para "/gipe/categorias-disponiveis/"
    Então o status code da resposta deve ser 200
    E a resposta deve ser um objeto com categorias

  @validacao @envolve_arma
  Cenário: Validar categoria envolve_arma_ou_ataque
    Quando eu faço uma requisição GET para "/gipe/categorias-disponiveis/"
    Então o status code da resposta deve ser 200
    E a categoria envolve_arma_ou_ataque deve estar presente

  @validacao @ameaca
  Cenário: Validar categoria ameaca_foi_realizada_de_qual_maneira
    Quando eu faço uma requisição GET para "/gipe/categorias-disponiveis/"
    Então o status code da resposta deve ser 200
    E a categoria ameaca_foi_realizada_de_qual_maneira deve estar presente

  @validacao @motivo
  Cenário: Validar categoria motivo_ocorrencia
    Quando eu faço uma requisição GET para "/gipe/categorias-disponiveis/"
    Então o status code da resposta deve ser 200
    E a categoria motivo_ocorrencia deve estar presente

  @negativo @sem_autenticacao
  Cenário: Tentar acessar categorias sem autenticação
    Dado que não estou autenticado
    Quando eu tento acessar "/gipe/categorias-disponiveis/" sem token
    Então o status da resposta deve ser 401 ou 403

  @performance
  Cenário: Validar tempo de resposta do endpoint de categorias
    Quando eu faço uma requisição GET para "/gipe/categorias-disponiveis/"
    Então o status code da resposta deve ser 200
    E o tempo de resposta deve ser menor que 5000 milissegundos

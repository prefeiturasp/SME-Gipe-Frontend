# language: pt

@gipe_carga @load-test @performance
Funcionalidade: Testes de Carga e Performance do Sistema GIPE
  Como QA do sistema GIPE
  Eu quero validar performance sob diferentes cargas
  Para garantir que o sistema atende usuários em condições reais de uso educacional

  # ====== CARGA DE USUARIOS ======
  # Valida comportamento do sistema com múltiplos usuários simultâneos
  # Cenários realistas para ambiente educacional (escolas, DREs, GIPE)
  # NOTA: Usa navegação web (cy.request para páginas HTML) ao invés de APIs diretas

  @carga @usuarios-simultaneos @critico @smoke
  Cenário: Validar sistema com 50 usuários simultâneos
    Dado que simulo 50 usuários acessando o sistema
    Quando todos navegam para dashboard
    Então tempo de resposta deve ser < 5 segundos
    E taxa de sucesso deve ser > 95%
    E nenhum timeout deve ocorrer
    E CPU do servidor não deve exceder 80%

  @carga @usuarios-simultaneos @stress @critico
  Cenário: Validar sistema com 100 usuários simultâneos
    Dado que simulo 100 usuários acessando o sistema
    Quando todos navegam para dashboard
    Então tempo de resposta deve ser < 10 segundos
    E taxa de sucesso deve ser > 90%
    E nenhum timeout deve ocorrer
    E CPU do servidor não deve exceder 80%

  @carga @usuarios-simultaneos @stress @extremo
  Cenário: Validar sistema com 500 usuários simultâneos
    Dado que simulo 500 usuários acessando o sistema
    Quando todos navegam para dashboard
    Então tempo de resposta deve ser < 20 segundos
    E taxa de sucesso deve ser > 85%
    E sistema não deve ter crash
    E memória do servidor permanece estável

  @skip @carga @usuarios-simultaneos @stress @extremo
  Cenário: Validar sistema com 1000 usuários simultâneos
    Dado que simulo 1000 usuários acessando o sistema
    Quando todos navegam para dashboard
    Então tempo de resposta deve ser < 30 segundos
    E taxa de sucesso deve ser > 85%
    E sistema não deve ter crash
    E memória do servidor permanece estável

  # ====== CARGA DE REQUISIÇÕES ======
  # Valida requisições simultâneas usando navegação web
  # Simula múltiplos usuários acessando páginas ao mesmo tempo

  @skip @carga @requisicoes @simultaneas @critico
  Cenário: Validar 50 requisições de API simultâneas
    Dado que envio 50 requisições para o sistema
    Quando requisições são processadas simultaneamente
    Então todas as requisições devem completar
    E tempo total deve ser < 15 segundos
    E não há request timeout
    E respostas estão corretas

  @skip  @carga @requisicoes @simultaneas @stress
  Cenário: Validar 100 requisições de API simultâneas
    Dado que envio 100 requisições para o sistema
    Quando requisições são processadas simultaneamente
    Então todas as requisições devem completar
    E tempo total deve ser < 30 segundos
    E não há request timeout
    E respostas estão corretas

  # ====== CARGA DE DADOS ======
  # Valida performance com formulários complexos
  # NOTA: Cenários de listagem de API removidos - endpoints retornam 404 em QA

  @carga @volume-dados @formulario @critico
  Cenário: Validar formulário complexo de ocorrência
    Dado que tenho um formulário com 100+ campos
    Quando carrego o formulário
    Então carregamento completo em < 2 segundos
    E não há lag ao preencher campos
    E validação é rápida
    E envio funciona corretamente

  # ====== CARGA DE SESSÃO ======
  # Valida comportamento de sessão de usuários
  # Cenário realista: usuário para de usar sistema temporariamente

  @carga @sessao @inatividade @critico
  Cenário: Validar comportamento com usuário inativo por 1 hora
    Dado que estou logado no sistema
    E não realizo ações por 1 hora
    Então sistema deve avisar sobre inatividade
    E sessão pode expirar
    E próxima ação dispara re-autenticação
    E histórico é preservado

  # ====== CARGA DE CONEXAO ======
  # Valida performance em diferentes velocidades de internet
  # Escolas podem ter: banda larga, 4G (celular/tablet), 3G (internet ruim)

  @carga @conexao @banda-larga @baseline
  Cenário: Validar performance com conexão 100 Mbps (baseline)
    Dado que tenho conexão de 100 Mbps
    Quando uso o sistema
    Então performance está ótima
    E nenhuma limitação é visível
    E recursos carregam instantaneamente

  @carga @conexao @banda-media @critico
  Cenário: Validar performance com conexão 4G (20 Mbps)
    Dado que tenho conexão 4G de 20 Mbps
    Quando uso o sistema
    Então performance é aceitável
    E lazy loading é utilizado
    E sem travamentos críticos
    E imagens são otimizadas

  @carga @conexao @banda-baixa @critico
  Cenário: Validar usabilidade com conexão 3G (2 Mbps)
    Dado que tenho conexão 3G lenta de 2 Mbps
    Quando uso o sistema
    Então aplicação funciona mesmo lentamente
    E funcionalidade crítica permanece acessível
    E fallbacks são utilizados
    E usuário recebe feedback

# language: pt

@smoke @regression @complement_gipe
Funcionalidade: Complemento de Intercorrência - Perfil GIPE
  Como usuário com perfil GIPE
  Quero complementar intercorrências registradas pelas unidades educacionais
  Para registrar as ações realizadas pelo GIPE

  Contexto:
    Dado que eu acesso o sistema
    E eu efetuo login com RF GIPE Admin
    E estou na página principal do sistema

  @smoke
  Cenário: Autenticação e acesso ao dashboard
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema
    E devo ver o título "Intercorrências Institucionais"
    E o sistema deve exibir as funcionalidades disponíveis para GIPE

  @listagem
  Cenário: Consultar listagem de ocorrências
    Quando o usuário está na página principal do sistema
    Então o sistema deve mostrar a listagem de ocorrências cadastradas no sistema

  @skip @complemento @preenchimento @critico
  Cenário: Complementar informações de intercorrência registrada
    # ── Aba 1: Acesso e validação do formulário ───────────────────────────
    Quando COMP_GIPE abre ocorrencia valida para complemento
    E COMP_GIPE valida a existencia do texto "Intercorrências Institucionais"
    E COMP_GIPE valida campos de pessoas envolvidas quando aplicavel
    Então COMP_GIPE clica no botão "Próximo"

    # ── Aba 2: Detalhes DRE ───────────────────────────────────────────────
    E COMP_GIPE valida a existencia do texto "Detalhes da Intercorrência - Diretoria Regional de Educação (DRE)"
    E COMP_GIPE seleciona aleatoriamente orgaos acionados pela DRE
    E COMP_GIPE seleciona Sim ou Não para SEI e preenche numero quando necessario
    Então COMP_GIPE clica no botão "Próximo" 

    # ── Aba 3: Detalhes GIPE ──────────────────────────────────────────────
    E valido e preencho o campo "Envolve arma ou ataque?"
    E valido e preencho o campo "Ameaça foi realizada de qual maneira?"
    E devo selecionar opções aleatórias nos campos GIPE
    E devo preencher os campos complementares GIPE
    Quando COMP_GIPE localiza e clica em "Finalizar e enviar"

    # ── Conclusão ─────────────────────────────────────────────────────────
    Quando UE valida a existencia do texto sucesso "Ocorrência registrada com sucesso!"
    E UE aguarda 20 segundos
    E UE clica em Fechar
    Então UE valida a existencia do Texto " Histórico de ocorrências registradas"


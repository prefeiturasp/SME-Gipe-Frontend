# language: pt

@complement_gipe @gipe
Funcionalidade: Gestão de Intercorrências - Perfil GIPE
  Como usuário com perfil GIPE
  Eu quero acessar e complementar intercorrências registradas
  Para analisar e gerenciar ocorrências da região

  Contexto: Autenticação no sistema
    Dado que eu acesso o sistema
    E eu efetuo login com RF GIPE Admin
    E estou na página principal do sistema

  @login @validacao @smoke
  Cenário: Validar autenticação e acesso ao dashboard
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema
    E devo ver o título "Intercorrências Institucionais"
    E o sistema deve exibir as funcionalidades disponíveis para GIPE

  @consulta @listagem
  Cenário: Consultar listagem de ocorrências cadastradas no sistema
    Quando o usuário está na página principal do sistema
    Então o sistema deve mostrar a listagem de ocorrências cadastradas no sistema

  @skip @complemento @preenchimento @critico @fluxo_completo
  Cenário: Complementar informações de intercorrência registrada
    # ── Aba 1: Acesso e validação do formulário de ocorrência ─────────────
    Quando COMP_GIPE abre ocorrencia valida para complemento
    E COMP_GIPE valida a existencia do texto "Intercorrências Institucionais"
    E COMP_GIPE valida a existencia do texto "Quando a ocorrência aconteceu?*"
    E COMP_GIPE valida a existencia do texto "A ocorrência é:"
    E COMP_GIPE valida a existencia do texto "Qual o tipo de ocorrência?*"
    E COMP_GIPE valida a existencia do texto "Descreva a ocorrência*"
    E COMP_GIPE valida a existencia do texto "Importante: Esse campo não exclui a necessidade de lavratura do boletim de ocorrência"
    E COMP_GIPE valida a existencia do texto "Existem informações sobre as pessoas envolvidas?*"
    E COMP_GIPE valida campos de pessoas envolvidas quando aplicavel
    E COMP_GIPE valida a existencia do texto "Quem é o declarante?*"
    E COMP_GIPE valida a existencia do texto "Anexos"
    E COMP_GIPE valida a existencia do texto "Anexar novo arquivo"
    E COMP_GIPE valida a existencia dos botões "Anterior" e "Próximo"
    Então COMP_GIPE clica no botão "Próximo"

    # ── Aba 2: Preenchimento dos detalhes da DRE ──────────────────────────
    E COMP_GIPE valida a existencia do texto "Detalhes da Intercorrência - Diretoria Regional de Educação (DRE)"
    E COMP_GIPE valida a existencia do texto "A ronda escolar foi acionada?*"
    E COMP_GIPE valida a existencia do texto "A supervisão escolar foi comunicada?*"
    E COMP_GIPE valida a existencia do texto "Há um número do processo SEI?*"
    E COMP_GIPE valida a existencia do texto "Anexos"
    E COMP_GIPE localiza o button "Anterior"
    Então COMP_GIPE clica no botão "Próximo"

    # ── Aba 3: Detalhes GIPE ──────────────────────────────────────────────
    Então devo visualizar o formulário da aba 3 GIPE
    E valida a existencia do texto "Continuação da ocorrência"
    E valido e preencho o campo "Envolve arma ou ataque?"
    E valido e preencho o campo "Ameaça foi realizada de qual maneira?"
    E devo selecionar opções aleatórias nos campos GIPE
    E devo preencher os campos complementares GIPE
    E COMP_GIPE localiza o button "Anterior"
    Quando COMP_GIPE localiza e clica em "Finalizar e enviar"

    # ── Conclusão: Confirmação de envio e retorno ao histórico ────────────
    Quando UE valida a existencia do texto sucesso "Ocorrência registrada com sucesso!"
    E UE aguarda 20 segundos
    E UE clica em Fechar
    Então UE valida a existencia do Texto " Histórico de ocorrências registradas"


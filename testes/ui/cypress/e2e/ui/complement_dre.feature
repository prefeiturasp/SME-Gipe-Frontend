# language: pt

@complement_dre @dre @regression
Funcionalidade: Complemento de Intercorrência - Perfil DRE
  Como usuário autenticado com perfil DRE (Diretoria Regional de Educação)
  Eu quero visualizar e complementar intercorrências registradas pelas unidades educacionais
  Para encaminhar, analisar e registrar as ações realizadas pela DRE

  Contexto:
    Dado que eu acesso o sistema como DRE
    E eu efetuo login com RF DRE
    E estou na página principal do sistema

  @validacao @smoke
  Cenário: Validar autenticação e acesso ao dashboard
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema
    E devo ver o título "Intercorrências Institucionais"
    E o sistema deve exibir as funcionalidades disponíveis para DRE

  @consulta @listagem
  Cenário: Consultar listagem de ocorrências cadastradas no sistema
    Quando o usuário está na página principal do sistema
    Então o sistema deve mostrar a listagem de ocorrências cadastradas no sistema

  @skip @complemento @preenchimento @critico
  Cenário: Complementar informações de intercorrência registrada
    # ── Aba 1: Acesso e validação do formulário de ocorrência ─────────────
    Quando eu visualizo uma ocorrência registrada
    E COMP_DRE valida a existencia do texto "Intercorrências Institucionais"
    E COMP_DRE valida a existencia do texto "Quando a ocorrência aconteceu?*"
    E COMP_DRE valida a existencia do texto "A ocorrência é:"
    E COMP_DRE valida a existencia do texto "Qual o tipo de ocorrência?*"
    E COMP_DRE valida a existencia do texto "Descreva a ocorrência*"
    E COMP_DRE valida a existencia do texto "Importante: Esse campo não exclui a necessidade de lavratura do boletim de ocorrência"
    E COMP_DRE valida a existencia do texto "Existem informações sobre as pessoas envolvidas?*"
    E COMP_DRE valida campos de pessoas envolvidas quando aplicavel
    E COMP_DRE valida a existencia do texto "Quem é o declarante?*"
    E COMP_DRE valida a existencia do texto "Anexos"
    E COMP_DRE valida a existencia do texto "Anexar novo arquivo"
    E COMP_DRE valida a existencia dos botões "Anterior" e "Próximo"
    Então COMP_DRE clica no botão "Próximo"

    # ── Aba 2: Preenchimento dos detalhes da DRE ──────────────────────────
    E COMP_DRE valida a existencia do texto "Detalhes da Intercorrência - Diretoria Regional de Educação (DRE)"
    E COMP_DRE valida a existencia do texto "A ronda escolar foi acionada?*"
    E COMP_DRE seleciona Sim ou Não de forma aleatoria
    E COMP_DRE valida a existencia do texto "A supervisão escolar foi comunicada?*"
    E COMP_DRE seleciona Sim ou Não de forma aleatoria
    E COMP_DRE valida a existencia do texto "Há um número do processo SEI?*"
    E COMP_DRE seleciona Sim ou Não para SEI e preenche numero quando necessario
    E COMP_DRE valida a existencia do texto "Anexos"
    E COMP_DRE localiza o button "Anterior"
    E COMP_DRE localiza e clica em "Finalizar e enviar"

    # ── Conclusão: Confirmação de envio e retorno ao histórico ────────────
    Quando UE valida a existencia do texto sucesso "Ocorrência registrada com sucesso!"
    E UE aguarda 20 segundos
    E UE clica em Fechar
    Então UE valida a existencia do Texto " Histórico de ocorrências registradas"

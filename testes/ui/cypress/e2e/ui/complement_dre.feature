# language: pt

@smoke @regression @complement_dre
Funcionalidade: Complemento de Intercorrência - Perfil DRE
  Como usuário com perfil DRE
  Quero complementar intercorrências registradas pelas unidades educacionais
  Para registrar as ações realizadas pela DRE

  Contexto:
    Dado que eu acesso o sistema como DRE
    E eu efetuo login com RF DRE
    E estou na página principal do sistema

  @smoke
  Cenário: Autenticação e acesso ao dashboard
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema
    E devo ver o título "Intercorrências Institucionais"
    E o sistema deve exibir as funcionalidades disponíveis para DRE

  @listagem
  Cenário: Consultar listagem de ocorrências
    Quando o usuário está na página principal do sistema
    Então o sistema deve mostrar a listagem de ocorrências cadastradas no sistema

  @skip @complemento @preenchimento @critico
  Cenário: Complementar informações de intercorrência registrada
    # ── Pré-condição: garante ocorrência Em Andamento ─────────────────────
    Quando COMP_DRE verifica se existe ocorrencia em andamento e cadastra se necessario

    # ── Aba 1: Acesso e validação do formulário ───────────────────────────
    Quando eu visualizo uma ocorrência registrada
    E COMP_DRE valida a existencia do texto "Intercorrências Institucionais"
    E COMP_DRE valida campos de pessoas envolvidas quando aplicavel
    Então COMP_DRE clica no botão "Próximo"

    # ── Aba 2: Detalhes DRE ───────────────────────────────────────────────
    E COMP_DRE valida a existencia do texto "Detalhes da Intercorrência - Diretoria Regional de Educação (DRE)"
    E COMP_DRE seleciona aleatoriamente orgaos acionados pela DRE
    E COMP_DRE seleciona Sim ou Não para SEI e preenche numero quando necessario
    E COMP_DRE localiza e clica em "Finalizar e enviar"

    # ── Conclusão ─────────────────────────────────────────────────────────
    Quando UE valida a existencia do texto sucesso "Ocorrência registrada com sucesso!"
    E UE aguarda 20 segundos
    E UE clica em Fechar
    Então UE valida a existencia do Texto " Histórico de ocorrências registradas"

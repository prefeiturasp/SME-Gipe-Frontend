# language: pt

@smoke @regression @cadastro_ocorrencias
Funcionalidade: Cadastro de Ocorrência - Patrimônio (Furto/Roubo)
  Como usuário da Unidade Educacional
  Quero registrar ocorrências patrimoniais de furto ou roubo
  Para documentar adequadamente os incidentes

  Contexto:
    Dado que eu acesso o sistema
    E eu efetuo login com RF

  @login @smoke
  Cenário: Autenticação e acesso ao dashboard
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema
    E devo ver o título "Intercorrências Institucionais"
    E o sistema deve exibir as funcionalidades disponíveis para UE

  @listagem
  Cenário: Consultar listagem de ocorrências
    Quando o usuário está na página principal do sistema
    Então o sistema deve mostrar a listagem de ocorrências cadastradas no sistema

  @cadastro @furto_roubo @patrimonio @sim
  Cenário: Registrar ocorrência de patrimônio com Smart Sampa - Sim
    # ── Aba 1: Identificação ─────────────────────────────────────────────
    Quando FURTO inicia o cadastro de uma nova ocorrência
    E FURTO informa a data atual do ocorrido
    E FURTO informa a hora atual do ocorrido
    E FURTO seleciona o tipo Patrimonia da ocorrência
    E FURTO avança para a próxima aba

    # ── Aba 2: Tipo de Ocorrência ────────────────────────────────────────
    Quando clica no campo "Qual o tipo de ocorrência?"
    E Selecionar tipo de ocorrencia aleatorio furto
    E Descreva a ocorrencia - Descreva a ocorrência
    E seleciona "Sim, Unidade Educacional é contemplada pelo Smart Sampa?*"
    E clica em Proximo

    # ── Aba 3: Declarante e Segurança Pública ────────────────────────────
    E clica no campo do declarante
    E seleciona uma das opções disponivel de forma aleatoria
    E clica no campo de seguranca publica
    E seleciona uma das opções disponivel de forma aleatoria
    Então clica em proximo

    # ── Aba 4: Anexos ────────────────────────────────────────────────────
    E FURTO localiza e clica no botão "Escolher arquivo"
    E FURTO seleciona a imagem do pc
    E FURTO clica no campo tipo documento
    E FURTO seleciona "Boletim de ocorrência"
    E FURTO localiza e clica no botão "Anexar documento"
    E Ocorren_FURTO localiza e clica em "Finalizar e enviar"

    # ── Conclusão ─────────────────────────────────────────────────────────
    Quando UE valida a existencia do texto sucesso "Ocorrência registrada com sucesso!"
    E UE aguarda 20 segundos
    E UE clica em Fechar
    Então UE valida a existencia do Texto " Histórico de ocorrências registradas"

  @cadastro @furto_roubo @patrimonio @nao
  Cenário: Registrar ocorrência de patrimônio com Smart Sampa - Não
    # ── Aba 1: Identificação ─────────────────────────────────────────────
    Quando FURTO inicia o cadastro de uma nova ocorrência
    E FURTO informa a data atual do ocorrido
    E FURTO informa a hora atual do ocorrido
    E FURTO seleciona o tipo Patrimonia da ocorrência
    E FURTO avança para a próxima aba

    # ── Aba 2: Tipo de Ocorrência ────────────────────────────────────────
    Quando clica no campo "Qual o tipo de ocorrência?"
    E Selecionar tipo de ocorrencia aleatorio furto
    E Descreva a ocorrencia - Descreva a ocorrência
    E seleciona "Não, Unidade Educacional é contemplada pelo Smart Sampa?*"
    E clica em Proximo

    # ── Aba 3: Declarante e Segurança Pública ────────────────────────────
    E clica no campo do declarante
    E seleciona uma das opções disponivel de forma aleatoria
    E clica no campo de seguranca publica
    E seleciona uma das opções disponivel de forma aleatoria
    Então clica em proximo

    # ── Aba 4: Anexos ────────────────────────────────────────────────────
    E FURTO localiza e clica no botão "Escolher arquivo"
    E FURTO seleciona a imagem do pc
    E FURTO clica no campo tipo documento
    E FURTO seleciona "Boletim de ocorrência"
    E FURTO localiza e clica no botão "Anexar documento"
    E Ocorren_FURTO localiza e clica em "Finalizar e enviar"

    # ── Conclusão ─────────────────────────────────────────────────────────
    Quando UE valida a existencia do texto sucesso "Ocorrência registrada com sucesso!"
    E UE aguarda 20 segundos
    E UE clica em Fechar
    Então UE valida a existencia do Texto " Histórico de ocorrências registradas"

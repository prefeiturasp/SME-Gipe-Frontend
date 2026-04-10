# language: pt

@cadastro_ocorrencias @smoke @regression
Funcionalidade: Gestão de Ocorrências no Sistema GIPE
  Como usuário autorizado do sistema GIPE
  Eu quero gerenciar ocorrências relacionadas ao patrimônio escolar
  Para que os incidentes sejam adequadamente documentados, rastreados e resolvidos

  Contexto: Acesso ao sistema com usuário autenticado
    Dado que eu acesso o sistema
    E eu efetuo login com RF

  @login @validacao @smoke
  Cenário: Validar autenticação e acesso ao dashboard
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema
    E devo ver o título "Intercorrências Institucionais"
    E o sistema deve exibir as funcionalidades disponíveis para UE

  @consulta @listagem
  Cenário: Consultar listagem de ocorrências cadastradas no sistema
    Quando o usuário está na página principal do sistema
    Então o sistema deve mostrar a listagem de ocorrências cadastradas no sistema

  @cadastro @furto_roubo @patrimonio @sim
  Cenário: Registrar nova ocorrência de patrimônio envolvendo furto ou roubo
    # ── Aba 1: Data, Hora e Tipo ─────────────────────────────────────────
    Quando FURTO inicia o cadastro de uma nova ocorrência
    E FURTO informa a data atual do ocorrido
    E FURTO informa a hora atual do ocorrido
    E FURTO seleciona o tipo Patrimonia da ocorrência
    E FURTO avança para a próxima aba

    # === ABA 2: Detalhes da Ocorrência ===
    Quando clica no campo "Qual o tipo de ocorrência?"
    E Selecionar tipo de ocorrencia aleatorio furto
    E Descreva a ocorrencia - Descreva a ocorrência
    E valida a existencia do texto "Importante: Esse campo não exclui a necessidade de lavratura do boletim de ocorrência"
    E valida a existencia do titulo "Unidade Educacional é contemplada pelo Smart Sampa?*"
    E valida opcoes sim e nao do Smart Sampa
    E seleciona "Sim, Unidade Educacional é contemplada pelo Smart Sampa?*"
    E valida botoes anterior e proximo
    E clica em Proximo
    Então o sistema deve navegar para a próxima etapa do formulário

    # === ABA 3: Informações Complementares ===
    E clica no campo do declarante
    E seleciona uma das opções disponivel de forma aleatoria
    E clica no campo de seguranca publica
    E seleciona uma das opções disponivel de forma aleatoria
    Então clica em proximo

    # ── Aba 4: Anexos e Finalização ───────────────────────────────────────
    E FURTO localiza e clica no botão "Escolher arquivo"
    E FURTO seleciona a imagem do pc
    E FURTO clica no campo tipo documento
    E FURTO seleciona "Boletim de ocorrência"
    E FURTO localiza e clica no botão "Anexar documento"
    E Ocorren_FURTO localiza o button "Anterior"
    E Ocorren_FURTO localiza e clica em "Finalizar e enviar"

    # ── Conclusão ─────────────────────────────────────────────────────────
    Quando UE valida a existencia do texto sucesso "Ocorrência registrada com sucesso!"
    E UE aguarda 20 segundos
    E UE clica em Fechar
    Então UE valida a existencia do Texto " Histórico de ocorrências registradas"

  @cadastro @furto_roubo @patrimonio @nao
  Cenário: Registrar nova ocorrência de patrimônio envolvendo furto ou roubo - resposta Não
    # ── Aba 1: Data, Hora e Tipo ─────────────────────────────────────────
    Quando FURTO inicia o cadastro de uma nova ocorrência
    E FURTO informa a data atual do ocorrido
    E FURTO informa a hora atual do ocorrido
    E FURTO seleciona o tipo Patrimonia da ocorrência
    E FURTO avança para a próxima aba

    # === ABA 2: Detalhes da Ocorrência ===
    Quando clica no campo "Qual o tipo de ocorrência?"
    E Selecionar tipo de ocorrencia aleatorio furto
    E Descreva a ocorrencia - Descreva a ocorrência
    E valida a existencia do texto "Importante: Esse campo não exclui a necessidade de lavratura do boletim de ocorrência"
    E valida a existencia do titulo "Unidade Educacional é contemplada pelo Smart Sampa?*"
    E valida opcoes sim e nao do Smart Sampa
    E seleciona "Não, Unidade Educacional é contemplada pelo Smart Sampa?*"
    E valida botoes anterior e proximo
    E clica em Proximo
    Então o sistema deve navegar para a próxima etapa do formulário

    # === ABA 3: Informações Complementares ===
    E clica no campo do declarante
    E seleciona uma das opções disponivel de forma aleatoria
    E clica no campo de seguranca publica
    E seleciona uma das opções disponivel de forma aleatoria
    Então clica em proximo

    # ── Aba 4: Anexos e Finalização ───────────────────────────────────────
    E FURTO localiza e clica no botão "Escolher arquivo"
    E FURTO seleciona a imagem do pc
    E FURTO clica no campo tipo documento
    E FURTO seleciona "Boletim de ocorrência"
    E FURTO localiza e clica no botão "Anexar documento"
    E Ocorren_FURTO localiza o button "Anterior"
    E Ocorren_FURTO localiza e clica em "Finalizar e enviar"

    # ── Conclusão ─────────────────────────────────────────────────────────
    Quando UE valida a existencia do texto sucesso "Ocorrência registrada com sucesso!"
    E UE aguarda 20 segundos
    E UE clica em Fechar
    Então UE valida a existencia do Texto " Histórico de ocorrências registradas"

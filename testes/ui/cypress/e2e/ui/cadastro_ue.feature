# language: pt

@smoke @regression @cadastro_ocorrencia
Funcionalidade: Cadastro de Ocorrência - Perfil Unidade Educacional
  Como usuário da Unidade Educacional
  Quero registrar ocorrências interpessoais com informações completas
  Para garantir o correto acompanhamento dos incidentes escolares

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

  @cadastro @informacoes_adicional @estudante @dados_aleatorios
  Cenário: Registrar ocorrência interpessoal com dados aleatórios
    # ── Aba 1: Identificação ─────────────────────────────────────────────
    Quando UE inicia o cadastro de uma nova ocorrência
    E UE informa a data atual do ocorrido
    E UE informa a hora atual do ocorrido
    E UE seleciona o tipo Interpessoal da ocorrência
    E UE avança para a próxima aba

    # ── Aba 2: Tipo de Ocorrência e Envolvidos ───────────────────────────
    E clica no campo "Qual o tipo de ocorrência?"
    E seleciona o tipo de ocorrência aleatoriamente
    E fecha o dropdown de seleção
    E UE abre o campo de envolvidos
    E UE seleciona um envolvido aleatoriamente
    E UE clica no botão Clique aqui
    E UE fecha o dropdown de envolvidos
    E clica no campo "Descreva a ocorrência*"
    E preenche a descrição com texto aleatório
    E UE seleciona Sim para informações sobre pessoas envolvidas
    E UE avança para a próxima aba

    # ── Aba 3: Pessoas Envolvidas ────────────────────────────────────────
    E UE clica no campo e informa o nome da pessoa aleatoriamente
    E UE informa a idade aleatoriamente
    E UE valida e seleciona o campo "Qual o gênero?*" de forma aleatoria
    E UE valida e seleciona o campo "Raça/cor auto declarada*" de forma aleatoria
    E UE valida e seleciona o campo "Qual a etapa escolar?*" de forma aleatoria
    E UE valida e seleciona o campo "Qual a frequência escolar?*" de forma aleatoria
    E UE valida e seleciona o campo "Pessoa com deficiência?*" de forma aleatoria
    E UE valida e seleciona o campo "Nacionalidade*" de forma aleatoria
    E UE valida e preenche o campo "Como é a interação da pessoa no ambiente escolar?*" com texto aleatorio
    E UE Valida e clica em adicionar pessoa
    E UE clica no campo e informa o nome da pessoa aleatoriamente
    E UE informa a idade aleatoriamente
    E UE valida e seleciona o campo "Qual o gênero?*" de forma aleatoria
    E UE valida e seleciona o campo "Raça/cor auto declarada*" de forma aleatoria
    E UE valida e seleciona o campo "Qual a etapa escolar?*" de forma aleatoria
    E UE valida e seleciona o campo "Qual a frequência escolar?*" de forma aleatoria
    E UE valida e seleciona o campo "Pessoa com deficiência?*" de forma aleatoria
    E UE valida e seleciona o campo "Nacionalidade*" de forma aleatoria
    E UE valida e preenche o campo "Como é a interação da pessoa no ambiente escolar?*" com texto aleatorio
    E UE abre e seleciona as motivações aleatoriamente
    E UE seleciona aleatoriamente resposta para Conselho Tutelar
    E UE seleciona aleatoriamente opcao de acompanhamento da ocorrência
    E UE seleciona aleatoriamente resposta para processo SEI
    E UE avança para a próxima aba

    # ── Aba 4: Declarante e Protocolos ───────────────────────────────────
    E UE clica no campo do declarante
    E UE seleciona uma das opções de forma aleatoria como declarante
    E UE clica no campo de seguranca publica
    E UE seleciona opcao seguranca publica de forma aleatoria entre as opções disponiveis
    E UE clica no campo de protocolo
    E UE seleciona protocolo aleatoriamente
    E UE clica em proximo para anexos

    # ── Aba 5: Anexos ────────────────────────────────────────────────────
    E UE localiza e clica no botão "Escolher arquivo"
    E UE seleciona a imagem do pc
    E UE clica no campo tipo documento
    E UE seleciona "Boletim de ocorrência"
    E UE localiza e clica no botão "Anexar documento"
    E UE localiza e clica em "Finalizar e enviar"

    # ── Conclusão ────────────────────────────────────────────────────────
    Quando UE valida a existencia do texto sucesso "Ocorrência registrada com sucesso!"
    E UE aguarda 20 segundos
    E UE clica em Fechar
    Então UE valida a existencia do Texto " Histórico de ocorrências registradas"

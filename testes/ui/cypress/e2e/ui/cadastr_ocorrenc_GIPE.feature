# language: pt

@smoke @regression @cadastro_ocorrencia
Funcionalidade: Cadastro de Ocorrência - Perfil Administrador GIPE
  Como administrador GIPE
  Quero registrar ocorrências interpessoais com informações completas
  Para garantir o correto acompanhamento dos incidentes escolares

  Contexto:
    Dado que eu acesso o sistema
    E eu efetuo login com RF GIPE Admin

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
    Quando GIPE inicia o cadastro de uma nova ocorrência
    E GIPE informa a data atual do ocorrido
    E GIPE informa a hora atual do ocorrido
    E GIPE seleciona uma DRE aleatoriamente
    E GIPE seleciona uma Unidade Educacional aleatoriamente
    E GIPE seleciona o tipo Interpessoal da ocorrência
    E GIPE avança para a próxima aba

    # ── Aba 2: Tipo de Ocorrência e Envolvidos ───────────────────────────
    E clica no campo "Qual o tipo de ocorrência?"
    E seleciona o tipo de ocorrência aleatoriamente
    E fecha o dropdown de seleção
    E GIPE abre o campo de envolvidos
    E GIPE seleciona um envolvido aleatoriamente
    E GIPE clica no botão Clique aqui
    E GIPE fecha o dropdown de envolvidos
    E clica no campo "Descreva a ocorrência*"
    E preenche a descrição com texto aleatório
    E GIPE seleciona Sim para informações sobre pessoas envolvidas
    E GIPE avança para a próxima aba

    # ── Aba 3: Pessoas Envolvidas ────────────────────────────────────────
    E GIPE clica no campo e informa o nome da pessoa aleatoriamente
    E GIPE informa a idade aleatoriamente
    E GIPE valida e seleciona o campo "Qual o gênero?*" de forma aleatoria
    E GIPE valida e seleciona o campo "Raça/cor auto declarada*" de forma aleatoria
    E GIPE valida e seleciona o campo "Qual a etapa escolar?*" de forma aleatoria
    E GIPE valida e seleciona o campo "Qual a frequência escolar?*" de forma aleatoria
    E GIPE valida e seleciona o campo "Pessoa com deficiência?*" de forma aleatoria
    E GIPE valida e seleciona o campo "Nacionalidade*" de forma aleatoria
    E GIPE valida e preenche o campo "Como é a interação da pessoa no ambiente escolar?*" com texto aleatorio
    E GIPE Valida e clica em adicionar pessoa
    E GIPE clica no campo e informa o nome da pessoa aleatoriamente
    E GIPE informa a idade aleatoriamente
    E GIPE valida e seleciona o campo "Qual o gênero?*" de forma aleatoria
    E GIPE valida e seleciona o campo "Raça/cor auto declarada*" de forma aleatoria
    E GIPE valida e seleciona o campo "Qual a etapa escolar?*" de forma aleatoria
    E GIPE valida e seleciona o campo "Qual a frequência escolar?*" de forma aleatoria
    E GIPE valida e seleciona o campo "Pessoa com deficiência?*" de forma aleatoria
    E GIPE valida e seleciona o campo "Nacionalidade*" de forma aleatoria
    E GIPE valida e preenche o campo "Como é a interação da pessoa no ambiente escolar?*" com texto aleatorio
    E GIPE abre e seleciona as motivações aleatoriamente
    E GIPE seleciona aleatoriamente resposta para Conselho Tutelar
    E GIPE seleciona aleatoriamente opcao de acompanhamento da ocorrência
    E GIPE seleciona aleatoriamente resposta para processo SEI
    E GIPE avança para a próxima aba

    # ── Aba 4: Declarante e Protocolos ───────────────────────────────────
    E GIPE clica no campo do declarante
    E GIPE seleciona GIPE como declarante
    E GIPE clica no campo de seguranca publica
    E GIPE seleciona opcao seguranca publica
    E GIPE clica no campo de protocolo
    E GIPE seleciona protocolo aleatoriamente
    E GIPE clica em proximo para anexos

    # ── Aba 5: Anexos ────────────────────────────────────────────────────
    E GIPE localiza e clica no botão "Escolher arquivo"
    E GIPE seleciona a imagem do pc
    E GIPE clica no campo tipo documento
    E GIPE seleciona "Boletim de ocorrência"
    E GIPE localiza e clica no botão "Anexar documento"
    E GIPE localiza e clica em "Finalizar"

    # ── Conclusão ────────────────────────────────────────────────────────
    Quando GIPE valida a existencia do texto sucesso "Ocorrência registrada com sucesso!"
    E GIPE aguarda 20 segundos
    E GIPE clica em Finalizar modal
    Então GIPE valida a existencia do Texto " Histórico de ocorrências registradas"
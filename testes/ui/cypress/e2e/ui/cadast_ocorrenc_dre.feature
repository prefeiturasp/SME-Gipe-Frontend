# language: pt

@smoke @regression @cadastro_dre
Funcionalidade: Cadastro de Ocorrência - Perfil DRE
  Como usuário com perfil DRE
  Quero registrar ocorrências completas com informações adicionais
  Para documentar adequadamente os incidentes

  Contexto:
    Dado que eu acesso o sistema
    E eu efetuo login com RF DRE ocorrencia

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

  @skip @cadastro @informacoes_adicional @estudante @dados_aleatorios
  Cenário: Registrar ocorrência completa com dados aleatórios
    # ── Aba 1: Identificação ─────────────────────────────────────────────
    Quando DRE inicia o cadastro de uma nova ocorrência
    E DRE informa a data atual do ocorrido
    E DRE informa a hora atual do ocorrido
    E DRE seleciona uma Unidade Educacional aleatoriamente
    E DRE seleciona o tipo Interpessoal da ocorrência
    E DRE avança para a próxima aba

    # ── Aba 2: Tipo de Ocorrência e Envolvidos ───────────────────────────
    E clica no campo "Qual o tipo de ocorrência?"
    E seleciona o tipo de ocorrência aleatoriamente
    E fecha o dropdown de seleção
    E DRE abre o campo de envolvidos
    E DRE seleciona um envolvido aleatoriamente
    E DRE clica no botão Clique aqui
    E DRE fecha o dropdown de envolvidos
    E clica no campo "Descreva a ocorrência*"
    E preenche a descrição com texto aleatório
    E DRE seleciona Sim para informações sobre pessoas envolvidas
    E DRE avança para a próxima aba

    # ── Aba 3: Pessoas Envolvidas ────────────────────────────────────────
    E DRE clica no campo e informa o nome da pessoa aleatoriamente
    E DRE informa a idade aleatoriamente
    E DRE valida e seleciona o campo "Qual o gênero?*" de forma aleatoria
    E DRE valida e seleciona o campo "Raça/cor auto declarada*" de forma aleatoria
    E DRE valida e seleciona o campo "Qual a etapa escolar?*" de forma aleatoria
    E DRE valida e seleciona o campo "Qual a frequência escolar?*" de forma aleatoria
    E DRE valida e seleciona o campo "Pessoa com deficiência?*" de forma aleatoria
    E DRE valida e seleciona o campo "Nacionalidade*" de forma aleatoria
    E DRE valida e preenche o campo "Como é a interação da pessoa no ambiente escolar?*" com texto aleatorio
    E DRE Valida e clica em adicionar pessoa
    E DRE clica no campo e informa o nome da pessoa aleatoriamente
    E DRE informa a idade aleatoriamente
    E DRE valida e seleciona o campo "Qual o gênero?*" de forma aleatoria
    E DRE valida e seleciona o campo "Raça/cor auto declarada*" de forma aleatoria
    E DRE valida e seleciona o campo "Qual a etapa escolar?*" de forma aleatoria
    E DRE valida e seleciona o campo "Qual a frequência escolar?*" de forma aleatoria
    E DRE valida e seleciona o campo "Pessoa com deficiência?*" de forma aleatoria
    E DRE valida e seleciona o campo "Nacionalidade*" de forma aleatoria
    E DRE valida e preenche o campo "Como é a interação da pessoa no ambiente escolar?*" com texto aleatorio
    E DRE abre e seleciona as motivações aleatoriamente
    E DRE seleciona aleatoriamente resposta para Conselho Tutelar
    E DRE seleciona aleatoriamente opcao de acompanhamento da ocorrência
    E DRE seleciona aleatoriamente resposta para processo SEI
    E DRE avança para a próxima aba

    # ── Aba 4: Declarante e Protocolos ───────────────────────────────────
    E DRE clica no campo do declarante
    E DRE seleciona uma das opções de forma aleatoria como declarante
    E DRE clica no campo de seguranca publica
    E DRE seleciona opcao seguranca publica de forma aleatoria entre as opções disponiveis
    E DRE clica no campo de protocolo
    E DRE seleciona protocolo aleatoriamente
    E DRE clica em proximo para anexos

    # ── Aba 5: Anexos ────────────────────────────────────────────────────
    E DRE localiza e clica no botão "Escolher arquivo"
    E DRE seleciona a imagem do pc
    E DRE clica no campo tipo documento
    E DRE seleciona "Boletim de ocorrência"
    E DRE localiza e clica no botão "Anexar documento"
    E DRE localiza e clica em "Finalizar e enviar"

    # ── Conclusão ─────────────────────────────────────────────────────────
    Quando DRE valida a existencia do texto sucesso "Ocorrência registrada com sucesso!"
    E DRE aguarda 20 segundos
    E DRE clica em Fechar
    Então DRE valida a existencia do Texto " Histórico de ocorrências registradas"
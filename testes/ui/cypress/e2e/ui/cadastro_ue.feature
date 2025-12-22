# language: pt

@cadastro_ue @smoke @regression
Funcionalidade: Cadastro de Ocorrência com Informações Adicionais
  Como usuário autorizado do sistema GIPE
  Eu quero registrar ocorrências completas com anexos
  Para documentar adequadamente os incidentes

  Contexto: 
    Dado que eu acesso o sistema
    E eu efetuo login com RF


  @skip @cadastro @informacoes_adicional @estudante @dados_aleatorios
  Cenário: Registrar ocorrência completa com dados aleatórios
    # Aba 1: Data e Hora
    Quando o usuário seleciona e clica em "Nova Ocorrencia"
    E seleciona "Quando a ocorrência aconteceu?" com a data atual
    E seleciona hora atual
    E seleciona "A ocorrência é sobre furto, roubo, invasão ou depredação?" como "Não"
    E clica no botão "Próximo"
    
    # Aba 2: Tipo de Ocorrência
    E clica no campo "Qual o tipo de ocorrência?"
    E Selecionar tipo de ocorrencia aleatorio
    E clica fora para fechar dropdown
    E clica no Campo "Quem são os envolvidos?*"
    E seleciona envolvidos aleatorio
    E clica no campo "Descreva a ocorrência*"
    E preenche descricao aleatoria
    E clica em opcao "Sim"
    E clica em "Proximo"
    
    # Aba 3: Informações do Agressor
    E preenche o campo nome agressor aleatorio
    E preenche o campo idade agressor aleatorio
    E preenche o campo CEP aleatorio
    E localiza o botão "Pesquisar CEP" e clica
    E insere numero residencia aleatorio
    E clica no campo motivacao
    E seleciona motivacoes aleatorias
    E clica fora do modal
    E seleciona genero aleatorio
    E seleciona etnico aleatorio
    E seleciona etapa aleatoria
    E seleciona frequencia aleatoria
    E preenche interacao aleatoria
    E preenche redes aleatoria
    E seleciona e clica em "Sim" conselho
    E seleciona e clica em "Sim" naapa
    E clica em "proximo" informacoes
    
    # Aba 4: Declarante e Protocolos
    E clica no campo do declarante ue
    E seleciona GIPE ue
    E clica no campo de seguranca publica ue
    E seleciona opcao seguranca ue
    E clica no campo de protocolo ue
    E seleciona protocolo ue
    E clica em proximo final
    
    # Aba 5: Anexos e Finalização
    E localiza e clica no botão "Escolher arquivo"
    E seleciona a imagem do pc
    E clica no campo tipo documento
    E seleciona "Boletim de ocorrência"
    E localiza e clica no botão "Anexar documento"
    E Localiza o button "Anterior"
    E localiza e clica em "Finalizar"
    
    # Modal de Conclusão
    Então sistema exibe modal com titulo "Conclusão de etapa"
    Quando preenche campo motivo encerramento com "Conclusão para teste"
    E clica em Finalizar modal
    E aguarda 20 segundos
    Então valida a existencia do Texto " Histórico de ocorrências registradas"
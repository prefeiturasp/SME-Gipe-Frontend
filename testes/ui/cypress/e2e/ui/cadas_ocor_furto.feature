# language: pt

@cadastro_ocorrencias @smoke @regression
Funcionalidade: Gestão de Ocorrências no Sistema GIPE
  Como usuário autorizado do sistema GIPE
  Eu quero gerenciar ocorrências relacionadas ao patrimônio escolar
  Para que os incidentes sejam adequadamente documentados, rastreados e resolvidos

  Contexto: Acesso ao sistema com usuário autenticado
    Dado que eu acesso o sistema
    E eu efetuo login com RF

  @skip @login @validacao @smoke
  Cenário: Validar autenticação e acesso ao dashboard
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema
    E devo ver o título "Intercorrências Institucionais"
    E o sistema deve exibir as funcionalidades disponíveis para UE

  @skip @consulta @listagem
  Cenário: Consultar listagem de ocorrências cadastradas no sistema
    Quando o usuário está na página principal do sistema
    Então o sistema deve mostrar a listagem de ocorrências cadastradas no sistema

  @cadastro @furto_roubo @patrimonio @sim
  Cenário: Registrar nova ocorrência de patrimônio envolvendo furto ou roubo
    # === ABA 1: Informações Básicas da Ocorrência ===
    Quando o usuário seleciona e clica em "Nova Ocorrencia"
    E seleciona "Quando a ocorrência aconteceu?" com a data atual
    E seleciona hora atual
    E seleciona "A ocorrência é sobre furto, roubo, invasão ou depredação?" como "sim"
    E clica no botão "Próximo"
    Então o sistema deve navegar para a próxima etapa do formulário
    
    # === ABA 2: Detalhes da Ocorrência ===
    Quando clica no campo "Qual o tipo de ocorrência?"
    E Selecionar tipo de ocorrencia aleatorio furto
    E Descreva a ocorrencia - Descreva a ocorrência
    E valida a existencia do texto "Importante: Esse campo não exclui a necessidade de lavratura do boletim de ocorrência"
    E valida a existencia do titulo "Unidade Educacional é contemplada pelo Smart Sampa?*"
    E valida opcoes sim e nao do Smart Sampa
    E seleciona "Sim, Unidade Educacional é contemplada pelo Smart Sampa?*"
    E valida botoes anterior e proximo aba2
    E clica em Proximo
    Então o sistema deve navegar para a próxima etapa do formulário
    
    # === ABA 3: Informações Complementares ===
    E clica no campo do declarante
    E seleciona uma das opções disponivel de forma aleatoria com indice 0
    E clica no campo de seguranca publica
    E seleciona uma das opções disponivel de forma aleatoria com indice 1
    E clica no campo de protocolo
    E seleciona uma das opções disponivel de forma aleatoria com indice 2
    E valida botoes anterior e proximo aba3
    Então clica em proximo aba3

    # === ABA 4: Anexos e Finalização ===
    E valida a existencia do texto "Anexos"
    E localiza e clica no botão "Escolher arquivo"
    E seleciona a imagem do pc
    E clica no campo tipo documento
    E seleciona "Boletim de ocorrência"
    E localiza e clica no botão "Anexar documento"
    E Localiza o button "Anterior"
    E localiza e clica em "Finalizar"

  @skip @cadastro @furto_roubo @patrimonio @nao
  Cenário: Registrar nova ocorrência de patrimônio envolvendo furto ou roubo - resposta Não
    # === ABA 1: Informações Básicas da Ocorrência ===
    Quando o usuário seleciona e clica em "Nova Ocorrencia"
    E seleciona "Quando a ocorrência aconteceu?" com a data atual
    E seleciona hora atual
    E seleciona "A ocorrência é sobre furto, roubo, invasão ou depredação?" como "sim"
    E clica no botão "Próximo"
    Então o sistema deve navegar para a próxima etapa do formulário

    # === ABA 2: Detalhes da Ocorrência ===
    Quando clica no campo "Qual o tipo de ocorrência?"
    E Selecionar tipo de ocorrencia aleatorio furto
    E Descreva a ocorrencia - Descreva a ocorrência
    E valida a existencia do texto "Importante: Esse campo não exclui a necessidade de lavratura do boletim de ocorrência"
    E valida a existencia do titulo "Unidade Educacional é contemplada pelo Smart Sampa?*"
    E valida opcoes sim e nao do Smart Sampa
    E seleciona opcao nao smart sampa
    E valida botoes anterior e proximo aba2
    E clica em Proximo
    Então o sistema deve navegar para a próxima etapa do formulário

    # === ABA 3: Informações Complementares ===
    E clica no campo do declarante
    E seleciona uma das opções disponivel de forma aleatoria com indice 0
    E clica no campo de seguranca publica
    E seleciona uma das opções disponivel de forma aleatoria com indice 1
    E clica no campo de protocolo
    E seleciona uma das opções disponivel de forma aleatoria com indice 2
    E valida botoes anterior e proximo aba3
    Então clica em proximo aba3

    # === ABA 4: Anexos e Finalização ===
    E valida a existencia do texto "Anexos"
    E localiza e clica no botão "Escolher arquivo"
    E seleciona a imagem do pc
    E clica no campo tipo documento
    E seleciona "Boletim de ocorrência"
    E localiza e clica no botão "Anexar documento"
    E Localiza o button "Anterior"
    E localiza e clica em "Finalizar"

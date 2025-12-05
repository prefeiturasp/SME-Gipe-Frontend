# language: pt

@cadastro_ocorrencias @smoke @regression
Funcionalidade: Gestão de Ocorrências no Sistema GIPE
  Como usuário autorizado do sistema GIPE
  Eu quero gerenciar ocorrências relacionadas ao patrimônio escolar
  Para que os incidentes sejam adequadamente documentados, rastreados e resolvidos

  Contexto: Acesso ao sistema com usuário autenticado
    Dado que eu acesso o sistema
    E eu efetuo login com RF

  @consulta @listagem
  Cenário: Consultar listagem de ocorrências cadastradas no sistema
    Quando o usuário está na página principal do sistema
    Então o sistema deve mostrar a listagem de ocorrências cadastradas no sistema

  @cadastro @furto_roubo @patrimonio
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
    E Selecionar "Acidentes no Transporte Escolar"
    E Descreva a ocorrencia - Descreva a ocorrência
    E seleciona "Sim, mas não houve dano"
    E clica em Proximo
    Então o sistema deve navegar para a próxima etapa do formulário
    
    # === ABA 3: Informações Complementares ===
    E clica no campo do declarante
    E seleciona GIPE
    E clica no campo de seguranca publica
    E seleciona opcao seguranca
    E clica no campo de protocolo
    E seleciona protocolo
    Então clica em proximo final

  @cadastro @ocorrencia_geral @estudante
  Cenário: Registrar ocorrência geral sem furto/roubo envolvendo estudante
    # === ABA 1: Informações Básicas da Ocorrência ===
    Quando o usuário seleciona e clica em "Nova Ocorrencia"
    E seleciona "Quando a ocorrência aconteceu?" com a data atual
    E seleciona hora atual
    E seleciona "A ocorrência é sobre furto, roubo, invasão ou depredação?" como "Não"
    E clica no botão "Próximo"
    Então o sistema deve navegar para a próxima etapa do formulário
    
    # === ABA 2: Detalhes da Ocorrência ===
    E clica no campo "Qual o tipo de ocorrência?"
    E Selecionar "Acidentes no Transporte Escolar"
    E clica fora para fechar dropdown
    E clica no Campo "Quem são os envolvidos?*"
    E seleciona "Apenas um estudante"
    E clica no campo "Descreva a ocorrência*"
    E preenche com "Esse aluno, acabou causando pânico e medo nos alunos"
    E clica em opcao "Não"
    E clica em "Proximo"
    Então o sistema deve navegar para a próxima etapa do formulário
    
    # === ABA 3: Informações Complementares ===
    E clica no campo do declarante
    E seleciona GIPE
    E clica no campo de seguranca publica
    E seleciona opcao seguranca
    E clica no campo de protocolo
    E seleciona protocolo
    Então clica em proximo final
    
    # === ABA 4: Anexos e Finalização ===
    E valida a existencia do texto "Anexos"

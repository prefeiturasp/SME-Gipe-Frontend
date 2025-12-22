# language: pt

@complement_dre @dre
Funcionalidade: Gestão de Intercorrências - Perfil DRE
  Como usuário com perfil DRE (Diretoria Regional de Educação)
  Eu quero acessar e complementar intercorrências registradas
  Para analisar e encaminhar ocorrências escolares da minha região

  Contexto: Autenticação no sistema
    Dado que eu acesso o sistema como DRE
    E eu efetuo login com RF DRE
    E estou na página principal do sistema

  @skip @login @validacao @smoke
  Cenário: Validar autenticação e acesso ao dashboard
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema
    E devo ver o título "Intercorrências Institucionais"
    E o sistema deve exibir as funcionalidades disponíveis para DRE

  @complemento @preenchimento @critico
  Cenário: Complementar informações de intercorrência registrada
    Quando eu visualizo uma ocorrência registrada
    Então devo visualizar todos os campos do formulário de ocorrência
    E devo ver o botão "Próximo" para continuar
    Quando eu clico no botão "Próximo"
    Então devo visualizar o formulário de continuação da ocorrência
    E devo preencher os campos de interlocução obrigatórios
    E devo preencher os campos complementares das interlocuções
    Quando eu finalizo o preenchimento
    
    # MODAL DE CONCLUSÃO (se aparecer)
    Então sistema pode exibir modal de conclusão
    E preencho modal de conclusão se necessário
    
    # RETORNO AO HISTÓRICO
    Então devo retornar para o histórico de ocorrências
    

    
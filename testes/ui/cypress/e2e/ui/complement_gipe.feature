# language: pt

@complement_gipe @gipe
Funcionalidade: Gestão de Intercorrências - Perfil GIPE
  Como usuário com perfil GIPE
  Eu quero acessar e complementar intercorrências registradas
  Para analisar e gerenciar ocorrências da região

  Contexto: Autenticação no sistema
    Dado que eu acesso o sistema como GIPE
    E eu efetuo login com RF GIPE
    E estou na página principal do sistema

  @skip @login @validacao @smoke
  Cenário: Validar autenticação e acesso ao dashboard
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema
    E devo ver o título "Intercorrências Institucionais"
    E o sistema deve exibir as funcionalidades disponíveis para GIPE

  @complemento @preenchimento @critico @fluxo_completo
  Cenário: Complementar detalhes DRE e GIPE de intercorrência registrada
    
    Quando eu valido os campos da tabela de ocorrências
    E eu visualizo uma ocorrência registrada de forma aleatória
    
    # ABA 1 - FORMULÁRIO INICIAL
    Então devo visualizar todos os campos do formulário aba 1
    E devo ver o botão "Próximo" para continuar
    Quando eu clico no botão "Próximo"
    
    # ABA 2 - DETALHES DRE
    Então devo visualizar o formulário da aba 2 DRE
    E devo preencher os campos de interlocução DRE obrigatórios
    E devo preencher os campos complementares DRE
    E devo ver o botão "Anterior" na aba 2
    Quando eu clico no botão "Próximo"
    
    # ABA 3 - DETALHES GIPE
    Então devo visualizar o formulário da aba 3 GIPE
    E devo preencher os campos GIPE obrigatórios
    E devo selecionar opções aleatórias nos campos GIPE
    E devo preencher os campos complementares GIPE
    E devo ver o botão "Anterior" na aba 3
    Quando eu clico no botão "Salvar informações"
    
    # MODAL DE CONCLUSÃO
    Então sistema exibe modal com titulo "Conclusão de etapa"
    Quando preenche campo motivo encerramento com "Complementação GIPE concluída com sucesso"
    E clica em Finalizar modal
    Então valida mensagem de sucesso no modal
    E clica no botão Fechar modal
    E aguarda 20 segundos
    Então valida a existencia do Texto "Histórico de ocorrências registradas"

